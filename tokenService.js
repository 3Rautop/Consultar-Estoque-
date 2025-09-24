const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Caminho do config.json na raiz do projeto
const configPath = path.join(__dirname, "..", "config.json");

function obterToken() {
  let config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  
  const agora = new Date();
  // Verifica se o token expirou
  if (new Date(config.expires_at) <= agora) {
    console.log("⏳ Token expirado, renovando automaticamente...");
    // Executa o renovar_token.js
    execSync("node renovar_token.js", { stdio: "inherit" });
    // Recarrega o config atualizado
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }

  return config.access_token;
}

module.exports = { obterToken };