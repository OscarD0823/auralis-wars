# Expediciones y colonias — 0.7.0

**Acceso:** Territorio → Explorar islas y colonias. También desde Campaña → Explorar islas procedurales.

Esta entrega implementa la expansión individual del análisis `SOCIAL-ONLINE-REVIEW.md`. La base, los sectores originales y las 23 operaciones siguen disponibles. Las conexiones entre jugadores y las nuevas cuentas, visitas sociales, chat, ayudas y conquista PvP quedan pausadas por petición del usuario. `multiplayer.html` muestra el estado de pausa y no carga WebRTC. Se conserva su código para retomarlo posteriormente.

## Reconocimiento y conquista

- El reconocimiento cuesta `25 + 10 × defensa elegida` de oro. Permite elegir defensa 1–10 y cualquiera de seis biomas: bosque templado, tropical, desierto mineral, tundra, volcánico y humedales.
- Cada búsqueda utiliza la semilla de la partida y un contador persistente. La semilla, el bioma y la versión 1 del generador reproducen el mismo mapa después de guardar. No se almacenan miles de casillas por isla ni se sustituyen matrices clásicas.
- Mapas lógicos de **100 × 100**: costa variable, islotes, río, paso construido y un corredor terrestre garantizado. Se usan las texturas costeras originales. Los minerales, árboles, agua y edificios afectan la navegación. No son mapas del tamaño de GTA ni terreno geológico multicapa.
- Desembarco terrestre y naval separado. La radio de desembarco conserva visibilidad local; las tropas descubren el resto. Las órdenes de avanzar y atacar, movimiento, formación, habilidades y bajas utilizan el motor RTS existente.
- Victoria: destruir el mando y todas las defensas armadas antes de 15 minutos. Las instalaciones económicas no tienen que arrasarse. Saquear entrega materiales sin propiedad; conquistar establece un puesto nivel 1. Reservas y supervivientes vuelven al ejército. Las bajas son permanentes.
- Máximo tres colonias propias, con registro acotado de puestos perdidos. Un puesto perdido puede reconquistarse; el ejército de la base principal nunca se transfiere al enemigo. Abandonar necesita retirar la guarnición y resolver transportes pendientes.

## Guarniciones y defensa

Trasladar una unidad consume diez petróleo por punto de población y conserva su identidad, grado y salud. Cada puesto admite 32 unidades. La población colonial sigue contando en la capacidad total, también durante una visita o una defensa. El traslado de guarnición es una operación inmediata de gestión local; no simula todavía un viaje individual de cada refuerzo.

Puedes inspeccionar la isla, mover sus tropas y conservar su exploración. La visita no mezcla la guarnición con el ejército de casa. Antes de un ataque local de la IA aparece un aviso de dos minutos. Puedes dirigir una defensa real sobre el mapa. Si no intervienes, se compara la fuerza de la guarnición y sus defensas con la fuerza anunciada de la incursión. Una defensa automática ganada deja heridos; una derrota pierde el puesto, el depósito y la guarnición. El informe describe la resolución automática, sin fingir una batalla RTS ejecutada.

La base de casa conserva sus incursiones existentes. Las colonias no reciben ataques durante la ausencia; sus plazos se desplazan al recuperar la partida. No hay enemigos humanos ni conquista asíncrona online.

## Producción, mejora y suministros

Cada bioma tiene un material principal. El puesto produce `(60 + 40 × nivel)` por hora en simulación, multiplicado por tres en difícil y diez en fácil, más un ingreso secundario de oro cuando corresponde. Su depósito admite `1000 × nivel` de cada material. Las mejoras requieren recursos, dos minutos por nivel actual y mando principal superior; el límite sigue siendo diez. Mejoran depósito, ritmo y defensas. Esta extracción de puesto es una economía agregada, separada de los obreros que sí recogen y entregan recursos físicamente en la base.

Las rutas requieren una terminal de origen operativa: astillero para mar o aeródromo para aire. El estudio y los terminales cuestan 150 oro, 180 madera y 80 petróleo y necesitan 90 segundos. El trayecto marítimo lleva hasta 1500 materiales y consume 25 petróleo; el aéreo admite 750 y consume 65. El tiempo depende de la distancia de reconocimiento y del medio. Se permite un transporte pendiente por colonia. Los iconos animados en la base representan los viajes activos; no existe todavía una red ferroviaria ni simulación continua del océano entre mapas.

La carga sale del depósito al despachar, llega una sola vez y se recoge desde Expediciones. Lo que no cabe en el almacén principal permanece en el transporte. La carga que ya salió no se pierde si posteriormente cae la colonia. Producción, obras y viajes se recuperan hasta ocho horas al reabrir.

## Estaciones, guardado y rendimiento

Cuatro estaciones de treinta minutos de juego, un calendario por partida y tintes según bioma. Los desiertos y trópicos conservan su carácter; la tundra mantiene su paleta fría. El calendario actual es visual y no reduce alimentos, agua ni rendimiento. No depende de manipular el reloj civil.

Se conserva la clave y versión del guardado. Los campos de expedición son opcionales al importar partidas anteriores y se validan al cargar: semillas, inventarios, puestos, guarniciones, IDs, cargas, plazos y niebla. Guardado local cada ocho segundos y al ocultar/cerrar, más un segundo espacio de recuperación actualizado cada cinco minutos. Ajustes permite revisar y restaurar esa copia con confirmación; no es sincronización en nube. Si falla la escritura principal, la interfaz indica que no está guardado.

El generador retiene hasta 24 matrices de 20 × 20 texturas. El dibujo conserva descarte por cámara, índices espaciales y capas cacheadas; no renderiza simultáneamente todas las colonias. Semillas y cambios persistentes mantienen pequeñas las partidas. Los anuncios recompensados quedan pendientes de un proveedor aprobado; no hay un SDK de muestra concediendo premios falsos.

## Verificación

- `tests/expeditions.test.mjs`: 200 semillas, seis biomas, corredor y puente, búsqueda, ambos desembarcos, navegación real, batalla ganada con órdenes, guardado, conquista y saqueo, propiedad, población, visitas, mejoras, rutas, capacidad, defensa, reconquista, ausencia y corrupción.
- `tests/local-save.test.mjs`: frecuencia de recuperación y fallos de cuota en ambos espacios.
- `scripts/qa-expeditions.mjs`: interfaz en navegador aislado, selección de bioma, desembarco, reanudación, retirada, guarnición, carga, visita, 320/390/768 píxeles, recarga sin conexión y página multijugador pausada. Las pruebas de gestión usan una conquista de preparación; no afirman haber jugado manualmente toda una campaña.
- La suite anterior sigue validando campañas clásicas, trabajadores, construcción, navegación y protocolo conservado.
