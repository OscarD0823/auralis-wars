> Actualización 0.11.0: [colecciones, piezas de botín y almacén de premios](COLLECTIONS.md). Las secciones históricas inferiores conservan la fecha de su revisión original.

# Social Wars: motor, mapa y catálogo

Revisión: 20 de octubre de 2026. Esta revisión distingue la partida observada, la inspección estática del cliente y las funciones implementadas en Auralis. Indexar una función o una película no significa haberla ejecutado ni reproducido.

La [comparación del 23 de octubre](SOCIAL-WARS-LIVE-COMPARISON-20261023.md) añade una cuenta nueva comprobada en Edge, una compra y recompensas verificadas, imágenes de bases avanzadas y diferencias de obtención pendientes. El catálogo público observado ese día se conserva por separado en `source-data/social-wars/live-guide-20261023.json`, sin datos de cuenta.

Desde 0.10.0, [producción especial](SPECIAL-PRODUCTION.md) implementa centros de diez etapas, nueve maravillas con cargas y fusión adaptada, con compatibilidad de guardado.

## Fuentes y alcance

- Sitio observado: https://wars.fbgamesweb.com/. Se revisaron la base, el desplazamiento del mapa, la tienda, defensas, ampliación, menús de mundo y bloqueos por nivel, además del códice público completo. La cuenta de prueba estaba en nivel 1. El acceso a combates contra otros jugadores mostró el requisito de nivel 8: no se eludió. No se probaron todos los eventos ni misiones de niveles superiores.
- Guía pública: https://wars.fbgamesweb.com/como-jugar. Se extrajeron del DOM las estadísticas de sus 166 edificios y 303 unidades; `source-data/social-wars/live-codex.json` conserva únicamente ese catálogo público, sin información de cuentas o conversaciones.
- Archivo fijado: [AcidCaos/socialwarriors, c3fceeb1f8e93734a293b9bc25ae6025656f6822](https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822).
- Cliente estático analizado: `assets/flash/Basesec_1.5.4.swf`, 4.542.821 bytes. Se exportaron e indexaron 1.387 archivos AS3 y 8.768 métodos. La inspección detallada se concentró en Config, Base, MapManager, MapInitializer, IsoTerrain, IsoEngine, IsoBuilding, IsoUnit, AStar y los delegados principales. No es una revisión manual línea por línea de los 1.387 archivos.
- Backend del archivo: `server.py`, `engine.py`, `command.py`, `get_game_config.py`, `get_player_info.py` y `constants.py`. Se indexaron 63 comandos.

Los archivos del servidor preservado y sus fuentes AS3 se analizaron localmente en `Social-References/wars-analysis/`. El repositorio Auralis incorpora índices reproducibles y los datos necesarios; no incluye contraseñas, sesiones, partidas ajenas ni una copia del JavaScript del sitio en funcionamiento.

## Las tres capas del motor

| Capa | Evidencia | Función |
| --- | --- | --- |
| Cliente preservado | Config, Base, IsoEngine, IsoElement, IsoBuilding, IsoUnit | Cuadrícula, selección, cámara, órdenes, combate, producción y estados visuales |
| Datos y guardado | config/main.json; partida inicial; servidor Flask | Catálogo, requisitos, recursos, expansión, inventario, colas y persistencia |
| Sitio actual | Bundle público observado de 4,75 MB | Contiene clases del cliente, una capa compatible con objetos de visualización Flash, bibliotecas JSON y paquetes de imágenes/formas |

El cliente del sitio actual arranca con `scaleMode: "showAll"`, `preloadVectors: false`, un límite de concurrencia de 32 y `/extracted_src/assets/main/library.json`. Su bundle referencia `images.pack`, `shapes.pack` y `/api/game/`. Esto es evidencia del código público, no prueba de que su backend sea idéntico al Flask del archivo. La solicitud externa de `library.json` devolvió 403; no se intentó sortear ese control. Para convertir el arte se empleó el archivo público fijado.

