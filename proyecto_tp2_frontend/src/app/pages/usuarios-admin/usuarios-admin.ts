import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { admin } from '../../services/admin/admin';
import { AuthService } from '../../services/authServices';
import { UsuarioAdmin } from '../../interfaces/usuarios';
import { ArrobaNombrePipe } from '../../components/ui/pipe/arroba-nombre-pipe';
import { CampoInput } from '../../components/ui/campo-input/campo-input';
import { ErrorRequerido } from '../../components/ui/error-requerido/error-requerido';
import { ErrorEmail } from '../../components/ui/error-email/error-email';
import { ErrorMinlenght } from '../../components/ui/error-minlenght/error-minlenght';
import { ErrorPattern } from '../../components/ui/error-pattern/error-pattern';
import { contrasena_igual } from '../../validators/validator_contrasena';
import { CampoTextarea } from '../../components/ui/campo-textarea/campo-textarea';

@Component({
  imports: [ReactiveFormsModule, RouterLink, ArrobaNombrePipe, CampoInput, ErrorRequerido, ErrorEmail, ErrorMinlenght, ErrorPattern, CampoTextarea],
  selector: 'app-usuarios-admin',
  styleUrl: './usuarios-admin.css',
  templateUrl: './usuarios-admin.html',
})
export class UsuariosAdmin implements OnInit{
  private adminService = inject(admin);
  private authService = inject(AuthService);
  
  vistaActiva = signal<string>('listado');
  usuarios = signal<UsuarioAdmin[]>([]);
  error = signal<string>('');
  archivoSeleccionado: File | null = null;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cambiarVista(vista: string): void {
    this.error.set('');;
    this.vistaActiva.set(vista);
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.error.set('');
    this.adminService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
      },
      error: (err) => {
        this.error.set(
          'Error al cargar los usuarios: ' + (err.error?.message || err.message)
        );
      },
    });
  }

  //crear usuario
  usuarioForm_crear = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required , Validators.email]),
    nombreUsuario: new FormControl('', [Validators.required]),
    contrasena : new FormControl('', [Validators.required , Validators.minLength(8),Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/)]),
    repetir_contrasena: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    descripcionBreve: new FormControl(''),
    perfil: new FormControl('usuario', [Validators.required]),
  },{ validators: [contrasena_igual] });

  archivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  crearUsuario(): void {
    this.error.set('');
    const formData = new FormData();
    const valores = this.usuarioForm_crear.value;

    formData.append('nombre', valores.nombre || '');
    formData.append('apellido', valores.apellido || '');
    formData.append('correo', valores.correo || '');
    formData.append('nombreUsuario', valores.nombreUsuario || '');
    formData.append('contrasena', valores.contrasena || '');
    formData.append('repetir_contrasena', valores.repetir_contrasena || '');
    formData.append('fechaNacimiento', valores.fechaNacimiento || '');
    if (valores.descripcionBreve) {
      formData.append('descripcionBreve', valores.descripcionBreve);
    }
    formData.append('perfil', valores.perfil || 'usuario');

    if (this.archivoSeleccionado) {
      formData.append('imagenPerfil', this.archivoSeleccionado);
    }

    this.adminService.crearUsuario(formData).subscribe({
      
      next: (res) => {
        this.usuarioForm_crear.reset({ perfil: 'usuario' });
        this.archivoSeleccionado = null;
        console.log("creado " + res)
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error.set("error al crear usuario o administrador")
      },
    });
  }

  darDeBaja(id: string): void {
    this.error.set('');
    this.adminService.deshabilitarUsuario(id).subscribe({
      next: (res) => {
        console.log('Usuario deshabilitado');
        this.cargarUsuarios();
      },
      error: (err) => { this.error.set( 'Error al deshabilitar usuario: ' + (err.error?.message || err.message));},
    });
  }

  darDeAlta(id: string): void {
    this.error.set('');
    ;
    this.adminService.rehabilitarUsuario(id).subscribe({
      next: (res) => {
        console.log('Usuario rehabilitado');
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error.set(
          'Error al rehabilitar usuario: ' + (err.error?.message || err.message));},
    });
  }

  //editar usuario 
  usuarioSeleccionado = signal<UsuarioAdmin | null>(null);

  formEdicion = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required , Validators.email]),
    nombreUsuario: new FormControl('', [Validators.required]),
    descripcionBreve: new FormControl(''),
    perfil: new FormControl('usuario', [Validators.required]),
  })
    
  seleccionarParaEditar(usuario: UsuarioAdmin): void {
    this.usuarioSeleccionado.set(usuario);
    this.formEdicion.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      descripcionBreve: usuario.descripcionBreve || '',
      perfil: usuario.perfil,
    });
  }

  guardarEdicion(): void {
    this.error.set('');
    const sel = this.usuarioSeleccionado();
    if (!sel) return;

    this.adminService.actualizar_usuario(sel._id, this.formEdicion.value).subscribe({
      next: () => {
        this.usuarioSeleccionado.set(null);
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error.set(
          'Error al actualizar usuario: ' + (err.error?.message || err.message)
        );
      },
    });
  }

  

  cerrarSesion(): void {
    this.authService.logout();
  }

}
