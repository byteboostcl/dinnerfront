import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MetaService } from '../../services/meta.service';
import { ContentService } from '../../services/content.service';

export interface HermosilloMenuItem {
  course: string;
  name: string;
}

export interface HermosilloPhoto {
  src: string;
  alt: string;
}

export interface HermosilloScheduleItem {
  time: string;
  name: string;
  price: string;
}

export interface HermosilloScheduleBlock {
  group: string;
  items: HermosilloScheduleItem[];
}

export interface HermosilloDiscoverCard {
  id: 'menu' | 'horarios' | 'experiencia' | 'mundo';
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  anchor: string;
  /** CSS object-position for the card thumbnail — lets a portrait photo (e.g.
   *  a chef headshot) keep the face/head in frame instead of being cropped
   *  dead-center when object-fit: cover forces it into the card's wide/short box.
   *  Only applies when mediaPosition is 'top' (the default). */
  imagePosition?: string;
  /** 'top' (default) = full-bleed cropped banner above the text, like the other
   *  cards. 'bottom' = no cropped banner — the complete, uncropped photo is
   *  shown below the description instead (e.g. a chef portrait you don't want
   *  cover-cropped). */
  mediaPosition?: 'top' | 'bottom';
  /** Overline label shown above the image in the 'bottom' feature layout
   *  (e.g. "Chef" for an actual chef portrait). Defaults to 'Chef' in the
   *  template when omitted — set this explicitly when `image` is NOT a
   *  chef photo (e.g. a generic "coming soon" graphic) so the label isn't
   *  misleading. */
  featureLabel?: string;
}

export interface HermosilloStat {
  value: string;
  label: string;
}

/** One run of text within a hero headline line — `gold: true` renders it in
 *  the hero's accent gold instead of white (e.g. "TRES TIEMPOS" in "Una cena
 *  de tres tiempos"). */
export interface HermosilloHeroHeadlineSegment {
  text: string;
  gold?: boolean;
}

export interface HermosilloFaqItem {
  id: string;
  question: string;
  answer: string;
}

/** One run of text within a ticket package description — `highlight: true`
 *  renders it in the accent gold (used to call out the duration, e.g. "60
 *  minutos") instead of the regular body color. Same segment-array pattern
 *  as `HermosilloHeroHeadlineSegment` above. */
export interface HermosilloTicketDescriptionSegment {
  text: string;
  highlight?: boolean;
}

/** One purchasable Turitop product. `service` is the Turitop `data-service`
 *  code (e.g. "P1") shown in the Turitop admin's "Lista de servicios". */
export interface HermosilloTicketPackage {
  id: string;
  title: string;
  /** Displayed next to the title, e.g. 'Desde $1,900 MXN'. */
  price: string;
  description: HermosilloTicketDescriptionSegment[];
  /** Turitop data-service code, e.g. 'P1' | 'P2' | 'P3'. */
  service: string;
}

/**
 * Standalone landing for "Dinner in the Sky — Hermosillo".
 *
 * This is a direct adaptation of `LandingTijuanaComponent`
 * (../landing-tijuana en el repo "Dinner in the Sky Mexico Tijuana") — same
 * cream/black/gold visual design (Bebas Neue hero + Anton section titles),
 * same section structure (header, hero, discover cards, Experiencia, Menú,
 * Ubicación, Horarios y precios [comentada], Compra de boletos/Turitop,
 * Mundo, FAQ, conversion bar, footer) and the same Turitop "load-turitop"
 * embed mechanism. Ported per instrucción explícita de replicar el diseño de
 * Tijuana en Hermosillo (no es un componente compartido entre ambas
 * ciudades — cada una tiene su propia copia, igual que Tijuana tiene la suya
 * en su propio repo).
 *
 * Content that Tijuana had confirmed but Hermosillo does not YET (chef/
 * restaurante invitado, sede oficial, horarios por franja, paquetes y
 * company code de Turitop) was deliberately left as honest "próximamente"
 * placeholders instead of being copied or invented — ver los comentarios
 * junto a cada `@Input` más abajo. Cuando el equipo confirme esos datos,
 * se completan aquí sin tocar el resto del componente.
 *
 * Routed at /hermosillo (ver app.routes.ts) — reemplaza la página anterior
 * basada en CityComponent para esta ciudad; el resto del sitio (home
 * multi-ciudad, Ensenada/Puebla/CDMX, Tijuana en cities.component.ts) sigue
 * igual.
 *
 * Date/time selection is NOT reimplemented here — Turitop's own booking widget
 * owns that flow. Every CTA on the page scrolls to the buy section (#comprar),
 * which lists one dropdown per `ticketPackages` entry; opening a dropdown
 * lazy-mounts that package's official Turitop "load-turitop" embed
 * (see `toggleTicket`/`mountTuritopWidget`).
 */
