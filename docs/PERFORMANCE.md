# Rendimiento de Auralis Wars 0.4.0

Medición local del 20 de octubre de 2026, Edge Chromium sin interfaz, Windows, mismo equipo y escenarios. No es una promesa de FPS o tiempo de descarga para todos los teléfonos.

## Método

`scripts/qa-performance.mjs` abre el juego con service workers desactivados, importa el mismo renderer, usa semilla 341, calienta las imágenes y toma 150 dibujos síncronos por escenario. La base tiene seis tropas y tres obreros; `army-80` coloca 80 tropas. Se mide CPU de envío del dibujo con `performance.now()`, sin forzar la finalización de la GPU. Las resoluciones son 1200 × 800 y 390 × 700. No se mide combate ni se afirma una mejora equivalente en todas las fases de simulación.

La comparación anterior es el commit 4378230 (0.3.0); la posterior corresponde al código 0.4.0. Los datos resumidos están en benchmarks/0.3.0.json y benchmarks/0.4.0.json. Las variaciones entre ejecuciones son normales; una medición preliminar posterior dio 0,60 ms en la base y la ejecución final dio 0,75 ms.

## Tiempo de dibujo

Milisegundos por dibujo; una reducción significa menos CPU para el mismo escenario, con el suelo original añadido.

| Escenario | Media anterior | Media 0.4 | Reducción | p95 anterior → 0.4 |
| --- | ---: | ---: | ---: | ---: |
| base | 3.81 | 0.75 | 80% | 8.00 → 1.60 |
| zoom-out | 4.37 | 0.83 | 81% | 7.70 → 1.70 |
| mobile | 2.03 | 0.28 | 86% | 6.50 → 0.50 |
| army-80 | 4.44 | 1.02 | 77% | 9.20 → 1.80 |

En la base, los trazos por dibujo pasan de 2.509 a siete: el suelo y sus detalles ya no se reconstruyen cada vez. La superficie estática se preparó una vez durante 150 dibujos; los obreros y las tropas siguieron dibujándose. La selección repetida por transparencia pasó de 0.749 a 0.134 ms por consulta, con las máscaras reutilizadas.

## Descargas y caché

Los recursos solicitados por la página inicial, sin el service worker, pasaron de 1,581,071 a 997,035 bytes (aproximadamente 37% menos). Se dejaron de precargar familias de edificios y unidades ausentes de la base inicial.

La instalación antigua precargaba 190 rutas que sumaban 12.002.499 bytes. La nueva prepara 40 rutas que suman aproximadamente 1,03 MB; las 227 rutas del paquete siguen disponibles bajo demanda. El peso inicial del service worker y las peticiones de arranque se solapan: **no se deben sumar esos valores como descargas independientes**. Ajustes permite descargar el paquete completo con un máximo de tres peticiones simultáneas y muestra progreso y errores.

Las imágenes de la versión instalada se sirven desde su caché; un nuevo número de versión instala un paquete de código nuevo. El juego debe incrementar su versión al publicar cambios. La búsqueda de rutas internas usa conjuntos de rutas permitidas en vez de recorrer el manifiesto completo por petición.

## Comprobaciones de conservación

- 56 pruebas de simulación: economía, bajas, construcción, colas, investigación, guardado, trabajadores y nuevas rutas.
- Interfaz real: construir, recoger, entrenar, atacar, retirarse, conservar partidas y usar 320, 390 y 768 píxeles.
- Obreros: selección por silueta, carga efectiva de 20, entrega, cambio de tarea, contratación e importación de una base antigua.
- Verificación visual de cambios de píxel en marcha, extracción y ataque; transparencia de los atlas.
- Menús conservan sus nodos durante refrescos sin cambios.
- Despejar y mover edificios invalida el índice de naturaleza; desplazar la cámara invalida el suelo. Doscientos dibujos sin cambios no regeneran esas cachés.
- Descarga completa de 227 rutas, recarga sin red, miniaturas del ejército y atlas/códice completos sin conexión.

La navegación terrestre nueva considera edificios y terreno; los aviones conservan su desplazamiento aéreo. Las rutas y las superficies cacheadas son datos temporales y no alteran el formato de guardado.

