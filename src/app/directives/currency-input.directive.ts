import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]',
})
export class CurrencyInputDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input') onInput() {
    let inputVal = this.el.nativeElement.value;
    // Remove non-numeric characters
    inputVal = Number(inputVal.toString().replace(/[^0-9.]/g, ''));

    // Format as currency and update the input value
    this.renderer.setProperty(
      this.el.nativeElement,
      'value',
      this.formatCurrency(inputVal)
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
