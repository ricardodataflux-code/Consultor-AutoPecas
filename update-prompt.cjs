const fs = require('fs');
let code = fs.readFileSync('api/query-part.ts', 'utf8');

const oldPrompt = "Com base nessas respostas confirmadas pelo cliente, filtre e forneça agora os códigos de referência únicos e exatos das marcas e todas as 6 seções completas.";
const newPrompt = "Com base nessas respostas confirmadas pelo cliente, filtre e forneça agora os códigos de referência únicos e exatos das marcas e todas as 6 seções completas, LEMBRANDO de buscar onde encontrar essa peça online ou na região de SP/Rio Claro.";

code = code.replace(oldPrompt, newPrompt);

const oldPrompt2 = "NUNCA diga 'verificar no sistema'.";
const newPrompt2 = "NUNCA diga 'verificar no sistema'. Faça a pesquisa real de mercado para preencher a seção ONDE ENCONTRAR (focando em lojas online ou da região de SP / Rio Claro).";

code = code.replace(oldPrompt2, newPrompt2);
fs.writeFileSync('api/query-part.ts', code);
console.log("Updated api/query-part.ts user prompt");
