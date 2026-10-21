# Archipiélago, rescate y estrategia en 0.8.0

## La franja de agua marcada

El campo antiguo de 32 × 32 tenía mar en las columnas 29–31 y filas 30–31. Al trasladarlo a 37,28 se conservaba ese borde sobre tierra de `MAP_PLAYER_1`. Las casillas 66–68,45 y 51,58–59 reproducían la franja interior de la captura. Desde 0.7.1 usan la costa original; el suelo dibujado y las rutas coinciden. Los espacios antiguos utilizables, materiales, edificios, tropas y lugares despejados permanecen.

La captura enviada todavía muestra la interfaz anterior, sin contador de enemigos. La actualización de 0.8 instala primero sus recursos esenciales y sustituye la caché anterior. Si había una caché antigua, renueva una vez las ventanas del juego: el manejador `pagehide` conserva su partida y su combate. Los enlaces antiguos `?v=0.6.0` pasan a la versión actual. La navegación se inicia sin bloquear la activación del nuevo trabajador de servicio. `updateViaCache: 'none'` evita reutilizar su script HTTP al buscar actualizaciones. No se borra `localStorage` ni se crea una base para reemplazar una copia dañada.

## Inventario verificable

El [inventario completo](HOME-MAP-INVENTORY.md) detalla los nueve puentes y cada familia de objetos de cuatro planos. [home-map-audit.json](../source-data/social-wars/home-map-audit.json) incluye las 551 colocaciones de esos planos, con tres hitos repetidos en cada uno, sus coordenadas fuente y de huella, tamaño, bando y función. Son 539 objetos de capítulo y tres hitos distintos. No son 551 edificios únicos disponibles en la tienda.

Fuentes: revisión fija [c3fceeb1f8e93734a293b9bc25ae6025656f6822](https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822), mapa inicial, `Chapter01Key`, `Chapter02Guille`, `Chapter03Bazooka`, `Chapter04Jeeps`, `MapInitializer.spawnIdleEnemies`, `ChapterManager.finalizeChapter` y `CountdownTimer.setTimerOgres`. `scripts/prepare-home-map.py RUTA_REFERENCIAS` registra los SHA-256 y extrae áreas y coordenadas sin ejecutar ActionScript. `node scripts/audit-home-map.mjs` regenera el inventario.

| Plano | Actores del escenario | Estructuras/elementos, incluidos tres hitos | Uso Auralis |
| --- | ---: | ---: | --- |
| 1 · Key | 9 | 45 | Llave, prisión y cuatro soldados rescatables |
| 2 · Guille | 15 | 176 | Siguiente asentamiento militar, en el suroeste |
| 3 · Bazooka | 14 | 133 | Asentamiento sobre el plano occidental |
| 4 · Jeeps | 23 | 136 | Asentamiento del noreste, incluido un actor clasificado como trabajador |

Se conservan los tamaños rectangulares. La estación espacial ocupa 12 × 6; el astillero civil y el puerto avanzado mantienen sus apoyos costeros y no convierten el mar en tierra. Son hitos neutrales inspeccionables. Las construcciones propias mantienen su distribución existente.

## Enemigos del mapa y patrullas

Los guardias del capítulo y los patrulleros de territorio son grupos distintos. La base inicial tiene nueve guardias más hasta dos grupos de `round(nivel del comandante / 5) + 5` patrulleros: diez patrulleros adicionales a nivel 1 y doce a nivel 4, cuando existen emplazamientos libres. Las familias militares cambian con el nivel; el grado aumenta gradualmente. El total visible se muestra en la cabecera.

Los grupos de sectores candidatos proceden del original: `[41,51,61,31]`, `[6,7,8,9,10,4,5]` y `[94,95,96,97,98,92,93]`. Se excluyen sectores propios y vecinos, zonas activas del capítulo, agua, obstáculos naturales y edificios. La elección y distribución se reproducen por semilla. Es una adaptación espacial: no reproduce el RNG ni toda la traducción de islas del cliente Flash. No se genera un enemigo dentro de un edificio del jugador.