@Component({
  selector: 'app-landing-hermosillo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tj">
      <!-- HEADER -->
      <header class="tj-header">
        <a href="#top" class="tj-header__brand" (click)="scrollToAnchor('#top', $event)">
          <img [src]="ditsLogo" alt="Dinner in the Sky" class="tj-header__logo" />
          <span class="tj-header__city">{{ heroCityLabel }}</span>
        </a>

        <nav class="tj-header__nav" aria-label="Secciones">
          <a href="#experiencia" (click)="scrollToAnchor('#experiencia', $event)">La experiencia</a>
          <a href="#menu" (click)="scrollToAnchor('#menu', $event)">Menú</a>
          <a href="#comprar" (click)="scrollToAnchor('#comprar', $event)">Paquetes y horarios</a>
          <a href="#ubicacion" (click)="scrollToAnchor('#ubicacion', $event)">Ubicación</a>
          <a href="#faq" (click)="scrollToAnchor('#faq', $event)">FAQ</a>
        </nav>

        <div class="tj-header__actions">
          <a class="tj-btn tj-btn--gold tj-btn--sm" href="#comprar" (click)="scrollToAnchor('#comprar', $event)">Comprar boletos</a>
          <button
            class="tj-burger"
            type="button"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen"
            aria-label="Abrir menú"
            aria-controls="tj-drawer"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <!-- MOBILE DRAWER -->
      @if (menuOpen) {
        <div class="tj-drawer" id="tj-drawer">
          <a href="#experiencia" (click)="scrollToAnchor('#experiencia', $event); closeMenu()">La experiencia</a>
          <a href="#menu" (click)="scrollToAnchor('#menu', $event); closeMenu()">Menú</a>
          <a href="#comprar" (click)="scrollToAnchor('#comprar', $event); closeMenu()">Paquetes y horarios</a>
          <a href="#mundo" (click)="scrollToAnchor('#mundo', $event); closeMenu()">Mundo</a>
          <a href="#ubicacion" (click)="scrollToAnchor('#ubicacion', $event); closeMenu()">Ubicación</a>
          <a href="#faq" (click)="scrollToAnchor('#faq', $event); closeMenu()">FAQ</a>
          <a class="tj-btn tj-btn--gold" href="#comprar" (click)="scrollToAnchor('#comprar', $event); closeMenu()">Comprar boletos</a>
        </div>
        <button class="tj-drawer-backdrop" type="button" (click)="closeMenu()" aria-label="Cerrar menú"></button>
      }

      <!-- HERO -->
      <section class="tj-hero" id="top">
        <div class="tj-hero__media" aria-hidden="true">
          <!-- Two responsive crops of the approved cover photo. Desktop nudges
               the image to the right so the headline stays off the table. -->
          @if (heroImage) {
            <img
              class="tj-hero__media-mobile"
              [src]="heroImage"
              [style.objectPosition]="heroImagePosition"
              alt=""
              loading="eager"
              decoding="async"
            />
          }
          @if (heroImageDesktop) {
            <img
              class="tj-hero__media-desktop"
              [src]="heroImageDesktop"
              [style.objectPosition]="heroImagePositionDesktop"
              alt=""
              loading="eager"
              decoding="async"
            />
          }
        </div>
        <div class="tj-hero__scrim" aria-hidden="true"></div>

        <div class="tj-hero__content">
          <!-- Top group: brand + dates, pinned near the top -->
          <div class="tj-hero__top">
            <img [src]="ditsLogoWhite" alt="Dinner in the Sky" class="tj-hero__logo" />
            <div class="tj-hero__city">{{ heroCityLabel }}</div>
            <div class="tj-hero__divider"></div>
            <div class="tj-hero__date-range">
              <span class="tj-hero__date-desktop">{{ dateRangeLabel }}</span>
              <span class="tj-hero__date-mobile">{{ dateRangeMobileLabel }}</span>
            </div>
            <div class="tj-hero__date-days">{{ dateDaysLabel }}</div>
          </div>

          <!-- Bottom group: the pitch, pinned near the bottom (mobile) / directly
               below the top group (desktop, see media query) -->
          <div class="tj-hero__bottom">
            <h1 class="tj-hero__headline">
              @for (line of heroHeadlineLines; track $index) {
                <span class="tj-hero__headline-line">
                  @for (segment of line; track $index) {
                    <span [class.tj-hero__headline-gold]="segment.gold">{{ segment.text }}</span>
                  }
                </span>
              }
            </h1>

            <div class="tj-hero__divider tj-hero__divider--sm"></div>

            <p class="tj-hero__body">
              <span>{{ heroBodyLines[0] }}</span> <span>{{ heroBodyLines[1] }}</span>
            </p>

            <div class="tj-hero__actions">
              <a class="tj-hero__cta tj-hero__cta--solid" [href]="heroPrimaryCtaAnchor" (click)="scrollToAnchor(heroPrimaryCtaAnchor, $event)">{{ heroPrimaryCtaLabel }}</a>
              <a class="tj-hero__cta tj-hero__cta--outline" [href]="heroSecondaryCtaAnchor" (click)="scrollToAnchor(heroSecondaryCtaAnchor, $event)">{{ heroSecondaryCtaLabel }}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- DISCOVER CARDS -->
      <section class="tj-cards">
        @for (card of discoverCards; track card.id) {
          @if (card.mediaPosition === 'bottom') {
            <!-- "Featured" layout (e.g. Menú/chef card): a complete, uncropped
                 photo instead of a cover-cropped banner. Its own template
                 branch (not just a CSS variant of the normal card) because it
                 spans the full grid width on desktop — sharing a row with a
                 normal-height card left an awkward empty gap next to the
                 shorter neighbor when this was still a 2-col grid item. -->
            <article class="tj-card tj-card--feature">
              <div class="tj-card__eyebrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8913d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M16 3c-1.5 1-2.5 3.2-2.5 6 0 2.4 1 3 2.5 3v9"></path>
                </svg>
                <span>{{ card.eyebrow }}</span>
              </div>
              <div class="tj-card__title">{{ card.title }}</div>
              <div class="tj-card__desc">{{ card.description }}</div>
              @if (card.image) {
                <div class="tj-card__feature-media-wrap" [class.tj-card__feature-media-wrap--wide]="!logoOriginal">
                  <div class="tj-card__feature-label">{{ card.featureLabel || 'Chef' }}</div>
                  <img class="tj-card__feature-media" [src]="card.image" [alt]="card.imageAlt" loading="lazy" decoding="async" />
                </div>
              }
              @if (logoOriginal) {
                <div class="tj-card__feature-credit">
                  <div class="tj-card__feature-label">Restaurante a cargo</div>
                  <div class="tj-card__feature-credit-card">
                    <img class="tj-card__feature-credit-logo" [src]="logoOriginal" alt="Restaurante invitado" loading="lazy" />
                  </div>
                </div>
              }
              <a class="tj-card__arrow" [href]="card.anchor" [attr.aria-label]="card.title" (click)="scrollToAnchor(card.anchor, $event)">
                <span class="tj-card__arrow-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </a>
            </article>
          } @else {
            <article class="tj-card">
              @if (card.image) {
                <img
                  class="tj-card__media"
                  [src]="card.image"
                  [alt]="card.imageAlt"
                  [style.objectPosition]="card.imagePosition || 'center'"
                  loading="lazy"
                  decoding="async"
                />
              } @else {
                <div class="tj-card__media tj-card__media--placeholder"><span>{{ card.imageAlt }}</span></div>
              }
              <div class="tj-card__body">
                <div class="tj-card__info">
                  <div class="tj-card__eyebrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8913d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      @switch (card.id) {
                        @case ('horarios') {
                          <path d="M4 15a8 8 0 0 1 16 0zM12 7V4M2 15h20"></path>
                        }
                        @case ('experiencia') {
                          <path d="M12 3v4M6 10l6-3 6 3M5 10h14l-2 4H7zM9 14v4M15 14v4"></path>
                        }
                        @default {
                          <circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9z"></path>
                        }
                      }
                    </svg>
                    <span>{{ card.eyebrow }}</span>
                  </div>
                  <div class="tj-card__title">{{ card.title }}</div>
                  <div class="tj-card__desc">{{ card.description }}</div>
                </div>
                <a class="tj-card__arrow" [href]="card.anchor" [attr.aria-label]="card.title" (click)="scrollToAnchor(card.anchor, $event)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
              </div>
            </article>
          }
        }
      </section>

      <!-- DETAIL: EXPERIENCIA -->
      <section class="tj-detail" id="experiencia">
        <div class="tj-detail__copy">
          <div class="tj-eyebrow">DESCUBRE</div>
          <h2 class="tj-detail__title">De qué va la experiencia</h2>
          <p class="tj-detail__text">{{ experienceText }}</p>
        </div>
        <div class="tj-detail__media" [class.tj-detail__media--gallery]="experiencePhotos.length > 1">
          @for (photo of experiencePhotos; track photo.alt) {
            @if (photo.src) {
              <img [src]="photo.src" [alt]="photo.alt" loading="lazy" decoding="async" />
            } @else {
              <div class="tj-photo-placeholder"><span>{{ photo.alt }}</span></div>
            }
          }
        </div>
      </section>

      <!-- DETAIL: MENÚ -->
      <section class="tj-detail tj-detail--dark" id="menu">
        <div class="tj-detail__copy">
          <div class="tj-eyebrow tj-eyebrow--light">DESCUBRE</div>
          <h2 class="tj-detail__title tj-detail__title--light">El menú</h2>
          <p class="tj-detail__text tj-detail__text--light">{{ menuIntro }}</p>

          <div class="tj-menu-brand">
            @if (chefPhoto) {
              <img class="tj-menu-brand__chef" [src]="chefPhoto" [alt]="chefPhotoAlt" loading="lazy" />
            }
            @if (logoOriginal) {
              <img class="tj-menu-brand__logo" [src]="logoOriginal" alt="Restaurante invitado" loading="lazy" />
            }
          </div>
        </div>

        <div class="tj-menu-cards">
          @for (item of menuItems; track item.course) {
            <div class="tj-menu-card">
              <span class="tj-menu-card__course">{{ item.course }}</span>
              <span class="tj-menu-card__name">{{ item.name }}</span>
            </div>
          }
        </div>
      </section>

      <!-- DETAIL: UBICACIÓN — movida arriba (justo después del menú, antes de
           comprar boletos) a pedido: el cliente debe ver la sede confirmada
           antes de llegar al CTA de compra, no hasta el final de la página. -->
      <section class="tj-detail" id="ubicacion">
        <div class="tj-detail__copy">
          <div class="tj-eyebrow">DESCUBRE</div>
          <h2 class="tj-detail__title">Ubicación</h2>
          <p class="tj-detail__text">{{ venueText }}</p>
        </div>
        <div class="tj-detail__media tj-detail__media--poster">
          @if (venueImage) {
            <img [src]="venueImage" [alt]="venueImageAlt" loading="lazy" decoding="async" />
          } @else {
            <div class="tj-photo-placeholder"><span>{{ venueImageAlt }}</span></div>
          }
        </div>
      </section>

      <!-- DETAIL: HORARIOS Y PRECIOS — comentado a pedido: los precios por
           paquete ahora viven en los dropdowns de "Compra tus boletos" más
           abajo (id="comprar"), así que esta grilla de horarios quedaba
           redundante. Se deja el código intacto por si se necesita reactivar.
           Todos los enlaces que apuntaban a "#horarios" (nav, drawer, footer,
           tarjeta "Los paquetes") se redirigieron a "#comprar". -->
      <!--
      <section class="tj-detail" id="horarios">
        <div class="tj-detail__copy">
          <div class="tj-eyebrow">DESCUBRE</div>
          <h2 class="tj-detail__title">Paquetes y horarios</h2>
          <p class="tj-detail__text">{{ seasonNote }}</p>
        </div>

        <div class="tj-schedule">
          @for (block of schedule; track block.group) {
            <div class="tj-schedule-block">
              <h3 class="tj-schedule-block__title">{{ block.group }}</h3>
              <ul class="tj-schedule-list">
                @for (item of block.items; track item.time + item.name) {
                  <li class="tj-schedule-item">
                    <span class="tj-schedule-item__time">{{ item.time }}</span>
                    <span class="tj-schedule-item__name">{{ item.name }}</span>
                    <span class="tj-schedule-item__price">{{ item.price }}</span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <p class="tj-capacity-note">{{ capacityNote }}</p>
      </section>
      -->

      <!-- COMPRA DE BOLETOS / TURITOP -->
      <!-- Each package below lazy-mounts its own official Turitop
           "load-turitop" embed (P1/P2/P3, per the codes in Turitop's
           "Lista de servicios") the first time its dropdown is opened.
           See mountTuritopWidget()/toggleTicket() below. -->
      <section class="tj-tickets" id="comprar">
        <div class="tj-eyebrow">RESERVA</div>
        <h2 class="tj-detail__title">Compra tus boletos</h2>
        <p class="tj-detail__text">{{ ticketsIntro }}</p>

        <div class="tj-tickets-list">
          @if (!ticketPackages.length) {
            <div class="tj-photo-placeholder tj-tickets-empty"><span>Boletos disponibles muy pronto</span></div>
          }
          @for (pkg of ticketPackages; track pkg.id) {
            <div class="tj-ticket-item" [class.tj-ticket-item--open]="openTicketId === pkg.id">
              <button
                type="button"
                class="tj-ticket-item__q"
                (click)="toggleTicket(pkg)"
                [attr.aria-expanded]="openTicketId === pkg.id"
                [attr.aria-controls]="'tj-ticket-panel-' + pkg.id"
              >
                <span class="tj-ticket-item__label">
                  <span class="tj-ticket-item__name">{{ pkg.title }}</span>
                  <span class="tj-ticket-item__price">{{ pkg.price }}</span>
                </span>
                <span class="tj-ticket-item__icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8913d" stroke-width="2.4" stroke-linecap="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </span>
              </button>
              <div class="tj-ticket-item__panel" [id]="'tj-ticket-panel-' + pkg.id">
                <p class="tj-ticket-item__desc">
                  @for (seg of pkg.description; track $index) {
                    <span [class.tj-ticket-item__desc-highlight]="seg.highlight">{{ seg.text }}</span>
                  }
                </p>
                <div class="tj-ticket-item__mount" [id]="'tj-turitop-mount-' + pkg.id"></div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- DETAIL: MUNDO -->
      <section class="tj-detail" id="mundo">
        <div class="tj-detail__copy">
          <div class="tj-eyebrow">DESCUBRE</div>
          <h2 class="tj-detail__title">Presente en 70 Países y contando.</h2>
          <p class="tj-detail__text">{{ worldText }}</p>

          <div class="tj-stats">
            @for (stat of worldStats; track stat.label) {
              <div class="tj-stat">
                <span class="tj-stat__value">{{ stat.value }}</span>
                <span class="tj-stat__label">{{ stat.label }}</span>
              </div>
            }
          </div>
        </div>
        <div class="tj-detail__media">
          @if (worldImage) {
            <img [src]="worldImage" [alt]="worldImageAlt" loading="lazy" decoding="async" />
          } @else {
            <div class="tj-photo-placeholder"><span>{{ worldImageAlt }}</span></div>
          }
        </div>
      </section>

      <!-- DETAIL: FAQ -->
      <section class="tj-faq" id="faq">
        <div class="tj-eyebrow">DESCUBRE</div>
        <h2 class="tj-detail__title">Preguntas frecuentes</h2>
        <p class="tj-detail__text">{{ faqIntro }}</p>

        <div class="tj-faq-list">
          @for (item of faqItems; track item.id) {
            <div class="tj-faq-item" [class.tj-faq-item--open]="openFaqId === item.id">
              <button
                type="button"
                class="tj-faq-item__q"
                (click)="toggleFaq(item.id)"
                [attr.aria-expanded]="openFaqId === item.id"
              >
                <span>{{ item.question }}</span>
                <span class="tj-faq-item__icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8913d" stroke-width="2.4" stroke-linecap="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </span>
              </button>
              @if (openFaqId === item.id) {
                <p class="tj-faq-item__a">{{ item.answer }}</p>
              }
            </div>
          }
        </div>
      </section>

      <!-- CONVERSION BAR -->
      <section class="tj-convbar">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c9a24b" stroke-width="1.8" stroke-linecap="round" class="tj-convbar__icon">
          <rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path>
        </svg>
        <div class="tj-convbar__date">
          <div class="tj-convbar__date-range">{{ dateRangeLabel }}</div>
          <div class="tj-convbar__date-days">{{ dateDaysLabel }}</div>
        </div>
        <div class="tj-convbar__divider" aria-hidden="true"></div>
        <p class="tj-convbar__note">{{ convBarNote }}</p>
        <a class="tj-btn tj-btn--gold tj-btn--lg" href="#comprar" (click)="scrollToAnchor('#comprar', $event)">
          Comprar boletos
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8">
            <path d="M4 8a2 2 0 0 0 0 8v3h16v-3a2 2 0 0 1 0-8V5H4zM13 5v14" stroke-dasharray="2 2"></path>
          </svg>
        </a>
      </section>

      <!-- FOOTER -->
      <footer class="tj-footer">
        <div class="tj-footer__brand">
          <img [src]="ditsLogoWhite" alt="Dinner in the Sky" class="tj-footer__logo" />
          <span class="tj-footer__city">{{ heroCityLabel }}</span>
        </div>

        <nav class="tj-footer__nav" aria-label="Enlaces del pie de página">
          <a href="#comprar" (click)="scrollToAnchor('#comprar', $event)">Horarios</a>
          <a href="#comprar" (click)="scrollToAnchor('#comprar', $event)">Paquetes y precios</a>
          <a href="#menu" (click)="scrollToAnchor('#menu', $event)">Menú</a>
          <a href="#faq" (click)="scrollToAnchor('#faq', $event)">FAQ</a>
          <a href="#faq" (click)="scrollToAnchor('#faq', $event)">Políticas</a>
          <a href="#ubicacion" (click)="scrollToAnchor('#ubicacion', $event)">Ubicación</a>
          @if (whatsappUrl) {
            <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer">Contacto</a>
          }
        </nav>

        <div class="tj-footer__copy">© {{ currentYear }} Dinner in the Sky {{ heroCityLabel }}</div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #efedea;
    }

    a { text-decoration: none; }

    /* ===== Shared ===== */
    .tj-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 999px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-decoration: none;
      cursor: pointer;
      border: none;
      white-space: nowrap;
    }

    .tj-btn--gold {
      background: #b8913d;
      color: #ffffff;
      padding: 13px 20px;
      font-size: 11px;
    }

    .tj-btn--sm {
      padding: 10px 18px;
      font-size: 10.5px;
    }

    .tj-btn--lg {
      padding: 18px 40px;
      font-size: 13px;
    }

    .tj-btn--outline {
      border: 1.5px solid rgba(255, 255, 255, 0.85);
      color: #ffffff;
      padding: 13px 18px;
      font-size: 11px;
    }

    .tj-eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      letter-spacing: 0.16em;
      color: #b8913d;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .tj-eyebrow--light {
      color: #d7b46b;
    }

    /* ===== Header ===== */
    .tj-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: #ffffff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .tj-header__brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .tj-header__logo {
      height: 24px;
      display: block;
    }

    @media (max-width: 899px) {
      .tj-header__logo {
        max-width: 80%;
      }
    }

    .tj-header__city {
      font-size: 8.5px;
      letter-spacing: 0.42em;
      color: #1c2b6b;
      font-weight: 700;
      text-transform: uppercase;
    }

    .tj-header__nav {
      display: none;
    }

    .tj-header__actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tj-burger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 4px;
      background: none;
      border: none;
      cursor: pointer;
    }

    .tj-burger span {
      width: 22px;
      height: 2px;
      background: #111111;
      display: block;
    }

    .tj-drawer {
      position: fixed;
      inset: 0 0 0 auto;
      width: min(320px, 84vw);
      background: #ffffff;
      z-index: 41;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 84px 24px 24px;
      box-shadow: -12px 0 40px rgba(0, 0, 0, 0.18);
    }

    .tj-drawer a {
      padding: 12px 4px;
      font-size: 15px;
      font-weight: 600;
      color: #111111;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .tj-drawer .tj-btn {
      margin-top: 18px;
      text-align: center;
    }

    .tj-drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(13, 13, 13, 0.45);
      border: none;
      z-index: 40;
      padding: 0;
      cursor: pointer;
    }

    /* ===== Hero ===== */
    /* Mobile treats the approved vertical photo as a true cover stage: the
       brand/date live over the sky, while the pitch begins as a separate
       editorial section below. Desktop keeps the original one-block hero. */
    .tj-hero {
      position: relative;
      min-height: 760px;
      padding: 0;
      overflow: hidden;
      color: #ffffff;
    }

    .tj-hero__media,
    .tj-hero__media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .tj-hero__media img {
      object-fit: cover;
    }

    .tj-hero__media-desktop {
      display: none;
    }

    .tj-hero__scrim {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(4, 10, 20, 0.4) 0%, rgba(4, 10, 20, 0) 26%),
        linear-gradient(0deg, rgba(3, 6, 12, 0.9) 0%, rgba(3, 6, 12, 0.6) 24%, rgba(3, 6, 12, 0) 48%);
    }

    .tj-hero__content {
      position: relative;
      z-index: 1;
      height: 100%;
      min-height: 760px;
      box-sizing: border-box;
      padding: 30px 22px 22px 24px;
      display: flex;
      flex-direction: column;
    }

    .tj-hero__logo {
      display: block;
      height: 36px;
      width: auto;
      filter: drop-shadow(0 2px 7px rgba(0, 0, 0, 0.62)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.85));
    }

    .tj-hero__city {
      margin-top: 16px;
      font-family: 'Bebas Neue', Impact, sans-serif;
      font-weight: 400;
      font-size: 46px;
      line-height: 1;
      letter-spacing: 0.02em;
      color: #dcaf4e;
      text-transform: uppercase;
    }

    .tj-hero__divider {
      margin-top: 12px;
      width: 44px;
      height: 2px;
      background: #dcaf4e;
    }

    .tj-hero__date-range {
      margin-top: 12px;
      font-size: 14.5px;
      font-weight: 700;
      line-height: 1.2;
    }

    .tj-hero__date-mobile {
      display: none;
    }

    .tj-hero__date-days {
      margin-top: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #fff;
      text-transform: uppercase;
    }

    .tj-hero__bottom {
      margin-top: auto;
    }

    .tj-hero__headline {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 800;
      font-size: 21px;
      line-height: 1.3;
      text-transform: uppercase;
    }

    .tj-hero__headline-line {
      display: block;
    }

    .tj-hero__headline-gold {
      color: #dcaf4e;
    }

    .tj-hero__divider--sm {
      margin: 14px 0;
      width: 40px;
    }

    .tj-hero__body {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
    }

    .tj-hero__body span {
      display: block;
    }

    .tj-hero__body span + span {
      margin-top: 9px;
    }

    .tj-hero__actions {
      margin-top: 18px;
      display: flex;
      gap: 10px;
    }

    .tj-hero__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      white-space: nowrap;
      text-align: center;
      padding: 15px 8px;
    }

    .tj-hero__cta--solid {
      flex: 1.15;
      background: #dcaf4e;
      color: #171310;
    }

    .tj-hero__cta--outline {
      flex: 1;
      border: 1.5px solid #dcaf4e;
      color: #dcaf4e;
    }

    @media (max-width: 700px) {
      .tj-hero {
        min-height: 0;
        background: #efedea;
        color: #111111;
      }

      .tj-hero__media {
        position: relative;
        inset: auto;
        bottom: auto;
        height: min(780px, calc(100svh - 68px));
        min-height: 660px;
        overflow: hidden;
      }

      .tj-hero__media img {
        object-position: center top !important;
      }

      .tj-hero__scrim {
        bottom: auto;
        height: min(780px, calc(100svh - 68px));
        min-height: 660px;
        background:
          linear-gradient(90deg, rgba(2, 8, 16, 0.52) 0%, rgba(2, 8, 16, 0.34) 28%, rgba(2, 8, 16, 0.12) 52%, rgba(2, 8, 16, 0) 76%),
          linear-gradient(180deg, rgba(2, 8, 16, 0.42) 0%, rgba(2, 8, 16, 0.18) 30%, rgba(2, 8, 16, 0.02) 58%, rgba(2, 8, 16, 0) 100%);
      }

      .tj-hero__content {
        position: static;
        z-index: auto;
        height: auto;
        min-height: 0;
        padding: 0;
        display: block;
      }

      .tj-hero__top {
        position: absolute;
        z-index: 2;
        top: 34px;
        left: clamp(28px, 9vw, 42px);
        max-width: 230px;
        color: #ffffff;
      }

      .tj-hero__logo {
        height: 34px;
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
      }

      .tj-hero__city {
        margin-top: 22px;
        font-size: 38px;
        line-height: 0.96;
        letter-spacing: 0.015em;
        text-shadow: 0 2px 3px rgba(5, 10, 18, 0.38), 0 10px 22px rgba(5, 10, 18, 0.22);
      }

      .tj-hero__divider {
        margin-top: 12px;
        width: 36px;
      }

      .tj-hero__date-range {
        max-width: 142px;
        margin-top: 13px;
        transform: none;
        font-size: 12.5px;
        line-height: 1.15;
        letter-spacing: 0.01em;
        text-shadow: 0 2px 3px rgba(2, 8, 16, 0.72), 0 8px 18px rgba(2, 8, 16, 0.32);
      }

      .tj-hero__date-desktop {
        display: none;
      }

      .tj-hero__date-mobile {
        display: inline;
      }

      .tj-hero__date-days {
        margin-top: 7px;
        transform: none;
        font-size: 10px;
        letter-spacing: 0.1em;
        text-shadow: 0 2px 3px rgba(2, 8, 16, 0.72), 0 8px 18px rgba(2, 8, 16, 0.32);
      }

      .tj-hero__bottom {
        position: relative;
        z-index: 3;
        margin: -156px 0 0;
        padding: 44px clamp(28px, 9vw, 40px) 42px;
        color: #111111;
        background: #efedea;
        text-shadow: none;
      }

      .tj-hero__headline {
        max-width: 340px;
        font-size: 20px;
        line-height: 1.16;
        color: #111111;
      }

      .tj-hero__divider--sm {
        margin: 14px 0 16px;
      }

      .tj-hero__body {
        max-width: 340px;
        font-size: 14px;
        line-height: 1.48;
        color: #292520;
      }

      .tj-hero__body span + span {
        margin-top: 8px;
      }

      .tj-hero__actions {
        margin-top: 18px;
        gap: 8px;
      }

      .tj-hero__cta {
        min-height: 44px;
        padding: 13px 8px;
        font-size: 10px;
      }

      .tj-hero__cta--outline {
        color: #7a5a1e;
      }
    }

    /* ===== Discover cards ===== */
    .tj-cards {
      background: #efedea;
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tj-card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .tj-card__media {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
    }

    /* "Featured" card (e.g. Menú/chef) — complete, uncropped photo instead of
       a cover-cropped banner. Mobile: simple stack (text, then photo, then
       the arrow), full-bleed within the card's own padding. */
    .tj-card--feature {
      display: flex;
      flex-direction: column;
      padding: 20px 20px 22px;
    }

    .tj-card--feature .tj-card__title {
      margin-top: 6px;
    }

    .tj-card--feature .tj-card__desc {
      margin-top: 8px;
    }

    .tj-card--feature .tj-card__arrow {
      align-self: flex-end;
      margin-top: 16px;
    }

    /* Icon-only on mobile: the "Ver menú completo" label is a desktop-only
       addition (see feature breakpoint below), so it stays hidden here and
       the icon renders exactly as a plain circle button, same as before. */
    .tj-card__arrow-icon {
      display: contents;
    }

    .tj-card__arrow-label {
      display: none;
    }

    .tj-card__feature-media-wrap {
      margin-top: 16px;
    }

    .tj-card__feature-label {
      font-family: 'Anton', Impact, sans-serif;
      font-size: 24px;
      color: #111111;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 10px;
    }

    .tj-card__feature-media {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 12px;
    }

    /* Restaurant credit (chef photo already covers "chef"; this covers
       "restaurante a cargo") — title-style label (left-aligned, same as
       "Chef"/"Menú"), then the seal logo centered underneath. */
    .tj-card__feature-credit {
      margin-top: 18px;
    }

    .tj-card__feature-credit .tj-card__feature-label {
      margin-bottom: 12px;
    }

    /* Mobile: no card chrome around the logo, matching how it already looked
       — the gray "card" background and caption are a desktop-only addition
       (see feature breakpoint below). */
    .tj-card__feature-credit-card {
      margin-top: 0;
    }

    .tj-card__feature-credit-logo {
      width: 112px;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    .tj-card__feature-credit-caption {
      display: none;
    }

    .tj-card__media--placeholder {
      background: repeating-linear-gradient(45deg, #eef1f6, #eef1f6 10px, #e3e7ef 10px, #e3e7ef 20px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5a6b85;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      padding: 8px;
    }

    .tj-card__body {
      padding: 20px 20px 22px;
      display: flex;
      justify-content: space-between;
      gap: 14px;
    }

    .tj-card__info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .tj-card__eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      letter-spacing: 0.14em;
      color: #b8913d;
      font-weight: 700;
    }

    .tj-card__title {
      font-family: 'Anton', Impact, sans-serif;
      font-size: 24px;
      color: #111111;
      margin-top: 6px;
      text-transform: uppercase;
    }

    .tj-card__desc {
      font-size: 12.5px;
      line-height: 1.6;
      color: #444444;
      margin-top: 8px;
    }

    .tj-card__arrow {
      align-self: flex-end;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #b8913d;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ===== Detail sections (Experiencia / Menú / Horarios / Mundo / Ubicación) ===== */
    .tj-detail {
      background: #ffffff;
      padding: 48px 20px;
      scroll-margin-top: 76px;
    }

    .tj-detail--dark {
      background: #14120f;
      color: #ffffff;
    }

    .tj-detail__title {
      font-family: 'Anton', Impact, sans-serif;
      font-size: 26px;
      line-height: 1.1;
      color: #111111;
      text-transform: uppercase;
      margin: 0 0 12px;
    }

    .tj-detail__title--light {
      color: #ffffff;
    }

    .tj-detail__text {
      font-size: 14px;
      line-height: 1.65;
      color: #444444;
      margin: 0;
    }

    .tj-detail__text--light {
      color: rgba(255, 255, 255, 0.78);
    }

    .tj-detail__media {
      margin-top: 22px;
    }

    .tj-detail__media img,
    .tj-photo-placeholder {
      width: 100%;
      aspect-ratio: 16 / 10;
      border-radius: 12px;
      object-fit: cover;
      display: block;
    }

    .tj-photo-placeholder {
      background: repeating-linear-gradient(45deg, #eef1f6, #eef1f6 10px, #e3e7ef 10px, #e3e7ef 20px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #5a6b85;
      font-size: 12px;
      font-weight: 600;
      padding: 8px;
    }

    .tj-detail__media--map img,
    .tj-detail__media--map .tj-photo-placeholder {
      aspect-ratio: 16 / 9;
    }

    /* Ubicación's venue poster is a tall PORTRAIT flyer (1122x1402), unlike
       every other .tj-detail photo which is landscape — the shared
       aspect-ratio 16/10 + object-fit cover rule above was built for those
       and crops most of a portrait image away. This override matches the
       poster's real ratio with object-fit: contain instead of cover, so the
       full flyer is always visible, never cropped. */
    .tj-detail__media--poster img {
      aspect-ratio: 1122 / 1402;
      object-fit: contain;
      background: #0d0d0d;
    }

    /* Multi-photo gallery (e.g. "De qué va la experiencia") — 2-col grid instead
       of stacking every photo full-width, first photo spans both columns. */
    .tj-detail__media--gallery {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .tj-detail__media--gallery img,
    .tj-detail__media--gallery .tj-photo-placeholder {
      aspect-ratio: 1 / 1;
      border-radius: 10px;
    }

    .tj-detail__media--gallery img:first-child,
    .tj-detail__media--gallery .tj-photo-placeholder:first-child {
      grid-column: 1 / -1;
      aspect-ratio: 16 / 10;
    }

    /* Menú brand row (chef + Cordero Negro logo) */
    .tj-menu-brand {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 22px;
    }

    .tj-menu-brand__chef {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #caa24a;
    }

    .tj-menu-brand__logo {
      width: 76px;
      height: auto;
    }

    .tj-menu-cards {
      margin-top: 26px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tj-menu-card {
      background: #1e1b17;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tj-menu-card__course {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #caa24a;
    }

    .tj-menu-card__name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
    }

    /* Horarios y precios */
    .tj-schedule {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .tj-schedule-block__title {
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #b8913d;
      margin: 0 0 10px;
    }

    .tj-schedule-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tj-schedule-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 13px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      padding-bottom: 7px;
    }

    .tj-schedule-item__time {
      font-weight: 700;
      color: #111111;
      min-width: 62px;
      flex-shrink: 0;
    }

    .tj-schedule-item__name {
      flex: 1;
      color: #444444;
    }

    .tj-schedule-item__price {
      font-weight: 700;
      color: #111111;
      white-space: nowrap;
    }

    .tj-capacity-note {
      margin: 20px 0 0;
      font-size: 12px;
      color: #767676;
    }

    /* Mundo */
    .tj-stats {
      display: flex;
      gap: 24px;
      margin-top: 22px;
      flex-wrap: wrap;
    }

    .tj-stat__value {
      display: block;
      font-family: 'Anton', Impact, sans-serif;
      font-size: 30px;
      color: #b8913d;
      line-height: 1;
    }

    .tj-stat__label {
      display: block;
      font-size: 11px;
      color: #767676;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 4px;
    }

    /* ===== FAQ ===== */
    .tj-faq {
      background: #ffffff;
      padding: 48px 20px;
      scroll-margin-top: 76px;
    }

    .tj-faq-list {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tj-faq-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      padding: 0 12px;
      margin: 0 -12px;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .tj-faq-item--open {
      background: #faf7f0;
      border-bottom-color: transparent;
    }

    .tj-faq-item__q {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: none;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 16px 0;
      text-align: left;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
      transition: color 0.2s ease;
      /* Reset native button chrome — without this, some mobile browsers (iOS
         Safari/WebViews in particular) render an open <button> with a default
         rounded, drop-shadowed "raised card" look that clashes with the flat
         list design. */
      appearance: none;
      -webkit-appearance: none;
      outline: none;
      box-shadow: none;
      -webkit-tap-highlight-color: transparent;
    }

    .tj-faq-item__q:focus {
      outline: none;
      box-shadow: none;
    }

    .tj-faq-item--open .tj-faq-item__q {
      color: #96721f;
    }

    .tj-faq-item__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1.5px solid rgba(184, 145, 61, 0.35);
      flex-shrink: 0;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .tj-faq-item__icon svg {
      transition: transform 0.2s ease, stroke 0.2s ease;
    }

    .tj-faq-item--open .tj-faq-item__icon {
      background: #b8913d;
      border-color: #b8913d;
    }

    .tj-faq-item--open .tj-faq-item__icon svg {
      transform: rotate(45deg);
      stroke: #ffffff;
    }

    .tj-faq-item__a {
      margin: 0 0 20px;
      padding-left: 14px;
      max-width: 620px;
      border-left: 2px solid rgba(184, 145, 61, 0.35);
      font-size: 13.5px;
      line-height: 1.65;
      color: #444444;
      white-space: pre-line;
      animation: tj-faq-reveal 0.22s ease;
    }

    @keyframes tj-faq-reveal {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ===== Tickets / Turitop accordion ===== */
    .tj-tickets {
      background: #ffffff;
      padding: 48px 20px;
      scroll-margin-top: 76px;
    }

    .tj-tickets-list {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tj-ticket-item {
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      padding: 0 16px;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .tj-ticket-item--open {
      background: #faf7f0;
      border-color: rgba(184, 145, 61, 0.35);
    }

    .tj-ticket-item__q {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: none;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 18px 0;
      text-align: left;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #111111;
      cursor: pointer;
      transition: color 0.2s ease;
      appearance: none;
      -webkit-appearance: none;
      outline: none;
      box-shadow: none;
      -webkit-tap-highlight-color: transparent;
    }

    .tj-ticket-item__q:focus {
      outline: none;
      box-shadow: none;
    }

    .tj-ticket-item--open .tj-ticket-item__q {
      color: #96721f;
    }

    .tj-ticket-item__label {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }

    .tj-ticket-item__price {
      font-weight: 700;
      font-size: 12px;
      color: #b8913d;
    }

    .tj-ticket-item__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 1.5px solid rgba(184, 145, 61, 0.35);
      flex-shrink: 0;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .tj-ticket-item__icon svg {
      transition: transform 0.2s ease, stroke 0.2s ease;
    }

    .tj-ticket-item--open .tj-ticket-item__icon {
      background: #b8913d;
      border-color: #b8913d;
    }

    .tj-ticket-item--open .tj-ticket-item__icon svg {
      transform: rotate(45deg);
      stroke: #ffffff;
    }

    /* max-height/overflow (not display:none) so the collapsed panel still has
       real, measurable width — Turitop's widget is mounted for every package
       up front (see mountTuritopWidgets()), and third-party calendar embeds
       like this one typically size themselves off the container's width at
       init; a display:none container reports 0 width and breaks that. */
    .tj-ticket-item__panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .tj-ticket-item--open .tj-ticket-item__panel {
      max-height: 2400px;
      animation: tj-faq-reveal 0.22s ease;
    }

    .tj-ticket-item__desc {
      margin: 0;
      padding-top: 4px;
      font-size: 13px;
      line-height: 1.6;
      color: #444444;
      max-width: 620px;
    }

    .tj-ticket-item__desc-highlight {
      font-weight: 700;
      color: #96721f;
    }

    .tj-ticket-item__mount {
      min-height: 60px;
      padding: 4px 0 22px;
    }

    /* ===== Conversion bar ===== */
    .tj-convbar {
      background: #0d0d0d;
      border-radius: 18px;
      margin: 0 14px 16px;
      padding: 16px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      scroll-margin-top: 76px;
    }

    .tj-convbar__icon {
      flex-shrink: 0;
    }

    .tj-convbar__date {
      color: #ffffff;
    }

    .tj-convbar__date-range {
      font-size: 12.5px;
      font-weight: 800;
      line-height: 1.25;
    }

    .tj-convbar__date-days {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #c9a24b;
      margin-top: 2px;
    }

    .tj-convbar__divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.25);
    }

    .tj-convbar__note {
      display: none;
      color: #bbbbbb;
      font-size: 13.5px;
      line-height: 1.5;
      margin: 0;
    }

    .tj-convbar .tj-btn--lg {
      flex: 1;
      padding: 14px 8px;
      font-size: 11px;
    }

    /* ===== Footer ===== */
    .tj-footer {
      background: #0d0d0d;
      padding: 24px 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
    }

    .tj-footer__brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .tj-footer__logo {
      height: 22px;
    }

    .tj-footer__city {
      font-size: 8.5px;
      letter-spacing: 0.42em;
      color: #c9a24b;
      font-weight: 700;
      text-transform: uppercase;
    }

    .tj-footer__nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      font-size: 10.5px;
      color: #999999;
      margin-top: 6px;
    }

    .tj-footer__nav a {
      color: #999999;
    }

    .tj-footer__nav a:hover {
      color: #c9a24b;
    }

    .tj-footer__copy {
      font-size: 9.5px;
      color: #666666;
      margin-top: 4px;
    }

    /* ===================== DESKTOP (>=900px) ===================== */
    @media (min-width: 900px) {
      /* Side gutters grow past a comfortable minimum instead of staying pinned
         at a flat value on wide monitors — keeps content from stretching edge
         to edge and margins from feeling cramped on ultrawide/4K screens. */
      .tj-header,
      .tj-cards,
      .tj-detail,
      .tj-faq,
      .tj-tickets,
      .tj-footer {
        padding-left: max(80px, calc((100% - 1280px) / 2));
        padding-right: max(80px, calc((100% - 1280px) / 2));
        box-sizing: border-box;
      }

      .tj-header {
        padding-top: 16px;
        padding-bottom: 16px;
      }

      .tj-header__logo {
        height: 30px;
      }

      .tj-header__city {
        font-size: 9.5px;
        letter-spacing: 0.46em;
      }

      .tj-header__nav {
        display: flex;
        gap: 38px;
        font-size: 13px;
        font-weight: 600;
        color: #111111;
      }

      .tj-header__nav a {
        color: #111111;
      }

      .tj-header__nav a:hover {
        color: #b8913d;
      }

      .tj-btn--gold.tj-btn--sm {
        padding: 13px 28px;
        font-size: 12px;
      }

      .tj-burger {
        display: none;
      }

      .tj-hero {
        min-height: 660px;
      }

      .tj-hero__media-mobile {
        display: none;
      }

      .tj-hero__media-desktop {
        display: block;
      }

      .tj-hero__scrim {
        background:
          linear-gradient(90deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 26%, rgba(0, 0, 0, 0.16) 48%, rgba(0, 0, 0, 0) 66%),
          linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 26%);
      }

      .tj-hero__content {
        min-height: 660px;
        width: 560px;
        padding: 0 0 0 72px;
        justify-content: center;
      }

      .tj-hero__logo {
        height: 44px;
      }

      .tj-hero__city {
        margin-top: 14px;
        font-size: 58px;
      }

      .tj-hero__divider {
        width: 52px;
      }

      .tj-hero__date-range {
        font-size: 17px;
      }

      .tj-hero__date-days {
        font-size: 12px;
        letter-spacing: 0.16em;
      }

      .tj-hero__bottom {
        margin-top: 26px;
      }

      .tj-hero__headline {
        font-size: 24px;
        line-height: 1.32;
      }

      /* Desktop mock goes straight from headline to body paragraph — no
         second divider like mobile has. */
      .tj-hero__divider--sm {
        display: none;
      }

      .tj-hero__body {
        margin-top: 16px;
        max-width: 440px;
        font-size: 14.5px;
        line-height: 1.55;
      }

      /* Mobile stacks the two body sentences as separate lines; desktop runs
         them together as one flowing paragraph (matches the mock, which has
         them as a single block of text). */
      .tj-hero__body span {
        display: inline;
      }

      .tj-hero__body span + span {
        margin-top: 0;
      }

      .tj-hero__actions {
        margin-top: 24px;
        gap: 12px;
      }

      .tj-hero__cta {
        flex: none;
        font-size: 12px;
        padding: 16px 28px;
      }

      .tj-hero__cta--outline {
        padding: 16px 26px;
      }

      .tj-cards {
        padding-top: 56px;
        padding-bottom: 56px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        /* Don't stretch every card to match the row's tallest neighbor — the
           "Menú" card (full uncropped photo below the text) is naturally much
           taller than the others, and stretching e.g. "Los paquetes" to match
           forced its cover-cropped photo into a wildly elongated, distorted
           crop. Each card now just sizes to its own content. */
        align-items: start;
        gap: 28px;
      }

      .tj-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .tj-card__media {
        height: 100%;
        min-height: 280px;
      }

      .tj-card:nth-child(2) .tj-card__media,
      .tj-card:nth-child(4) .tj-card__media {
        order: 2;
      }

      .tj-card:nth-child(2) .tj-card__body,
      .tj-card:nth-child(4) .tj-card__body {
        order: 1;
      }

      .tj-card__body {
        padding: 30px 28px;
        flex-direction: column;
      }

      /* "Featured" card (Menú/chef) spans the full grid width and gets its
         own row. Desktop-only 3-column layout: text | chef photo |
         restaurant credit, laid out with named grid-template-areas so each
         piece is placed explicitly regardless of its DOM order (DOM order
         stays the "reading" order — text, chef, credit, arrow — which is
         also what mobile uses for its simple stacked layout below). Rows are
         auto-sized (no 1fr track) and align-items: start keeps every column
         pinned to the top instead of stretching to fill the tallest one. */
      .tj-card--feature {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: minmax(420px, 520px) 300px 220px;
        grid-template-areas:
          "title chef  credit"
          "desc  chef  credit"
          "arrow chef  credit";
        align-items: start;
        justify-content: start;
        column-gap: 36px;
        padding: 72px 40px 36px;
        position: relative;
      }

      .tj-card--feature .tj-card__eyebrow {
        position: absolute;
        top: 40px;
        left: 40px;
      }

      .tj-card--feature .tj-card__title {
        grid-area: title;
        font-size: 30px;
        margin-top: 0;
      }

      .tj-card--feature .tj-card__desc {
        grid-area: desc;
        font-size: 14px;
        line-height: 1.65;
        max-width: 460px;
      }

      .tj-card--feature .tj-card__arrow {
        grid-area: arrow;
        align-self: flex-start;
        margin-top: 20px;
        padding-top: 0;
        width: 52px;
        height: 52px;
        background: #b8913d;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0;
      }

      .tj-card--feature .tj-card__arrow-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
      }

      .tj-card__feature-media-wrap {
        grid-area: chef;
        margin-top: 0;
      }

      /* When there's no restaurant-credit logo to show in the "credit"
         column (e.g. no chef/restaurante confirmado yet), the media widens
         to fill that now-empty column too instead of sitting narrow with a
         blank gap beside it — used for wide "coming soon" graphics in
         place of a (narrower, portrait) chef headshot. */
      .tj-card__feature-media-wrap--wide {
        grid-column: chef-start / credit-end;
      }

      .tj-card__feature-media-wrap--wide .tj-card__feature-media {
        max-height: none;
        aspect-ratio: 16 / 9;
        object-fit: cover;
      }

      .tj-card__feature-label {
        font-size: 30px;
      }

      .tj-card__feature-media {
        width: 100%;
        max-height: 380px;
      }

      .tj-card__feature-credit {
        grid-area: credit;
        margin-top: 0;
      }

      .tj-card__feature-credit-card {
        margin-top: 12px;
        display: flex;
        justify-content: center;
      }

      .tj-card__feature-credit-logo {
        width: 142px;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      .tj-card__title {
        font-size: 30px;
      }

      .tj-card__desc {
        font-size: 14px;
        line-height: 1.65;
      }

      .tj-card__arrow {
        margin-top: auto;
        width: 52px;
        height: 52px;
      }

      .tj-detail {
        padding-top: 80px;
        padding-bottom: 80px;
        display: grid;
        grid-template-columns: 45% 55%;
        gap: 56px;
        align-items: center;
      }

      .tj-detail__title {
        font-size: 34px;
      }

      .tj-detail__text {
        font-size: 15px;
      }

      .tj-detail__media {
        margin-top: 0;
      }

      .tj-detail__media--gallery {
        gap: 14px;
      }

      .tj-faq {
        padding-top: 80px;
        padding-bottom: 80px;
      }

      .tj-faq .tj-detail__title {
        font-size: 34px;
      }

      .tj-faq .tj-detail__text {
        font-size: 15px;
        max-width: 640px;
      }

      .tj-faq-list {
        max-width: 760px;
      }

      .tj-faq-item__q {
        font-size: 15.5px;
        padding: 20px 2px;
      }

      .tj-faq-item__a {
        font-size: 14px;
      }

      .tj-tickets {
        padding-top: 64px;
        padding-bottom: 64px;
      }

      .tj-tickets .tj-detail__title {
        font-size: 34px;
      }

      .tj-tickets .tj-detail__text {
        font-size: 15px;
        max-width: 640px;
      }

      .tj-tickets-list {
        max-width: 760px;
      }

      .tj-ticket-item__q {
        font-size: 15.5px;
        padding: 20px 2px;
      }

      .tj-detail--dark {
        grid-template-columns: 40% 60%;
        align-items: start;
      }

      .tj-menu-brand__chef {
        width: 76px;
        height: 76px;
      }

      .tj-menu-brand__logo {
        width: 92px;
      }

      .tj-menu-cards {
        flex-direction: row;
        gap: 20px;
        margin-top: 0;
      }

      .tj-menu-card {
        flex: 1;
      }

      .tj-schedule {
        flex-direction: row;
        gap: 40px;
      }

      .tj-schedule-block {
        flex: 1;
      }

      .tj-convbar {
        margin-left: max(80px, calc((100% - 1280px) / 2));
        margin-right: max(80px, calc((100% - 1280px) / 2));
        margin-bottom: 56px;
        border-radius: 22px;
        padding: 26px 40px;
        gap: 26px;
      }

      .tj-convbar__icon {
        width: 34px;
        height: 34px;
      }

      .tj-convbar__date-range {
        font-size: 18px;
      }

      .tj-convbar__date-days {
        font-size: 11.5px;
      }

      .tj-convbar__divider {
        height: 52px;
      }

      .tj-convbar__note {
        display: block;
        max-width: 320px;
      }

      .tj-convbar .tj-btn--lg {
        flex: none;
        margin-left: auto;
        padding: 19px 44px;
        font-size: 14px;
      }

      .tj-footer {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
        padding-top: 36px;
        padding-bottom: 36px;
      }

      .tj-footer__brand {
        align-items: flex-start;
      }

      .tj-footer__nav {
        gap: 28px;
        font-size: 12.5px;
        margin-top: 0;
      }

      .tj-footer__copy {
        margin-top: 0;
      }
    }
  `]
})
export class LandingHermosilloComponent implements OnInit {
  private metaService = inject(MetaService);
  private contentService = inject(ContentService);
  private platformId = inject(PLATFORM_ID);
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private renderer = inject(Renderer2);

  menuOpen = false;
  currentYear = new Date().getFullYear();
  whatsappUrl = '';

  @Input() ditsLogo = 'assets/logos/logo-dits.webp';
  @Input() ditsLogoWhite = 'assets/logos/logo-dits-white.webp';

  // Portadas del hero principal: foto real del brindis (3 invitadas, vista
  // del atardecer sobre Hermosillo) — una vertical para mobile y una
  // horizontal para web, evitando que el texto dependa de un recorte
  // automático.
  @Input() heroImage = 'assets/images/city/hermosillo-hero-brindis-mobile.webp';
  @Input() heroImagePosition = 'center center';
  @Input() heroImageDesktop = 'assets/images/city/hermosillo-hero-brindis-desktop.webp';
  @Input() heroImagePositionDesktop = 'center 42%';
  @Input() dateRangeLabel = '12 AL 29 DE NOVIEMBRE 2026';
  @Input() dateRangeMobileLabel = '12-29 nov 2026';
  // Sin patrón de días confirmado todavía (a diferencia de Tijuana, que sí
  // tenía "jueves a domingo" confirmado) — se deja un dato honesto en vez de
  // inventar días.
  @Input() dateDaysLabel = 'TEMPORADA LIMITADA';

  @Input() heroCityLabel = 'Hermosillo';

  @Input() heroHeadlineLines: HermosilloHeroHeadlineSegment[][] = [
    [{ text: 'Por primera vez en ' }, { text: 'Sonora', gold: true }, { text: ',' }],
    [{ text: 'Hermosillo se eleva a' }],
    [{ text: '45 metros', gold: true }, { text: ' de altura.' }]
  ];

  @Input() heroBodyLines: string[] = [
    '22 invitados por vuelo, con vistas incomparables y la máxima seguridad certificada.',
    'Una experiencia única para celebrar, conectar y crear recuerdos que duran toda la vida.'
  ];

  @Input() heroPrimaryCtaLabel = 'Conoce la experiencia';
  @Input() heroPrimaryCtaAnchor = '#experiencia';
  @Input() heroSecondaryCtaLabel = 'Comprar boletos';
  @Input() heroSecondaryCtaAnchor = '#comprar';

  /**
   * No "experiencia" teaser card anymore — the hero headline ("Cuando la
   * gastronomía toca las nubes, nace una experiencia inolvidable.") already
   * covers that pitch, so the card was redundant. The #experiencia detail
   * section further down the page (with the photo gallery) still exists and
   * is still linked from the header/footer nav — only the teaser card here
   * was removed.
   *
   * Order still matters for the desktop grid: "menu" is a full-width feature
   * card (see mediaPosition: 'bottom' below), so it goes FIRST — alone in its
   * own row — leaving the other two normal cards to pair up evenly in the
   * next row. Any other order leaves one of them alone with a blank cell
   * beside it.
   */
  // A diferencia de Tijuana (restaurante/chef confirmado: Cordero Negro), para
  // Hermosillo todavía no hay chef/restaurante invitado confirmado. La card
  // de menú usa el gráfico oficial de "próximamente" del cliente (no una
  // foto de chef, por eso featureLabel: 'Próximamente' en vez del 'Chef'
  // por defecto) — logoOriginal/chefPhoto siguen vacíos, sin inventar un
  // chef o restaurante.
  @Input() discoverCards: HermosilloDiscoverCard[] = [
    {
      id: 'menu',
      eyebrow: 'DESCUBRE',
      title: 'Menú',
      description: 'El restaurante invitado y el menú de tres tiempos para Hermosillo se anunciarán próximamente.',
      image: 'assets/images/city/hermosillo-menu-proximamente.webp',
      imageAlt: 'Estamos preparando el menú con un restaurante local de Hermosillo. Próximamente, todos los detalles.',
      mediaPosition: 'bottom',
      featureLabel: 'Próximamente',
      anchor: '#menu'
    },
    {
      id: 'horarios',
      eyebrow: 'DESCUBRE',
      title: 'Reserva tu lugar',
      description: 'Cupo limitado a 22 invitados por vuelo. Boletos disponibles muy pronto.',
      image: 'assets/images/city/hermosillo-reserva-tarjeta.webp',
      imageAlt: 'Pareja brindando con copas de vino tinto durante el vuelo de Dinner in the Sky, atardecer sobre Hermosillo',
      anchor: '#comprar'
    },
    {
      id: 'mundo',
      eyebrow: 'DESCUBRE',
      title: 'Presente en 70 Países y contando.',
      description: 'Presente en más de 70 países alrededor del mundo. Hermosillo, ahora es parte.',
      image: 'assets/images/city/hermosillo-hero.webp',
      imageAlt: 'Mesa de Dinner in the Sky suspendida junto a la bandera de México',
      anchor: '#mundo'
    }
  ];

  @Input() experienceText =
    'Una cena gourmet a 45 metros de altura, con gastronomía de autor, servicio de hospitality y la máxima seguridad certificada.';

  // Fotos reales de la experiencia (sesión profesional aportada por el
  // cliente): 1 foto hero (ancho completo, 16:10) + 4 fotos cuadradas en
  // grid 2x2, usando tanto los recortes desktop como los mobile que se
  // compartieron para esta sección.
  @Input() experiencePhotos: HermosilloPhoto[] = [
    { src: 'assets/images/city/hermosillo-experiencia-brindis.webp', alt: 'Pareja brindando con los brazos en alto durante el vuelo de Dinner in the Sky, atardecer dorado sobre Hermosillo' },
    { src: 'assets/images/city/hermosillo-experiencia-vino-blanco.webp', alt: 'Pareja brindando con copas de vino blanco a bordo de la mesa suspendida' },
    { src: 'assets/images/city/hermosillo-experiencia-vino-tinto.webp', alt: 'Pareja disfrutando copas de vino tinto con la puesta de sol de fondo' },
    { src: 'assets/images/city/hermosillo-experiencia-familia.webp', alt: 'Madre e hija brindando con la ciudad de Hermosillo iluminada de fondo' },
    { src: 'assets/images/city/hermosillo-experiencia-brindis-2.webp', alt: 'Pareja celebrando con los brazos en alto, vista de Hermosillo al atardecer' }
  ];

  @Input() menuIntro =
    'El menú de tres tiempos y el restaurante invitado para Hermosillo se confirmarán próximamente.';

  @Input() chefPhoto = '';
  @Input() chefPhotoAlt = '';
  /** Sin restaurante invitado confirmado todavía — vacío a propósito (ver
   *  discoverCards arriba). */
  @Input() logoOriginal = '';

  @Input() menuItems: HermosilloMenuItem[] = [
    { course: 'Entrada', name: 'Lo definiremos próximamente' },
    { course: 'Fuerte', name: 'Lo definiremos próximamente' },
    { course: 'Postre', name: 'Lo definiremos próximamente' }
  ];

  // Fechas reales confirmadas; sin desglose de días/horarios todavía (a
  // diferencia de Tijuana). Sección comentada en el template (ver más abajo),
  // se deja el dato correcto por si se reactiva.
  @Input() seasonNote = 'Temporada del 12 al 29 de noviembre de 2026. Horarios por confirmar.';

  /**
   * Informational only — NOT rendered as clickable chips/pills. Turitop's own
   * widget owns real date/time selection; this is just the plain price list
   * per horario/experiencia that the client sent.
   *
   * Sin horarios/precios por franja confirmados para Hermosillo todavía —
   * vacío a propósito (no se inventan horarios). La sección que consume esto
   * ya está comentada en el template (ver "DETAIL: HORARIOS Y PRECIOS").
   */
  @Input() schedule: HermosilloScheduleBlock[] = [];

  // Sin número de vuelos de temporada confirmado (Tijuana sí lo tenía: 64
  // vuelos). Solo se deja el dato confirmado (22 por vuelo).
  @Input() capacityNote = 'Capacidad máxima 22 invitados por vuelo. Precios por persona.';

  @Input() worldText =
    'Nacida en Bélgica, Dinner in the Sky ha llevado la mesa a las alturas en más de 70 países alrededor del mundo. En 2026, Hermosillo se suma a esa lista.';

  @Input() worldStats: HermosilloStat[] = [
    { value: '+80', label: 'ciudades' },
    { value: '+70', label: 'países' },
    { value: '2026', label: 'llega a Hermosillo' }
  ];

  // Reutiliza la misma foto real del hero (bandera + góndola) — temática
  // idéntica a la que tenía Tijuana aquí, y es un asset real ya aprobado.
  @Input() worldImage = 'assets/images/city/hermosillo-hero.webp';
  @Input() worldImageAlt = 'Mesa de Dinner in the Sky suspendida junto a la bandera de México';

  // Copy de lanzamiento provista por el cliente: la sede exacta todavía no
  // se revela a propósito (efecto "reveal" de marca), no es un dato
  // faltante por descuido. venueImage usa el gráfico oficial de anuncio
  // ("SEDE POR ANUNCIAR") provisto por el cliente — recorte vertical, que
  // es el que mejor encaja en la caja tipo póster (aspect-ratio 1122/1402,
  // object-fit: contain) de esta sección. La sede exacta (dirección/mapa)
  // se agrega aquí (venueAddress/venueMapImage/venueImage) cuando el
  // cliente la revele.
  @Input() venueText = 'Una experiencia de altura merece una sede majestuosa. En pocos días revelaremos el espectacular lugar que nos recibirá en Hermosillo.';
  @Input() venueAddress = '';
  @Input() venueMapImage = '';
  @Input() venueImage = 'assets/images/city/hermosillo-sede-por-anunciar.webp';
  @Input() venueImageAlt = 'Sede por anunciar — Dinner in the Sky Hermosillo, 12 al 29 de noviembre 2026. Pronto conocerás dónde viviremos esta experiencia en las alturas.';

  @Input() convBarNote = 'Cupo limitado. Asegura tu lugar y vive Hermosillo desde el cielo.';

  @Input() ticketsIntro = 'Elige tu paquete y reserva tu lugar en el cielo.';

  /**
   * The 3 Turitop products for this venue, per los códigos reales
   * confirmados por el cliente en Turitop's "Lista de servicios" (P153/P155/
   * P156, cuenta D119 — misma cuenta que Ensenada/Puebla/CDMX, confirmado
   * con el cliente). Each renders as a dropdown in the #comprar section;
   * opening it lazy-mounts that product's Turitop widget.
   *
   * Precio: $3,500 MXN confirmado para los 3 paquetes, cada uno con opción
   * de menú regular o vegetariano a elegir al reservar (dentro del propio
   * widget de Turitop). Duración y contenido exacto del menú aún no
   * confirmados — no se inventan aquí.
   */
  @Input() ticketPackages: HermosilloTicketPackage[] = [
    {
      id: 'comida-atardecer',
      title: 'Comida al atardecer',
      price: '$3,500 MXN',
      description: [
        { text: 'Un vuelo con vista al atardecer sobre Hermosillo, a 45 metros de altura, con ' },
        { text: 'menú regular o vegetariano', highlight: true },
        { text: ' a elegir al reservar.' }
      ],
      service: 'P153'
    },
    {
      id: 'comida-alturas',
      title: 'Comida en las alturas',
      price: '$3,500 MXN',
      description: [
        { text: 'Una comida a 45 metros de altura sobre Hermosillo, con ' },
        { text: 'menú regular o vegetariano', highlight: true },
        { text: ' a elegir al reservar.' }
      ],
      service: 'P155'
    },
    {
      id: 'cena-alturas',
      title: 'Cena en las alturas',
      price: '$3,500 MXN',
      description: [
        { text: 'Una cena a 45 metros de altura sobre Hermosillo, con ' },
        { text: 'menú regular o vegetariano', highlight: true },
        { text: ' a elegir al reservar.' }
      ],
      service: 'P156'
    }
  ];

  /** Turitop account/company code shared by every widget on this page.
   *  D119 — misma cuenta que Ensenada/Puebla/CDMX, confirmado con el
   *  cliente (los códigos P153/155/156 siguen su misma numeración
   *  secuencial: P150 Ensenada, P151 Puebla, P152 CDMX). */
  @Input() turitopCompany = 'D119';
  @Input() turitopLang = 'es';
  @Input() turitopButtonColor = 'green';
  @Input() turitopAffTag = 'ttafid';

  /**
   * FAQ lives inline in this page (there's no separate /faq route anymore —
   * the site is single-page). Generic content, same copy the old multi-city
   * FAQ page used (site-data.ts FAQ_ITEMS), reproduced here as a plain default
   * so this component stays fully self-contained and @Input-overridable.
   */
  @Input() faqIntro = 'No todos se atreven. Pero todos preguntan. Aquí tienes lo que necesitas saber antes de subir.';

  @Input() faqItems: HermosilloFaqItem[] = [
    { id: 'faq-1', question: '¿Es seguro?', answer: 'Sí. Operamos bajo los más altos estándares internacionales, con equipo certificado y personal especializado.' },
    { id: 'faq-2', question: '¿A qué altura es la experiencia?', answer: 'Aproximadamente 45 metros. Lo suficiente para cambiar tu perspectiva.' },
    { id: 'faq-3', question: '¿Cuánto dura?', answer: 'Alrededor de 60 minutos en el aire. Un recuerdo para siempre.' },
    { id: 'faq-4', question: '¿Cuántas personas suben?', answer: '22 invitados por experiencia. No hay multitudes. Hay momentos.' },
    { id: 'faq-5', question: '¿Hay baño?', answer: 'Sí, en tierra antes y después de la experiencia.\n\nUna vez arriba, no hay pausas.' },
    { id: 'faq-6', question: '¿Edad mínima?', answer: 'A partir de 6 años, acompañados de un adulto.' },
    { id: 'faq-7', question: '¿Hay límite de peso o condiciones físicas?', answer: 'Sí. El límite es de 130 kg por persona.\n\nLa seguridad no se negocia.' },
    { id: 'faq-8', question: '¿Qué pasa si tengo vértigo?', answer: 'Tal vez sientas emoción.\n\nMuchos dudan… y terminan disfrutándolo.' },
    { id: 'faq-9', question: '¿Qué debo usar?', answer: 'Ropa cómoda. Evita objetos sueltos.\n\nAquí vienes a vivir, no a preocuparte.' },
    { id: 'faq-10', question: '¿Puedo llevar celular o cámara?', answer: 'Sí, bajo tu responsabilidad.\n\nLo que vas a ver… querrás recordarlo.' },
    { id: 'faq-11', question: '¿Qué pasa si llueve o hay mal clima?', answer: 'La seguridad es primero.\n\nPodemos reprogramar si las condiciones no son adecuadas.' },
    { id: 'faq-12', question: '¿Puedo cancelar o pedir reembolso?', answer: 'No hay reembolsos.\n\nTu lugar está reservado para alguien que decidió atreverse.' },
    { id: 'faq-13', question: '¿Puedo cambiar mi fecha?', answer: 'Sujeto a disponibilidad y condiciones. Consúltanos con anticipación.' },
    { id: 'faq-14', question: '¿Se puede tomar alcohol?', answer: 'Sí, de manera moderada.\n\nDisfrutar también es saber medir.' },
    { id: 'faq-15', question: '¿Es apto para embarazadas?', answer: 'No es recomendable.' },
    { id: 'faq-16', question: '¿Puedo hacer eventos privados?', answer: 'Sí. Y son otra liga.' }
  ];

  openFaqId: string | null = null;

  ngOnInit(): void {
    this.metaService.setCity('Hermosillo', 'hermosillo');
    this.whatsappUrl = this.contentService.getWhatsappUrl();
    this.mountTuritopWidgets();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Handles every internal same-page anchor on this page (header nav,
   * mobile drawer, hero CTAs, discover cards, conversion bar, footer).
   *
   * BUG FIX: plain `href="#id"` native browser fragment-scrolling does NOT
   * work reliably on this page — confirmed live on the deployed site
   * (dinnerfront.vercel.app/hermosillo): neither clicking a `href="#id"`
   * link, nor setting `location.hash` at runtime, nor loading the URL with
   * the fragment already in it actually scrolls to the target section (it
   * silently stays at/near the top). A manual `element.scrollIntoView()`
   * call, however, works perfectly — so every internal link now calls this
   * instead of relying on native fragment navigation. Root cause is most
   * likely this app's SSR + client hydration (`provideClientHydration()`
   * in app.config.ts): hydration replaces/reconciles the DOM after the
   * browser's one-time initial fragment-scroll already resolved (or fails
   * to resolve) against the pre-hydration tree, so the native jump never
   * lands on the final, hydrated element.
   *
   * `href` is kept on every anchor (so middle-click/ctrl-click "open in
   * new tab", right-click "copy link", and no-JS/SEO crawling still work);
   * this handler only intercepts a plain left-click to do the scroll
   * itself and prevent the (broken) native jump from fighting it.
   */
  scrollToAnchor(href: string, event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Let modified/middle clicks behave natively (new tab, etc.).
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const id = href.startsWith('#') ? href.slice(1) : href;
    if (!id) {
      return;
    }
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFaq(id: string): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }

  openTicketId: string | null = null;

  /** Pure UI toggle — the Turitop widgets are already mounted (see
   *  `mountTuritopWidgets`); the dropdown only shows/hides them via CSS. */
  toggleTicket(pkg: HermosilloTicketPackage): void {
    this.openTicketId = this.openTicketId === pkg.id ? null : pkg.id;
  }

  /**
   * Mounts the official Turitop "load-turitop" embed for every package in
   * `ticketPackages`, once, right when the page loads.
   *
   * This intentionally does NOT lazy-mount widgets only when their dropdown
   * is opened. Turitop's loader (like most vendor "paste this snippet into
   * your page" embeds) scans the DOM for `.load-turitop` elements once,
   * on its own script's `load`/`DOMContentLoaded` — it doesn't watch for
   * elements added later. Injecting it on first click, long after those
   * events already fired, meant the loader's scan never ran and no widget
   * ever rendered. Mounting eagerly here (with the divs already sitting in
   * an initially-collapsed panel that CSS reveals on open — see
   * `.tj-ticket-item__panel`) reproduces the "static HTML on page load"
   * conditions the snippet actually expects.
   *
   * Angular strips <script> tags from template markup/innerHTML entirely
   * (confirmed against the Angular compiler), so the div + loader script
   * are built and appended imperatively via Renderer2 instead — the only
   * way to get a third-party script to actually execute here.
   */
  private mountTuritopWidgets(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    for (const pkg of this.ticketPackages) {
      const mount = this.elementRef.nativeElement.querySelector<HTMLElement>(
        `#tj-turitop-mount-${pkg.id}`
      );
      if (!mount) {
        continue;
      }

      const widgetDiv = this.renderer.createElement('div');
      this.renderer.addClass(widgetDiv, 'load-turitop');
      this.renderer.setAttribute(widgetDiv, 'data-service', pkg.service);
      this.renderer.setAttribute(widgetDiv, 'data-lang', this.turitopLang);
      this.renderer.setAttribute(widgetDiv, 'data-embed', 'box');
      this.renderer.appendChild(mount, widgetDiv);

      const script = this.renderer.createElement('script');
      // 'js-turitop' is the literal id from Turitop's own embed snippet — their
      // loader reads its own config (data-company/buttoncolor/afftag) off the
      // script tag via this fixed id (confirmed: dropping it made the loader
      // throw "Cannot read properties of null (reading 'getAttribute')").
      // Config is identical for every package here, so reusing the same id on
      // all 3 script tags is harmless — getElementById just returns the first
      // one, whose attributes match the rest anyway.
      this.renderer.setAttribute(script, 'id', 'js-turitop');
      this.renderer.setAttribute(script, 'src', 'https://app.turitop.com/js/load-turitop.min.js');
      this.renderer.setAttribute(script, 'data-company', this.turitopCompany);
      this.renderer.setAttribute(script, 'data-buttoncolor', this.turitopButtonColor);
      this.renderer.setAttribute(script, 'data-afftag', this.turitopAffTag);
      this.renderer.appendChild(mount, script);
    }
  }
}
