# Auralis Wars

Versión 0.5.0: adaptación web isométrica con los dibujos y las animaciones del archivo de preservación de Social Wars. Amplía tu base por sectores en un archipiélago de 100 × 100, programa producción, mejora instalaciones, entrena tropas y combate contra IA. Partida local independiente e instalación PWA.

**No es el cliente original completo.** Se conserva la simulación Auralis (28 familias de edificios e infraestructura, 33 tropas, mejoras de diez niveles, 12 bases de IA y tres dificultades). Sus costes, desbloqueos, misiones y diplomacia son adaptados. Los aspectos originales evolucionan por etapas; no hay diez dibujos distintos para cada edificio.

- Juego: https://oscard0823.github.io/auralis-wars/
- Fuente gráfica: https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822
- [Procedencia, licencia y reconstrucción](ASSET-CREDITS.md)
- npm test: simulación y compatibilidad de guardado.
- npm run check: módulos, rutas y caché.
- scripts/qa-ui.mjs: construcción, tropas, combate, móvil, guardado y modo sin conexión.
- scripts/qa-upgrades.mjs: selección y mejora de edificios en la interfaz.

La vista isométrica usa Canvas 2D y atlas WebP. Los archivos 3D anteriores permanecen como fuente histórica y no se cargan ni se almacenan en la caché del juego actual. Las partidas de 0.1.0 conservan su clave y sus IDs.

## Desarrollo

Node 22. Sin instalación de paquetes: `npm run dev`. Antes de publicar, ejecuta `node scripts/package.mjs`, `npm test` y `npm run check`. Las Pages se publican desde dist/ mediante GitHub Actions.

## Trabajadores y experiencia

Abre Obreros (Wars) o Colonos (Empires). Cada partida tiene tres civiles controlables. Puedes seleccionarlos en el mapa, arrastrar un recuadro o usar su ficha. Marca un recurso o usa Buscar madera / Buscar oro o piedra. Recogen hasta 20 materiales y los transportan al almacén o edificio principal; solo entonces se abonan. Los depósitos son finitos y dejan suelo construible al agotarse. Puedes detener y reasignar trabajadores, ver sus rutas y contratar más con una cola de 18 segundos y límite de alojamiento.

Las reservas llenas y los caminos bloqueados conservan la carga. Los civiles se refugian durante el combate y descansan al cerrar el juego. Los productores y las colas continúan hasta ocho horas sin conexión.

La estrella del comandante muestra experiencia y próximos requisitos. Se utilizan los umbrales de 100 niveles del archivo de preservación; los requisitos de equipo se adaptan a los diez niveles del edificio principal de Auralis. No se presenta como la economía original íntegra. Los planos y tropas nuevos requieren ambos niveles; se conservan los edificios y ejércitos existentes.

Las partidas 0.1 y 0.2 se migran sin reemplazar recursos, edificios o tropas. `scripts/qa-workforce.mjs` comprueba selección por sprite, extracción y entrega reales, contratación, importación antigua, móvil y modo sin conexión. `tests/workforce.test.mjs` cubre conservación de materiales, rutas, almacenamiento y migración.

## Mapa original, revisión y rendimiento

El [atlas y códice](https://oscard0823.github.io/auralis-wars/archive.html) permite consultar 24 mapas de 100 × 100 y 778 fichas del archivo. La base jugable ya usa el archipiélago original de 100 × 100, con ampliación por sectores y puentes. Los doce ataques de campaña mantienen sus escenarios Auralis de 32 × 32. No se incorpora automáticamente todo el catálogo. El índice incluye 3.199 archivos de recursos, 1.387 archivos AS3 y 63 comandos. Las estadísticas públicas de 166 edificios y 303 unidades del sitio actual se conservan separadas.

- [Revisión del motor y comportamiento del mapa](docs/SOCIAL-WARS-ANATOMY.md)
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

El catálogo adaptado todavía no equivale a los 778 objetos, capítulos, eventos y habilidades completos del original. Las alianzas y adversarios son IA local; no hay multijugador.
