import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';
import { MenuItem, City } from '../models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-container">
          <a routerLink="/" class="logo" aria-label="Dinner In The Sky Home">
            <img src="assets/images/logo-dits.webp" alt="Dinner In The Sky Logo" width="188" height="68" />
          </a>

          <div class="nav-menu" [class.active]="mobileMenuOpen" [attr.aria-hidden]="!mobileMenuOpen">
            <div class="nav-drawer-shell">
              <div class="nav-drawer-body">
                <ul class="nav-links" role="list">
                  @for (item of menuItems; track item.label) {
                    <li class="nav-item">
                      @if (item.submenu) {
                        <button
                          class="nav-link dropdown-toggle"
                          (click)="toggleSubmenu()"
                          [attr.aria-expanded]="submenuOpen"
                          [attr.aria-controls]="'header-cities-submenu'"
                          aria-haspopup="true"
                        >
                          {{ item.label }}
                          <span class="arrow">›</span>
                        </button>
                        @if (submenuOpen) {
                          <ul class="submenu" id="header-cities-submenu" role="menu">
                            @for (subitem of cities; track subitem.id) {
                              <li role="menuitem">
                                @if (subitem.externalUrl) {
                                  <a
                                    [href]="subitem.externalUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="submenu-link"
                                    (click)="closeMenus()"
                                  >
                                    {{ subitem.name }} - {{ subitem.dates }}
                                  </a>
                                } @else {
                                  <a
                                    [routerLink]="'/' + subitem.slug"
                                    class="submenu-link"
                                    (click)="closeMenus()"
                                  >
                                    {{ subitem.name }} - {{ subitem.dates }}
                                  </a>
                                }
                              </li>
                            }
                          </ul>
                        }
                      } @else if (item.link) {
                        <a
                          [href]="item.link"
                          class="nav-link"
                          [attr.target]="item.external ? '_blank' : null"
                          [attr.rel]="item.external ? 'noopener noreferrer' : null"
                          (click)="closeMenus()"
                        >
                          {{ item.label }}
                        </a>
                      } @else if (item.modal) {
                        <button type="button" class="nav-link" (click)="openEventsModal()">
                          {{ item.label }}
                        </button>
                      } @else if (item.anchor) {
                        <a [href]="'#' + item.anchor" class="nav-link" (click)="closeMenus()">
                          {{ item.label }}
                        </a>
                      }
                    </li>
                  }
                </ul>
              </div>

              <div class="nav-drawer-footer">
                <button class="nav-link nav-link--reserve" (click)="navigateToExperience()">
                  Comprar boletos
                </button>
              </div>
            </div>
          </div>

          <button
            class="nav-backdrop"
            [class.active]="mobileMenuOpen"
            (click)="closeMenus()"
            aria-hidden="true"
            tabindex="-1"
          ></button>

          <div class="header-actions">
            <button
              class="btn btn-primary btn-small"
              (click)="navigateToExperience()"
              aria-label="Comprar boletos"
            >
              Comprar boletos
            </button>
          </div>

          <button
            class="mobile-toggle"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    @if (eventsModalOpen) {
      <div class="events-modal-backdrop" (click)="closeEventsModal()">
        <div
          class="events-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="events-modal-title"
          (click)="$event.stopPropagation()"
        >
          <button
            type="button"
            class="events-modal__close"
            (click)="closeEventsModal()"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span>Cerrar</span>
          </button>

          <div class="events-modal__media">
            <img
              src="assets/images/eventos/eventos-marcas-corporativos.webp"
              alt="Eventos privados de marca en las alturas con Dinner in the Sky México"
              width="960"
              height="695"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="events-modal__body">
            <p class="events-modal__eyebrow">Eventos para marcas y corporativos</p>
            <h2 class="events-modal__title" id="events-modal-title">Eleva tus eventos de marca y empresas a 45 metros de altura.</h2>
            <p class="events-modal__copy">
              Activaciones, lanzamientos y experiencias corporativas a 45 metros de altura. Un formato que ninguna marca ha visto antes, coordinado de principio a fin por nuestro equipo.
            </p>
            <a
              class="events-modal__cta"
              [href]="whatsappUrl || '#eventos'"
              [attr.target]="whatsappUrl ? '_blank' : null"
              [attr.rel]="whatsappUrl ? 'noopener noreferrer' : null"
              (click)="closeEventsModal()"
            >
              Cotizar evento por WhatsApp
            </a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 1px 0 rgba(13, 37, 69, 0.08), 0 2px 12px rgba(13, 37, 69, 0.06);
      transition: box-shadow 0.3s ease-in-out, background 0.3s ease-in-out;

      &.scrolled {
        box-shadow: 0 2px 16px rgba(13, 37, 69, 0.12);
      }

      @media (max-width: 768px) {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
    }

    .navbar {
      padding: 0 clamp(20px, 4vw, 48px);

      @media (max-width: 768px) {
        padding: 0 16px;
      }
    }

    .navbar-container {
      max-width: 1440px;
      margin: 0 auto;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      position: relative;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
      z-index: 2;

      img {
        max-height: 34px;
        width: auto;
        opacity: 0.96;
      }

      &:hover {
        opacity: 0.9;
      }
    }

    .nav-menu {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      min-width: 0;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: clamp(8px, 2.8vw, 38px);
      flex: 1;
      justify-content: center;
      margin: 0;
      padding: 0;
      align-items: center;
      min-width: 0;
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      position: relative;
      color: #111111;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
      transition: color 0.25s ease, background 0.25s ease, transform 0.25s ease;
      appearance: none;
      -webkit-appearance: none;
      background: none;
      border: none;
      border-radius: 0;
      box-shadow: none;
      cursor: pointer;
      padding: 8px 2px;
      display: flex;
      align-items: center;
      gap: 6px;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 2px;
        width: 100%;
        height: 2px;
        background: #c9a24b;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
        transition: transform 0.25s ease;
      }

      &:hover {
        color: #000000;

        &::after {
          transform: translateX(-50%) scaleX(1);
        }
      }
    }

    .dropdown-toggle {
      &:hover .arrow {
        color: #082848;
      }
    }

    .arrow {
      transition: color 0.3s ease;
      display: none;
    }

    .submenu {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #ffffff;
      border: 1px solid rgba(13, 53, 112, 0.15);
      border-radius: 8px;
      min-width: 200px;
      list-style: none;
      margin: 8px 0 0 0;
      padding: 12px 0;
      box-shadow: 0 8px 24px rgba(13, 37, 69, 0.15);
    }

    .submenu-link {
      display: block;
      padding: 12px 20px;
      color: #0d3570;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(13, 53, 112, 0.08);
        color: #082848;
      }
    }

    .nav-drawer-shell {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      max-width: 28rem;
      margin-inline: auto;
      box-sizing: border-box;
    }

    .nav-drawer-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }

    .nav-drawer-footer {
      display: none;
    }

    .nav-backdrop {
      display: none;
      position: fixed;
      top: 68px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10058;
      background: rgba(15, 42, 68, 0.22);
      border: 0;
      padding: 0;
      margin: 0;
      appearance: none;
      -webkit-tap-highlight-color: transparent;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-shrink: 0;
      z-index: 2;
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      flex-direction: column;
      gap: 6px;
      padding: 0;
      z-index: 2;

      span {
        width: 24px;
        height: 3px;
        background-color: #111111;
        border-radius: 2px;
        transition: all 0.3s ease;
      }
    }

    .mobile-toggle[aria-expanded="true"] span {
      &:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
      }
    }

    .header-actions .btn-primary {
      background: #c9a24b;
      color: #171310;
      border: none;
      box-shadow: none;
      padding: 13px 28px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      white-space: nowrap;
      border-radius: 999px;

      &:hover {
        background: #b8913f;
        box-shadow: none;
      }
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 68px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10059;
        justify-content: stretch;
        align-items: stretch;
        padding: 0;
        background: #ffffff;
        box-shadow: 0 12px 48px rgba(30, 42, 61, 0.08);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateY(-12px);
        transition:
          opacity 0.4s ease,
          visibility 0.4s ease,
          transform 0.45s ease;
        height: calc(100dvh - 68px);
        min-height: 0;
      }

      .nav-menu.active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0);
      }

      .nav-drawer-shell {
        padding: 16px clamp(14px, 4vw, 20px) max(20px, env(safe-area-inset-bottom, 0px));
      }

      .nav-drawer-body {
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 0.35rem;
      }

      .nav-links {
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0;
        width: 100%;
      }

      .nav-links > .nav-item {
        opacity: 0;
        transform: translateY(10px);
        transition:
          opacity 0.4s ease,
          transform 0.45s ease;
        border-bottom: 1px solid rgba(15, 42, 68, 0.08);
      }

      .nav-links > .nav-item:last-child {
        border-bottom: 0;
      }

      .nav-menu.active .nav-links > .nav-item {
        opacity: 1;
        transform: translateY(0);
      }

      .nav-menu.active .nav-links > .nav-item:nth-child(1) { transition-delay: 0.05s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(2) { transition-delay: 0.09s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(3) { transition-delay: 0.13s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(4) { transition-delay: 0.17s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(5) { transition-delay: 0.21s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(6) { transition-delay: 0.25s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(7) { transition-delay: 0.29s; }
      .nav-menu.active .nav-links > .nav-item:nth-child(8) { transition-delay: 0.33s; }

      .nav-link {
        width: 100%;
        justify-content: space-between;
        padding: 10px 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.3;
        text-align: left;
        border-left: 3px solid transparent;

        &::after {
          display: none;
        }
      }

      .arrow {
        display: inline-flex;
        font-size: 16px;
        opacity: 0.45;
        transform: translateY(-1px);
        transition: transform 0.2s ease;
      }

      .dropdown-toggle[aria-expanded="true"] .arrow {
        transform: translateY(-1px) rotate(90deg);
      }

      .submenu {
        position: static;
        background-color: transparent;
        border: none;
        box-shadow: none;
        margin: 0;
        padding: 0 0 10px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .submenu-link {
        padding: 7px 0 7px 6px;
        font-size: 0.97rem;
        font-weight: 500;
        color: #0f2a44;
        border-bottom: 1px solid rgba(15, 42, 68, 0.06);
      }

      .nav-drawer-footer {
        display: block;
        margin-top: auto;
        padding-top: 0.625rem;
        border-top: 1px solid rgba(15, 42, 68, 0.08);
        opacity: 0;
        transform: translateY(14px);
        transition:
          opacity 0.4s ease,
          transform 0.45s ease;
      }

      .nav-menu.active .nav-drawer-footer {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.32s;
      }

      .nav-link--reserve {
        width: 100%;
        justify-content: center;
        border-radius: 999px;
        padding: 12px 18px;
        min-height: 56px;
        background: #c9a24b;
        color: #171310;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;

        &:hover {
          color: #171310;
          background: #b8913f;
        }
      }

      .nav-backdrop.active {
        display: block;
      }

      .mobile-toggle {
        display: flex;
      }

      .logo img {
        max-height: 26px;
      }

      .header-actions .btn-primary {
        padding: 10px 18px;
        font-size: 10.5px;
        letter-spacing: 0.08em;
      }
    }

    /* Events modal — visual language matches the "Eventos" section on the
       home page (navy headings, blue CTA, Segoe UI/Montserrat, pill button,
       rounded media). */
    .events-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 20000;
      background: rgba(13, 37, 69, 0.6);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: events-modal-fade 0.2s ease;
    }

    .events-modal {
      position: relative;
      width: min(100%, 560px);
      max-height: min(92vh, 780px);
      overflow-y: auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 24px 80px rgba(13, 37, 69, 0.35);
      animation: events-modal-rise 0.25s ease;
    }

    .events-modal__close {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #ffffff;
      color: #0D2545;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
      border: 1.5px solid rgba(13, 37, 69, 0.15);
      border-radius: 999px;
      padding: 9px 18px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(13, 37, 69, 0.2);
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }

    .events-modal__close:hover {
      background: #0D2545;
      color: #ffffff;
      border-color: #0D2545;
    }

    .events-modal__media {
      width: 100%;
      aspect-ratio: 960 / 695;
      overflow: hidden;
      border-radius: 20px 20px 0 0;
      background: #BBDEFB;
    }

    .events-modal__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .events-modal__body {
      padding: 28px 28px 32px;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    }

    .events-modal__eyebrow {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #1E63C6;
    }

    .events-modal__title {
      margin: 0 0 12px;
      font-size: 26px;
      line-height: 1.25;
      font-weight: 700;
      color: #0D2545;
    }

    .events-modal__copy {
      margin: 0 0 24px;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.6;
      color: #3D6A95;
    }

    .events-modal__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background: #1E63C6;
      color: #fff;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.3px;
      padding: 15px 28px;
      border-radius: 50px;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(30, 99, 198, 0.25);
      transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    }

    .events-modal__cta:hover {
      background: #2F7BE5;
      transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(30, 99, 198, 0.3);
    }

    @keyframes events-modal-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes events-modal-rise {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 480px) {
      .events-modal__body {
        padding: 22px 20px 26px;
      }

      .events-modal__title {
        font-size: 22px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  menuItems: MenuItem[] = [];
  cities: City[] = [];
  isScrolled = false;
  mobileMenuOpen = false;
  submenuOpen = false;
  eventsModalOpen = false;
  whatsappUrl = '';
  private lockedScrollY = 0;

  private contentService = inject(ContentService);

  ngOnInit() {
    this.whatsappUrl = this.contentService.getWhatsappUrl();
    this.menuItems = [
      { label: 'La Experiencia', anchor: 'experiencia' },
      { label: 'Ciudades', submenu: [] },
      { label: 'Eventos', modal: true },
      { label: 'La Historia', anchor: 'historia' },
      { label: 'Preguntas frecuentes', link: '/faq' },
      { label: 'Seguridad', anchor: 'seguridad' },
      this.whatsappUrl
        ? { label: 'Contacto', link: this.whatsappUrl, external: true }
        : { label: 'Contacto', anchor: 'contacto' }
    ];

    this.contentService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.eventsModalOpen) {
      this.closeEventsModal();
    }
  }

  openEventsModal() {
    this.closeMenus();
    this.eventsModalOpen = true;
    this.lockBodyScroll();
  }

  closeEventsModal() {
    this.eventsModalOpen = false;
    this.unlockBodyScroll();
  }

  toggleMobileMenu() {
    const nextOpen = !this.mobileMenuOpen;
    this.mobileMenuOpen = nextOpen;

    if (nextOpen) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
      this.submenuOpen = false;
    }
  }

  toggleSubmenu() {
    // Desktop nav has no dropdown — "Ciudades y fechas" just scrolls to
    // the cities section. The expandable submenu only exists inside the
    // mobile drawer.
    if (window.innerWidth > 768) {
      this.navigateToExperience();
      return;
    }
    this.submenuOpen = !this.submenuOpen;
  }

  closeMenus() {
    this.mobileMenuOpen = false;
    this.submenuOpen = false;
    this.unlockBodyScroll();
  }

  navigateToExperience() {
    const section = document.getElementById('ciudades');
    this.closeMenus();

    if (section) {
      requestAnimationFrame(() => section.scrollIntoView({ behavior: 'smooth' }));
    }
  }

  private lockBodyScroll() {
    this.lockedScrollY = window.scrollY || 0;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
  }

  private unlockBodyScroll() {
    if (document.body.style.overflow === '' && document.documentElement.style.overflow === '') {
      return;
    }

    const scrollY = this.lockedScrollY;
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.scrollBehavior = '';
    window.scrollTo(0, scrollY);
  }
}
