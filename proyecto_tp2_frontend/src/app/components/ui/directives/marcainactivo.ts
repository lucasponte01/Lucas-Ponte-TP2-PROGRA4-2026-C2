import { Directive, ElementRef, inject, input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMarcarInactivo]',
})
export class MarcarInactivoDirective implements OnChanges {
  appMarcarInactivo = input<boolean>(false);

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    const inactivo = this.appMarcarInactivo();
    const nativeEl = this.el.nativeElement;

    if (inactivo) {
      this.renderer.addClass(nativeEl, 'elemento-inactivo');
      this.renderer.setStyle(nativeEl, 'opacity', '0.6');
      this.renderer.setAttribute(nativeEl, 'aria-disabled', 'true');
      if ('disabled' in nativeEl) {
        this.renderer.setProperty(nativeEl, 'disabled', true);
      }
    } else {
      this.renderer.removeClass(nativeEl, 'elemento-inactivo');
      this.renderer.removeStyle(nativeEl, 'opacity');
      this.renderer.removeAttribute(nativeEl, 'aria-disabled');
      if ('disabled' in nativeEl) {
        this.renderer.setProperty(nativeEl, 'disabled', false);
      }
    }
  }
}