---
# EJEMPLO tomado de las pantallas del diseño. Reemplazar o borrar antes del lanzamiento.
fig: 3
title: "Soporte impreso para sensor de temperatura"
summary: "Un soporte en PETG que aísla el sensor del calor de la pared y se imprime sin soportes."
date: 2026-08-14
categories:
  - impresion-3d
  - home-automation
# Las imágenes son marcadores rayados: faltan las fotos reales.
cover: ./portada.jpg
coverAlt: "Marcador: foto de portada del proyecto"
# [VIDEO] Falta el identificador real del video de YouTube.
youtube: "VIDEO_ID"
# [REPOSITORIO] Falta la dirección real del repositorio; por ahora apunta al perfil.
repo: "https://github.com/brunofrankensteinsum"
tags:
  - PETG
  - Fusion 360
  - ESPHome
  - DS18B20
featured: true
---

## El problema

El sensor estaba pegado a la pared y medía dos grados de más cada tarde: la pared se calienta con el sol y le pasa ese calor al sensor. Necesitaba separarlo y dejar que el aire circule.

También quería que cualquiera pudiera imprimirlo en una impresora común, sin soportes y en menos de una hora.

## Diseño

- Separación de 25 mm respecto de la pared.
- Ranuras arriba y abajo para que el aire pase por convección.
- Encastre a presión: sin tornillos ni pegamento.

![Marcador: foto del soporte montado](./01-soporte-montado.jpg)
*El soporte montado, con el sensor en su lugar.*

![Marcador: render del modelo en corte](./02-corte-modelo.jpg)
*Corte del modelo: las ranuras de ventilación.*

## Impresión

| Parámetro | Valor |
|---|---|
| Material | PETG |
| Altura de capa | 0,2 mm |
| Relleno | 20 % |

> Si lo imprimís en PLA, no lo pongas donde le dé el sol directo: se deforma.

## Configuración

```yaml
sensor:
  - platform: dallas_temp
    name: "Living"
    update_interval: 60s
```

## Video

Dura 3 min: montaje y prueba.
