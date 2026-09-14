import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { Social } from '../models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-container">
        <div class="footer-inner">
          <!-- Social Links -->
          <nav class="footer-social" aria-label="Redes sociales">
            @for (social of socialLinks; track social.platform) {
              <a
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="social.label"
                class="footer-social-link"
              >
                <img [src]="social.icon" [alt]="social.label" class="footer-icon" width="34" height="34" />
              </a>
            }
          </nav>

          <!-- Divider -->
          <div class="footer-divider" aria-hidden="true"></div>

          <!-- Copyright -->
          <p class="footer-copy">{{ footerData.copyright || '© ' + currentYear + ' DITS MEXICO' }}</p>

          <!-- Developer credit -->
          <a class="footer-credit" href="https://byteboost.cl/" target="_blank" rel="noopener noreferrer">
            <span>Desarrollado por</span>
            <img src="assets/logos/byteboost-logo.webp" alt="ByteBoost" class="footer-credit-logo" width="178" height="56" />
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .footer {
      background-color: rgb(31, 78, 163);
      color: rgba(255, 255, 255, 0.9);
      padding: 0 0 40px;
    }

    .footer-container {
      width: 100%;
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 50px 20px 30px;
      text-align: center;
    }

    .footer-social {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin: 0 0 24px;
    }

    .footer-social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      text-decoration: none;
      transition: opacity 0.3s ease, transform 0.3s ease;

      &:hover {
        opacity: 0.85;
        transform: translateY(-2px);
      }
    }

    .footer-icon {
      width: 34px;
      height: 34px;
      object-fit: contain;
    }

    .footer-divider {
      width: 40px;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.3);
      margin: 16px auto 18px;
    }

    .footer-copy {
      font-size: 13px;
      font-weight: 300;
      line-height: 1.65;
      letter-spacing: 0.26px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin: 0;
    }

    .footer-credit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 16px auto 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.85;
      }
    }

    .footer-credit-logo {
      height: 56px;
      width: auto;
      object-fit: contain;
    }

    @media (max-width: 768px) {
      .footer-credit-logo {
        height: 32px;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  socialLinks: Social[] = [];
  footerData: any = {};
  currentYear = new Date().getFullYear();

  private contentService = inject(ContentService);

  ngOnInit() {
    this.socialLinks = this.contentService.getSocialLinks();
    this.footerData = this.contentService.getFooterText();
  }
}
