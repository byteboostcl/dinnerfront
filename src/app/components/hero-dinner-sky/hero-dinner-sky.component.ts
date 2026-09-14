import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hero-dinner-sky',
  standalone: true,
  imports: [],
  templateUrl: './hero-dinner-sky.component.html',
  styleUrl: './hero-dinner-sky.component.css'
})
export class HeroDinnerSkyComponent {
  @Input() ctaLink = '#experiencia';
  @Input() buyLink = '#ciudades';

  @Output() ctaClick = new EventEmitter<void>();
  @Output() buyClick = new EventEmitter<void>();

  onCtaClick(): void {
    this.ctaClick.emit();
  }

  onBuyClick(): void {
    this.buyClick.emit();
  }
}
