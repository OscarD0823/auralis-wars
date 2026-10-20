# Auralis Wars

Juego de estrategia militar del ecosistema Auralis, inspirado en el ciclo de bases, producción y ejércitos de Social Wars, con progresión de edificios y centro de mando al estilo de Clash of Clans. Implementación web original, sin Flash.

[Jugar en GitHub Pages](https://oscard0823.github.io/auralis-wars/) · [Auralis Empires](https://oscard0823.github.io/auralis-empires/) · [Ecosistema Auralis](https://oscard0823.github.io/Pagina-Principal/)

## Primera versión 0.1

- Base 3D con cámara giratoria, zoom, selección y colocación sobre terreno. Las unidades son modelos en el mundo, con sombras y animación; las miniaturas se generan a partir del mismo modelo.
- 18 edificios funcionales y diez niveles: mando, viviendas, minas, aserradero, petróleo, acero, almacenes, cuarteles, academia, fábrica, hangar, laboratorio, torres, misiles, muros, hospital, diplomacia y taller de ingenieros.
- Producción acumulada y recogida manual, capacidad de almacén, costes y obras temporizadas. Dos constructores; los talleres añaden cuadrillas. El mando limita las mejoras; la progresión exige instalaciones y ofrece un 20% de descuento si todos los edificios están al nivel de la etapa.
- 24 tipos de tropa: infantería, especialistas, vehículos, artillería, helicópteros, drones, bombarderos y tecnología avanzada. Entrenamiento secuencial por fábrica, capacidad de ejército y cinco grados de investigación por tropa.
- Doce objetivos de campaña con reconocimiento, despliegue, órdenes de movimiento/ataque, selección múltiple y grupos de teclado. Daño, curación de apoyo, blindaje, ataques de área, objetivos aéreos y asedio. Las bajas son permanentes; reservas y supervivientes regresan tras retirarse.
- Incursiones contra la base, defensas automáticas, edificios dañados y reparación. El mando y la mina de oro tienen reconstrucción de emergencia para poder recuperarse tras una derrota.
- Tres dificultades, ocho encargos con recompensas y tres facciones de IA para pactos de suministros. Botín y estrellas persistentes; las victorias repetidas entregan el 25% del botín.
- Guardado local independiente, exportación/importación validada, colas y producción durante hasta ocho horas de ausencia. Las batallas permanecen pausadas mientras se cierra el juego. Web instalable y recursos locales para jugar sin conexión tras la descarga inicial.

Es una primera versión jugable contra IA local. GitHub Pages aloja archivos estáticos: no hay cuentas, visitas de amigos ni multijugador en servidor. No reproduce todo el catálogo, eventos o economía del juego comercial original.

## Desarrollo y pruebas

Se requiere Node.js 22 o posterior. No se necesitan dependencias npm para ejecutar el juego o el motor.

```sh
npm test
npm run check
npm run dev
```

`PORT` permite cambiar el puerto local. `node scripts/package.mjs` actualiza el manifiesto instalable y la lista de archivos sin conexión. La acción de GitHub publica `dist/` en Pages después de las pruebas y comprobaciones. `scripts/qa-ui.mjs URL` verifica la interfaz con Playwright en el entorno de desarrollo.

Motor de simulación en `dist/engine.js`, catálogo en `dist/catalog.js`, identidad en `dist/config.js`, interfaz en `dist/ui.js` y escena en `dist/scene.js`. Cada repositorio contiene su propia copia y puede evolucionar de manera independiente.

## Referencias y recursos

Se tomaron como referencia la [guía pública de Social Wars](https://wars.fbgamesweb.com/como-jugar), el [proyecto de preservación de Social Empires](https://github.com/AcidCaos/socialemperors) y los conceptos de progresión de bases de Clash of Clans. No se incorporó código GPL del proyecto de preservación ni archivos gráficos, clientes, logotipos o sonidos de los juegos comerciales.

El renderizado y varios modelos originales derivan de Auralis Frontier, con licencia MIT. Los personajes y materiales seleccionados de Quaternius son CC0 y Three.js es MIT. Véase [ASSET-CREDITS.md](ASSET-CREDITS.md). El código de Auralis Wars se distribuye bajo [MIT](LICENSE).

Las pruebas del motor incluyen 34 casos. La comprobación gráfica recorre 180 modelos de edificio y 48 variantes de tropa, además de controles y guardado en móvil y escritorio. Para ejecutar las pruebas de navegador en otro entorno, instala Playwright (`npm install --no-save playwright` y `npx playwright install chromium`); `PLAYWRIGHT_MODULE` y `PLAYWRIGHT_CHANNEL` permiten usar un runtime existente.
