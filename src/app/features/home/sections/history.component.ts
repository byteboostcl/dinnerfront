import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-history-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="history" id="historia">
      <div class="container">
        <p class="eyebrow eyebrow--center">{{ historySection.eyebrow }}</p>
        <h2 class="history__title">{{ historySection.title }}</h2>
        <div class="history__blocks">
          @for (block of historySection.blocks; track block.id; let i = $index) {
            <div class="history__block" [class.history__block--reverse]="i % 2 === 1">
              <div class="history__media"><img [src]="block.image" [alt]="block.title" loading="lazy" /></div>
              <div class="history__text">
                <p class="eyebrow">{{ block.eyebrow }}</p>
                <h3>{{ block.title }}</h3>
                <p>{{ block.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .history{padding:48px 40px 56px;background:#F0F8FF;font-family:"Segoe UI",system-ui,-apple-system,sans-serif}
    .container{max-width:1180px;margin:0 auto;padding:0}
    @media (max-width:1260px){.history{padding-left:24px;padding-right:24px}}
    @media (max-width:768px){.history{padding:22px 20px 36px}}
    .eyebrow{font-family:inherit;font-size:16px;font-weight:500;line-height:27.2px;letter-spacing:1.92px;text-transform:uppercase;color:#0A0908;margin:0 0 8.8px}
    .eyebrow--center{text-align:center}
    .history__title{text-align:center;font-family:inherit;font-weight:500;font-size:56px;line-height:64.4px;letter-spacing:-0.56px;color:#0D2545;max-width:576px;margin:5.6px auto 48px}
    @media (max-width:768px){.history__title{font-size:36px}}
    .history__blocks{display:flex;flex-direction:column;gap:56px;max-width:1180px;margin:0 auto}
    .history__block{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.85fr);gap:56px;align-items:start}
    @media (max-width:900px){.history__block{grid-template-columns:1fr;gap:24px}}
    .history__block--reverse .history__media{order:2}
    .history__block--reverse .history__text{order:1}
    @media (max-width:900px){.history__block--reverse .history__media{order:0}}
    .history__media{align-self:start;width:100%;aspect-ratio:4/5;max-height:420px;background:#E3F2FD;border-radius:16px;box-shadow:0 12px 40px rgba(13,53,112,.08);overflow:hidden}
    .history__media img{display:block;width:100%;height:100%;object-fit:contain;object-position:center center;border-radius:inherit}
    @media (max-width:900px){.history__media{height:auto;max-height:none;aspect-ratio:3/2}.history__media img{object-fit:cover}}
    .history__text h3{font-family:inherit;font-weight:500;font-size:35.2px;line-height:42.24px;letter-spacing:0.704px;color:#0D2545;margin:0 0 12px}
    @media (max-width:768px){.history__text h3{font-size:28px}}
    .history__text p{font-family:inherit;color:#3D6A95;font-size:16px;font-weight:500;line-height:27.2px;margin:0}
    .history__text .eyebrow{color:#0A0908;margin:0 0 8.8px;text-align:left;text-transform:uppercase;letter-spacing:1.92px}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorySectionComponent {
  private content = inject(ContentService);
  historySection = this.content.getHistorySection();
}
