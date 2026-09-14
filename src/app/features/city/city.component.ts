import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { City } from '../../models';
import { ContentService } from '../../services/content.service';
import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

const TURITOP_COMPANY = 'D119';

interface AccordionPanel {
  id: string;
  label: string;
  content: string;
}

interface CityVisualAsset {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (city) {
      <main
        id="content"
        class="site-main ds-lp-app ds-mty-premium ds-lp-root"
        [class.city-page--ensenada]="city.id === 'ensenada'"
        [class.city-page--puebla]="city.id === 'puebla'"
        [class.city-page--cdmx]="city.id === 'mexico-city'"
        [class.city-page--hermosillo]="city.id === 'hermosillo'"
        role="main"
      >
        <section class="ds-mty-hero ds-mty-hero--entered" [attr.aria-label]="'Dinner in the Sky ' + city.name">
          <div class="ds-mty-hero__media" aria-hidden="true">
            <img [src]="city.pageHeroImage || city.image" alt="" width="1920" height="1080" loading="eager" decoding="async" />
          </div>
          <div class="ds-mty-hero__overlay" [class.ds-mty-hero__overlay--hermosillo]="city.id === 'hermosillo'" aria-hidden="true"></div>
          @if (city.id === 'hermosillo') {
            <div class="ds-mty-hero__content ds-mty-hero__content--hermosillo">
              <div class="ds-shell">
                <p class="ds-mty-hero__eyebrow">Por primera vez en Sonora · Únicas fechas 12–29 nov 2026</p>
                <h1 class="ds-mty-hero__title">Hermosillo</h1>
                <p class="ds-mty-hero__lead">Una experiencia internacional a 45 metros de altura. Una temporada irrepetible.</p>
                <a class="ds-mty-cta-btn" href="#mty-booking">Elegir día y horario</a>
              </div>
            </div>
          } @else {
            <div class="ds-mty-hero__content" aria-hidden="true">
              <div class="ds-shell"></div>
            </div>
          }
        </section>

        <section class="ds-mty-highlight" id="mty-visual" aria-labelledby="mty-highlight-heading">
          <div class="ds-shell">
            <div class="ds-mty-highlight__media">
              <img [src]="city.pageHeroImage || city.image" [alt]="'Dinner in the Sky ' + city.name" loading="lazy" decoding="async" />
              <div class="ds-mty-highlight__overlay" aria-hidden="true"></div>
              <div class="ds-mty-highlight__content">
                <h1 class="ds-mty-title" id="mty-highlight-heading">
                  {{ city.name }}
                  <span class="sr-only">— Dinner in the Sky {{ city.name }}: cena suspendida a 45 metros de altura</span>
                </h1>
                <p class="ds-mty-sub">{{ highlightSub }}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="mty-experience" class="ds-mty-editorial" aria-labelledby="mty-experience-heading">
          <div class="ds-shell">
            <div class="ds-mty-section__eyebrow">{{ city.name }} 2026</div>
            <h2 class="ds-mty-section__title" id="mty-experience-heading">Una experiencia para valientes.</h2>
            <p class="ds-mty-section__copy">{{ editorialCopy }}</p>

            @if (city.id === 'hermosillo') {
              <p class="ds-mty-trust">+70 países en el mundo · {{ city.guestCount }} invitados por vuelo</p>
            }

            @if (city.id !== 'hermosillo') {
            <section class="booking-offer booking-offer--visual" [attr.aria-label]="'Dinner in the Sky ' + city.name">
              @if (cityVisualLogo; as logo) {
                <div class="ds-city-price-logo" [attr.aria-label]="logo.alt">
                  <img [src]="logo.src" [alt]="logo.alt" loading="lazy" decoding="async" />
                </div>
              }

              @if (bookingVisualImage; as visual) {
                <div class="booking-offer__visual">
                  <img [src]="visual" [alt]="bookingVisualAlt" loading="lazy" decoding="async" />
                </div>
              }

              @if (cityMenuImage; as menu) {
                <button
                  type="button"
                  class="menu-toggle"
                  [class.menu-toggle--open]="showMenu"
                  [attr.aria-expanded]="showMenu"
                  aria-controls="mty-menu-panel"
                  (click)="toggleMenu()"
                >
                  <span class="menu-toggle__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 13a8 8 0 0 1 16 0Z" />
                      <path d="M2.5 13h19" />
                      <path d="M12 9V5" />
                      <circle cx="12" cy="3.6" r="1" />
                    </svg>
                  </span>
                  <span class="menu-toggle__label">Checa el menú.</span>
                  <span class="menu-toggle__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
                <div class="menu-toggle__panel" [class.menu-toggle__panel--open]="showMenu" id="mty-menu-panel">
                  <div class="menu-toggle__panel-inner">
                    <img [src]="menu.src" [alt]="menu.alt" loading="lazy" decoding="async" />
                  </div>
                </div>
              }

              @if (citySedeInfo; as sedeInfo) {
                <button
                  type="button"
                  class="menu-toggle"
                  [class.menu-toggle--open]="showSede"
                  [attr.aria-expanded]="showSede"
                  aria-controls="mty-sede-panel"
                  (click)="toggleSede()"
                >
                  <span class="menu-toggle__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 21s7-7.58 7-12A7 7 0 0 0 5 9c0 4.42 7 12 7 12z" />
                      <circle cx="12" cy="9" r="2.4" />
                    </svg>
                  </span>
                  <span class="menu-toggle__label">Checa la sede.</span>
                  <span class="menu-toggle__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
                <div class="menu-toggle__panel" [class.menu-toggle__panel--open]="showSede" id="mty-sede-panel">
                  <div class="menu-toggle__panel-inner ds-accordion-content__inner" [innerHTML]="sedeInfo"></div>
                </div>
              }

              @if (cityGallery.length) {
                <div
                  class="ds-city-gallery"
                  [class.ds-city-gallery--contain]="city.id === 'mexico-city'"
                  [attr.aria-label]="'Galería Dinner in the Sky ' + city.name"
                >
                  @for (image of cityGallery; track image.src) {
                    <div class="ds-city-gallery__item">
                      <img [src]="image.src" [alt]="image.alt" loading="lazy" decoding="async" />
                    </div>
                  }
                </div>
              }
            </section>
            }

