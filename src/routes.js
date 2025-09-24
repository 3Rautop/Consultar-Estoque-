const express = require("express");
const router = express.Router();
const { buscarTodosAnuncios } = require("./mlService");

// ✅ Consultar estoque
router.get("/consultar-estoque", async (req, res) => {
  try {
    const anuncios = await buscarTodosAnuncios();
    res.json({ total: anuncios.length, anuncios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao consultar anúncios" });
  }
});

// 🔹 Aqui você adiciona /comparar-estoque e /atualizar-estoque
// Exemplo:
// router.post("/comparar-estoque", async (req, res) => { ... });

module.exports = router;