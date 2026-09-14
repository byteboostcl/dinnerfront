import { City, ExperienceCard, BrandEvent, MenuItem, Social, PaymentMethod, FAQItem } from '../models';

export const NAVIGATION_MENU: MenuItem[] = [
  {
    label: 'La Experiencia',
    anchor: 'experiencia'
  },
  {
    label: 'Ciudades',
    anchor: 'ciudades'
  },
  {
    label: 'Eventos',
    anchor: 'eventos'
  },
  {
    label: 'La Historia',
    anchor: 'historia'
  },
  {
    label: 'Preguntas frecuentes',
    link: '/faq'
  },
  {
    label: 'Seguridad',
    anchor: 'seguridad'
  },
  {
    label: 'Contacto',
    anchor: 'contacto'
  }
];

export const CITIES: City[] = [
  {
    id: 'ensenada',
    name: 'Ensenada',
    slug: 'ensenada',
    image: 'assets/images/hero-ensenada.webp',
    cardImage: 'assets/images/city/ensenada-card.webp',
    dates: '14 al 30 de Agosto',
    description: 'Una mesa suspendida a 45 metros sobre el valle',
    height: '45 metros',
    guestCount: 22,
    minAge: 6,
    maxWeight: 130,
    duration: '60 minutos',
    menuCourses: 3,
    startPrice: 3800,
    currency: 'MXN',
    available: true,
    region: 'Baja California',
    turitopService: 'P150',
    subtitle: 'Una mesa suspendida a 45 metros sobre el valle.',
    longDescription: 'Cena de tres tiempos, vinos del Valle de Guadalupe y una vista al viñedo al atardecer. Cupos limitados por temporada.',
    features: ['Menú de tres tiempos', 'Vinos de la región', '22 personas por vuelo', 'Seguridad de clase mundial'],
    schedule: 'Viernes a domingo',
    scheduleTimes: '12, 2, 4 y 6 PM',
    urgencyNote: '¡Muy pocos lugares!',
    limitedDatesLabel: 'Últimas fechas',
    limitedDates: '28, 29 y 30 de agosto',
    limitedTimesLabel: 'Únicos horarios',
    limitedTimes: '2:00 p.m., 4:00 p.m. y 6:00 p.m.'
  },
  {
    id: 'tijuana',
    name: 'Tijuana',
    // No slug-based route on this site — the card links out via externalUrl
    // to staging.dinnerinthesky.com.mx instead of an internal /tijuana page.
    slug: 'tijuana',
    image: 'assets/images/city/tijuana-card.webp',
    cardImage: 'assets/images/city/tijuana-card.webp',
    dates: '4 al 27 de Septiembre',
    description: 'Una mesa suspendida a 45 metros sobre Tijuana',
    height: '45 metros',
    guestCount: 22,
    minAge: 6,
    maxWeight: 130,
    duration: '60 minutos',
    menuCourses: 3,
    startPrice: 3800,
    currency: 'MXN',
    available: true,
    region: 'Baja California',
    externalUrl: 'https://staging.dinnerinthesky.com.mx/',
    subtitle: 'No es solo una cena. Es vivir Tijuana desde 45 metros de altura.',
    longDescription: 'Elige tu experiencia: paquetes desde $1,900 hasta $3,800 MXN. Una sola mesa, 22 lugares por vuelo y fechas únicas.',
    features: ['Menú de tres tiempos', 'Vinos de la región', '22 personas por vuelo', 'Seguridad de clase mundial'],
    schedule: 'Viernes a domingo',
    scheduleTimes: '4:00, 6:00, 7:30 y 9:30 PM',
    seasonalBannerIcon: '⏱',
    seasonalBannerTitle: 'Últimas 2 semanas en Tijuana',
    seasonalBannerSubtitle: 'Nos vamos el 27 de septiembre.',
    seasonalBannerVariant: 'departure'
  },
  {
    id: 'puebla',
    name: 'Puebla',
    slug: 'puebla',
    image: 'assets/images/hero-puebla.webp',
    cardImage: 'assets/images/city/puebla-card.webp',
    dates: '13 al 25 de Octubre',
    description: 'Una mesa suspendida a 45 metros sobre Puebla',
    height: '45 metros',
    guestCount: 22,
    minAge: 6,
    maxWeight: 130,
    duration: '60 minutos',
    menuCourses: 3,
    startPrice: 3800,
    currency: 'MXN',
    available: true,
    region: 'Puebla',
    turitopService: 'P151',
    subtitle: 'Una mesa suspendida a 45 metros sobre Puebla.',
    longDescription: 'Gastronomía poblana de autor, maridaje regional y una vista de la ciudad colonial al atardecer. Cupos limitados por temporada.',
    features: ['Menú de tres tiempos', 'Vinos de la región', '22 personas por vuelo', 'Seguridad de clase mundial'],
    schedule: 'Viernes a domingo',
    scheduleTimes: '12, 2, 4 y 6 PM'
  },
  {
    id: 'mexico-city',
    name: 'Ciudad de México',
    slug: 'ciudad-de-mexico',
    image: 'assets/images/landing-ciudad-de-mexico.webp',
    dates: '3 al 20 de Diciembre',
    description: 'Una mesa suspendida a 45 metros sobre la ciudad',
    height: '45 metros',
    guestCount: 22,
    minAge: 6,
    maxWeight: 130,
    duration: '60 minutos',
    menuCourses: 3,
    startPrice: 3800,
    currency: 'MXN',
    available: true,
    region: 'Ciudad de México',
    turitopService: 'P152',
    pageHeroImage: 'assets/images/city/hero-cdmx-2026.webp',
    subtitle: 'Una mesa suspendida a 45 metros sobre la ciudad.',
    longDescription: 'Gastronomía de autor, servicio de hospitality y una vista de 360° que convierte tu reserva en un recuerdo irrepetible. Cupos limitados por temporada.',
    features: ['Menú de tres tiempos', 'Vinos de la región', '22 personas por vuelo', 'Seguridad de clase mundial'],
    schedule: 'Viernes a domingo',
    scheduleTimes: '12, 2, 4 y 6 PM',
    seasonalBannerIcon: '🎄',
    seasonalBannerTitle: 'Boletos limitados',
    seasonalBannerSubtitle: 'Asegura tu lugar hoy'
  },
  {
    id: 'hermosillo',
    name: 'Hermosillo',
    slug: 'hermosillo',
    image: 'assets/images/city/hermosillo-coming-soon.png',
    cardImage: 'assets/images/city/hermosillo-card.png',
    pageHeroImage: 'assets/images/city/hermosillo-hero.webp',
    dates: '12 al 29 de Noviembre 2026',
    description: 'Dinner in the Sky por primera vez en Hermosillo, Sonora',
    height: '45 metros',
    guestCount: 22,
    minAge: 6,
    maxWeight: 130,
    duration: '60 minutos',
    menuCourses: 3,
    startPrice: 3500,
    currency: 'MXN',
    available: true,
    region: 'Sonora',
    subtitle: 'Dinner in the Sky por primera vez en Hermosillo, Sonora.',
    longDescription: 'Eleva tus sentidos. Regístrate para ser de los primeros en vivirla.',
    features: ['Menú de tres tiempos', 'Vinos de la región', '22 personas por vuelo', 'Seguridad de clase mundial'],
    schedule: 'Próximamente',
    scheduleTimes: 'Fechas por confirmar',
    cardCtaLabel: 'Registrarme'
  }
];

