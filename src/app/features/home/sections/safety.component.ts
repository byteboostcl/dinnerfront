import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-safety-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="safety" id="seguridad">
      <div class="container safety__inner">
        <div class="safety__text">
          <h2 class="safety__title">{{ safetySection.title }}</h2>
          @for (line of safetySection.lines; track line) { <p>{{ line }}</p> }
        </div>
        <div class="safety__media">
          <img [src]="safetySection.image" alt="Seguridad certificada" loading="lazy" />
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container{max-width:1144px;margin:0 auto;padding:0 24px}
    @media (max-width:768px){.container{padding:0 24px}}
    .safety{padding:48px 0 56px;background:#fff}
    @media (max-width:768px){.safety{padding:22px 0 36px}}
    .safety__inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
    @media (max-width:900px){.safety__inner{grid-template-columns:1fr;gap:28px}}
    .safety__title{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-weight:500;font-size:38.4px;line-height:46.08px;color:#0D2545;margin:31.872px 0 16px}
    .safety__text p{margin:0 0 28px;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#3D6A95;font-size:16px;line-height:27.2px;font-weight:600}
    .safety__media img{width:100%;aspect-ratio:520/360;object-fit:cover;border-radius:20px;box-shadow:0 8px 40px rgba(21,101,192,.18)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafetySectionComponent {
  private content = inject(ContentService);
  safetySection = this.content.getSafetySection();
}
