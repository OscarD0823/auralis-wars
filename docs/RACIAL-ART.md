# Identidad visual por raza · 0.13.0

La elección de Aurora, Kharun, Nébari o Arca cambia la arquitectura, los obreros y las 33 unidades del catálogo Auralis. No altera IDs, estadísticas, recursos, colas, niveles o edificios existentes. Las unidades especiales del catálogo preservado mantienen sus siluetas y animaciones originales; no se presentan como 307 nuevos modelos.

## Dirección y archivos

| Raza | Arquitectura | Población y ejército |
|---|---|---|
| Aurora | [Atlas propio de 0.12](../dist/auralis/buildings.png): piedra clara, cubiertas azul petróleo, metal militar | [Actores](../dist/auralis/races/aurora-actors.png): humanos, uniformes de lona y blindajes de acero |
| Kharun | [Arquitectura](../dist/auralis/races/kharun-buildings.png): basalto, cobre, contrafuertes y forjas | [Actores](../dist/auralis/races/kharun-actors.png): cuerpos robustos, barbas, equipo remachado y vehículos pesados |
| Nébari | [Arquitectura](../dist/auralis/races/nebari-buildings.png): arcos, cubiertas curvas, piedra clara y latón | [Actores](../dist/auralis/races/nebari-actors.png): anfibios turquesa, aletas, armaduras y cascos curvos |
| Arca | [Arquitectura](../dist/auralis/races/arca-buildings.png): módulos de titanio, grafito y núcleos violetas | [Actores](../dist/auralis/races/arca-actors.png): autómatas articulados y maquinaria de paneles cerámicos |

Se conservan 64 diseños arquitectónicos base, 16 por raza. Los cuatro nuevos atlas de actores contienen 120 imágenes: 24 poses de personaje y seis vehículos por raza. Los edificios del catálogo se asignan a familias funcionales; no son 412 edificios únicos con diez modelos nuevos cada uno. Las fábricas de tanques y misiles usan la familia de taller, evitando su anterior aspecto de cuartel genérico.

## Movimiento e integración

El motor continúa en Canvas 2D con arte isométrico de volumen prerenderizado, no mallas 3D giratorias. Cada raza dispone de trabajador, infantería, soldado pesado, apoyo médico/mecánico, buggy, tanque, artillería, helicóptero, avión y barco. Los tipos avanzados comparten familia y conservan su nombre, estadísticas y habilidad.

Caminar alterna dos pasos y la postura de transición; extraer alterna herramienta levantada y golpe; combatir alterna apuntado, disparo y recuperación. El apoyo usa su escáner. La pose de carga mantiene el saco o maletín visible con oscilación de marcha. Los vehículos tienen oscilación de marcha, retroceso, estelas y rotor según su familia. Los cadáveres giran y desaparecen durante el intervalo existente. Estas hojas tienen una vista de tres cuartos que se refleja horizontalmente; no incluyen ocho vistas completas ni articulación esquelética.

Los recortes se calculan sobre alfa real y se anclan a los pies, en lugar de centrar el arma o la herramienta. La selección utiliza la máscara alfa del fotograma y respeta el reflejo y el desplazamiento del ancla. Las sombras de contacto, orden de profundidad, ocultación por edificios, selección, navegación y niebla siguen activos.

La misma apariencia llega al mapa, retratos de guarnición, obreros, catálogo, entrenamiento y vistas de mejoras. Una entidad con facción usa su raza; los rivales sin facción usan el equipo humano de Aurora. Los asentamientos capturados mantienen su arquitectura local. Elegir Nébari no convierte al Clan Risco Férreo en Nébari.

## Demostración y rendimiento

Cada tarjeta racial ofrece una vista en un escenario aislado antes de la elección permanente. La base avanzada permite comparar las cuatro razas mediante el selector. Cambiar esa vista reconstruye únicamente el escenario de prueba. Volver restaura el objeto de partida principal y no adopta la raza de la demostración.

La guarnición avanzada se distribuye sobre suelo libre y sus barcos sobre agua; las unidades no aparecen dentro de edificios. La apariencia no modifica las posiciones guardadas de una base real.

Los PNG raciales se cargan bajo demanda, con solicitudes compartidas entre mapa y retratos. No se descargan los siete atlas al instalar el service worker. Todas las hojas suman menos de 50 MiB decodificados, dentro del presupuesto gráfico existente de 96 MiB. La descarga completa opcional conserva todas las razas para uso sin conexión. El terreno sigue almacenándose únicamente para la pantalla visible.

## Generación, procedencia y validación

Modo: herramienta integrada `image_gen`, con fondo transparente. Se copian los siete PNG finales al repositorio sin modificar sus píxeles. Aurora reutiliza su arquitectura propia previa. `scripts/prepare-racial-atlas.py` sólo lee alfa y escribe [metadatos de recorte](../dist/auralis/races/atlas.json); requiere Pillow para regenerarlos. El navegador no necesita Python.

Los prompts finales completos y las rutas de cada PNG están en [auralis-racial-art.json](../source-data/auralis-racial-art.json). La referencia de las tres arquitecturas fue el atlas propio de Aurora, usado para cámara, categorías y escala. Las hojas de personajes se generaron como recursos nuevos. Se descartaron dos resultados Nébari que conservaban un fondo opaco; el PNG integrado tiene alfa transparente.

Validación: 237 pruebas de simulación, guardado, propiedad visual, integridad de recortes, asignación de funciones, demostraciones, navegación de barcos y carga diferida; comprobación de módulos, rutas y caché. Revisión de escritorio y móvil en Edge, selección/órdenes, las cuatro apariencias, catálogos y regreso a la base real.