            @if (city.id === 'hermosillo' && city.features?.length) {
              <div class="ds-mty-features ds-mty-features--card">
                <p class="ds-mty-features__title">Tu experiencia incluye</p>
                <ul class="ds-mty-features__list">
                  @for (feature of city.features; track feature) {
                    <li class="ds-mty-features__item">{{ feature }}</li>
                  }
                </ul>
                <a class="ds-mty-features__link" href="#mty-booking">Ver disponibilidad <span aria-hidden="true">→</span></a>
              </div>
            }
          </div>
        </section>

        <section id="mty-booking" class="ds-mty-booking ds-mty-booking--v2" aria-labelledby="mty-booking-heading">
          <div class="ds-shell">
            <div class="ds-mty-booking__panel">
              <div class="ds-mty-booking__intro">
                <div class="eyebrow">Tu reserva</div>
                <h2 class="section-title" id="mty-booking-heading">Calendario y cupos.</h2>
                <p class="section-sub">{{ bookingCopy }}</p>
              </div>

              <div class="ds-mty-checkout-app" id="mty-checkout">
                <h3 class="section-title ds-mty-checkout-app__title">Selecciona tu fecha</h3>
                <p class="section-sub ds-mty-checkout-app__lead">
                  Consulta disponibilidad en tiempo real y continúa con tu reserva segura.
                </p>
              </div>

              <div class="ds-mty-turitop-mount entry-content">
                <div class="turitop-mobile-shell">
                  @if (turitopUrl) {
                    <div class="turitop_bswp_button_box_wrap">
                      <iframe
                        class="iframe-resizable-turitop turitop-iframe"
                        [src]="turitopUrl"
                        title="Reserva Dinner in the Sky"
                        sandbox="allow-top-navigation allow-forms allow-modals allow-scripts allow-same-origin allow-popups"
                        loading="lazy"
                        allow="payment"
                        (load)="onBookingWidgetLoaded()"
                      ></iframe>
                    </div>
                  } @else {
                    <div class="ds-mty-booking__fallback" role="status">
                      Las reservas para {{ city.name }} se abrirán próximamente.
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ds-accordion" id="mty-informacion" aria-labelledby="ds-accordion-heading">
          <div class="ds-shell">
            <header class="ds-accordion__head">
              <p class="ds-mty-section__eyebrow">Información</p>
              <h2 class="ds-accordion__title" id="ds-accordion-heading">Términos, menú y sede</h2>
              <p class="ds-accordion__lede">
                Antes de reservar, revisa lo esencial. Todo en un solo lugar, con el mismo criterio visual del resto de la experiencia.
              </p>
            </header>

            <div class="ds-accordion__stack" role="presentation">
              @for (panel of accordionPanels; track panel.id) {
                <div class="ds-accordion-item">
                  <details class="ds-accordion-details" [attr.id]="'mty-acc-' + panel.id" name="mty-acc">
                    <summary class="ds-accordion-header">
                      <span class="ds-accordion-header__label">{{ panel.label }}</span>
                      <span class="ds-accordion-icon" aria-hidden="true"></span>
                    </summary>
                    <div class="ds-accordion-content">
                      <div class="ds-accordion-content__inner entry-content" [innerHTML]="panel.content"></div>
                    </div>
                  </details>
                </div>
              }
            </div>
          </div>
        </section>
      </main>
    }
  `,
  styles: [`
    :host {
      display: block;
      margin-top: -68px;
      position: relative;
      z-index: 0;
    }

