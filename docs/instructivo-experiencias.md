# Instructivo: cargar una experiencia

Una experiencia es una entrada del cronograma de la página **Experiencias**: un estudio, un cargo, un equipo,
una estancia o una publicación. Es más corta que un proyecto: casi todo va en la cabecera y no hace falta cuerpo.

## Dónde va

```
src/content/experiencias/<slug>/
  es.md
  en.md
```

El `<slug>` va en minúsculas, sin tildes, con guiones (`faraday-lab`). Es el mismo en los dos idiomas.
No hay comando para crearla: copiar una carpeta existente y cambiar los datos.

## Cabecera

```markdown
---
title: "Investigador Grado 1 · Faraday Lab"
kind: trabajo
summary: "Electroquímica, modelado y seguridad térmica de baterías."
role: "Investigador Grado 1"
organization: "Faraday Lab"
place: "Dpto. de Termodinámica Aplicada · Facultad de Ingeniería, UdelaR"
start: 2024-03-01
end: 2025-06-30
link: "https://..."
tags:
  - Modelado
  - Docencia
---
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `title` | sí | Lo que se lee en el cronograma: cargo y lugar, o el nombre del estudio |
| `kind` | sí | `formacion` (estudios, estancias), `trabajo` (cargos, equipos) o `publicacion` (artículos). Es lo que usa el filtro de la página. Igual en los dos idiomas |
| `summary` | no | Una descripción de hasta 160 caracteres |
| `role`, `organization` | no | Cargo y organización |
| `place` | no | Renglón de contexto bajo el título: institución, ciudad, evento |
| `start` | no | Fecha de inicio `AAAA-MM-DD`. Sin ella, el cronograma muestra `[AÑO]` y la entrada va al final |
| `end` | no | Fecha de fin. Sin ella, la experiencia «sigue hasta hoy». Un hecho puntual (una publicación) lleva `start` y `end` iguales |
| `link` | no | Dirección completa a algo público (el artículo, el sitio del equipo) |
| `tags` | no | Temas. Si un tag está en el glosario, se abre su definición al tocarlo |
| `draft` | no | `true` la deja sin publicar |

## Reglas

- **No inventes nada:** fechas, cargos ni títulos. Lo que falta se deja fuera o se pregunta. El cronograma muestra
  un marcador visible donde falta la fecha.
- `kind`, `start` y `end` tienen que ser **idénticos** en `es.md` y `en.md`. El build avisa si no lo son.
- Ordena el cronograma la fecha de inicio, de la más reciente a la más vieja.
- Traducí el sentido, no palabra por palabra, y usá los nombres oficiales de las instituciones.
- Después de cambiar algo: `npm run build`, mirarlo con `npm run dev` y publicar con un pull request.
