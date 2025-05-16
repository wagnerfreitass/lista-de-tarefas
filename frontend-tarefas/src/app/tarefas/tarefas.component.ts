import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css']
})
export class TarefasComponent {
  tarefas: any[] = [];
  novaTarefa = '';
  token = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
    if (this.token) {
      this.carregarTarefas();
    } else {
      console.warn('Nenhum token encontrado!');
    }
  }

carregarTarefas() {
  if (!this.token) {
    console.warn('⚠️ Sem token, não carregando tarefas.');
    return;
  }

  console.log('🔵 Carregando tarefas com token:', this.token); // ADICIONA ISSO

  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  this.http.get<any[]>('http://localhost:3000/tarefas', { headers })
    .subscribe({
      next: (dados) => {
        this.tarefas = dados;
        console.log('✅ Tarefas carregadas:', dados);
      },
      error: (err) => console.error('❌ Erro ao carregar tarefas:', err)
    });
}


  adicionarTarefa(event: Event) {
    event.preventDefault();
    if (!this.token) return;

    const nova = { titulo: this.novaTarefa };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.post<any>('http://localhost:3000/tarefas', nova, { headers })
      .subscribe({
        next: (tarefaCriada) => {
          this.tarefas.push(tarefaCriada);
          this.novaTarefa = '';
          console.log('Tarefa adicionada:', tarefaCriada);
        },
        error: (err) => console.error('Erro ao adicionar tarefa:', err)
      });
  }

  deletarTarefa(id: number) {
    if (!this.token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.delete(`http://localhost:3000/tarefas/${id}`, { headers })
      .subscribe({
        next: () => {
          this.tarefas = this.tarefas.filter(t => t.id !== id);
          console.log('Tarefa deletada:', id);
        },
        error: (err) => console.error('Erro ao deletar tarefa:', err)
      });
  }
}
