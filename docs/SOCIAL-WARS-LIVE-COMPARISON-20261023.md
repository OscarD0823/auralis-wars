# Social Wars: comparación en vivo y bases avanzadas

Revisión: **23 de octubre de 2026**. Versión de Auralis contrastada: **0.9.0**. Esta revisión aporta observaciones y prioridades; no incorpora las mecánicas pendientes al motor.

Las prioridades de esta revisión se implementan después en **0.10.0**. [Reglas y diferencias de la implementación](SPECIAL-PRODUCTION.md). Las observaciones siguientes conservan la comparación con 0.9.0.

## Qué se pudo comprobar

Se creó una cuenta de prueba en [Social Wars de FBGames](https://wars.fbgamesweb.com/) desde Edge. Se construyó una casa, se cobró su meta y se recogió el primer bono diario. Tras recargar el juego se conservaron la sesión, la casa, los recursos y la experiencia. Las credenciales quedan exclusivamente en el archivo solicitado en el escritorio del usuario; no se incluyen aquí, en el catálogo ni en Git.

Se consultó el [códice público actual](https://wars.fbgamesweb.com/como-jugar), dos capturas históricas de bases avanzadas y el cliente preservado fijado en [AcidCaos/socialwarriors](https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822). Son tres fuentes distintas: la beta actual, partidas históricas y código archivado. Una función encontrada en el archivo no se presenta como probada en esta cuenta de nivel 1.

El nuevo [catálogo observado](../source-data/social-wars/live-guide-20261023.json) conserva **166 edificios y 303 unidades**, con nombre, costes, estadísticas y relaciones de entrenamiento visibles. Son las cifras del códice de esta beta, no un recuento universal de todas las versiones históricas. No contiene sesiones ni datos de cuentas.

## Economía inicial observada

| Paso real | Resultado visible |
| --- | --- |
| Entrada a la base nueva | 2.000 de oro, madera, petróleo y acero; 5 cash; nivel 1, XP 4/40 y población 2/20 |
| Comprar y colocar Casa I | Coste de 30 madera; madera 1.970; XP 7/40; capacidad 23 |
| Completar la meta de construir una casa | +10 oro: 2.010 |
| Cobrar el primer bono diario | +100 oro: 2.110 |
| Recargar el cliente | Casa, XP 7/40 y reservas 2.110 / 1.970 / 2.000 / 2.000 conservadas |

La ventana del bono muestra una cadena de cinco días: 100, 250, 500 y 1.000 de oro; el quinto anuncia un héroe. Solo se cobró el primer día. No se comprobaron todavía la entrega del héroe ni las reglas de interrupción de la racha. Las ventanas de compartir se cerraron sin publicar nada.

La tienda inicial mostraba una fábrica de madera I por 50 madera. Oro I y campo de maíz estaban bloqueados hasta nivel 2; silo hasta nivel 3 y acero I hasta nivel 4. Esto hace legible una secuencia de obtención: construir, obtener experiencia, desbloquear una instalación y gestionar su producción. La casa no es simplemente decoración: aumenta la capacidad.

## Qué enseñan las imágenes de jugadores avanzados

Se inspeccionaron directamente estas dos imágenes enlazadas por la [página histórica del jugador](https://socialwarspro.weebly.com/):

- [Base de nivel 62, imagen completa](https://socialwarspro.weebly.com/uploads/2/7/6/0/27604579/1858647_orig.png): población 249/250; núcleo central con varias líneas de muros y torres; industrias y hangares en filas sobre otras islas; cuatro puentes que conectan los sectores. La selección de Inca God muestra 25 recogidas restantes.
- [Combate en una base avanzada](https://socialwarspro.weebly.com/uploads/2/7/6/0/27604579/265783_orig.jpg): máquinas grandes, unidades aladas, helicópteros y efectos de disparo entre instalaciones densas. Sirve para estudiar escala, superposición y lectura del combate; la imagen no demuestra por sí sola cómo se obtiene cada unidad.

La primera captura contiene cantidades extraordinariamente altas de cash y materiales. Se usa como referencia visual y de distribución, **no** para deducir una velocidad legítima de progresión, recompensas normales o precios.

Un [testimonio de jugador de 2013 sobre centros de recursos](https://socialwarsdicas.blogspot.com/2013/02/centro-de-recurso.html) también propone concentrar fábricas y campos en dos expansiones para facilitar las recogidas. Coincide con la organización visible de las capturas: el aspecto avanzado viene de distritos funcionales, accesos y densidad, además de unidades grandes.

Aplicación al diseño de Auralis: separar industria y reservas, mantener pasillos de circulación, orientar defensas hacia puentes y accesos, dejar zonas de reunión junto a las academias y presentar las recogidas sobre su productor. La demostración avanzada actual no debe presentarse como una reproducción de aquella partida.

## Cómo se consiguen recursos, edificios y tropas

| Vía | Evidencia y límites | Situación en Auralis 0.9.0 |
| --- | --- | --- |
| Comprar y construir | Casa comprada en vivo; precios y requisitos en tienda/códice | Funciona, con costes y población adaptados |
| Producción y recogida | Cliente archivado con ciclos de 5, 60, 240 y 480 minutos; fábricas y niveles en el códice | Lotes y recogida manual implementados; dificultad acelera tiempos y cantidades propias |
| Extraer recursos naturales | Estados de trabajador y validación de recurso/reserva en el cliente archivado | Extracción, carga y entrega implementadas con reglas propias |
| Metas y bono diario | Meta +10 oro y primer bono +100 oro cobrados en vivo | Hay objetivos y eventos, pero no está reproducida esta racha diaria de cinco días |
| Academias especializadas | Códice relaciona unidades con instalaciones y costes específicos | Existe entrenamiento especializado; no equivale a portar todos los delegados originales |
| Misiones, rescates y planos | Datos y comandos del archivo; no se completó un capítulo en la cuenta nueva | Operaciones, rescates y planos implementados con reglas Auralis |
| Unidades por vías alternativas | El códice contiene dos entradas de Megabot con distinto método de obtención | Hace falta representar y explicar cada vía, conservando sus requisitos |
| Maravillas con recogidas limitadas | Contador visible en la captura; `WonderDelegate` guarda y agota las recogidas | El catálogo y el arte no equivalen a un contador de cargas funcional completo |
| Fusión y creación especial | Delegados y ventanas específicos en el AS3 preservado | No está portado el proceso completo de Soul Mixer/Atom Fusion |

### Evitar que todas las unidades parezcan productos del mismo cuartel

El códice muestra **Megabot por 6 cash** y otra entrada por **5.000 oro + 1.400 acero**, entrenable en su academia. Comparten estadísticas, pero no su vía de adquisición. El catálogo observado conserva ambas entradas: no hay que deduplicarlas únicamente por nombre.

Otros ejemplos públicos: Soldado II cuesta 60 oro + 120 acero y se entrena en Academia II; el médico cuesta 250 oro + 500 madera y corresponde al hospital de campaña. Una ficha con precio no basta para afirmar que una tropa está disponible: hay que comprobar instalación, nivel, capacidad y cualquier plano o condición especial.

### Progresión de instalaciones

El códice distingue familias y etapas concretas. Madera I se abre en nivel 1; las fábricas II aparecen en niveles 11/13/16/17 según recurso, las III en 21/24/27/30 y las IV en 34/37/39/42. Área 51 pide nivel 30; el laboratorio de investigación, 35.

Auralis utiliza diez niveles de mando y cinco grados de tropas, y adapta los requisitos del archivo. No es la misma curva. Para acercarlo al original hay que mostrar por separado nivel de comandante, etapa de instalación y requisito especial; añadir el sprite superior sin esa relación no reproduce la progresión.

### Maravillas y fusión: comportamientos reales que faltan

En `core/isoengine/delegates/buildings/WonderDelegate.as`, el cliente lee `max_collects`, persiste el contador `attrs.cl` y desactiva la producción al agotarlo. La interfaz muestra las recogidas restantes. El original también contempla reactivación por cash; eso no supone implementar compras con dinero real en Auralis.

`popups/PopupSoulMixer.as` contiene un proceso distinto del reclutamiento normal: alojar dos unidades, calcular un resultado según sus potencias y un componente aleatorio, iniciar el temporizador especial y recoger la nueva unidad sujeto a la capacidad. `IsoInteractiveElement.popAll/PopUnit` devuelve las unidades alojadas al mapa cuando hay espacio: no hay que inventar una receta que las sacrifique. La ventana comprueba también restricciones de nivel para ciertos resultados. Las recetas anecdóticas de blogs no deben tratarse como combinaciones deterministas garantizadas.

Estos hallazgos provienen de lectura estática del cliente, no de haber ejecutado la fusión en la beta actual. Tampoco se comprobó que su servidor aplique todas las mismas reglas.

## Diferencias concretas con la partida publicada

Se abrió también [Auralis Wars 0.9.0](https://oscard0823.github.io/auralis-wars/?v=0.9.0) en Edge y se inspeccionó su base inicial. La interfaz clásica, la guarnición propia y el acceso al rescate están presentes. La partida nueva comienza con 1.250 oro, 1.000 madera, 700 petróleo, 350 acero y seis soldados; el original observado empieza con otras reservas y población. No son economías equivalentes.

La extracción, lotes de producción, mercado, expansión contigua, puentes, campañas y rescates ya tienen funciones en Auralis. En cambio, **Área 51 figura como edificio de soporte sin una cola especial equivalente**. Su presencia en la tienda o el mapa no demuestra que fabrique lo mismo que el original. Lo mismo se aplica a maravillas y objetos especiales que solo tienen ficha o gráficos.

Se mantiene la decisión previa del usuario: el siguiente asentamiento de Auralis aparece tras **tres horas reales** después del rescate. No se cambia ese plazo porque otra versión del cliente o una guía describa un ciclo distinto. Multijugador y anuncios recompensados continúan pendientes por petición del usuario.

## Prioridades de implementación derivadas

1. **Explicar la obtención en cada ficha:** instalación concreta, nivel, plano, coste, población y motivo de bloqueo; distinguir compra, entrenamiento, misión y producción especial.
2. **Dar función real a edificios especiales:** empezar por Área 51 y maravillas; incluir sus estados, temporizadores, límites, recogidas y persistencia antes de considerarlos completos.
3. **Añadir progresión individual por recompensas:** racha diaria local y metas con premios claros, sin depender de chat, amigos, anuncios ni compras. La política de calendario y recompensas necesita una decisión explícita de diseño; no se simula aquí una comprobación de cinco días.
4. **Reconstruir el proceso de fusión:** participantes, potencia/azar, restricciones, cola, capacidad y devolución segura. Usar el comportamiento del cliente, no una lista de recetas supuestamente garantizadas.
5. **Mejorar las bases avanzadas por función:** industrias agrupadas, reservas protegidas, accesos defendidos, zonas de entrenamiento y circulación libre. Comprobar rutas terrestres, navegación y alcance desde los puentes.

Para validar estos cambios habrá que comprobar costes reales, límites de población/almacén, reanudación de colas y recompensas únicas tras recargar. Esta entrega deja esa comparación y el catálogo factual listos; no marca las prioridades como implementadas.

## Fuentes adicionales y cautelas históricas

- [Consejos de economía de un jugador](https://socialwarsdicas.blogspot.com/2013/01/dica-econo-mizar.html): fábricas mejoradas, premios de misiones y consumo de acero en defensas y tropas. Testimonio histórico, no tabla de equilibrio de la beta actual.
- [Consejos históricos sobre cash](https://socialwarsdicas.blogspot.com/2013/01/como-conseguir-cash.html): menciona nivel, ciertos días/misiones y colecciones. Esas vías no se comprobaron en la cuenta nueva y no se anuncian como disponibles en el sitio actual.
- [Anatomía técnica](SOCIAL-WARS-ANATOMY.md), [bases avanzadas](ADVANCED-BASES.md) y [mapa de casa](HOME-MAP.md): antecedentes y distinción entre datos preservados, reglas locales y funciones ya jugables.

No se utilizaron trucos, modificaciones de la cuenta, compras ni saltos de nivel para obtener las observaciones. Las imágenes históricas se inspeccionaron en su página de origen; no se incorporaron al paquete del juego.
