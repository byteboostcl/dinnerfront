import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CITIES,
  CITIES_INTRO,
  EXPERIENCE_GALLERY,
  BRAND_EVENTS,
  SOCIAL_LINKS,
  PAYMENT_METHODS,
  FAQ_ITEMS,
  FAQ_INTRO,
  HERO_SECTION,
  EXPERIENCE_SECTION,
  EVENTS_SECTION,
  IMPACT_SECTION,
  PAYMENTS_SECTION,
  SAFETY_SECTION,
  HISTORY_SECTION,
  FOOTER_TEXT
} from '../data/site-data';
import { City, ExperienceCard, BrandEvent, Social, PaymentMethod, FAQItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  // Some cities are temporarily hidden from listings (home grid, header submenu)
  // without removing their data or routes — direct city URLs still resolve.
  private hiddenCityIds = new Set(['ensenada', 'puebla']);
  private citiesSubject = new BehaviorSubject<City[]>(CITIES.filter(city => !this.hiddenCityIds.has(city.id)));
  private experienceGallerySubject = new BehaviorSubject<ExperienceCard[]>(EXPERIENCE_GALLERY);
  private brandEventsSubject = new BehaviorSubject<BrandEvent[]>(BRAND_EVENTS);
  private faqSubject = new BehaviorSubject<FAQItem[]>(FAQ_ITEMS);

  public cities$ = this.citiesSubject.asObservable();
  public experienceGallery$ = this.experienceGallerySubject.asObservable();
  public brandEvents$ = this.brandEventsSubject.asObservable();
  public faq$ = this.faqSubject.asObservable();

  constructor() {}

  // Cities
  getCities(): Observable<City[]> {
    return this.cities$;
  }

  getCityBySlug(slug: string): City | undefined {
    return CITIES.find(city => city.slug === slug);
  }

  getCityById(id: string): City | undefined {
    return CITIES.find(city => city.id === id);
  }

  // Experience Gallery
  getExperienceGallery(): Observable<ExperienceCard[]> {
    return this.experienceGallery$;
  }

  // Brand Events
  getBrandEvents(): Observable<BrandEvent[]> {
    return this.brandEvents$;
  }

  // FAQ
  getFAQ(): Observable<FAQItem[]> {
    return this.faq$;
  }

  getFAQByCategory(category: string): FAQItem[] {
    return FAQ_ITEMS.filter(item => item.category === category);
  }

  getFAQItems(): FAQItem[] {
    return FAQ_ITEMS;
  }

  getFAQIntro() {
    return FAQ_INTRO;
  }

  // Static Content
  getHeroSection() {
    return HERO_SECTION;
  }

  getCitiesIntro() {
    return CITIES_INTRO;
  }

  getExperienceSection() {
    return EXPERIENCE_SECTION;
  }

  getEventsSection() {
    return EVENTS_SECTION;
  }

  getImpactSection() {
    return IMPACT_SECTION;
  }

  getPaymentsSection() {
    return PAYMENTS_SECTION;
  }

  getSafetySection() {
    return SAFETY_SECTION;
  }

  getHistorySection() {
    return HISTORY_SECTION;
  }

  getSocialLinks(): Social[] {
    return SOCIAL_LINKS;
  }

  getPaymentMethods(): PaymentMethod[] {
    return PAYMENT_METHODS;
  }

  getFooterText() {
    return FOOTER_TEXT;
  }

  getWhatsappUrl(): string {
    const footer = this.getFooterText();
    const rawNumber = typeof footer.whatsappNumber === 'string' ? footer.whatsappNumber : '';
    const digits = rawNumber.replace(/\D+/g, '');

    if (digits.length < 8) {
      return '';
    }

    const rawMessage = typeof footer.whatsappMessage === 'string' ? footer.whatsappMessage.trim() : '';

    return rawMessage
      ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(digits)}&text=${encodeURIComponent(rawMessage)}`
      : `https://api.whatsapp.com/send?phone=${encodeURIComponent(digits)}`;
  }
}