El servidor preservado ofrece configuración, información del jugador y lotes de comandos. Sus comandos incluyen comprar, mover, orientar, recoger, entrenar, mejorar, ampliar, almacenar, investigar, terminar misiones y ataques. También existen rutas sociales, ofertas y administración. Su mera presencia no confirma que todas las funciones estén completas o sean adecuadas para exponerlas en Auralis.

## Cómo es y cómo se comporta el mapa

`core/Config.as` fija 100 × 100 casillas y rombos de 108 × 54 píxeles. `IsoTerrain` dibuja texturas que cubren 5 × 5 casillas; `MapManager` utiliza matrices de 20 × 20 códigos gráficos. Las expansiones son sectores de 10 × 10 casillas. La partida inicial posee los sectores 35, 36, 45 y 46; su centro de mando está en (51, 41).

No es un mapa continuo de dimensiones GTA ni un generador procedural ilimitado. Es una cuadrícula finita con diseños de islas y escenarios, sobre la que aparecen elementos y amenazas. Se extrajeron 24 diseños definidos en MapManager y los 30 fotogramas de `TerrainTiles` de `assets/sprites/terreno.swf`: mar, césped, costas, esquinas y playas.

Los tipos de terreno registrados son tierra, puente, playa y agua. La inicialización del mapa marca las superficies de agua y sus bordes. La textura de una costa no basta por sí sola para decidir todos los permisos de una unidad: intervienen el terreno lógico y las propiedades del actor.

- La cámara transforma coordenadas de casilla a píxel, admite desplazamiento y zoom. No mueve las entidades al cambiar la vista.
- Un edificio ocupa su anchura y altura completas. La colocación, el paso y las posiciones de interacción dependen de esa huella.
- `AStar` mantiene ocupación, terreno permitido y regiones conectadas. Las tropas terrestres admiten tierra, playa y puente; las propiedades acuáticas y aéreas cambian las reglas. El cliente limita una búsqueda a 50 ms.
- Los sectores propios se dibujan con color normal; los disponibles se oscurecen. La expansión comprueba la contigüidad y puede bloquearse por capítulos. La tienda observada pedía 2.500 de oro y un vecino, o cinco cash, para la siguiente expansión.
- `MapInitializer` genera recursos, objetos perdidos, animales y enemigos según las zonas. El entorno puede cambiar por extracción, construcción, destrucción y avance de capítulos.
- El mapa de misión y el selector de mundos tienen progresión y restricciones; no son sinónimos de la base del jugador. Un menú de misión bloqueado no se consideró probado.

El [atlas web](../dist/archive.html) permite recorrer esos diseños originales y probar conectividad. Sus rutas de demostración utilizan BFS sin edificios ni enemigos; no son una ejecución del A* original. Desde 0.5, la base jugable utiliza el archipiélago original de 100 × 100 y ampliaciones contiguas. Los doce ataques de campaña conservan escenarios Auralis de 32 × 32; los otros diseños del visor aún no sustituyen todos los capítulos.

## Para qué sirve cada familia

| Familia original | Función comprobable en datos o código | Diferencia actual en Auralis |
| --- | --- | --- |
| Centro de mando | Desarrollo de la base, entrenamiento civil y progresión | Diez niveles propios y requisitos de campaña |
| Casas | Alojamiento y capacidad de población | Capacidad y producción adaptadas; no son valores originales |
| Fábricas de oro, madera, acero y petróleo | Ciclos de producción, recogida y límites por recurso | Ciclos originales con duraciones por dificultad, cantidades por nivel adaptadas y recogida manual; partidas antiguas conservan tasa continua hasta encargar un ciclo |
| Silos | Aumento de reservas máximas | Capacidad inicial y curva de mejora adaptadas |
| Academias y cuarteles especializados | `trains_ids`, tiempos, costes y colas por edificio | Instalaciones especializadas y 33 unidades militares; recetas y progresión Auralis |
| Garajes, talleres y hangares | Entrenamiento de vehículos, máquinas y aeronaves concretos | Familias gráficas originales; recetas Auralis |
| Muros, torres, búnkeres y fortalezas | Obstáculos y defensas; algunas fortalezas también entrenan | Muros, torres, cañón, búnkeres y fortalezas con reglas de combate locales |
| Hospital, mecánicos y curadores | Reglas de curación/reparación según el actor | Hospital para supervivientes y unidades de apoyo |
| Laboratorio, centro robótico y Área 51 | Investigación o creación especial con delegados propios | Investigación de cinco grados; no se han portado todas las especialidades |
| Mercados y edificio de aliados | Comercio, aportaciones y acciones sociales | Mercado con inventario y límite de operaciones, más diplomacia de IA; sin mercado multijugador |
| Maravillas, ofertas, decoraciones y objetos perdidos | Bonificaciones, eventos, ambientación o misiones particulares | Catalogados; gran parte aún no es jugable |

