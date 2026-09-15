const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const start = Date.now();
  console.log('starting...');
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Preciso dos códigos de referência para a seguinte peça:
- Peça: Pastilha de freio dianteira
- Veículo: Hyundai HB20
- Ano: 2016
- Motorização: 1.0 12V 3 Cilindros Flex
- Observações do cliente: Verificar se sistema é Teves ou Mando e se tem ABS.

INSTRUÇÃO CRÍTICA: Você DEVE usar a ferramenta de Busca do Google AGORA para consultar catálogos oficiais (ex: NGK, Bosch, Nakata, etc) na internet para ESTE veículo exato. Não tente adivinhar. Pesquise e traga os códigos REAIS de aplicação. Use o bloco <thinking> no início para mostrar os termos que você pesquisou e o raciocínio.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4
      }
    });
    console.log('took', Date.now() - start, 'ms');
    console.log(res.text);
  } catch (e) {
    console.log('Error:', e);
  }
}
run();
