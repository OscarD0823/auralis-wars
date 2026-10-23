> 0.12: la interfaz del juego utiliza ahora iconos de piezas propios. La lámina original citada abajo permanece como referencia histórica; IDs, recompensas y reglas de las colecciones se conservan. Véase [arte Auralis](ART-DIRECTION-0.12.md).

# Colecciones y almacén · 0.11.0

## Comparación realizada

Se volvió a entrar en la cuenta de prueba de [Social Wars](https://wars.fbgamesweb.com/) y se abrió el cofre → Inventario. La pantalla conserva las pestañas Objetos y Colecciones, muestra cinco piezas por colección y coloca los premios reclamados en Almacén. La cuenta permanece independiente de Auralis; no se cambió su progreso para simular una base avanzada.

La [revisión fija de preservación](https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822) aporta `config/main.json`, `assets/images/collectibles3.png` y el cliente archivado. La instantánea local de datos utilizada se conserva en `source-data/social-wars/collections.json`. El código ActionScript descompilado se consultó como documentación; no se ejecuta en Auralis.

Referencias del cliente: `core/inventory/Inventory.as` (fuentes y probabilidades), `InventoryList.as` (selección por rareza y fuente), `InventoryCollection.as` (consumo de cinco piezas, reclamación única y premio en almacén) y `popups/InventoryTabCollections.as` (interfaz). Los nombres, los IDs y los premios proceden de la configuración, no de suposiciones basadas en las imágenes.

## Implementado

| Colección | Obtención | Premio original |
|---|---|---|
| Draggy | Derrotar tropas enemigas | Metal Draggy, ID 1085 |
| Transformer | Derrotar tropas enemigas | MegaBot, ID 1062 |
| Aviones | Derrotar tropas enemigas | F-117, ID 1096 |
| Defensa | Destruir edificios enemigos | Laser Turret, ID 164 |
| Armas | Derrotar tropas enemigas | Erradicator, ID 1073 |
| Tanques | Derrotar tropas enemigas | APC, ID 1010 |
| Lanzamisiles | Destruir edificios enemigos | Rocket Turret, ID 45 |
| Condecoraciones | Ayudar a amigos, pausado | General Sculpture, ID 136 |
| Descanso | Ayudar a amigos, pausado | Fountain, ID 106 |
| Animales | Recolectar recursos | Elephant Rider, ID 1056 |

El nuevo botón Inventario abre Colecciones, Objetos y Almacén. Hay cincuenta piezas con los iconos originales y nombres traducidos, cantidades y rareza. Una colección necesita al menos una de cada pieza; al reclamar consume exactamente cinco, conserva duplicados y entrega su premio una sola vez. Las dos colecciones sociales están visibles y no generan piezas ni premios mientras esa función siga pausada.

Los premios pueden permanecer indefinidamente en Almacén. Una unidad se incorpora con su grado de investigación vigente cuando tiene plazas; no requiere construir su academia para recibir el premio. Los edificios se colocan desde el inventario sobre terreno propio libre y respetan sus límites y colisiones. Colocarlos no vuelve a cobrar su construcción. Cancelar la colocación o intentar colocar en un solar inválido conserva el premio. Después funcionan como cualquier otro edificio del catálogo adaptado, con sus mejoras y reparaciones.

El motor central de daño genera una oportunidad únicamente al morir una tropa enemiga o destruirse un edificio enemigo por daño del jugador. No se tira sobre cadáveres, bajas propias, fuego enemigo, invocaciones temporales ni partidas de red. El efecto funciona con ataques normales, explosiones y habilidades. La muerte ya guardada no se vuelve a premiar al abrir una copia.

## Probabilidades y adaptaciones

El original utiliza una tirada de 0 a 100 con límites anidados: para combate, 1% épica, el siguiente 1% rara y el siguiente 6% poco común; el resto no da pieza. Para recolección, 2,5% épica, el siguiente 2,5% rara y el siguiente 15% poco común. Se elige uniformemente una pieza de la fuente y rareza correspondientes. Auralis conserva estos límites, las rarezas y las fuentes.

La unidad de recolección se adapta a la economía de Auralis: una oportunidad por cada **100 recursos realmente entregados** de producción o extracción, acumulados entre edificios y obreros. Recoger parcialmente o muchas veces el mismo lote no multiplica las oportunidades. Comercio, regalos diarios, recompensas de misión y cash no cuentan como cosecha. El máximo por acción es 10.000 tiradas, para acotar copias con cantidades desproporcionadas; el progreso parcial permanece entre 0 y 100. La producción sin conexión no genera piezas hasta que se recoge.

El azar usa la semilla de partida y un contador persistente; el inventario, las piezas consumidas, los premios y el contador sobreviven a recarga/exportación/importación. Las copias anteriores comienzan con inventario vacío sin alterar edificios, ejército o recursos. Las importaciones validan cantidades, IDs, listas, premios pendientes, secuencia y reloj. No hay compras de piezas ni de colecciones con dinero o cash en esta entrega.

La demostración independiente incluye Transformer y Defensa completas, y tres tipos de piezas de Tanques. Sus premios son de prueba; salir vuelve a la base real sin transferirlos.

## Rendimiento y validación

Una sola lámina PNG de 288.596 bytes contiene los cincuenta iconos utilizados; CSS recorta las celdas originales de 60 × 60 y evita descargar un archivo por pieza. SHA-256: `edcf60ff5fa3fa79ecaee1b9c70832ae02dc0361a606b91e21f628c5b13e8222`. Se mantiene en la caché de instalación. Los retratos de premios reutilizan miniaturas existentes.

`node scripts/prepare-collections.mjs` regenera los datos públicos. `tests/collections.test.mjs` comprueba fuentes, probabilidades, guardado, reclamaciones, capacidad, colocación, premios únicos, tiradas partidas, daño, modo sin conexión y entradas inválidas. La interfaz se comprueba en Edge con el flujo completo de reclamar, almacenar, incorporar una unidad y colocar una torreta, más la vista móvil. Multijugador y anuncios recompensados siguen pendientes.

## Aún pendiente

Almacenar voluntariamente edificios ya construidos, materiales sociales de construcción (los otros cuarenta objetos no coleccionables del archivo), eventos y delegados especiales de los hitos costeros/espaciales, y las secuencias narrativas de capítulos que aún no se han reconstruido. Esta versión añade colecciones e inventario de premios; no presenta esas funciones como implementadas.
