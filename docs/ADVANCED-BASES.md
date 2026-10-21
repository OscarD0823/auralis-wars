# Bases avanzadas: referencia y aplicación en 0.5

Investigación del 20 de octubre de 2026. Se contrastaron capturas históricas indexadas con el cliente AS3 y las partidas de ejemplo del archivo público fijado. Las capturas con cantidades modificadas de dinero no se usaron como referencia de precios o progresión.

## Qué distingue una base desarrollada

El ejemplo público [General_Mike_30.json](https://github.com/AcidCaos/socialwarriors/blob/c3fceeb1f8e93734a293b9bc25ae6025656f6822/villages/General_Mike_30.json) describe una base de nivel 40, 25 sectores y 436 objetos. Incluye 187 tramos de muros de tres variantes, torretas, búnkeres, varias academias de tanques y hangares de helicópteros. Los 436 objetos también incluyen tropas, recursos y elementos del escenario; no son 436 edificios construibles. Su identidad e inventario no se incorporaron a Auralis.

Las capturas históricas de [Fotos, febrero de 2013](https://eujogosocialwars.blogspot.com/2013/02/fotos.html) y [misión 9](https://eujogosocialwars.blogspot.com/2013/02/bug-na-missao-9.html), localizadas mediante búsqueda de imágenes, muestran bases militares densas, defensas en capas, industrias, máquinas grandes y aeronaves. El navegador no pudo recuperar esas páginas completas durante esta revisión. Los datos verificables de tamaño, reglas y precios proceden del archivo preservado, no de estimaciones sobre esas imágenes.

El crecimiento ocurre dentro de un archipiélago de 100 × 100 casillas. La base empieza en cuatro sectores de 10 × 10. `Base.as` distingue 72 sectores de expansión y 28 reservados; la posición de un edificio en Flash indica la última casilla de su huella. Por eso los puentes de 5 × 5 se trasladan restando cuatro a sus coordenadas antes de usarlos en el motor Auralis. Sin esa conversión aparecen pasos desconectados de las orillas.

## Aplicación jugable

- **Territorio:** la base utiliza `MAP_PLAYER_1`, las 30 superficies originales y los nueve puentes del escenario. El menú muestra los 100 sectores; compra contigua, precio en oro del archivo y oscurecimiento del territorio no adquirido. Se omiten requisitos de vecinos, cash y capítulos, adaptándolos a una partida local.
- **Industria:** cuatro fábricas con lotes de 5, 60, 240 y 480 minutos y multiplicadores 0,25 / 1 / 2 / 3. Fácil acelera diez veces; difícil, tres; simulación mantiene la duración. Cada lote se completa una sola vez y requiere recogida. Cantidades por nivel y economía general siguen el equilibrio Auralis.
- **Instalaciones:** 28 familias, incluidas academia de tanques, hangar de helicópteros, búnker, fortaleza con entrenamiento, centro robótico, mercado, instalación furtiva, fábrica de misiles, astillero y puentes. Cada una dispone de una función de producción, combate, entrenamiento, comercio o navegación.
- **Ejército:** 33 tropas militares. Nueve añadidas: tanque III, Dominator, helicópteros II/IV/V, lanzallamas, mortero, Zodiac y navío. Mecánicos y médicos se forman en sus servicios respectivos. Las variantes aéreas del archivo conservan el vuelo; los barcos usan una cuadrícula de agua.
- **Puentes:** restauración de pasos rotos y construcción entre dos orillas. Pagan materiales, ocupan una cuadrilla y abren paso al terminar. Las aeronaves atraviesan el agua y los barcos navegan bajo los pasos sobre su superficie acuática.
- **Mercado:** lotes completos, inventario y capacidad comprobados antes del intercambio y límite de 20 operaciones cada 20 horas. Es comercio local, con precios Auralis.
- **Órdenes en la base:** selección de tropas o grupos y movimiento por rutas. En campaña, los barcos se despliegan desde el mar del este y las tropas terrestres desde la franja occidental. Las incursiones contra tu base utilizan su mapa de 100 × 100.
- **Demostración:** Territorio → Visitar base avanzada abre un escenario independiente con 25 sectores, instalaciones desarrolladas y las 33 tropas. El guardado de la base principal permanece intacto; volver o recargar recupera esa base. Su distribución se diseñó para Auralis; no es una reproducción exacta de la partida de ejemplo.

## Compatibilidad y límites

La migración conserva terreno y espacio construible de una partida antigua mediante un parche de 32 × 32 dentro del archipiélago. Traslada edificios, trabajadores, cargas, órdenes y depósitos sin cobrar ampliaciones. El navegador conserva además la copia anterior en `auralis-wars-campaign-v1-pre-islands-v04`. Una batalla antigua mantiene su campo de 32 × 32 hasta terminar. Las fábricas antiguas conservan su producción continua hasta que el jugador programa un ciclo.

En 0.5 los doce ataques de campaña conservaban sus escenarios Auralis de 32 × 32 y los otros diseños se consultaban en el atlas. La versión 0.6 añade operaciones jugables, catálogo ampliado, habilidades, eventos y duelo entre personas; sus reglas y límites se describen en [OPERATIONS-MULTIPLAYER.md](OPERATIONS-MULTIPLAYER.md). No se ejecuta el backend social original ni todos sus delegados. El agua utiliza el código de superficie 0; las variantes de costa se representan con sus texturas.

## Reconstrucción y comprobación

`python scripts/prepare-content.py` prepara metadatos desde los índices incluidos. `python scripts/prepare-world-data.py RUTA_REFERENCIAS` prepara mapas, precios y puentes; requiere `wars-initial.json` del archivo fijado. `prepare-sprites.py` convierte solamente los recursos que falten. El paquete añade 39 recursos gráficos y 664 fotogramas: 123 recursos y 2.584 fotogramas en total, además de las 30 superficies.

`tests/world.test.mjs` comprueba expansión, migración, ciclos, conservación de lotes, mercado, fábricas, puente transitable, barcos y partidas antiguas. `scripts/qa-islands.mjs` prueba la interfaz con un ciclo real de 30 segundos, compra de sector, demostración aislada, importación, cachés, móvil y recarga sin red. Las pruebas existentes siguen comprobando construcción, entrenamiento, combate, bajas, mejora, obreros y animación por píxeles.
