import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-impact-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="impact" id="impacto">
      <div class="container">
        <p class="eyebrow eyebrow--center">{{ impactSection.eyebrow }}</p>
        <h2 class="impact__title">{{ impactSection.title }}</h2>
        <p class="impact__subtitle">{{ impactSection.subtitle }}</p>
        <div class="impact__grid">
          @for (m of impactSection.metrics; track m.label) {
            <div class="impact__card">
              <span class="impact__value">{{ m.value }}</span>
              <span class="impact__label">{{ m.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container{max-width:1144px;margin:0 auto;padding:0 24px}
    @media (max-width:768px){.container{padding:0 24px}}
    .eyebrow{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:500;letter-spacing:1.92px;text-transform:uppercase;color:#1e63c6;margin:16px 0 14px;line-height:1.7}
    .eyebrow--center{text-align:center}
    .impact{padding:48px 0 56px;background:#fff;text-align:center}
    @media (max-width:768px){.impact{padding:22px 0 36px}}
    .impact__title{font-family:'Montserrat',sans-serif;font-weight:600;font-size:38px;color:#0D2545;margin:32px 0 8px;line-height:1.2}
    .impact__subtitle{max-width:560px;margin:0 auto 40px;color:#3d6a95;font-size:16px;font-weight:600;line-height:1.7}
    .impact__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;max-width:1096px;margin:0 auto;background:rgba(21,101,192,.08);border-radius:20px;box-shadow:0 4px 24px rgba(21,101,192,.12);overflow:hidden}
    @media (max-width:680px){.impact__grid{grid-template-columns:1fr}}
    .impact__card{background:#fff;padding:40px 24px}
    .impact__value{display:block;font-family:'Montserrat',sans-serif;font-weight:800;font-size:51px;color:#1e63c6;line-height:1;margin-bottom:8px}
    .impact__label{color:#3d6a95;font-size:14.4px;font-weight:600}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpactSectionComponent {
  private content = inject(ContentService);
  impactSection = this.content.getImpactSection();
}
