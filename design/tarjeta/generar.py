#!/usr/bin/env python3
"""Tarjeta de presentación de Bruno Frankenstein, en el estilo «Cianotipo» del sitio.

Qué hace: dibuja el frente y el dorso (SVG), arma el PDF de imprenta (2 páginas, con sangrado y
tipografías incluidas) y saca imágenes de vista previa. Todo queda en la carpeta `salida/`.

Cómo usarlo (desde la carpeta del proyecto):
    pip install -r design/tarjeta/requirements.txt
    python design/tarjeta/generar.py

Para cambiar un dato (correo, rol, medidas) se edita el bloque «DATOS» de abajo y se vuelve a correr.
Necesita Microsoft Edge o Google Chrome instalado (para dibujar el PDF y las imágenes).

Nada de esto forma parte del sitio: vive solo en `design/` y no se publica.
"""
import base64
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import segno
except ImportError:
    sys.exit("Falta la librería del QR. Instalala con:  pip install segno")

AQUI = Path(__file__).resolve().parent
PROYECTO = AQUI.parent.parent
SALIDA = AQUI / "salida"

# ==========================================================================================
# DATOS: lo único que hace falta editar
# ==========================================================================================
DATOS = {
    "nombre": "Bruno Frankenstein",
    # Línea opcional bajo el nombre (por ejemplo un título o un área). Vacía = no se muestra.
    # Ojo: el sitio dice «ingeniero mecánico» pero el perfil dice que todavía estudia: confirmar antes de poner un título.
    "rol": "",
    # CONFIRMAR: esta dirección todavía hay que crearla (reenvío de correo en Cloudflare).
    # No poner acá el correo personal: este archivo es parte del proyecto.
    "correo": "contacto@brunofrankenstein.com",
    "web": "brunofrankenstein.com",
    "base": "MONTEVIDEO, UY",
    "telefono": "",  # Opcional. Reemplaza la fila «BASE» (caben 3 filas en total).
}

# Medidas en milímetros. CONFIRMAR con la imprenta: 90 × 50 mm es el tamaño habitual en Uruguay.
ANCHO, ALTO = 90.0, 50.0
SANGRADO = 3.0  # lo que se pasa del corte, para que no queden bordes blancos
MARGEN = 5.0  # nada importante a menos de esto del borde de corte

# El QR apunta a la dirección del sitio (se lee de src/config/site.ts para que no se desfasen).
# La raíz redirige al idioma principal (public/_redirects), así que sigue funcionando si cambia.
def leer_url_del_sitio():
    texto = (PROYECTO / "src/config/site.ts").read_text(encoding="utf-8")
    m = re.search(r"url:\s*'(https://[^']+)'", texto)
    if not m:
        sys.exit("No encontré la dirección del sitio en src/config/site.ts")
    return m.group(1)

URL = leer_url_del_sitio()

# Colores: los mismos de src/styles/tokens.css
PAPEL = "#0C2340"
TINTA = "#EAF3FC"
TINTA_SUAVE = "#A9C3DE"
LINEA = "#4C7199"
ACENTO = "#7FD6FF"


