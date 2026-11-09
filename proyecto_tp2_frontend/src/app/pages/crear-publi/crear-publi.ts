import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';
import { CampoInput } from '../../components/ui/campo-input/campo-input';
import { CampoTextarea } from '../../components/ui/campo-textarea/campo-textarea';
import { ErrorRequerido } from '../../components/ui/error-requerido/error-requerido';
import { ErrorMinlenght } from '../../components/ui/error-minlenght/error-minlenght';

@Component({
  imports: [ReactiveFormsModule, RouterLink, CampoInput, CampoTextarea, ErrorRequerido, ErrorMinlenght],
  selector: 'app-crear-publi',
  styleUrl: './crear-publi.css',
  templateUrl: './crear-publi.html',
})
export class CrearPubli {
  error = signal("");
  private publicacionesService = inject(Publicaciones);
  archivoSeleccionado: File | null = null;
  router = inject(Router);

    publi_form = new FormGroup({
      titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
      mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    });

  ElegirArchivo(evento: Event) {
    const file = (evento.target as HTMLInputElement).files?.[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  crear_publi(){
    this.error.set("")

    const titulo = this.publi_form.get('titulo')?.value ?? '';
    const mensaje = this.publi_form.get('mensaje')?.value ?? '';

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('mensaje', mensaje);

    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }

    this.publicacionesService.crearPublicacion(formData).subscribe((data: any) => {
      console.log("Publicación creada con éxito:", data);
    }, (error: any) => {
      this.error.set("Error al crear la publicación: " + error.message);
    });
  }
}
