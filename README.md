# Auralis Wars

Versión 0.10.1: adaptación web isométrica con dibujos y animaciones del archivo de preservación de Social Wars. Incluye 22 operaciones de historia y un asedio semanal con escenarios originales de 100 × 100, niebla de guerra, transporte naval, habilidades, eventos y expansión procedural con colonias de IA. Partida local independiente e instalación PWA. Multijugador y funciones sociales pausados.

El catálogo incorpora 412 familias de edificios/objetos y 307 tipos de actores militares o de misión, además del obrero civil. Los 29 edificios y 33 tipos militares Auralis permanecen como catálogo inicial; las instalaciones preservadas aparecen según la tienda y los planos recuperados. No todos los objetos son comprables ni todas las unidades se entrenan. Los edificios tienen diez niveles y las tropas cinco grados. Los aspectos originales evolucionan por etapas, según las variantes disponibles.

El motor, el equilibrio, los eventos y las habilidades son adaptaciones Auralis. Se utilizan posiciones y matrices originales de las misiones disponibles, con reglas de objetivos implementadas en el nuevo motor. No se ejecuta el ActionScript ni se reproduce íntegramente cada delegado, cinemática o servicio social del cliente original.

- Juego: https://oscard0823.github.io/auralis-wars/
- Fuente gráfica: https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822
- [Procedencia, licencia y reconstrucción](ASSET-CREDITS.md)
- npm test: simulación y compatibilidad de guardado.
- npm run check: módulos, rutas y caché.
- scripts/qa-classic-hud.mjs: interfaz original, selección de tropas, zoom, móvil, actualización de caché y recursos sin conexión.
- scripts/qa-ui.mjs: construcción, tropas, combate, móvil, guardado y modo sin conexión.
- scripts/qa-upgrades.mjs: selección y mejora de edificios en la interfaz.

La vista isométrica usa Canvas 2D y atlas WebP. Los archivos 3D anteriores permanecen como fuente histórica y no se cargan ni se almacenan en la caché del juego actual. Las partidas de 0.1.0 conservan su clave y sus IDs.

## Prototipos, maravillas y fusión en 0.10

Área 51 y el centro robótico investigan prototipos en diez etapas. Nueve maravillas producen lotes con recogidas limitadas y restauración. La nueva cámara fusiona dos tropas y devuelve a sus participantes junto al resultado. Las fichas explican las vías de obtención, incluido Megabot por cash local o academia. Metas incorpora cinco días de premios y reservas para excedentes. La demostración organiza sus instalaciones por distritos y permite probar los nuevos procesos.

Se conservan las partidas y los lotes anteriores. La fusión usa una escala Auralis porque faltan sus potencias originales en el catálogo conservado. [Reglas, fuentes, adaptación y validación](docs/SPECIAL-PRODUCTION.md).

## Interfaz original

Barra compacta de recursos y experiencia, iconos ilustrados de misiones, textura militar, herramientas inferiores y tienda con categorías e imágenes originales. Los retratos de la guarnición seleccionan tropas reales; el zoom dispone de deslizador vertical. Se conservan la partida y las operaciones. [Implementación, fuentes y validación](docs/CLASSIC-INTERFACE.md).

## Desarrollo

Node 22. Sin instalación de paquetes: `npm run dev`. Antes de publicar, ejecuta `node scripts/package.mjs`, `npm test` y `npm run check`. Las Pages se publican desde dist/ mediante GitHub Actions.

## Trabajadores y experiencia

Abre Obreros (Wars) o Colonos (Empires). Cada partida tiene tres civiles controlables. Puedes seleccionarlos en el mapa, arrastrar un recuadro o usar su ficha. Marca un recurso o usa Buscar madera / Buscar oro o piedra. Recogen hasta 20 materiales y los transportan al almacén o edificio principal; solo entonces se abonan. Los depósitos son finitos y dejan suelo construible al agotarse. Puedes detener y reasignar trabajadores, ver sus rutas y contratar más con una cola de 18 segundos y límite de alojamiento.

Las reservas llenas y los caminos bloqueados conservan la carga. Los civiles se refugian durante el combate y descansan al cerrar el juego. Los productores y las colas continúan hasta ocho horas sin conexión.

La estrella del comandante muestra experiencia y próximos requisitos. Se utilizan los umbrales de 100 niveles del archivo de preservación; los requisitos de equipo se adaptan a los diez niveles del edificio principal de Auralis. No se presenta como la economía original íntegra. Los planos y tropas nuevos requieren ambos niveles; se conservan los edificios y ejércitos existentes.

