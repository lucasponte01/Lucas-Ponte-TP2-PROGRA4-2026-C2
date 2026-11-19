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
  private tiempo_gracia_modal: any;
  private readonly modal_tiempo_limite = 90 * 1000;// 10 segundos para pruebas (luego 10 * 60 * 1000)
  private readonly tiempo_espera_respuesta = 30 * 1000; // 10 segundos de gracia con el modal abierto (luego poné 2 * 60 * 1000 para 2 min)

  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() { 
    console.log("⏱️ Temporizador de sesión iniciado en el panel...");
    this.iniciarTemporizador();
  }

  ngOnDestroy() {
    this.limpiar_tiempo();
   
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
      // Si el modal sigue abierto porque el usuario no hizo nada, cerramos sesión por fuerza
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
