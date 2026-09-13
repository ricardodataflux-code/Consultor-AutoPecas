const fs = require('fs');
let code = fs.readFileSync('api/query-part.ts', 'utf8');

// Replace the specific instruction for section 6
const oldInstruction6 = `6. ONDE ENCONTRAR (se não tiver em loja - Rio Claro - SP)
- Liste distribuidoras e atacados locais de Rio Claro - SP com rota rápida de entrega e motoboy (Pellegrino Distribuidora, Garcia Autopeças, Bezerra Autopeças, Pit Stop Rio Claro, Disauto).`;

const newInstruction6 = `6. ONDE ENCONTRAR (Pesquisa de Mercado)
- Você DEVE usar a ferramenta de busca do Google para encontrar quem vende ESTA PEÇA ESPECÍFICA (com o código de referência exato) na internet hoje.
- Informe links ou nomes de grandes lojas online (ex: Mercado Livre, MercadoCar, Jocar, Canal da Peça, Shopee) ou distribuidoras que possuem esse código em estoque.
- Se houver estoque local disponível ou distribuidores da marca na região de Rio Claro - SP, priorize mencioná-los. Se não, liste as melhores opções nacionais reais de compra.`;

code = code.replace(oldInstruction6, newInstruction6);

// Add tools: [{ googleSearch: {} }] to the AI call config
const oldConfig = `config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.1,
              },`;
const newConfig = `config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.1,
                tools: [{ googleSearch: {} }],
              },`;

code = code.replaceAll(oldConfig, newConfig);

fs.writeFileSync('api/query-part.ts', code);
console.log("Updated api/query-part.ts");
