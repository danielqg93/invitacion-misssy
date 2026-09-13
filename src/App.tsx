import { useEffect, useMemo, useRef, useState } from "react";
import invitados from "../db/invitados.json";
import itinerario from "../db/itinerario.json";

const CUMPLEANERA = "Missy";
const ASSET = "https://fixdate.io/modelo-invitacion/74/img";

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
            <circle
               cx="17.5"
               cy="6.5"
               r=".8"
               fill="currentColor"
               stroke="none"
            />
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

                     try {
                        const response = await fetch(
                           "https://script.google.com/macros/s/AKfycbz7mt1KqKGzon15JgdNxUm5Zy7MpUjpNpP-pxVOGLiD5F3B6FNAZK_WqC4ZEk4ZS-JMLg/exec",
                           {
                              method: "POST",
                              mode: "no-cors",
                              headers: {
                                 "Content-Type": "text/plain;charset=utf-8",
                              },
                              body: JSON.stringify({
                                 nombre: invitado
                                    ? `${invitado.nombre} ${invitado.apellidos}`.trim()
                                    : "Invitado sin código",
                                 asistira: form.get("asistira") === "si",
                                 mensaje: form.get("mensaje"),
                              }),
                           },
                        );
                        // if (!response.ok) throw new Error("No se pudo guardar");
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
                        <input
                           type="radio"
                           name="asistira"
                           value="si"
                           required
                        />
                        Sí, asistiré
                     </label>
                     <label className="inline">
                        <input type="radio" name="asistira" value="no" /> No
                        asistiré
                     </label>
                  </fieldset>
                  <label>
                     Mensaje para la cumpleañera (opcional)
                     <textarea
                        name="mensaje"
                        placeholder="Puedes dejarle un mensaje de cariño"
                     />
                  </label>
                  <Button type="submit">
                     {rsvpStatus === "saving"
                        ? "GUARDANDO..."
                        : "ENVIAR CONFIRMACIÓN"}
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
                  <p>Elegante sport</p>
                  <span>
                     Te invitamos a elegir tonos suaves y a reservar el rosa
                     para la quinceañera.
                  </span>
               </div>
            )}
            {active === "tips" && (
               <div className="modal-copy">
                  <Icon name="info" />
                  <p>
                     Ven puntual, la fiesta no espera... !Y nosotros tampoco¡
                  </p>
                  <span>
                     La recepción comienza a las 02:00 pm. Te recomendamos
                     llegar unos minutos antes, para que no te pierdas de nada.
                  </span>
               </div>
            )}
            {active === "gifts" && (
               <div className="modal-copy">
                  <Icon name="gift" />
                  <p>Tu presencia es mi mejor regalo</p>
                  <span>
                     Si aun así deseas obsequiarme algo, podrás consultar los
                     datos con mi familia.
                  </span>
               </div>
            )}
         </div>
      </div>
   );
}

