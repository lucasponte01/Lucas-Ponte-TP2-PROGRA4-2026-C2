import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';

@Component({
  imports: [ReactiveFormsModule , RouterLink],
  selector: 'app-crear-publi',
  styleUrl: './crear-publi.css',
  templateUrl: './crear-publi.html',
})
export class CrearPubli {
  error = signal("");
  private publicacionesService = inject(Publicaciones);
  router = inject(Router);
  publi_form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    imagen: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

    crear_publi(){
    this.error.set("")

    this.publicacionesService.crearPublicacion(this.publi_form.getRawValue()).subscribe((data: any) => {
      console.log("Publicación creada con éxito:", data);
      
    }, (error: any) => {
      this.error.set("Error al crear la publicación: " + error.message);
      }
  )};
}