Las partidas 0.1 y 0.2 se migran sin reemplazar recursos, edificios o tropas. `scripts/qa-workforce.mjs` comprueba selección por sprite, extracción y entrega reales, contratación, importación antigua, móvil y modo sin conexión. `tests/workforce.test.mjs` cubre conservación de materiales, rutas, almacenamiento y migración.

## Mapa original, revisión y rendimiento

El [atlas y códice](https://oscard0823.github.io/auralis-wars/archive.html) permite consultar 24 mapas de 100 × 100 y 778 fichas del archivo. La base y las operaciones originales usan mapas de 100 × 100; las doce escaramuzas Auralis conservan sus campos de 32 × 32. El adaptador relaciona 777 objetos del catálogo fuente con funciones y gráficos; el registro restante describe el terreno. El índice incluye 3.199 archivos de recursos, 1.387 archivos AS3 y 63 comandos. Las estadísticas públicas del sitio actual se conservan separadas.

- [Revisión del motor y comportamiento del mapa](docs/SOCIAL-WARS-ANATOMY.md)
- [Comparación en vivo, bases avanzadas y rutas de obtención — 23 de octubre de 2026](docs/SOCIAL-WARS-LIVE-COMPARISON-20261023.md)
- [Mediciones de rendimiento](docs/PERFORMANCE.md)
- `scripts/qa-reference.mjs`: atlas, catálogo, móvil, estabilidad de menús, invalidación de cachés y descarga completa sin conexión.
- `scripts/qa-performance.mjs`: comparación reproducible del dibujo y peso inicial.

El suelo usa ahora las texturas del archivo; las tropas terrestres buscan rutas alrededor de agua y edificios. La caché gráfica se limita a la pantalla y se invalida cuando cambia el terreno o la cámara. Los gráficos adicionales se descargan al usarlos; Ajustes → Descargar juego sin conexión prepara todo el catálogo Auralis y el visor para una ausencia de red. Se conserva el formato de las partidas anteriores.

## Archipiélago y bases avanzadas en 0.5

Abre **Territorio** para comprar sectores contiguos, consultar el mapa completo o visitar una **base avanzada de demostración** sin reemplazar tu partida. La base empieza en cuatro sectores de 10 × 10; puede crecer hasta 72. El resto está reservado a escenarios enemigos. Los puentes permiten abrir rutas terrestres y los barcos se entrenan en astilleros costeros.

Las fábricas nuevas requieren elegir un lote antes de producir. Conservan los ciclos originales de 5, 60, 240 y 480 minutos, acelerados ×10 en fácil y ×3 en difícil; simulación conserva su duración. Recoge el lote antes de encargar otro. El mercado permite intercambiar recursos en lotes completos. Tanques, helicópteros, robots, aeronaves furtivas y misiles tienen instalaciones especializadas. El médico se entrena en el hospital y el ingeniero en el garaje de mecánicos.

Las bases anteriores se trasladan conservando edificios, recursos, trabajadores y terreno. Mantienen su espacio disponible y la producción continua antigua hasta programar un ciclo. Se guarda una copia previa en la clave local `auralis-wars-campaign-v1-pre-islands-v04`; exportar sigue generando un archivo independiente. Las batallas antiguas se terminan en su campo anterior.

- [Investigación de bases avanzadas, cambios aplicados y límites](docs/ADVANCED-BASES.md).
- `tests/world.test.mjs`: 17 comprobaciones nuevas, incluidas migración, expansión, lotes, mercado, puente transitable y combate naval.
- `scripts/qa-islands.mjs`: producción con temporizador real, compra de sector, demostración aislada, importación, cachés, móvil y modo sin conexión.

## Operaciones, habilidades y eventos en 0.6

Abre **Campaña → Operaciones de Social Wars**. Cada misión carga sus datos bajo demanda, conserva la exploración y ofrece tres rangos sucesivos. Hay convoyes, intercepción, centrales que protegen al mando, piezas de un supertanque, radios con apoyo aéreo, captura de barcos, rescates e infiltración con extracción. Perder tropas propias exige reentrenarlas; los aliados prestados y las invocaciones no pasan al ejército permanente. Los premios de cada rango son únicos y las reservas sin espacio se conservan para recogerlas después.

Selecciona tropas durante el combate para usar sus habilidades. Hay 15 habilidades activas y efectos de veneno, fuego, regeneración, camuflaje y ataque suicida, según el actor. **Encargos** presenta ocho eventos de isla con decisiones, recursos, apoyo y bonificaciones. Sus plazos se pausan al cerrar el juego.

**Pausado desde 0.7.0 por petición del usuario.** El código del duelo WebRTC se conserva para retomarlo. Su página muestra una pausa y no inicia conexiones. Antes se accedía desde Campaña → Jugar con otra persona. El anfitrión comparte una invitación, la otra persona devuelve una respuesta y el anfitrión pulsa Conectar. Usa una copia del ejército: no arriesga ni modifica los recursos o las tropas de la campaña. Algunas redes requieren configurar un servidor TURN; GitHub Pages no proporciona matchmaking, cuentas, clasificación ni un servidor persistente.

- [Reglas de operaciones, eventos y conexión](docs/OPERATIONS-MULTIPLAYER.md).
- `tests/campaign.test.mjs` y `tests/operations.test.mjs`: objetivos, transporte, habilidades, recompensas, guardados y protocolo de duelo.
- `scripts/qa-operations.mjs`: campaña real desde la interfaz, niebla, habilidad, reanudación, catálogos, evento y móvil.
- `scripts/qa-multiplayer.mjs`: comprobación histórica de conexión WebRTC; requiere reactivar expresamente la interfaz antes de usarla.

## Expediciones y colonias en 0.7

Abre **Territorio → Explorar islas y colonias**. Busca rivales de IA con defensa 1–10 y seis biomas, desembarca bajo la niebla y elige saquear o conquistar. Puedes mantener tres puestos con guarniciones propias, diez niveles de mejora, producción y depósitos. La IA anuncia sus ataques; puedes dirigir la defensa y recuperar un puesto perdido. Las tropas coloniales siguen ocupando población y sus bajas son permanentes.

Construye rutas marítimas o aéreas desde terminales operativas, despacha carga y recógela al llegar. Los excedentes se conservan. Las estaciones cambian la paleta del terreno siguiendo el calendario de la partida. Ajustes ofrece una copia local de recuperación sin reemplazar el guardado rápido. El multijugador, cuentas, chat, visitas sociales y conquista PvP quedan pausados; los anuncios requieren un proveedor aprobado.

- [Reglas, alcance y límites de esta entrega](docs/EXPEDITIONS.md).
- [Análisis de la conversación aportada](docs/SOCIAL-ONLINE-REVIEW.md).
- `scripts/qa-expeditions.mjs`: exploración, guarnición, suministros, móvil, guardado y modo sin conexión.

## Corrección del archipiélago en 0.7.1

Se corrigen las franjas de agua que la migración del mapa antiguo de 32 × 32 insertaba dentro de la isla. El terreno dibujado y las rutas usan la misma costa; se conservan el inventario, edificios, tropas y recursos de las partidas anteriores.

La base incorpora la estación espacial, el astillero civil y el puerto avanzado neutrales, junto a los 51 objetos del primer capítulo del archipiélago: nueve enemigos y 42 estructuras o elementos. **Territorio → Localizar enemigos y preparar el rescate** permite encontrar y combatir las patrullas sobre el mapa de casa. Sus daños persisten, las bajas propias son permanentes y el premio es único. Estas instalaciones neutrales se pueden inspeccionar; no se añaden como fábricas propias.

- [Fuentes, reglas y límites de la comparación](docs/HOME-MAP.md).
- `tests/homeland.test.mjs`: costa, compatibilidad, presencia y huellas de objetos, combate, retirada y validación.
- `scripts/qa-home-map.mjs`: píxeles del terreno, selección de patrullas, reanudación, móvil y caché sin conexión.

## Rescate, patrullas y bases en 0.8

La llave y la prisión ya tienen interacciones por proximidad. Liberar a cuatro soldados inicia un contador real de tres horas, que continúa al cerrar el juego. Después aparece un asentamiento sobre otro plano original, con un mando que destruir u ocupar. Las patrullas independientes recorren sectores desocupados y pueden combatirse durante la espera sin reiniciarla. Las pérdidas y daños persisten; los rescatados sin alojamiento esperan plaza.

La IA patrulla, concentra fuego, flanquea y se repliega. Academias, mando, depósitos y casas tienen efectos en el reclutamiento con reservas limitadas. Los muros y torres protegen accesos. Las misiones con guion conservan sus objetivos. La caché antigua se actualiza guardando la partida, incluida una operación en curso; no hace falta borrar el guardado para corregir la franja de agua.

- [Reglas, fuentes y límites](docs/HOME-MAP.md).
- [Inventario por plano, edificio, enemigo y puente](docs/HOME-MAP-INVENTORY.md).
- `scripts/prepare-home-map.py`, `scripts/audit-home-map.mjs`: extracción estática y auditoría reproducible de cuatro planos.
- `scripts/qa-home-cycle.mjs`: actualización desde caché 0.6, interacciones, reloj real, soldados, siguiente base, móvil y recarga sin conexión.
- `tests/home-strategy.test.mjs`: ciclo completo, patrullas y decisiones tácticas/logísticas.
