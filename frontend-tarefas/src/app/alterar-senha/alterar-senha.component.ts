import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent {
  senhaAtual = '';
  novaSenha = '';

  constructor(private http: HttpClient, private router: Router) {}

  alterarSenha(event: Event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado!');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const dados = {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    };

    this.http.put('http://localhost:3000/alterar-senha', dados, { headers })
      .subscribe({
        next: () => {
          alert('Senha alterada com sucesso!');
          this.router.navigate(['/tarefas']);
        },
        error: (err) => {
          console.error('Erro ao alterar senha:', err);
          alert('Erro ao alterar senha!');
        }
      });
  }
}
