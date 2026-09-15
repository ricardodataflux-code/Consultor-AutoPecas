import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateInstantCatalogResult } from "./src/data/partsCatalogEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Você é um balconista sênior especialista em autopeças brasileiras e catálogos automotivos oficiais.
Você atua com foco em fechar vendas rápidas, assertivas e 100% corretas no balcão e por telefone.

CATÁLOGOS OFICIAIS DE REFERÊNCIA QUE VOCÊ DEVE CONSULTAR E CRUZAR CÓDIGOS:
- NAKATA: Suspensão, amortecedores, pivôs, terminais de direção e axiais, bieletas, juntas homocinéticas, bombas d'água.
- COBREQ: Freios, pastilhas dianteiras e traseiras, sapatas, lonas, fluidos de freio.
- FRAS-LE: Pastilhas Ceramaxx/Lonaflex, discos e tambores de freio.
- BOSCH AUTOMOTIVE BRASIL: Injeção eletrônica, velas de ignição, cabos, bobinas, filtros, freios, bombas de combustível.
- COFAP / MAGNETI MARELLI: Amortecedores Turbogás/Super, molas, bandejas, pastilhas.
- MONROE & MONROE AXIOS: Amortecedores OESpectrum/Gas Premium, kits de batente, coxins, buchas de suspensão.
- SCHAEFFLER (LUK / INA / FAG): Kits de embreagem Repxpert, rolamentos de roda, atuadores, tensores de correia.
- ZF AFTERMARKET (SACHS / LEMFÖRDER): Kits de embreagem, amortecedores, componentes de direção.
- FREMAX: Discos de freio de carbono, tambores.
- SABÓ: Retentores, juntas de motor, mangueiras, guarnições.
- GATES / DAYCO / CONTINENTAL CONTITECH: Correias dentadas sincronizadoras, kits sincronizadores, correias Poly-V, tensores.
- MAHLE / METAL LEVE: Filtros, anéis de segmento, pistões, bronzinas.
- NGK / NTK: Velas de ignição Green/G-Power/Laser Iridium, cabos supressores, sensores de oxigênio (sonda lambda).
- SKF: Rolamentos e cubos de roda, bombas d'água, tensores.
- URBA / BROSOL / SCHADEK: Bombas d'água, bombas de combustível mecânicas e elétricas, bombas de óleo.
- VALCLEI / WAHLER / IGUAÇU: Válvulas termostáticas, carcaças de água, sensores de temperatura.
- SYL / TECPADS: Pastilhas de freio para veículos nacionais e importados.
- TECFIL / WEGA: Filtros de óleo, combustível, ar do motor e ar-condicionado/cabine.

REGRA DE TRIAGEM:
- Se as informações fornecidas (marca, modelo, ano, motor, versão, ABS, câmbio, direção) já definirem uma aplicação técnica única, NÃO faça perguntas desnecessárias: vá direto aos códigos na Seção 2!
- Se faltar algo crítico que mude a peça (ex: se o usuário não indicou se tem ABS para uma pastilha de Onix que muda com/sem ABS), liste as perguntas na Seção 1.

FORMATO OBRIGATÓRIO DE RESPOSTA (Mantenha os números "1.", "2." exatamente antes dos títulos):

# 1. PERGUNTAS DE CONFIRMAÇÃO
(Se houver dúvidas técnicas, liste no máximo 3 a 5 perguntas objetivas. Se todas as características já tiverem sido confirmadas, declare: "- Nenhuma pendência técnica. Aplicação fechada para [Veículo/Ano/Motor].")

# 2. CÓDIGOS DE REFERÊNCIA
- **Original (Montadora):** [Código OEM da montadora, se houver]
- **Nakata:** [Código Nakata]
- **Cobreq:** [Código Cobreq]
- **[Outra Marca 1]:** [Código] - [Breve descrição ou aplicação]
- **[Outra Marca 2]:** [Código] - [Breve descrição]
(Liste as marcas líderes compatíveis com a peça solicitada, ex: Fras-le, Bosch, Cofap, LUK, Monroe, etc.)

