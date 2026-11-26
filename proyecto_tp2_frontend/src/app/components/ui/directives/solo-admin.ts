import { Directive, effect, inject, signal, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSoloAdmin]',
})
export class SoloAdmin {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private esAdmin = signal(localStorage.getItem('perfil') === 'usuario');
  private renderizado = false;

  constructor() {
    effect(() => {
      if (this.esAdmin() && !this.renderizado) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.renderizado = true;
      } else if (!this.esAdmin() && this.renderizado) {
        this.viewContainer.clear();
        this.renderizado = false;
      }
    });
  }
}
