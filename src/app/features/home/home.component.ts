import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaService } from '../../services/meta.service';
import { ContentService } from '../../services/content.service';
import { HeroDinnerSkyComponent } from '../../components/hero-dinner-sky/hero-dinner-sky.component';
import { CitiesSectionComponent } from './sections/cities.component';
import { ExperienceSectionComponent } from './sections/experience.component';
import { GallerySectionComponent } from './sections/gallery.component';
import { EventsSectionComponent } from './sections/events.component';
import { ImpactSectionComponent } from './sections/impact.component';
import { PaymentsSectionComponent } from './sections/payments.component';
import { SafetySectionComponent } from './sections/safety.component';
import { HistorySectionComponent } from './sections/history.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroDinnerSkyComponent,
    CitiesSectionComponent,
    ExperienceSectionComponent,
    GallerySectionComponent,
    EventsSectionComponent,
    ImpactSectionComponent,
    PaymentsSectionComponent,
    SafetySectionComponent,
    HistorySectionComponent
  ],
  template: `
    <div class="home">
      <app-hero-dinner-sky
        [ctaLink]="'#experiencia'"
        [buyLink]="'#ciudades'"
        (ctaClick)="scrollToSection('experiencia')"
        (buyClick)="scrollToSection('ciudades')">
      </app-hero-dinner-sky>

      <app-cities-section />
      <app-experience-section />
      <app-gallery-section />
      <app-events-section />
      <app-impact-section />
      <app-payments-section />
      <app-safety-section />
      <app-history-section />
    </div>
  `,
  styles: [`
    .home { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private metaService = inject(MetaService);
  private contentService = inject(ContentService);

  ngOnInit() {
    this.metaService.setHome();

    const socialUrls = this.contentService.getSocialLinks().map(social => social.url);
    const whatsappNumber = this.contentService.getFooterText().whatsappNumber;
    this.metaService.setStructuredData(
      this.metaService.buildOrganizationSchema(socialUrls, whatsappNumber)
    );
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
