import { Component, OnInit, PLATFORM_ID, Renderer2, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../services/meta.service';

/**
 * TuriTop's booking widget must be configured (in TuriTop → Compañía →
 * Componentes/Integraciones → Generador de código de página de
 * agradecimiento personalizada) to redirect here after a successful
 * booking. That generator produces a ready-to-paste script that fires the
 * Meta "Purchase" event with the real order value/currency — paste it
 * below exactly as TuriTop gives it to you. Nothing fires until this is
 * filled in; this site cannot fabricate a Purchase event on its own since
 * the payment itself happens inside TuriTop's cross-origin iframe.
 */
const TURITOP_THANK_YOU_SCRIPT = '';

@Component({
  selector: 'app-gracias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="gracias">
      <div class="gracias__card">
        <div class="gracias__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 class="gracias__title">¡Gracias! Tu reserva quedó confirmada.</h1>
        <p class="gracias__copy">
          En breve recibirás la confirmación con los detalles de tu experiencia Dinner in the Sky. Si tienes alguna duda, escríbenos por WhatsApp.
        </p>
        <a routerLink="/" class="gracias__cta">Volver al inicio</a>
      </div>
    </section>
  `,
  styles: [`
    .gracias {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 64px 20px;
      background: #f6f9ff;
    }

    .gracias__card {
      max-width: 520px;
      text-align: center;
      background: #ffffff;
      border-radius: 24px;
      padding: 48px 36px;
      box-shadow: 0 24px 80px rgba(13, 37, 69, 0.1);
    }

    .gracias__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(30, 99, 198, 0.1);
      color: #1E63C6;
      margin: 0 auto 20px;
    }

    .gracias__title {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-size: 28px;
      font-weight: 800;
      line-height: 1.25;
      color: #0D2545;
      margin: 0 0 14px;
    }

    .gracias__copy {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.6;
      color: #3D6A95;
      margin: 0 0 28px;
    }

    .gracias__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #1E63C6;
      color: #fff;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.3px;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(30, 99, 198, 0.25);
      transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    }

    .gracias__cta:hover {
      background: #2F7BE5;
      transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(30, 99, 198, 0.3);
    }
  `]
})
export class GraciasComponent implements OnInit {
  private metaService = inject(MetaService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.metaService.setGracias();
    this.mountTuritopThankYouScript();
  }

  /**
   * Injects the script pasted into TURITOP_THANK_YOU_SCRIPT above, exactly
   * as TuriTop generates it — whether it's a bare JS body or a full
   * <script> tag. innerHTML never executes injected <script> tags on its
   * own, so each one found is re-created and appended manually.
   */
  private mountTuritopThankYouScript(): void {
    if (!isPlatformBrowser(this.platformId) || !TURITOP_THANK_YOU_SCRIPT.trim()) {
      return;
    }

    const container = this.document.createElement('div');
    container.innerHTML = TURITOP_THANK_YOU_SCRIPT;
    const scripts = Array.from(container.querySelectorAll('script'));

    if (scripts.length === 0) {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.text = TURITOP_THANK_YOU_SCRIPT;
      this.renderer.appendChild(this.document.body, script);
      return;
    }

    scripts.forEach(oldScript => {
      const script = this.renderer.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
      script.text = oldScript.textContent || '';
      this.renderer.appendChild(this.document.body, script);
    });
  }
}
