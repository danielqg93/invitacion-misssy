"""
Genera las ilustraciones vectoriales (SVG) de la invitación en public/img/vector/.

    python scripts/generar-ilustraciones.py

Todas son dibujos originales hechos con formas simples. Cada archivo es
independiente (se usa con <img>), por eso las piezas compartidas
(conejita, flor, mariposa, moño) se repiten dentro de cada SVG.
Las animaciones (parpadeo, aleteo) van en un <style> dentro del SVG.
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "img" / "vector"

# Paleta
PIEL = "#f6e4d3"
PIEL_SOMBRA = "#ebcdb4"
TRAZO = "#c59a86"
OREJA = "#f7bccb"
ROSA = "#f3a5b8"
ROSA_OSC = "#e2879d"
ROSA_CLARO = "#fcdbe3"
TUL_1 = "#f9c9d5"
TUL_2 = "#fde3ea"
OJO = "#4b3533"
HOJA = "#a8c49c"
HOJA_OSC = "#8fb083"
DORADO = "#f5d58c"

ESTILO = """
<style>
  .ojo { transform-box: fill-box; transform-origin: center; animation: parpadeo 4.5s infinite; }
  @keyframes parpadeo { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.12); } }
  .ala-i, .ala-d { transform-box: view-box; animation: aleteo 0.55s ease-in-out infinite alternate; }
  .ala-i { transform-origin: 100px 92px; }
  .ala-d { transform-origin: 100px 92px; }
  @keyframes aleteo { to { transform: scaleX(0.5); } }
  .oreja { transform-box: fill-box; transform-origin: 50% 100%; animation: oreja 3.2s ease-in-out infinite; }
  @keyframes oreja { 0%, 80%, 100% { transform: rotate(0deg); } 88% { transform: rotate(-7deg); } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
"""


def svg(view_box: str, body: str, defs: str = "", style: str = ESTILO) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}">'
        f"{style}<defs>{DEFS}{defs}</defs>{body}</svg>\n"
    )


DEFS = f"""
<radialGradient id="gNube" cx="45%" cy="35%" r="75%">
  <stop offset="0" stop-color="#ffffff"/>
  <stop offset="0.65" stop-color="#fff6f8"/>
  <stop offset="1" stop-color="#f9dbe4"/>
</radialGradient>
<linearGradient id="gAla" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fde3ea"/>
  <stop offset="0.55" stop-color="#f6b3c3"/>
  <stop offset="1" stop-color="#e8899f"/>
</linearGradient>
<linearGradient id="gAla2" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fbe7d9"/>
  <stop offset="1" stop-color="#f2b7a6"/>
</linearGradient>
<linearGradient id="gMono" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#f7b7c6"/>
  <stop offset="1" stop-color="#e48da2"/>
</linearGradient>
<linearGradient id="gCinta" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#f8c3cf"/>
  <stop offset="1" stop-color="#eda1b3"/>
</linearGradient>
<radialGradient id="gPiel" cx="45%" cy="35%" r="70%">
  <stop offset="0" stop-color="#fbf0e6"/>
  <stop offset="1" stop-color="{PIEL}"/>
</radialGradient>
"""


# ------------------------------------------------------------------ piezas


def mono(x: float, y: float, s: float = 1.0) -> str:
    """Moño rosado centrado en (x, y)."""
    return f"""
<g transform="translate({x} {y}) scale({s})" stroke="{ROSA_OSC}" stroke-width="2" stroke-linejoin="round">
  <path d="M-4 4 L-22 46 L-12 41 L-6 52 L2 8Z" fill="url(#gMono)"/>
  <path d="M4 4 L22 46 L12 41 L6 52 L-2 8Z" fill="url(#gMono)"/>
  <path d="M0 0 C-22 -30 -58 -26 -55 0 C-52 26 -20 22 0 0Z" fill="url(#gMono)"/>
  <path d="M0 0 C22 -30 58 -26 55 0 C52 26 20 22 0 0Z" fill="url(#gMono)"/>
  <path d="M-8 -2 C-22 -16 -42 -14 -42 -2" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
  <path d="M8 -2 C22 -16 42 -14 42 -2" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="0" cy="1" rx="10" ry="11" fill="{ROSA}"/>
</g>"""


def flor(x: float, y: float, r: float, color: str, centro: str = DORADO, rot: float = 0) -> str:
    """Flor de 5 pétalos."""
    petalos = "".join(
        f'<ellipse cx="0" cy="{-r * 0.62:.1f}" rx="{r * 0.42:.1f}" ry="{r * 0.62:.1f}" '
        f'transform="rotate({i * 72})" fill="{color}" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>'
        for i in range(5)
    )
    vetas = "".join(
        f'<path d="M0 {-r * 0.2:.1f} L0 {-r * 0.8:.1f}" transform="rotate({i * 72})" '
        f'stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>'
        for i in range(5)
    )
    puntos = "".join(
        f'<circle cx="{r * 0.16:.1f}" cy="0" r="{r * 0.05 + 0.6:.1f}" transform="rotate({i * 60 + 30})" fill="#d9a54f"/>'
        for i in range(6)
    )
    return (
        f'<g transform="translate({x} {y}) rotate({rot})">{petalos}{vetas}'
        f'<circle r="{r * 0.26:.1f}" fill="{centro}"/>{puntos}</g>'
    )


def hoja(x: float, y: float, largo: float, rot: float, color: str = HOJA) -> str:
    l = largo
    return (
        f'<g transform="translate({x} {y}) rotate({rot})">'
        f'<path d="M0 0 C{l * 0.3:.1f} {-l * 0.28:.1f} {l * 0.75:.1f} {-l * 0.22:.1f} {l} 0 '
        f'C{l * 0.75:.1f} {l * 0.22:.1f} {l * 0.3:.1f} {l * 0.28:.1f} 0 0Z" fill="{color}"/>'
        f'<path d="M2 0 L{l * 0.85:.1f} 0" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/></g>'
    )


def capullo(x: float, y: float, s: float, color: str, rot: float = 0) -> str:
    return (
        f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
        f'<path d="M0 -12 C8 -10 9 2 0 8 C-9 2 -8 -10 0 -12Z" fill="{color}"/>'
        f'<path d="M-6 4 C-3 10 3 10 6 4 L0 12Z" fill="{HOJA_OSC}"/></g>'
    )


def mariposa(animada: bool = True, rosa: bool = True) -> str:
    """Mariposa en un cuadro de 200x180 (centro del cuerpo en 100, 92)."""
    grad = "url(#gAla)" if rosa else "url(#gAla2)"
    ci = ' class="ala-i"' if animada else ""
    cd = ' class="ala-d"' if animada else ""
    ala = f"""
  <path d="M100 84 C78 30 30 4 14 34 C0 62 40 92 100 90Z" fill="{grad}" stroke="{ROSA_OSC}" stroke-width="2"/>
  <path d="M100 96 C70 98 34 118 46 146 C58 172 92 140 100 100Z" fill="{grad}" stroke="{ROSA_OSC}" stroke-width="2"/>
  <path d="M96 84 C80 52 50 34 34 44" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="44" cy="46" r="9" fill="#fff" opacity=".55"/>
  <circle cx="60" cy="66" r="5" fill="#fff" opacity=".5"/>
  <circle cx="64" cy="130" r="7" fill="#fff" opacity=".5"/>
  <circle cx="30" cy="38" r="3" fill="{ROSA_OSC}" opacity=".6"/>"""
    return f"""
<g{ci}>{ala}</g>
<g{cd}><g transform="translate(200 0) scale(-1 1)">{ala}</g></g>
<path d="M98 62 C92 44 82 36 74 36" fill="none" stroke="#9c6e6a" stroke-width="2" stroke-linecap="round"/>
<path d="M102 62 C108 44 118 36 126 36" fill="none" stroke="#9c6e6a" stroke-width="2" stroke-linecap="round"/>
<circle cx="74" cy="36" r="3.5" fill="#9c6e6a"/><circle cx="126" cy="36" r="3.5" fill="#9c6e6a"/>
<ellipse cx="100" cy="98" rx="6" ry="30" fill="#a77672"/>
<circle cx="100" cy="66" r="8" fill="#a77672"/>
<path d="M96 84 h8 M95 94 h10 M95 104 h10 M96 114 h8" stroke="#c39591" stroke-width="1.6"/>
"""


def conejita(x: float = 0, y: float = 0, s: float = 1.0) -> str:
    """Conejita con tutú en un cuadro de 300x400."""
    def falda(y0: float, ancho: float, alto: float, color: str, borde: str) -> str:
        n = 7
        x0, x1 = 150 - ancho / 2, 150 + ancho / 2
        cintura = ancho * 0.36
        d = f"M{150 - cintura:.1f} {y0} Q150 {y0 - 8} {150 + cintura:.1f} {y0} L{x1:.1f} {y0 + alto:.1f} "
        paso = ancho / n
        for i in range(n):
            xa = x1 - paso * i
            xb = xa - paso
            d += f"Q{(xa + xb) / 2:.1f} {y0 + alto + 16:.1f} {xb:.1f} {y0 + alto:.1f} "
        d += "Z"
        return f'<path d="{d}" fill="{color}" stroke="{borde}" stroke-width="1.6" stroke-linejoin="round"/>'

    tutu_atras = falda(282, 200, 44, TUL_1, "#eaa6b7")
    tutu_frente = falda(280, 160, 34, TUL_2, "#f2b9c8") + (
        f'<path d="M104 282 Q150 270 196 282" fill="none" stroke="{ROSA}" stroke-width="7" stroke-linecap="round"/>'
    )
    brillos = "".join(
        f'<circle cx="{c[0]}" cy="{c[1]}" r="1.8" fill="#fff"/>'
        for c in [(92, 312), (124, 300), (168, 304), (206, 314), (110, 326), (190, 328), (150, 318)]
    )
    return f"""
<g transform="translate({x} {y}) scale({s})">
  <ellipse cx="150" cy="388" rx="96" ry="9" fill="#efc9d3" opacity=".55"/>
  <!-- orejas -->
  <g class="oreja">
    <path d="M112 150 C82 92 84 24 114 16 C142 10 150 82 140 146Z" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
    <path d="M118 140 C98 96 100 42 116 34 C132 30 136 86 132 138Z" fill="{OREJA}"/>
  </g>
  <path d="M162 146 C168 70 196 22 222 32 C248 44 214 112 188 152Z" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
  <path d="M170 140 C178 84 198 46 214 50 C230 58 206 108 184 146Z" fill="{OREJA}"/>
  <!-- patitas -->
  <ellipse cx="112" cy="370" rx="32" ry="17" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
  <ellipse cx="188" cy="370" rx="32" ry="17" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
  <ellipse cx="104" cy="372" rx="10" ry="7" fill="{OREJA}"/>
  <ellipse cx="196" cy="372" rx="10" ry="7" fill="{OREJA}"/>
  <!-- cuerpo -->
  <ellipse cx="150" cy="292" rx="60" ry="66" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
  <ellipse cx="150" cy="276" rx="30" ry="34" fill="#fff" opacity=".45"/>
  <!-- tutú -->
  {tutu_atras}{tutu_frente}{brillos}
  <!-- bracitos -->
  <ellipse cx="124" cy="262" rx="13" ry="22" transform="rotate(25 124 262)" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2"/>
  <ellipse cx="176" cy="262" rx="13" ry="22" transform="rotate(-25 176 262)" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2"/>
  <!-- cabeza -->
  <ellipse cx="150" cy="186" rx="76" ry="64" fill="url(#gPiel)" stroke="{TRAZO}" stroke-width="2.2"/>
  <ellipse cx="150" cy="226" rx="34" ry="18" fill="#fff" opacity=".5"/>
  <!-- mejillas -->
  <ellipse cx="104" cy="210" rx="15" ry="10" fill="#f6a3b4" opacity=".55"/>
  <ellipse cx="196" cy="210" rx="15" ry="10" fill="#f6a3b4" opacity=".55"/>
  <!-- ojos -->
  <g class="ojo"><ellipse cx="122" cy="188" rx="10" ry="12.5" fill="{OJO}"/>
    <circle cx="126" cy="182" r="4" fill="#fff"/><circle cx="119" cy="194" r="1.8" fill="#fff"/></g>
  <g class="ojo"><ellipse cx="178" cy="188" rx="10" ry="12.5" fill="{OJO}"/>
    <circle cx="182" cy="182" r="4" fill="#fff"/><circle cx="175" cy="194" r="1.8" fill="#fff"/></g>
  <path d="M110 176 l-6 -4 M113 172 l-4 -6" stroke="{OJO}" stroke-width="2" stroke-linecap="round"/>
  <path d="M190 176 l6 -4 M187 172 l4 -6" stroke="{OJO}" stroke-width="2" stroke-linecap="round"/>
  <!-- nariz y boca -->
  <path d="M143 204 Q150 199 157 204 Q153 212 150 212 Q147 212 143 204Z" fill="#ec8fa3"/>
  <path d="M150 212 Q148 221 139 220 M150 212 Q152 221 161 220" fill="none" stroke="#b07c70" stroke-width="2" stroke-linecap="round"/>
  <path d="M86 202 l-22 -4 M86 210 l-22 2 M214 202 l22 -4 M214 210 l22 2" stroke="#d6b5a6" stroke-width="1.4" stroke-linecap="round"/>
  <!-- moño en la cabeza -->
  {mono(122, 136, 0.62)}
</g>"""


def nube_forma(x: float, y: float, s: float = 1.0, uid: str = "n") -> str:
    """Nube esponjosa en un cuadro de 400x230."""
    circulos = [(120, 150, 66), (200, 112, 82), (284, 146, 66), (330, 184, 46), (72, 188, 46), (240, 170, 70), (160, 176, 64)]
    formas = "".join(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>' for cx, cy, r in circulos) + '<rect x="72" y="170" width="266" height="62" rx="31"/>'
    return f"""
<defs>
  <clipPath id="clip-{uid}">{formas}</clipPath>
  <linearGradient id="sombra-{uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0.5" stop-color="#f6c6d3" stop-opacity="0"/>
    <stop offset="1" stop-color="#f6c6d3" stop-opacity=".5"/>
  </linearGradient>
</defs>
<g transform="translate({x} {y}) scale({s})">
  <g fill="#f2c1cf" transform="translate(0 9)">{formas}</g>
  <g fill="#fffafb">{formas}</g>
  <rect x="0" y="0" width="400" height="240" fill="url(#sombra-{uid})" clip-path="url(#clip-{uid})"/>
  <path d="M150 96 C160 70 190 52 218 58" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  <path d="M82 170 C86 156 98 146 112 144" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <circle cx="262" cy="98" r="7" fill="#fff"/>
</g>"""


def ramita(x: float, y: float, rot: float, s: float = 1.0) -> str:
    return (
        f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
        f'<path d="M0 0 C20 -10 46 -12 70 -6" fill="none" stroke="{HOJA_OSC}" stroke-width="2"/>'
        + hoja(14, -4, 26, -40)
        + hoja(30, -8, 24, 35, HOJA_OSC)
        + hoja(44, -9, 24, -35)
        + hoja(58, -7, 20, 30, HOJA_OSC)
        + "</g>"
    )


def estrella(x: float, y: float, r: float, color: str = "#fff") -> str:
    return (
        f'<path transform="translate({x} {y})" d="M0 {-r} Q{r * 0.18} {-r * 0.18} {r} 0 '
        f'Q{r * 0.18} {r * 0.18} 0 {r} Q{-r * 0.18} {r * 0.18} {-r} 0 Q{-r * 0.18} {-r * 0.18} 0 {-r}Z" fill="{color}"/>'
    )


# ------------------------------------------------------------------ archivos


def archivo_conejita() -> str:
    return svg("0 0 300 400", conejita())


def archivo_mariposa() -> str:
    return svg("0 0 200 180", mariposa())


def archivo_mariposa_durazno() -> str:
    return svg("0 0 200 180", mariposa(rosa=False))


def archivo_nube() -> str:
    body = nube_forma(0, 40) + mono(200, 70, 0.95) + estrella(56, 60, 9) + estrella(352, 92, 7) + estrella(330, 40, 5)
    return svg("0 0 400 300", body)


def archivo_nube_simple() -> str:
    return svg("0 0 400 250", nube_forma(0, 5, uid="s"))


def archivo_flores() -> str:
    """Ramo de esquina (reemplaza la imagen externa de flores)."""
    body = (
        ramita(40, 210, -60, 1.2)
        + ramita(60, 220, -20, 1.1)
        + ramita(80, 205, -95, 1.0)
        + hoja(110, 150, 50, -120)
        + hoja(150, 170, 46, -20, HOJA_OSC)
        + hoja(70, 120, 44, -150, HOJA_OSC)
        + capullo(46, 70, 1.3, ROSA, -20)
        + capullo(196, 120, 1.2, TUL_1, 40)
        + flor(110, 120, 46, "#f6b6c5", rot=10)
        + flor(170, 156, 34, "#fbd1c2", rot=-12)
        + flor(66, 160, 30, "#fde0e7", rot=24)
        + flor(150, 80, 22, "#f3a5b8", rot=4)
        + "".join(f'<circle cx="{c[0]}" cy="{c[1]}" r="{c[2]}" fill="#f7c9d3"/>' for c in [(200, 70, 4), (36, 120, 3.5), (216, 160, 3), (100, 52, 3)])
    )
    return svg("0 0 240 240", body)


def archivo_corona() -> str:
    """Conejita dentro de una corona floral con cinta (ventana de bienvenida)."""
    import math

    cx, cy, rx, ry = 200, 268, 158, 190
    vid = f'<path d="M{cx - rx} {cy + 120} C{cx - rx - 14} {cy - 40} {cx - 110} {cy - ry} {cx} {cy - ry} C{cx + 110} {cy - ry} {cx + rx + 14} {cy - 40} {cx + rx} {cy + 120}" fill="none" stroke="{HOJA_OSC}" stroke-width="2.4" stroke-linecap="round"/>'
    hojas = ""
    for i in range(22):
        t = math.radians(168 + i * (204 / 21))
        px, py = cx + rx * math.cos(t), cy + ry * 0.98 * math.sin(t)
        if py > cy + 115:
            continue
        tang = math.degrees(t) + 90
        lado = 50 if i % 2 else -50
        hojas += hoja(px, py, 24, tang + lado, HOJA if i % 2 else HOJA_OSC)
    flores_arco = (
        flor(52, 360, 26, "#f6b6c5", rot=10)
        + flor(348, 360, 26, "#f6b6c5", rot=-10)
        + flor(86, 330, 18, "#fbd1c2", rot=20)
        + flor(314, 330, 18, "#fbd1c2", rot=-20)
        + flor(52, 228, 16, "#fde0e7")
        + flor(348, 228, 16, "#fde0e7")
        + flor(96, 128, 14, "#f3a5b8")
        + flor(304, 128, 14, "#f3a5b8")
        + capullo(40, 300, 1.1, ROSA, -10)
        + capullo(360, 300, 1.1, ROSA, 10)
        + capullo(148, 84, 0.9, TUL_1, -30)
        + capullo(252, 84, 0.9, TUL_1, 30)
    )
    cinta = f"""
<path d="M36 432 L80 412 L80 472 L36 488 L54 458Z" fill="#eda1b3" stroke="{ROSA_OSC}" stroke-width="1.5"/>
<path d="M364 432 L320 412 L320 472 L364 488 L346 458Z" fill="#eda1b3" stroke="{ROSA_OSC}" stroke-width="1.5"/>
<path d="M70 404 Q200 438 330 404 L330 464 Q200 498 70 464Z" fill="url(#gCinta)" stroke="{ROSA_OSC}" stroke-width="1.5"/>
<path d="M90 420 Q200 450 310 420" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>"""
    mariposas = (
        f'<g transform="translate(36 30) scale(.44) rotate(-14 100 92)">{mariposa()}</g>'
        f'<g transform="translate(276 44) scale(.38) rotate(14 100 92)">{mariposa(rosa=False)}</g>'
    )
    body = (
        vid
        + hojas
        + flores_arco
        + conejita(84, 118, 0.77)
        + cinta
        + mono(200, 74, 0.8)
        + mariposas
        + estrella(28, 150, 7, "#f7c9d3")
        + estrella(372, 170, 6, "#f7c9d3")
        + estrella(200, 30, 5, "#f7c9d3")
    )
    return svg("0 0 400 500", body)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    archivos = {
        "conejita.svg": archivo_conejita(),
        "mariposa.svg": archivo_mariposa(),
        "mariposa-durazno.svg": archivo_mariposa_durazno(),
        "nube.svg": archivo_nube(),
        "nube-simple.svg": archivo_nube_simple(),
        "flores.svg": archivo_flores(),
        "conejita-corona.svg": archivo_corona(),
    }
    for nombre, contenido in archivos.items():
        (OUT / nombre).write_text(contenido, encoding="utf-8")
        print(f"{nombre}: {len(contenido) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
