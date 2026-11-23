import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoRelativo',
})
export class TiempoRelativoPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    const fecha = value instanceof Date ? value : new Date(value);

    const segundos = Math.max(0, Math.floor((Date.now() - fecha.getTime()) / 1000));

    if (segundos < 60) {
      return 'recién';
    }

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
      return `hace ${minutos} min`;
    }

    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
      return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }

    const dias = Math.floor(horas / 24);
    if (dias < 30) {
      return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }

    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    });


  }
}
