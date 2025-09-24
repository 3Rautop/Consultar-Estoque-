// 👉 Troque pela URL do seu backend no Render
const API_URL = "https://consultar-estoque.onrender.com";

function mostrarResultado(titulo, dados) {
  const output = document.getElementById("output");

  if (Array.isArray(dados)) {
    // Se for lista (ex.: estoque), mostra tabela
    let tabela = `<h3>${titulo}</h3><table border="1" cellpadding="5" cellspacing="0"><tr>`;
    const colunas = Object.keys(dados[0] || {});
    tabela += colunas.map(c => `<th>${c}</th>`).join("") + "</tr>";
    dados.forEach(item => {
      tabela += "<tr>" + colunas.map(c => `<td>${item[c]}</td>`).join("") + "</tr>";
    });
    tabela += "</table>";
    output.innerHTML = tabela;
  } else {
    // Se não for lista, mostra JSON formatado
    output.innerHTML = `<h3>${titulo}</h3><pre>${JSON.stringify(dados, null, 2)}</pre>`;
  }
}

async function consultarEstoque() {
  try {
    const res = await fetch(`${API_URL}/consultar`);
    const data = await res.json();
    mostrarResultado("📦 Estoque Atual", data);
  } catch (err) {
    console.error(err);
    alert("Erro ao consultar estoque.");
  }
}

async function compararEstoque() {
  try {
    const res = await fetch(`${API_URL}/comparar`);
    const data = await res.json();
    mostrarResultado("🔍 Diferenças Encontradas", data);
  } catch (err) {
    console.error(err);
    alert("Erro ao comparar estoque.");
  }
}

async function atualizarEstoque() {
  try {
    const res = await fetch(`${API_URL}/atualizar`, { method: "POST" });
    const data = await res.json();
    mostrarResultado("✅ Estoque Atualizado", data);
  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar estoque.");
  }
}

document.getElementById("btnConsultar").addEventListener("click", consultarEstoque);
document.getElementById("btnComparar").addEventListener("click", compararEstoque);
document.getElementById("btnAtualizar").addEventListener("click", atualizarEstoque);