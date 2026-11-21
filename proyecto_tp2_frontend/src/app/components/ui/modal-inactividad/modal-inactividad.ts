import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/authServices';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-modal-inactividad',
  styleUrl: './modal-inactividad.css',
  templateUrl: './modal-inactividad.html',
})
export class ModalInactividad implements OnInit, OnDestroy {
  mostrarModal = signal(false);
  private tiempo_inactivo: any;
  private tiempo_gracia_modal: any;
  private intervalo_token: any;
  private readonly modal_tiempo_limite = 90 * 1000;// 10 * 60 * 1000
  private readonly tiempo_espera_respuesta = 30 * 1000; //  2 * 60 * 1000 

  private auth = inject(AuthService);
  private root = inject(Router)

  ngOnInit() { 
    console.log("⏱️ Temporizador de sesión iniciado en el panel...");
    this.iniciarTemporizador();
    this.monitorTokenLocal()
  }

  ngOnDestroy() {
    this.limpiar_tiempo();
    if (this.intervalo_token) {
      clearInterval(this.intervalo_token);
      this.intervalo_token = null;
    }
  }

  private iniciarTemporizador() {
    this.limpiar_tiempo();
    
    this.tiempo_inactivo = setTimeout(() => {
      this.mostrarModal.set(true);
      this.iniciarTiempoDeGracia();
    }, this.modal_tiempo_limite);
  }
  
  private limpiar_tiempo() {
    if (this.tiempo_inactivo) {
      clearTimeout(this.tiempo_inactivo);
    }
  }

  private iniciarTiempoDeGracia() {
    if (this.tiempo_gracia_modal) {
      clearTimeout(this.tiempo_gracia_modal);
    }

    this.tiempo_gracia_modal = setTimeout(() => {
      
      if (this.mostrarModal()) {
        console.log("🛑 Tiempo de gracia agotado sin respuesta. Cerrando sesión automáticamente...");
        this.cerrarSesionForzada();
      }
    }, this.tiempo_espera_respuesta);
  }

  private limpiar_todos_los_tiempos() {
    if (this.tiempo_inactivo) {
      clearTimeout(this.tiempo_inactivo);
      this.tiempo_inactivo = null;
    }
    if (this.tiempo_gracia_modal) {
      clearTimeout(this.tiempo_gracia_modal);
      this.tiempo_gracia_modal = null;
    }
  }

  private monitorTokenLocal() {
    if (this.intervalo_token) {
      clearInterval(this.intervalo_token);
    }

    this.intervalo_token = setInterval(() => {
      const token = localStorage.getItem('token');
      const enRutaPublica =
        this.root.url.includes('/login') ||
        this.root.url.includes('/registro') ||
        this.root.url === '/';

      if (!token && !enRutaPublica) {
        
        this.cerrarSesionForzada();
      }
    }, 1500);
  }


  extenderSesion() {
    try{
      this.auth.extenderSesion();
      this.mostrarModal.set(false);
      this.limpiar_todos_los_tiempos();
      this.iniciarTemporizador()
    }catch (err){
      console.log("error al extender sesion" + err)
      this.cerrarSesionForzada();
    }
  }

  
  cerrarSesionForzada() {
    try{
      this.limpiar_todos_los_tiempos();
      this.auth.logout();
      this.mostrarModal.set(false);
    }catch (err) {
      console.log("Error al cerrar sesión:", err);
    }
  }
}
