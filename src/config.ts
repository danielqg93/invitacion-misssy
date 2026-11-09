/**
 * ============================================================
 *  CONFIGURACIÓN — PRIMER AÑITO · "CONEJITA ENTRE NUBES"
 *
 *  Aquí están TODOS los datos de la invitación (versión DEMO).
 *  Reemplaza los valores marcados con "TODO" por los datos reales.
 *
 *  Imágenes: nombre de archivo dentro de public/img/ (ej. "foto.jpg")
 *  o una URL completa (https://...).
 *
 *  Invitados y códigos: db/invitados.json
 *  Itinerario:          db/itinerario.json
 *  Créditos de fotos:   CREDITOS.md
 * ============================================================
 */

/** Foto de Unsplash (images.unsplash.com). Reemplázalas por fotos reales. */
const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

/** Años que cumple. */
const EDAD: number = 1; // TODO

/**
 * Diseños de portada disponibles:
 *  - "clasica":  foto a pantalla completa con el nombre encima.
 *  - "arco":     fondo pastel con la foto dentro de un arco, nubes y moño.
 *  - "polaroid": collage de 3 fotos tipo polaroid sobre fondo crema.
 *  - "dividida": foto a un lado y panel rosado con un gran número de edad.
 *
 *  Portadas animadas (el contenido aparece al hacer scroll):
 *  - "telon":   un telón rosado se abre y descubre la foto y el nombre.
 *  - "ventana": una ventana circular con la foto crece hasta llenar la pantalla.
 *  - "nubes":   las nubes se separan, sube la conejita y el nombre aparece letra a letra.
 *
 * Para mostrar otra portada sin tocar el código, agrega ?portada=arco
 * a la URL (ej. .../invitacion-misssy/?portada=polaroid#/DEMO01).
 */
export type Portada =
  | "clasica"
  | "arco"
  | "polaroid"
  | "dividida"
  | "telon"
  | "ventana"
  | "nubes";
export const PORTADAS: Portada[] = [
  "clasica",
  "arco",
  "polaroid",
  "dividida",
  "telon",
  "ventana",
  "nubes",
];

/**
 * Diseños de la ventana de bienvenida (la que pregunta por la música):
 *  - "clasica": tarjeta blanca con la conejita.
 *  - "sobre":   un sobre rosado con sello; al tocarlo se abre y sale la carta.
 *  - "foto":    tarjeta rosada con la foto redonda y la conejita asomándose.
 *  - "nubes":   cielo rosado con nubes flotando y el nombre dentro de una nube.
 *
 * También se puede elegir desde la URL: ?bienvenida=sobre
 * (se combina con la portada: ?portada=nubes&bienvenida=sobre).
 */
export type Bienvenida = "clasica" | "sobre" | "foto" | "nubes";
export const BIENVENIDAS: Bienvenida[] = ["clasica", "sobre", "foto", "nubes"];

/**
 * Estilo de las ilustraciones (conejita, nubes, mariposas, flores):
 *  - "vector":   dibujos SVG nítidos y animados (parpadeo, aleteo).
 *                Se generan con: python scripts/generar-ilustraciones.py
 *  - "acuarela": las imágenes PNG/JPG originales estilo acuarela.
 */
const ESTILO_ARTE: "vector" | "acuarela" = "vector";

const ARTE = {
  vector: {
    conejita: "vector/conejita.svg",
    conejitaBienvenida: "vector/conejita-corona.svg",
    nube: "vector/nube.svg",
    mariposa: "vector/mariposa.svg",
    mariposa2: "vector/mariposa-durazno.svg",
    flores: "vector/flores.svg",
  },
  acuarela: {
    conejita: "conejita.png",
    conejitaBienvenida: "conejita.jpeg",
    nube: "nube.png",
    mariposa: "mariposa.png",
    mariposa2: "mariposa.png",
    flores: "vector/flores.svg",
  },
};

