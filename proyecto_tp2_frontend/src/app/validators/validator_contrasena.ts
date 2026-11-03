import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const contrasena_igual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const contrasena = control.get('contrasena');
  const repetirContrasena = control.get('repetir_contrasena');

  if (contrasena && repetirContrasena && contrasena.value !== repetirContrasena.value) {
    return { contrasena: true };
  }
  return null;
};