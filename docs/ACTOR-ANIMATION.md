# Marcha y combate · 0.14.0

Las personas usaban una sola vista de tres cuartos reflejada horizontalmente. El cañón podía apuntar en sentido distinto al movimiento y el ataque se repetía mientras el temporizador de recarga fuera positivo. Ahora la orientación se calcula en los ocho rumbos isométricos, con vistas de frente, perfil y espalda para obreros, infantería, soldados pesados y apoyo de las cuatro razas.

## Arte y reproducción

Los cuatro atlas nuevos contienen 60 recortes cada uno: cuatro funciones, cinco vistas y tres poses por vista. Las direcciones a la izquierda utilizan el reflejo de las vistas derechas. Las dos poses de marcha alternan según la distancia recorrida; la pose de acción sirve para apuntar, trabajar o curar. Las anclas se calculan desde los pies. Se elimina el balanceo global del personaje quieto y se reduce el salto vertical al andar.

Algunas celdas generadas cambiaban de orientación o equipo entre pasos. `scripts/prepare-directional-atlas.py` excluye esas alternancias y reutiliza una pose estable en esos casos. Son ciclos cortos prerenderizados, no esqueletos 3D ni animaciones completas de todas las unidades especiales. Los vehículos conservan sus diseños anteriores; sus efectos de disparo se sincronizan con el combate real. Las unidades preservadas siguen usando sus clips direccionales originales.

| Raza | Archivo integrado |
|---|---|
| Aurora | [aurora-directional.png](../dist/auralis/races/aurora-directional.png) |
| Kharun | [kharun-directional.png](../dist/auralis/races/kharun-directional.png) |
| Nébari | [nebari-directional.png](../dist/auralis/races/nebari-directional.png) |
| Arca | [arca-directional.png](../dist/auralis/races/arca-directional.png) |

Se usó la herramienta integrada `image_gen`, modo de edición con referencia a cada atlas racial de 0.13 y transparencia real. Los prompts completos, referencias y destinos están en [auralis-directional-art.json](../source-data/auralis-directional-art.json). Los PNG se copian al repositorio sin alterar sus píxeles; el script sólo inspecciona alfa y genera `directional.json`.

## Combate

El motor orienta al combatiente hacia el centro del objetivo cuando está en alcance, incluso durante la recarga. Cada tiro, cura o reparación emite un evento con su emisor y tiempo. La pose de ataque dura 0,36 segundos como máximo y el fogonazo menos de 0,085 segundos; no se repiten por seguir recargando. Los trazadores salen a la altura del arma, los proyectiles pesados describen un arco y las curas tienen un pulso propio. El retroceso se opone al apuntado y recupera la postura una sola vez.

Una orden explícita de mover tiene prioridad sobre disparar mientras el soldado avanza. Avanzar y atacar mantiene su comportamiento de aproximarse, detenerse y combatir. No cambian daños, alcance, costes, niveles ni recursos. El estado de los pasos es una caché de renderizado que no entra en los guardados. Los efectos antiguos sin emisor siguen siendo compatibles.

## Rendimiento y comprobación

Los atlas direccionales suman menos de 26 MiB decodificados y se cargan bajo demanda, sólo al mostrar la raza. Los cuatro atlas anteriores siguen sirviendo a los vehículos; los edificios permanecen intactos. La instalación inicial del service worker incluye los metadatos, mientras que los PNG quedan para carga diferida o descarga completa opcional. La reproducción reutiliza recortes, imágenes y máscaras; no crea imágenes por fotograma.

Pruebas: ocho rumbos y reflejos, ritmo por distancia, detención y teletransporte, sincronización por emisor y disparo, recarga sin tiros ficticios, prioridad de movimiento, apuntado, curación y compatibilidad de batallas guardadas. Comprobación adicional de los 240 recortes, módulos, caché y archivos originales preservados. Revisión visual en la demostración y una escaramuza local.
