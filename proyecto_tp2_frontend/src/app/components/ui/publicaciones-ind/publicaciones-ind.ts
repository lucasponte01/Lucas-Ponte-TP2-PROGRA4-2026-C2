import { Component, input, output } from '@angular/core';
import { Publicacion } from '../../../interfaces/publicaciones';

@Component({
  imports: [],
  selector: 'app-publicaciones-ind',
  styleUrl: './publicaciones-ind.css',
  templateUrl: './publicaciones-ind.html',
})
export class PublicacionesInd {
  publicacion = input.required<Publicacion>();

  like = output<string>();
  delete = output<string>();

  onLikeToggle() {
    this.like.emit(this.publicacion()._id!);
  }

  onDelete() {
    this.delete.emit(this.publicacion()._id!);
  }
}
