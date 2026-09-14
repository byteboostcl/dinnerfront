import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-cities-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="cities" id="ciudades" aria-label="Ciudades">
      <div class="container">
        <div class="cities__header">
          <h2 class="cities__title">{{ citiesIntro.title }}</h2>
          @for (line of citiesIntro.lines; track line) {
            <p class="cities__sub">{{ line }}</p>
          }
        </div>

        <div class="cities__grid">
          @for (city of cities$ | async; track city.id) {
            <article class="ccard">
              <div class="ccard__media">
                <img [src]="city.cardImage || city.image" [alt]="'Dinner in the Sky ' + city.name" loading="lazy" [class.ccard__media-img--top]="city.id === 'tijuana'" [class.ccard__media-img--poster]="city.id === 'hermosillo'" />
                <span class="ccard__badge">
                  <span class="ccard__badge-line1">
                    <span class="ccard__badge-icon" aria-hidden="true">✦</span>
                    <span class="ccard__badge-text">Disponibilidad limitada:</span>
                  </span>
                  <span class="ccard__badge-sub">
                    @if (city.priceLabel) {
                      {{ city.priceLabel }}
                    } @else {
                      &#36;{{ city.startPrice | number }} {{ city.currency }}
                    }
                  </span>
                </span>
              </div>

              <div class="ccard__body">
                <h3 class="ccard__name">{{ city.name }} - {{ city.dates }}</h3>
                <div class="ccard__subtitle">{{ city.subtitle }}</div>
                <p class="ccard__desc">{{ city.longDescription }}</p>

                <div class="ccard__highlights">
                  @for (f of city.features; track f; let i = $index) {
                    <div class="ccard__hl">
                      <span class="ccard__hl-ic" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B1330" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          @switch (i) {
                            @case (0) {
                              <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2"></path><path d="M5 11v11"></path><path d="M19 15V2a5 5 0 0 0-3 5v6c0 1.1.9 2 2 2z"></path><path d="M19 15v7"></path>
                            }
                            @case (1) {
                              <path d="M8 22h8"></path><path d="M7 10h10"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-1-8H8c-.5 4-1 6-1 8a5 5 0 0 0 5 5Z"></path>
                            }
                            @case (2) {
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            }
                            @default {
                              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>
                            }
                          }
                        </svg>
                      </span>
                      <span class="ccard__hl-label">{{ f }}</span>
                    </div>
                  }
                </div>

                @if (city.urgencyNote) {
                  <p class="ccard__urgency">{{ city.urgencyNote }}</p>
                }

                <div class="ccard__footer">
                  @if (city.limitedDates) {
                    <!-- Sold-out-soon extra: the only dates left, called out
                         above the shared schedule + CTA block. -->
                    <div class="ccard__dates">
                      <span class="ccard__dates-label">{{ city.limitedDatesLabel }}</span>
                      <span class="ccard__dates-value">{{ city.limitedDates }}</span>
                    </div>
                  }
                  <div class="ccard__schedule">
                    <span class="ccard__schedule-ic" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B1330" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
                      </svg>
                    </span>
                    @if (city.limitedTimes) {
                      <span class="ccard__schedule-text">
                        <span class="ccard__schedule-days ccard__schedule-days--limited">{{ city.limitedTimesLabel }}</span>
                        <span class="ccard__schedule-times ccard__schedule-times--limited">{{ city.limitedTimes }}</span>
                      </span>
                    } @else {
                      <span class="ccard__schedule-text">
                        <span class="ccard__schedule-days">{{ city.schedule }}</span>
                        <span class="ccard__schedule-times">{{ city.scheduleTimes }}</span>
                      </span>
                    }
                  </div>

                  @if (city.seasonalBannerTitle) {
                    <div class="ccard__tickets" [class.ccard__tickets--departure]="city.seasonalBannerVariant === 'departure'">
                      <span class="ccard__tickets-icon" aria-hidden="true">
                        @if (city.seasonalBannerVariant === 'departure') {
                          <svg class="ccard__tickets-clock" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C3163F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>
                          </svg>
                        } @else {
                          <span class="ccard__tickets-spark ccard__tickets-spark--tl">✦</span>
                          {{ city.seasonalBannerIcon }}
                          <span class="ccard__tickets-spark ccard__tickets-spark--br">✦</span>
                        }
                      </span>
                      <span class="ccard__tickets-divider" aria-hidden="true"></span>
                      <span class="ccard__tickets-text">
                        <span class="ccard__tickets-title">{{ city.seasonalBannerTitle }}</span>
                        <span class="ccard__tickets-subtitle">{{ city.seasonalBannerSubtitle }}</span>
                      </span>
                      <span class="ccard__tickets-spark ccard__tickets-spark--edge" aria-hidden="true">✦</span>
                    </div>
                  }

                  @if (city.externalUrl) {
                    <a [href]="city.externalUrl" target="_blank" rel="noopener noreferrer" class="ccard__btn ccard__btn--reserve">
                      {{ city.cardCtaLabel || 'Reserva ahora' }} <span aria-hidden="true">→</span>
                    </a>
                  } @else {
                    <a [routerLink]="'/' + city.slug" class="ccard__btn ccard__btn--reserve">
                      {{ city.cardCtaLabel || 'Reserva ahora' }} <span aria-hidden="true">→</span>
                    </a>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container{max-width:1144px;margin:0 auto;padding:0 24px;box-sizing:border-box}
    @media (max-width:768px){.container{padding:0 24px}}
    .cities{padding:48px 0 56px;background:#fff}
    @media (max-width:768px){.cities{padding:22px 0 36px}}

    .cities__header{margin:0 0 56px}
    .cities__title{text-align:center;font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:500;font-size:31px;line-height:1.15;letter-spacing:-0.775px;color:#0D2545;margin:0 0 14px}
    .cities__sub{text-align:center;font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:600;font-size:19px;line-height:1.65;letter-spacing:-0.475px;color:#2C4A72;max-width:540px;margin:0 auto}

    .cities__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    @media (max-width:1100px){.cities__grid{grid-template-columns:repeat(2,1fr)}}
    @media (max-width:900px){.cities__grid{grid-template-columns:1fr}}

    .ccard{display:flex;flex-direction:column;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(13,37,69,.08);transition:transform .3s,box-shadow .3s}
    .ccard:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(13,37,69,.13)}

    .ccard__media{position:relative;aspect-ratio:16/11;overflow:hidden}
    .ccard__media img{width:100%;height:100%;object-fit:cover;display:block}
    /* Tijuana card photo: the man's face sits high in the frame at the default
       center crop, right under the "Disponibilidad limitada" badge. Anchor the
       crop to the top of the source image instead so the badge sits over sky
       only, on every breakpoint (aspect-ratio keeps the crop math constant). */
    .ccard__media-img--top{object-position:50% 0}
    .ccard__media img.ccard__media-img--poster{object-fit:cover;object-position:center 38%;background:#2D73A7}

    .ccard__badge{position:absolute;top:16px;left:16px;display:flex;flex-direction:column;gap:2px;max-width:calc(100% - 32px);background:#FFD45A;color:#081B3A;padding:10px 18px;border-radius:999px;box-shadow:0 8px 22px rgba(8,27,58,.18);text-transform:uppercase}
    .ccard__badge-line1{display:flex;align-items:center;gap:5px;font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;letter-spacing:.66px;line-height:1.2}
    .ccard__badge-icon{font-size:11px;line-height:1.2}
    .ccard__badge-sub{font-family:Montserrat,"Segoe UI",system-ui,sans-serif;font-size:13px;font-weight:800;letter-spacing:.39px;line-height:1.1}

    .ccard__body{padding:24px;display:flex;flex-direction:column;flex:1}

    .ccard__name{font-family:Montserrat,"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:700;font-size:31px;line-height:1.2;letter-spacing:-0.775px;color:#0D2545;margin:0 0 6px}
    .ccard__subtitle{font-family:Inter,system-ui,-apple-system,sans-serif;font-weight:600;font-size:14px;line-height:1.35;color:#1F3C63;margin:0 0 10px}
    .ccard__desc{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:400;font-size:13px;line-height:1.6;color:#3A3B47;margin:0 0 18px}

    .ccard__highlights{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:14px 0;margin:0 0 18px;border-top:1px solid #E8E8EC}
    .ccard__hl{display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center}
    .ccard__hl-ic{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid #0B1330;border-radius:50%;flex:none}
    .ccard__hl-label{font-family:Inter,system-ui,-apple-system,sans-serif;font-size:10px;font-weight:500;line-height:1.25;color:#3A3B47}

    /* Stacked footer on every card so the grid stays even: optional dates
       badge, then schedule, then the shared "Reserva ahora" CTA. */
    .ccard__footer{display:flex;flex-direction:column;align-items:stretch;gap:12px;margin-top:auto}
    .ccard__btn{display:inline-flex;align-items:center;gap:6px;background:#F9CA58;color:#0B1330;font-family:Poppins,Inter,system-ui,sans-serif;font-weight:700;font-size:13.5px;line-height:1;padding:13px 22px;border-radius:999px;text-decoration:none;transition:transform .2s,box-shadow .2s}
    .ccard__btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(249,202,88,.5)}

    .ccard__schedule{display:flex;align-items:center;justify-content:center;gap:8px}
    .ccard__schedule-ic{display:flex;align-items:center}
    .ccard__schedule-text{display:flex;flex-direction:column}
    .ccard__schedule-days,.ccard__schedule-times{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:11px;font-weight:400;line-height:1.4;color:#3A3B47}

    /* Sold-out-soon treatment: red urgency line + the remaining dates/times
       called out in place of the usual CTA and weekly schedule. Reuses the
       card's existing yellow (#F9CA58) and navy (#0B1330) tokens. */
    .ccard__urgency{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:14px;font-weight:800;line-height:1.3;letter-spacing:.02em;text-transform:uppercase;text-align:center;color:#E01F1F;margin:0 0 14px}

    .ccard__dates{display:flex;flex-direction:column;align-items:center;gap:2px;background:#F9CA58;color:#0B1330;padding:12px 18px;border-radius:12px;text-align:center}

    .ccard__btn--reserve{width:100%;justify-content:center;background:#0D2545;color:#fff;padding:16px 22px;font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .ccard__btn--reserve:hover{background:#082848;box-shadow:0 8px 20px rgba(13,37,69,.35)}
    .ccard__dates-label{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:10px;font-weight:800;letter-spacing:.5px;line-height:1.2;text-transform:uppercase}
    .ccard__dates-value{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:12.5px;font-weight:800;letter-spacing:.2px;line-height:1.25;text-transform:uppercase}

    .ccard__schedule-days--limited{font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:#0B1330}
    .ccard__schedule-times--limited{font-size:11.5px;font-weight:700;color:#0B1330}

    /* Seasonal urgency banner (e.g. holiday "Boletos limitados" push): sits
       between the schedule and the "Reserva ahora" CTA. Reuses the card's
       urgency red (#E01F1F, see .ccard__urgency) and gold sparkle (#FFD45A,
       see .ccard__badge-icon) tokens rather than introducing new colors. */
    .ccard__tickets{position:relative;display:flex;align-items:center;gap:12px;background:#F8F3EF;border-radius:999px;padding:10px 20px}
    .ccard__tickets-icon{position:relative;flex:none;font-size:26px;line-height:1}
    .ccard__tickets-spark{position:absolute;color:#FFD45A;font-size:10px;line-height:1}
    .ccard__tickets-spark--tl{top:-6px;left:-8px}
    .ccard__tickets-spark--br{bottom:-4px;right:-10px}
    .ccard__tickets-spark--edge{position:static;margin-left:auto;font-size:12px}
    .ccard__tickets-divider{flex:none;align-self:stretch;width:2px;background:rgba(224,31,31,.3);border-radius:1px}
    .ccard__tickets-text{display:flex;flex-direction:column;gap:1px;min-width:0}
    .ccard__tickets-title{font-family:Montserrat,"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:800;font-size:15px;line-height:1.2;letter-spacing:.02em;text-transform:uppercase;color:#E01F1F}
    .ccard__tickets-subtitle{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-weight:700;font-size:10.5px;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;color:#0B1330}
    .ccard__tickets--departure{justify-content:center;background:transparent;border-radius:0;padding:0 4px;gap:10px}
    .ccard__tickets--departure .ccard__tickets-icon{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:2px solid #C3163F;border-radius:50%;font-size:0}
    .ccard__tickets--departure .ccard__tickets-clock{display:block}
    .ccard__tickets--departure .ccard__tickets-divider,.ccard__tickets--departure .ccard__tickets-spark--edge{display:none}
    .ccard__tickets--departure .ccard__tickets-text{align-items:center;text-align:center}
    .ccard__tickets--departure .ccard__tickets-title{font-size:16px;letter-spacing:.05em;color:#C3163F}
    .ccard__tickets--departure .ccard__tickets-subtitle{font-size:14px;font-weight:500;letter-spacing:0;text-transform:none;color:#C3163F}
    /* Narrowest phones (≤380px, e.g. iPhone SE): tighten the pill so
       "Boletos limitados" / "Asegura tu lugar hoy" don't wrap inside it. */
    @media (max-width:380px){
      .ccard__tickets{padding:9px 14px;gap:9px}
      .ccard__tickets-icon{font-size:22px}
      .ccard__tickets-title{font-size:13px}
      .ccard__tickets-subtitle{font-size:9.5px;letter-spacing:.04em}
      .ccard__tickets-spark--edge{display:none}
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitiesSectionComponent {
  private content = inject(ContentService);
  cities$ = this.content.getCities();
  citiesIntro = this.content.getCitiesIntro();
}
