import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampoInput } from '../../components/ui/campo-input/campo-input';
import { ErrorRequerido } from '../../components/ui/error-requerido/error-requerido';
import { ErrorMinlenght } from '../../components/ui/error-minlenght/error-minlenght';
import { ErrorEmail } from '../../components/ui/error-email/error-email';
import { ErrorPattern } from '../../components/ui/error-pattern/error-pattern';
import { CampoTextarea } from '../../components/ui/campo-textarea/campo-textarea';
import { AuthService } from '../../services/authServices';
@Component({
  imports: [ReactiveFormsModule, CampoInput, ErrorRequerido, ErrorMinlenght, ErrorEmail, ErrorPattern, CampoTextarea],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  error = signal(false)
  mensaje = signal("")
  private authService = inject(AuthService);


  registro_form = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    nombreUsuario: new FormControl('', [Validators.required, Validators.minLength(4)]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/)]),
    fechaNacimiento: new FormControl('', Validators.required),
    descripcionBreve: new FormControl(''),
    imagenPerfil: new FormControl(null)
  });

  async enviar() {
    this.mensaje.set("");
    this.error.set(false);

    if (!this.registro_form.valid) {
      this.registro_form.markAllAsTouched();
      return;
    }

    this.authService.register(this.registro_form.value).subscribe({
      next: (data: any) => {
        this.error.set(false);
        this.mensaje.set("¡Registro exitoso!");
        
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error en el registro:', err);
        this.error.set(true);
        this.mensaje.set(err.error?.message || 'Ocurrió un error al registrarse.');
      }
    });
  }
}