import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrobaNombre',
})
export class ArrobaNombrePipe implements PipeTransform {
  transform(username: string | null | undefined): string {
    if (!username) {
      return '@usuario';
    }
    const limpio = username.trim().replace(/^@+/, '').toLowerCase();
    return `@${limpio}`;
  }
}
