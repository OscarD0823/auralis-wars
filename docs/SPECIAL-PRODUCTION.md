# Producción especial y obtención · 0.10.0

Implementación de las prioridades de la [comparación en vivo](SOCIAL-WARS-LIVE-COMPARISON-20261023.md). Se conserva la partida local y el ciclo de tres horas del rescate. Multijugador y anuncios siguen pausados.

## Acceso

- **Ejército → Ficha y mejoras → Cómo conseguir esta tropa**: vías de entrenamiento, prototipo, requisición, fusión o recompensa; instalación, nivel, coste y plazas. Se mantienen las dos entradas de Megabot: cash y academia. Un plano pendiente explica que debe recuperarse en campaña.
- **Ejército → Prototipos, fusión y maravillas**: localiza instalaciones propias y consulta sus planos. Sus funciones también aparecen al seleccionarlas en el mapa.
- **Metas → Bono diario**: racha, cash y recompensas pendientes de espacio.
- **Mundo → Visitar base avanzada**: demostración aislada con distritos, prototipos y fusión listos, y una última carga de Inca God para probar la restauración. Volver o recargar conserva la partida principal.

## Prototipos

Área 51 y el centro robótico tienen seis proyectos de **diez etapas** cada uno. Se encarga una etapa, se espera y se inicia la siguiente. Trabajan en paralelo; duplicar un centro no duplica su proyecto. Un edificio destruido pausa su trabajo hasta repararlo. La mejora del edificio espera a que termine el trabajo especial.

Las secuencias proceden de `PopupResearchCenter.as` y `Constants.as` del archivo fijado:

| Centro | IDs originales en orden |
| --- | --- |
| Centro robótico | 1062, 1101, 1075, 1141, 1085, 1105 |
| Área 51 | 1048, 1096, 1097, 1099, 1098, 1100 |

Los IDs asociados a tropas nativas conservan sus nombres y estadísticas Auralis. El primer proyecto aéreo utiliza la ficha Interceptor existente; no se duplica el mismo ID fuente.

El tiempo base es seis horas por etapa: fácil divide entre diez, difícil entre tres y simulación conserva la duración. Cada nivel adicional del centro aporta un 4% de velocidad. Los proyectos 1–2 exigen centro 1; 3–4, centro 2; 5–6, centro 3. El coste por etapa es una adaptación: 50 oro, 30 acero y 20 petróleo multiplicados por el número de proyecto.

El resultado se recoge manualmente y permanece pendiente si faltan viviendas. Entrega una unidad real y experiencia, y avanza al siguiente proyecto. Durante la ausencia se completa únicamente la etapa encargada, dentro del límite general de ocho horas; no se inician etapas automáticamente.

## Maravillas

Se implementan las **nueve maravillas productoras** del catálogo fijado, con su recurso, importe, intervalo y cargas. Las de materiales tienen 25 recogidas; Cash Wonder tiene 100 y entrega cash local. Los edificios pasivos sin producción no se convierten en productores inventados.

Preparan un lote y esperan su recogida. Debe caber completo: un almacén lleno no pierde materiales ni consume una carga. Al agotarse se detienen. El panel muestra las cargas y el coste de restauración con materiales; restaurar inicia el siguiente temporizador. La dificultad acelera intervalos, sin multiplicar cargas o importes originales. Construcción y restauración utilizan costes Auralis.

Migrar conserva materiales almacenados y el importe y vencimiento de los lotes encargados en 0.9. Esa producción anterior no consume cargas nuevas. El oro anteriormente producido por Cash Wonder sigue siendo oro y no se convierte en cash.

## Fusión atómica

La cámara se construye en Ciencia con mando 3. Para utilizarla necesita laboratorio operativo 2 y comandante 5. Aloja dos tropas compatibles de la base, que dejan de participar en el mapa y las batallas. Se mantienen sus plazas y se reserva espacio para el resultado.

