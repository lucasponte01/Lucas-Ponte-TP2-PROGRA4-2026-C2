import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalInactividad } from './components/ui/modal-inactividad/modal-inactividad';

@Component({
  imports: [RouterOutlet, ModalInactividad],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('proyecto_tp2_frontend');

}
