const express = require("express");
const router = express.Router();
const mlService = require("./mlService");

// ✅ Consultar estoque
router.get("/consultar-estoque", async (req, res) => {
  try {
    const anuncios = await mlService.buscarTodosAnuncios();
    res.json({ total: anuncios.length, anuncios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao consultar anúncios" });
  }
});

// 🔄 Comparar estoque
router.get("/comparar-estoque", async (req, res) => {
  try {
    const resultado = await mlService.compararEstoque();
    res.json({ divergencias: resultado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao comparar estoque" });
  }
});

// 🔁 Atualizar estoque
router.post("/atualizar-estoque", async (req, res) => {
  try {
    const atualizados = await mlService.atualizarEstoque();
    res.json({ atualizados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao atualizar estoque" });
  }
});

module.exports = router;