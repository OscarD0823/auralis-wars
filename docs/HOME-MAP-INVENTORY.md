# Inventario detallado del archipiélago

Informe regenerado por `node scripts/audit-home-map.mjs` desde las fuentes fijadas. Cada instancia, coordenada original, origen de huella, tamaño, bando y función se encuentra en [home-map-audit.json](../source-data/social-wars/home-map-audit.json). No contiene datos de cuentas.

El mapa lógico mide 100 × 100: 7925 casillas de suelo/playa y 2075 de agua según las superficies de 5 × 5. Tiene 100 sectores, 72 comprables y 28 reservados. Los bordes de playa conservan sus píxeles costeros; la franja interior marcada por el usuario procedía de la migración antigua y se elimina.

## Puentes

| ID | Origen | Estado inicial | Orientación |
| --- | --- | --- | --- |
| br-native-0 | 42, 15 | Transitable | 0 |
| br-native-1 | 60, 15 | Transitable | 0 |
| br-native-2 | 39, 65 | Transitable | 0 |
| br-native-3 | 60, 65 | Transitable | 0 |
| br-native-4 | 90, 65 | Roto: requiere reparación | 0 |
| br-native-5 | 8, 75 | Transitable | 0 |
| br-native-6 | 25, 44 | Transitable | 1 |
| br-native-7 | 80, 42 | Transitable | 1 |
| br-native-8 | 25, 2 | Roto: requiere reparación | 1 |

## Plano 1 · chapters.chapters.Chapter01Key

9 actores y 45 estructuras/elementos, incluidos los tres hitos neutrales. Coordenadas de origen de huella; los actores se sitúan en el centro de casilla.

| ID fuente | Elemento | Cantidad | Función | Orígenes |
| --- | --- | ---: | --- | --- |
| 19 | Prison | 1 | Objetivo | 89,7 |
| 177 | Axe Zoldier Academy | 1 | Academia | 87,23 |
| 183 | Ork House | 6 | Infraestructura | 85,1 · 87,1 · 89,1 · 91,1 · 93,1 · 95,1 |
| 190 | Molotov Kopta Hangar | 1 | Academia | 84,17 |
| 191 | Ork Tank Academy | 1 | Academia | 89,17 |
| 200 | Silo II | 1 | Logística | 94,21 |
| 206 | Enemy Ork Wall | 17 | Muralla | 70,1 · 70,2 · 70,3 · 70,4 · 70,5 · 70,9 · 70,10 · 70,11 · 70,12 · 70,13 · 91,35 · 92,35 · 93,35 · 94,35 · 95,35 · 96,35 · 97,35 |
| 207 | Enemy Ork Turret I | 3 | Defensa | 71,4 · 71,10 · 94,34 |
| 905 | Tree | 7 | Recurso/decoración | 74,2 · 97,8 · 96,9 · 78,12 · 78,17 · 96,28 · 96,29 |
| 907 | Astillero | 1 | Hito neutral | 69,24 |
| 908 | Astillero | 1 | Hito neutral | 90,88 |
| 909 | Space Station | 1 | Hito neutral | 6,1 |
| 926 | Key | 1 | Objetivo | 50,6 |
| 930 | Trees | 1 | Recurso/decoración | 96,12 |
| 931 | Small forest | 2 | Recurso/decoración | 96,16 · 93,26 |
| 1122 | Orc Zoldier | 2 | Guardia | 77.5,2.5 · 77.5,10.5 |
| 1123 | Orc Swordsman | 5 | Guardia | 54.5,1.5 · 82.5,3.5 · 56.5,10.5 · 47.5,11.5 · 82.5,12.5 |
| 1124 | Basic Ork Tank | 2 | Guardia | 81.5,5.5 · 93.5,13.5 |

## Plano 2 · chapters.chapters.Chapter02Guille

15 actores y 176 estructuras/elementos, incluidos los tres hitos neutrales. Coordenadas de origen de huella; los actores se sitúan en el centro de casilla.

