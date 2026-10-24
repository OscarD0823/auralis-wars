# Referencias y procedencia gráfica

Social Wars: https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822

La versión 0.6 contiene 734 películas compartidas convertidas y 32.148 fotogramas únicos, con 767 correspondencias del catálogo que disponen de gráfico y diez películas fuente ausentes. JPEXS FFDec 26.4.0 convierte estáticamente los SWF. Los WebP mantienen transparencia, orientación y secuencias; no contienen un fondo rectangular añadido. `dist/classic/atlas.json` identifica URL, nombre, ID, fotogramas y familia. `source-data/social-wars/graphics-missing.json` documenta los diez recursos no conservados; su marcador es un SVG propio identificado expresamente, no arte atribuido al original.

El código del proyecto de preservación está publicado bajo GPL-3.0. Se conserva su licencia en LICENSE. El arte de Social Wars pertenece a Social Point y a sus titulares originales; la licencia del código no se presenta como una cesión de las marcas o del arte comercial. Esta adaptación no está afiliada al juego original. El aviso MIT del código previo de Auralis se conserva en LICENSE-AURALIS-MIT.

La versión web usa un motor Canvas propio; no distribuye ni requiere un reproductor Flash. La economía, las 12 escaramuzas, las alianzas de IA y la progresión son Auralis. Las 23 operaciones utilizan escenarios y objetos de misión preservados, con objetivos adaptados al nuevo motor. Habilidades, eventos y duelo WebRTC tienen implementaciones propias; no son una reproducción íntegra de todos los delegados o servicios del cliente original.

## Reconstrucción

