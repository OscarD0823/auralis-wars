# Auralis Wars

Versión 0.3.0: adaptación web isométrica con los dibujos y las animaciones del archivo de preservación de Social Wars. Construye, recoge producción, mejora edificios, entrena tropas y combate contra IA. Partida local independiente e instalación PWA.

**No es el cliente original completo.** Se conserva la simulación Auralis (18 edificios, 24 tropas, mejoras de diez niveles, 12 bases de IA y tres dificultades). Sus costes, desbloqueos, misiones y diplomacia son adaptados. Los aspectos originales evolucionan por etapas; no hay diez dibujos distintos para cada edificio.

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
