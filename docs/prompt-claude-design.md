# Prompt para Claude Design: interfaz de brunofrankenstein.com

Copiar todo lo que está debajo de la línea y pegarlo en Claude Design.

---

Quiero diseñar la interfaz de mi sitio personal, `brunofrankenstein.com`. Antes de diseñar nada,
entrevístame: hazme las preguntas de la sección "Qué necesito que me preguntes", de a pocas por vez,
y recién después propón direcciones visuales.

## Quién soy y para qué es el sitio

Soy Bruno Frankenstein, ingeniero mecánico. El sitio es mi portfolio: muestra proyectos personales y
experiencias puntuales, con texto, fotos, animaciones y videos de YouTube. Lo van a leer posibles
empleadores y gente técnica, muchas veces desde el celular y con poco tiempo. Tiene que transmitir
criterio de ingeniería y trabajo hecho con las manos, no una plantilla genérica de portfolio.

## Qué ya existe y no se puede cambiar

El sitio ya está publicado y funcionando, con un estilo provisorio. Está hecho con Astro, es estático
y se publica en Cloudflare. El diseño se va a implementar a mano sobre ese código, así que necesito
que respetes esta estructura.

**Idiomas:** español e inglés. Cada página existe en los dos, con un selector de idioma siempre visible.
Los textos en español suelen ser más largos: el diseño tiene que tolerar ambos.

**Páginas:**

| Página | Qué contiene |
|---|---|
| Inicio | Presentación breve, proyectos destacados, acceso a las categorías |
| Sobre mí | Biografía, foto, enlaces a LinkedIn, GitHub y YouTube |
| Proyectos | Listado de todos los proyectos, con filtro por categoría |
| Categoría | Listado de los proyectos de una categoría |
| Proyecto | Portada, texto largo con imágenes intercaladas, video, enlace al repositorio |
| Experiencias | Listado de experiencias puntuales, con organización, rol y fechas |
| Contacto | Formulario (nombre, correo, mensaje) y enlace a LinkedIn |
| 404 | Página de error |

**Categorías de proyectos, en este orden:** Impresión 3D, Home Automation, Ingeniería Mecánica,
Baterías, Vibe Code, Otros. Un proyecto puede tener varias.

**Datos de cada proyecto:** título, resumen de hasta 160 caracteres, fecha, una o más categorías,
imagen de portada horizontal, etiquetas (materiales, herramientas), video de YouTube opcional,
enlace a GitHub opcional, y un cuerpo largo con subtítulos, párrafos, listas, tablas, imágenes y código.

**Al principio habrá pocos proyectos** (uno a tres). El inicio y los listados tienen que verse bien
con poco contenido y también con treinta.

## Restricciones técnicas

- HTML y CSS, con el mínimo de JavaScript. Nada que dependa de un framework de interfaz.
- Rápido: sin fondos de video, sin librerías de animación pesadas. Las animaciones, con CSS.
- Tipografías: de Google Fonts o del sistema, dos familias como máximo.
- Modo claro y modo oscuro.
- Diseñar primero para celular (360 píxeles de ancho) y después para escritorio.
- Accesibilidad WCAG 2.1 AA: contraste, foco visible, navegación con teclado, y respetar la
  preferencia de movimiento reducido.
- El texto largo de un proyecto es lo más importante: ancho de línea cómodo y buena jerarquía.

## Qué necesito que me preguntes

1. Qué impresión quiero causar en un empleador en los primeros diez segundos.
2. Sitios o portfolios que me gustan y que no me gustan, y por qué.
3. Preferencias de color, y si tengo algún color o logo propio.
4. Si prefiero algo sobrio y técnico, o algo más expresivo.
5. Qué estética me representa: plano técnico, taller, laboratorio, editorial, minimalista.
6. Cuánta animación quiero y dónde.
7. Qué va primero en el inicio: mi presentación o mis proyectos.
8. Cómo quiero que se vean los listados: tarjetas con imagen, lista compacta, o una mezcla.
9. Qué material tengo: foto de perfil, fotos de proyectos, texto de presentación.
10. Cualquier otra cosa que necesites para no adivinar.

## Qué necesito que entregues

Trabaja en este orden y espera mi aprobación entre pasos.

1. **Dos o tres direcciones visuales** distintas, mostradas sobre el inicio y la página de proyecto,
   para que elija una.
2. **Sistema de diseño** de la dirección elegida: colores para claro y oscuro, tipografías, escala de
   tamaños, espaciados, radios, sombras, y estados de enlaces y botones.
3. **Componentes:** cabecera con menú y selector de idioma (celular y escritorio), pie, tarjeta de
   proyecto, etiqueta de categoría, filtro de categorías, bloque de video, galería de imágenes,
   estilos del texto largo (subtítulos, listas, tablas, citas, código, imágenes con epígrafe),
   formulario con sus estados de error y de éxito, y estado vacío de un listado.
4. **Todas las páginas** de la tabla, en celular y escritorio, en claro y oscuro, con contenido realista
   en español.
5. **Entrega para implementar:** las variables de diseño como propiedades CSS, y el HTML y CSS de cada
   página y componente, con clases de nombres claros. Si puedes exportar un paquete de entrega para
   Claude Code, hazlo.

No cambies la lista de páginas ni los datos de un proyecto. Si crees que falta algo, proponlo aparte
y lo decidimos.
