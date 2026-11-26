import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/EstadisticasService';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/authServices';
Chart.register(...registerables);


@Component({
  imports: [],
  selector: 'app-estadisticas-admin',
  styleUrl: './estadisticas-admin.css',
  templateUrl: './estadisticas-admin.html',
})
export class EstadisticasAdmin {
    private statsService = inject(EstadisticasService);
    private auth = inject(AuthService);

  lapso = signal<'7d' | '30d' | '90d' | 'all'>('7d');

  @ViewChild('chartPublisUsuario') canvasPublisUsuario!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartComentariosPeriodo') canvasComentariosPeriodo!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartComentariosPubli') canvasComentariosPubli!: ElementRef<HTMLCanvasElement>;

  error = signal<string>('');
  private chart1?: Chart;
  private chart2?: Chart;
  private chart3?: Chart;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  ngOnDestroy(): void {
    this.destruirGraficos();
  }

cambiarLapso(nuevoLapso: '7d' | '30d' | '90d' | 'all') {
  this.lapso.set(nuevoLapso);
  this.cargarEstadisticas();
}

seleccionar_lapso(event: Event) {
  const select = event.target as HTMLSelectElement;
  this.cambiarLapso(select.value as '7d' | '30d' | '90d' | 'all');
}

  private obtenerRangoFechas(): { desde?: string; hasta?: string } {
    const lapso = this.lapso();
    if (lapso === 'all') return {};

    const dias = lapso === '7d' ? 7 : lapso === '30d' ? 30 : 90;
    const desdeDate = new Date();
    desdeDate.setDate(desdeDate.getDate() - dias);

    return {
      desde: desdeDate.toISOString(),
      hasta: new Date().toISOString(),
    };
  }

  cargarEstadisticas() {
    this.error.set('');
    const { desde, hasta } = this.obtenerRangoFechas();

    forkJoin({
      publisUsuario: this.statsService.getPublicacionesPorUsuario(desde, hasta),
      comentariosPeriodo: this.statsService.getComentariosPorPeriodo(desde, hasta),
      comentariosPubli: this.statsService.getComentariosPorPublicacion(desde, hasta),
    }).subscribe({
      next: ({ publisUsuario, comentariosPeriodo, comentariosPubli }) => {
        this.renderizarGraficos(publisUsuario, comentariosPeriodo, comentariosPubli);
      },
      error: (err) => {
        this.error.set(
          'No se pudieron cargar las estadísticas: ' + (err.error?.message || err.message)
        );
      },
    });
  }

  private destruirGraficos() {
    this.chart1?.destroy();
    this.chart2?.destroy();
    this.chart3?.destroy();
  }

  private renderizarGraficos(
    publisUsuario: { nombreUsuario: string; cantidad: number }[],
    comentariosPeriodo: { fecha: string; cantidad: number }[],
    comentariosPubli: { titulo: string; cantidad: number }[]
  ) {
    this.destruirGraficos();


    // 1. Gráfico de BARRAS: Publicaciones por usuario
    if (this.canvasPublisUsuario) {
      this.chart1 = new Chart(this.canvasPublisUsuario.nativeElement, {
        type: 'bar',
        data: {
          labels: publisUsuario.map((item) => `@${item.nombreUsuario}`),
          datasets: [
            {
              label: 'Publicaciones',
              data: publisUsuario.map((item) => item.cantidad),
              backgroundColor: '#F28705',
              borderColor: '#F2A649',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#ffffff' } } },
          scales: {
            x: { ticks: { color: '#f3d5a3' } },
            y: { beginAtZero: true, ticks: { stepSize: 1, color: '#f3d5a3' } },
          },
        },
      });
    }

    // 2. Gráfico de LÍNEAS: Comentarios en el tiempo
    if (this.canvasComentariosPeriodo) {
      this.chart2 = new Chart(this.canvasComentariosPeriodo.nativeElement, {
        type: 'line',
        data: {
          labels: comentariosPeriodo.map((item) => item.fecha),
          datasets: [
            {
              label: 'Comentarios',
              data: comentariosPeriodo.map((item) => item.cantidad),
              borderColor: '#F2A649',
              backgroundColor: 'rgba(242, 135, 5, 0.2)',
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#ffffff' } } },
          scales: {
            x: { ticks: { color: '#f3d5a3' } },
            y: { beginAtZero: true, ticks: { stepSize: 1, color: '#f3d5a3' } },
          },
        },
      });
    }

    // 3. Gráfico de TORTA / DONA: Comentarios por publicación
    if (this.canvasComentariosPubli) {
      const paleta = ['#F28705', '#F2A649', '#ff5c5c', '#a855f7', '#38bdf8', '#4ade80'];
      this.chart3 = new Chart(this.canvasComentariosPubli.nativeElement, {
        type: 'doughnut',
        data: {
          labels: comentariosPubli.map((item) => item.titulo),
          datasets: [
            {
              label: 'Comentarios',
              data: comentariosPubli.map((item) => item.cantidad),
              backgroundColor: comentariosPubli.map((_, idx) => paleta[idx % paleta.length]),
              borderColor: '#1a0517',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#ffffff' } } },
        },
      });
    }
  }

  cerrarSesion(){
    this.auth.logout()
  }
}
