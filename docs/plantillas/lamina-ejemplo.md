---
# PLANTILLA: copiar el cuerpo a es.md / en.md de una lámina real. Este archivo no se publica.
# Los comentarios con «#» son solo para vos; los comentarios <!-- --> de abajo también.
fig: 5
title: "Qué es la cosa, sin adjetivos de venta"
summary: "Una oración: qué es y qué logró. Máximo 160 caracteres."
date: 2026-11-15
categories:
  - ingenieria-mecanica
cover: ./portada.jpg
coverAlt: "Descripción de lo que se ve en la portada"
# youtube: "ID_DEL_VIDEO"
# repo: "https://github.com/usuario/repositorio"
tags:
  - Fusion 360
---

Primer párrafo: qué es, para qué sirve y cuál fue el resultado. Tiene que entenderse solo.

<!-- Los títulos «##» se numeran solos (01, 02…) y arman el índice lateral. No usar «#». -->

## El problema

Qué se quería lograr y por qué.

## Proceso

<!-- Imagen: texto alternativo obligatorio, describe lo que se ve. -->
<!-- El pie de foto va en cursiva, en la línea de abajo, SIN línea en blanco en medio. -->
![Pieza recién impresa, todavía con los soportes](./01-pieza-recien-impresa.jpg)
*La pieza recién salida de la impresora.*

<!-- Dos imágenes seguidas, cada una en su párrafo y sin texto en medio, se muestran lado a lado. -->
![Vista frontal del montaje](./02-vista-frontal.jpg)
*Vista frontal.*

![Vista en corte del montaje](./03-corte.jpg)
*Corte del modelo.*

<!-- Una línea que empieza con «>» se muestra como recuadro NOTA. -->
> Si lo imprimís en PLA, no lo pongas al sol directo: se deforma.

<!-- Tabla para especificaciones. -->
| Parámetro | Valor |
|---|---|
| Material | PETG |
| Altura de capa | 0,2 mm |

<!-- Código: indicar el lenguaje después de las tres comillas invertidas. Se agrega botón «Copiar». -->
```yaml
sensor:
  - platform: dallas_temp
    name: "Living"
```

## Resultados

Con números: tiempo, costo, peso, tolerancias, consumo.

## Qué aprendí

Incluir lo que salió mal y cómo se corrigió.

<!-- Video: se carga con el campo `youtube` de arriba. Igual describir en texto lo que muestra,
     porque buscadores y asistentes de IA no ven el video. -->
