import { Component, EventEmitter, inject, Input, input, Output, output } from '@angular/core';
import { Publicacion } from '../../../interfaces/publicaciones';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TiempoRelativoPipe } from '../pipe/tiempo-relativo-pipe';
import { TexoLargoPipe } from '../pipe/pipe-texto-largo-pipe';
import { ArrobaNombrePipe } from '../pipe/arroba-nombre-pipe';
import { AuthService } from '../../../services/authServices';

@Component({
  imports: [ RouterLink , TiempoRelativoPipe , TexoLargoPipe , ArrobaNombrePipe],
  selector: 'app-publicaciones-ind',
  styleUrl: './publicaciones-ind.css',
  templateUrl: './publicaciones-ind.html',
})
export class PublicacionesInd {
  private authService = inject(AuthService);
  @Input({ required: true }) publi!: Publicacion;
  @Output() like = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  get dioLike(): boolean {
    const userId = this.authService.obtener_usuario();
    const likes = this.publi?.likes;
    if (!userId || !Array.isArray(likes)) {
      return false;
    }

    return likes.some((item: any) => {
      const id = typeof item === 'string' ? item : item?._id ?? item?.toString?.();
      return id?.toString() === userId.toString();
    });
  }

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
