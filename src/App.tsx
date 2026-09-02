import { useEffect, useMemo, useState } from "react";

const ASSET = "https://fixdate.io/modelo-invitacion/74/img";

const ASSET_IMG = "http://localhost:5173/img";

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
   | "dress"
   | "info"
   | "gift"
   | "instagram"
   | "heart";

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
}: {
   children: React.ReactNode;
   onClick?: () => void;
   href?: string;
   light?: boolean;
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
      <button className={className} type="button" onClick={onClick}>
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
}: {
   color?: string;
   flip?: boolean;
}) {
   return (
      <svg
         className={`wave ${flip ? "wave-flip" : ""}`}
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
}: {
   active: Exclude<ModalName, "welcome" | null>;
   close: () => void;
}) {
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
                  onSubmit={(e) => {
                     e.preventDefault();
                     close();
                  }}
               >
                  <label>
                     ¿Quién está confirmando? <b>*</b>
                     <select required>
                        <option value="">Selecciona un invitado</option>
                        <option>Juan García</option>
                        <option>Sofía García</option>
                        <option>Mateo García</option>
                     </select>
                  </label>
                  <fieldset>
                     <legend>¿Asistes a la Celebración? *</legend>
                     <label className="inline">
                        <input type="radio" name="attend" required /> Sí,
                        asistiré
                     </label>
                     <label className="inline">
                        <input type="radio" name="attend" /> No asistiré
                     </label>
                  </fieldset>
                  <label>
                     Restricciones alimentarias
                     <textarea placeholder="Indícanos si necesitas algún menú especial..." />
                  </label>
                  <label>
                     Mensaje para la quinceañera
                     <textarea placeholder="Puedes dejarle un mensaje de cariño" />
                  </label>
                  <Button>ENVIAR CONFIRMACIÓN</Button>
               </form>
            )}
            {active === "song" && (
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     close();
                  }}
               >
                  <label>
                     Tu nombre
                     <input required placeholder="Nombre" />
                  </label>
                  <label>
                     Canción sugerida
                     <input required placeholder="Canción y artista" />
                  </label>
                  <Button>ENVIAR CANCIÓN</Button>
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
                  <p>¡Llegá con ganas de bailar!</p>
                  <span>
                     La recepción comienza a las 17 hs. Te recomendamos llegar
                     unos minutos antes.
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
   const [modal, setModal] = useState<ModalName>("welcome");
   const [slide, setSlide] = useState(0);
   const target = useMemo(
      () => new Date(Date.now() + 39 * 86400000 + 21 * 3600000),
      [],
   );
   const [time, setTime] = useState({
      days: 39,
      hours: 20,
      mins: 59,
      secs: 49,
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
         if (e.key === "Escape") setModal(null);
      };
      window.addEventListener("keydown", key);
      return () => window.removeEventListener("keydown", key);
   }, []);

   const gallery = [
      `${ASSET}/galeria/1.jpg`,
      `${ASSET}/galeria/2.jpg`,
      `${ASSET}/galeria/4.jpg`,
   ];
   const open = (name: ModalName) => setModal(name);

   return (
      <main>
         <section className="hero" id="inicio">
            <div className="hero-photo" />
            <div className="hero-tint" />
            <div className="hero-content reveal">
               <div className="date">15.06.2026</div>
               <h1>Florencia</h1>
               <p>Mis 15 años</p>
            </div>
            <div className="scroll-mark" aria-hidden="true">
               <span>⌄</span>
            </div>
            <Wave color="#fff" />
         </section>

         <section className="intro section-white">
            <img
               className="flower-corner flower-one"
               src={`${ASSET}/flores_Grupo01_C.png`}
               alt=""
            />
            <div className="quote-mark">"</div>
            <p className="quote">
               Te espero para compartir la alegría de esa noche que será para mí
               mágica, inolvidable y única.
            </p>
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
            <Wave color="#faf1fa" flip />
            <div className="guest-card reveal">
               <div className="guest-number">3</div>
               <h3>INVITADOS</h3>
               <p className="companion">(1 acompañante)</p>
               <ul>
                  <li>Juan García</li>
                  <li>Sofía García</li>
                  <li>Mateo García</li>
               </ul>
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
               <p>Será un día inolvidable y queremos vivirlo con vos.</p>
               <h2>Celebración</h2>
               <FloralMark />
            </div>
            <div className="event-grid">
               <article>
                  <div className="line-icon">
                     <Icon name="calendar" />
                  </div>
                  <h4>DÍA</h4>
                  <p>Sábado 15 de Junio - 17hs</p>
                  <Button href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Florencia+-+Mis+15+a%C3%B1os&dates=20261010T221000Z/20261011T060000Z">
                     AGENDAR
                  </Button>
               </article>
               <article>
                  <div className="line-icon">
                     <Icon name="check" />
                  </div>
                  <h4>LUGAR</h4>
                  <p>Salón Avril</p>
                  <Button onClick={() => open("rsvp")}>
                     CONFIRMAR ASISTENCIA
                  </Button>
               </article>
               <article>
                  <div className="line-icon">
                     <Icon name="pin" />
                  </div>
                  <h4>DIRECCIÓN</h4>
                  <p>Av. Los Reartes 12 - Lima</p>
                  <Button href="https://www.google.com/maps/search/?api=1&query=Av.+Los+Reartes+12+Lima">
                     ¿CÓMO LLEGAR?
                  </Button>
               </article>
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
               <h2>Un recorrido de estos 15 años</h2>
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
               <img
                  key={gallery[slide]}
                  src={gallery[slide]}
                  alt={`Recuerdo de Florencia ${slide + 1}`}
               />
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
                     <Icon name="music" />
                  </div>
                  <h3>Música</h3>
                  <p>
                     ¿Cuál es la canción que no debe faltar en la PlayList de la
                     fiesta?
                  </p>
                  <Button onClick={() => open("song")}>SUGERIR CANCIÓN</Button>
               </article>
               <article>
                  <div className="circle-icon">
                     <Icon name="dress" />
                  </div>
                  <h3>Dress Code</h3>
                  <p>
                     Una orientación para
                     <br />
                     tu vestuario
                  </p>
                  <Button onClick={() => open("dress")}>VER MÁS</Button>
               </article>
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

         <section className="gifts section-white">
            <div className="gift-icon">
               <Icon name="gift" />
            </div>
            <h2>Regalos</h2>
            <p>Si deseas regalarme algo más que tu hermosa presencia...</p>
            <Button onClick={() => open("gifts")}>DATOS BANCARIOS</Button>
         </section>

         <section className="instagram-section">
            <Wave color="#fff" flip />
            <div className="insta-overlay">
               <Icon name="instagram" />
               <h2>Una gran fiesta junto a vos</h2>
               <p>Comparte tus fotos y videos de este hermoso día</p>
               <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
               >
                  <strong>#15flor</strong>
                  <span>VER EN INSTAGRAM</span>
               </a>
            </div>
         </section>

         <footer>
            <h2>Florencia</h2>
            <p>Mis 15 años</p>
            <nav>
               <button onClick={() => open("rsvp")}>
                  Confirmar asistencia
               </button>
               <i>·</i>
               <button onClick={() => open("song")}>Sugerir canción</button>
               <i>·</i>
               <a href="#celebracion">Agendar celebración</a>
            </nav>
            <div className="footer-rule" />
            <small>
               Desarrollado con <Icon name="heart" /> por <b>fixdate</b>
            </small>
         </footer>

         {modal === "welcome" && (
            <div className="modal-backdrop welcome" role="presentation">
               <div
                  className="modal-card welcome-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="welcome-title"
               >
                  <img src={`${ASSET}/adorno-modal-musica.png`} alt="" />
                  <p>Bienvenid@ a la invitación de</p>
                  <h2 id="welcome-title">Missy</h2>
                  <span>La música de fondo es parte de la experiencia</span>
                  <Button onClick={() => setModal(null)}>
                     INGRESAR CON MÚSICA
                  </Button>
                  <button
                     className="text-button"
                     onClick={() => setModal(null)}
                  >
                     Ingresar sin música
                  </button>
               </div>
            </div>
         )}
         {modal && modal !== "welcome" && (
            <Modal active={modal} close={() => setModal(null)} />
         )}
      </main>
   );
}

export default App;
