import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="experience" id="experiencia">
      <div class="container experience__inner">
        <div class="experience__text">
          <h2 class="experience__title">{{ experienceSection.title }}</h2>
          @for (line of experienceSection.lines; track line) { <p>{{ line }}</p> }
          <a class="btn-solid" href="#ciudades" (click)="scrollTo('ciudades', $event)">{{ experienceSection.cta }}</a>
        </div>
        <div class="experience__media">
          <video class="experience__video" controls playsinline preload="none"
                 poster="assets/images/landing-home/hero-sky-mobile-2026.webp">
            <source src="assets/videos/dits-experiencia.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience{padding:48px 0 56px;background:#f0f8ff;font-family:"Segoe UI",system-ui,-apple-system,sans-serif}
    .container{max-width:1144px;margin:0 auto;padding:0 24px;box-sizing:border-box}
    @media (max-width:768px){.container{padding:0 24px}}
    @media (max-width:768px){.experience{padding:22px 0 36px}}
    .btn-solid{display:inline-flex;align-items:center;justify-content:center;background:rgb(30,99,198);color:#fff;font-family:inherit;font-weight:700;font-size:15.2px;line-height:1.2;letter-spacing:.304px;padding:14px 32px;border-radius:50px;text-decoration:none;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 6px 18px rgba(30,99,198,.25)}
    .btn-solid:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(30,99,198,.32)}
    .experience__inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
    @media (max-width:900px){.experience__inner{grid-template-columns:1fr;gap:32px}}
    .experience__title{font-family:inherit;font-weight:500;font-size:38.4px;line-height:46.08px;color:rgb(13,37,69);margin:32px 0 16px}
    .experience__text p{margin:16px 0 28px;color:rgb(61,106,149);font-size:16px;line-height:27.2px;font-weight:600}
    .experience__text .btn-solid{margin-top:0}
    .experience__media{position:relative}
    .experience__video{width:100%;aspect-ratio:16/9;border-radius:20px;background:#000;box-shadow:0 18px 50px rgba(13,37,69,.14);display:block;object-fit:cover}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceSectionComponent {
  private content = inject(ContentService);
  experienceSection = this.content.getExperienceSection();

  scrollTo(id: string, e: Event) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