export const config = {
  /** Portada que se muestra por defecto. */
  portada: "clasica" as Portada,

  /** Ventana de bienvenida que se muestra por defecto. */
  bienvenida: "foto" as Bienvenida,

  /** Nombre de la cumpleañera tal como aparece en grande. */
  nombre: "Jazmin", // TODO

  edad: EDAD,

  /** Cómo referirse a ella en textos. */
  cumpleanero: "la cumpleañera",

  /** Texto bajo el nombre. */
  edadTexto: EDAD === 1 ? "Mi primer añito" : `Mis ${EDAD} añitos`,

  /**
   * Fecha y hora de inicio. OJO: el mes empieza en 0 (0 = enero, 11 = diciembre).
   * Ejemplo: new Date(2027, 2, 27, 14, 0) = sábado 27 de marzo 2027, 2:00 pm.
   */
  fechaEvento: new Date(2027, 2, 27, 14, 0), // TODO

  /** Duración aproximada en horas (para el botón "Agendar"). */
  duracionHoras: 6,

  /** Frase de la introducción. {edad} se reemplaza por "Primer Añito" / "2 Añitos"... */
  frase: {
    antes: "Nuestra pequeña conejita va a cumplir su",
    destacado: EDAD === 1 ? "Primer Añito," : `${EDAD} Añitos,`,
    despues: "¡ven a festejar con nosotros!",
  },

  lugar: "Salón de Eventos Jardín Encantado", // TODO
  direccion: "Av. Las Mariposas 123, Urb. Los Conejitos", // TODO
  referencia: "Referencia: Frente al Parque de las Flores", // TODO ("" para ocultarla)
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Plaza+de+Armas+de+Lima", // TODO (demo: apunta a un lugar genérico)

  /** ID del video de YouTube para la música de fondo. "" = sin música. */
  youtubeVideoId: "MenfUqRi_gI",

  /**
   * Dónde se guardan las confirmaciones de asistencia.
   * - "":  modo DEMO, el formulario responde "¡Gracias!" pero no guarda nada.
   * - URL de Google Apps Script (https://script.google.com/macros/s/.../exec).
   * - "/api/confirmaciones": guarda en db/confirmarAsistencia.json (local / Netlify).
   */
  rsvpEndpoint:
    "https://script.google.com/macros/s/AKfycbzCVZEz09u5XqYgWNMIvu1MgdMeOK4zY6K1TgRYM8Qcf12uRZwD3s6ZnFgzlejxcmJI/exec",

  galeria: {
    titulo: "Un recorrido de mis primeros 11 meses",
    subtitulo: "Junto a personas que son muy importantes en mi vida",
    /** Si la lista está vacía, la sección se oculta. */
    fotos: [
      u("1675130023188-bbed24881d23", 1000),
      u("1552788960-65fcafe071a5", 1000),
      u("1567822781105-a80d1b601697", 1000),
      u("1595678399493-2bd6b0ed9989", 1000),
      u("1608365151231-7dbed3034787", 1000),
      u("1604917621956-10dfa7cce2e7", 1000),
      u("1617793627552-d464a282feec", 1000),
      u("1653835785932-1710eac6385d", 1000),
      u("1660046791394-d9201f1148c2", 1000),
      u("1595678399575-3b3cfe7c8864", 1000),
      u("1734943598774-d0f20418a9a2", 1000),
      u("1758312906874-9bfd04023722", 1000),
      u("1785779087240-37f73a7cf3bf", 1000),
    ],
  },

  fotos: {
    /** Álbum compartido donde los invitados suben fotos. "" = sin enlace. */
    albumUrl: "", // TODO
    hashtag: "#Jazmin1Añito", // TODO
  },

  modales: {
    vestimenta: {
      titulo: "Elegante sport",
      texto:
        "Te invitamos a elegir tonos suaves y a reservar el rosa para la cumpleañera.",
    },
    tips: {
      titulo: "Ven puntual, la fiesta no espera... ¡y nosotros tampoco!",
      /** Se antepone "La recepción comienza a las HH:MM". */
      texto:
        "Te recomendamos llegar unos minutos antes, para que no te pierdas de nada.",
    },
    regalos: {
      titulo: "Tu presencia es mi mejor regalo",
      texto:
        "Si aun así deseas obsequiarme algo, podrás consultar los datos con mi familia.",
    },
  },

  /** Nombre que se muestra cuando el link no trae código de invitado (#/DEMO01). */
  invitadoPorDefecto: {
    nombre: "SOFÍA",
    apellidos: "MENDOZA RÍOS",
  },

  /** Minijuegos de la sección "Juguemos". false = se oculta. */
  juegos: {
    velita: true,
  },

  creditos: "Invitarte",

  imagenes: {
    /** Portada "clasica" en computadora (mejor horizontal). */
    portada: u("1675130155886-6fe33665bd65", 2000),
    /** Portada "clasica" en celular (mejor vertical). */
    portadaMovil: u("1675130023188-bbed24881d23", 1200),
    /** Foto dentro del arco (portada "arco") y de la portada "dividida". Vertical. */
    portadaVertical: u("1734943598774-d0f20418a9a2", 1200),
    /** 3 fotos de la portada "polaroid". */
    polaroids: [
      u("1552788960-65fcafe071a5", 700),
      u("1675130023188-bbed24881d23", 700),
      u("1604917621956-10dfa7cce2e7", 700),
    ],
    /** Fondo de la sección "Comparte tus fotos". */
    fondoFotos: u("1653835785932-1710eac6385d", 1600),
    /** Ilustraciones del tema: dependen de ESTILO_ARTE (arriba). */
    ...ARTE[ESTILO_ARTE],
  },
};