Cada una de las 778 fichas conserva requisitos, coste, huella, vida, ataque, alcance, población, producción, propiedades, entrenamiento y evolución cuando existen. `type=b` reúne 469 edificios, decoraciones, recursos y otros objetos; no significa que haya 469 edificios comprables. Hay 308 unidades y un registro de terreno. `in_store=1` selecciona 166 objetos en esa configuración.

El códice público actual enumera 303 unidades. No se mezclaron automáticamente sus cifras con las del archivo: hay revisiones diferentes y varias variantes comparten miniatura. Las fábricas del original permiten elegir duración y multiplicador de recogida; la configuración incluye 5, 60, 240 y 480 minutos. Esto no equivale a la tasa continua de producción de Auralis.

## Unidades, trabajadores y animación

`IsoUnit` comprueba si un obrero puede extraer un recurso y si queda espacio en el almacén. Selección, llegada, extracción, interacción, ataque y muerte son estados distintos. `IsoBuilding` valida coste y población antes de entrenar, actualiza las colas y delega las funciones particulares. Las unidades tienen vida, velocidad, alcance, intervalo de ataque, ocupación y propiedades como vuelo, blindaje, curación o navegación acuática.

El arte original es vectorial 2D con proyección isométrica, no una biblioteca de modelos 3D. Las películas contienen jerarquías, formas, clips y secuencias. En los personajes analizados se identificaron QUIETO, ANDAR, ATAQUE, MUERTE y PICAR; el obrero de Wars también dispone de BARRIL. Hay cinco vistas fuente y reflejos para completar orientaciones. Exportar su primer fotograma como imagen fija pierde el comportamiento.

Auralis reproduce 2.584 fotogramas de 123 recursos de edificios/personajes/naturaleza, más las 30 superficies añadidas en 0.4.0. No todas las habilidades ni todas las animaciones de muerte están portadas. Las diez mejoras Auralis distribuyen las variantes gráficas existentes; no existen diez películas originales diferentes para cada edificio.

## Material extraído y cómo reconstruirlo

| Archivo | Contenido |
| --- | --- |
| source-data/social-wars/items.json | 778 registros normalizados, categorías, globales y precios de expansión |
| source-data/social-wars/catalog.csv | Tabla consultable de objetos y relaciones |
| source-data/social-wars/live-codex.json | 469 fichas públicas observadas del sitio actual |
| source-data/social-wars/assets.json | 3.199 archivos de recursos con ruta, tamaño, SHA Git y URL fijada |
| source-data/social-wars/engine-index.json | Índice de archivos AS3/métodos, hash del cliente y 63 comandos del servidor |
| source-data/social-wars/maps.json | 24 matrices originales, dimensión lógica y tamaños de sector/textura |
| dist/classic/terrain/manifest.json | Procedencia y metadatos de los 30 fotogramas del terreno |

El inventario de recursos contiene 862 películas de sprites, 1.314 miniaturas, 578 imágenes, 205 efectos, 140 sonidos, 60 clientes/versiones Flash y otros archivos auxiliares. Es un inventario verificable de todo lo localizado en el árbol fijado; no se descargaron ni incorporaron indiscriminadamente los 3.199 archivos al juego.

Para regenerar los índices, disponer de `wars-tree.json`, `wars-config.json` y la exportación estática FFDec en el directorio de referencias y ejecutar `python scripts/audit-social-wars.py RUTA_REFERENCIAS`. Convertir TerrainTiles con `python scripts/prepare-terrain.py DIRECTORIO_FOTOGRAMAS` y preparar el visor con `python scripts/package-reference.py`. El cliente original, su servidor y el bundle del sitio no se ejecutan durante este proceso.

