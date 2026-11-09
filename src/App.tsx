import { useEffect, useRef, useState } from "react";
import invitados from "../db/invitados.json";
import itinerario from "../db/itinerario.json";
import {
  BIENVENIDAS,
  type Bienvenida,
  PORTADAS,
  type Portada,
  config,
} from "./config";
import { SoplaVelita } from "./juegos";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: {
              target: {
                playVideo: () => void;
                pauseVideo: () => void;
              };
            }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        destroy: () => void;
        addEventListener: (
          event: string,
          callback: (event: { data: number }) => void,
        ) => void;
      };
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ASSET_IMG = `${import.meta.env.BASE_URL}img`;

/* ------------------------------------------------------------------ */
/* Datos derivados de la configuración                                 */
/* ------------------------------------------------------------------ */

/** Archivo de public/img/ o URL completa. */
const img = (src: string) =>
  /^(https?:)?\/\//.test(src) ? src : `${ASSET_IMG}/${src}`;

const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const pad = (n: number) => String(n).padStart(2, "0");

const fecha = config.fechaEvento;
const horaTexto = `${pad(fecha.getHours() % 12 || 12)}:${pad(fecha.getMinutes())} ${
  fecha.getHours() < 12 ? "am" : "pm"
}`;
const fechaCorta = `${pad(fecha.getDate())}.${pad(fecha.getMonth() + 1)}.${fecha.getFullYear()}`;
const fechaLarga = `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} - ${horaTexto}`;

