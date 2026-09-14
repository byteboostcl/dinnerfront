// City and Experience Data Models
export interface City {
  id: string;
  name: string;
  slug: string;
  image: string;
  dates: string;
  description: string;
  height: string;
  guestCount: number;
  minAge: number;
  maxWeight: number;
  duration: string;
  menuCourses: number;
  startPrice: number;
  currency: string;
  available: boolean;
  region: string;
  /** TuriTop booking service id, e.g. 'P152'. Company is D119 for all cities. Absent = no live booking widget yet. */
  turitopService?: string;
  /** Bold one-liner under the card title, e.g. "Una mesa suspendida a 45 metros sobre el valle." */
  subtitle?: string;
  /** Longer marketing paragraph shown in the city card. */
  longDescription?: string;
  /** Feature bullets shown as an icon row in the card. */
  features?: string[];
  /** Operating days, e.g. "Viernes a domingo". */
  schedule?: string;
  /** Operating times, e.g. "12, 2, 4 y 6 PM". */
  scheduleTimes?: string;
  /** City detail page hero/highlight image, when it differs from the home-card `image` (e.g. CDMX). */
  pageHeroImage?: string;
  /** Smaller thumbnail for the homepage card grid / header submenu, when `image` is a large asset shared with the city's own full-bleed page hero (e.g. Ensenada, Puebla). Falls back to `image` when absent. */
  cardImage?: string;
  /** When set, the card/submenu CTA links out to this URL (new tab) instead of the internal `/slug` route — used for cities that don't have a page on this site (e.g. still on staging). */
  externalUrl?: string;
  /** When set, overrides the price shown in the homepage card badge (e.g. "Preventa") — used before a startPrice is confirmed. */
  priceLabel?: string;
  /** Optional CTA label for the city card. Defaults to "Reserva ahora". */
  cardCtaLabel?: string;
  /** Red urgency line above the card footer, e.g. "¡MUY POCOS LUGARES!". Shown only when set. */
  urgencyNote?: string;
  /** Small caps label for the remaining-dates badge, e.g. "ÚNICAS FECHAS DISPONIBLES". */
  limitedDatesLabel?: string;
  /** The only dates still on sale, e.g. "21, 22, 23, 28, 29 Y 30 DE AGOSTO". When set, the card's "Ver fechas →" CTA is replaced by a highlighted badge showing these (the badge keeps the same link). */
  limitedDates?: string;
  /** Small caps label replacing the weekly schedule when only certain times remain, e.g. "ÚNICOS HORARIOS". */
  limitedTimesLabel?: string;
  /** The only times still on sale, e.g. "2:00 P.M. Y 4:00 P.M.". Overrides `scheduleTimes` in the card when set. */
  limitedTimes?: string;
  /** Icon (emoji) for an optional festive/urgency banner shown between the schedule and the "Reserva ahora" CTA, e.g. "🎄". Requires `seasonalBannerTitle` to render. */
  seasonalBannerIcon?: string;
  /** Bold red headline for the seasonal banner, e.g. "Boletos limitados". When set, the banner (icon + title + subtitle) is shown; omit to keep the card's default footer. */
  seasonalBannerTitle?: string;
  /** Supporting caps line under the seasonal banner headline, e.g. "Asegura tu lugar hoy". */
  seasonalBannerSubtitle?: string;
  /** Optional visual treatment for the banner, e.g. a departure notice with a clock icon. */
  seasonalBannerVariant?: 'departure';
}

export interface ExperienceCard {
  id: string;
  title: string;
  image: string;
  description?: string;
}

export interface BrandEvent {
  id: string;
  image: string;
  alt: string;
}

export interface MenuItem {
  label: string;
  anchor?: string;
  link?: string;
  submenu?: MenuItem[];
  external?: boolean;
  /** When true, this item opens the events modal instead of navigating/anchoring. */
  modal?: boolean;
}

export interface Social {
  platform: string;
  icon: string;
  url: string;
  label: string;
}

export interface PaymentMethod {
  name: string;
  icon: string;
  alt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  og?: {
    image: string;
    url: string;
  };
}
