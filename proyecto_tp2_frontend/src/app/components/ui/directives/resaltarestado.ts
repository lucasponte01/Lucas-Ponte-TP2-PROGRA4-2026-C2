import { Directive, ElementRef, inject, input, OnChanges, Renderer2 } from '@angular/core';

export type EstadoVisual = 'activa' | 'baja' | 'pendiente' | 'neutro';

@Directive({
  selector: '[appResaltarEstado]',
})
export class ResaltarEstadoDirective implements OnChanges {
  appResaltarEstado = input<EstadoVisual>('neutro');

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  private estilosPorEstado: Record<EstadoVisual, { borderColor: string; color: string }> = {
    activa: { borderColor: '#F2A649', color: '#f3d5a3' },
    baja: { borderColor: '#ff5c5c', color: '#ffb3b3' },
    pendiente: { borderColor: '#F28705', color: '#ffd28a' },
    neutro: { borderColor: 'rgba(242, 166, 73, 0.35)', color: '#ffffff' },
  };

  ngOnChanges(): void {
    const estado = this.appResaltarEstado();
    const estilo = this.estilosPorEstado[estado] ?? this.estilosPorEstado.neutro;

    this.renderer.setStyle(this.el.nativeElement, 'border-color', estilo.borderColor);
    this.renderer.setStyle(this.el.nativeElement, 'color', estilo.color);
    this.renderer.setAttribute(this.el.nativeElement, 'data-estado', estado);
  }
}