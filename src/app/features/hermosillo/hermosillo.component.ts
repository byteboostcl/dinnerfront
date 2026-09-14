import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetaService } from '../../services/meta.service';

// NOTA (2026-09-13): la ruta '/hermosillo' ahora carga CityComponent (mismo
// diseño que ensenada/puebla/ciudad-de-mexico — ver app.routes.ts y
// src/app/features/city/city.component.ts). Este componente quedó sin usar
// y su formulario de registro se comentó más abajo (no se borró) por si se
// necesita reactivar en el futuro.

@Component({
  selector: 'app-hermosillo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="hermosillo-page">
      <section class="hermosillo-hero" aria-labelledby="hermosillo-title">
        <img
          class="hermosillo-hero__photo"
          src="assets/images/city/hermosillo-registration-bg.png"
          alt=""
          loading="eager"
          decoding="async"
        />
        <div class="hermosillo-hero__scrim" aria-hidden="true"></div>

        <div class="hermosillo-hero__content">
          <img class="hermosillo-hero__logo" src="assets/logos/logo-dinner-sky-white.webp" alt="Dinner in the Sky" />
          <p class="hermosillo-hero__tagline">Gastronomía · Vistas · Experiencias inolvidables</p>

          <div class="hermosillo-hero__headline">
            <p class="hermosillo-hero__intro">Por primera vez en</p>
            <h1 id="hermosillo-title" class="hermosillo-hero__title">Hermosillo</h1>
            <p class="hermosillo-hero__state"><span></span>Sonora<span></span></p>
            <p class="hermosillo-hero__lift">Eleva tus sentidos</p>
          </div>

          <!--
            Formulario de registro comentado (2026-09-13): ya no se necesita
            en '/hermosillo' — la página ahora usa el diseño de CityComponent
            (igual que CDMX). Se deja el código intacto por si se reactiva.

          <form class="registration-form" #hermosilloForm="ngForm" (ngSubmit)="submitLead(hermosilloForm.valid)">
            <div class="registration-form__header">
              <h2>Regístrate</h2>
              <p>para ser de los primeros en vivirla.</p>
            </div>

            <label class="registration-form__field">
              <span class="registration-form__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span class="sr-only">Nombre completo</span>
              <input type="text" name="fullName" [(ngModel)]="lead.fullName" autocomplete="name" placeholder="Nombre completo" required />
            </label>

            <label class="registration-form__field">
              <span class="registration-form__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="m3 7 9 6 9-6"></path>
                </svg>
              </span>
              <span class="sr-only">Correo electrónico</span>
              <input type="email" name="email" [(ngModel)]="lead.email" autocomplete="email" placeholder="Correo electrónico" required />
            </label>

            <label class="registration-form__field">
              <span class="registration-form__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
              </span>
              <span class="sr-only">WhatsApp</span>
              <input type="tel" name="whatsapp" [(ngModel)]="lead.whatsapp" autocomplete="tel" inputmode="tel" placeholder="WhatsApp" required />
            </label>

            <label class="registration-form__field registration-form__field--select">
              <span class="registration-form__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.9"></path>
                  <path d="M16 3.1a4 4 0 0 1 0 7.8"></path>
                </svg>
              </span>
              <span class="sr-only">Invitados</span>
              <select name="guestCount" [(ngModel)]="lead.guestCount" required>
                <option value="" disabled>¿Con cuántos invitados te gustaría ir?</option>
                @for (option of guestOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </label>

            @if (message) {
              <p class="registration-form__message" [class.registration-form__message--error]="messageType === 'error'" [class.registration-form__message--success]="messageType === 'success'">{{ message }}</p>
            }

            <button class="registration-form__submit" type="submit" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Enviando' : 'Regístrate aquí' }} <span aria-hidden="true">→</span>
            </button>

            <p class="registration-form__note">Te contactaremos en cuanto tengamos fechas disponibles en Hermosillo.</p>
          </form>
          -->
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host{display:block}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .hermosillo-page{min-height:calc(100svh - 68px);background:#06101a;color:#fff;font-family:"Segoe UI",system-ui,-apple-system,sans-serif}
    .hermosillo-hero{position:relative;min-height:calc(100svh - 68px);display:flex;align-items:center;justify-content:center;overflow:hidden;isolation:isolate;padding:clamp(28px,4vw,62px) 20px}
    .hermosillo-hero__photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 52%;z-index:-3}
    .hermosillo-hero__scrim{position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,rgba(3,24,45,.2) 0%,rgba(3,24,45,.16) 38%,rgba(4,7,10,.84) 74%,rgba(4,7,10,.96) 100%),linear-gradient(90deg,rgba(1,8,15,.36) 0%,rgba(1,8,15,.06) 28%,rgba(1,8,15,.06) 72%,rgba(1,8,15,.36) 100%)}
    .hermosillo-hero__content{width:min(100%,760px);display:flex;flex-direction:column;align-items:center;text-align:center;text-shadow:0 8px 28px rgba(0,0,0,.36)}
    .hermosillo-hero__logo{width:clamp(238px,28vw,430px);height:auto;display:block;margin:0 0 10px;filter:drop-shadow(0 8px 20px rgba(0,0,0,.18))}
    .hermosillo-hero__tagline{margin:0;color:rgba(255,255,255,.86);font-size:clamp(10px,1.45vw,15px);font-weight:600;line-height:1.25;letter-spacing:.38em;text-transform:uppercase}
    .hermosillo-hero__headline{margin:clamp(28px,4.4vw,54px) 0 clamp(58px,8.2vw,94px)}
    .hermosillo-hero__intro{margin:0 0 10px;color:rgba(255,255,255,.9);font-size:clamp(15px,2.3vw,29px);font-weight:500;letter-spacing:.54em;text-transform:uppercase}
    .hermosillo-hero__title{margin:0;color:#fff;font-family:Montserrat,"Segoe UI",system-ui,sans-serif;font-size:clamp(54px,9vw,112px);font-weight:900;line-height:.9;letter-spacing:.03em;text-transform:uppercase}
    .hermosillo-hero__state{display:flex;align-items:center;justify-content:center;gap:22px;margin:14px 0 22px;color:rgba(255,255,255,.9);font-size:clamp(18px,3vw,34px);font-weight:300;letter-spacing:.64em;text-transform:uppercase}
    .hermosillo-hero__state span{display:block;width:clamp(48px,8vw,92px);height:1px;background:rgba(255,255,255,.82)}
    .hermosillo-hero__lift{margin:0;color:rgba(255,255,255,.9);font-size:clamp(15px,2.2vw,27px);font-weight:400;letter-spacing:.52em;text-transform:uppercase}
    .registration-form{width:min(100%,640px);display:flex;flex-direction:column;align-items:stretch;gap:14px;text-shadow:none}
    .registration-form__header{margin:0 0 6px;color:#fff;text-align:center;text-shadow:0 6px 22px rgba(0,0,0,.45)}
    .registration-form__header h2{margin:0;font-family:Montserrat,"Segoe UI",system-ui,sans-serif;font-size:clamp(40px,5.4vw,62px);font-weight:900;line-height:1;letter-spacing:0}
    .registration-form__header p{margin:8px 0 0;font-size:clamp(21px,2.8vw,34px);font-weight:400;line-height:1.12;letter-spacing:0}
    .registration-form__field{height:68px;display:flex;align-items:center;gap:20px;border:2px solid rgba(255,255,255,.56);border-radius:12px;background:rgba(9,10,12,.54);box-shadow:inset 0 1px 0 rgba(255,255,255,.14);padding:0 28px;backdrop-filter:blur(10px)}
    .registration-form__icon{display:flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;color:#fff}
    .registration-form__icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .registration-form__field input,.registration-form__field select{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#fff;font:500 22px/1 "Segoe UI",system-ui,-apple-system,sans-serif}
    .registration-form__field input::placeholder{color:rgba(255,255,255,.7)}
    .registration-form__field select{appearance:none;-webkit-appearance:none;cursor:pointer;color:rgba(255,255,255,.72)}
    .registration-form__field select:valid{color:#fff}
    .registration-form__field option{color:#111;background:#fff}
    .registration-form__field--select{position:relative;padding-right:62px}
    .registration-form__field--select::after{content:"";position:absolute;right:30px;top:50%;width:12px;height:12px;border-right:3px solid #fff;border-bottom:3px solid #fff;transform:translateY(-70%) rotate(45deg);pointer-events:none}
    .registration-form__field:focus-within{border-color:#0bb6ff;box-shadow:0 0 0 3px rgba(11,182,255,.2),0 12px 34px rgba(0,166,255,.18),inset 0 1px 0 rgba(255,255,255,.18)}
    .registration-form__submit{height:76px;width:calc(100% - 64px);align-self:center;border:0;border-radius:999px;background:#08aefa;color:#fff;font:900 22px/1 Poppins,Montserrat,"Segoe UI",system-ui,sans-serif;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;box-shadow:0 18px 34px rgba(0,174,250,.34);transition:transform .2s ease,background .2s ease,box-shadow .2s ease}
    .registration-form__submit:hover{background:#19bfff;box-shadow:0 20px 38px rgba(0,174,250,.42);transform:translateY(-2px)}
    .registration-form__submit:disabled{cursor:wait;opacity:.74;transform:none;box-shadow:0 12px 26px rgba(0,174,250,.24)}
    .registration-form__submit:focus-visible{outline:3px solid rgba(255,255,255,.9);outline-offset:4px}
    .registration-form__submit span{display:inline-block;margin-left:10px;font-weight:400;letter-spacing:0}
    .registration-form__message{margin:0;text-align:center;font-size:14px;font-weight:800;line-height:1.25}
    .registration-form__message--error{color:#ffd45a}
    .registration-form__message--success{color:#fff}
    .registration-form__note{max-width:470px;margin:8px auto 0;color:rgba(255,255,255,.76);text-align:center;font-size:clamp(17px,2vw,23px);font-weight:500;line-height:1.18}

    @media (min-width:1100px){
      .hermosillo-hero{align-items:center}
      .hermosillo-hero__content{width:min(46vw,650px);margin-left:auto;margin-right:9vw}
      .hermosillo-hero__photo{object-position:center 50%}
      .hermosillo-hero__logo{width:320px;margin-bottom:8px}
      .hermosillo-hero__tagline{font-size:11px;letter-spacing:.32em}
      .hermosillo-hero__headline{margin:28px 0 30px}
      .hermosillo-hero__intro{font-size:20px;letter-spacing:.48em}
      .hermosillo-hero__title{font-size:78px}
      .hermosillo-hero__state{gap:18px;margin:8px 0 12px;font-size:22px;letter-spacing:.56em}
      .hermosillo-hero__state span{width:74px}
      .hermosillo-hero__lift{font-size:20px;letter-spacing:.48em}
      .registration-form{width:min(100%,560px);gap:8px}
      .registration-form__header{margin-bottom:2px}
      .registration-form__header h2{font-size:40px}
      .registration-form__header p{font-size:22px}
      .registration-form__field{height:50px;border-radius:10px;gap:16px;padding:0 22px}
      .registration-form__icon{width:27px;height:27px}
      .registration-form__field input,.registration-form__field select{font-size:17px}
      .registration-form__submit{height:54px;width:calc(100% - 54px);font-size:16px}
      .registration-form__note{margin-top:4px;font-size:15px}
    }

    @media (max-width:720px){
      .hermosillo-hero{min-height:calc(100svh - 68px);padding:48px 20px 26px;align-items:flex-start}
      .hermosillo-hero__photo{object-position:center center}
      .hermosillo-hero__content{min-height:calc(100svh - 142px)}
      .hermosillo-hero__headline{margin:28px 0 auto}
      .hermosillo-hero__tagline{font-size:9px;letter-spacing:.26em}
      .hermosillo-hero__intro{font-size:15px;letter-spacing:.4em}
      .hermosillo-hero__title{font-size:52px;letter-spacing:.01em}
      .hermosillo-hero__state{gap:14px;font-size:18px;letter-spacing:.42em}
      .hermosillo-hero__state span{width:48px}
      .hermosillo-hero__lift{font-size:15px;letter-spacing:.34em}
      .registration-form{gap:10px}
      .registration-form__header h2{font-size:40px}
      .registration-form__header p{font-size:22px}
      .registration-form__field{height:56px;gap:15px;border-radius:10px;padding:0 18px}
      .registration-form__icon{width:26px;height:26px}
      .registration-form__field input,.registration-form__field select{font-size:15px}
      .registration-form__field--select{padding-right:46px}
      .registration-form__field--select::after{right:22px;width:9px;height:9px;border-width:2px}
      .registration-form__submit{height:58px;width:calc(100% - 38px);font-size:15px;letter-spacing:.22em}
      .registration-form__note{font-size:15px}
    }

    @media (max-width:390px){
      .hermosillo-hero{padding-left:16px;padding-right:16px}
      .hermosillo-hero__title{font-size:46px}
      .registration-form__submit{width:100%}
    }
  `]
})
export class HermosilloComponent implements OnInit {
  private metaService = inject(MetaService);

  /*
   * Estado y opciones del formulario de registro — comentado junto con el
   * <form> del template de arriba. Se deja intacto por si se reactiva.
   *
  private cdr = inject(ChangeDetectorRef);

  lead = {
    fullName: '',
    email: '',
    whatsapp: '',
    guestCount: ''
  };

  guestOptions = [
    { value: '1', label: '1 invitado' },
    { value: '2', label: '2 invitados' },
    { value: '3', label: '3 invitados' },
    { value: '4', label: '4 invitados' },
    { value: '5', label: '5 invitados' },
    { value: '6+', label: '6 o más invitados' }
  ];

  submitted = false;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  */

  ngOnInit(): void {
    this.metaService.updatePageMeta({
      title: 'Dinner In The Sky Hermosillo',
      description: 'Regístrate para recibir información sobre Dinner In The Sky Hermosillo próximamente.',
      keywords: ['Dinner in the Sky', 'Hermosillo', 'Sonora', 'registro'],
      image: '/assets/images/city/hermosillo-registration-bg.png',
      url: 'https://dinnerinthesky.com.mx/hermosillo'
    });
  }

  /*
   * submitLead() — comentado junto con el resto del formulario (ver notas
   * arriba). Enviaba el lead a POST /api/leads del backend en Railway.
   *
  async submitLead(isValid: boolean | null): Promise<void> {
    if (!isValid) {
      this.messageType = 'error';
      this.message = 'Completa todos los datos para enviar tu registro.';
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.cdr.markForCheck();

    // formsubmit.co quedó fuera: su rate limit (fuera de nuestro control) llegó
    // a bloquear registros reales dos veces. El form ahora le pega directo a
    // nuestra API (repo "dinnerbackend" en Railway), que guarda en Postgres.
    // Sin envío de correo por ahora — los registros se revisan desde
    // /api/leads o /api/leads/export (ver dinnerbackend/README.md).
    try {
      const response = await fetch('https://dinnerbackend-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sede: 'hermosillo',
          fullName: this.lead.fullName.trim(),
          email: this.lead.email.trim(),
          phone: this.lead.whatsapp.trim(),
          guestCount: this.lead.guestCount
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el registro.');
      }

      this.submitted = true;
      this.messageType = 'success';
      this.message = 'Listo. Recibimos tu registro y te contactaremos pronto.';
      this.lead = {
        fullName: '',
        email: '',
        whatsapp: '',
        guestCount: ''
      };
    } catch {
      this.messageType = 'error';
      this.message = 'No pudimos enviar tu registro. Intenta de nuevo en unos segundos.';
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }
  */
}
