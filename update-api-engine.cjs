const fs = require('fs');
let code = fs.readFileSync('api/query-part.ts', 'utf8');

const oldStr = `  const rioClaroSuppliers = \`- Pellegrino Distribuidora de Autopeças (Rio Claro - SP - Rota expressa para balcão e oficinas)
- Garcia Autopeças & Distribuidora (Rio Claro - SP - Pronta entrega balcão / Linha suspensão e freio)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP - Atacado e entrega rápida)
- Pit Stop Autopeças (Rio Claro - SP - Linha elétrica, injeção e arrefecimento)
- Disauto Distribuidora de Autopeças (Rio Claro - SP - Moto-entrega expressa)\`;`;

const newStr = `  const rioClaroSuppliers = \`- (Busca Automática Offline) Consulte distribuidores regionais oficiais (ex: Pellegrino, Garcia, Bezerra) ou plataformas como MercadoCar, Jocar e Mercado Livre (Canal da Peça) utilizando o código de referência acima.\`;`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('api/query-part.ts', code);
console.log("Updated api/query-part.ts fallback text");
