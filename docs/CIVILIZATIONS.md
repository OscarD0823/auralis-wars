# Civilizaciones, diplomacia y estaciones · 0.12.0

## Identidad propia

La interfaz utiliza treinta iconos propios, cuatro emblemas raciales y una lámina vectorial de cincuenta piezas de colección. La arquitectura se representa con dieciséis diseños base originales, reutilizados por familias de edificios, con insignias de nivel, colores de civilización, humo industrial y pulsos de laboratorio. Los puentes se dibujan con geometría propia. Las tropas, trabajadores, árboles y terrenos conservan las animaciones y gráficos anteriores. No se han creado 412 modelos únicos ni diez imágenes diferentes para cada nivel.

Los detalles de producción del arte, los archivos y el prompt final están en [ART-DIRECTION-0.12.md](ART-DIRECTION-0.12.md). Las imágenes archivadas anteriores permanecen como referencia y por compatibilidad de su catálogo; no representan la nueva autoría.

## Cuatro razas elegibles

La elección es permanente para esa partida y no reemplaza edificios, ejército o materiales. Una partida anterior puede elegir su identidad al actualizar. Cerrar el diálogo permite aplazar la decisión. La bonificación se aplica al proceso indicado, no a todas las estadísticas de combate.

| Raza | Identidad | Ventaja aplicada |
|---|---|---|
| Humanos de Aurora | Exploradores, ingenieros y comerciantes | +10% de materiales recibidos en tratos NPC |
| Kharun | Clanes de riscos y forjas | +20% de velocidad de extracción de roca y minerales por obreros |
| Nébari | Pueblos anfibios y navegantes | −20% de duración de transportes marítimos |
| Autómatas de Arca | Comunidades sintéticas | −10% de duración del entrenamiento; se conserva el mínimo de cinco segundos |

Los retratos y animaciones de tropas todavía pertenecen al catálogo anterior; elegir una raza cambia la identidad, sus emblemas, ventajas y relaciones, sin reemplazar automáticamente el aspecto de cada unidad.

## Ocho facciones de NPC

Cada raza tiene dos clanes: Cartógrafos del Faro / Liga del Horizonte; Risco Férreo / Forja de Ceniza; Pacto del Coral / Guardia del Estuario; Custodios del Prisma / Orden Vector. Su identidad se asigna de forma determinista a las nuevas islas. La elección inicial presenta a los dos clanes de tu raza y a los cartógrafos; explorar permite contactar a los restantes. Los habitantes procedurales Kharun tienen +15% de vida y los de Arca +10% de daño. Las operaciones históricas conservan sus actores y objetivos.

| Acción | Requisitos y resultado |
|---|---|
| Trato | Entrega 100 materiales del tipo solicitado, recibe 150 de otro; Aurora recibe 165. Reputación +6. Caravana cada cinco minutos de juego. Si el premio no cabe, no cobra nada. |
| Ayuda | 60 madera + 40 petróleo. Reputación +12, moralidad +3. Una entrega cada diez minutos. Requiere paz. |
| Alianza | Reputación mínima 20, centro diplomático operativo, 100 oro y moralidad al menos −40. Moralidad +5. |
| Guerra | Cierra comercio y permite atacar sus islas. Moralidad −6 y reputación −20; traicionar una alianza resta 20 de moralidad, 50 de reputación y perjudica en 5 la confianza de los demás clanes conocidos. |
| Tregua | 200 oro + 100 petróleo. Pasa a neutral y prohíbe otra declaración durante diez minutos. Moralidad +2. |

Se puede tratar con un clan individual o declarar la guerra/formar alianza con los dos clanes de una raza. Los acuerdos de raza comprueban requisitos y treguas antes de aplicar cambios. Todos son NPC locales, sin mensajes a personas ni servidores multijugador.

Los territorios neutrales y aliados no se atacan hasta declarar guerra. Un aliado permite **fundar un puesto por acuerdo**, pagando 250 oro, 180 madera y 100 petróleo; no hay combate, bajas ni premio de saqueo. Cuenta en el límite normal de tres colonias y necesita rutas de suministro como cualquier puesto. Las colonias de clanes en paz no reciben sus incursiones; en guerra mantienen avisos, guarniciones y defensa dirigida. Cada guerra aumenta la presión de las incursiones generales; el aumento se limita a cuatro guerras para ese cálculo. Los enemigos de las campañas históricas siguen existiendo.

Las islas antiguas conservan su versión de generación. Al adoptar una raza reciben un clan estable; las colonias ya disputadas mantienen su condición militar para no borrar su riesgo anterior.

## Moralidad

Escala persistente de −100 a 100: Cooperativo desde +25, Temido desde −25 y Pragmático entre ambos. Una moralidad inferior a −40 impide nuevas alianzas. Auxiliar a supervivientes o caravanas médicas también afecta al indicador (+4 al ayudar, −2 al desatender esos eventos).

Tras una victoria en una isla de facción aparece una decisión: **proteger a los civiles** (+6 moralidad, +10 reputación) o **requisar reservas** (100 + 50 por nivel de isla en oro, −10 moralidad y −15 reputación). Se registra una decisión por isla; reclamarla varias veces o reconquistar repetidamente el mismo puesto no vuelve a concederla. El botín sin espacio conserva la decisión. Hay un máximo de ocho decisiones pendientes y un registro acotado de islas ya juzgadas.

## Islas y estaciones

Las nuevas expediciones usan el generador **v2**: masas de tierra giradas, tamaños diferentes, entrantes costeros y bahías determinados por semilla. Se mantienen un desembarco accesible, el cruce del río y suelo válido para la base NPC. La versión queda guardada; los mapas v1 ya descubiertos no cambian. El archipiélago inicial de una partida existente conserva su geografía para proteger edificios y operaciones ya colocados.

Hay cuatro estaciones, cada una de treinta minutos de juego. El terreno templado cambia de tono también en la base principal. La madera colonial rinde 100%, 115%, 105% y 75% en primavera, verano, otoño e invierno. Petróleo: 100%, 110%, 100%, 80%. Oro/acero: 100%, 105%, 100%, 95%. Los biomas tropicales, desérticos y volcánicos mantienen su producción estable. La dificultad y el nivel del puesto siguen afectando al rendimiento. El transporte marítimo iniciado en invierno tarda un 25% más; la ventaja Nébari se aplica después.

La ausencia integra todos los cambios de estación del intervalo, hasta el límite existente de ocho horas. No aplica el último clima a toda la ausencia. Las amenazas coloniales siguen pausadas durante el cierre. La producción queda limitada por los depósitos existentes.

## Demostración y validación

Mundo → Visitar base avanzada permite probar todo en una partida aislada. Incluye contacto con los ocho clanes, alianzas de ejemplo, una isla negociable y **Ver siguiente estación**. Ese botón sólo funciona dentro de la demostración. Volver a la base o recargar conserva la partida principal.

Las pruebas cubren elecciones, ventajas aplicadas, transferencias, esperas, capacidad, reputación, traiciones, treguas, acuerdos por raza, fundación pacífica, presión militar, decisiones únicas, integración estacional y mapas antiguos. También se comprueban los archivos gráficos, su alfa y sus rutas. La interfaz se prueba en Edge en escritorio y móvil. El multijugador y los anuncios recompensados permanecen pausados.
