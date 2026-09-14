import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery">
      <div class="container">
        <div class="gallery__grid">
          @for (image of experienceGallery$ | async; track image.id) {
            <figure class="gallery__item">
              <img [src]="image.image" [alt]="image.title" loading="lazy" />
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container{max-width:1144px;margin:0 auto;padding:0 24px;box-sizing:border-box}
    @media (max-width:768px){.container{padding:0 24px}}
    .gallery{padding:24px 0 56px;background:#fff}
    @media (max-width:768px){.gallery{padding:22px 0 36px}}
    .gallery__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    @media (max-width:900px){.gallery__grid{grid-template-columns:repeat(2,1fr)}}
    @media (max-width:560px){.gallery__grid{grid-template-columns:1fr}}
    .gallery__item{margin:0;aspect-ratio:5/4;overflow:hidden;border-radius:10px}
    .gallery__item img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
    .gallery__item:hover img{transform:scale(1.05)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GallerySectionComponent {
  private content = inject(ContentService);
  experienceGallery$ = this.content.getExperienceGallery();
}
