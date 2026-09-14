import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private baseUrl = 'https://dinnerinthesky.com.mx';
  private defaultImage = '/assets/images/og-image.webp';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updatePageMeta(data: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    /** Pass true when `title` is already the full, final <title> text (no
     * " | Dinner In The Sky México" suffix appended) — used for the home
     * page, which would otherwise duplicate the brand name. */
    fullTitle?: boolean;
    /** Pass true for pages that shouldn't be indexed (e.g. a booking
     * thank-you page) — sets <meta name="robots" content="noindex, follow">. */
    noindex?: boolean;
  }) {
    const canonicalUrl = data.url || this.baseUrl;

    // Title
    this.titleService.setTitle(data.fullTitle ? data.title : `${data.title} | Dinner In The Sky México`);

    // Canonical link
    this.setCanonicalLink(canonicalUrl);

    // Robots
    if (data.noindex) {
      this.metaService.updateTag({ name: 'robots', content: 'noindex, follow' });
    } else {
      this.metaService.removeTag('name="robots"');
    }

    // Meta tags
    this.metaService.updateTag({
      name: 'description',
      content: data.description
    });

    if (data.keywords?.length) {
      this.metaService.updateTag({
        name: 'keywords',
        content: data.keywords.join(', ')
      });
    }

    // Open Graph
    this.metaService.updateTag({
      property: 'og:title',
      content: data.title
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: data.description
    });

    this.metaService.updateTag({
      property: 'og:image',
      content: data.image || this.defaultImage
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: canonicalUrl
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: 'website'
    });

    // Twitter Card
    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: data.title
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: data.description
    });
  }

  private setCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  /**
   * Injects one or more JSON-LD blocks into <head>. Replaces whatever this
   * service injected on the previous route so schemas never stack up across
   * navigation. Pass a single schema object or an array of schema objects.
   */
  setStructuredData(schema: Record<string, unknown> | Record<string, unknown>[]): void {
    this.document
      .querySelectorAll('script[data-structured-data="dits"]')
      .forEach(existing => existing.remove());

    const schemas = Array.isArray(schema) ? schema : [schema];

    schemas.forEach(item => {
      const script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-structured-data', 'dits');
      script.text = JSON.stringify(item);
      this.document.head.appendChild(script);
    });
  }

  /** Sitewide Organization schema — social profiles + contact, used on the home page. */
  buildOrganizationSchema(socialUrls: string[], whatsappNumber?: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Dinner In The Sky México',
      url: this.baseUrl,
      logo: `${this.baseUrl}/assets/images/logo-dits.webp`,
      ...(socialUrls.length ? { sameAs: socialUrls } : {}),
      ...(whatsappNumber
        ? {
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: whatsappNumber,
                contactType: 'customer service',
                areaServed: 'MX',
                availableLanguage: ['es']
              }
            ]
          }
        : {})
    };
  }

  /**
   * Product schema for a city experience. Uses only fields that already
   * exist and are maintained on the City model (price, currency,
   * availability) — deliberately omits event dates since `city.dates` is a
   * free-text Spanish range without a year and isn't safe to parse into
   * a reliable ISO startDate/endDate.
   */
  buildProductSchema(city: { name: string; description: string; image: string; startPrice: number; currency: string; available: boolean; slug: string }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Dinner In The Sky ${city.name}`,
      description: city.description,
      image: `${this.baseUrl}/${city.image}`,
      brand: {
        '@type': 'Brand',
        name: 'Dinner In The Sky'
      },
      offers: {
        '@type': 'Offer',
        price: city.startPrice,
        priceCurrency: city.currency,
        availability: city.available ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
        url: `${this.baseUrl}/${city.slug}`
      }
    };
  }

  /** FAQPage schema — mainEntity built from the real FAQ_ITEMS content. */
  buildFAQSchema(items: { question: string; answer: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/\n+/g, ' ').trim()
        }
      }))
    };
  }

  /**
   * BreadcrumbList schema. `items` is ordered Home -> ... -> current page.
   * `path` is relative (e.g. '', 'ensenada', 'faq') — this method resolves
   * it against baseUrl so no page has to know or hardcode the domain.
   */
  buildBreadcrumbSchema(items: { name: string; path: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.path ? `${this.baseUrl}/${item.path}` : this.baseUrl
      }))
    };
  }

  setHome() {
    this.updatePageMeta({
      title: 'Dinner In The Sky México | Cena en las Alturas a 45 Metros',
      fullTitle: true,
      description: 'Una experiencia gastronómica única a 45 metros de altura. Elevarse no es para todos. Reserva tu mesa en el cielo ahora.',
      keywords: ['Dinner in the Sky', 'experiencia', 'cena', 'gastronomía', 'México', 'Ensenada', 'Puebla', 'Ciudad de México'],
      url: this.baseUrl
    });
  }

  setCity(cityName: string, citySlug: string) {
    this.updatePageMeta({
      title: `Dinner In The Sky ${cityName}`,
      description: `Vive la experiencia única de Dinner in the Sky en ${cityName}. Mesa suspendida a 45 metros de altura con gastronomía de autor.`,
      keywords: ['Dinner in the Sky', cityName, 'experiencia', 'reserva'],
      url: `${this.baseUrl}/${citySlug}`
    });
  }

  setGracias() {
    this.updatePageMeta({
      title: 'Reserva confirmada',
      description: 'Gracias por tu reserva en Dinner In The Sky México.',
      url: `${this.baseUrl}/gracias`,
      noindex: true
    });
  }

  setFAQ() {
    this.updatePageMeta({
      title: 'Preguntas Frecuentes',
      description: 'Encuentra respuestas a todas tus preguntas sobre Dinner In The Sky México.',
      keywords: ['FAQ', 'preguntas frecuentes', 'Dinner in the Sky'],
      url: `${this.baseUrl}/faq`
    });
  }

  setNotFound() {
    this.updatePageMeta({
      title: 'Página no encontrada',
      description: 'La página que buscas no existe. Regresa al inicio.',
      keywords: ['error', '404', 'no encontrado']
    });
  }
}
