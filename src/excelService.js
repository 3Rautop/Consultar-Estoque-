const XLSX = require("xlsx");

function lerExcel(caminhoArquivo) {
  const workbook = XLSX.readFile(caminhoArquivo);
  const sheetName = workbook.SheetNames[0];
  const dados = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return dados;
}

module.exports = { lerExcel };