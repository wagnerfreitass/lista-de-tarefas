const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bem-vindo ao meu primeiro servidor!");
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
