import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-page">
      <section class="not-found-content">
        <div class="container">
          <div class="error-card">
            <h1 class="error-code">404</h1>
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
            <div class="error-ctas">
              <a routerLink="/" class="btn btn-primary">
                Volver al inicio
              </a>
              <a href="/#ciudades" class="btn btn-secondary">
                Ver ciudades
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .not-found-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    }

    .not-found-content {
      padding: 60px 20px;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;

      @media (max-width: 768px) {
        padding: 0 16px;
      }
    }

    .error-card {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .error-code {
      font-size: 120px;
      font-weight: 700;
      color: #0d3570;
      margin-bottom: 16px;
      text-shadow: 0 4px 12px rgba(13, 53, 112, 0.3);

      @media (max-width: 768px) {
        font-size: 80px;
      }
    }

    h2 {
      font-size: 36px;
      margin-bottom: 16px;

      @media (max-width: 768px) {
        font-size: 28px;
      }
    }

    p {
      font-size: 18px;
      color: #e0e0e0;
      margin-bottom: 32px;

      @media (max-width: 768px) {
        font-size: 16px;
      }
    }

    .error-ctas {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .btn {
      padding: 12px 24px;
      font-size: 16px;
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.setNotFound();
  }
}
