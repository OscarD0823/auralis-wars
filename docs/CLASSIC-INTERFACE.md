# Interfaz de Social Wars en Auralis 0.9

La interfaz toma como referencia las capturas conservadas del mapa y de la tienda del juego original, junto con las clases estáticas `GUI.GuiManager`, `GUI.IconPanel`, `GUI.FriendsWindow` y `GUI.ZoomSlider`. Las capturas pertenecen a la revisión anterior de la partida de prueba; no representan una nueva sesión ni el progreso reciente del usuario.

## Elementos implementados

- Barra superior compacta con los cuatro recursos, sus imágenes originales, capacidad, experiencia y estrella del comandante. El nivel y las cantidades proceden de la partida local.
- Accesos laterales ilustrados a Campaña, Metas y Operación. Conservan las 23 operaciones, los encargos y los objetivos del rescate.
- Herramientas inferiores con selector, Construir, Ejército, Obreros y Mundo. El botón de construcción, los iconos y la textura remachada provienen del archivo gráfico original.
- Tienda con marco militar, pestañas ilustradas, tres columnas en escritorio, fichas de edificios con imagen, función, coste, requisitos y botón de construcción. Se conservan los catálogos, filtros, planos recuperados y mejoras.
- Franja de guarnición con retratos, grados y cantidades de las tropas realmente presentes. Pulsar un retrato selecciona ese tipo de tropa y centra la cámara en el grupo. «Seleccionar todas» reúne la guarnición para dar órdenes en el mapa. El espacio social del original se adapta a esta función individual mientras el multijugador está pausado.
- Deslizador vertical de zoom, botones de acercar y alejar, centrado y desplazamiento. La escala logarítmica permite recorrer desde la vista del archipiélago hasta las tropas.
- Objetivo del rescate y contador de la próxima base sobre el mapa, sin cambiar el plazo de tres horas reales ni el estado de la operación.
- Adaptación a pantallas pequeñas: recursos y experiencia en dos filas, guarnición desplazable, herramientas táctiles y tienda de dos columnas. Los paneles y diálogos se desplazan dentro de la pantalla.

El mapa mantiene sus gráficos, navegación y simulación. La partida local usa la misma clave y formato. No se añaden cobros, dinero premium, anuncios, vecinos ficticios ni servicios multijugador.

## Procedencia y reconstrucción

`source-data/social-wars/interface.json` fija la revisión del archivo, SHA-256 de `Basesec_1.5.4.swf`, ID de cada bitmap exportado y SHA-256 de los 31 archivos PNG. Se copiaron los PNG exportados estáticamente con JPEXS, sin alterar sus píxeles ni ejecutar el SWF.

Para regenerar los recursos desde la exportación local conservada:

```sh
python scripts/prepare-hud.py RUTA_A_SOCIAL_REFERENCES
node scripts/package.mjs
npm run check
```

Los bitmaps suman aproximadamente 619 KiB y entran en la caché inicial. Se reutilizan las miniaturas existentes de tropas y edificios; el cambio de interfaz no incorpora modelos, otro motor ni un bucle adicional de renderizado. La actualización de miniaturas agrupa los contenedores pendientes en un solo fotograma, evitando que una actualización de la guarnición cancele las imágenes de la tienda o del diálogo.

## Verificación

`qa-classic-hud.mjs` comprueba actualización desde caché 0.8, conservación de partida, imágenes originales cargadas, selección de la guarnición y orden de detener, deslizador de zoom, categorías, miniaturas tras refrescar el HUD, 23 operaciones, encargos, rescate, ajustes y dificultad. Comprueba 320, 390 y 768 px, dos tamaños horizontales y reapertura sin conexión. `qa-ui.mjs` cubre construcción real, entrenamiento, mejoras de tropa, despliegue, combate y regreso a la base. `qa-home-cycle.mjs` verifica el rescate y el contador con la versión vigente del paquete.

## Acceso al sitio de referencia

El 21 de octubre de 2026, el controlador del navegador integrado falló antes de ejecutar cualquier interacción («failed to write kernel assets», error de ruta 3). Tras reiniciarlo, el error persistió. Una visita normal desde un navegador aislado devolvió HTTP 403 Forbidden; la apertura web tampoco pudo acceder al sitio. No se eludió el bloqueo, no se presentó el formulario de registro y no se creó una cuenta. Por ello no existe un archivo de credenciales de esta visita. La implementación visual utiliza las referencias conservadas descritas arriba.
