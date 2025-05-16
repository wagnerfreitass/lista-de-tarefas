import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-tarefas';
  logado = false;

  constructor(public router: Router, private http: HttpClient) {
    this.atualizarStatusLogin();
  }

  atualizarStatusLogin() {
    this.logado = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.atualizarStatusLogin();
    this.router.navigate(['/login']);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