Las unidades patrullan con rutas terrestres y rodean edificios/agua. Al acercar una tropa propia a menos de seis casillas empieza una operación. Los patrulleros ajenos al capítulo no cuentan como guardias de la prisión. Después del rescate se pueden combatir en escaramuzas sin volver a premiar el rescate ni reiniciar las tres horas. Sus bajas y daños persisten. Los eliminados sólo se reponen al llegar otra oleada; reabrir la página no permite farmear una regeneración instantánea.

## Rescate y siguiente base

1. Desde **Territorio → Localizar enemigos y revisar objetivos**, localiza la llave y empieza la operación. Lleva tus tropas por tierra y utiliza los puentes transitables; repara los rotos si eliges esas rutas.
2. Neutraliza los guardias próximos a la llave. Acerca una tropa a menos de seis casillas y pulsa **Recuperar la llave**. La llave persiste tras retirarte.
3. Neutraliza los guardias del capítulo y sus defensas armadas. Acerca una tropa a la prisión y pulsa **Liberar soldados**. Matar enemigos sin abrir la prisión no completa el rescate.
4. Cuatro `Soldier V`, ID fuente 1059, se incorporan una sola vez. Cada uno ocupa dos plazas. Si no caben, quedan pendientes hasta ampliar viviendas y pulsar **Incorporar rescatados**; no se pierden ni exceden la población.
5. En el momento del rescate empieza **03:00:00**, con una fecha absoluta guardada. Corre al cerrar el juego y no se acelera en fácil o difícil. Al terminar aparece la siguiente base, o espera a que concluya un combate en curso. No se simulan ataques ni bajas durante la ausencia.

El archivo antiguo configura `TIMER_OGRES_VILLAGE = 14400` (cuatro horas). El usuario observó tres horas en el sitio actual y pidió ese plazo; Auralis utiliza 10800 segundos. No se presenta esta diferencia como una observación nueva de la cuenta en vivo. El reloj es local: no equivale a tiempo validado por un servidor y puede alterarse cambiando la fecha del dispositivo.

El rescate otorga una sola vez 650 oro, 300 madera, 250 petróleo, 180 acero y 300 XP. Los excedentes quedan pendientes. Cada base posterior tiene un premio único y exige neutralizar tropas y torretas, más destruir u ocupar su puesto de mando adaptado. Una nueva espera de tres horas comienza al conquistarla. Se usan los planos 2, 3 y 4 y luego se reutilizan con grados crecientes. Antes de aparecer se comprueba su huella contra los edificios propios. Si un plano está ocupado se intenta otro; si todos lo están se espera sin reemplazar construcciones.

Las copias 0.7.1 que ya declaraban terminado el primer rescate mantienen su premio. La migración añade sus cuatro soldados pendientes y empieza la primera espera al actualizar; no inventa una hora de rescate pasada que no se había guardado.

## Función militar de los edificios

| Elemento | Efecto real |
| --- | --- |
| Muros | Obstáculos de navegación; destruir un tramo abre el paso |
| Torretas y búnkeres | Fuego con vida, alcance y recarga; sirven como cobertura para el repliegue |
| Mando adaptado | Objetivo de conquista; su destrucción interrumpe refuerzos |
| Depósitos/logística | Deben seguir operativos para habilitar refuerzos y reparaciones de defensas |
| Academias/hangares | Sólo entrenan un tipo terrestre o aéreo admitido por esa instalación, con coste real y reservas suficientes |
| Casas orcas | Seis plazas adicionales por casa operativa sobre una capacidad base de seis; limitan los refuerzos del asentamiento |
| Prisión/llave del primer plano | Interacción por proximidad y condiciones de combate; entrega de soldados y activación del reloj |
| Recursos, vegetación y decoraciones fuente | Elementos conservados del escenario; no todos tienen extracción civil implementada |
| Hitos costeros y espaciales | Inspección y emplazamiento preservado; sin producción ni entrenamiento propios todavía |