def mezclar(fondo, frente, alfa):
    """Color sólido que resulta de poner `frente` con transparencia `alfa` sobre `fondo`.
    Se usa para la retícula: en imprenta es mejor un color liso que una transparencia."""
    f = [int(fondo[i : i + 2], 16) for i in (1, 3, 5)]
    g = [int(frente[i : i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(a + (b - a) * alfa):02X}" for a, b in zip(f, g))


# En la web la retícula es al 8 %; en papel se pierde, así que acá va más marcada.
RETICULA = mezclar(PAPEL, "#A0CDFF", 0.15)
PASO_RETICULA = 5.0  # mm. 90 × 50 encaja justo: 18 × 10 cuadros

PT = 25.4 / 72  # milímetros por punto tipográfico


def pt(n):
    return round(n * PT, 3)


# ------------------------------------------------------------------------------------------
# El logo: se lee de public/favicon.svg para que sea EXACTAMENTE el del sitio.
# ------------------------------------------------------------------------------------------
def leer_logo():
    svg = (PROYECTO / "public/favicon.svg").read_text(encoding="utf-8")
    marco = re.search(r'<rect x="2.5"[^>]*/>', svg)
    trazos = re.findall(r'<path stroke-width="2" d="([^"]+)"/>', svg)
    if not marco or len(trazos) != 2:
        sys.exit("El favicon cambió de forma: revisar leer_logo() en generar.py")
    return marco.group(0), trazos


def logo(x, y, tam, relleno=True):
    """El monograma BF, de `tam` mm de lado, con la esquina superior izquierda en (x, y)."""
    marco, trazos = leer_logo()
    fondo = f'<rect width="32" height="32" fill="{PAPEL}"/>' if relleno else ""
    paths = "".join(f'<path stroke-width="2" d="{d}"/>' for d in trazos)
    return (
        f'<g transform="translate({x} {y}) scale({tam / 32:.5f})">{fondo}'
        f'<g fill="none" stroke="{ACENTO}" stroke-linecap="square" stroke-linejoin="miter">{marco}{paths}</g></g>'
    )


# ------------------------------------------------------------------------------------------
# Piezas de dibujo técnico
# ------------------------------------------------------------------------------------------
def texto(x, y, s, tam_pt, color, familia="m", anchor="start", extra=""):
    return (
        f'<text class="{familia}" x="{x}" y="{y}" font-size="{pt(tam_pt)}" fill="{color}" '
        f'text-anchor="{anchor}" {extra}>{s}</text>'
    )


def reticula():
    """Cuadrícula de 5 mm que llega hasta el sangrado. No se dibujan las líneas del borde de corte."""
    lineas = []
    x = PASO_RETICULA
    while x < ANCHO:
        lineas.append(f"M{x:g} {-SANGRADO}V{ALTO + SANGRADO}")
        x += PASO_RETICULA
    y = PASO_RETICULA
    while y < ALTO:
        lineas.append(f"M{-SANGRADO} {y:g}H{ANCHO + SANGRADO}")
        y += PASO_RETICULA
    return f'<path d="{"".join(lineas)}" stroke="{RETICULA}" stroke-width="0.12" fill="none"/>'


def esquinas(x0, y0, x1, y1, brazo, color, grosor=0.2):
    """Cuatro «miras» en las esquinas de un rectángulo (el ícono deco-esquina del sitio)."""
    d = (
        f"M{x0} {y0 + brazo}V{y0}H{x0 + brazo} "
        f"M{x1 - brazo} {y0}H{x1}V{y0 + brazo} "
        f"M{x1} {y1 - brazo}V{y1}H{x1 - brazo} "
        f"M{x0 + brazo} {y1}H{x0}V{y1 - brazo}"
    )
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{grosor}" stroke-linecap="square"/>'


# ------------------------------------------------------------------------------------------
# DORSO: la cara útil (dos reglas en mm + transportador), a escala 1:1
# ------------------------------------------------------------------------------------------
def regla_horizontal():
    """Regla de 80 mm pegada al margen de arriba. El cero está en x = MARGEN (no en el borde de corte),
    así la medida no depende de cómo caiga el corte."""
    x0, y0, largo = MARGEN, MARGEN, 80
    d_fino, d_cm = [], []
    for mm in range(largo + 1):
        x = x0 + mm
        tam = 3.6 if mm % 10 == 0 else 2.4 if mm % 5 == 0 else 1.4
        (d_cm if mm % 10 == 0 else d_fino).append(f"M{x:g} {y0}v{tam}")
    partes = [
        f'<path d="M{x0} {y0}H{x0 + largo}" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
        f'<path d="{"".join(d_fino)}" stroke="{ACENTO}" stroke-width="0.14" fill="none"/>',
        f'<path d="{"".join(d_cm)}" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
    ]
    for cm in range(largo // 10 + 1):
        partes.append(texto(x0 + cm * 10, y0 + 3.6 + 2.8, str(cm), 6.5, TINTA_SUAVE, anchor="middle"))
    return "".join(partes)


def regla_vertical():
    """Regla de 30 mm en el borde izquierdo. Su cero está abajo, a la altura de la base del transportador,
    y sube. Cada regla tiene su propio cero, así los números no se pisan en la esquina."""
    x0, y_cero, largo = MARGEN, ALTO - MARGEN, 30
    d_fino, d_cm = [], []
    for mm in range(largo + 1):
        y = y_cero - mm
        tam = 3.6 if mm % 10 == 0 else 2.4 if mm % 5 == 0 else 1.4
        (d_cm if mm % 10 == 0 else d_fino).append(f"M{x0} {y:g}h{tam}")
    partes = [
        f'<path d="M{x0} {y_cero}V{y_cero - largo}" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
        f'<path d="{"".join(d_fino)}" stroke="{ACENTO}" stroke-width="0.14" fill="none"/>',
        f'<path d="{"".join(d_cm)}" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
    ]
    for cm in range(largo // 10 + 1):
        partes.append(texto(x0 + 3.6 + 1.0, y_cero - cm * 10 + 0.8, str(cm), 6.5, TINTA_SUAVE))
    return "".join(partes)


def transportador(cx, cy, radio):
    """Transportador de 180°: marcas cada 1°, 5° y 10°, números cada 15° y rayas de referencia
    (30°, 45°, 60°, 90°, 120°, 135°, 150°) para medir o trasladar ángulos."""
    from math import cos, sin, radians

    def punto(grados, r):
        a = radians(grados)
        return cx + r * cos(a), cy - r * sin(a)

    fino, grueso = [], []
    for g in range(181):
        tam = 4.0 if g % 10 == 0 else 2.6 if g % 5 == 0 else 1.5
        (x1, y1), (x2, y2) = punto(g, radio), punto(g, radio - tam)
        (grueso if g % 10 == 0 else fino).append(f"M{x1:.3f} {y1:.3f}L{x2:.3f} {y2:.3f}")
    x_izq, y_arco = punto(180, radio)
    x_der, _ = punto(0, radio)
    partes = [
        # base y arco
        f'<path d="M{x_izq:.3f} {cy}H{x_der:.3f} M{x_der:.3f} {cy}A{radio} {radio} 0 0 0 {x_izq:.3f} {cy}" '
        f'stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
        f'<path d="{"".join(fino)}" stroke="{ACENTO}" stroke-width="0.13" fill="none"/>',
        f'<path d="{"".join(grueso)}" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>',
    ]
    # rayas de referencia, de un radio chico hasta antes de los números
    rayas = []
    for g in (30, 45, 60, 90, 120, 135, 150):
        (x1, y1), (x2, y2) = punto(g, 11.0), punto(g, radio - 11.5)
        rayas.append(f"M{x1:.3f} {y1:.3f}L{x2:.3f} {y2:.3f}")
    partes.append(
        f'<path d="{"".join(rayas)}" stroke="{LINEA}" stroke-width="0.14" stroke-dasharray="0.9 0.7" fill="none"/>'
    )
    # números cada 15°
    for g in range(0, 181, 15):
        x, y = punto(g, radio - 7.6)
        partes.append(texto(f"{x:.2f}", f"{min(y, cy - 1.7) + 0.8:.2f}", str(g), 6.5, TINTA_SUAVE, anchor="middle"))
    # cruz del vértice
    partes.append(f'<path d="M{cx - 1.2} {cy}h2.4 M{cx} {cy - 1.2}v2.4" stroke="{ACENTO}" stroke-width="0.2" fill="none"/>')
    return "".join(partes)


def cara_regla():
    cx, cy, radio = ANCHO / 2, ALTO - MARGEN + 0.0, 30.0
    lado = 10.0
    return "".join(
        [
            f'<rect x="{-SANGRADO}" y="{-SANGRADO}" width="{ANCHO + 2 * SANGRADO}" height="{ALTO + 2 * SANGRADO}" fill="{PAPEL}"/>',
            reticula(),
            regla_horizontal(),
            regla_vertical(),
            transportador(cx, cy, radio),
            # el logo hace de «eje» del transportador; va encima de las rayas
            logo(cx - lado / 2, cy - lado - 4.0, lado),
            texto(ANCHO - MARGEN, ALTO / 2 + 6, "ESC 1:1", 6.5, TINTA_SUAVE, anchor="end", extra='letter-spacing="0.15"'),
        ]
    )


# ------------------------------------------------------------------------------------------
# FRENTE: nombre, contacto y QR
# ------------------------------------------------------------------------------------------
def qr_como_trazo(modulos_por_lado_con_margen_mm, x, y):
    """El QR como un solo trazo de rectángulos. Módulos oscuros sobre un panel claro con zona
    de silencio de 4 módulos, que es lo que pide la norma para que lo lea cualquier cámara."""
    qr = segno.make(URL, error="m", micro=False)
    n = qr.symbol_size(border=0)[0]
    borde = 4
    total = n + 2 * borde
    m = modulos_por_lado_con_margen_mm / total  # mm por módulo
    corridas = []
    for fila, datos in enumerate(qr.matrix):
        col = 0
        while col < n:
            if datos[col]:
                ini = col
                while col < n and datos[col]:
                    col += 1
                corridas.append(f"M{ini + borde} {fila + borde}h{col - ini}v1h{-(col - ini)}z")
            else:
                col += 1
    return (
        f'<g transform="translate({x} {y}) scale({m:.5f})">'
        f'<rect width="{total}" height="{total}" fill="{TINTA}"/>'
        f'<path d="{"".join(corridas)}" fill="{PAPEL}" shape-rendering="crispEdges"/></g>'
    ), n, m


def cara_datos():
    filas = [("CORREO", DATOS["correo"]), ("WEB", DATOS["web"]), ("BASE", DATOS["base"])]
    if DATOS["telefono"]:
        filas.insert(1, ("TEL", DATOS["telefono"]))
        filas.pop()  # caben tres: el teléfono reemplaza a «BASE»
    if len(filas) > 3:
        sys.exit("Caben 3 filas de contacto como máximo.")

    panel = 24.0
    px, py = ANCHO - MARGEN - panel, MARGEN
    qr, n, m = qr_como_trazo(panel, px, py)

    partes = [
        f'<rect x="{-SANGRADO}" y="{-SANGRADO}" width="{ANCHO + 2 * SANGRADO}" height="{ALTO + 2 * SANGRADO}" fill="{PAPEL}"/>',
        reticula(),
        # Nombre
        texto(MARGEN, 10.6, DATOS["nombre"], 14.5, TINTA, familia="s", extra='font-weight="600" letter-spacing="-0.02"'),
    ]
    if DATOS["rol"]:
        partes.append(texto(MARGEN, 15.6, DATOS["rol"], 6.5, ACENTO, extra='letter-spacing="0.15"'))
    sep = 19.0 if DATOS["rol"] else 15.4  # sin rol, la raya sube y las filas se reparten mejor
    # Raya separadora con topes en las puntas (como una cota)
    partes.append(
        f'<path d="M{MARGEN} {sep}H{px - 4.5} M{MARGEN} {sep - 0.8}v1.6 M{px - 4.5} {sep - 0.8}v1.6" '
        f'stroke="{LINEA}" stroke-width="0.15" fill="none"/>'
    )
    y0, paso = (23.6, 8.0) if DATOS["rol"] else (22.0, 8.6)
    for i, (rotulo, valor) in enumerate(filas):
        y = y0 + i * paso
        partes.append(texto(MARGEN, y, rotulo, 6.5, TINTA_SUAVE, extra='letter-spacing="0.15"'))
        partes.append(texto(MARGEN, y + 3.3, valor, 7.5, TINTA))
    partes += [
        esquinas(px - 1.5, py - 1.5, px + panel + 1.5, py + panel + 1.5, 2.6, ACENTO, 0.2),
        qr,
        texto(px, py + panel + 5.6, "↑ ESCANEAR", 6.5, ACENTO, extra='letter-spacing="0.15"'),
        logo(ANCHO - MARGEN - 8, ALTO - MARGEN - 8, 8),
    ]
    return "".join(partes), n, m


# ------------------------------------------------------------------------------------------
# Armado de archivos
# ------------------------------------------------------------------------------------------
def fuente_base64(nombre):
    datos = (PROYECTO / "public/fonts" / nombre).read_bytes()
    return base64.b64encode(datos).decode()


def estilo_fuentes():
    """Las tipografías del sitio, metidas dentro del propio archivo para que no dependan de nada."""
    return (
        "<style>"
        '@font-face{font-family:"Instrument Sans";font-weight:400 700;font-style:normal;'
        f'src:url(data:font/woff2;base64,{fuente_base64("InstrumentSans-latin.woff2")}) format("woff2");}}'
        '@font-face{font-family:"Fragment Mono";font-weight:400;font-style:normal;'
        f'src:url(data:font/woff2;base64,{fuente_base64("FragmentMono-latin.woff2")}) format("woff2");}}'
        '.m{font-family:"Fragment Mono",monospace;font-weight:400}'
        '.s{font-family:"Instrument Sans",sans-serif}'
        "text{font-kerning:normal;text-rendering:geometricPrecision}"
        "</style>"
    )


def svg(contenido, con_sangrado=True, ancho_css=None):
    s = SANGRADO if con_sangrado else 0
    caja = f"{-s} {-s} {ANCHO + 2 * s} {ALTO + 2 * s}"
    dim = f' width="{ancho_css}"' if ancho_css else f' width="{ANCHO + 2 * s}mm" height="{ALTO + 2 * s}mm"'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{caja}"{dim}>'
        f"{estilo_fuentes()}{contenido}</svg>"
    )


def buscar_navegador():
    if os.environ.get("NAVEGADOR"):
        return os.environ["NAVEGADOR"]
    for c in (
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
        "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
        "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
    ):
        if Path(c).exists():
            return c
    sys.exit("No encontré Edge ni Chrome. Indicá la ruta con la variable NAVEGADOR.")


def navegador(args, archivo_html):
    """Corre Edge/Chrome sin ventana, con un perfil propio para que no se mezcle con el tuyo."""
    perfil = tempfile.mkdtemp(prefix="tarjeta-")
    try:
        subprocess.run(
            [buscar_navegador(), "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
             f"--user-data-dir={perfil}", "--virtual-time-budget=4000", *args, archivo_html.as_uri()],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120,
        )
    finally:
        shutil.rmtree(perfil, ignore_errors=True)


def ajustar_cajas_pdf(ruta):
    """Edge redondea el tamaño de la página (deja ~0,1 mm de blanco). Acá se recorta a la medida exacta
    y se marca dónde está el corte (TrimBox) y el sangrado (BleedBox), que es lo que leen las imprentas."""
    try:
        from pypdf import PdfReader, PdfWriter
        from pypdf.generic import RectangleObject
    except ImportError:
        print("Aviso: sin pypdf el PDF no lleva marcado el corte. Instalalo con:  pip install pypdf")
        return
    mm = 72 / 25.4
    lector, escritor = PdfReader(str(ruta)), PdfWriter()
    for pag in lector.pages:
        ancho, alto = float(pag.mediabox.width), float(pag.mediabox.height)
        y0 = max(0.0, alto - (ALTO + 2 * SANGRADO) * mm)  # el contenido está pegado arriba
        x1 = min(ancho, (ANCHO + 2 * SANGRADO) * mm)
        caja = RectangleObject([0, y0, x1, alto])
        pag.mediabox = pag.cropbox = pag.bleedbox = caja
        izq = (x1 - ANCHO * mm) / 2
        pag.trimbox = RectangleObject([izq, y0 + SANGRADO * mm, izq + ANCHO * mm, y0 + (SANGRADO + ALTO) * mm])
        escritor.add_page(pag)
    with open(ruta, "wb") as f:
        escritor.write(f)


def pagina_html(cuerpo, css=""):
    return f'<!doctype html><meta charset="utf-8"><style>html,body{{margin:0;padding:0;background:#fff}}{css}</style>{cuerpo}'


def main():
    SALIDA.mkdir(exist_ok=True)
    cara_frente, n_qr, mm_modulo = cara_datos()  # frente: datos y QR
    cara_dorso = cara_regla()  # dorso: regla y transportador

    # 1) SVG sueltos (para ver, o para abrir en un editor). Con sangrado.
    (SALIDA / "frente.svg").write_text(svg(cara_frente), encoding="utf-8")
    (SALIDA / "dorso.svg").write_text(svg(cara_dorso), encoding="utf-8")

    tmp = Path(tempfile.mkdtemp(prefix="tarjeta-html-"))
    try:
        # 2) PDF de imprenta: 2 páginas de (90+6) × (50+6) mm, con las tipografías incluidas.
        w, h = ANCHO + 2 * SANGRADO, ALTO + 2 * SANGRADO
        css = (
            f"@page{{size:{w:g}mm {h:g}mm;margin:0}}"
            f".p{{width:{w:g}mm;height:{h:g}mm;overflow:hidden;break-after:page}}"
            ".p:last-child{break-after:auto}svg{display:block}"
        )
        html = tmp / "imprenta.html"
        html.write_text(pagina_html(f'<div class="p">{svg(cara_frente)}</div><div class="p">{svg(cara_dorso)}</div>', css), encoding="utf-8")
        navegador([f"--print-to-pdf={SALIDA / 'tarjeta-imprenta.pdf'}", "--no-pdf-header-footer"], html)
        ajustar_cajas_pdf(SALIDA / "tarjeta-imprenta.pdf")

        # 3) Imágenes con sangrado (2400 px de ancho) y una vista previa de las dos caras ya recortadas.
        for nombre, cara in (("frente", cara_frente), ("dorso", cara_dorso)):
            html = tmp / f"{nombre}.html"
            html.write_text(pagina_html(svg(cara, ancho_css="960px"), "svg{display:block}"), encoding="utf-8")
            navegador([f"--screenshot={SALIDA / (nombre + '.png')}", "--window-size=960,560", "--force-device-scale-factor=2.5"], html)

        prev = tmp / "vista-previa.html"
        css = "html,body{background:#D5DCE4}.f{display:flex;gap:40px;padding:50px;width:max-content}svg{display:block}"
        prev.write_text(
            pagina_html(
                f'<div class="f">{svg(cara_frente, False, "900px")}{svg(cara_dorso, False, "900px")}</div>', css
            ),
            encoding="utf-8",
        )
        navegador([f"--screenshot={SALIDA / 'vista-previa.png'}", "--window-size=1940,600", "--force-device-scale-factor=1.5"], prev)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print(f"Listo. Archivos en {SALIDA}")
    print(f"QR: {n_qr} x {n_qr} modulos, {mm_modulo:.2f} mm por modulo, apunta a {URL}")


if __name__ == "__main__":
    main()