## Cambios aplicados en 0.4.0

- Suelo y agua con texturas originales; una superficie de caché limitada al tamaño de la pantalla. Se recompone al desplazar, acercar o redimensionar.
- Índice de obstáculos naturales invalidado al despejar o mover edificios; descarte de elementos fuera de pantalla.
- Máscaras alfa reutilizadas para seleccionar por la silueta, con un máximo de 128 fotogramas cacheados.
- Navegación terrestre de combate mediante cuadrícula y rutas, con suavizado sólo si el segmento está libre. El agua y los edificios bloquean el paso; los edificios destruidos abren rutas. Los aviones conservan desplazamiento aéreo. La zona de despliegue se mantiene libre. La defensa respeta las casillas despejadas de la base y recoloca las posiciones antiguas que estaban dentro de obstáculos.
- Menús estables: el refresco periódico no reemplaza nodos cuyo contenido sigue igual.
- Caché inicial reducida, recursos cargados al usarse y descarga completa opcional con tres transferencias simultáneas. Las partidas previas conservan su clave y formato.
- Atlas y códice consultables, separados explícitamente de los objetos ya jugables.

La medición y sus límites están en [PERFORMANCE.md](PERFORMANCE.md). El sistema de islas/sectores se aplica a la base desde 0.5. La campaña, el catálogo y el duelo incorporados posteriormente se describen en la sección 0.6; encontrar los datos no equivale a ejecutar todos los delegados originales.

## Cambios aplicados en 0.5.0

La [investigación de bases avanzadas](ADVANCED-BASES.md) documenta la comparación con una base pública de nivel 40 y 25 sectores. Se aplicaron el archipiélago de 100 × 100, expansión contigua con precios del archivo, nueve puentes, construcción y reparación de pasos, 28 familias de instalaciones y 33 unidades, lotes de producción, mercado, astilleros costeros, navegación acuática y órdenes de tropas en la base. La demostración avanzada funciona en una partida aislada que no reemplaza el guardado principal.

Las coordenadas de los puentes se normalizan desde la última casilla ocupada del cliente Flash al origen de huella Auralis. La migración traslada trabajadores, materiales, rutas y edificios; conserva el terreno y las batallas antiguas. Las texturas del terreno se cargan según la vista y la naturaleza se consulta mediante sectores espaciales. Las cachés conservan el suelo mientras sólo se animan actores.

Los requisitos sociales de vecinos/cash se adaptaron a la partida local. Cantidades, tiempos de construcción, costes de puentes y estadísticas militares siguen siendo Auralis. El servidor social original no forma parte de esa versión.

## Cambios aplicados en 0.6.0

Se implementaron 22 operaciones de historia y un asedio semanal, utilizando las matrices, entradas y 9.662 objetos de los archivos de misión disponibles. La fábrica de misiones y sus clases proporcionan las reglas de convoy, intercepción, reactor, radio, transporte, rescate e infiltración; el motor Auralis las adapta con tres rangos, bajas permanentes, planos y recompensas únicas. Las islas se exploran bajo niebla; transportar tropas requiere capturar un barco y embarcar/desembarcar en una costa accesible. Se conserva el progreso al guardar y volver.

El catálogo relaciona 469 objetos y 308 actores fuente con 411 familias de edificios/objetos y 307 tipos de unidades más el civil. Las variantes nativas mantienen sus equivalencias. Los nuevos objetos tienen producción, entrenamiento, almacenamiento, población, defensa o bonificaciones según sus propiedades, con adaptación logística cuando su delegado original no tiene equivalente. Los objetos de misión no se convierten indiscriminadamente en compras. Las diez películas ausentes del árbol preservado se señalan con un marcador explícito; `graphics-missing.json` documenta sus IDs y URLs.

Se añadieron 15 habilidades activas, daño continuo, regeneración, camuflaje, apoyo, invocaciones temporales y muerte animada. Ocho eventos de isla ofrecen decisiones, recursos, rescates, defensa y bonificaciones. Son implementaciones adaptadas: no se afirma haber portado cada habilidad especial de todos los delegados AS3, sus cinemáticas o su backend.