| ID fuente | Elemento | Cantidad | Función | Orígenes |
| --- | --- | ---: | --- | --- |
| 92 | Apple tree | 4 | Recurso/decoración | 47,89 · 49,89 · 48,90 · 47,91 |
| 111 | Max Security Prison | 1 | Infraestructura | 40,94 |
| 183 | Ork House | 5 | Infraestructura | 31,92 · 33,92 · 30,95 · 32,95 · 34,95 |
| 196 | Orc Sponge Bush | 4 | Recurso/decoración | 45,88 · 46,88 · 47,88 · 48,88 |
| 198 | Orc Bush | 2 | Recurso/decoración | 48,89 · 46,90 |
| 202 | Orc Resource Building | 2 | Logística | 45,93 · 46,95 |
| 206 | Enemy Ork Wall | 105 | Muralla | 53,76 · 54,76 · 55,76 · 56,76 · 36,77 · 37,77 · 38,77 · 39,77 · 56,77 · 36,78 · 39,78 · 30,83 · 31,83 · 32,83 · 33,83 · 34,83 · 35,83 · 36,83 · 37,83 · 40,83 · 41,83 · 42,83 · 43,83 · 44,83 · 45,83 · 46,83 · 47,83 · 48,83 · 49,83 · 30,84 · 32,84 · 33,84 · 34,84 · 35,84 · 37,84 · 40,84 · 42,84 · 43,84 · 44,84 · 45,84 · 46,84 · 47,84 · 49,84 · 30,85 · 37,85 · 40,85 · 49,85 · 17,86 · 18,86 · 19,86 · 21,86 · 22,86 · 23,86 · 30,86 · 49,86 · 60,86 · 61,86 · 62,86 · 65,86 · 66,86 · 67,86 · 22,87 · 30,87 · 49,87 · 60,87 · 67,87 · 22,88 · 30,88 · 49,88 · 50,88 · 60,88 · 68,88 · 69,88 · 70,88 · 30,89 · 50,89 · 51,89 · 28,90 · 29,90 · 30,90 · 51,90 · 28,91 · 51,91 · 28,92 · 29,92 · 51,92 · 29,93 · 51,93 · 52,93 · 63,93 · 64,93 · 65,93 · 66,93 · 29,94 · 52,94 · 29,95 · 52,95 · 29,96 · 52,96 · 29,97 · 52,97 · 29,98 · 52,98 · 29,99 · 52,99 |
| 207 | Enemy Ork Turret I | 5 | Defensa | 31,84 · 36,84 · 41,84 · 48,84 · 29,91 |
| 901 | Oil | 3 | Recurso/decoración | 68,90 · 70,90 · 71,91 |
| 902 | Oil | 1 | Recurso/decoración | 69,90 |
| 903 | Oil | 1 | Recurso/decoración | 69,91 |
| 904 | Oil | 2 | Recurso/decoración | 70,91 · 69,92 |
| 905 | Tree | 6 | Recurso/decoración | 56,95 · 57,95 · 55,96 · 49,97 · 50,97 · 51,97 |
| 907 | Astillero | 1 | Hito neutral | 69,24 |
| 908 | Astillero | 1 | Hito neutral | 90,88 |
| 909 | Space Station | 1 | Hito neutral | 6,1 |
| 910 | Steel | 2 | Recurso/decoración | 22,94 · 22,95 |
| 911 | Steel | 2 | Recurso/decoración | 21,95 · 22,96 |
| 913 | Steel | 4 | Recurso/decoración | 20,95 · 21,96 · 21,97 · 22,97 |
| 914 | Gold | 2 | Recurso/decoración | 16,92 · 16,93 |
| 915 | Gold | 1 | Recurso/decoración | 15,92 |
| 916 | Gold | 2 | Recurso/decoración | 14,91 · 16,91 |
| 917 | Gold | 3 | Recurso/decoración | 15,91 · 20,94 · 21,94 |
| 930 | Trees | 6 | Recurso/decoración | 49,91 · 52,91 · 49,93 · 50,95 · 53,96 · 55,97 |
| 931 | Small forest | 9 | Recurso/decoración | 9,90 · 6,93 · 9,93 · 12,93 · 53,93 · 6,96 · 9,96 · 12,96 · 57,96 |
| 946 | Destroyed building 4 | 1 | Infraestructura | 62,88 |
| 1122 | Orc Zoldier | 2 | Guardia | 36.5,85.5 · 41.5,85.5 |
| 1123 | Orc Swordsman | 13 | Guardia | 54.5,77.5 · 38.5,78.5 · 33.5,85.5 · 35.5,85.5 · 44.5,85.5 · 41.5,86.5 · 42.5,86.5 · 48.5,87.5 · 34.5,90.5 · 40.5,92.5 · 41.5,92.5 · 35.5,93.5 · 36.5,94.5 |

## Plano 3 · chapters.chapters.Chapter03Bazooka