## Archipiélago jugable en 0.5

`scripts/qa-islands.mjs` añade una medición separada del mapa de 100 × 100, semilla 341, en una vista de 1000 × 700. Con las imágenes ya cargadas, 120 dibujos dieron 0,44 ms de media y 1,0 ms de p95 en este equipo. No es una comparación directa con la tabla anterior: la resolución y el escenario son distintos, y la medición no incluye toda la simulación ni espera a la GPU. El detalle se conserva en `benchmarks/0.5.0-world.json`.

La vista dibujó 99 de 677 objetos naturales. Los índices se agrupan en bloques de 10 × 10 para consultar sólo los que intersectan la cámara. Durante los 120 dibujos el terreno y el índice natural se prepararon una sola vez; al desplazar la cámara se recompuso el terreno sin reconstruir el índice. Las superficies originales se solicitan cuando entran en la vista.

La instalación inicial prepara 47 rutas, aproximadamente 1,17 MB; el paquete opcional contiene 311 rutas, aproximadamente 18,78 MB. Los 39 recursos gráficos nuevos no se precargan todos al iniciar una base. El paquete completo sigue siendo una descarga explícita desde Ajustes. Los datos de tamaño excluyen el contenido duplicado de la ruta raíz y no son una predicción de transferencia comprimida por la red.

## Catálogo completo y operaciones en 0.6

Las películas animadas se redujeron de 399,98 a 223,82 MiB al limitar celdas y retirar clips especiales interpretados incorrectamente como orientaciones de muerte. El juego utiliza 4.138 tiras más pequeñas por acción y dirección, con reposo compartiendo la primera pose de marcha. Descarta un sprite fuera de pantalla antes de pedir su imagen. Una caché de 96 MiB retira imágenes inactivas; es un presupuesto blando y puede superarse si todas las imágenes grandes siguen visibles. El terreno y las máscaras conservan sus cachés y la niebla tiene otra superficie limitada a la vista.

La instalación inicial prepara 99 rutas, 3.977.743 bytes sin compresión de transporte. El catálogo ampliado incrementa los metadatos iniciales frente a 0.5, pero no obliga a descargar sus animaciones completas. La descarga opcional prepara 5.431 rutas y 275.009.215 bytes; las películas completas se excluyen de la caché para evitar duplicar las tiras. La prueba de navegador descargó todo el paquete, recargó sin internet y abrió el catálogo y los 24 mapas. No se presupone que esa descarga sea inmediata en una conexión móvil.

`scripts/qa-operations-performance.mjs` mide 120 dibujos por escena, tras cargar los gráficos visibles, en una vista de 1000 × 700 y DPR 1. El resultado está en [benchmarks/0.6.0-operations.json](benchmarks/0.6.0-operations.json).

| Escena | Dibujo medio | p95 | Imágenes retenidas |
| --- | ---: | ---: | ---: |
| Base inicial | 0,30 ms | 0,50 ms | 18,5 MiB |
| Demostración de 33 tipos militares | 1,50 ms | 2,10 ms | 65,1 MiB |
| Operación original, entrada explorada | 0,28 ms | 0,50 ms | 65,3 MiB |

Las escenas se midieron secuencialmente en una misma instancia, por lo que la última cifra conserva parte de la caché anterior. No son cifras aisladas de memoria total del navegador ni garantías de FPS. La simulación de la primera operación dio 0,61 ms por paso en 30 pasos de prueba. La medición no espera a la GPU ni incluye toda la interfaz. Ninguna escena recompuso su terreno durante los 120 dibujos; la operación no dibujó naturaleza procedural ajena a los objetos de su archivo.

La validación actual incluye 117 pruebas de simulación y pruebas reales de interfaz para objetivos, habilidades, eventos, guardado, retirada, búsqueda, móvil y conexión WebRTC. Las comprobaciones por píxeles ejercitan marcha, extracción, carga, ataque y muerte, incluidas dos unidades grandes recuperadas del archivo. Las pruebas de duelo usan dos contextos con guardados independientes, órdenes y habilidades del invitado procesadas por el anfitrión, desconexión y conservación de las dos campañas.
