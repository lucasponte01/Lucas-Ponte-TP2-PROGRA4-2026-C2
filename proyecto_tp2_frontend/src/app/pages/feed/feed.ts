import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';
import { Publicacion } from '../../interfaces/publicaciones';

@Component({
  imports: [ReactiveFormsModule,RouterLink],
  selector: 'app-feed',
  styleUrl: './feed.css',
  templateUrl: './feed.html',
})
export class Feed implements OnInit{
  error = signal("");
  publi_services = inject(Publicaciones);
  publicaciones = signal<Publicacion[]>([]);


ngOnInit(): void {
    this.cargarFeed();
  }

  cargarFeed() {
    this.error.set(""); 
    this.publi_services.obtenerPublicaciones().subscribe((data: any) => {
      this.publicaciones.set(data);
    }, (error) => {
      this.error.set("Error al obtener las publicaciones. Por favor, inténtelo de nuevo más tarde." + error.message);
    });   
  }
}
