# Projeto ML - Manual Rápido

## Estrutura Essencial

/meu-projeto-ml
 ┣ 📂 src
 ┃ ┣ app.js
 ┃ ┣ routes.js
 ┃ ┣ mlService.js
 ┃ ┣ excelService.js
 ┃ ┣ tokenService.js
 ┣ config.json
 ┣ package.json
 ┣ renovar_token.js
 ┗ README.md

## 1️⃣ Token de Acesso
- `tokenService.js` lê `config.json` e retorna `access_token`.
- `renovar_token.js` atualiza token automaticamente quando necessário.

## 2️⃣ Planilha de Estoque
- Nome fixo: `Itens - 3884.xlsx`  
- Sempre na raiz do projeto.  
- Estrutura mínima:

| CD-ITEM | Produto          | Saldo |
|---------|----------------|-------|
| 12345   | Bola de Futebol | 10    |
| 12346   | Bola de Futsal  | 5     |

- `CD-ITEM` → SKU puro  
- `Saldo` → estoque real

## 3️⃣ Funções Principais

### a) Consultar Estoque
- Rota/botão chama `mlService.buscarTodosAnuncios()`.
- Lista todos os anúncios com SKU e quantidade atual no Mercado Livre.

### b) Comparar Estoque
- Rota/botão chama `mlService.compararEstoque()` com a planilha.
- Compara SKU da planilha (`CD-ITEM`) com SKU do ML, **ignorando prefixos** (ex.: `3R12345` → `12345`).  
- Retorna produtos com diferenças de estoque.

### c) Atualizar Estoque
- Rota/botão chama `mlService.atualizarEstoque()`.
- Envia o **saldo exato da planilha** para os anúncios que estiverem diferentes no Mercado Livre.
- Garantia de estoque atualizado automaticamente.

## 4️⃣ Como Usar
1. Coloque a planilha `Itens - 3884.xlsx` na raiz.  
2. Verifique se `config.json` e `renovar_token.js` estão na raiz.  
3. Use os botões ou rotas do `routes.js`:
   - **Consultar Estoque** → lista atual do Mercado Livre  
   - **Comparar Estoque** → identifica divergências  
   - **Atualizar Estoque** → envia saldo correto para o ML  

> ⚠️ Sempre mantenha o nome da planilha igual para que o `excelService.js` funcione corretamente.

## 5️⃣ Observações
- O sistema ignora prefixos no SKU do Mercado Livre.  
- O estoque enviado sempre será o da planilha (`Saldo`).  
- `renovar_token.js` mantém o token atualizado, garantindo que operações do ML nunca falhem.