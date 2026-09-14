import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { City } from '../models';

/**
 * Fires page views on SPA route changes so the tracking stack (GA4
 * G-Y2S6MLPQ3D via GTM-TZJGGV7X, and Meta Pixels 442657751936307 +
 * 899218392733899 — two pixels running in parallel on purpose) keeps
 * counting navigations — not just the initial document load.
 * The base install lives in index.html; this only re-fires per navigation.
 *
 * Purchase is deliberately NOT tracked from here: the booking flow
 * completes inside TuriTop's cross-origin iframe, so this site has no
 * reliable way to know a payment succeeded. Purchase is fired by TuriTop's
 * own Thank You Page script instead — see features/gracias/gracias.component.ts.
 */
declare const gtag: undefined | ((...args: unknown[]) => void);
declare const fbq: undefined | ((...args: unknown[]) => void);

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private started = false;

  /** Call once (e.g. from AppComponent) to begin tracking navigations. */
  init(): void {
    if (this.started) return;
    this.started = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.trackPageView(e.urlAfterRedirects));
  }

  /** Fire when a city's product page is viewed (mirrors the Product schema in MetaService). */
  trackViewContent(city: City): void {
    if (typeof fbq !== 'function') return;
    fbq('track', 'ViewContent', {
      content_name: `Dinner In The Sky ${city.name}`,
      content_type: 'product',
      content_ids: [city.slug],
      value: city.startPrice,
      currency: city.currency
    });
  }

  /** Fire once the TuriTop booking widget has actually loaded on a city page. */
  trackInitiateCheckout(city: City): void {
    if (typeof fbq !== 'function') return;
    fbq('track', 'InitiateCheckout', {
      content_name: `Dinner In The Sky ${city.name}`,
      content_type: 'product',
      content_ids: [city.slug],
      value: city.startPrice,
      currency: city.currency
    });
  }

  private trackPageView(path: string): void {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.origin + path,
        page_title: document.title,
      });
    }
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
  }
}