export const EXPERIENCE_GALLERY: ExperienceCard[] = [
  {
    id: 'dining',
    title: 'Cena en el cielo',
    image: 'assets/images/experiencia-cena-en-el-cielo.webp',
    description: 'Dining in the sky'
  },
  {
    id: 'service',
    title: 'Servicio',
    image: 'assets/images/experiencia-servicio.webp',
    description: 'Premium service'
  },
  {
    id: 'aerial',
    title: 'Vista aérea',
    image: 'assets/images/experiencia-vista-aerea.webp',
    description: 'Aerial view'
  },
  {
    id: 'celebration',
    title: 'Celebración',
    image: 'assets/images/experiencia-celebracion.webp',
    description: 'Celebration'
  },
  {
    id: 'gastronomy',
    title: 'Gastronomía',
    image: 'assets/images/experiencia-gastronomia.webp',
    description: 'Gourmet cuisine'
  },
  {
    id: 'panoramic',
    title: 'Vista panorámica',
    image: 'assets/images/experiencia-vista-panoramica-ciudad.webp',
    description: 'Panoramic city view'
  }
];

export const BRAND_EVENTS: BrandEvent[] = [
  {
    id: 'event-1',
    image: 'assets/images/b2b-marca-01.webp',
    alt: 'Evento privado de marca en las alturas con Dinner in the Sky México (1 de 5)'
  },
  {
    id: 'event-2',
    image: 'assets/images/b2b-marca-02.webp',
    alt: 'Evento privado de marca en las alturas con Dinner in the Sky México (2 de 5)'
  },
  {
    id: 'event-3',
    image: 'assets/images/b2b-marca-03.webp',
    alt: 'Evento privado de marca en las alturas con Dinner in the Sky México (3 de 5)'
  },
  {
    id: 'event-4',
    image: 'assets/images/b2b-marca-04.webp',
    alt: 'Evento privado de marca en las alturas con Dinner in the Sky México (4 de 5)'
  },
  {
    id: 'event-5',
    image: 'assets/images/b2b-marca-05.webp',
    alt: 'Evento privado de marca en las alturas con Dinner in the Sky México (5 de 5)'
  }
];

