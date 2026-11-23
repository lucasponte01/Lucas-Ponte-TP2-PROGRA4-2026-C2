import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { Publicacion } from '../../../interfaces/publicaciones';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TiempoRelativoPipe } from '../pipe/tiempo-relativo-pipe';
import { TexoLargoPipe } from '../pipe/pipe-texto-largo-pipe';

@Component({
  imports: [ RouterLink , TiempoRelativoPipe , TexoLargoPipe],
  selector: 'app-publicaciones-ind',
  styleUrl: './publicaciones-ind.css',
  templateUrl: './publicaciones-ind.html',
})
export class PublicacionesInd {
  @Input({ required: true }) publi!: Publicacion;
  @Output() like = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onLikeClick() {
    if (this.publi._id) {
      this.like.emit(this.publi._id);
    }
  }
  onDeleteClick() {
    if (this.publi._id) {
      this.delete.emit(this.publi._id);
    }
  }
}