const toCalendarDate = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  `${config.nombre} - ${config.edadTexto}`,
)}&dates=${toCalendarDate(fecha)}/${toCalendarDate(
  new Date(fecha.getTime() + config.duracionHoras * 3600000),
)}&location=${encodeURIComponent(`${config.lugar}, ${config.direccion}`)}`;

const gallery = config.galeria.fotos.map(img);
const hasMusic = config.youtubeVideoId.trim() !== "";

/** Bienvenida elegida: ?bienvenida=sobre en la URL tiene prioridad sobre config. */
function obtenerBienvenida(): Bienvenida {
  const param = new URLSearchParams(window.location.search).get("bienvenida");
  return BIENVENIDAS.includes(param as Bienvenida)
    ? (param as Bienvenida)
    : config.bienvenida;
}

/** Portada elegida: ?portada=arco en la URL tiene prioridad sobre config. */
function obtenerPortada(): Portada {
  const param = new URLSearchParams(window.location.search).get("portada");
  return PORTADAS.includes(param as Portada)
    ? (param as Portada)
    : config.portada;
}

type ModalName =
  | "welcome"
  | "rsvp"
  | "song"
  | "dress"
  | "tips"
  | "gifts"
  | null;

type IconName =
  | "calendar"
  | "pin"
  | "check"
  | "music"
  | "paint"
  | "food"
  | "party"
  | "balloon"
  | "dress"
  | "info"
  | "gift"
  | "instagram"
  | "heart";

type Invitado = {
  nombre: string;
  apellidos: string;
  codigoInvitacion: string;
};

type ItinerarioItem = {
  hour: string;
  event: string;
  icon: IconName;
};

const invitadosRegistrados = invitados as Invitado[];
const eventos = itinerario as ItinerarioItem[];

function obtenerInvitado(): Invitado | null {
  const hash = window.location.hash.replace(/^#\/?/, "").trim();
  const codigo = hash.split("/").filter(Boolean)[0] || "";
  if (!codigo) return null;

  return (
    invitadosRegistrados.find(
      (invitado) =>
        invitado.codigoInvitacion.toUpperCase() === codigo.toUpperCase(),
    ) ?? null
  );
}

function Icon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.6 2.6L16.5 9" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13M9 9l10-2" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    paint: (
      <>
        <path d="m14 4 6 6-9.5 9.5a2.8 2.8 0 0 1-4-4L16 6Z" />
        <path d="m13 5 6 6M5.5 19.5c-.7 1.7-2.2 2.5-3.5 2.5 0-1.6.7-3 2.5-3.7" />
      </>
    ),
    food: (
      <>
        <path d="M6 3v7M4 3v4a2 2 0 0 0 4 0V3M6 10v11" />
        <path d="M14 3v18M14 3c3 1 5 3.5 5 6h-5" />
      </>
    ),
    party: (
      <>
        <path d="m12 3 1.2 3.2L16 7.5l-2.8 1.3L12 12l-1.2-3.2L8 7.5l2.8-1.3L12 3Z" />
        <path d="m5 13 .8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13ZM19 13l.6 1.6L21 15l-1.4.4L19 17l-.6-1.6L17 15l1.4-.4L19 13Z" />
      </>
    ),
    balloon: (
      <>
        <path d="M12 3a6 7 0 0 1 6 7c0 3.6-2.7 6-6 6s-6-2.4-6-6a6 7 0 0 1 6-7Z" />
        <path d="M10 15.5 12 21l2-5.5M12 21v-2" />
      </>
    ),
    dress: (
      <>
        <path d="M9 3h6l1 5-2 2c1 3 3.5 6 5 10H5c1.5-4 4-7 5-10L8 8l1-5Z" />
        <path d="M10 3c0 2.5 4 2.5 4 0" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    gift: (
      <>
        <path d="M3 10h18v11H3zM2 7h20v4H2zM12 7v14" />
        <path d="M12 7C8 7 6 6 6 4.5S8 2 9.5 3C11 4 12 7 12 7Zm0 0c4 0 6-1 6-2.5S16 2 14.5 3C13 4 12 7 12 7Z" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    heart: (
      <path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 9 1.5C21 16 12 21 12 21Z" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  onClick,
  href,
  light = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  light?: boolean;
  type?: "button" | "submit";
}) {
  const className = `pill ${light ? "pill-light" : ""}`;
  return href ? (
    <a
      className={className}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {children}
    </a>
  ) : (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function FloralMark() {
  return (
    <div className="floral-mark" aria-hidden="true">
      <span />
      <i>◆</i>
      <span />
    </div>
  );
}

function Wave({
  color = "#fff",
  flip = false,
  flip2 = false,
}: {
  color?: string;
  flip?: boolean;
  flip2?: boolean;
}) {
  return (
    <svg
      className={`wave ${flip ? "wave-flip" : flip2 ? "wave-flip2" : ""}`}
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M0,65 C280,130 470,8 735,46 C1040,90 1170,22 1440,52 L1440,110 L0,110 Z"
      />
    </svg>
  );
}

function Modal({
  active,
  close,
  invitado,
}: {
  active: Exclude<ModalName, "welcome" | null>;
  close: () => void;
  invitado: Invitado | null;
}) {
  const [rsvpStatus, setRsvpStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const title = {
    rsvp: "Confirmar Asistencia",
    song: "Sugerir Canción",
    dress: "Dress Code",
    tips: "Tips y Notas",
    gifts: "Regalos",
  }[active];
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <div
        className="modal-card form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close} aria-label="Cerrar">
          ×
        </button>
        <div className="tiny-flower">❧</div>
        <h2 id="modal-title">{title}</h2>
        {active === "rsvp" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setRsvpStatus("saving");
              const formElement = e.currentTarget;
              const form = new FormData(formElement);

              const endpoint = config.rsvpEndpoint.trim();
              const body = JSON.stringify({
                nombre: invitado
                  ? `${invitado.nombre} ${invitado.apellidos}`.trim()
                  : "Invitado sin código",
                asistira: form.get("asistira") === "si",
                mensaje: form.get("mensaje"),
              });

              try {
                if (!endpoint) {
                  // Modo demo: no se guarda nada.
                  await new Promise((r) => window.setTimeout(r, 700));
                } else if (/^https?:\/\//.test(endpoint)) {
                  // Google Apps Script: no-cors no permite leer la respuesta.
                  await fetch(endpoint, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                      "Content-Type": "text/plain;charset=utf-8",
                    },
                    body,
                  });
                } else {
                  const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body,
                  });
                  if (!response.ok) throw new Error("No se pudo guardar");
                }
                setRsvpStatus("success");
                formElement.reset();
                window.setTimeout(close, 3000);
              } catch {
                setRsvpStatus("error");
              }
            }}
          >
            <fieldset>
              <legend>¿Asistes a la Celebración? *</legend>
              <label className="inline">
                <input type="radio" name="asistira" value="si" required />
                Sí, asistiré
              </label>
              <label className="inline">
                <input type="radio" name="asistira" value="no" /> No asistiré
              </label>
            </fieldset>
            <label>
              Mensaje para {config.cumpleanero} (opcional)
              <textarea
                name="mensaje"
                placeholder="Puedes dejarle un mensaje de cariño"
              />
            </label>
            <Button type="submit">
              {rsvpStatus === "saving" ? "GUARDANDO..." : "ENVIAR CONFIRMACIÓN"}
            </Button>
            {rsvpStatus === "success" && (
              <p className="form-status success" role="status">
                ¡Gracias! Tu confirmación fue guardada.
              </p>
            )}
            {rsvpStatus === "error" && (
              <p className="form-status error" role="alert">
                No se pudo guardar. Inténtalo nuevamente.
              </p>
            )}
          </form>
        )}

        {active === "dress" && (
          <div className="modal-copy">
            <Icon name="dress" />
            <p>{config.modales.vestimenta.titulo}</p>
            <span>{config.modales.vestimenta.texto}</span>
          </div>
        )}
        {active === "tips" && (
          <div className="modal-copy">
            <Icon name="info" />
            <p>{config.modales.tips.titulo}</p>
            <span>
              La recepción comienza a las {horaTexto}.{" "}
              {config.modales.tips.texto}
            </span>
          </div>
        )}
        {active === "gifts" && (
          <div className="modal-copy">
            <Icon name="gift" />
            <p>{config.modales.regalos.titulo}</p>
            <span>{config.modales.regalos.texto}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ScrollMark() {
  return (
    <div className="scroll-mark" aria-hidden="true">
      <span>⌄</span>
    </div>
  );
}

/**
 * Publica el avance del scroll dentro de la portada como la variable CSS
 * --p (0 al entrar, 1 al terminar). El CSS anima todo a partir de --p.
 */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = reduce.matches
        ? 1
        : Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

function WelcomeActions({
  onMusic,
  onSkip,
}: {
  onMusic: () => void;
  onSkip: () => void;
}) {
  return hasMusic ? (
    <div className="welcome-actions">
      <span>La música de fondo es parte de la experiencia</span>
      <Button onClick={onMusic}>INGRESAR CON MÚSICA</Button>
      <button type="button" className="text-button" onClick={onSkip}>
        Ingresar sin música
      </button>
    </div>
  ) : (
    <div className="welcome-actions">
      <Button onClick={onSkip}>INGRESAR</Button>
    </div>
  );
}

/** Ventana de bienvenida. Se elige en config.bienvenida o con ?bienvenida=. */
function Welcome({
  diseno,
  onMusic,
  onSkip,
}: {
  diseno: Bienvenida;
  onMusic: () => void;
  onSkip: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const { imagenes } = config;
  const acciones = <WelcomeActions onMusic={onMusic} onSkip={onSkip} />;

  if (diseno === "sobre") {
    return (
      <div
        className={`modal-backdrop welcome welcome-sobre ${abierto ? "is-open" : ""}`}
        role="presentation"
      >
        <div
          className="sobre-wrap"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <div className="sobre">
            <div className="sobre-back" />
            <div className="sobre-carta">
              <p>Bienvenid@ a la invitación de</p>
              <h2 id="welcome-title">{config.nombre}</h2>
              <small>{config.edadTexto}</small>
            </div>
            <div className="sobre-front" />
            <div className="sobre-solapa" />
            <button
              type="button"
              className="sobre-sello"
              onClick={() => setAbierto(true)}
              aria-label="Abrir la invitación"
            >
              <img src={img(imagenes.mariposa)} alt="" />
            </button>
          </div>
          <p className="sobre-hint">Toca el sello para abrir tu invitación</p>
          <div className="sobre-acciones">{abierto && acciones}</div>
        </div>
      </div>
    );
  }

  if (diseno === "foto") {
    return (
      <div className="modal-backdrop welcome" role="presentation">
        <div
          className="modal-card welcome-foto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <div className="wf-foto">
            <span className="wf-anillo" aria-hidden="true" />
            <img
              className="wf-img"
              src={img(imagenes.portadaVertical)}
              alt={config.nombre}
            />
            <img className="wf-mono" src={img(imagenes.mariposa)} alt="" />
          </div>
          <p className="wf-kicker">¡Hola! Soy</p>
          <h2 id="welcome-title">{config.nombre}</h2>
          <p className="wf-texto">
            y te invito a celebrar {config.edadTexto.toLowerCase()}
          </p>
          {acciones}
          <img className="wf-conejita" src={img(imagenes.conejita)} alt="" />
        </div>
      </div>
    );
  }

  if (diseno === "nubes") {
    return (
      <div className="modal-backdrop welcome welcome-cielo" role="presentation">
        <img
          className="cielo-nube cielo-nube-1"
          src={img(imagenes.nube)}
          alt=""
        />
        <img
          className="cielo-nube cielo-nube-2"
          src={img(imagenes.nube)}
          alt=""
        />
        {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
          <i key={k} className={`cielo-estrella ${k}`} aria-hidden="true">
            ✦
          </i>
        ))}
        <div
          className="cielo-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <div
            className="cielo-nube-texto"
            style={
              {
                "--nube-img": `url("${img(imagenes.nube)}")`,
              } as React.CSSProperties
            }
          >
            <p>Bienvenid@ a la invitación de</p>
            <h2 id="welcome-title">{config.nombre}</h2>
          </div>
          <img className="cielo-conejita" src={img(imagenes.conejita)} alt="" />
          {acciones}
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop welcome" role="presentation">
      <div
        className="modal-card welcome-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <img src={img(imagenes.conejitaBienvenida)} alt="" />
        <p>Bienvenid@ a la invitación de</p>
        <h2 id="welcome-title">{config.nombre}</h2>
        {acciones}
      </div>
    </div>
  );
}

/** Hace aparecer suavemente los elementos [data-reveal] al entrar en pantalla. */
function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      for (const el of elements) el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

function ScrollHint({ text }: { text: string }) {
  return (
    <div className="scroll-hint" aria-hidden="true">
      <span>{text}</span>
      <i>⌄</i>
    </div>
  );
}

/** Portadas animadas: el contenido aparece mientras se hace scroll. */
function ScrollHero({ portada }: { portada: "telon" | "ventana" | "nubes" }) {
  const ref = useScrollProgress<HTMLElement>();
  const { imagenes } = config;
  const photoVars = {
    "--hero-desktop": `url("${img(imagenes.portada)}")`,
    "--hero-mobile": `url("${img(imagenes.portadaMovil)}")`,
  } as React.CSSProperties;

  if (portada === "telon") {
    return (
      <section
        ref={ref}
        className="hero hero-scroll hero-telon"
        id="inicio"
        style={photoVars}
      >
        <div className="scroll-stage">
          <div className="telon-photo" />
          <div className="telon-tint" />
          <div className="telon-copy">
            <div className="date">{fechaCorta}</div>
            <h1>{config.nombre}</h1>
            <p>{config.edadTexto}</p>
          </div>
          <div className="telon-cortina telon-izq" />
          <div className="telon-cortina telon-der" />
          <div className="telon-cenefa">
            <img src={img(imagenes.mariposa)} alt="" />
          </div>
          <div className="telon-intro">
            <p className="hero-kicker">Se abre el telón para</p>
            <strong>{config.edadTexto}</strong>
          </div>
          <ScrollHint text="Desliza para abrir" />
        </div>
      </section>
    );
  }

  if (portada === "ventana") {
    return (
      <section
        ref={ref}
        className="hero hero-scroll hero-ventana"
        id="inicio"
        style={photoVars}
      >
        <div className="scroll-stage">
          <div className="ventana-intro">
            <p className="hero-kicker">Te invitamos a celebrar a</p>
            <h1>{config.nombre}</h1>
          </div>
          <div className="ventana-photo" />
          <div className="ventana-tint" />
          <div className="ventana-copy">
            <p>{config.edadTexto}</p>
            <div className="date">{fechaCorta}</div>
            <span className="ventana-name">{config.nombre}</span>
          </div>
          <ScrollHint text="Desliza para descubrir" />
        </div>
      </section>
    );
  }

  const letras = [...config.nombre];
  return (
    <section ref={ref} className="hero hero-scroll hero-nubes" id="inicio">
      <div className="scroll-stage">
        <div className="nubes-sol" />
        <div className="nubes-foto">
          <img src={img(imagenes.portadaVertical)} alt={config.nombre} />
        </div>
        <img className="nubes-conejita" src={img(imagenes.conejita)} alt="" />
        <img className="nube-capa nube-izq" src={img(imagenes.nube)} alt="" />
        <img className="nube-capa nube-der" src={img(imagenes.nube)} alt="" />
        <img className="nube-capa nube-abajo" src={img(imagenes.nube)} alt="" />
        <div className="nubes-copy">
          <h1 aria-label={config.nombre}>
            {letras.map((l, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: letras fijas
                key={i}
                aria-hidden="true"
                style={{ "--i": i / letras.length } as React.CSSProperties}
              >
                {l}
              </span>
            ))}
          </h1>
          <p>{config.edadTexto}</p>
          <div className="date">{fechaCorta}</div>
        </div>
        <ScrollHint text="Desliza entre las nubes" />
      </div>
    </section>
  );
}

/** Portadas disponibles. Se elige en config.portada o con ?portada=. */
function Hero({ portada }: { portada: Portada }) {
  const { imagenes } = config;

  if (portada === "telon" || portada === "ventana" || portada === "nubes") {
    return <ScrollHero portada={portada} />;
  }

  if (portada === "arco") {
    return (
      <section className="hero hero-arco" id="inicio">
        <img
          className="arco-nube arco-nube-1"
          src={img(imagenes.nube)}
          alt=""
        />
        <img
          className="arco-nube arco-nube-2"
          src={img(imagenes.nube)}
          alt=""
        />
        <div className="arco-inner reveal">
          <div className="date">{fechaCorta}</div>
          <div className="arco-frame">
            <img src={img(imagenes.portadaVertical)} alt={config.nombre} />
          </div>
          <img className="arco-mono" src={img(imagenes.mariposa)} alt="" />
          <h1>{config.nombre}</h1>
          <p>{config.edadTexto}</p>
        </div>
        <ScrollMark />
      </section>
    );
  }

  if (portada === "polaroid") {
    const captions = [
      "¡Hola!",
      "♡",
      `${config.edad} ${config.edad === 1 ? "añito" : "añitos"}`,
    ];
    return (
      <section className="hero hero-polaroid" id="inicio">
        <div className="polaroid-stack reveal">
          {imagenes.polaroids.slice(0, 3).map((src, i) => (
            <figure className={`polaroid polaroid-${i}`} key={src}>
              <img src={img(src)} alt="" />
              <figcaption>{captions[i]}</figcaption>
            </figure>
          ))}
        </div>
        <div className="polaroid-copy reveal">
          <p className="hero-kicker">Estás invitado a celebrar</p>
          <h1>{config.nombre}</h1>
          <p className="hero-sub">{config.edadTexto}</p>
          <div className="date">{fechaCorta}</div>
        </div>
        <ScrollMark />
      </section>
    );
  }

  if (portada === "dividida") {
    return (
      <section className="hero hero-dividida" id="inicio">
        <div
          className="split-photo"
          style={{
            backgroundImage: `url("${img(imagenes.portadaVertical)}")`,
          }}
        />
        <div className="split-panel">
          <span className="split-number" aria-hidden="true">
            {config.edad}
          </span>
          <img className="split-bunny" src={img(imagenes.conejita)} alt="" />
          <div className="split-copy reveal">
            <p className="hero-kicker">Celebremos juntos</p>
            <h1>{config.nombre}</h1>
            <p className="hero-sub">{config.edadTexto}</p>
            <div className="date">{fechaCorta}</div>
          </div>
        </div>
        <ScrollMark />
      </section>
    );
  }

  return (
    <section
      className="hero hero-clasica"
      id="inicio"
      style={
        {
          "--hero-desktop": `url("${img(imagenes.portada)}")`,
          "--hero-mobile": `url("${img(imagenes.portadaMovil)}")`,
        } as React.CSSProperties
      }
    >
      <div className="hero-photo" />
      <div className="hero-tint" />
      <div className="hero-content reveal">
        <div className="date">{fechaCorta}</div>
        <h1>{config.nombre}</h1>
        <p>{config.edadTexto}</p>
      </div>
      <ScrollMark />
    </section>
  );
}

function App() {
  const invitado = obtenerInvitado();
  const [portada] = useState(obtenerPortada);
  const [bienvenida] = useState(obtenerBienvenida);
  const [salto, setSalto] = useState(false);
  const [modal, setModal] = useState<ModalName>("welcome");
  const [welcomeClosed, setWelcomeClosed] = useState(false);
  const [slide, setSlide] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  useReveal();
  const [musicControlsVisible, setMusicControlsVisible] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const playerRef = useRef<{
    playVideo: () => void;
    pauseVideo: () => void;
    destroy: () => void;
    addEventListener: (
      event: string,
      callback: (event: { data: number }) => void,
    ) => void;
  } | null>(null);
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, fecha.getTime() - Date.now());
      setTime({
        days: Math.floor(d / 86400000),
        hours: Math.floor(d / 3600000) % 24,
        mins: Math.floor(d / 60000) % 60,
        secs: Math.floor(d / 1000) % 60,
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modal === "welcome") setWelcomeClosed(true);
        setModal(null);
        setGalleryOpen(false);
      }
      if (!galleryOpen) return;
      if (e.key === "ArrowLeft") {
        setSlide((current) => (current + gallery.length - 1) % gallery.length);
      }
      if (e.key === "ArrowRight") {
        setSlide((current) => (current + 1) % gallery.length);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [galleryOpen, modal]);

  useEffect(() => {
    if (!welcomeClosed) return;

    const timeoutId = window.setTimeout(() => {
      setModal((current) => (current === null ? "tips" : current));
    }, 15000);

    return () => window.clearTimeout(timeoutId);
  }, [welcomeClosed]);

  const open = (name: ModalName) => setModal(name);

  const changeSlide = (direction: 1 | -1) => {
    setSlide(
      (current) => (current + gallery.length + direction) % gallery.length,
    );
  };

  const handleGalleryTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleGalleryTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;
    changeSlide(distance < 0 ? 1 : -1);
  };

  const handleMusicEnter = () => {
    setMusicControlsVisible(hasMusic);
    setIsMusicPlaying(hasMusic);
    setWelcomeClosed(true);
    setModal(null);
  };

  const handleMusicSkip = () => {
    setMusicControlsVisible(hasMusic);
    setIsMusicPlaying(false);
    setWelcomeClosed(true);
    setModal(null);
  };

  const toggleMusic = () => {
    const nextState = !isMusicPlaying;
    setIsMusicPlaying(nextState);

    if (!playerRef.current) return;

    if (nextState) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  };

  useEffect(() => {
    if (!musicControlsVisible) return;

    const setupPlayer = () => {
      const container = document.getElementById("music-player-container");
      if (!container || !window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(container, {
        height: "1",
        width: "1",
        videoId: config.youtubeVideoId,
        playerVars: {
          autoplay: isMusicPlaying ? 1 : 0,
          loop: 1,
          playlist: config.youtubeVideoId,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (isMusicPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            const isPlaying = event.data === window.YT?.PlayerState?.PLAYING;
            setIsMusicPlaying(isPlaying);
          },
        },
      });
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (window.YT && window.YT.Player) {
      setupPlayer();
      return;
    }

    if (!existingScript) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setupPlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (window.onYouTubeIframeAPIReady) {
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, [musicControlsVisible, isMusicPlaying]);

  return (
    <main>
      {config.demo.activo && (
        <div className="demo-aviso">
          <span>Demo · {config.demo.paquete}</span>
          <a href={config.demo.cotizarUrl} target="_top">
            Cotízala
          </a>
        </div>
      )}
      {musicControlsVisible && (
        <>
          <div className="hidden-music-player" aria-hidden="true">
            <div id="music-player-container" />
          </div>
          <button
            type="button"
            className="music-toggle"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Pausar música" : "Reproducir música"}
          >
            {isMusicPlaying ? "❚❚" : "▶"}
          </button>
        </>
      )}

      <Hero portada={portada} />
      <div className="content">
        <Wave color="#fff" flip2 />
        <section className="intro section-white">
          <img
            className="deco-mariposa deco-m1"
            src={img(config.imagenes.mariposa)}
            alt=""
          />
          <img
            className="flower-corner flower-one"
            data-reveal="right"
            src={img(config.imagenes.nube)}
            alt=""
          />
          <div className="quote-mark" data-reveal>
            "
          </div>
          <p className="quote" data-reveal>
            {config.frase.antes}{" "}
            <span style={{ fontWeight: "bold" }}>{config.frase.destacado}</span>{" "}
            {config.frase.despues}
          </p>
          <div className="intro-story">
            <div className="intro-story-image" data-reveal="pop">
              <button
                type="button"
                className={`conejita-btn ${salto ? "salta" : ""}`}
                onClick={() => {
                  setSalto(false);
                  window.requestAnimationFrame(() => setSalto(true));
                }}
                onAnimationEnd={() => setSalto(false)}
                aria-label="Hacer saltar a la conejita"
              >
                <img src={img(config.imagenes.conejita)} alt="" />
              </button>
              <span className="tocame">¡Tócame!</span>
            </div>
            <div className="intro-story-copy">
              <p data-reveal style={{ "--d": "0s" } as React.CSSProperties}>
                El tiempo vuela...
              </p>
              <p data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
                {(config.edad * 12).toLocaleString("es-PE")} meses mágicos
              </p>
              <p data-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
                {(config.edad * 8760).toLocaleString("es-PE")} horas
                encantadoras
              </p>
              <p data-reveal style={{ "--d": ".45s" } as React.CSSProperties}>
                {(config.edad * 365).toLocaleString("es-PE")} días apasionantes
              </p>
            </div>
          </div>

          <div className="quote-mark closing">"</div>
          <FloralMark />
          <div className="countdown-wrap" data-reveal>
            <span>Falta</span>
            <div className="countdown">
              {[
                [time.days, "días"],
                [time.hours, "hs"],
                [time.mins, "min"],
                [time.secs, "seg"],
              ].map(([n, l], i) => (
                <div
                  key={l}
                  data-reveal="pop"
                  style={
                    { "--d": `${0.15 + i * 0.12}s` } as React.CSSProperties
                  }
                >
                  <strong>{String(n).padStart(2, "0")}</strong>
                  <small>{l}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="guests blush-section">
          <Wave color="#fff" flip />
          <div className="guest-card" data-reveal="zoom">
            <div className="guest-number">
              <img src={img(config.imagenes.mariposa)} alt="Hola" />
            </div>
            <h3>INVITADO(A)</h3>
            <img
              className="deco-mariposa deco-m2"
              src={img(config.imagenes.mariposa2)}
              alt=""
            />
            <h1>{invitado?.nombre ?? config.invitadoPorDefecto.nombre}</h1>
            <p>{invitado?.apellidos ?? config.invitadoPorDefecto.apellidos}</p>
          </div>
          <p className="guest-note" data-reveal>
            Tu presencia es lo más importante.
            <br />
            ¡No faltes!
          </p>
          <Wave color="#fff" />
        </section>
        <section className="celebration section-white" id="celebracion">
          <img
            className="flower-corner flower-two"
            data-reveal="left"
            src={img(config.imagenes.flores)}
            alt=""
          />
          <div className="section-heading" data-reveal>
            <p>Será un día inolvidable y queremos vivirlo contigo.</p>
            <h2>Celebración</h2>
            <FloralMark />
          </div>
          <div className="event-grid">
            <article
              data-reveal
              style={{ "--d": "0.00s" } as React.CSSProperties}
            >
              <div className="line-icon">
                <Icon name="calendar" />
              </div>
              <h4>DÍA</h4>
              <p>{fechaLarga}</p>
              <Button href={calendarUrl}>AGENDAR</Button>
            </article>
            <article
              data-reveal
              style={{ "--d": "0.15s" } as React.CSSProperties}
            >
              <div className="line-icon">
                <Icon name="check" />
              </div>
              <h4>LUGAR</h4>
              <p>{config.lugar}</p>
              <Button onClick={() => open("rsvp")}>CONFIRMAR ASISTENCIA</Button>
            </article>
            <article
              data-reveal
              style={{ "--d": "0.30s" } as React.CSSProperties}
            >
              <div className="line-icon">
                <Icon name="pin" />
              </div>
              <h4>DIRECCIÓN</h4>
              <p
                style={{
                  marginBottom: config.referencia ? "0" : undefined,
                }}
              >
                {config.direccion}
              </p>
              {config.referencia && (
                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: ".9rem",
                    marginBottom: "20px",
                  }}
                >
                  {config.referencia}
                </p>
              )}
              <Button href={config.mapsUrl}>¿CÓMO LLEGAR?</Button>
            </article>
          </div>
        </section>

        <section className="itinerary section-white" id="itinerario">
          <img
            className="deco-mariposa deco-m3"
            src={img(config.imagenes.mariposa)}
            alt=""
          />
          <Wave color="#fff" flip />
          <div className="section-heading" data-reveal>
            <p>Estos son algunos momentos que compartiremos.</p>
            <h2>Itinerario</h2>
            <FloralMark />
          </div>
          <div className="timeline">
            {eventos.map(({ hour, event, icon }, i) => (
              <div
                className="timeline-item"
                key={hour}
                data-reveal={i % 2 ? "right" : "left"}
              >
                <time>{hour}</time>
                <span className="timeline-dot" aria-hidden="true">
                  <Icon name={icon} />
                </span>
                <p>{event}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rsvp-banner">
          <Wave color="#fff" flip />
          <div data-reveal="zoom">
            <Icon name="check" />
            <h2>Confirmar Asistencia</h2>
            <p>Es importante que confirmes tu asistencia</p>
            <Button light onClick={() => open("rsvp")}>
              CONFIRMAR ASISTENCIA
            </Button>
          </div>
          <Wave color="#fff" />
        </section>

        {gallery.length > 0 && (
          <section className="gallery-section section-white" id="galeria">
            <div className="section-heading" data-reveal>
              <h2>{config.galeria.titulo}</h2>
              <p>{config.galeria.subtitulo}</p>
              <FloralMark />
            </div>
            <div className="galeria">
              {gallery.map((image, i) => (
                <button
                  key={image}
                  type="button"
                  className="galeria-item"
                  onClick={() => {
                    setSlide(i);
                    setGalleryOpen(true);
                  }}
                  data-reveal="zoom"
                  style={{ "--d": `${(i % 3) * 0.12}s` } as React.CSSProperties}
                  aria-label={`Ver foto ${i + 1} en grande`}
                >
                  <img
                    src={image}
                    alt={`Recuerdo de ${config.nombre} ${i + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {galleryOpen && gallery.length > 0 && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${slide + 1} de ${gallery.length}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setGalleryOpen(false);
              }
            }}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            <button
              type="button"
              className="lightbox-close"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setGalleryOpen(false)}
              aria-label="Cerrar foto ampliada"
            >
              ×
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                changeSlide(-1);
              }}
              onMouseDown={(event) => event.stopPropagation()}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <img
              src={gallery[slide]}
              alt={`Recuerdo de ${config.nombre} ${slide + 1}`}
              onMouseDown={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                changeSlide(1);
              }}
              onMouseDown={(event) => event.stopPropagation()}
              aria-label="Foto siguiente"
            >
              ›
            </button>
            <span className="lightbox-counter">
              {slide + 1} / {gallery.length}
            </span>
          </div>
        )}

        {config.juegos.velita && (
          <section className="games section-white" id="juegos">
            <div className="section-heading" data-reveal>
              <p>Un pequeño juego antes de la fiesta</p>
              <h2>Sopla la velita</h2>
              <FloralMark />
            </div>
            <div data-reveal="zoom">
              <SoplaVelita
                nombre={config.nombre}
                conejita={img(config.imagenes.conejita)}
              />
            </div>
          </section>
        )}

        <section className="party blush-section" id="fiesta">
          <Wave color="#faf1fa" flip />
          <div className="section-heading" data-reveal>
            <h2>Fiesta</h2>
            <p>
              Hagamos juntos una fiesta épica.
              <br />
              Aquí algunos detalles a tener en cuenta.
            </p>
            <FloralMark />
          </div>
          <div className="party-grid">
            <article data-reveal="pop">
              <div className="circle-icon">
                <Icon name="info" />
              </div>
              <h3>Tips y Notas</h3>
              <p>
                Información adicional
                <br />
                para tener en cuenta
              </p>
              <Button onClick={() => open("tips")}>+ INFO</Button>
            </article>
          </div>
          <Wave color="#fff" />
        </section>

        <section
          className="instagram-section"
          style={
            {
              "--fotos-bg": `url("${img(config.imagenes.fondoFotos)}")`,
            } as React.CSSProperties
          }
        >
          <Wave color="#fff" flip />
          <div className="insta-overlay" data-reveal>
            <Icon name="instagram" />
            <h2>Una gran fiesta junto a ti</h2>
            <p>Comparte tus fotos y videos de este hermoso día</p>
            {config.fotos.albumUrl ? (
              <a href={config.fotos.albumUrl} target="_blank" rel="noreferrer">
                <strong>{config.fotos.hashtag}</strong>
                <span>COMPARTE TUS FOTOS AQUÍ</span>
              </a>
            ) : (
              <a href="#inicio">
                <strong>{config.fotos.hashtag}</strong>
                <span>USA NUESTRO HASHTAG</span>
              </a>
            )}
          </div>
        </section>

        <footer>
          <img
            className="deco-mariposa deco-m4"
            src={img(config.imagenes.mariposa2)}
            alt=""
          />
          <h2 data-reveal>{config.nombre}</h2>
          <p>{config.edadTexto}</p>
          <nav>
            <button onClick={() => open("rsvp")}>Confirmar asistencia</button>
            <i>·</i>
            <i>·</i>
            <a href="#celebracion">Agendar celebración</a>
          </nav>
          <div className="footer-rule" />
          <small>
            Invitación hecha con 💗 por{" "}
            {config.creditosUrl ? (
              <a
                className="footer-creditos"
                href={config.creditosUrl}
                target="_blank"
                rel="noreferrer"
              >
                <b>{config.creditos}</b>
              </a>
            ) : (
              <b>{config.creditos}</b>
            )}
          </small>
        </footer>
      </div>

      {modal === "welcome" && (
        <Welcome
          diseno={bienvenida}
          onMusic={handleMusicEnter}
          onSkip={handleMusicSkip}
        />
      )}
      {modal && modal !== "welcome" && (
        <Modal
          active={modal}
          close={() => setModal(null)}
          invitado={invitado}
        />
      )}
    </main>
  );
}

export default App;