14 actores y 133 estructuras/elementos, incluidos los tres hitos neutrales. Coordenadas de origen de huella; los actores se sitúan en el centro de casilla.

| ID fuente | Elemento | Cantidad | Función | Orígenes |
| --- | --- | ---: | --- | --- |
| 112 | Stolen Bazookas | 1 | Objetivo | 2,28 |
| 177 | Axe Zoldier Academy | 4 | Academia | 1,47 · 5,47 · 1,50 · 1,53 |
| 178 | Gun Zoldier Academy | 1 | Academia | 4,43 |
| 183 | Ork House | 4 | Infraestructura | 1,59 · 3,59 · 1,63 · 1,65 |
| 196 | Orc Sponge Bush | 16 | Recurso/decoración | 1,58 · 2,58 · 3,58 · 4,58 · 5,58 · 6,58 · 6,64 · 6,65 · 6,66 · 6,67 · 1,68 · 2,68 · 3,68 · 4,68 · 5,68 · 6,68 |
| 198 | Orc Bush | 2 | Recurso/decoración | 5,59 · 6,59 |
| 206 | Enemy Ork Wall | 76 | Muralla | 1,26 · 2,26 · 3,26 · 4,26 · 5,26 · 6,26 · 7,26 · 1,27 · 7,27 · 1,28 · 7,28 · 8,28 · 9,28 · 1,29 · 1,30 · 1,31 · 7,31 · 8,31 · 9,31 · 1,32 · 7,32 · 1,33 · 2,33 · 3,33 · 4,33 · 5,33 · 6,33 · 7,33 · 19,40 · 20,40 · 8,41 · 9,41 · 20,41 · 9,42 · 20,42 · 8,43 · 9,43 · 10,43 · 11,43 · 18,43 · 20,43 · 11,44 · 12,44 · 19,44 · 20,44 · 12,45 · 12,46 · 11,47 · 12,47 · 19,47 · 20,47 · 12,48 · 20,48 · 12,49 · 20,49 · 11,50 · 12,50 · 20,50 · 12,51 · 12,52 · 12,53 · 11,54 · 12,54 · 10,57 · 10,58 · 8,59 · 9,59 · 10,59 · 13,65 · 15,65 · 13,66 · 14,66 · 15,66 · 9,70 · 10,70 · 11,70 |
| 207 | Enemy Ork Turret I | 6 | Defensa | 8,42 · 22,42 · 22,50 · 9,58 · 7,71 · 13,71 |
| 905 | Tree | 14 | Recurso/decoración | 17,30 · 19,31 · 8,33 · 10,34 · 8,35 · 7,37 · 8,38 · 6,40 · 4,42 · 18,53 · 19,53 · 22,53 · 18,54 · 5,71 |
| 907 | Astillero | 1 | Hito neutral | 69,24 |
| 908 | Astillero | 1 | Hito neutral | 90,88 |
| 909 | Space Station | 1 | Hito neutral | 6,1 |
| 930 | Trees | 4 | Recurso/decoración | 3,34 · 6,34 · 1,35 · 1,69 |
| 931 | Small forest | 2 | Recurso/decoración | 16,26 · 3,37 |
| 1122 | Orc Zoldier | 2 | Guardia | 19.5,48.5 · 11.5,51.5 |
| 1123 | Orc Swordsman | 12 | Guardia | 12.5,29.5 · 12.5,31.5 · 18.5,32.5 · 19.5,42.5 · 11.5,45.5 · 1.5,62.5 · 5.5,65.5 · 14.5,65.5 · 5.5,66.5 · 5.5,67.5 · 9.5,69.5 · 10.5,69.5 |

## Plano 4 · chapters.chapters.Chapter04Jeeps

23 actores y 136 estructuras/elementos, incluidos los tres hitos neutrales. Coordenadas de origen de huella; los actores se sitúan en el centro de casilla.