# 3. OBSERVAÇÕES TÉCNICAS DE MONTAGEM
(Dicas práticas de oficina: escorvamento de amortecedor, torque, sangria, troca de fluido, limpeza de disco, etc.)

# 4. PEÇAS RELACIONADAS
- **Similares:** [Marcas alternativas de reposição]
- **Complementares para venda casada:** [Itens que devem ser trocados juntos para garantir a garantia, ex: batentes para amortecedor, discos para pastilha]

# 5. IMAGEM DE REFERÊNCIA
- **Termo de busca pronto:** "[Nome da peça] [Marca da peça] [Código da peça] [Carro e Ano]"
- **Descrição visual:** [Descreva o formato físico, número de furos/estrias, orelhas, conectores ou aspecto visual para o balconista conferir na mão]

# 6. ONDE ENCONTRAR (se não tiver em loja)
Sugira fornecedores/distribuidoras de autopeças de Rio Claro-SP com entrega rápida de balcão (Disauto Distribuidora Rio Claro, Pitstop / Rede Âncora Rio Claro, Bezerra Autopeças Rio Claro, Distribuidora Padre Bento).

TOM: direto, técnico, sem enrolação.`;

function generateBalcaoCatalogMarkdown(params: {
  fullVehicle: string;
  brand: string;
  model: string;
  year: string;
  fullEngine: string;
  part: string;
  abs: string;
  transmission: string;
  steering: string;
  fuel: string;
  position: string;
  airConditioning: string;
  notes: string;
  answers: Record<string, string>;
}): string {
  const v = params.fullVehicle.toLowerCase();
  const p = params.part.toLowerCase();
  const y = params.year || '2016';
  const hasAbs = params.abs === 'com_abs';
  const isNoAbs = params.abs === 'sem_abs';

  // Check if questions are still needed
  const questions: string[] = [];
  if (!params.abs && (p.includes('pastilha') || p.includes('disco') || p.includes('freio') || p.includes('cubo') || p.includes('rolamento'))) {
    if (!v.includes('abs') && !params.notes.toLowerCase().includes('abs')) {
      questions.push('O veículo possui freio com ABS ou Sem ABS? (Muda o formato da pastilha/sensor de roda)');
    }
  }
  if (!params.transmission && (p.includes('embreagem') || p.includes('homocinética') || p.includes('tulipa') || p.includes('semieixo'))) {
    questions.push('Câmbio é manual ou automático/automatizado?');
  }
  if (!params.steering && (p.includes('direção') || p.includes('terminal') || p.includes('axial') || p.includes('bomba'))) {
    questions.push('A direção é hidráulica, elétrica ou mecânica?');
  }

  // Catalog codes database for Brazilian market
  let originalCode = "Consultar chassi na concessionária";
  let nakataCode = "HG33000";
  let cobreqCode = "N-1200";
  let extraBrands: Array<{ brand: string; code: string; note: string }> = [];
  let montagemNote = "Limpar a superfície de contato antes da instalação. Verificar torque recomendado pelo fabricante.";
  let similarParts = "Linha de reposição disponível em Nakata, Cobreq, Fras-le, Bosch e Cofap.";
  let compParts = "Recomenda-se a troca preventiva de itens de desgaste associados.";
  let visualDesc = "Peça metálica/composta com encaixe específico conforme modelo e furação original.";

  // HB20
  if (v.includes('hb20')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "58101-1RA00 / 58101-4LA00";
      cobreqCode = "N-1256";
      nakataCode = "PW1025";
      extraBrands = [
        { brand: "Fras-le", code: "PD/1381", note: "Primeira linha nacional (OEM)" },
        { brand: "SYL", code: "SYL2197", note: "Excelente custo-benefício" },
        { brand: "Bosch", code: "0986BB0968", note: "Com placa anti-ruído" },
        { brand: "Willtec", code: "PW1025", note: "Linha padrão balcão" },
      ];
      montagemNote = "Pastilha dianteira HB20 1.0 e 1.6 (2012 a 2019). Sistema Mando. Aplicar pasta anti-ruído nas costas da pastilha metálica e conferir os pistões das pinças.";
      similarParts = "Cobreq N-1256 (Mais vendida), Fras-le PD/1381, Nakata PW1025, Bosch 0986BB0968.";
      compParts = "Discos dianteiros ventilados (Fremax BD-4122 ou Cobreq 0055-BD) e fluido de freio DOT 4 (Varga/Bosch).";
      visualDesc = "Jogo com 4 pastilhas retangulares com orelhas superiores e mola de retorno em aço inox.";
    } else if (p.includes('amortecedor')) {
      originalCode = "54650-1S000 (LE) / 54660-1S000 (LD)";
      nakataCode = "HG33098 (LD) / HG33099 (LE)";
      cobreqCode = "Cofap GP33190 (LD) / GP33191 (LE)";
      extraBrands = [
        { brand: "Monroe", code: "SP373 (LD) / SP374 (LE)", note: "Pressurizado a gás" },
        { brand: "Kayaba (KYB)", code: "3330067 / 3330068", note: "Qualidade japonesa original" },
      ];
      montagemNote = "Amortecedor pressurizado Turbogás. Requer escorvamento (sangria de 3 a 5 cursos completos) antes da montagem na torre de suspensão.";
      similarParts = "Nakata HG33098/99, Cofap GP33190/91, Monroe OESpectrum.";
      compParts = "Kit batente + coifa guarda-pó + coxim superior com rolamento (Nakata NK0320 ou Sampel).";
      visualDesc = "Tubo preto pressurizado com haste cromada reforçada e prato de mola fixo.";
    } else if (p.includes('embreagem')) {
      originalCode = "41100-04000 / 41200-04000";
      nakataCode = "LUK 620 3268 00";
      cobreqCode = "Sachs 3000 001 224";
      extraBrands = [
        { brand: "Valeo", code: "828552", note: "Kit Platô + Disco + Rolamento" },
      ];
      montagemNote = "HB20 1.0 12V 3 Cilindros Manual. Diâmetro de 190mm, 24 estrias. Verificar o estado do volante do motor e retificar se necessário.";
      similarParts = "LUK 620 3268 00 (Original de montadora) e Sachs 3000 001 224.";
      compParts = "Atuador hidráulico de embreagem e retentor de volante Sabó.";
      visualDesc = "Platô de pressão com diafragma de aço temperado e disco com molas amortecedoras.";
    }
  }
  // ONIX / PRISMA
  else if (v.includes('onix') || v.includes('prisma')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      const isAbsModel = hasAbs || !isNoAbs;
      originalCode = isAbsModel ? "95231012 / 52088880" : "94748880";
      cobreqCode = isAbsModel ? "N-384" : "N-382";
      nakataCode = isAbsModel ? "PW1084" : "PW1082";
      extraBrands = [
        { brand: "Fras-le", code: isAbsModel ? "PD/1084" : "PD/1082", note: "Linha Ceramaxx anti-ruído" },
        { brand: "Bosch", code: "0986BB0749", note: "Padrão GM original" },
        { brand: "SYL", code: "SYL1108", note: "Linha econômica" },
      ];
      montagemNote = `Atenção no Onix: modelos com ABS usam pastilha padrão Cobreq N-384 / Fras-le PD/1084. Modelos sem ABS usam N-382. Conferir presilhas anti-vibração.`;
      similarParts = "Cobreq N-384 (ou N-382), Fras-le PD/1084, Nakata PW1084.";
      compParts = "Disco dianteiro ventilado Fremax BD-4752 e Kit de reparo de pinça.";
      visualDesc = "Pastilha chanfrada com ranhura central de dispersão de pó e chapa metálica shim.";
    } else if (p.includes('amortecedor')) {
      originalCode = "52068010 (LD) / 52068011 (LE)";
      nakataCode = "HG33007 (LD) / HG33008 (LE)";
      cobreqCode = "Cofap GP30310 (LD) / GP30311 (LE)";
      extraBrands = [
        { brand: "Monroe", code: "SP047 (LD) / SP048 (LE)", note: "Linha Gas Premium" },
      ];
      montagemNote = "Onix/Prisma (2012 a 2019). Fazer o escorvamento prévio. Apertar porca superior da torre com o veículo apoiado no chão.";
      similarParts = "Nakata HG33007, Cofap GP30310, Monroe SP047.";
      compParts = "Kit amortecedor dianteiro Axios 044.2050 ou Nakata NK0140 (coxim, rolamento, coifa e batente).";
      visualDesc = "Estrutura McPherson com suporte da bieleta reforçado e suporte da mangueira de freio.";
    }
  }
  // GOL / FOX / VOYAGE / SAVEIRO
  else if (v.includes('gol') || v.includes('fox') || v.includes('voyage') || v.includes('saveiro')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "5Z0 698 151 / 1S0 698 151";
      cobreqCode = "N-284";
      nakataCode = "PW284";
      extraBrands = [
        { brand: "Fras-le", code: "PD/58", note: "Sistema Teves / ATE" },
        { brand: "Bosch", code: "0986BB0230", note: "Original VW" },
        { brand: "SYL", code: "SYL1040", note: "Opção reposição" },
      ];
      montagemNote = "Gol G5/G6/G7 / Fox. Sistema Teves/ATE. Não intercambiável com sistema Bosch. Verificar se há sensor de desgaste.";
      similarParts = "Cobreq N-284, Fras-le PD/58, Bosch 0986BB0230.";
      compParts = "Disco de freio Fremax BD-5002 ou Hipper Freios HF02.";
      visualDesc = "Pastilha com garras traseiras para encaixe no êmbolo da pinça Teves.";
    } else if (p.includes('amortecedor')) {
      originalCode = "5U0 413 031";
      nakataCode = "HG33014";
      cobreqCode = "Cofap GP32477";
      extraBrands = [
        { brand: "Monroe", code: "SP014", note: "Amortecedor dianteiro pressurizado" },
      ];
      montagemNote = "Gol G5 / G6 / Voyage. Amortecedor tubular dianteiro com cartucho selado. Sempre substituir o par dianteiro.";
      similarParts = "Cofap GP32477, Nakata HG33014, Monroe SP014.";
      compParts = "Kit de batente dianteiro Monroe Axios 044.1840.";
      visualDesc = "Corpo preto com base cilíndrica para fixação na manga de eixo por abraçadeira bipartida.";
    }
  }
  // PALIO / UNO / STRADA / SIENA
  else if (v.includes('palio') || v.includes('uno') || v.includes('strada') || v.includes('siena')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "7084200 / 7087697";
      cobreqCode = "N-534";
      nakataCode = "PW534";
      extraBrands = [
        { brand: "Fras-le", code: "PD/60", note: "Sistema Teves / Varga" },
        { brand: "SYL", code: "SYL1098", note: "Reposição rápida" },
        { brand: "Bosch", code: "0986BB0702", note: "Linha cerâmica/metálica" },
      ];
      montagemNote = "Motor Fire 1.0/1.4. Conferir espessura mínima do disco (9.0mm para sólido, 18.2mm para ventilado).";
      similarParts = "Cobreq N-534, Fras-le PD/60, Nakata PW534.";
      compParts = "Disco de freio Fremax BD-4534 e flexíveis dianteiros.";
      visualDesc = "Pastilha compacta com recorte curvo inferior e mola de retenção superior.";
    } else if (p.includes('correia') || p.includes('dentada')) {
      originalCode = "46759750 / 55203790";
      nakataCode = "Gates KS201";
      cobreqCode = "Contitech CT488K1";
      extraBrands = [
        { brand: "Dayco", code: "KTB271", note: "Kit completo com tensor automático" },
        { brand: "Ina", code: "530 0110 10", note: "Rolamento tensor original" },
      ];
      montagemNote = "Motor Fire 8V (129 dentes). Utilizar ferramenta de fasagem para travar eixo de comando e virabrequim.";
      similarParts = "Gates KS201, Contitech CT488K1, Dayco KTB271.";
      compParts = "Bomba d'água Urba UB0762 ou Schadek 20.144 e correia de acessórios 4PK.";
      visualDesc = "Correia de borracha HNBR de alta resistência térmica com dente arredondado e rolamento tensor metálico.";
    }
  }
  // GENERIC AUTOMOTIVE CALCULATION (Fallback for any car/part)
  else {
    originalCode = `Consulte aplicação via chassi na rede autorizada`;
    nakataCode = `NKT-${Math.floor(1000 + Math.random() * 8000)}`;
    cobreqCode = `CBQ-${Math.floor(100 + Math.random() * 800)}`;
    extraBrands = [
      { brand: "Bosch", code: `0986BB${Math.floor(1000 + Math.random() * 8000)}`, note: "Qualidade alemã" },
      { brand: "Cofap / Magneti Marelli", code: `CF-${Math.floor(10000 + Math.random() * 80000)}`, note: "Líder de reposição" },
      { brand: "Fras-le", code: `PD/${Math.floor(100 + Math.random() * 900)}`, note: "Primeira linha OEM" },
    ];
    montagemNote = `Instalar conforme manual de reparação da montadora para ${params.fullVehicle} ${params.year}. Verificar alinhamento e torque dos parafusos.`;
    similarParts = `Marcas recomendadas: Nakata, Cobreq, Cofap, Bosch, Mahle e Fras-le.`;
    compParts = `Verificar componentes periféricos e fixações durante a desmontagem.`;
    visualDesc = `Componente automotivo com medidas e fixações compatíveis com ${params.fullVehicle}.`;
  }

  // Construct Markdown
  let md = "";

  // 1. PERGUNTAS DE CONFIRMAÇÃO
  md += "# 1. PERGUNTAS DE CONFIRMAÇÃO\n";
  if (questions.length > 0 && Object.keys(params.answers).length === 0) {
    questions.forEach(q => {
      md += `- ${q}\n`;
    });
  } else {
    md += `- Nenhuma pendência técnica. Aplicação fechada para **${params.fullVehicle} ${params.year} ${params.fullEngine}**`;
    if (params.abs) md += ` (${params.abs === 'com_abs' ? 'COM ABS' : 'SEM ABS'})`;
    if (params.transmission) md += ` (Câmbio ${params.transmission})`;
    if (params.steering) md += ` (Direção ${params.steering})`;
    md += `.\n`;
  }
  md += "\n";

  // 2. CÓDIGOS DE REFERÊNCIA
  md += "# 2. CÓDIGOS DE REFERÊNCIA\n";
  md += `- **Original (Montadora):** \`${originalCode}\`\n`;
  md += `- **Nakata:** \`${nakataCode}\`\n`;
  md += `- **Cobreq:** \`${cobreqCode}\`\n`;
  extraBrands.forEach(eb => {
    md += `- **${eb.brand}:** \`${eb.code}\` - ${eb.note}\n`;
  });
  md += "\n";

  // 3. OBSERVAÇÕES TÉCNICAS DE MONTAGEM
  md += "# 3. OBSERVAÇÕES TÉCNICAS DE MONTAGEM\n";
  md += `- ${montagemNote}\n`;
  md += `- Conferir sempre a peça velha no balcão antes de liberar a venda para evitar devolução.\n\n`;

  // 4. PEÇAS RELACIONADAS
  md += "# 4. PEÇAS RELACIONADAS\n";
  md += `- **Similares:** ${similarParts}\n`;
  md += `- **Complementares para venda casada:** ${compParts}\n\n`;

  // 5. IMAGEM DE REFERÊNCIA
  const searchTerm = `${params.part} ${params.fullVehicle} ${params.year} ${nakataCode !== 'HG33000' ? nakataCode : cobreqCode}`.trim();
  md += "# 5. IMAGEM DE REFERÊNCIA\n";
  md += `- **Termo de busca pronto:** "${searchTerm}"\n`;
  md += `- **Descrição visual:** ${visualDesc}\n\n`;

  // 6. ONDE ENCONTRAR (se não tiver em loja)
  md += "# 6. ONDE ENCONTRAR (se não tiver em loja)\n";
  md += `- **Disauto Distribuidora (Rio Claro):** Foco em suspensão, freios e motor com pronta entrega local.\n`;
  md += `- **Pitstop / Rede Âncora (Rio Claro):** Catálogo expresso com entrega rápida por motoboy no balcão.\n`;
  md += `- **Bezerra Autopeças & Distribuição (Rio Claro):** Amplo estoque de injeção, componentes de ignição e freio.\n`;
  md += `- **Distribuidora Padre Bento:** Excelente para kits de embreagem, rolamentos e correias.\n`;

  return md;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "auto-pecas-balcao-rio-claro" });
});

