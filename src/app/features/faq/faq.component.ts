import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaService } from '../../services/meta.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-page">
      <section class="faq-hero">
        <div class="container">
          <h1>{{ faqIntro.title }}</h1>
          @for (line of faqIntro.lines; track line) { <p>{{ line }}</p> }
        </div>
      </section>

      <section class="faq-content">
        <div class="container">
          <div class="faq-list">
            @for (item of faqItems$ | async; track item.id) {
              <div class="faq-item" [class.open]="expandedId === item.id">
                <button
                  class="faq-question"
                  (click)="toggleFAQ(item.id)"
                  [attr.aria-expanded]="expandedId === item.id"
                  [attr.aria-label]="'Toggle answer for: ' + item.question"
                >
                  <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <span class="question-text">{{ item.question }}</span>
                </button>
                <div class="faq-answer-wrapper">
                  <div class="faq-answer">
                    @for (para of item.answer.split('\\n\\n'); track para) {
                      <p>{{ para }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .faq-page {
      width: 100%;
      background: #fff;
    }

    .container {
      max-width: 1144px;
      margin: 0 auto;
      padding: 0 24px;
      box-sizing: border-box;

      @media (max-width: 768px) {
        padding: 0 20px;
      }
    }

    .faq-hero {
      background: #fff;
      padding: 56px 0 40px;
      text-align: center;

      @media (max-width: 768px) {
        padding: 40px 0 28px;
      }

      h1 {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 112px;
        line-height: 1;
        letter-spacing: 6.72px;
        color: #0D2545;
        margin: 0 0 8px;

        @media (max-width: 1024px) {
          font-size: 72px;
          letter-spacing: 4px;
        }

        @media (max-width: 640px) {
          font-size: 44px;
          letter-spacing: 2px;
        }
      }

      p {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-weight: 500;
        font-size: 16px;
        line-height: 27.2px;
        color: #3D6A95;
        margin: 0 0 10.4px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    .faq-content {
      padding: 40px 0 80px;
      background: #fff;

      @media (max-width: 768px) {
        padding: 24px 0 56px;
      }
    }

    .faq-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .faq-item {
      background: #fff;
      border: 1px solid rgba(13, 37, 69, 0.1);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: rgba(13, 37, 69, 0.2);
        box-shadow: 0 8px 24px rgba(13, 37, 69, 0.12);
      }

      &.open {
        border-color: rgba(13, 37, 69, 0.15);
        box-shadow: 0 12px 32px rgba(13, 37, 69, 0.15);
      }
    }

    .faq-question {
      width: 100%;
      padding: 20px 24px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #0D2545;
      text-align: left;
      transition: all 0.2s ease;

      &:hover {
        color: #082848;
      }

      &:focus {
        outline: none;
        color: #082848;
      }
    }

    .question-text {
      flex: 1;
    }

    .faq-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: #0D2545;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .faq-item.open & {
        transform: rotate(180deg);
      }
    }

    /* max-height animation with a tight ceiling: the tallest answer is ~2
       short paragraphs, so 400px is comfortably above the real content
       height without overshooting so far that the visible part of the
       transition finishes instantly (which is what made a large ceiling
       like 2000px snap open and lag on close). */
    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .faq-item.open .faq-answer-wrapper {
      max-height: 400px;
    }

    .faq-answer {
      padding: 0 24px 20px 48px;

      p {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.6;
        color: #3D6A95;
        margin: 0 0 10px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FAQComponent implements OnInit {
  private metaService = inject(MetaService);
  private contentService = inject(ContentService);

  faqItems$ = this.contentService.getFAQ();
  faqIntro = this.contentService.getFAQIntro();
  expandedId: string | null = null;

  ngOnInit() {
    this.metaService.setFAQ();
    this.metaService.setStructuredData([
      this.metaService.buildFAQSchema(this.contentService.getFAQItems()),
      this.metaService.buildBreadcrumbSchema([
        { name: 'Inicio', path: '' },
        { name: 'Preguntas frecuentes', path: 'faq' }
      ])
    ]);
  }

  toggleFAQ(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