La base dispone de inventario enemigo separado. Los refuerzos consumen los recursos del catálogo de su unidad, requieren mando, logística, instalación y plazas; tienen 45 segundos entre intentos y un máximo de cuatro por asentamiento. El coste no se descuenta al jugador. Si no hay una salida válida para una unidad terrestre, no se consume; las aeronaves salen por el espacio aéreo del hangar. Una torreta fuera del contacto cercano puede recuperar cuatro puntos de vida por dos de acero por decisión; las reservas son finitas. La retirada no restablece stock ni el cupo de refuerzos. Los patrulleros externos no consumen el alojamiento del asentamiento.

## Decisiones de la IA

El comandante evalúa aproximadamente una vez por segundo; las tropas se mueven por la cuadrícula y las rutas existentes, sin teletransportarse. Reconoce enemigos cercanos que puede detectar/atacar, compara la fuerza local y asigna órdenes:

- Patrulla mientras no detecta tropas rivales.
- Intercepta y concentra fuego, priorizando apoyo, atacantes de alcance y unidades heridas.
- Busca un acceso lateral con parte de una escuadra cuando tiene apoyo y el rival está cubierto por defensas.
- Se repliega cuando está muy herido o en desventaja, aprovechando torretas cercanas o alejándose de la amenaza.
- En un asalto a la base del jugador, prioriza producción y mando en lugar de elegir siempre el edificio más próximo.

Se aplica al archipiélago, escaramuzas, incursiones y expediciones. Los convoyes, objetivos y personajes de misiones con guion mantienen su controlador. Es una IA táctica por reglas; no se presenta como un modelo entrenado o un sistema multijugador.

## Límites y acceso al sitio de referencia

No se ejecuta el ActionScript ni el backend del sitio. Los planos posteriores se utilizan como asentamientos; sus cinemáticas, secuencias de personajes, reparaciones de jeeps, bazucas y recompensas narrativas no están portados íntegramente. La secuencia inicial adapta el rescate, sin reproducir todos los ayudantes y diálogos. Las patrullas avanzadas no portan todas las ramas aleatorias de criaturas del original. Las batallas de casa siguen siendo operaciones del motor Auralis.

El controlador del navegador integrado falló antes de acceder al sitio, y la petición directa devolvió HTTP 403. No se creó otra cuenta ni se generó un archivo que fingiera contener credenciales válidas. La comparación se hizo con los archivos de preservación y la captura del usuario; no se afirma haber inspeccionado la cuenta en vivo ni su progreso actualizado.

Multijugador, funciones sociales y anuncios recompensados continúan pausados.

## Comprobaciones

`tests/homeland.test.mjs`, `tests/home-strategy.test.mjs` y `tests/world.test.mjs` verifican costa, inventarios, huellas, navegación, interacción, población, premios únicos, migración, plazo exacto en las tres dificultades, tiempo sin conexión, aparición aplazada, protección de edificios propios, patrullas y decisiones/costes de IA.

`qa-home-map.mjs` comprueba la franja en una base antigua de nivel 4, conservación de materiales y tropas, píxeles verdes frente al antiguo mar, selección por silueta, batalla, retirada, móvil y modo sin conexión. `qa-home-cycle.mjs` instala una caché 0.6 de prueba, verifica la recarga con batalla conservada y ejecuta los clics de llave/rescate, cuatro soldados, reloj, reanudación y otra base. Para esta prueba aislada, la llegada del soldado a la prisión se prepara en una segunda copia de prueba; no se afirma que ese script recorra todo el camino. La navegación completa tiene comprobaciones independientes. Los informes y capturas se guardan en `artifacts/`; ninguna prueba modifica la partida real del usuario.
