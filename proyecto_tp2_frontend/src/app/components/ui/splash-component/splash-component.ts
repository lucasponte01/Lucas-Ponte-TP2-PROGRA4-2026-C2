import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authServices';

@Component({
  imports: [],
  selector: 'app-splash-component',
  styleUrl: './splash-component.css',
  templateUrl: './splash-component.html',
})
export class SplashComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);


  ngOnInit() {
    this.verificarToken_Redirigir();
  }

  private verificarToken_Redirigir() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }
    try{
      this.auth.verificar_token();
    }catch (err){
      console.log("")
    }
    
  }
}