function App() {
   const invitado = obtenerInvitado();
   const [modal, setModal] = useState<ModalName>("welcome");
   const [welcomeClosed, setWelcomeClosed] = useState(false);
   const [slide, setSlide] = useState(0);
   const [galleryOpen, setGalleryOpen] = useState(false);
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
   const target = useMemo(() => new Date(2026, 8, 26, 14, 0, 0), []);
   const [time, setTime] = useState({
      days: 24,
      hours: 14,
      mins: 0,
      secs: 0,
   });
   useEffect(() => {
      const tick = () => {
         const d = Math.max(0, target.getTime() - Date.now());
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
   }, [target]);
   useEffect(() => {
      const key = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            if (modal === "welcome") setWelcomeClosed(true);
            setModal(null);
            setGalleryOpen(false);
         }
         if (!galleryOpen) return;
         if (e.key === "ArrowLeft") {
            setSlide(
               (current) => (current + gallery.length - 1) % gallery.length,
            );
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

   const gallery = [
      `${ASSET_IMG}/galeria/0.1.jpg`,
      `${ASSET_IMG}/galeria/0.jpg`,
      `${ASSET_IMG}/galeria/1.jpg`,
      `${ASSET_IMG}/galeria/2.jpg`,
      `${ASSET_IMG}/galeria/3.jpg`,
      `${ASSET_IMG}/galeria/4.jpg`,
      `${ASSET_IMG}/galeria/5.jpg`,
      `${ASSET_IMG}/galeria/6.jpg`,
      `${ASSET_IMG}/galeria/7.jpg`,
      `${ASSET_IMG}/galeria/8.jpg`,
      `${ASSET_IMG}/galeria/9.jpg`,
      `${ASSET_IMG}/galeria/10.jpg`,
      `${ASSET_IMG}/galeria/11.jpg`,
   ];
   const open = (name: ModalName) => setModal(name);

   const handleMusicEnter = () => {
      setMusicControlsVisible(true);
      setIsMusicPlaying(true);
      setWelcomeClosed(true);
      setModal(null);
   };

   const handleMusicSkip = () => {
      setMusicControlsVisible(true);
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
            videoId: "MenfUqRi_gI",
            playerVars: {
               autoplay: isMusicPlaying ? 1 : 0,
               loop: 1,
               playlist: "MenfUqRi_gI",
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
                  const isPlaying =
                     event.data === window.YT?.PlayerState?.PLAYING;
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
         {musicControlsVisible && (
            <>
               <div className="hidden-music-player" aria-hidden="true">
                  <div id="music-player-container" />
               </div>
               <button
                  type="button"
                  className="music-toggle"
                  onClick={toggleMusic}
                  aria-label={
                     isMusicPlaying ? "Pausar música" : "Reproducir música"
                  }
               >
                  {isMusicPlaying ? "❚❚" : "▶"}
               </button>
            </>
         )}

         <section className="hero" id="inicio">
            <div className="hero-photo" />
            <div className="hero-tint" />
            <div className="hero-content reveal">
               <div className="date">26.09.2026</div>
               <h1>{CUMPLEANERA}</h1>
               <p>Mi primer añito</p>
            </div>
            <div className="scroll-mark" aria-hidden="true">
               <span>⌄</span>
            </div>
         </section>
         <div className="content">
            <Wave color="#fff" flip2 />
            <section className="intro section-white">
               <img
                  className="flower-corner flower-one"
                  src={`${ASSET_IMG}/nube.png`}
                  alt=""
               />
               <div className="quote-mark">"</div>
               <p className="quote">
                  {" "}
                  Nuestra pequeña conejita va a cumplir su{" "}
                  <span style={{ fontWeight: "bold" }}>Primer Añito,</span> ven
                  a festejar con nosotros!
               </p>
               <div className="intro-story">
                  <div className="intro-story-image">
                     <img src={`${ASSET_IMG}/conejita.png`} alt="" />
                  </div>
                  <div className="intro-story-copy">
                     <p>El tiempo vuela...</p>
                     <p>12 meses mágicos</p>
                     <p>8760 horas encantadoras</p>
                     <p>365 días apasionantes</p>
                  </div>
               </div>

               <div className="quote-mark closing">"</div>
               <FloralMark />
               <div className="countdown-wrap">
                  <span>Falta</span>
                  <div className="countdown">
                     {[
                        [time.days, "días"],
                        [time.hours, "hs"],
                        [time.mins, "min"],
                        [time.secs, "seg"],
                     ].map(([n, l]) => (
                        <div key={l}>
                           <strong>{String(n).padStart(2, "0")}</strong>
                           <small>{l}</small>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            <section className="guests blush-section">
               <Wave color="#fff" flip />
               <div className="guest-card reveal">
                  <div className="guest-number">
                     <img src={`${ASSET_IMG}/mariposa.png`} alt="Hola" />
                  </div>
                  <h3>INVITADO(A)</h3>
                  <h1>{invitado?.nombre ?? "Missy"}</h1>
                  <p>{invitado?.apellidos ?? ""}</p>
               </div>
               <p className="guest-note">
                  Tu presencia es lo más importante.
                  <br />
                  ¡No faltes!
               </p>
               <Wave color="#fff" />
            </section>
            <section className="celebration section-white" id="celebracion">
               <img
                  className="flower-corner flower-two"
                  src={`${ASSET}/flores_Grupo01_B.png`}
                  alt=""
               />
               <div className="section-heading">
                  <p>Será un día inolvidable y queremos vivirlo contigo.</p>
                  <h2>Celebración</h2>
                  <FloralMark />
               </div>
               <div className="event-grid">
                  <article>
                     <div className="line-icon">
                        <Icon name="calendar" />
                     </div>
                     <h4>DÍA</h4>
                     <p>Sábado 26 de Septiembre - 02:00 pm</p>
                     <Button
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${CUMPLEANERA}+-+Mi+Primer+A%C3%B1ito&dates=20260926T190000Z/20260926T250000Z`}
                     >
                        AGENDAR
                     </Button>
                  </article>
                  <article>
                     <div className="line-icon">
                        <Icon name="check" />
                     </div>
                     <h4>LUGAR</h4>
                     <p>Hospedaje Casa Blanca</p>
                     <Button onClick={() => open("rsvp")}>
                        CONFIRMAR ASISTENCIA
                     </Button>
                  </article>
                  <article>
                     <div className="line-icon">
                        <Icon name="pin" />
                     </div>
                     <h4>DIRECCIÓN</h4>
                     <p style={{ marginBottom: "0" }}>
                        Urb. Sol y Mar, Mz A lote 2 - Paita
                     </p>
                     <p
                        style={{
                           fontStyle: "italic",
                           fontSize: ".9rem",
                           marginBottom: "20px",
                        }}
                     >
                        Referencia: A una cuadra de Plaza Vea
                     </p>
                     <Button href="https://maps.app.goo.gl/vMhXGmaD5KMtBjs19">
                        ¿CÓMO LLEGAR?
                     </Button>
                  </article>
               </div>
            </section>

            <section className="itinerary section-white" id="itinerario">
               <Wave color="#fff" flip />
               <div className="section-heading">
                  <p>Estos son algunos momentos que compartiremos.</p>
                  <h2>Itinerario</h2>
                  <FloralMark />
               </div>
               <div className="timeline">
                  {eventos.map(({ hour, event, icon }) => (
                     <div className="timeline-item" key={hour}>
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
               <div>
                  <Icon name="check" />
                  <h2>Confirmar Asistencia</h2>
                  <p>Es importante que confirmes tu asistencia</p>
                  <Button light onClick={() => open("rsvp")}>
                     CONFIRMAR ASISTENCIA
                  </Button>
               </div>
               <Wave color="#fff" />
            </section>

            <section className="gallery-section section-white" id="galeria">
               <div className="section-heading">
                  <h2>Un recorrido de mis primeros 11 meses</h2>
                  <p>Junto a personas que son muy importantes en mi vida</p>
                  <FloralMark />
               </div>
               <div className="gallery-shell">
                  <button
                     onClick={() =>
                        setSlide((slide + gallery.length - 1) % gallery.length)
                     }
                     aria-label="Foto anterior"
                  >
                     ‹
                  </button>
                  <button
                     type="button"
                     className="gallery-image-button"
                     onClick={() => setGalleryOpen(true)}
                     aria-label={`Ver foto ${slide + 1} en grande`}
                  >
                     <img
                        key={gallery[slide]}
                        src={gallery[slide]}
                        alt={`Recuerdo de ${CUMPLEANERA} ${slide + 1}`}
                     />
                  </button>
                  <button
                     onClick={() => setSlide((slide + 1) % gallery.length)}
                     aria-label="Foto siguiente"
                  >
                     ›
                  </button>
               </div>
               <div className="dots">
                  {gallery.map((image, i) => (
                     <button
                        key={image}
                        className={i === slide ? "active" : ""}
                        onClick={() => setSlide(i)}
                        aria-label={`Ver foto ${i + 1}`}
                     />
                  ))}
               </div>
            </section>

            {galleryOpen && (
               <div
                  className="gallery-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Foto ${slide + 1} de ${gallery.length}`}
                  onMouseDown={() => setGalleryOpen(false)}
               >
                  <button
                     type="button"
                     className="lightbox-close"
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
                        setSlide(
                           (current) =>
                              (current + gallery.length - 1) % gallery.length,
                        );
                     }}
                     aria-label="Foto anterior"
                  >
                     ‹
                  </button>
                  <img
                     src={gallery[slide]}
                     alt={`Recuerdo de ${CUMPLEANERA} ${slide + 1}`}
                     onMouseDown={(event) => event.stopPropagation()}
                  />
                  <button
                     type="button"
                     className="lightbox-nav lightbox-next"
                     onClick={(event) => {
                        event.stopPropagation();
                        setSlide((current) => (current + 1) % gallery.length);
                     }}
                     aria-label="Foto siguiente"
                  >
                     ›
                  </button>
                  <span className="lightbox-counter">
                     {slide + 1} / {gallery.length}
                  </span>
               </div>
            )}

            <section className="party blush-section" id="fiesta">
               <Wave color="#faf1fa" flip />
               <div className="section-heading">
                  <h2>Fiesta</h2>
                  <p>
                     Hagamos juntos una fiesta épica.
                     <br />
                     Aquí algunos detalles a tener en cuenta.
                  </p>
                  <FloralMark />
               </div>
               <div className="party-grid">
                  <article>
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

            <section className="instagram-section">
               <Wave color="#fff" flip />
               <div className="insta-overlay">
                  <Icon name="instagram" />
                  <h2>Una gran fiesta junto a ti</h2>
                  <p>Comparte tus fotos y videos de este hermoso día</p>
                  <a
                     href="https://photos.app.goo.gl/BovKMT4rCkVaCDok7"
                     target="_blank"
                     rel="noreferrer"
                  >
                     <strong>#missy1añito</strong>
                     <span>COMPARTE TUS FOTOS AQUÍ</span>
                  </a>
               </div>
            </section>

            <footer>
               <h2>{CUMPLEANERA}</h2>
               <p>Mi primer añito</p>
               <nav>
                  <button onClick={() => open("rsvp")}>
                     Confirmar asistencia
                  </button>
                  <i>·</i>
                  <i>·</i>
                  <a href="#celebracion">Agendar celebración</a>
               </nav>
               <div className="footer-rule" />
               <small>
                  Desarrollado con <Icon name="heart" /> por{" "}
                  <b>Daniel Quezada</b>
               </small>
            </footer>
         </div>

         {modal === "welcome" && (
            <div className="modal-backdrop welcome" role="presentation">
               <div
                  className="modal-card welcome-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="welcome-title"
               >
                  <img src={`${ASSET_IMG}/conejita.jpeg`} alt="" />
                  <p>Bienvenid@ a la invitación de</p>
                  <h2 id="welcome-title">Missy</h2>
                  <span>La música de fondo es parte de la experiencia</span>
                  <Button onClick={handleMusicEnter}>
                     INGRESAR CON MÚSICA
                  </Button>
                  <button className="text-button" onClick={handleMusicSkip}>
                     Ingresar sin música
                  </button>
               </div>
            </div>
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