export const SOCIAL_LINKS: Social[] = [
  {
    platform: 'facebook',
    icon: 'assets/icons/facebook.webp',
    url: 'https://facebook.com/dinnerintheskymexico',
    label: 'Facebook'
  },
  {
    platform: 'instagram',
    icon: 'assets/icons/instagram.webp',
    url: 'https://instagram.com/dinnerintheskymxoficial',
    label: 'Instagram'
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: 'Visa',
    icon: 'assets/icons/visa.svg',
    alt: 'Visa payment'
  },
  {
    name: 'Mastercard',
    icon: 'assets/icons/mastercard.svg',
    alt: 'Mastercard payment'
  },
  {
    name: 'American Express',
    icon: 'assets/icons/amex.svg',
    alt: 'American Express payment'
  }
];

export const FAQ_INTRO = {
  title: 'Preguntas Frecuentes',
  lines: [
    'No todos se atreven.',
    'Pero todos preguntan.',
    'Aquí tienes lo que necesitas saber antes de subir:'
  ]
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Es seguro?',
    answer: 'Sí. Operamos bajo los más altos estándares internacionales, con equipo certificado y personal especializado.'
  },
  {
    id: 'faq-2',
    question: '¿A qué altura es la experiencia?',
    answer: 'Aproximadamente 45 metros. Lo suficiente para cambiar tu perspectiva.'
  },
  {
    id: 'faq-3',
    question: '¿Cuánto dura?',
    answer: 'Alrededor de 60 minutos en el aire. Un recuerdo para siempre.'
  },
  {
    id: 'faq-4',
    question: '¿Cuántas personas suben?',
    answer: '22 invitados por experiencia. No hay multitudes. Hay momentos.'
  },
  {
    id: 'faq-5',
    question: '¿Hay baño?',
    answer: 'Sí, en tierra antes y después de la experiencia.\n\nUna vez arriba, no hay pausas.'
  },
  {
    id: 'faq-6',
    question: '¿Edad mínima?',
    answer: 'A partir de 6 años, acompañados de un adulto.'
  },
  {
    id: 'faq-7',
    question: '¿Hay límite de peso o condiciones físicas?',
    answer: 'Sí. El límite es de 130 kg por persona.\n\nLa seguridad no se negocia.'
  },
  {
    id: 'faq-8',
    question: '¿Qué pasa si tengo vértigo?',
    answer: 'Tal vez sientas emoción.\n\nMuchos dudan… y terminan disfrutándolo.'
  },
  {
    id: 'faq-9',
    question: '¿Qué debo usar?',
    answer: 'Ropa cómoda. Evita objetos sueltos.\n\nAquí vienes a vivir, no a preocuparte.'
  },
  {
    id: 'faq-10',
    question: '¿Puedo llevar celular o cámara?',
    answer: 'Sí, bajo tu responsabilidad.\n\nLo que vas a ver… querrás recordarlo.'
  },
  {
    id: 'faq-11',
    question: '¿Qué pasa si llueve o hay mal clima?',
    answer: 'La seguridad es primero.\n\nPodemos reprogramar si las condiciones no son adecuadas.'
  },
  {
    id: 'faq-12',
    question: '¿Puedo cancelar o pedir reembolso?',
    answer: 'No hay reembolsos.\n\nTu lugar está reservado para alguien que decidió atreverse.'
  },
  {
    id: 'faq-13',
    question: '¿Puedo cambiar mi fecha?',
    answer: 'Sujeto a disponibilidad y condiciones. Consúltanos con anticipación.'
  },
  {
    id: 'faq-14',
    question: '¿Se puede tomar alcohol?',
    answer: 'Sí, de manera moderada.\n\nDisfrutar también es saber medir.'
  },
  {
    id: 'faq-15',
    question: '¿Es apto para embarazadas?',
    answer: 'No es recomendable.'
  },
  {
    id: 'faq-16',
    question: '¿Puedo hacer eventos privados?',
    answer: 'Sí. Y son otra liga.'
  }
];

export const HERO_SECTION = {
  headline: 'Elevarse no es para todos',
  subheading: 'El mundo se ve diferente desde aquí arriba',
  backgroundImage: 'assets/images/hero-bg.webp',
  backgroundImageMobile: 'assets/images/hero-bg-mobile.webp',
  features: [
    '45 metros de altura',
    'Solo 22 invitados por vuelo',
    'Gastronomía de autor',
    'Desde $3,800 MXN por persona'
  ]
};

