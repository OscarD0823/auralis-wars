> Actualización 0.7.0: se implementó la expansión individual y la recuperación local. Multijugador, cuentas y funciones sociales quedan pausados por petición del usuario; nube y anuncios no se presentan como activos. Véase [EXPEDITIONS.md](EXPEDITIONS.md).

**Revisión del plan social y de conquista para Auralis Wars**

Fecha de comprobación: 21 de octubre de 2026. Base de comparación: Auralis Wars 0.6.0 y la conversación aportada en `Texto pegado.txt`. Este documento analiza la propuesta; no crea cuentas, activa facturación, ejecuta sus ejemplos ni habilita un servicio online.

La propuesta de visitas, ayudas, chat, archipiélagos y colonias conquistables es viable. La afirmación de capacidad ilimitada y coste cero garantizado de por vida no está sustentada. Se puede mantener una versión sin compras y operar un piloto en planes gratuitos, aceptando sus cuotas y la posibilidad de restringir funciones online. Recomiendo Supabase Free para ese piloto, conservando GitHub Pages como cliente y el juego local cuando no haya servicio.

**Qué existe y qué falta**

| Función | Situación en 0.6 | Ampliación necesaria |
| --- | --- | --- |
| Construcción, recursos, tropas, operaciones y niebla | Funcionan en la simulación local | Conservar el motor y sus gráficos |
| Guardado | Local, después de acciones, periódicamente y al ocultar/salir | Añadir copia privada en la nube y reconciliación entre dispositivos |
| Duelo entre dos personas | WebRTC amistoso con intercambio de códigos y copias del ejército | Mantenerlo; no acredita victorias competitivas permanentes |
| Visitar otras bases | No hay directorio social persistente | Identidad autenticada y una vista pública limitada de la base |
| Chat y ayudas | Los encargos actuales son eventos locales | Mensajes persistentes, salas, solicitudes identificadas y ayudas verificadas |
| Buscar rivales y conquistar colonias | No existe un mundo compartido persistente | Registro central de propiedad, guarniciones, ataques y resultados validados |
| Mapas personales y estaciones | La base usa el archipiélago clásico; la semilla cambia parte de los recursos | Generador nuevo versionado, biomas y calendario de juego |
| Vídeos de recompensa | No están integrados | Proveedor real, aprobación y mecanismo de recompensa apropiado |

Las misiones clásicas deben conservar sus escenarios originales. Las islas procedurales encajan como expediciones y colonias nuevas, sin sustituir las partidas existentes.

**Lo que realmente permiten los planes gratuitos**

