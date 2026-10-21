# Archipiélago de la base: corrección 0.7.1

## Diagnóstico

La partida antigua usaba un campo de 32 × 32, con mar a partir de las columnas 29 y las filas 30. Al trasladarlo al archipiélago de 100 × 100 se conservaba también ese borde acuático, aunque la matriz original `MAP_PLAYER_1` tuviera suelo en esas posiciones. Por ejemplo, 66–68,45 y 51,58–59 aparecían como agua dentro de la isla. El código de navegación utilizaba el mismo borde erróneo.

La migración conserva las casillas antiguas de tierra, sus recursos y los espacios despejados; las casillas del antiguo mar utilizan ahora la costa de `MAP_PLAYER_1`. Se mantiene la compatibilidad con partidas que tenían suelo útil sobre otra superficie. La caché del suelo distingue también semilla y origen de migración. No se desplazan edificios, trabajadores o tropas ni se sustituyen las reservas del jugador.

El escenario de casa cargaba nueve puentes pero omitía los tres hitos neutrales y los elementos del capítulo inicial. La naturaleza generada no sustituye esos edificios, muros y enemigos.

## Datos restaurados

Fuentes de la revisión fija [c3fceeb1f8e93734a293b9bc25ae6025656f6822](https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822): el mapa inicial preservado y la clase `chapters.chapters.Chapter01Key`, exportada estáticamente desde el cliente. `scripts/prepare-home-map.py RUTA_REFERENCIAS` reproduce `source-data/social-wars/home-map.json` y `dist/home-map-data.js`; el JSON registra la revisión y el SHA-256 de la clase. No contiene credenciales ni inventarios de cuentas.

| Contenido | Cantidad | Comportamiento Auralis |
| --- | ---: | --- |
| Estación espacial, astillero civil y puerto avanzado | 3 | Instalaciones neutrales inspeccionables, en sus coordenadas fuente |
| Enemigos del capítulo inicial | 9 | Unidades seleccionables y combatibles sobre el archipiélago |
| Muros, defensas, prisión y otros elementos del capítulo | 32 | Obstáculos y objetivos; tres defensas armadas |
| Recursos y árboles del capítulo | 10 | Elementos del escenario con su gráfico fuente |

Son 54 elementos en total: 45 estructuras/elementos y nueve enemigos. Se usan las huellas rectangulares originales al convertir las coordenadas finales a un origen de construcción; por ejemplo, la estación ocupa 12 × 6. Tanto los obstáculos de navegación como la colocación y el dibujo respetan esa huella. Los puertos pueden extenderse sobre el mar sin convertirlo en tierra.

## Cómo jugar

Desde **Territorio**, los tres hitos ofrecen una ficha y un botón para centrarlos. **Localizar enemigos y preparar el rescate** centra un objetivo o inicia la operación. Al hacer clic en un enemigo con tropas propias seleccionadas se inicia el combate y se ordena atacar. Acercar el ejército a menos de seis casillas de una patrulla también inicia la operación; la nueva base no recibe ese asalto al arrancar.

La batalla utiliza el mismo archipiélago de 100 × 100, con sus puentes y espacios despejados. Las órdenes, colisiones y ataques se simulan con el motor Auralis. Los civiles quedan resguardados durante el combate. Se puede guardar, reanudar y retirarse; el daño causado a enemigos y estructuras persiste, y las bajas propias exigen entrenar reemplazos. Los supervivientes vuelven a sus posiciones de casa.

Vencer exige neutralizar las nueve patrullas y las tres defensas armadas. Se conceden una sola vez 650 de oro, 300 de madera, 250 de petróleo, 180 de acero y 300 de experiencia. Los materiales que no caben quedan como recompensas pendientes. No es necesario destruir cada muro neutral ni las instalaciones costeras.

## Alcance de la comparación

Se verificaron las matrices, coordenadas, propiedades y gráficos del archivo preservado. El controlador del navegador integrado falló antes de poder acceder a la cuenta que el usuario había avanzado; esta entrega no afirma haber comparado ese progreso actualizado. Los datos del archivo no representan el estado actual de esa cuenta.

Se restaura el primer capítulo de casa. No se ejecuta su ActionScript ni se portan sus cinemáticas, secuencia de llave, recompensas de rescate o capítulos posteriores íntegramente. Los enemigos se mantienen en su zona hasta el contacto; no se reproducen todas las rutas del sistema original de enemigos ociosos. Los hitos y recursos del escenario se inspeccionan, pero todavía no tienen producción propia, captura o extracción civil. Los edificios del jugador mantienen su distribución existente.

Multijugador, funciones sociales y anuncios recompensados continúan pendientes. Esta actualización no crea cuentas ni modifica partidas del sitio de referencia.

## Verificación

`tests/homeland.test.mjs` comprueba siete casos: costa lógica, cantidades y huellas fuente, migración sin sustitución del inventario, colocación y combate de casa, persistencia de daños y bajas, contacto y validación de guardados. `tests/world.test.mjs` conserva las comprobaciones de las migraciones anteriores con la costa corregida.

`scripts/qa-home-map.mjs` usa un navegador y una partida de prueba aislados. Verifica el píxel verde sobre una casilla que antes era mar incorrecto, el inventario, las tres instalaciones, la selección por la silueta de una patrulla, combate y reanudación, retirada, anchos de 320/390/768 y recarga sin conexión. Las capturas y el informe se guardan en `artifacts/`.