El multijugador funciona mediante un canal WebRTC real entre dos navegadores, con invitación y respuesta manuales. El anfitrión simula las órdenes de ambos jugadores y comparte el estado. Utiliza copias amistosas del ejército y no escribe el guardado principal. GitHub Pages sirve la página estática; redes restrictivas pueden necesitar TURN. No hay cuentas, matchmaking global, mercado entre jugadores ni clasificación persistente. Véase [OPERATIONS-MULTIPLAYER.md](OPERATIONS-MULTIPLAYER.md).

La carga sigue siendo bajo demanda: no se descargan todas las unidades para abrir la base. La vista descarta sprites antes de pedir su imagen, limita la retención de texturas inactivas y reutiliza terreno, máscaras y niebla. La conversión separa las cinco orientaciones normales de los clips especiales y reduce las celdas animadas a un máximo de 256 píxeles conservando la escala visual.

## Cambios aplicados en 0.7.0

Se añade una ruta de expansión individual sin cambiar las matrices de los capítulos originales: seis biomas procedurales, rivales de defensa 1–10, desembarco terrestre/naval, niebla, estaciones visuales y hasta tres colonias propias. Los puestos tienen mejoras, guarniciones con población y bajas reales, producción, transporte marítimo/aéreo, ataques de IA y reconquista. Se conserva el guardado previo y se añade recuperación local. El multijugador y las funciones sociales quedan pausados por petición del usuario. [Reglas y límites](EXPEDITIONS.md).

## Corrección del archipiélago en 0.7.1

La migración deja de superponer el mar del antiguo campo de 32 × 32 sobre tierra de `MAP_PLAYER_1`. Se restauran los tres hitos neutrales de casa y los 51 objetos de `Chapter01Key`: nueve enemigos y 42 estructuras o elementos, incluidas tres defensas armadas. El motor respeta huellas rectangulares y permite combatir ese primer sector sobre el mismo mapa, con bajas y daños persistentes y recompensa única. Se verificó contra las fuentes fijadas; no se pudo acceder al progreso actualizado de la cuenta del sitio de referencia. [Datos, alcance y comprobaciones](HOME-MAP.md).

## Cambios aplicados en 0.8.0

Se incorporan patrullas independientes basadas en los sectores de `MapInitializer.spawnIdleEnemies`, además de los guardias del capítulo. La llave y la prisión requieren tropas cercanas y defensas neutralizadas; cuatro soldados rescatados se alojan respetando la población. El rescate activa una espera real de 10800 segundos por petición del usuario (el archivo antiguo configura 14400). Otra base aparece sobre uno de tres planos adicionales preservados, con mando, fortalezas y reservas; no reemplaza edificios propios. Las oleadas y las escaramuzas conservan bajas, daños, premios y plazos al guardar.

La IA por reglas patrulla, intercepta, concentra fuego, flanquea y se repliega, con reclutamiento y reparación limitados por logística, instalaciones, casas y stock. Se excluyen los actores de misiones con guion. El inventario registra cuatro planos, 539 objetos de capítulo, tres hitos y nueve puentes; los hitos se repiten al contar las 551 colocaciones entre planos. La caché antigua se renueva conservando el guardado. No se pudo acceder al progreso de la cuenta del sitio de referencia: el controlador de navegador falló y la petición directa respondió 403. [Reglas y límites](HOME-MAP.md), [inventario detallado](HOME-MAP-INVENTORY.md).

## Interfaz 0.9

Se implementa la distribución clásica: recursos/experiencia arriba, misiones laterales, herramientas inferiores y tienda enmarcada con categorías ilustradas. Se copian 31 bitmaps originales con huellas verificables. La guarnición local ocupa la franja de retratos y permite seleccionar tropas; el zoom vertical controla la cámara. [Alcance y verificación](CLASSIC-INTERFACE.md). El acceso de referencia de esta visita devolvió 403; no se creó una cuenta ni se atribuye a la nueva partida ninguna observación.
