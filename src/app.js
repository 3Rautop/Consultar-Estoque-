// app.js
const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ler JSON (se precisar enviar dados via POST)
app.use(express.json());

// Rotas principais
app.use("/api", routes);

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});