| ID fuente | Elemento | Cantidad | Función | Orígenes |
| --- | --- | ---: | --- | --- |
| 98 | Blue flowers | 2 | Recurso/decoración | 82,3 · 82,5 |
| 113 | Disabled Jeeps | 1 | Infraestructura | 95,11 |
| 114 | Jeep wheels | 1 | Infraestructura | 95,59 |
| 178 | Gun Zoldier Academy | 1 | Academia | 85,11 |
| 180 | Bear Ridda Academy | 1 | Academia | 95,1 |
| 183 | Ork House | 3 | Infraestructura | 84,1 · 89,3 · 92,3 |
| 197 | Orc Lamp | 2 | Recurso/decoración | 82,4 · 87,4 |
| 198 | Orc Bush | 18 | Recurso/decoración | 81,2 · 92,2 · 81,3 · 81,4 · 81,5 · 89,5 · 90,5 · 93,5 · 81,6 · 82,6 · 83,6 · 84,6 · 87,6 · 88,6 · 89,6 · 90,6 · 92,6 · 93,6 |
| 201 | Orc Bunker | 1 | Defensa | 93,17 |
| 206 | Enemy Ork Wall | 85 | Muralla | 70,1 · 94,1 · 70,2 · 94,2 · 69,3 · 70,3 · 94,3 · 70,4 · 94,4 · 94,5 · 94,6 · 95,6 · 69,8 · 70,8 · 70,9 · 70,10 · 84,10 · 85,10 · 86,10 · 87,10 · 88,10 · 89,10 · 90,10 · 93,10 · 70,11 · 84,11 · 93,11 · 70,12 · 71,12 · 72,12 · 73,12 · 74,12 · 75,12 · 76,12 · 84,12 · 93,12 · 75,13 · 76,13 · 84,13 · 93,13 · 76,14 · 77,14 · 84,14 · 93,14 · 77,15 · 84,15 · 93,15 · 78,16 · 93,16 · 94,16 · 79,17 · 80,17 · 95,17 · 96,17 · 97,17 · 98,17 · 99,17 · 80,18 · 81,18 · 82,19 · 83,19 · 83,20 · 84,20 · 85,21 · 86,22 · 87,22 · 88,22 · 89,22 · 88,23 · 89,23 · 90,23 · 91,24 · 92,25 · 92,26 · 93,26 · 94,26 · 95,26 · 93,54 · 94,54 · 95,54 · 93,55 · 95,55 · 93,56 · 94,56 · 95,56 |
| 207 | Enemy Ork Turret I | 9 | Defensa | 71,2 · 95,5 · 83,10 · 71,11 · 78,15 · 95,18 · 86,21 · 95,25 · 94,55 |
| 905 | Tree | 8 | Recurso/decoración | 69,1 · 71,1 · 69,2 · 69,9 · 69,10 · 96,18 · 97,18 · 98,18 |
| 907 | Astillero | 1 | Hito neutral | 69,24 |
| 908 | Astillero | 1 | Hito neutral | 90,88 |
| 909 | Space Station | 1 | Hito neutral | 6,1 |
| 930 | Trees | 1 | Recurso/decoración | 97,19 |
| 1123 | Orc Swordsman | 17 | Guardia | 70.5,5.5 · 96.5,5.5 · 91.5,6.5 · 70.5,7.5 · 83.5,8.5 · 98.5,10.5 · 80.5,13.5 · 81.5,13.5 · 80.5,14.5 · 81.5,14.5 · 94.5,14.5 · 96.5,22.5 · 96.5,23.5 · 92.5,55.5 · 96.5,55.5 · 92.5,56.5 · 96.5,56.5 |
| 1124 | Basic Ork Tank | 5 | Guardia | 73.5,5.5 · 74.5,5.5 · 73.5,6.5 · 74.5,6.5 · 93.5,61.5 |
| 1125 | Orc Worker | 1 | Guardia | 98.5,15.5 |

## Actores y comportamientos adicionales

Las patrullas independientes se generan en hasta dos grupos de `round(nivel del comandante / 5) + 5` actores. Se usan los grupos de sectores de `MapInitializer.spawnIdleEnemies`, con elección reproducible y comprobación de propiedad, áreas del capítulo, suelo y edificios. La colocación es una adaptación: no reproduce el RNG ni toda la traducción de islas del cliente Flash. Los guardias del capítulo y estas patrullas tienen objetivos distintos.

El rescate entrega cuatro `Soldier V` (ID 1059) una sola vez; cada uno ocupa dos plazas. El archivo preservado configura 14400 segundos para `TIMER_OGRES_VILLAGE`. Auralis usa 10800 segundos por petición del usuario y su observación del sitio actual. El reloj de fecha local sigue transcurriendo al cerrar el juego; no es un servicio de servidor ni simula ataques durante la ausencia.

Las reglas de interacción, mando, logística, alojamiento, refuerzos, IA y límites se describen en [HOME-MAP.md](HOME-MAP.md). Los planos 2–4 se reutilizan en oleadas posteriores; disponer de sus posiciones no equivale a portar todas sus cinemáticas y guiones.
