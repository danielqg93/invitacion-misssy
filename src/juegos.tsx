import { useCallback, useEffect, useRef, useState } from "react";

/* ================================================================== */
/* Minijuego: ¡Sopla la velita!                                        */
/*  - Toca la llama varias veces, o                                    */
/*  - Usa el micrófono y sopla de verdad (requiere HTTPS o localhost). */
/* ================================================================== */

type Estado = "encendida" | "apagada";
type Mic = "apagado" | "pidiendo" | "escuchando" | "error";

const TOQUES_PARA_APAGAR = 5;
/** Volumen (RMS 0-1) a partir del cual se considera que alguien sopla. */
const UMBRAL_SOPLO = 0.11;
/** Segundos de soplo continuo necesarios para apagar la vela. */
const SEGUNDOS_SOPLO = 0.9;

const COLORES = ["#f3a5b8", "#fbd1c2", "#f6e0a0", "#bfe0d0", "#c9c2f2", "#fff"];

function Confeti() {
  const piezas = useRef(
    Array.from({ length: 46 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      d: Math.random() * 0.6,
      t: 1.6 + Math.random() * 1.4,
      r: Math.random() * 720 - 360,
      c: COLORES[i % COLORES.length],
      s: 6 + Math.random() * 6,
      redondo: Math.random() > 0.6,
    })),
  ).current;
  return (
    <div className="confeti" aria-hidden="true">
      {piezas.map((p) => (
        <i
          key={p.id}
          style={
            {
              left: `${p.x}%`,
              width: p.s,
              height: p.redondo ? p.s : p.s * 0.45,
              borderRadius: p.redondo ? "50%" : 2,
              background: p.c,
              "--rot": `${p.r}deg`,
              animationDelay: `${p.d}s`,
              animationDuration: `${p.t}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Torta de dos pisos con vela "1". La llama se controla con --f (0 a 1). */
function Torta({ fuerza, apagada }: { fuerza: number; apagada: boolean }) {
  return (
    <svg className="torta-svg" viewBox="0 0 260 300" aria-hidden="true">
      <defs>
        <radialGradient id="tLlama" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.45" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#ff9a5a" />
        </radialGradient>
        <radialGradient id="tBrillo">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tPiso1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8c8d3" />
          <stop offset="1" stopColor="#efaebd" />
        </linearGradient>
        <linearGradient id="tPiso2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde6ec" />
          <stop offset="1" stopColor="#f8d0da" />
        </linearGradient>
      </defs>

      {/* brillo de la llama */}
      <circle
        cx="131"
        cy="30"
        r="70"
        fill="url(#tBrillo)"
        style={{ opacity: apagada ? 0 : fuerza, transition: "opacity .4s" }}
      />

      {/* plato */}
      <ellipse cx="130" cy="272" rx="122" ry="16" fill="#f3dde3" />
      <ellipse cx="130" cy="266" rx="116" ry="12" fill="#fff" />

      {/* piso de abajo */}
      <rect
        x="38"
        y="186"
        width="184"
        height="80"
        rx="14"
        fill="url(#tPiso1)"
      />
      <path
        d="M38 200 Q38 186 52 186 H208 Q222 186 222 200 V206 Q212 220 204 206 Q196 226 186 206 Q176 218 166 206 Q156 230 146 206 Q136 220 126 206 Q116 226 106 206 Q96 218 86 206 Q76 228 66 206 Q56 220 48 206 Q42 214 38 206Z"
        fill="#fffafb"
      />
      {[
        [62, 236],
        [92, 248],
        [124, 232],
        [156, 250],
        [190, 236],
        [206, 252],
        [76, 254],
      ].map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="9"
          height="3.5"
          rx="1.7"
          fill={COLORES[i % 4]}
          transform={`rotate(${i * 37} ${x} ${y})`}
        />
      ))}

      {/* piso de arriba */}
      <rect
        x="72"
        y="128"
        width="116"
        height="62"
        rx="12"
        fill="url(#tPiso2)"
      />
      <path
        d="M72 140 Q72 128 84 128 H176 Q188 128 188 140 V146 Q180 158 172 146 Q164 162 154 146 Q146 156 138 146 Q128 164 118 146 Q110 156 102 146 Q92 162 84 146 Q78 154 72 146Z"
        fill="#fffafb"
      />
      {[96, 130, 164].map((x) => (
        <path
          key={x}
          transform={`translate(${x} 172) scale(.5)`}
          d="M0 6 C-10 -6 -22 4 0 20 C22 4 10 -6 0 6Z"
          fill="#ec8fa3"
        />
      ))}

      {/* vela "1" */}
      <g>
        <path
          d="M118 72 L136 58 H144 V128 H128 V82 L118 86Z"
          fill="#f3a5b8"
          stroke="#e2879d"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M131 66 L144 76 M128 92 L144 104 M128 112 L144 124"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".8"
        />
        <path
          d="M140 58 V46"
          stroke="#7a5a52"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      {/* llama */}
      <g
        className={`llama ${apagada ? "is-off" : ""}`}
        style={{ "--f": fuerza } as React.CSSProperties}
      >
        <path
          d="M140 6 C152 22 156 34 150 42 C146 48 134 48 130 42 C124 34 130 20 140 6Z"
          fill="url(#tLlama)"
        />
        <path
          d="M140 24 C145 31 146 37 143 41 C141 44 138 44 136 41 C134 37 136 31 140 24Z"
          fill="#fff"
          opacity=".85"
        />
      </g>

      {/* humito */}
      {apagada && (
        <g className="humo" fill="#d9cfd3">
          <circle cx="140" cy="38" r="6" />
          <circle cx="146" cy="26" r="8" />
          <circle cx="136" cy="12" r="10" />
        </g>
      )}
    </svg>
  );
}

export function SoplaVelita({
  nombre,
  conejita,
}: {
  nombre: string;
  conejita: string;
}) {
  const [estado, setEstado] = useState<Estado>("encendida");
  const [fuerza, setFuerza] = useState(1);
  const [mic, setMic] = useState<Mic>("apagado");
  const [nivel, setNivel] = useState(0);
  const [ronda, setRonda] = useState(0);
  const audio = useRef<{
    stream: MediaStream;
    ctx: AudioContext;
    raf: number;
  } | null>(null);

  const detenerMic = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    window.cancelAnimationFrame(a.raf);
    for (const track of a.stream.getTracks()) track.stop();
    void a.ctx.close();
    audio.current = null;
    setNivel(0);
  }, []);

  useEffect(() => detenerMic, [detenerMic]);

  const apagar = useCallback(() => {
    setFuerza(0);
    setEstado("apagada");
    setRonda((r) => r + 1);
    if ("vibrate" in navigator) navigator.vibrate?.(80);
    detenerMic();
    setMic("apagado");
  }, [detenerMic]);

  const tocar = () => {
    if (estado === "apagada") return;
    const siguiente = Math.max(0, fuerza - 1 / TOQUES_PARA_APAGAR);
    if (siguiente <= 0.01) apagar();
    else setFuerza(siguiente);
  };

  const usarMicrofono = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic("error");
      return;
    }
    setMic("pidiendo");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const datos = new Float32Array(analyser.fftSize);
      let f = 1;
      let ultimo = performance.now();
      const bucle = (ahora: number) => {
        const dt = (ahora - ultimo) / 1000;
        ultimo = ahora;
        analyser.getFloatTimeDomainData(datos);
        let suma = 0;
        for (const v of datos) suma += v * v;
        const rms = Math.sqrt(suma / datos.length);
        setNivel(Math.min(1, rms / (UMBRAL_SOPLO * 2)));
        if (rms > UMBRAL_SOPLO) f -= dt / SEGUNDOS_SOPLO;
        else f = Math.min(1, f + dt * 0.35);
        if (f <= 0) {
          apagar();
          return;
        }
        setFuerza(f);
        if (audio.current)
          audio.current.raf = window.requestAnimationFrame(bucle);
      };
      audio.current = { stream, ctx, raf: window.requestAnimationFrame(bucle) };
      setMic("escuchando");
    } catch {
      setMic("error");
    }
  };

  const reiniciar = () => {
    setEstado("encendida");
    setFuerza(1);
  };

  const apagada = estado === "apagada";

  return (
    <div className={`velita ${apagada ? "is-apagada" : ""}`}>
      {apagada && <Confeti key={ronda} />}

      <button
        type="button"
        className="torta-btn"
        onClick={tocar}
        aria-label={apagada ? "Vela apagada" : "Tocar la llama para soplar"}
      >
        <Torta fuerza={fuerza} apagada={apagada} />
      </button>

      <img
        className={`velita-conejita ${apagada ? "festeja" : ""}`}
        src={conejita}
        alt=""
        key={`c-${ronda}`}
      />

      <div className="velita-panel" aria-live="polite">
        {apagada ? (
          <>
            <p className="velita-titulo">¡Pide un deseo para {nombre}! ✨</p>
            <p className="velita-texto">
              Gracias por soplar conmigo mi primera velita.
            </p>
            <button type="button" className="pill" onClick={reiniciar}>
              ENCENDER OTRA VEZ
            </button>
          </>
        ) : (
          <>
            <p className="velita-titulo">¡Ayúdame a soplar mi velita!</p>
            <p className="velita-texto">
              {mic === "escuchando"
                ? "Sopla fuerte cerca del micrófono 🌬️"
                : `Toca la llama ${TOQUES_PARA_APAGAR} veces o sopla de verdad`}
            </p>
            <div className="velita-barra" aria-hidden="true">
              <span style={{ width: `${Math.round((1 - fuerza) * 100)}%` }} />
            </div>
            {mic === "escuchando" ? (
              <div className="velita-mic" aria-hidden="true">
                <span style={{ transform: `scaleX(${nivel})` }} />
              </div>
            ) : (
              <button
                type="button"
                className="pill"
                onClick={usarMicrofono}
                disabled={mic === "pidiendo"}
              >
                {mic === "pidiendo"
                  ? "ACTIVANDO..."
                  : "🎤 SOPLAR CON EL MICRÓFONO"}
              </button>
            )}
            {mic === "error" && (
              <p className="velita-error">
                No pudimos usar el micrófono. ¡Toca la llama para soplar!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