Se conserva la combinación de potencias del cliente: 30% de la menor, 70% de la mayor, mínimo y azar. El catálogo fijado carece de `breeding_order` y `sm_training_time`: se usa una escala Auralis declarada de vida, daño y alcance, un conjunto limitado de tropas compatibles y cuatro horas base. No es una tabla de recetas originales garantizadas. La vista muestra los resultados posibles antes de empezar; el resultado queda fijado al iniciar y se revela al terminar.

Cuesta 400 oro, 200 acero y 150 petróleo. La dificultad aplica sus aceleradores; la cámara aporta un 5% de velocidad por nivel adicional. Se rechaza una combinación sin resultados o sin plazas antes de cobrar.

Recoger devuelve las **mismas dos tropas**, con IDs y salud, junto a una unidad nueva. Las investigaciones completadas durante la espera se aplican conservando la proporción de vida. Una cámara destruida pausa el trabajo y conserva sus participantes. La pérdida de viviendas deja el resultado pendiente. Cancelar devuelve las tropas una sola vez, consume los materiales empleados y descarta el resultado.

El delegado Soul Mixer es el ID 302, ausente del catálogo gráfico fijado. La cámara Auralis reutiliza explícitamente el arte preservado del centro robótico; no se atribuye a una película original 302 incluida en el paquete.

## Bono y cash local

Calendario de Bogotá calculado con el reloj del dispositivo: 100, 250, 500 y 1.000 oro; quinto día General Mike y dos cash. El sexto reinicia el ciclo. Saltar una fecha reinicia la racha. La última fecha recogida impide repetir el premio el mismo día o atrasando el reloj. Es una partida local sin reloj autoritativo de servidor.

Cada meta nueva completada entrega además un cash; Cash Wonder es otra fuente. Las requisiciones de tropas humanas con precio cash en el catálogo consumen ese saldo y comprueban niveles y alojamiento. No se habilitan pagos ni funciones sociales.

Los premios sin espacio quedan en reserva: materiales entregables parcialmente y héroes esperando vivienda. Repetir la recogida no duplica recompensas. Las tropas especiales obtenidas pueden investigarse aunque no sean entrenables en una academia normal; los premios reciben el grado ya investigado.

La vista de mejora distingue la integridad de la producción: en 0.10.1 no anuncia aumentos por segundo para las maravillas de lotes y cargas fijas.

## Integración y compatibilidad

La demostración agrupa industrias, viviendas, ciencia, academias, aviación y reservas. Deja pasillos libres, distribuye defensas por accesos y hace operativos los puentes. Sus ejemplos preparados pertenecen exclusivamente a la demostración.

Los controles usan los paneles existentes y estilos adaptables. Las miniaturas reciben su URL al crear el elemento para evitar imágenes vacías al cambiar de panel o tamaño.

Se mantiene el formato 1 y su clave de guardado. `special` añade saldo, racha, reservas, descubrimientos, proyectos y participantes alojados. Se validan referencias, rangos, tiempos e IDs duplicados. Las partidas antiguas reciben el bloque una sola vez.

`node scripts/prepare-specials.mjs` regenera campos factuales, maravillas, secuencias y el alias gráfico de la cámara; debe ejecutarse después de regenerar el atlas general. No accede a cuentas.

## Verificación

- `tests/specials.test.mjs`: 25 pruebas de calendario, premios únicos, excedentes, rutas alternativas, proyectos, ausencia, destrucción, cargas, migración y fusión sin pérdidas o duplicaciones.
- Suite completa: 189 pruebas. Comprobación de módulos, caché, procedencia y hashes del arte preservado.
- Edge: bono, prototipo y siguiente etapa, fusión, cancelación, agotamiento/restauración de Inca God y retorno a la partida principal; vista 390 × 844.
- `scripts/prepare-special-fixtures.mjs` genera copias locales para pruebas adicionales; no modifica partidas publicadas ni la cuenta de referencia.
