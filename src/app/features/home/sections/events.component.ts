import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-events-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="b2b" id="eventos">
      <div class="container">
        <div class="b2b__hero">
          <div class="b2b__copy">
            <h2 class="section-title">{{ eventsSection.title }}</h2>
            @for (line of eventsSection.lines; track line) { <p class="section-sub">{{ line }}</p> }
            <div class="b2b__actions">
              <a
                class="btn-primary"
                [href]="whatsappUrl || '#contacto'"
                [attr.target]="whatsappUrl ? '_blank' : null"
                [attr.rel]="whatsappUrl ? 'noopener noreferrer' : null"
                (click)="handlePrimaryClick($event)"
              >{{ eventsSection.ctaPrimary }}</a>
              <a class="btn-outline" href="#ciudades" (click)="scrollTo('ciudades', $event)">{{ eventsSection.ctaSecondary }}</a>
            </div>
          </div>
          <div class="b2b__player">
            <video
              #brandVideo
              class="b2b__player-video"
              [muted]="true"
              loop
              playsinline
              preload="none"
              [poster]="headerImage">
              <source [attr.data-src]="videoSrc" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="b2b__media">
          <div class="b2b__media-grid">
          @for (ev of brandEvents$ | async; track ev.id; let i = $index) {
            <div class="b2b__media-cell" [class.b2b__media-cell--wide]="i === 4">
              <img class="b2b__media-img" [src]="ev.image" [alt]="ev.alt" loading="lazy" />
            </div>
          }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .b2b{padding:48px 0 56px;background:linear-gradient(135deg,#E3F2FD 0%,#BBDEFB 100%);
      --b2b-font:"Segoe UI",system-ui,-apple-system,sans-serif;font-family:var(--b2b-font)}
    .container{max-width:1144px;margin:0 auto;padding:0 24px}
    @media (max-width:768px){.container{padding:0 24px}}
    @media (max-width:768px){.b2b{padding:22px 0 36px}}

    .b2b__hero{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;margin-bottom:48px}
    .b2b__copy{min-width:0}
    .section-title{font-family:var(--b2b-font);font-weight:500;font-size:38.4px;line-height:46.08px;color:#0D2545;margin:31.872px 0 18px;letter-spacing:0}
    .section-sub{font-family:var(--b2b-font);font-weight:600;font-size:16px;line-height:27.2px;color:#3D6A95;margin:16px 0 28px}

    .b2b__actions{display:flex;gap:12px;flex-wrap:wrap}
    .btn-primary{display:inline-flex;align-items:center;gap:8px;background:#1E63C6;color:#fff;font-family:var(--b2b-font);font-weight:700;font-size:15.2px;line-height:1.2;letter-spacing:.304px;padding:14px 32px;border-radius:50px;text-decoration:none;border:none;cursor:pointer;transition:background .2s,transform .15s,box-shadow .2s;box-shadow:0 6px 18px rgba(30,99,198,.25)}
    .btn-primary:hover{background:#2F7BE5;transform:translateY(-1px);box-shadow:0 8px 22px rgba(30,99,198,.3)}
    .btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#1E63C6;font-family:var(--b2b-font);font-weight:700;font-size:15.2px;line-height:1.2;letter-spacing:.304px;padding:12px 28px;border-radius:50px;text-decoration:none;border:2px solid #1E63C6;cursor:pointer;transition:background .2s,color .2s}
    .btn-outline:hover{background:#E3F2FD}

    .b2b__player{min-width:0}
    .b2b__player{width:100%;aspect-ratio:16/9;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(21,101,192,.18);background:#BBDEFB;position:relative}
    .b2b__player-video{width:100%;height:100%;object-fit:cover;border-radius:20px;display:block;margin:0}

    .b2b__media{border-radius:0;overflow:visible;height:auto;box-shadow:none;position:static;width:100%}
    .b2b__media-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
    .b2b__media-cell{border-radius:14px;overflow:hidden;position:relative}
    .b2b__media-cell--wide{grid-column:1 / -1}
    .b2b__media-img{width:100%;height:220px;object-fit:cover;display:block;margin:0;transition:transform .4s}
    .b2b__media-cell--wide .b2b__media-img{height:280px}
    .b2b__media-cell:hover .b2b__media-img{transform:scale(1.04)}

    @media (max-width:900px){
      .b2b__hero{grid-template-columns:1fr;gap:32px;margin-bottom:36px}
      .b2b__player{order:-1}
      .section-title{font-size:32px;line-height:1.2}
    }
    @media (max-width:640px){
      .b2b__media-grid{grid-template-columns:1fr 1fr}
      .b2b__media-img{height:160px;aspect-ratio:auto}
      .b2b__media-cell--wide .b2b__media-img{height:216px;aspect-ratio:auto}
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsSectionComponent implements AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private platformId = inject(PLATFORM_ID);
  eventsSection = this.content.getEventsSection();
  brandEvents$ = this.content.getBrandEvents();
  headerImage = 'assets/images/b2b-marca-01.webp';
  videoSrc = 'assets/videos/b2b-eventos-marca.mp4';
  whatsappUrl = this.content.getWhatsappUrl();

  @ViewChild('brandVideo') brandVideo?: ElementRef<HTMLVideoElement>;

  private io?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const video = this.brandVideo?.nativeElement;
    if (!video) return;

    // The 3.6MB marketing video was previously downloaded eagerly on every
    // page load (preload="auto" + autoplay), competing for bandwidth with
    // the hero LCP image even though this section sits well below the fold.
    // Defer the actual fetch until the player is about to enter the
    // viewport, then load and autoplay it exactly like before.
    this.io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        const source = video.querySelector('source');
        const src = source?.getAttribute('data-src');
        if (source && src) {
          source.setAttribute('src', src);
          video.load();
        }

        // Belt-and-braces: some browsers only honor muted autoplay when
        // `.muted` is set as a live property, not just reflected from the
        // HTML attribute.
        video.muted = true;
        video.play().catch(() => {});

        this.io?.disconnect();
      },
      { rootMargin: '200px' }
    );

    this.io.observe(video);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  scrollTo(id: string, e: Event) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  handlePrimaryClick(e: Event) {
    if (!this.whatsappUrl) {
      this.scrollTo('contacto', e);
    }
  }
}
