import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  imports: [FormsModule, RouterLink, CommonModule, HttpClientModule] // <<< IMPORTADO RouterLink aqui
})
export class CadastroComponent {
  email = '';
  senha = '';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(event: Event) {
    event.preventDefault();

    const novoUsuario = { email: this.email, senha: this.senha };

    this.http.post('http://localhost:3000/usuarios', novoUsuario)
      .subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.email = '';
          this.senha = '';
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao cadastrar usuário!');
        }
      });
  }
}
