import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampoInput } from '../../components/ui/campo-input/campo-input';
import { ErrorRequerido } from '../../components/ui/error-requerido/error-requerido';
import { ErrorMinlenght } from '../../components/ui/error-minlenght/error-minlenght';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authServices';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule, CampoInput, ErrorRequerido, ErrorMinlenght, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  error = signal(false)
  mensaje = signal("")
  private authService = inject(AuthService);

  
  login_form= new FormGroup({
    identificador: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    contrasena: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/)] })
  });

  enviar(){
    this.mensaje.set("")
    if (!this.login_form.valid) {
      return
    }
    this.authService.login(this.login_form.getRawValue()).subscribe({
      next: () => {
        this.error.set(false)
        this.mensaje.set("login exitoso")
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(true)
        this.mensaje.set(err.error?.message || 'Ocurrió un error al iniciar sesion.');
      }
    });
  }

  
}
