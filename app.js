const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const segredo = 'meu_segredo_superforte';

app.use(cors());
app.use(express.json());

// Middleware de autenticação
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não enviado' });

  jwt.verify(token, segredo, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });
    req.usuario = usuario;
    next();
  });
}

// Funções para lidar com tarefas por usuário
function lerTodasTarefas() {
  if (!fs.existsSync('tarefas.json')) return {};
  const data = fs.readFileSync('tarefas.json', 'utf-8');
  return JSON.parse(data);
}

function salvarTodasTarefas(tarefasPorUsuario) {
  fs.writeFileSync('tarefas.json', JSON.stringify(tarefasPorUsuario, null, 2));
}

// GET - listar tarefas
app.get('/tarefas', autenticarToken, (req, res) => {
  const tarefasPorUsuario = lerTodasTarefas();
  const tarefas = tarefasPorUsuario[req.usuario.id] || [];
  res.json(tarefas);
});

// POST - adicionar tarefa
app.post('/tarefas', autenticarToken, (req, res) => {
  const tarefasPorUsuario = lerTodasTarefas();
  const usuarioId = req.usuario.id;

  if (!tarefasPorUsuario[usuarioId]) tarefasPorUsuario[usuarioId] = [];

  const novaTarefa = {
    id: Date.now(),
    titulo: req.body.titulo
  };

  tarefasPorUsuario[usuarioId].push(novaTarefa);
  salvarTodasTarefas(tarefasPorUsuario);
  res.status(201).json(novaTarefa);
});

// PUT - atualizar tarefa
app.put('/tarefas/:id', autenticarToken, (req, res) => {
  const tarefasPorUsuario = lerTodasTarefas();
  const usuarioId = req.usuario.id;
  const id = parseInt(req.params.id);

  const tarefas = tarefasPorUsuario[usuarioId] || [];
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });

  tarefa.titulo = req.body.titulo;
  salvarTodasTarefas(tarefasPorUsuario);
  res.json(tarefa);
});

// DELETE - remover tarefa
app.delete('/tarefas/:id', autenticarToken, (req, res) => {
  const tarefasPorUsuario = lerTodasTarefas();
  const usuarioId = req.usuario.id;
  const id = parseInt(req.params.id);

  if (!tarefasPorUsuario[usuarioId]) return res.status(204).send();

  tarefasPorUsuario[usuarioId] = tarefasPorUsuario[usuarioId].filter(t => t.id !== id);
  salvarTodasTarefas(tarefasPorUsuario);
  res.status(204).send();
});

// Rota principal
app.get('/', (req, res) => {
  res.send('API de Tarefas com dados por usuário');
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, segredo, { expiresIn: '15m' });
  res.json({ token });
});

// CADASTRO
app.post('/usuarios', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));
  if (usuarios.find(u => u.email === email)) return res.status(409).json({ erro: 'Usuário já existe' });

  const novoUsuario = { id: usuarios.length + 1, email, senha };
  usuarios.push(novoUsuario);
  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));
  res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
});

// ALTERAR SENHA
app.put('/usuarios/:id', (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const id = parseInt(req.params.id);

  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
  if (usuario.senha !== senhaAtual) return res.status(403).json({ erro: 'Senha atual incorreta' });

  usuario.senha = novaSenha;
  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2));
  res.json({ mensagem: 'Senha atualizada com sucesso' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
