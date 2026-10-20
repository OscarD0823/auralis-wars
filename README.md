# Auralis Wars

Versión 0.2.0: adaptación web isométrica con los dibujos y las animaciones del archivo de preservación de Social Wars. Construye, recoge producción, mejora edificios, entrena tropas y combate contra IA. Partida local independiente e instalación PWA.

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
