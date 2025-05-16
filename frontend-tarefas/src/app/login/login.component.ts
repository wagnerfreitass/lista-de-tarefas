import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class LoginComponent {
  email = '';
  senha = '';

  constructor(private router: Router, private http: HttpClient) {}

  fazerLogin(event: Event) {
    event.preventDefault();

    const loginData = {
      email: this.email,
      senha: this.senha
    };

    this.http.post<any>('http://localhost:3000/login', loginData)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          // 👇 FORÇAR RECARREGAR O APP depois do login
          window.location.href = '/tarefas'; 
        },
        error: (err) => {
          console.error('Erro no login:', err);
          alert('Login inválido!');
        }
      });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
