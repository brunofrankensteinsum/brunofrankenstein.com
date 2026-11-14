---
# EJEMPLO tomado de las pantallas del diseño. Reemplazar o borrar antes del lanzamiento.
fig: 3
title: "3D-printed mount for a temperature sensor"
summary: "A PETG mount that keeps the sensor away from the heat of the wall and prints without supports."
date: 2026-08-14
categories:
  - impresion-3d
  - home-automation
# Las imágenes son marcadores rayados: faltan las fotos reales.
cover: ./portada.jpg
coverAlt: "Placeholder: project cover photo"
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

## The problem

The sensor was stuck to the wall and read two degrees too high every afternoon: the wall heats up in the sun and passes that heat on to the sensor. I needed to move it away from the wall and let air flow around it.

I also wanted anyone to be able to print it on an ordinary printer, without supports and in under an hour.

## Design

- 25 mm gap between the sensor and the wall.
- Slots at the top and bottom so air moves through by convection.
- Snap fit: no screws, no glue.

![Placeholder: photo of the mount installed](./01-soporte-montado.jpg "The mount installed, with the sensor in place.")

![Placeholder: section render of the model](./02-corte-modelo.jpg "Section view of the model: the ventilation slots.")

## Printing

| Parameter | Value |
|---|---|
| Material | PETG |
| Layer height | 0.2 mm |
| Infill | 20% |

> If you print it in PLA, keep it out of direct sunlight: it warps.

## Configuration

```yaml
sensor:
  - platform: dallas_temp
    name: "Living"
    update_interval: 60s
```

## Video

It runs 3 minutes: assembly and test.
