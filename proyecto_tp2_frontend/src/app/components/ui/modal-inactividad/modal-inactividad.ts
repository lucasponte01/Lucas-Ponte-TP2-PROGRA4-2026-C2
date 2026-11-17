import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authServices';

@Component({
  imports: [],
  selector: 'app-modal-inactividad',
  styleUrl: './modal-inactividad.css',
  templateUrl: './modal-inactividad.html',
})
export class ModalInactividad implements OnInit, OnDestroy {
  mostrarModal = signal(false);
  private tiempo_inactivo: any;
  private intervalo_inactivo: any;
  private readonly modal_tiempo_limite = 10 * 1000;

  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.iniciarTemporizador();
    }
    console.log("Tiempo de sesión corriendo");
  }

  ngOnDestroy() {
    this.limpiar_tiempo();
   
  }

  private iniciarTemporizador() {
    this.tiempo_inactivo = setTimeout(() => {
      
      this.mostrarModal.set(true);
    }, this.modal_tiempo_limite);
  }
  
  private limpiar_tiempo() {
    if (this.tiempo_inactivo) {
      clearTimeout(this.tiempo_inactivo);
    }
  }

  extenderSesion() {
    try{
      this.auth.extenderSesion();
      this.limpiar_tiempo();
    }catch (err){
      console.log("error al extender sesion" + err)
      this.cerrarSesionForzada();
    }
  }

  
  cerrarSesionForzada() {
    try{
      this.auth.logout();
      this.mostrarModal.set(false);
    }catch (err) {
      console.log("Error al cerrar sesión:", err);
    }
  }
}