| Servicio | Cuotas relevantes comprobadas | Consecuencia para el juego |
| --- | --- | --- |
| GitHub Pages | Sitio publicado de hasta 1 GB; transferencia con límite blando de 100 GB/mes | No es alojamiento ilimitado. Sigue siendo estático. [Fuente](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| Supabase Free | Base de datos de 500 MB; 5 GB de salida; 200 conexiones Realtime simultáneas; 2 millones de mensajes Realtime/mes | Las peticiones API sin límite de cantidad no eliminan las cuotas de transferencia, memoria, conexiones o mensajes. [Fuente](https://supabase.com/pricing) |
| Firestore gratuito | 1 GiB almacenado; 50.000 lecturas y 20.000 escrituras de documentos al día; 10 GiB de salida/mes | La capacidad depende de consultas, guardados, chat y visitas, no sólo del número de cuentas. [Fuente](https://firebase.google.com/docs/firestore/quotas) |

Las 200 conexiones anteriores son conexiones Realtime, no una garantía de 200 jugadores ni un límite de todas las visitas HTTP. Varias pestañas pueden consumir varias conexiones. Supabase también limita el caudal gratuito a 100 mensajes por segundo; no se debe transmitir por él cada movimiento de todas las tropas. [Límites de Realtime](https://supabase.com/docs/guides/realtime/limits).

Permanecer en Supabase Free evita cargos de ese plan, pero un exceso puede restringir el servicio. No basta con suponer que todo se reinicia al día siguiente: una base que supera su tamaño requiere reducir datos o cambiar de plan. El coste cero exige aceptar límites de acceso, retención y disponibilidad; no promete crecimiento ilimitado. [Control de costes](https://supabase.com/docs/guides/platform/cost-control), [restricciones](https://supabase.com/docs/guides/platform/billing-faq).

Las funciones de Firebase desplegadas requieren Blaze. Por eso Firestore Spark no proporciona, por sí solo, un lugar gratuito para ejecutar toda la validación de un combate RTS. Sus reglas pueden validar operaciones de datos, pero no sustituyen una simulación autoritativa completa. Supabase permite combinar transacciones SQL con funciones dentro de su cuota gratuita. Esta es la razón principal de mi elección, no la idea de que Supabase carezca de límites. [Requisito de Firebase](https://firebase.google.com/docs/functions/get-started).

No hay una cifra honesta de jugadores soportados sin medir las acciones reales. Propongo comenzar con un piloto de unas 50 personas conectadas como objetivo de prueba, con salas pequeñas y cupo configurable; no es una capacidad ya demostrada.

**Mediciones sobre el juego actual**

Con la semilla 341, una partida inicial serializada ocupa 3.619 bytes y la demostración avanzada de 128 edificios y 33 tropas ocupa 33.621 bytes. Una instantánea pública limitada de esa demostración ocupa 10.348 bytes. La operación 100000014 alcanza 158.105 bytes de guardado. Son ejemplos JSON sin índices, historial ni costes internos de Postgres; no permiten afirmar que cada isla ocupará 2 KB o que cabrán 200.000 colonias.

El paquete completo opcional actual ronda 275 MB; el arranque prepara unos 4 MB sin compresión de transporte. Unas 360 descargas completas nuevas, sin caché, sumarían aproximadamente 100 GB. Esto no equivale a 360 jugadores máximos: muchas personas sólo descargarán lo que vean y reutilizarán sus archivos. Sí demuestra que 10.000 descargas completas no caben en el límite blando citado. Datos del paquete: [medición local](benchmarks/0.6.0-operations.json).

**Guardado que no dependa de cerrar correctamente la pestaña**

Conservaría la frecuencia local actual, cercana a ocho segundos de simulación y después de acciones. La copia de nube puede agruparse cada cinco minutos si hay cambios, añadiendo puntos de control relevantes. El cierre sería una oportunidad adicional, nunca el único mecanismo.

Una cola persistente en IndexedDB conserva acciones pendientes y números de revisión. La interfaz debe distinguir “Guardado en este dispositivo”, “Pendiente de sincronizar” y “Guardado en la nube”, mostrando éxito remoto sólo después de la confirmación. Si se pierde internet no se puede garantizar un guardado remoto instantáneo; al volver la conexión se reintenta sin duplicar acciones.

`beforeunload` puede no dispararse, especialmente en móvil. `sendBeacon` admite cargas pequeñas, aproximadamente 64 KiB, y no permite tratar cualquier llamada autenticada a la base de datos como una copia garantizada. Una misión actual ya supera ese tamaño. Usaría `visibilitychange` como señal adicional y comprobaciones de respuesta durante la sesión. [Comportamiento del navegador](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon).

La copia privada y la economía competitiva deben ser datos diferentes. Un guardado local existente puede importarse como copia personal, pero sus cantidades editables no pueden convertirse automáticamente en oro y tropas confiables para quitar territorios a otras personas. Las acciones competitivas necesitan un perfil con saldo e inventario validados por el servicio. Así se conserva el progreso local sin presentarlo como evidencia de juego legítimo.

**Visitas, chat y botón de ayuda**

La visita descargaría sólo nombre público, disposición, aspectos y defensas visibles. El inventario privado, credenciales y datos de cuenta no se incluyen. Supabase Auth identifica al jugador; no se utiliza como identidad una cadena enviada libremente por el navegador. Las tablas expuestas requieren permisos y políticas RLS adecuados. La clave pública del cliente no debe confundirse con una clave de administración. [Permisos y RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

El chat usaría salas de unas 20–30 personas, mensajes cortos, historial paginado y límites de envío. Las entregas a varios destinatarios consumen cuota; no asumiría que el chat gratuito es ilimitado. Una solicitud de ayuda tendría un ID propio, objetivo y vencimiento. El mensaje mostraría un botón que llama a una operación validada; el texto del chat no concede recursos por sí mismo.

La ayuda se registra una sola vez por combinación de solicitud y ayudante, con límites por día, y sólo puede acelerar una obra elegible o entregar un premio definido. Reintentar una petición no debe repetir el premio. Los mensajes se dibujan como texto; el `innerHTML` del ejemplo permite interpretar contenido enviado por otras personas. Un widget o webhook de Discord no reemplaza automáticamente este sistema de botones y permisos dentro del juego.

**Islas, recursos y conquista persistente**

Cada mundo necesita semilla asignada por el servicio, versión del generador, bioma y modificaciones del terreno. Los mapas diferentes deben conservar un inicio jugable: salida accesible, recursos mínimos y rutas posibles. Se guardan cambios, no un dibujo de cada casilla. Cambiar el generador no debe reconstruir una colonia ya habitada.

Las estaciones pueden ser visuales al principio. Si alteran producción, rutas o combates, deben depender del calendario del mundo y de la hora validada del servicio. Cambiar la fecha del dispositivo no puede generar una cosecha diferente. Tampoco tiene sentido aplicar nieve universal por ser diciembre a todos los biomas.

Mantendría la propiedad de la base principal del jugador y haría conquistables las colonias de recursos. Como límite inicial propuesto, cada jugador podría mantener hasta tres colonias, ampliable tras medir consumo. Habría guarnición, producción limitada por capacidad, botín definido, protección temporal y registro de ataques.

El ciclo de conquista debe cumplir estos pasos:

1. Buscar un objetivo por rango de poder y disponibilidad, con resultados limitados. No descargar todas las bases ni exponer todos los perfiles. Los enemigos PvE básicos y máximos pueden generarse por semilla y dificultad sin consultar a todos los jugadores.
2. Iniciar un ataque autenticado: comprobar coste, tropas y protección; reservar el objetivo con vencimiento; fijar la versión de su defensa y la versión del motor.
3. Jugar el combate en el navegador y registrar órdenes. El servidor no acepta una llamada que simplemente diga que el atacante ganó.
4. Validar el resultado con un verificador confiable. Para RTS completo, evaluar repetición determinista con pasos fijos y límites de duración/unidades. Rechazar resultados sin verificar.
5. Liquidar producción y botín hasta la hora de cambio; transferir la propiedad y actualizar las bajas en una sola transacción. Dos victorias simultáneas no pueden otorgar dos dueños.
6. Transferir tropas a la guarnición de forma atómica: salen del ejército principal y entran en la colonia una vez. Retirarlas requiere comprobar quién conserva la propiedad.

La producción por tiempo transcurrido es una buena propuesta, pero su cálculo debe realizarse con reloj y estado del servidor al recoger, atacar o cambiar el dueño. No necesita un proceso por isla cada segundo; sí necesita una base de datos y cómputo confiables. No existe un servidor literalmente ausente o gratuito sin cuotas.

Una limitación que debe resolverse antes de habilitar robos reales: Supabase Edge Functions fija 2 segundos de CPU por petición, distintos de los 150 segundos de duración máxima en Free. Un verificador RTS largo podría superar ese presupuesto. Hay que medirlo en esa plataforma, limitar escenarios o diseñar otro verificador antes de prometer PvP persistente a coste cero. Hasta entonces los duelos actuales pueden seguir siendo amistosos y sin botín permanente. [Límites de funciones](https://supabase.com/docs/guides/functions/limits).

**Vídeos de recompensa**

YouTube no es una red de anuncios recompensados para este juego. Detectar el final de un vídeo no demuestra una visualización legítima ni concede una prueba de premio. No usaría recompensas para fabricar visualizaciones: su política prohíbe determinadas formas de interacción incentivada y aumento artificial de métricas. [Política de YouTube](https://support.google.com/youtube/answer/3399767?hl=en).

Existen proveedores de anuncios recompensados para navegador. AdinPlay describe ese formato; su incorporación necesita el SDK y la configuración reales del proveedor, no cargar su página principal como un script. CrazyGames requiere su integración y un entorno de publicación compatible; su SDK v2 no funciona libremente en cualquier dominio externo. [AdinPlay](https://adinplay.com/), [entornos de CrazyGames](https://docs.crazygames.com/sdk/html5-v2/intro/).

Si se incorporan, los vídeos deben ser opcionales, con límites y con recursos también obtenibles jugando. La recompensa se confirma una sola vez; un callback editable del navegador no demuestra por sí solo que hubo un anuncio válido. Para una economía competitiva habría que usar verificación de servidor cuando el proveedor la ofrezca y evaluar expresamente qué confianza permite. También se debe revisar la compatibilidad con el alojamiento: GitHub Pages impone restricciones de uso comercial. [Condiciones relevantes de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

**Los ejemplos no son código listo para producción**

Además de la confianza en el cliente, faltan autenticación efectiva, permisos, límites, transacciones y confirmaciones. Hay errores concretos: `idserial` no es el tipo de identidad estándar mostrado como si existiera; se consulta `nivel` sin crearlo; `::jsonb` aparece dentro de un objeto JavaScript; las URLs raíz de jsDelivr, YouTube y AdinPlay no son las rutas de sus SDK; varias funciones sólo muestran avisos o ni siquiera están definidas. Ofuscar JavaScript no convierte al navegador en una autoridad confiable. No ejecutaría esos fragmentos sobre una base real.

**Orden recomendado de implementación**

| Etapa | Entrega verificable | Condición para avanzar |
| --- | --- | --- |
| 1 | Perfil, copia privada en nube, estados de sincronización y visitas de sólo lectura | Dos dispositivos no sobrescriben progreso por accidente; el modo local sigue funcionando |
| 2 | Salas de chat, solicitud de ayuda y botón funcional | Mensajes seguros, permisos probados y premios no duplicables |
| 3 | Expediciones procedurales, biomas, estaciones visuales y colonias PvE | Mapas alcanzables y generación reproducible sin alterar los capítulos clásicos |
| 4 | Economía online validada, búsqueda, guarniciones y conquista entre jugadores | Verificador dentro del presupuesto, ataques simultáneos resueltos y producción liquidada correctamente |
| 5 | Anuncios recompensados opcionales | Proveedor aprobado, integración real, límites y recompensa apropiadamente validada |

La recomendación concreta es avanzar primero con Supabase Free para identidad, visitas, copias y ayudas; conservar el RTS local y los duelos WebRTC; habilitar conquista persistente sólo cuando la economía y el resultado del combate sean verificables. Si se agota una cuota, se limita el componente online y se mantiene la partida local. Esto conserva la idea de no cobrar por progresar sin prometer infraestructura infinita.
