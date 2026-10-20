# Revisión de las referencias, 20 de octubre de 2026

## Lo inspeccionado

- Social Wars en https://wars.fbgamesweb.com/: registro de una cuenta de prueba sin correo, entrada a la base, aviso de rescate del compañero, tienda de edificios y sección militar. Se revisaron además su guía pública y el catálogo. No se enviaron mensajes ni invitaciones a otros jugadores.
- Social Empires en https://github.com/AcidCaos/socialemperors: configuración, partida inicial, servidor, protocolo del cliente y películas vectoriales de edificios y tropas. Se extrajeron las películas y se comprobaron visualmente los dibujos y las secuencias. No se afirma haber ejecutado su cliente Flash completo.
- Se localizó el archivo de Social Wars de los mismos preservadores: https://github.com/AcidCaos/socialwarriors. Se usaron sus gráficos, sin copiar el código JavaScript del sitio fbgamesweb.

## Diferencias que explicaban el problema

| Referencia observada | Versión anterior | Corrección 0.2.0 |
|---|---|---|
| Dibujo isométrico con contornos, proporciones exageradas y color por facción | Modelos 3D de Frontier con otra estética | Atlas extraídos del archivo correspondiente de cada juego |
| Edificio dibujado sobre una huella del terreno, sin marco rectangular | Reutilización de modelos genéricos | Transparencia, anclaje a la casilla, sombra de contacto y orden de profundidad |
| Tropas dibujadas por dirección; marcha y ataque tienen secuencias | Personajes genéricos y modelos distintos del catálogo original | Fotogramas y direcciones del archivo, reflejados para completar las orientaciones |
| Tarjetas claras, marcos verdes o de madera y botones azules | Panel oscuro con tipografía y márgenes de Frontier | Tienda centrada, fichas claras y navegación compacta |
| Variantes visuales concretas de cada familia | Mejoras de geometría procedural | Familias del archivo distribuidas entre los diez niveles de Auralis |

## Qué todavía es una adaptación

La versión conserva las 18 funciones de edificio, las 24 unidades jugables, las colas, los costes y el balance Auralis. Los nombres se ajustaron a los personajes dibujados. La campaña de doce bases, las alianzas de IA, el guardado local y los diez niveles no son el servidor original.

El archivo de preservación y el sitio en funcionamiento corresponden a revisiones diferentes: por ejemplo, el catálogo público puede mostrar otra cantidad de producción o desbloqueo. No se mezclaron esos valores sin comprobar unidades y tiempos. Aún quedan por trasladar y validar la economía original, los desbloqueos por experiencia, la asignación original de trabajadores, el tutorial, los capítulos y el catálogo completo. Tampoco hay multijugador real.

Los ficheros de source-data/ y dist/classic/atlas.json permiten identificar qué recurso del archivo se muestra en cada función de Auralis. Se conserva el aviso de derechos de los titulares y la licencia del proyecto de preservación.

## Avance 0.3.0

Se sustituyeron los trabajadores decorativos por civiles controlables con rutas sobre la cuadrícula, extracción finita y transporte de cargas. Se añadieron las secuencias PICAR del archivo y BARRIL para el transporte en Wars. Los costes y ritmos siguen adaptados: esta implementación no se anuncia como el sistema original completo de aldeanos.

La progresión utiliza los 100 umbrales de experiencia de la configuración de cada archivo. Los desbloqueos se limitan también por el nivel de mando de Auralis; el mínimo de experiencia de cada elemento se adapta a esa campaña. Los niveles y materiales de los guardados existentes se conservan.