    .ds-mty-premium {
      --ds-bg: #f6f9ff;
      --ds-bg-2: #eef3fa;
      --ds-bg-3: #ffffff;
      --ds-text: #1a2b42;
      --ds-text-soft: rgba(26, 43, 66, 0.78);
      --ds-text-muted: rgba(44, 72, 113, 0.6);
      --ds-gold: #2c4871;
      --ds-gold-deep: #1f3555;
      --ds-border: rgba(44, 72, 113, 0.12);
      --ds-border-strong: rgba(44, 72, 113, 0.22);
      --ds-panel: #ffffff;
      --ds-panel-soft: rgba(255, 255, 255, 0.96);
      --ds-shadow: 0 24px 80px rgba(44, 72, 113, 0.08);
      --ds-shadow-deep: 0 36px 100px rgba(44, 72, 113, 0.12);
      --ds-radius-xl: 32px;
      --ds-radius-lg: 24px;
      --ds-radius-md: 18px;
      --font-display: "Bebas Neue", Impact, "Arial Narrow", sans-serif;
      --font-body: "Montserrat", system-ui, sans-serif;
      background:
        radial-gradient(circle at top, rgba(44, 72, 113, 0.06), transparent 40%),
        linear-gradient(180deg, #f6f9ff 0%, #ffffff 100%);
      color: #1a2b42;
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: clip;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 0;
      display: block;
      box-sizing: border-box;
    }

    .ds-mty-premium *,
    .ds-mty-premium *::before,
    .ds-mty-premium *::after {
      box-sizing: border-box;
    }

    .ds-shell,
    .ds-mty-shell {
      width: min(1240px, calc(100% - 40px));
      margin: 0 auto;
    }

    /* Visible content only for screen readers / search engines — used to give
       the H1 a fuller, geo-keyword-rich phrase without changing the large
       on-screen city-name treatment. */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .ds-mty-hero {
      position: relative;
      height: 648px;
      min-height: 648px;
      padding: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      overflow: hidden;
      background: linear-gradient(180deg, #dce9f7 0%, #f6f9ff 100%);
    }

    .ds-mty-hero__media,
    .ds-mty-hero__media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .ds-mty-hero__media img {
      object-fit: cover;
      object-position: center 38%;
      filter: brightness(1.02) contrast(0.98) saturate(0.95);
      transform: scale(1.03);
    }

    .city-page--puebla .ds-mty-hero__media img {
      object-position: center 50%;
    }

    .city-page--cdmx .ds-mty-hero__media img {
      object-position: center 45%;
    }

    .city-page--hermosillo .ds-mty-hero__media img {
      object-position: center 20%;
    }

    .ds-mty-hero__overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: none;
    }

    .ds-mty-hero__content {
      position: relative;
      z-index: 2;
      padding-top: clamp(112px, 18vh, 180px);
      padding-bottom: clamp(72px, 10vh, 120px);
      text-align: center;
    }

    .ds-mty-highlight {
      display: none;
      padding: clamp(60px, 8vw, 120px) 0;
      position: relative;
    }

    .ds-mty-highlight__media {
      position: relative;
      aspect-ratio: 16 / 9;
      max-height: min(85vh, 960px);
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid rgba(217, 203, 184, 0.85);
      box-shadow: 0 28px 80px rgba(13, 53, 112, 0.1);
      background: #fffdf9;
    }

    .ds-mty-highlight__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 38%;
      display: block;
      filter: brightness(0.95) contrast(1) saturate(0.95);
      transform: scale(1.02);
      transform-origin: center center;
    }

    .city-page--puebla .ds-mty-highlight__media img {
      object-position: center 50%;
    }

    .city-page--cdmx .ds-mty-highlight__media img {
      object-position: center 45%;
    }

    .city-page--hermosillo .ds-mty-highlight__media img {
      object-position: center 20%;
    }