Python 3 con Pillow, Java 17+ y [JPEXS FFDec](https://github.com/jindrapetrik/jpexs-decompiler/releases/tag/version26.4.0). Define `FFDEC_JAR` con la ruta a ffdec.jar; opcionalmente `JAVA` con el ejecutable. Ejecuta, en orden, `prepare-archive.py`, `prepare-sprites.py`, `optimize-atlases.py`, `finalize-archive.py`, `split-animations.py` y `node scripts/package.mjs`. Los primeros cinco son scripts Python de `scripts/`. Las fuentes se descargan de la revisión fija de arriba y no se ejecuta su ActionScript. La conversión completa requiere varios GB temporales; los fotogramas de `.reference-cache` son regenerables. Los IDs y parámetros están en `source-data/`.

La versión 0.3 añade PICAR para los civiles y BARRIL para los trabajadores de Wars, extraídos de las mismas películas. progression-data.js deriva los umbrales y requisitos de la configuración de esa revisión.

## Terreno y análisis en 0.4

Se convirtieron los 30 fotogramas del símbolo `TerrainTiles` (ID 50) de `assets/sprites/terreno.swf`, en la misma revisión fijada. `dist/classic/terrain/manifest.json` identifica cada superficie; `scripts/prepare-terrain.py` reproduce la conversión a WebP. El atlas de referencia utiliza los 24 diseños de `managers/MapManager.as` exportados estáticamente de `Basesec_1.5.4.swf`. No son modelos 3D: son películas vectoriales 2D.

`source-data/social-wars/assets.json` conserva el inventario completo del árbol, sin descargarlo íntegramente al jugador. `live-codex.json` contiene sólo nombres y parámetros públicos observados en la guía de https://wars.fbgamesweb.com/como-jugar el 20 de octubre de 2026. No se copió su bundle JavaScript como motor de Auralis. Véase docs/SOCIAL-WARS-ANATOMY.md para el alcance y las diferencias.

## Instalaciones y flota en 0.5

Se añadieron 39 recursos gráficos y 664 fotogramas para academias de blindados, hangares de helicópteros, búnkeres, fortalezas, centro robótico, mercado, instalación furtiva, fábrica de misiles, hospital avanzado, mecánicos, astilleros, puentes y nueve unidades. La correspondencia por nivel se conserva en `source-data/classic-import.json`. `scripts/prepare-content.py` reproduce los metadatos de entrenamiento y producción sin sustituir las estadísticas de combate Auralis.

`scripts/prepare-world-data.py RUTA_REFERENCIAS` prepara la matriz del archipiélago, precios, ciclos y puentes a partir de los índices y `wars-initial.json` del mismo archivo fijado. Convierte las posiciones de los puentes desde su casilla final a su origen de huella. No se distribuyen identidades ni inventarios de las partidas de ejemplo. Véase [la investigación de bases avanzadas](docs/ADVANCED-BASES.md).

## Operaciones y animaciones en 0.6

`prepare-campaign.py RUTA_REFERENCIAS` genera las 22 misiones de historia y la semanal desde la fábrica AS3 y los JSON de misión del mismo archivo. Se conservan 9.662 objetos y sus referencias fuente. `prepare-archive.py` compila relaciones de entrenamiento y propiedades; sus funciones y equilibrio adaptados se distinguen del catálogo fuente.

Las animaciones estándar utilizan cinco orientaciones por acción. Se mantienen marcha, ataque y muerte, además de extracción/transporte del civil. Los clips especiales posteriores a MUERTE no se interpretan como direcciones adicionales de muerte. Las celdas tienen un máximo de 256 píxeles; se conserva su proporción y escala sobre el mapa. `split-animations.py` genera 4.138 tiras por acción/dirección y reutiliza las de marcha para la pose de reposo. El juego carga esas tiras, no películas completas en memoria. Las películas completas permanecen como resultado de conversión y se excluyen de la descarga sin conexión para evitar duplicados.

## Escenario de casa en 0.7.1

`prepare-home-map.py RUTA_REFERENCIAS` extrae los tres hitos neutrales del mapa inicial y los 51 objetos estáticos de `chapters.chapters.Chapter01Key` de la misma revisión fijada. `source-data/social-wars/home-map.json` conserva el SHA-256 de la clase exportada. Se reutilizan los gráficos ya convertidos; no se incorporan datos privados de cuentas ni se ejecuta el cliente del sitio de referencia. Las reglas de rescate son una adaptación Auralis descrita en [HOME-MAP.md](docs/HOME-MAP.md).

## Planos y patrullas en 0.8

Se añaden las coordenadas y áreas estáticas de `Chapter02Guille`, `Chapter03Bazooka` y `Chapter04Jeeps`, junto al primer plano. El archivo fija la revisión y el SHA-256 de cada clase. Los sectores y la fórmula inicial de las patrullas proceden de `MapInitializer.spawnIdleEnemies`; la colocación y el equilibrio se adaptan al motor Auralis. Se reutilizan los gráficos ya convertidos, sin nuevas descargas del sitio ni nuevos datos de cuentas. `audit-home-map.mjs` documenta cada instancia, origen de huella, tamaño, bando y función. Las posiciones no se presentan como una implementación de todas las cinemáticas y delegados de los capítulos.

## Interfaz en 0.9

Se incorporan 31 bitmaps de la GUI de `Basesec_1.5.4.swf`, exportados estáticamente desde la misma revisión fija de Social Warriors. No se alteran sus píxeles. `source-data/social-wars/interface.json` identifica el SWF, cada ID exportado y su SHA-256; `prepare-hud.py RUTA_REFERENCIAS` reproduce la copia. Los marcos adaptables, disposición DOM, órdenes de guarnición y control de zoom son código Auralis. Véase [CLASSIC-INTERFACE.md](docs/CLASSIC-INTERFACE.md). Se mantiene la atribución y el alcance de derechos del arte indicados al principio.

## Piezas de colecciones en 0.11

`dist/interface/collectibles.png` conserva sin modificar `assets/images/collectibles3.png` de la revisión fija citada arriba. Las celdas se recortan por CSS; no se redibuja ni se atribuye su arte a Auralis. La configuración de diez colecciones y cincuenta piezas se conserva en `source-data/social-wars/collections.json`; `scripts/prepare-collections.mjs` genera los datos públicos con sus IDs y premios. Véase [implementación y límites](docs/COLLECTIONS.md).

## Arquitectura e iconos Auralis en 0.12

`dist/auralis/` contiene arte propio: dieciséis diseños arquitectónicos base creados con la herramienta integrada de generación de imágenes, treinta iconos de interfaz, cuatro emblemas y una lámina de cincuenta piezas vectoriales propias. Los edificios del juego usan esas familias; los puentes se dibujan con geometría propia. Las tropas y la naturaleza conservan los recursos preservados. Los archivos anteriores permanecen como referencia con sus créditos. [Archivos, integración y prompt final](docs/ART-DIRECTION-0.12.md).

## Apariencias de civilización en 0.13

Se añaden tres atlas arquitectónicos y cuatro atlas de actores originales, generados con la herramienta integrada: 48 diseños arquitectónicos adicionales y 120 poses/vehículos. Aurora reutiliza el atlas arquitectónico propio de 0.12. Los PNG se conservan con su alfa sin modificar sus píxeles. `scripts/prepare-racial-atlas.py` lee el canal alfa y produce sólo metadatos de recorte y anclas. La animación, selección por alfa y efectos de movimiento se ejecutan en el motor Auralis. Las unidades especiales del archivo mantienen sus recursos y atribución. [Archivos y prompts finales](docs/RACIAL-ART.md).

## Heráldica propia en 0.13.1

Doce emblemas SVG propios dibujados como vectores editables en `dist/heraldry.js`: cuatro civilizaciones y ocho clanes. `scripts/prepare-heraldry.mjs` genera los archivos, y `prepare-own-icons.mjs` lo invoca para conservar el resultado al regenerar la interfaz. No utilizan imágenes del juego comercial ni generación raster.
