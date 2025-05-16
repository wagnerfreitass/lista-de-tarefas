import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { TarefasComponent } from './tarefas/tarefas.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'tarefas', component: TarefasComponent },
  { path: 'alterar-senha', component: AlterarSenhaComponent },
  { path: '**', redirectTo: '/login' }
];