    .ds-mty-highlight__overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(255, 253, 249, 0.05) 0%,
        rgba(245, 240, 232, 0.45) 55%,
        rgba(255, 253, 249, 0.88) 100%
      );
    }

    .ds-mty-highlight__content {
      position: absolute;
      bottom: clamp(24px, 4vw, 48px);
      left: clamp(24px, 4vw, 48px);
      max-width: 520px;
      z-index: 2;
      text-align: left;
    }

    .ds-mty-highlight .ds-mty-title {
      font-family: var(--font-display);
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.15;
      color: #ffffff;
      margin: 0 0 8px;
    }

    .ds-mty-highlight .ds-mty-sub {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.88);
      line-height: 1.7;
      margin: 0;
    }

    .ds-mty-editorial,
    .ds-mty-support {
      padding: 10px 0;
      background: #ffffff;
    }

    .city-page--hermosillo .ds-mty-editorial {
      padding: clamp(64px, 9vw, 112px) 0 clamp(72px, 10vw, 128px);
      background: radial-gradient(circle at 12% 0%, rgba(44, 72, 113, 0.06), transparent 45%), #ffffff;
    }

    .city-page--hermosillo .ds-mty-section__eyebrow {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .city-page--hermosillo .ds-mty-section__eyebrow::before {
      content: '';
      display: block;
      width: 32px;
      height: 2px;
      background: var(--ds-gold-deep);
      flex: none;
    }

    .ds-mty-section__eyebrow {
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--ds-text-muted);
      margin-bottom: 18px;
      font-family: var(--font-body);
    }

    .ds-mty-section__title {
      margin: 0 0 8px;
      font-size: clamp(36px, 4.5vw, 56px);
      line-height: 1.15;
      font-family: var(--font-display);
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #0D2545;
      text-rendering: optimizeLegibility;
    }

    .ds-mty-section__copy {
      margin: 18px 0 24px;
      max-width: 760px;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.7;
      color: rgb(61, 106, 149);
      font-family: var(--font-body);
    }

    .booking-offer {
      text-align: center;
      margin: 24px auto;
      height: auto;
      max-width: 760px;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      font-family: var(--font-body);
      color: #141414;
    }

    .booking-offer * {
      font-family: var(--font-body);
    }

    .booking-offer__main {
      display: flex;
      justify-content: center;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px;
      color: #2c4871;
    }

    .booking-offer__main .currency {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
      color: #141414;
    }

    .booking-offer__main .amount {
      font-size: 56px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #2c4871;
    }

    .booking-offer__main .mxn {
      font-size: 22px;
      font-weight: 700;
      align-self: flex-start;
      margin-top: 0.28em;
      line-height: 1;
      color: #141414;
    }

    .booking-offer__subtitle {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #2c4871;
      text-transform: uppercase;
      line-height: 1.25;
    }

    .booking-offer__visual {
      width: min(100%, 620px);
      overflow: hidden;
      background: #eef3fa;
      border-radius: 14px;
      box-shadow: 0 12px 36px rgba(44, 72, 113, 0.12);
    }

    .booking-offer__visual img {
      display: block;
      width: 100%;
      height: auto;
      max-height: min(74vh, 780px);
      object-fit: contain;
      object-position: center center;
      margin: 0 auto;
    }

    .ds-city-price-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 0;
    }

    .ds-city-price-logo img {
      display: block;
      width: min(100%, 560px);
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.18));
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      width: min(100%, 620px);
      margin: 4px 0 0;
      padding: 14px 18px;
      background: var(--ds-panel);
      border: 1px solid rgba(201, 162, 75, 0.55);
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(44, 72, 113, 0.1);
      cursor: pointer;
      font-family: var(--font-body);
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .menu-toggle:hover {
      border-color: rgba(201, 162, 75, 0.9);
      box-shadow: 0 10px 28px rgba(44, 72, 113, 0.16);
    }

    .menu-toggle__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--ds-gold-deep);
      color: #fff;
    }

    .menu-toggle__label {
      flex: 1;
      text-align: left;
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--ds-gold-deep);
    }

    .menu-toggle__chevron {
      flex-shrink: 0;
      display: flex;
      color: var(--ds-gold-deep);
      transition: transform 0.25s ease;
    }

    .menu-toggle--open .menu-toggle__chevron {
      transform: rotate(90deg);
    }

    .menu-toggle__panel {
      display: grid;
      grid-template-rows: 0fr;
      width: min(100%, 620px);
      opacity: 0;
      transition: grid-template-rows 0.35s ease, opacity 0.3s ease;
    }

    .menu-toggle__panel--open {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .menu-toggle__panel-inner {
      overflow: hidden;
    }

    .menu-toggle__panel-inner img {
      display: block;
      width: 100%;
      max-width: 420px;
      height: auto;
      margin: 16px auto 0;
      border-radius: var(--ds-radius-md);
      box-shadow: 0 12px 32px rgba(44, 72, 113, 0.14);
    }

    .ds-city-gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      width: 100%;
      margin-top: 2px;
    }

    .ds-city-gallery__item {
      aspect-ratio: 2 / 3;
      overflow: hidden;
      border-radius: 10px;
      background: #eef3fa;
    }

    .ds-city-gallery__item img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      transition: transform 0.3s ease;
    }

    .ds-city-gallery--contain .ds-city-gallery__item {
      aspect-ratio: 4 / 2.35;
    }

    .ds-city-gallery--contain .ds-city-gallery__item img {
      object-fit: contain;
      object-position: center center;
      padding: 6px;
      background: #ffffff;
    }

    .ds-city-gallery__item:hover img {
      transform: scale(1.04);
    }

    #mty-visual,
    #mty-experience,
    #mty-booking,
    #mty-informacion {
      scroll-margin-top: min(120px, 20vh);
    }

    #mty-booking.ds-mty-booking > .ds-shell {
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 24px;
      box-sizing: border-box;
    }

    #mty-booking.ds-mty-booking {
      --text-soft: #5b7a9f;
      padding: clamp(72px, 9vw, 112px) 0;
      background: #eef3fa;
    }

    #mty-booking .ds-mty-booking__panel {
      padding: clamp(28px, 3.5vw, 40px);
      padding-bottom: clamp(16px, 2vw, 24px);
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid rgba(44, 72, 113, 0.1);
      box-shadow: 0 8px 40px rgba(44, 72, 113, 0.14);
    }

    #mty-booking .ds-mty-booking__intro {
      margin-bottom: 0;
    }

    #mty-booking .ds-mty-booking__intro .eyebrow {
      margin-bottom: 14px;
      font-family: "Montserrat", system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #2c4871;
    }

    #mty-booking .ds-mty-booking__intro .section-title {
      margin: 0 0 8px;
      font-family: "Bebas Neue", Impact, "Arial Narrow", sans-serif;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      font-weight: 800;
      letter-spacing: normal;
      line-height: 1.2;
      color: #2c4871;
    }

    #mty-booking .ds-mty-booking__intro .section-sub {
      max-width: 56ch;
      margin: 0 0 24px;
      font-family: "Montserrat", system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      font-weight: 600;
      color: var(--text-soft);
    }

    .ds-mty-checkout-app {
      margin-top: clamp(20px, 2.5vw, 28px);
      padding-top: clamp(22px, 3vw, 32px);
      border-top: 1px solid rgba(21, 101, 192, 0.1);
      overflow: visible;
    }

    #mty-booking .ds-mty-checkout-app .section-title.ds-mty-checkout-app__title {
      margin: 0 0 8px;
      font-family: "Bebas Neue", Impact, "Arial Narrow", sans-serif;
      font-size: clamp(1.35rem, 2.6vw, 2rem);
      font-weight: 800;
      letter-spacing: normal;
      color: #2c4871;
    }

    #mty-booking .ds-mty-checkout-app .section-sub.ds-mty-checkout-app__lead {
      margin: 0 0 24px;
      max-width: 52ch;
      font-family: "Montserrat", system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      font-weight: 600;
      color: var(--text-soft);
    }

    #mty-booking .ds-mty-checkout-app + .ds-mty-turitop-mount {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      margin-top: clamp(12px, 2.2vw, 20px);
      box-sizing: border-box;
    }

    .ds-mty-turitop-mount {
      overflow: visible;
      min-height: 120px;
      padding-bottom: 0;
    }

    .turitop-mobile-shell {
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }

    #mty-booking .ds-mty-turitop-mount .turitop_bswp_button_box_wrap {
      width: 100%;
      background: #ffffff;
      border: 1px solid rgba(44, 72, 113, 0.1);
      border-radius: var(--ds-radius-lg);
      box-shadow: 0 4px 24px rgba(44, 72, 113, 0.1);
      padding: 18px;
      margin: 20px 0;
      overflow: visible;
    }

    #mty-booking .ds-mty-turitop-mount iframe.iframe-resizable-turitop {
      display: block;
      width: 100%;
      max-width: min(1150px, 100%);
      min-height: 720px;
      border: 1px solid rgba(44, 72, 113, 0.12);
      border-radius: 20px;
      box-shadow: 0 14px 44px rgba(44, 72, 113, 0.08);
      background: #f6f9ff;
      color-scheme: light;
    }

    .ds-mty-booking__fallback {
      width: 100%;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 28px;
      border-radius: 20px;
      background: #f6f9ff;
      border: 1px solid rgba(44, 72, 113, 0.12);
      color: #2c4871;
      font: 700 16px/1.5 "Montserrat", system-ui, sans-serif;
      text-align: center;
    }

    .city-page--hermosillo .ds-mty-hero {
      align-items: flex-end;
    }

    .ds-mty-hero__overlay--hermosillo {
      background: linear-gradient(180deg, rgba(31, 53, 85, 0) 30%, rgba(31, 53, 85, 0.55) 72%, rgba(31, 53, 85, 0.88) 100%);
    }

    .ds-mty-hero__content--hermosillo {
      padding-top: 0;
      padding-bottom: clamp(48px, 9vh, 100px);
      animation: ds-mty-hero-reveal 0.8s ease both;
    }

    @keyframes ds-mty-hero-reveal {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .ds-mty-hero__eyebrow {
      margin: 0 0 14px;
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.92);
    }

    .ds-mty-hero__title {
      margin: 0 0 14px;
      font-family: var(--font-display);
      font-size: clamp(44px, 7vw, 88px);
      font-weight: 700;
      line-height: 1.02;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .ds-mty-hero__lead {
      margin: 0 auto 28px;
      max-width: 46ch;
      font-family: var(--font-body);
      font-size: clamp(15px, 1.6vw, 18px);
      font-weight: 500;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.88);
    }

    .ds-mty-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 15px 32px;
      border-radius: 999px;
      background: var(--ds-gold-deep);
      color: #fff;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-decoration: none;
      box-shadow: 0 14px 34px rgba(31, 53, 85, 0.32);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .ds-mty-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 40px rgba(31, 53, 85, 0.4);
    }

    .ds-mty-trust {
      margin: 28px 0 0;
      padding-top: 22px;
      border-top: 1px solid var(--ds-border);
      max-width: 760px;
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--ds-text-muted);
    }

    .ds-mty-features {
      margin: 40px 0 0;
      max-width: 760px;
      text-align: left;
    }

    .ds-mty-features--card {
      position: relative;
      padding: clamp(32px, 4vw, 48px);
      background: var(--ds-panel);
      border: 1px solid var(--ds-border);
      border-radius: var(--ds-radius-lg);
      box-shadow: var(--ds-shadow-deep);
      overflow: hidden;
      animation: ds-mty-hero-reveal 0.7s ease both;
      animation-delay: 0.1s;
    }

    .ds-mty-features--card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 4px;
      background: var(--ds-gold-deep);
    }

    .ds-mty-features__title {
      margin: 0 0 24px;
      font-family: var(--font-display);
      font-size: clamp(24px, 2.8vw, 32px);
      font-weight: 700;
      color: #0D2545;
    }

    .ds-mty-features__list {
      counter-reset: feature;
      list-style: none;
      margin: 0 0 28px;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 22px clamp(24px, 3vw, 48px);
    }

    .ds-mty-features__item {
      counter-increment: feature;
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 600;
      color: var(--ds-text);
    }

    .ds-mty-features__item::before {
      content: counter(feature, decimal-leading-zero);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--ds-gold-deep);
      color: #fff;
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
    }

    .ds-mty-features__link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ds-gold-deep);
      text-decoration: none;
      border-bottom: 2px solid var(--ds-gold-deep);
      padding-bottom: 2px;
      transition: gap 0.2s ease, opacity 0.2s ease;
    }

    .ds-mty-features__link:hover {
      gap: 10px;
      opacity: 0.85;
    }

    .ds-accordion {
      padding: clamp(72px, 10vw, 132px) 0 clamp(56px, 8vw, 100px);
      background: linear-gradient(180deg, rgb(238, 243, 250) 0%, rgb(220, 233, 247) 100%);
    }

    .ds-accordion__head {
      max-width: 720px;
      margin: 0 auto clamp(40px, 5vw, 56px);
      text-align: center;
    }

    .ds-accordion__title {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(32px, 4.5vw, 56px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.01em;
      color: #0D2545;
    }

    .ds-accordion__lede {
      margin: 16px 0 0;
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.7;
      color: rgb(61, 106, 149);
    }

    .ds-accordion .ds-mty-section__eyebrow {
      color: rgba(44, 72, 113, 0.6);
    }

    .ds-accordion__stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-width: 820px;
      margin: 0 auto;
    }

    .ds-accordion-item {
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(44, 72, 113, 0.1);
      box-shadow: 0 8px 32px rgba(44, 72, 113, 0.06);
    }

    .ds-accordion-details {
      margin: 0;
    }

    .ds-accordion-header {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: clamp(18px, 2.5vw, 22px) clamp(22px, 3vw, 28px);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: rgb(44, 72, 113);
      -webkit-tap-highlight-color: transparent;
    }

    .ds-accordion-header::-webkit-details-marker {
      display: none;
    }

    .ds-accordion-header__label {
      text-align: left;
      flex: 1;
      min-width: 0;
    }

    .ds-accordion-icon {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      position: relative;
      border-radius: 50%;
      border: 1px solid rgba(44, 72, 113, 0.28);
      background: transparent;
    }

    .ds-accordion-icon::before,
    .ds-accordion-icon::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      background: rgb(44, 72, 113);
      border-radius: 1px;
      transform: translate(-50%, -50%);
      transition: transform 0.25s ease;
    }

    .ds-accordion-icon::before {
      width: 10px;
      height: 2px;
    }

    .ds-accordion-icon::after {
      width: 2px;
      height: 10px;
    }

    .ds-accordion-details[open] > .ds-accordion-header .ds-accordion-icon::after {
      transform: translate(-50%, -50%) scaleY(0);
    }

    .ds-accordion-content {
      padding: 0 clamp(22px, 3vw, 28px) clamp(20px, 2.5vw, 26px);
      overflow: hidden;
      border-top: 1px solid rgba(44, 72, 113, 0.1);
    }

    .ds-accordion-content__inner {
      padding-top: clamp(14px, 2vw, 18px);
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.7;
      color: rgb(61, 106, 149);
    }

    .ds-accordion-content__inner ::ng-deep p {
      margin: 0 0 14px;
    }

    .ds-accordion-content__inner ::ng-deep strong {
      color: #0D2545;
      font-weight: 700;
    }

    .ds-accordion-content__inner ::ng-deep ul {
      margin: 0;
      padding: 0 0 0 1.1rem;
    }

    .ds-accordion-content__inner ::ng-deep li {
      margin: 0 0 12px;
      padding-inline-start: 4px;
    }

    .ds-accordion-content__inner ::ng-deep a {
      color: #0D2545;
      text-decoration: none;
      border-bottom: 1px solid rgba(44, 72, 113, 0.35);
      font-weight: 700;
    }

    .ds-accordion-content__inner ::ng-deep img.ds-accordion-menu-image {
      display: block;
      width: 100%;
      max-width: 420px;
      height: auto;
      margin: 0 auto;
      border-radius: var(--ds-radius-md);
      box-shadow: 0 12px 32px rgba(44, 72, 113, 0.14);
    }

    @media (max-width: 991px) {
      :host {
        margin-top: -68px;
      }

      .ds-shell,
      .ds-mty-shell {
        width: min(100% - 24px, 1000px);
      }

      #mty-booking.ds-mty-booking > .ds-shell {
        width: 100%;
      }

      .ds-mty-hero__content {
        padding-top: 118px;
      }

      .ds-mty-section__title {
        font-size: clamp(40px, 10vw, 64px);
      }
    }

    @media (max-width: 768px) {
      #mty-booking .ds-mty-booking__panel {
        min-width: 0;
      }

      #mty-booking .ds-mty-checkout-app,
      #mty-booking .ds-mty-turitop-mount {
        min-width: 0;
        max-width: 100%;
      }

      .ds-mty-turitop-mount.entry-content {
        max-width: 100%;
      }

      #mty-booking .turitop-mobile-shell {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        margin: 0;
        padding: 0 0 max(32px, env(safe-area-inset-bottom, 0px));
        box-sizing: border-box;
      }

      #mty-booking .turitop-mobile-shell .turitop_bswp_button_box_wrap {
        width: 100%;
        max-width: none;
        min-width: 0;
        margin: 0;
        box-sizing: border-box;
        overflow-x: visible;
      }

      #mty-booking .turitop-mobile-shell .iframe-resizable-turitop {
        width: 100%;
        max-width: none;
        min-width: 0;
        margin: 0;
        box-sizing: border-box;
      }

      #mty-booking.ds-mty-booking {
        padding-bottom: max(clamp(56px, 14vw, 120px), env(safe-area-inset-bottom, 0px));
      }

    }

    @media (max-width: 640px) {
      .ds-mty-hero {
        height: 76svh;
        height: 76dvh;
        min-height: 76svh;
        min-height: 76dvh;
      }

      .ds-mty-hero__media img {
        object-position: center center;
      }

      .ds-mty-highlight {
        padding: 60px 0;
      }

      .ds-mty-highlight__media {
        aspect-ratio: 4 / 5;
        border-radius: 24px;
      }

      .ds-mty-highlight__content {
        right: clamp(16px, 4vw, 24px);
        left: clamp(16px, 4vw, 24px);
        max-width: none;
      }

      .ds-mty-highlight .ds-mty-sub {
        font-size: 15px;
      }

      .ds-mty-editorial {
        padding: 10px 0;
      }

      .booking-offer {
        max-width: 100%;
        gap: 14px;
      }

      .booking-offer__visual {
        width: 100%;
        border-radius: 12px;
      }

      .booking-offer__visual img {
        max-height: none;
        width: 100%;
      }

      .ds-city-price-logo img {
        width: min(100%, 342px);
      }

      .ds-city-gallery {
        gap: 6px;
      }

      .ds-city-gallery__item {
        border-radius: 8px;
      }

      .ds-mty-section__copy {
        font-size: 16px;
        line-height: 1.7;
      }

      .ds-mty-features__list {
        grid-template-columns: 1fr;
      }

      .booking-offer__main .currency {
        font-size: 22px;
      }

      .booking-offer__main .amount {
        font-size: 44px;
      }

      .booking-offer__main .mxn {
        font-size: 18px;
      }

      #mty-booking .ds-mty-booking__panel {
        padding: 18px;
        border-radius: 24px;
      }

      #mty-booking .ds-mty-turitop-mount .turitop_bswp_button_box_wrap {
        padding: 0;
        border-radius: 18px;
      }

      #mty-booking .ds-mty-turitop-mount iframe.iframe-resizable-turitop {
        min-height: 620px;
        border-radius: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ds-mty-hero__media img,
      .ds-mty-highlight__media img {
        transform: none;
      }

      .ds-mty-hero__content--hermosillo {
        animation: none;
      }
    }
  `]
})
export class CityComponent implements OnInit {
  city?: City;
  turitopUrl?: SafeResourceUrl;
  showMenu = false;
  showSede = false;

  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);
  private analyticsService = inject(AnalyticsService);
  private sanitizer = inject(DomSanitizer);
  whatsappUrl = this.contentService.getWhatsappUrl();
  private checkoutTracked = false;

  ngOnInit(): void {
    const slug = this.route.snapshot.url[0]?.path || '';
    const city = this.contentService.getCityBySlug(slug);

    if (!city) {
      return;
    }

    this.city = city;
    this.metaService.setCity(city.name, city.slug);
    this.metaService.setStructuredData([
      this.metaService.buildProductSchema(city),
      this.metaService.buildBreadcrumbSchema([
        { name: 'Inicio', path: '' },
        { name: city.name, path: city.slug }
      ])
    ]);
    this.analyticsService.trackViewContent(city);

    if (city.turitopService) {
      const bookingUrl = `https://app.turitop.com/booking/box/${TURITOP_COMPANY}/${city.turitopService}/es`;
      this.turitopUrl = this.sanitizer.bypassSecurityTrustResourceUrl(bookingUrl);
    }
  }

  /** Fired by the TuriTop iframe's (load) event — the closest available
   * signal to "the visitor actually reached the booking widget", since the
   * booking flow itself runs inside TuriTop's cross-origin iframe where we
   * can't observe individual steps. */
  onBookingWidgetLoaded(): void {
    if (this.checkoutTracked || !this.city) return;
    this.checkoutTracked = true;
    this.analyticsService.trackInitiateCheckout(this.city);
  }

  get highlightSub(): string {
    switch (this.city?.id) {
      case 'puebla':
        return 'Cielos, atardeceres y magia desde las alturas.';
      case 'ensenada':
        return 'Cena, vinos seleccionados y vistas espectaculares.';
      case 'mexico-city':
        return 'Sede en la capital: energía urbana, servicio premium y una mesa en las alturas.';
      case 'hermosillo':
        return 'Del 12 al 29 de noviembre 2026: Sonora se eleva por primera vez.';
      default:
        return this.city?.subtitle || '';
    }
  }

  get editorialCopy(): string {
    switch (this.city?.id) {
      case 'puebla':
        return 'Puebla se vive distinto cuando te elevas sobre ella. Dinner in the Sky te invita a descubrir sus cielos, sus atardeceres y su magia desde las alturas, en una experiencia íntima, emocionante e inolvidable.';
      case 'ensenada':
        return 'Eleva tus sentidos a 45 metros de altura con una cena de tres tiempos, vinos seleccionados y vistas espectaculares del valle más icónico de México.';
      case 'mexico-city':
        return 'Con el horizonte de la ciudad como telón de fondo, vive una experiencia extraordinaria creada con la esencia y la calidad de Dinner in the Sky.';
      case 'hermosillo':
        return 'Por primera vez en Sonora, Dinner in the Sky llega a Hermosillo con la misma esencia y calidad que ya se vive en el resto de México: gastronomía de autor, servicio de hospitality y una vista que convierte cualquier ocasión en un hito, a 45 metros de altura.';
      default:
        return this.city?.longDescription || this.city?.description || '';
    }
  }

  get bookingCopy(): string {
    if (this.city?.id === 'mexico-city') {
      return 'La mejor época para regalar experiencias que se recordarán para siempre. Dinner in the Sky regresa en Navidad a CDMX. Temporada limitada.';
    }

    if (this.city?.id === 'hermosillo') {
      return 'Sonora se prepara para volar. Cupo limitado a 22 personas por vuelo — el calendario de reservas se activa muy pronto.';
    }

    return 'Elige día y horario en el calendario oficial; la disponibilidad se actualiza al momento.';
  }

  /** No city page shows a booking-offer visual in production; kept as a hook, always empty. */
  get bookingVisualImage(): string {
    return '';
  }

  get bookingVisualAlt(): string {
    return `Dinner in the Sky ${this.city?.name || ''}`;
  }

  /** Single promo image shown in .ds-city-price-logo, matched 1:1 to production per city. */
  get cityVisualLogo(): CityVisualAsset | undefined {
    switch (this.city?.id) {
      case 'puebla':
        return { src: 'assets/images/city/puebla-flyer.webp', alt: 'Dinner in the Sky Puebla' };
      case 'ensenada':
        return { src: 'assets/images/city/ensenada-flyer.webp', alt: 'Dinner in the Sky Ensenada' };
      case 'mexico-city':
        return { src: 'assets/images/city/cdmx-flyer.webp', alt: 'Dinner in the Sky Ciudad de México' };
      // Hermosillo no usa flyer — el hero (.ds-mty-hero__content--hermosillo)
      // lleva su propio mensaje de venta con fechas y CTA.
      default:
        return undefined;
    }
  }

  /** Menú image shown behind the "Checa el menú." toggle button, when available. */
  get cityMenuImage(): CityVisualAsset | undefined {
    switch (this.city?.id) {
      case 'ensenada':
        return { src: 'assets/images/city/ensenada-menu.webp', alt: 'Menú Dinner in the Sky Ensenada 2026' };
      default:
        return undefined;
    }
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  toggleSede(): void {
    this.showSede = !this.showSede;
  }

  /** "Checa la sede." toggle content — only Ensenada has a confirmed venue writeup today. */
  get citySedeInfo(): string | undefined {
    return this.city?.id === 'ensenada' ? this.venueAccordionContent : undefined;
  }

  /** Production galleries: 3 photos for Puebla/Ensenada, none for CDMX. */
  get cityGallery(): CityVisualAsset[] {
    switch (this.city?.id) {
      case 'puebla':
        return [
          { src: 'assets/images/city/puebla-gallery-1.webp', alt: 'Dinner in the Sky Puebla' },
          { src: 'assets/images/city/puebla-gallery-2.webp', alt: 'Dinner in the Sky Puebla' },
          { src: 'assets/images/city/puebla-gallery-3.webp', alt: 'Dinner in the Sky Puebla' }
        ];
      case 'ensenada':
        return [
          { src: 'assets/images/city/ensenada-gallery-1.webp', alt: 'Dinner in the Sky Ensenada' },
          { src: 'assets/images/city/ensenada-gallery-2.webp', alt: 'Dinner in the Sky Ensenada' },
          { src: 'assets/images/city/ensenada-gallery-3.webp', alt: 'Dinner in the Sky Ensenada' }
        ];
      default:
        return [];
    }
  }

  get accordionPanels(): AccordionPanel[] {
    return [
      {
        id: 'terminos',
        label: 'Lee los términos y condiciones',
        content: '<p>Consulta condiciones de compra, cancelación y uso del servicio antes de completar tu reserva.</p><p><a href="/faq">Ir a términos y condiciones</a></p>'
      },
      // Ensenada now shows its menú via the "Checa el menú." toggle button
      // higher up on the page (see cityMenuImage) instead of this panel.
      ...(this.city?.id === 'ensenada' ? [] : [{
        id: 'menu',
        label: 'Menú',
        content: this.menuAccordionContent
      }]),
      // Ensenada now shows its sede via the "Checa la sede." toggle button
      // higher up on the page (see citySedeInfo) instead of this panel.
      ...(this.city?.id === 'ensenada' ? [] : [{
        id: 'sede',
        label: 'Sede',
        content: this.venueAccordionContent
      }]),
      {
        id: 'faq',
        label: 'Preguntas frecuentes',
        content: '<p>No todos se atreven.</p><p>Pero todos preguntan.</p><p>Aquí tienes lo que necesitas saber antes de subir:</p><ul><li><strong>¿Es seguro?</strong> Sí. Operamos bajo los más altos estándares internacionales, con equipo certificado y personal especializado.</li><li><strong>¿A qué altura es la experiencia?</strong> Aproximadamente 45 metros. Lo suficiente para cambiar tu perspectiva.</li><li><strong>¿Cuánto dura?</strong> Alrededor de 60 minutos en el aire. Un recuerdo para siempre.</li><li><strong>¿Cuántas personas suben?</strong> 22 invitados por experiencia. No hay multitudes. Hay momentos.</li><li><strong>¿Edad mínima?</strong> A partir de 6 años, acompañados de un adulto.</li><li><strong>¿Hay límite de peso?</strong> Sí. El límite es de 130 kg por persona. La seguridad no se negocia.</li><li><strong>¿Qué pasa si llueve o hay mal clima?</strong> La seguridad es primero. Podemos reprogramar si las condiciones no son adecuadas.</li></ul>'
      },
      {
        id: 'contacto',
        label: 'Contacto',
        content: this.contactAccordionContent
      }
    ];
  }

  private get contactAccordionContent(): string {
    const intro = '<p>Estamos para ayudarte con fechas, grupos y dudas sobre tu reserva.</p>';

    if (!this.whatsappUrl) {
      return intro;
    }

    return `${intro}<p><a href="${this.whatsappUrl}" target="_blank" rel="noopener noreferrer">Contáctanos por WhatsApp</a></p>`;
  }

  private get menuAccordionContent(): string {
    if (this.city?.id === 'ensenada') {
      return '<img class="ds-accordion-menu-image" src="assets/images/city/ensenada-menu.webp" alt="Menú Dinner in the Sky Ensenada 2026" loading="lazy" decoding="async">';
    }

    if (this.city?.id === 'puebla') {
      return '<p>El menú de la experiencia será informado antes del evento. La experiencia contempla una propuesta gastronómica de tres tiempos, diseñada para disfrutarse en las alturas.</p>';
    }

    return '<p>El menú de la experiencia contempla una propuesta gastronómica de tres tiempos cuidadosamente diseñada para disfrutarse en las alturas, acompañada de bebidas incluidas que complementan cada momento de la experiencia.</p><p>¿Eres vegetariano?</p><p>También tenemos opciones especiales para ti.</p>';
  }

  private get venueAccordionContent(): string {
    switch (this.city?.id) {
      case 'ensenada':
        return '<h4>Sede oficial Ensenada 2026</h4><p><strong>Hacienda Montero, Valle de Guadalupe</strong></p><p>Dinner in the Sky llega por única vez a Ensenada del 14 al 30 de agosto, y nuestra sede oficial será Hacienda Montero, un espacio rodeado de viñedos, naturaleza y una vista privilegiada del Valle de Guadalupe.</p><p>Elegimos Hacienda Montero por su encanto, amplitud y ambiente ideal para vivir una experiencia gastronómica única en las alturas.</p>';
      case 'puebla':
        return '<p>Sede oficial por confirmar. Te recomendamos revisar los detalles antes de completar tu reserva.</p>';
      case 'mexico-city':
        return '<p>Sede oficial Ciudad de México 2026. Te recomendamos revisar los detalles finales de ubicación antes de completar tu reserva.</p>';
      default:
        return '<p>Sede oficial por confirmar. Te recomendamos revisar los detalles antes de completar tu reserva.</p>';
    }
  }
}
