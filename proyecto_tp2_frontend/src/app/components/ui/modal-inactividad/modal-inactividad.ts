import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authServices';

@Component({
  imports: [],
  selector: 'app-modal-inactividad',
  styleUrl: './modal-inactividad.css',
  templateUrl: './modal-inactividad.html',
})
export class ModalInactividad {
  mostrarModal = signal(false);
  private tiempo_inactivo: any;
  private intervalo_inactivo: any;
  private readonly modal_tiempo_inactivo = 10 * 60 * 1000;

  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.iniciarTemporizador();
    this.registrarEventosActividad();
  }

  ngOnDestroy() {
    this.limpiar_tiempo();
    this.removerEventosActividad();
  }

  private reiniciarContador = () => {
  
    if (this.mostrarModal()) return;

    this.limpiar_tiempo();
    this.iniciarTemporizador();
  }

  private iniciarTemporizador() {
    this.tiempo_inactivo = setTimeout(() => {
      
      this.mostrarModal.set(true);
    }, this.modal_tiempo_inactivo);
  }
  
  private limpiar_tiempo() {
    if (this.tiempo_inactivo) {
      clearTimeout(this.tiempo_inactivo);
    }
  }

  private registrarEventosActividad() {
    window.addEventListener('mousemove', this.reiniciarContador);
    window.addEventListener('keydown', this.reiniciarContador);
    window.addEventListener('click', this.reiniciarContador);
  }

  private removerEventosActividad() {
    window.removeEventListener('mousemove', this.reiniciarContador);
    window.removeEventListener('keydown', this.reiniciarContador);
    window.removeEventListener('click', this.reiniciarContador);
  }

  extenderSesion() {
    try{
      this.auth.extenderSesion();
    }catch (err){
      console.log("error al extender sesion" + err)
    }
  }

  
  cerrarSesionForzada() {
    try{
      this.auth.logout();
      this.mostrarModal.set(false);
    }catch{
      console.log("error al cerrar sesion ")
    }
    
    
  }
}