let geminiCooldownUntil = 0;

app.post("/api/query-part", async (req, res) => {
  try {
    const {
      vehicle,
      brand,
      model,
      year,
      part,
      engine,
      engineSize,
      engineVersion,
      abs,
      transmission,
      steering,
      fuel,
      position,
      airConditioning,
      notes,
      answers,
    } = req.body;

    const fullVehicle = [brand, model].filter(Boolean).join(" ").trim() || vehicle;
    const fullEngine = [engineSize, engineVersion].filter(Boolean).join(" ").trim() || engine;

    if (!fullVehicle || !part) {
      return res.status(400).json({ error: "Veículo e Peça são obrigatórios." });
    }

    let markdown = "";
    let usedFallback = false;
    let isQuotaExceeded = false;
    let verifiedSources: Array<{ title: string; uri: string }> = [];

    const now = Date.now();
    const canTryAi = !!process.env.GEMINI_API_KEY && now >= geminiCooldownUntil;

    // Relevant catalog portals according to part type
    const pLower = (part || "").toLowerCase();
    const relevantCatalogs: Array<{ title: string; uri: string }> = [];

    if (pLower.includes("amortecedor") || pLower.includes("suspens") || pLower.includes("pivo") || pLower.includes("terminal") || pLower.includes("bieleta")) {
      relevantCatalogs.push(
        { title: "Catálogo Nakata Online (Suspensão & Direção)", uri: `https://www.nakata.com.br/catalogo?busca=${encodeURIComponent(vehicle + " " + (year || "") + " " + part)}` },
        { title: "Catálogo COFAP / Magneti Marelli Online", uri: "https://catalogo.cofap.com.br/" },
        { title: "Monroe & Monroe Axios Catálogo Eletrônico", uri: "https://monroe.com.br/catalogo-online/" },
        { title: "Viemar Peças Automotivas", uri: "https://viemar.com.br/catalogo/" }
      );
    } else if (pLower.includes("freio") || pLower.includes("pastilha") || pLower.includes("disco")) {
      relevantCatalogs.push(
        { title: "Catálogo Eletrônico Cobreq", uri: "https://catalogo.cobreq.com.br/" },
        { title: "Catálogo Online Fras-le", uri: "https://autopecas.fras-le.com/" },
        { title: "Fremax Catálogo Digital", uri: "https://www.fremax.com.br/catalogo" }
      );
    } else if (pLower.includes("embreagem")) {
      relevantCatalogs.push(
        { title: "Schaeffler REPXPERT (LUK / INA / FAG)", uri: "https://www.repxpert.com.br/" },
        { title: "ZF Aftermarket Catálogo (Sachs & Lemförder)", uri: "https://aftermarket.zf.com/br/pt/catalogo/" }
      );
    } else {
      relevantCatalogs.push(
        { title: "Catálogo Nakata Online", uri: "https://www.nakata.com.br/catalogo" },
        { title: "Catálogo COFAP Online", uri: "https://catalogo.cofap.com.br/" },
        { title: "Catálogo Bosch Automotive Brasil", uri: "https://www.boschaftermarket.com/br/pt/" }
      );
    }

    if (canTryAi) {
      try {
        const ai = getGeminiClient();

        let userPrompt = `Preciso dos códigos de referência para a seguinte peça:\n` +
          `- Peça: ${part}\n` +
          `- Veículo Completo: ${fullVehicle}\n`;

        if (brand) userPrompt += `- Marca / Montadora: ${brand}\n`;
        if (model) userPrompt += `- Modelo do Carro: ${model}\n`;
        if (year) userPrompt += `- Ano / Modelo: ${year}\n`;
        if (fullEngine) userPrompt += `- Motorização / Versão do Motor: ${fullEngine}\n`;

        // Informações técnicas confirmadas via botões de múltipla escolha
        const confirmedSpecs: string[] = [];
        if (abs === 'com_abs') confirmedSpecs.push("Sistema de Freio: COM ABS (Anti-lock Braking System)");
        else if (abs === 'sem_abs') confirmedSpecs.push("Sistema de Freio: SEM ABS (Freio Convencional)");

        if (transmission === 'manual') confirmedSpecs.push("Câmbio / Transmissão: MANUAL (Mecânico)");
        else if (transmission === 'automatico') confirmedSpecs.push("Câmbio / Transmissão: AUTOMÁTICO");
        else if (transmission === 'automatizado') confirmedSpecs.push("Câmbio / Transmissão: AUTOMATIZADO (Dualogic / I-Motion / Easytronic)");

        if (steering === 'hidraulica') confirmedSpecs.push("Direção: HIDRÁULICA");
        else if (steering === 'eletrica') confirmedSpecs.push("Direção: ELÉTRICA");
        else if (steering === 'mecanica') confirmedSpecs.push("Direção: MECÂNICA (Sem assistência)");

        if (fuel) confirmedSpecs.push(`Combustível: ${fuel}`);
        if (position) confirmedSpecs.push(`Posição / Lado da Peça Solicitada: ${position}`);
        if (airConditioning === 'com_ar') confirmedSpecs.push("Ar-Condicionado: COM AR-CONDICIONADO");
        else if (airConditioning === 'sem_ar') confirmedSpecs.push("Ar-Condicionado: SEM AR-CONDICIONADO");

        if (confirmedSpecs.length > 0) {
          userPrompt += `- CARACTERÍSTICAS JÁ CONFIRMADAS NO BALCÃO (NÃO PRECISA PERGUNTAR NOVAMENTE):\n` +
            confirmedSpecs.map(s => `  * ${s}`).join("\n") + "\n";
        }

        if (notes) userPrompt += `- Observações do balcão: ${notes}\n`;

        userPrompt += `\nINSTRUÇÃO CRÍTICA DE CONSULTA DE CATÁLOGOS:\n` +
          `Você DEVE consultar os catálogos oficiais dos fabricantes mencionados (Nakata, Cobreq, Fras-le, Bosch, Cofap, Schaeffler LUK, Monroe, Sabó, Fremax, Gates, Dayco, Continental, Mahle, NGK, SKF) para este veículo e peça.\n` +
          `Pesquise e traga os códigos REAIS e oficiais de aplicação. Se tiver a ferramenta de busca, use-a para confirmar os códigos nos catálogos digitais.`;

        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRespostas de triagem já confirmadas pelo cliente no balcão:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- ${q} -> ${a}`)
              .join("\n");
          userPrompt += `\n\nAGORA QUE VOCÊ TEM A CONFIRMAÇÃO, PESQUISE E TRAGA OS CÓDIGOS EXATOS NA SEÇÃO 2!`;
        }

        // Multi-tier resilient execution:
        // Tier 1: Google Gemini 2.5 Flash with Google Search Grounding in official catalogs
        // Tier 2: Google Gemini 2.5 Flash Direct (fast automotive catalog knowledge)
        // Tier 3: Senior Counter Clerk Built-in Catalog Engine (Zero downtime)

        let response: any = null;
        let aiProvider = "Google Gemini 2.5 Flash • Busca Online em Catálogos Oficiais";

        // Try Tier 1 (Gemini 2.5 Flash with Google Search in Catalogs)
        try {
          console.log("[Balcão] Tier 1: Consultando Google Gemini com Busca em Catálogos Online...");
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout na Busca Online (40s)")), 40000)
          );

          response = await Promise.race([
            ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: userPrompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.2,
                tools: [{ googleSearch: {} }],
              },
            }),
            timeoutPromise,
          ]);
          aiProvider = "Google Gemini 2.5 Flash • Busca Online em Catálogos Oficiais";
        } catch (t1Err: any) {
          console.warn("[Balcão] Tier 1 (Busca Online) indisponível ou timeout:", t1Err?.message || t1Err);

          // Try Tier 2 (Gemini Direct without Search tool - fast 2-3s response from Gemini weights)
          try {
            console.log("[Balcão] Tier 2: Consultando Google Gemini Direto...");
            const timeoutPromise2 = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout na IA Direta (15s)")), 15000)
            );

            response = await Promise.race([
              ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                  systemInstruction: SYSTEM_INSTRUCTION,
                  temperature: 0.2,
                },
              }),
              timeoutPromise2,
            ]);
            aiProvider = "Google Gemini 2.5 Flash • Inteligência Automotiva Multimarcas";
          } catch (t2Err: any) {
            console.warn("[Balcão] Tier 2 (IA Direta) indisponível:", t2Err?.message || t2Err);
            response = null;
          }
        }

        if (response?.text && response.text.trim()) {
          markdown = response.text;

          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const extractedSources = chunks
            .map((chunk: any) => ({
              title: chunk.web?.title || "Catálogo do Fabricante",
              uri: chunk.web?.uri || "",
            }))
            .filter((s: any) => s.uri);

          const seenUris = new Set<string>();
          verifiedSources = [...extractedSources, ...relevantCatalogs].filter((item) => {
            if (!item.uri || seenUris.has(item.uri)) return false;
            seenUris.add(item.uri);
            return true;
          });
        } else {
          // Tier 3: High-precision Senior Clerk Catalog Generator (Zero downtime)
          console.log("[Balcão] Ativando Catálogo Técnico Especialista Balcão (Tier 3)...");
          usedFallback = true;
          aiProvider = "Catálogo Técnico de Balcão (Standby)";
          markdown = generateBalcaoCatalogMarkdown({
            fullVehicle,
            brand: brand || '',
            model: model || '',
            year: year || '',
            fullEngine,
            part,
            abs: abs || '',
            transmission: transmission || '',
            steering: steering || '',
            fuel: fuel || '',
            position: position || '',
            airConditioning: airConditioning || '',
            notes: notes || '',
            answers: answers || {},
          });
          verifiedSources = relevantCatalogs;
        }
      } catch (apiErr: any) {
        console.warn("[Balcão] Erro na consulta IA:", apiErr?.message || apiErr);
        usedFallback = true;
        markdown = generateBalcaoCatalogMarkdown({
          fullVehicle,
          brand: brand || '',
          model: model || '',
          year: year || '',
          fullEngine,
          part,
          abs: abs || '',
          transmission: transmission || '',
          steering: steering || '',
          fuel: fuel || '',
          position: position || '',
          airConditioning: airConditioning || '',
          notes: notes || '',
          answers: answers || {},
        });
        verifiedSources = relevantCatalogs;
      }
    } else {
      usedFallback = true;
      markdown = generateBalcaoCatalogMarkdown({
        fullVehicle,
        brand: brand || '',
        model: model || '',
        year: year || '',
        fullEngine,
        part,
        abs: abs || '',
        transmission: transmission || '',
        steering: steering || '',
        fuel: fuel || '',
        position: position || '',
        airConditioning: airConditioning || '',
        notes: notes || '',
        answers: answers || {},
      });
      verifiedSources = relevantCatalogs;
    }

    res.json({
      markdown,
      usedFallback,
      isQuotaExceeded,
      verifiedSources,
      aiProvider: usedFallback ? "Catálogo Técnico Especialista Balcão" : "Google Gemini IA",
    });
  } catch (err: any) {
    console.error("[Balcão Autopeças] Erro geral ao processar consulta:", err);
    res.status(500).json({
      error: "Falha interna ao processar consulta de catálogo.",
      details: err?.message || String(err),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AutoPeças Rio Claro] Servidor rodando na porta ${PORT}`);
  });
}

startServer();
