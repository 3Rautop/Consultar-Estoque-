const axios = require("axios");
const path = require("path");
const { obterToken } = require("./tokenService");
const xlsx = require("xlsx");

// Caminho fixo da planilha na raiz do projeto
const arquivoPlanilha = path.join(__dirname, "..", "Itens - 3884.xlsx");

// 🔍 Função para ler a planilha e retornar os dados
function lerPlanilha() {
  try {
    const workbook = xlsx.readFile(arquivoPlanilha);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(worksheet);
    if (!dados.length) throw new Error("Planilha vazia ou inválida");
    return dados;
  } catch (err) {
    console.error("❌ Erro ao ler planilha:", err.message);
    return [];
  }
}

// 📦 Buscar todos os anúncios do Mercado Livre
async function buscarTodosAnuncios() {
  const token = obterToken();
  const userRes = await axios.get("https://api.mercadolibre.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const userId = userRes.data.id;

  const limite = 50;
  let offset = 0;
  let todos = [];

  while (true) {
    const url = `https://api.mercadolibre.com/users/${userId}/items/search?offset=${offset}&limit=${limite}`;
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    const ids = res.data.results;
    if (!ids.length) break;

    for (let i = 0; i < ids.length; i += 20) {
      const bloco = ids.slice(i, i + 20);
      const detalhes = await axios.get(`https://api.mercadolibre.com/items?ids=${bloco.join(",")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      todos.push(...detalhes.data.map(item => item.body));
    }

    offset += limite;
    if (offset >= 10000) break;
  }

  return todos;
}

// 🔄 Comparar estoque entre ML e planilha
async function compararEstoque() {
  const anuncios = await buscarTodosAnuncios();
  const planilha = lerPlanilha();

  const resultado = anuncios.map(anuncio => {
    const skuML = anuncio.seller_custom_field || anuncio.sku || anuncio.id;
    const itemPlanilha = planilha.find(p => skuML.endsWith(String(p["CD-ITEM"])));
    if (!itemPlanilha) return null;

    return {
      id: anuncio.id,
      titulo: anuncio.title,
      skuML,
      cdItem: itemPlanilha["CD-ITEM"],
      saldoPlanilha: itemPlanilha["Saldo"],
      saldoML: anuncio.available_quantity,
      diferente: anuncio.available_quantity !== itemPlanilha["Saldo"]
    };
  }).filter(Boolean);

  return resultado;
}

// 🔁 Atualizar estoque no Mercado Livre
async function atualizarEstoque() {
  const token = obterToken();
  const diferencas = await compararEstoque();
  let atualizados = [];

  for (const item of diferencas) {
    if (item.diferente) {
      try {
        await axios.put(
          `https://api.mercadolibre.com/items/${item.id}`,
          { available_quantity: item.saldoPlanilha },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Atualizado: ${item.titulo} | Novo saldo: ${item.saldoPlanilha}`);
        atualizados.push(item.id);
      } catch (err) {
        console.error(`❌ Erro ao atualizar ${item.titulo}:`, err.response?.data || err.message);
      }
    }
  }

  console.log(`🔄 Atualização concluída. Total de anúncios atualizados: ${atualizados.length}`);
  return atualizados;
}

module.exports = {
  buscarTodosAnuncios,
  compararEstoque,
  atualizarEstoque,
  lerPlanilha
};