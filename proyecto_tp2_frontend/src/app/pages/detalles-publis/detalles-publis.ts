import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';
import { AuthService } from '../../services/authServices';
import { comentariosServices } from '../../services/comentarios/comentariosService';
import { Publicacion } from '../../interfaces/publicaciones';
import { CampoTextarea } from '../../components/ui/campo-textarea/campo-textarea';
import { ErrorRequerido } from '../../components/ui/error-requerido/error-requerido';
import { ErrorMaxlenght } from '../../components/ui/error-maxlenght/error-maxlenght';

@Component({
  imports: [ReactiveFormsModule, RouterLink, DatePipe, CampoTextarea, ErrorRequerido, ErrorMaxlenght],
  selector: 'app-detalles-publis',
  styleUrl: './detalles-publis.css',
  templateUrl: './detalles-publis.html',
})
export class DetallesPublis {
  private route = inject(ActivatedRoute);
  private publiService = inject(Publicaciones);
  private comentariosService = inject(comentariosServices);
  private authService = inject(AuthService);
  
  error = signal('');

  id_publis = ""
  publicacion = signal<Publicacion | null>(null);
  comentarios = signal<any[]>([]);

  limit = 5;
  offset = 0;
  hasMoreComentarios = signal(true);
  

  comentarioEditandoId: string | null = null;
  textoEditado = '';

  ngOnInit(): void {
    this.id_publis = this.route.snapshot.paramMap.get('id') || '';
    if (this.id_publis) {
      this.cargarDetallePublicacion();
      this.cargarComentarios();
    }
  }

  comentario_Form = new FormGroup({
    mensaje: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(300)], }),
  });


  cargarDetallePublicacion() {
    this.publiService.obtenerPublicaciones_por_id(this.id_publis).subscribe({
      next: (data) => this.publicacion.set(data),
      error: (err) => this.error.set('Error al cargar la publicación.')
    });
  }

  cargarComentarios() {
    this.comentariosService.obtenerComentarios(this.id_publis, this.limit, this.offset).subscribe({
      next: (nuevosComentarios: any[]) => {
        // Acumulamos los comentarios sin pisar los anteriores
        this.comentarios.update(actuales => [...actuales, ...nuevosComentarios]);
        
        // Verificamos si hay más comentarios para cargar
        if (nuevosComentarios.length < this.limit) {
          this.hasMoreComentarios.set(false);
        }
      },
      error: (err) => this.error.set('Error al cargar comentarios.')
    });
  }

  cargarMasComentarios() {
    this.offset += this.limit;
    this.cargarComentarios();
  }

  enviarComentario() {
    const mensaje = this.comentario_Form.controls.mensaje.value;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.error.set('Debes iniciar sesión para comentar.');
      return;
    }

    this.comentariosService.agregarComentario(this.id_publis, mensaje, userId).subscribe({
      next: (nuevoComentario) => {
       
        this.comentarios.update(actuales => [nuevoComentario, ...actuales]);
        this.comentario_Form.reset();
      },
      error: (err) => this.error.set('Error al publicar el comentario.')
    });
  }

  iniciarEdicion(comentario: any) {
    this.comentarioEditandoId = comentario._id;
    this.textoEditado = comentario.mensaje;
  }

  guardarEdicion(comentarioId: string) {
    if (!this.textoEditado.trim()) return;

    this.comentariosService.actualizarComentario(comentarioId, this.textoEditado).subscribe({
      next: (comentarioActualizado) => {
        
        this.comentarios.update(actuales => 
          actuales.map(c => c._id === comentarioId ? { ...c, mensaje: this.textoEditado, modificado: true } : c)
        );
        this.cancelarEdicion();
      },
      error: (err) => this.error.set('Error al actualizar el comentario.')
    });
  }

  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.textoEditado = '';
  }

  cerrarsesion(){
    this.authService.logout()
  }
}

