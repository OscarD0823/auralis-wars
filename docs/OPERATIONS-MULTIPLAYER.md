> Estado 0.7.0: multijugador pausado por petición del usuario. La página no carga la conexión. Las instrucciones de duelo siguientes quedan como documentación para una futura reactivación.

# Operaciones y duelos en 0.6

## Fuente y adaptación

La fábrica `Quest.as` del archivo fijado registra 22 misiones de historia disponibles y una semanal. `scripts/prepare-campaign.py` conserva sus identificadores, matrices, entradas y 9.662 objetos en `source-data/social-wars/missions.json` y genera 23 archivos compactos en `dist/missions/`. No se inventaron capítulos para huecos de numeración sin una misión disponible. Los escenarios se descargan cuando se preparan o al solicitar la descarga completa sin conexión.

`campaign.js` adapta sus objetivos al motor Auralis: comandante, radio, convoy aliado, piezas, convoy enemigo, central y mando, transporte naval, cohete, laboratorios, información, rescates, criaturas y asedio. La intercepción conserva el recorrido del camión hacia el este y luego al norte. Los puentes convierten su casilla final en una huella de cinco casillas. Los decorados y depósitos proceden de los objetos del escenario; no se añade naturaleza aleatoria sobre ellos.

La niebla usa celdas de 5 × 5: las tropas revelan la zona cercana, los edificios descubiertos se recuerdan y los enemigos móviles requieren visión actual. Se guardan exploración, reservas, pasajeros, objetivos, recargas y tiempo. Las aeronaves permanecen en casa en las misiones que las excluyen. La infiltración especial utiliza un agente prestado. La muerte de un transporte destruye también a sus pasajeros; las bajas propias son permanentes.

Cada capítulo ofrece tres rangos, desbloqueados en orden. Los rangos aumentan resistencia y premios. Cada premio sólo se concede una vez; el asedio renueva su recompensa semanalmente según semanas Unix. Las instalaciones capturadas pueden desbloquear planos y determinadas victorias conceden una unidad recuperada, sin duplicarla en cada repetición. Los materiales sin espacio quedan en reserva.

## Catálogo y habilidades

El adaptador incluye 469 registros de edificios/objetos fuente y 308 actores, con variantes agrupadas en familias. El juego expone 411 familias de edificios/objetos y 307 actores de combate/misión más el obrero. Compra, entrenamiento, producción, almacenamiento, población, defensa y decoración utilizan sus relaciones y propiedades. Las recetas sin equivalente completo reciben una función logística Auralis. Las unidades sin fábrica son recompensas o actores de misión, no una compra universal. Los objetos ausentes del archivo gráfico se identifican como tales en vez de atribuirles un dibujo inventado.

Las 15 habilidades son bombardeo, apoyo aéreo, inspiración, camuflaje, reparación, botiquín, EMP, blindaje, drones, mina, carga, multiláser, absorción, vórtice y torbellino. Exigen un especialista seleccionado, alcance, visión, materiales y recarga. El apoyo aéreo requiere radio y gasta cargas. Las invocaciones caducan y no aumentan el ejército permanente. Veneno, fuego, regeneración y ataque suicida complementan las acciones básicas. Son reglas adaptadas, no una ejecución automática de todos los delegados AS3 de cada unidad preservada.

## Eventos de la isla

Convoy, supervivientes, ingenieros, reconocimiento enemigo, transmisión, alijo, médicos y actividad solar aparecen durante la sesión. Ayudar tiene costes y efectos verificables; dejar pasar no cobra. Una avanzada crea una defensa real. Los plazos y las bonificaciones se desplazan durante la ausencia para que el jugador no reciba una penalización por cerrar la página. Las recompensas se acreditan una sola vez y el historial conserva 30 entradas.

## Duelo entre dos personas

1. Abre `multiplayer.html`, escribe tu nombre y crea una invitación.
2. La otra persona abre la misma página, pega la invitación y devuelve su código de respuesta.
3. El anfitrión pega la respuesta y pulsa Conectar. Ambos pueden seleccionar, mover, mantener posición y avanzar atacando. Destruir el mando decide el duelo; hay un límite de 20 minutos.

Se usa un canal WebRTC cifrado, con simulación del anfitrión y estados enviados al invitado. Las órdenes se comprueban por dueño, coordenadas y secuencia. Los ejércitos tienen hasta 32 unidades y 200 plazas. Se limita el tamaño de mensajes y la acumulación de datos. La desconexión pausa el duelo. La campaña se lee para crear una copia; esta página no escribe su guardado. El anfitrión puede iniciar revancha.

El intercambio manual de códigos sustituye al servicio de señalización. STUN intenta conexión directa; redes con NAT restrictivo pueden necesitar TURN configurado por el jugador. Las credenciales TURN no se guardan. No hay servidor de cuentas, matchmaking, clasificación persistente o mercado entre jugadores. Un anfitrión controla su propia simulación: este modo amistoso no ofrece las garantías de un servidor competitivo autoritativo.

Documentación técnica: [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels), [conectividad WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity), [conexiones y TURN](https://webrtc.org/getting-started/peer-connections), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Verificación

Las 117 pruebas de simulación cubren la compatibilidad anterior y los nuevos objetivos, bajas, transporte, habilidades, eventos y duelo. Las comprobaciones de navegador ejercitan carga, niebla, habilidad activa, guardado, retirada, búsqueda, recompensas y tres anchos móviles. La prueba multijugador conecta realmente dos contextos separados mediante invitación/respuesta; comprueba una orden del invitado procesada por el anfitrión, desconexión y guardados intactos. No sustituye una prueba entre redes geográficas o proveedores NAT distintos.