export const CITIES_INTRO = {
  title: 'Ciudades.',
  lines: [
    'No está en todos lados.',
    'Y no siempre está cerca.',
    'Dinner in the Sky viaja por el mundo y solo aparece por tiempo limitado.',
    'Busca tu ciudad.',
    'Y si está, decide rápido.',
    'Los valientes no esperan.'
  ]
};

export const EXPERIENCE_SECTION = {
  title: 'La Experiencia.',
  lines: [
    'No es para todos.',
    'Es para los que se atreven.',
    'Nacida en Bélgica y presente en más de 70 países, ésta experiencia ha llevado la mesa a las alturas en las ciudades más icónicas del mundo.',
    'Hoy llega para quienes entienden que la vida no se vive desde abajo.',
    'A 45 metros de altura, todo cambia. El pulso se acelera.',
    'Y lo comprendes: elevarse exige valentía.',
    '22 lugares por vuelo.',
    'Un momento que no se repite.'
  ],
  cta: 'Ver calendario y ciudades'
};

export const EVENTS_SECTION = {
  title: 'Eventos Privados Marcas',
  lines: [
    'No es publicidad.',
    'Es impacto.',
    'Marcas y empresas que quieren destacar no hacen lo mismo que todos.',
    'Crean momentos que se cuentan, se comparten y se recuerdan.',
    'Lanzamientos, relaciones públicas, experiencias para clientes, equipos o aliados estratégicos.',
    'Todo cambia cuando sucede en el aire.',
    'Atención total.',
    'Un escenario imposible de ignorar.',
    'Si tu marca quiere estar más arriba éste es el lugar.'
  ],
  ctaPrimary: 'Cotizar evento',
  ctaSecondary: 'Calendario público'
};

export const IMPACT_SECTION = {
  eyebrow: 'LEGADO E IMPACTO',
  title: 'Una marca que el mundo ya conoce',
  subtitle: 'Un legado medible: alcance internacional, eventos realizados y comensales que ya vivieron la experiencia.',
  metrics: [
    { value: '+70', label: 'países en el mundo' },
    { value: '+10,000', label: 'eventos realizados' },
    { value: '+1M', label: 'de comensales' }
  ]
};

export const PAYMENTS_SECTION = {
  eyebrow: 'PAGO SEGURO',
  title: 'Reserva con métodos de pago confiables',
  subtitle: 'Opciones seguras para clientes locales e internacionales. Tarjetas bancarias con total transparencia en el precio final.',
  cardTitle: 'Tarjeta bancaria',
  cardText: 'Visa, Mastercard y American Express. Transacción segura con total transparencia en el precio final.'
};

export const SAFETY_SECTION = {
  title: 'Seguridad',
  lines: [
    'La valentía no es imprudencia.',
    'Es confiar. En un sistema probado en más de 70 países. En ingeniería certificada. En un equipo que sabe exactamente lo que hace.',
    'Aquí el riesgo no está en la seguridad, está en no vivirlo.'
  ],
  image: 'assets/images/safety-visual.webp'
};

export const HISTORY_SECTION = {
  eyebrow: 'HISTORIA',
  title: 'Altura, sabor y un recuerdo imposible de olvidar',
  blocks: [
    {
      id: 'what-is',
      eyebrow: 'QUÉ ES',
      title: 'Dinner in the Sky',
      description: 'Una mesa suspendida a hasta 45 metros: gastronomía fina, servicio de hospitality y una vista que convierte cualquier ocasión en un hito. Nacida en Bélgica y presente en más de 70 países, llega a México con el mismo estándar global.',
      image: 'assets/images/story-que-es.webp'
    },
    {
      id: 'how-it-works',
      eyebrow: 'CÓMO FUNCIONA',
      title: 'Llegas, subes, disfrutas',
      description: 'Reserva tu ciudad y fecha, recibes confirmación y briefing previo. En sede te acompañamos en todo momento: abordo, servicio coordinado y descenso con calma. Pensado para que solo te ocupes de vivir el momento.',
      image: 'assets/images/story-como-funciona.webp'
    },
    {
      id: 'what-included',
      eyebrow: 'QUÉ INCLUYE',
      title: 'Todo listo para tu experiencia',
      description: 'Acceso a la plataforma, cena de tres tiempos, vinos de la región, servicio coordinado y las mejores vistas panorámicas de la ciudad. Solo llega: del resto nos ocupamos nosotros.',
      image: 'assets/images/story-que-incluye.webp'
    }
  ]
};

export const FOOTER_TEXT = {
  copyright: '© 2026 DITS MEXICO',
  websiteUrl: 'https://dinnerinthesky.com.mx',
  whatsappNumber: '+525545064656',
  whatsappLabel: 'Envíame un whatsapp',
  whatsappMessage: 'Hola estoy viendo la página web y tengo algunas dudas sobre la experiencia de Dinner in the Sky.'
};
