import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-payments-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="payments" id="pagos">
      <div class="container">
        <p class="eyebrow">{{ paymentsSection.eyebrow }}</p>
        <h2 class="section-title">{{ paymentsSection.title }}</h2>
        <p class="section-sub">{{ paymentsSection.subtitle }}</p>
        <div class="payment-cards">
          <div class="payment-card">
            <div class="payment-card__brands">
              @for (pm of paymentMethods; track pm.name) {
                <img [src]="pm.icon" [alt]="pm.alt" [attr.width]="iconWidth(pm.name)" height="28" />
              }
            </div>
            <div class="payment-card__title">{{ paymentsSection.cardTitle }}</div>
            <div class="payment-card__text">{{ paymentsSection.cardText }}</div>
            <span class="payment-card__badge">Visa · MC · Amex</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host{--pay-font:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif}
    .container{max-width:1144px;margin:0 auto;padding:0 24px}
    @media (max-width:768px){.container{padding:0 24px}}
    .payments{padding:48px 0 56px;background:#f0f8ff;text-align:center;font-family:var(--pay-font)}
    @media (max-width:768px){.payments{padding:22px 0 36px}}
    .eyebrow{font-family:var(--pay-font);font-size:16px;font-weight:500;letter-spacing:1.92px;text-transform:uppercase;color:#1e63c6;line-height:27.2px;margin:16px 0 12px;text-align:center}
    .section-title{font-family:var(--pay-font);font-weight:500;font-size:38.4px;line-height:46.08px;color:#0d2545;margin:31.872px 0 14px;letter-spacing:0}
    .section-sub{font-family:var(--pay-font);font-weight:600;font-size:16px;line-height:27.2px;color:#3d6a95;max-width:560px;margin:0 auto 48px}
    .payment-cards{display:flex;gap:20px;max-width:760px;margin:0 auto;justify-content:center}
    .payment-card{width:697.594px;max-width:100%;background:#fff;border:2px solid transparent;border-radius:16px;padding:32px 28px;box-shadow:0 4px 24px rgba(21,101,192,.12);text-align:left}
    .payment-card__brands{display:flex;align-items:center;gap:14px;margin:0 0 16px;flex-wrap:nowrap}
    .payment-card__brands img{height:28px;width:auto;max-width:56px;object-fit:contain;display:block;filter:none;opacity:1}
    .payment-card__title{font-family:var(--pay-font);font-size:17.6px;font-weight:800;color:#0d2545;margin:0 0 8px;line-height:normal}
    .payment-card__text{font-family:var(--pay-font);font-size:13.6px;font-weight:500;line-height:21.76px;color:#3d6a95;margin:0}
    .payment-card__badge{display:inline-block;font-family:var(--pay-font);font-size:12px;font-weight:700;line-height:normal;color:#1e63c6;background:#e3f2fd;border-radius:50px;padding:4px 12px;margin:14px 0 0}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsSectionComponent {
  private content = inject(ContentService);
  paymentsSection = this.content.getPaymentsSection();
  paymentMethods = this.content.getPaymentMethods();

  /** Icons render at a fixed 28px height (see .payment-card__brands img); width
   * is derived from each SVG's real aspect ratio so the browser can reserve
   * the correct box before it loads, instead of shifting layout on load. */
  iconWidth(name: string): number {
    switch (name) {
      case 'Mastercard':
        return 43; // viewBox 80x52
      default:
        return 28; // Visa / American Express: square 24x24 viewBox
    }
  }
}
