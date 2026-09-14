import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main class="main-content" role="main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      @if (showWhatsappButton) {
        <a
          class="whatsapp-button"
          [href]="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          [attr.aria-label]="whatsappLabel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="boton-whatsapp" width="48" height="48" viewBox="0 0 448 512" role="img" aria-hidden="true">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
    }

    .whatsapp-button {
      position: fixed;
      right: max(20px, env(safe-area-inset-right, 0px));
      bottom: max(28px, env(safe-area-inset-bottom, 0px));
      z-index: 9990;
      width: 66px;
      height: 66px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      padding: 0;
      margin: 0;
      text-align: center;
      text-decoration: none;
      background: linear-gradient(160deg, #3ef584 0%, #25d366 45%, #1ebe5b 100%);
      border: 3px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 8px 28px rgba(37, 211, 102, 0.55), 0 4px 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
      transition: transform 0.35s ease;
    }

    .whatsapp-button:hover {
      transform: scale(1.07);
    }

    .whatsapp-button::before {
      content: '';
      position: absolute;
      top: -10px;
      right: -10px;
      bottom: -10px;
      left: -10px;
      border-radius: 50%;
      border: 2px solid rgba(37, 211, 102, 0.55);
      animation: pr-wa-ring 2.2s ease-out infinite;
      pointer-events: none;
      opacity: 0.4;
      will-change: transform;
    }

    .whatsapp-button::after {
      content: '¿ Tienes dudas?';
      position: absolute;
      right: 78px;
      top: 50%;
      transform: translateY(-50%);
      background: #0d2545;
      color: #ffffff;
      font-family: "Montserrat", system-ui, sans-serif;
      font-size: 0.7rem;
      white-space: nowrap;
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .whatsapp-button:hover::after {
      opacity: 1;
    }

    .boton-whatsapp {
      display: block;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      overflow: visible;
    }

    .boton-whatsapp path {
      fill: #ffffff;
    }

    @keyframes pr-wa-ring {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      70% {
        transform: scale(1.18);
        opacity: 0;
      }
      100% {
        transform: scale(1.18);
        opacity: 0;
      }
    }

    @media (max-width: 767px) {
      .whatsapp-button::after {
        display: none;
      }
    }
  `]
})
export class LayoutComponent {
  private contentService = inject(ContentService);
  private router = inject(Router);
  private footerData = this.contentService.getFooterText();

  whatsappUrl = this.contentService.getWhatsappUrl();
  whatsappLabel = this.footerData.whatsappLabel || 'Envíame un whatsapp';
  showWhatsappButton = false;

  constructor() {
    this.updateWhatsappVisibility(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.updateWhatsappVisibility(event.urlAfterRedirects));
  }

  private updateWhatsappVisibility(url: string): void {
    this.showWhatsappButton = Boolean(this.whatsappUrl) && !url.startsWith('/hermosillo');
  }
}
