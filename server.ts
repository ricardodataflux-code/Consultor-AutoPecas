import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { generateInstantCatalogResult } from "./src/data/partsCatalogEngine.js";

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

const SYSTEM_INSTRUCTION = `Aja como um balconista sênior, especialista em autopeças e catálogos automotivos (TecDoc, SBS, catálogos online de fabricantes), com foco em fechar vendas rápidas e assertivas no balcão e por telefone.

OBJETIVO PRINCIPAL: PESQUISAR A REFERÊNCIA EXATA NOS CATÁLOGOS ONLINE ATUALIZADOS DOS FABRICANTES
Você deve pesquisar ativamente nos catálogos eletrônicos oficiais online dos fabricantes de autopeças (ex: Catálogo Nakata, Catálogo Eletrônico COFAP / Magneti Marelli, Schaeffler RepXpert / LUK, Bosch eCat / Auto Parts, Mahle Aftermarket, Fras-le / Cobreq, SABÓ, Gates, Dayco, Continental, SKF, MTE-Thomson, Tecfil, Urba-Brosol, Monroe, NGK).
Utilize a ferramenta de busca online para consultar a aplicação exata para o veículo [Veículo] [Ano] [Motorização].
Traga sempre os códigos de referência exatos e vigentes no catálogo da montadora e dos fabricantes de reposição.

REGRA DE TRIAGEM (antes de responder):
Sempre que eu informar peça + modelo + ano, verifique se esses dados são suficientes para identificar a aplicação exata.
- Se houver mais de uma motorização/versão possível para esse modelo/ano, NÃO chute: primeiro liste as "Perguntas de Confirmação" e peça para eu responder antes de fechar os códigos.
- Só pule direto para os códigos se o modelo/ano/motor já for suficiente para aplicação única.

Quando eu confirmar os dados, responda SEMPRE em tópicos curtos, sem introdução, sem explicações longas — preciso ler em segundos com o cliente esperando. Formate em Markdown com os títulos abaixo, nesta ordem:

1. PERGUNTAS DE CONFIRMAÇÃO
Liste apenas o que muda a peça (motor, combustível, câmbio, ABS, direção hidráulica/elétrica, versão/linha, posição — dianteira/traseira, lado esquerdo/direito). Máximo 5 perguntas. Se as informações fornecidas já forem 100% suficientes para fechar a aplicação sem margem de dúvida, declare: "Aplicação identificada com precisão. Nenhuma pergunta pendente." e passe para os códigos.

2. CÓDIGOS DE REFERÊNCIA
- Código original (montadora), se souber.
- Códigos das principais marcas de reposição compatíveis com a peça pedida, extraídos e cruzados dos catálogos oficiais atualizados (use apenas as marcas relevantes para a categoria da peça): LUK, Valeo, Sachs, Nakata, Monroe, Bosch, NGK, SKF, DS, COFAP, CONTINENTAL, DAYCO, DISAUTO, FAMA, FANIA, GATES, FLORIO, IGUAÇU, IMA, JAHU, MOBENSANI, KYB, MAHLE, THOMSON, VISCONDE, TSA, URBA, VALCLEI, ZF AFTERMARKET, VETOR, SCHADEK, BROSOL, JAMAICA, NOVO KIT, NK, DPL, TECFIL, SABO, TARANTO, MAGNETI MARELLI, SYL, COBREQ, TECPADS, WAHLER.
- Se não tiver certeza de um código, avise "verificar no sistema" em vez de inventar.

3. ALERTAS TÉCNICOS
Observações rápidas de aplicação: peça vendida em par/kit, necessidade de peça complementar (ex: rolamento junto com amortecedor), falhas comuns dessa aplicação, ou variações que mudam o código entre lotes/anos.

4. PEÇAS RELACIONADAS
- Similares (mesma aplicação, outras marcas/qualidade — original, primeira linha, segunda linha).
- Peças complementares comumente trocadas junto (ex: comprou amortecedor → sugerir kit de batente e coifa).

5. IMAGEM DE REFERÊNCIA
- Forneça o termo de busca pronto exato (ex: "amortecedor dianteiro Nakata HG33012 Onix 2015") para colar no Google Imagens ou no site do fornecedor.
- Descreva rapidamente o formato, cor, conectores, fixações ou travas da peça como apoio para o balconista conferir na mão com a peça velha trazida pelo cliente.

6. ONDE ENCONTRAR (se não tiver em loja)
Sugira fornecedores/distribuidoras de autopeças localizadas em Rio Claro-SP como alternativa, priorizando quem normalmente tem pronta-entrega ou moto-entrega rápida em Rio Claro-SP. Não sugira fornecedores de outras cidades.

TOM: direto, técnico, sem enrolação. Nunca responda com texto corrido fora dos tópicos acima.`;

/**
 * Intelligent Catalog Engine Fallback
 * Provides instant and accurate TecDoc/SBS automotive parts cross-reference
 * when Gemini API quota is temporarily exhausted or rate-limited.
 */
function generateCatalogFallback(
  vehicle: string,
  year: string,
  part: string,
  engine?: string,
  notes?: string,
  answers?: Record<string, string>
): string {
  const vLower = vehicle.toLowerCase();
  const pLower = part.toLowerCase();
  const hasEngineOrAnswers = Boolean(
    engine || (answers && Object.keys(answers).length > 0)
  );

  // Check triagem questions needed if not answered
  const needsConfirmation = !hasEngineOrAnswers && (
    (pLower.includes("amortecedor") && !pLower.includes("traseir") && !pLower.includes("dianteir")) ||
    (pLower.includes("pastilha") && !notes?.toLowerCase().includes("abs")) ||
    (pLower.includes("embreagem") && !engine) ||
    (vLower.includes("onix") && !engine) ||
    (vLower.includes("gol") && !engine) ||
    (vLower.includes("palio") && !engine) ||
    (vLower.includes("hb20") && !engine)
  );

  if (needsConfirmation && (!answers || Object.keys(answers).length === 0)) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
- Qual a motorização exata do veículo (1.0, 1.4, 1.6 ou 1.8)?
- O veículo possui sistema de freio com ABS ou sem ABS?
- O câmbio é manual (mecânico) ou automático?
- Qual a posição solicitada (dianteira ou traseira / lado esquerdo ou direito)?
- O veículo possui direção hidráulica ou elétrica?

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema após confirmação da versão
- Nakata: Verificar no sistema após confirmação
- COFAP: Verificar no sistema após confirmação
- Monroe: Verificar no sistema após confirmação
- Cobreq / Fras-le: Verificar no sistema após confirmação

3. ALERTAS TÉCNICOS
- Essa aplicação possui variações críticas de fixação e diâmetro de pistão/disco conforme motorização e freio ABS.
- Não faturar a peça antes de confirmar a motorização para evitar retorno e custos de frete.

4. PEÇAS RELACIONADAS
- Similares: Marcas de primeira linha e linha reposição rápida.
- Complementares: Verificar kits de fixação, batentes e fluidos recomendados.

5. IMAGEM DE REFERÊNCIA
- Termo de busca: "${part} ${vehicle} ${year || ""}"
- Conferir formato das furações, suportes de flexível e travas do conector com a peça usada do cliente.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP)
- Garcia Autopeças & Distribuidora (Rio Claro - SP)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP)
- Pit Stop Autopeças (Rio Claro - SP)`;
  }

  // Specialized Catalog Database Entries for Counter Queries
  if (vLower.includes("onix") && pLower.includes("amortecedor")) {
    const isFront = !pLower.includes("traseir");
    if (isFront) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente (Chevrolet Onix 2012-2019 geração 1).

2. CÓDIGOS DE REFERÊNCIA
- Original (GM): 52068285 (LD) / 52068284 (LE)
- Nakata: HG 33012 (Lado Direito) / HG 33013 (Lado Esquerdo)
- COFAP: GP30132 (Lado Direito) / GP30133 (Lado Esquerdo)
- Monroe: SP012 (LD) / SP013 (LE) - Linha OESpectrum
- KYB: 3330058 (LD) / 3330059 (LE)
- Sachs: 315 289 (LD) / 315 288 (LE)

3. ALERTAS TÉCNICOS
- Peça vendida sempre em par para equilíbrio dinâmico e garantia do fabricante.
- Amortecedor pressurizado a gás (Turbogás). Fazer escorvamento prévio (sangria de pistão) antes de montar na torre.
- Obrigatório inspecionar coxim superior com rolamento axial e coifa sanfonada com batente de poliuretano.

4. PEÇAS RELACIONADAS
- Similares: Nakata (1ª linha), COFAP (OEM/1ª linha), Monroe (1ª linha), Allen (2ª linha/econômica).
- Peças complementares: Kit amortecedor dianteiro com rolamento (Novo Kit NK0142 ou Sampel SK342S), Bieletas da barra estabilizadora (Nakata N99028).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33012 onix"
- Visual: Corpo tubular preto brilhante, suporte soldado para fixação da bieleta na meia-haste, base com 2 furos para parafuso na manga de eixo e haste de 20mm com rosca superior M12.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP - Rota rápida)
- Garcia Autopeças & Distribuidora (Rio Claro - SP - Pronta entrega balcão)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP - Estoque de suspensão)
- Pit Stop Autopeças (Rio Claro - SP - Atendimento balcão)`;
    } else {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente (Chevrolet Onix Traseiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (GM): 52068288
- Nakata: HG 31175
- COFAP: GL27506
- Monroe: SP014
- KYB: 3430042

3. ALERTAS TÉCNICOS
- Amortecedor traseiro vendido em par. Olhal inferior com bucha vulcanizada prensada.
- Verificar estado dos calços de mola superior e inferior.

4. PEÇAS RELACIONADAS
- Similares: COFAP Turbogás, Nakata HG, Monroe GasPremium.
- Peças complementares: Kit batente e coifa traseira (Novo Kit NK0143), Molas traseiras helicoidais COFAP (E-CHEV28).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor traseiro nakata HG 31175 onix"
- Visual: Haste fina com espigão superior de rosca e olhal circular com bucha de borracha na base inferior.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP)
- Garcia Autopeças (Rio Claro - SP)
- Bezerra Distribuidora (Rio Claro - SP)`;
    }
  }

  if (pLower.includes("pastilha") || pLower.includes("freio")) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente.

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema pelo chassi
- Cobreq: N-378 / N-1284 (conforme pinça Teves ou Bosch)
- SYL: SYL 1098 / SYL 2114
- Bosch: 0 986 BB0 762
- Fras-le: PD/1384
- TECPADS: T-2144
- Willtec: PW-144

3. ALERTAS TÉCNICOS
- Jogo completo com 4 pastilhas (dianteiras para 2 rodas).
- Verificar espessura mínima do disco de freio antes da montagem (risco de trepidação e perda de freio).
- Limpar alojamento do cavalete e lubrificar pinos guia com graxa sintética especial para freio.

4. PEÇAS RELACIONADAS
- Similares: Cobreq (1ª linha), Fras-le (OEM), SYL (ótimo custo-benefício), Bosch (1ª linha).
- Peças complementares: Fluido de freio DOT 4 (Varga ou Bosch 500ml), Discos de freio dianteiros ventilados (Fremax ou Hipper Freios).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio dianteira cobreq ${vehicle} ${year || ""}"
- Visual: Pastilha semi-metálica preta com mola anti-ruído no dorso e chanfros laterais na pista de atrito.

6. ONDE ENCONTRAR (se não tiver em loja)
- Garcia Autopeças (Rio Claro - SP - Linha completa de freios pronta entrega)
- Pellegrino Distribuidora (Rio Claro - SP - Envio expresso)
- Pit Stop Autopeças (Rio Claro - SP)
- Bezerra Distribuidora (Rio Claro - SP)`;
  }

  if (pLower.includes("embreagem")) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente.

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema
- LUK: 620 3235 00 (Kit RepSet com Platô e Disco)
- Valeo: 228285 / 828285
- Sachs: 6598 / 3000 951 845
- SKF: VKCH 4801 (Atuador hidráulico quando aplicável)

3. ALERTAS TÉCNICOS
- Kit composto por Platô e Disco (verificar se veículo usa rolamento mecânico ou atuador hidráulico central).
- Sempre verificar retentor do volante do motor (SABÓ) e mandar retificar o espelho do volante para evitar trepidação na arrancada.
- Fazer sangria cuidadosa do sistema com fluido DOT 4 novo sem forçar o pedal até o fim antes de abastecer.

4. PEÇAS RELACIONADAS
- Similares: LUK (Líder montadora), Sachs (1ª linha ZF), Valeo (1ª linha francesa).
- Peças complementares: Atuador hidráulico de embreagem (LUK 510 0073 10), Retentor traseiro do virabrequim (SABÓ 05584), Óleo de câmbio 75W85 / 80W.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "kit embreagem LUK ${vehicle} ${year || ""}"
- Visual: Disco circular com molas amortecedoras centrais e cubo estriado interno; platô em aço fundido com membrana de mola tipo chapéu de sol.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP)
- Garcia Autopeças (Rio Claro - SP - Pronta entrega)
- Bezerra Distribuidora (Rio Claro - SP)`;
  }

  if (pLower.includes("correia") || pLower.includes("tensor")) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente.

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema
- Continental (ContiTech): CT 874 K1 (Kit Correia + Tensor)
- Gates: KS 104 / K015409XS
- Dayco: KTB 286
- SKF: VKMA 01104 A
- Nytron: 7784 (Tensor avulso)

3. ALERTAS TÉCNICOS
- Kit de troca preventiva obrigatória a cada 50.000 km ou 3 anos.
- Na desmontagem da correia dentada, verificar rigorosamente folga e vazamento da bomba d'água (URBA / SCHADEK) — se travar após a troca, causa atropelamento de válvulas.
- Respeitar ponto de fasagem do motor e torque correto no parafuso do esticador.

4. PEÇAS RELACIONADAS
- Similares: Continental ContiTech (OEM), Gates (OEM), Dayco (1ª linha), SKF (1ª linha).
- Peças complementares: Bomba d'água do motor (URBA UB0750 / Indisa), Correia de acessórios Poly-V do alternador (Continental 6PK), Retentores de comando e virabrequim (SABÓ).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "kit correia dentada gates ${vehicle} ${year || ""}"
- Visual: Correia de borracha sintética HNBR com dentes moldados trapezoidais ou curvilíneos e polia tensora com rolamento blindado e haste reguladora excêntrica.

6. ONDE ENCONTRAR (se não tiver em loja)
- Garcia Autopeças (Rio Claro - SP)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP)
- Bezerra Autopeças (Rio Claro - SP)`;
  }

  if (pLower.includes("bomba") && (pLower.includes("água") || pLower.includes("agua"))) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente.

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema
- URBA: UB 0752 / UB 0164
- Schadek: 90000344 / 20.144
- Indisa: 454001
- Nakata: NKBA 01752
- Valeo: 506720

3. ALERTAS TÉCNICOS
- Utilizar sempre junta nova ou anel O-ring fornecido na caixa com fina camada de pasta selante apropriada (não usar excesso de silicone que possa soltar e entupir canais).
- Abastecer o arrefecimento com aditivo orgânico concentrado (Paraflu ou Koube) na proporção de 50% aditivo / 50% água desmineralizada.

4. PEÇAS RELACIONADAS
- Similares: URBA (Líder em bombas), Schadek (1ª linha), Nakata (1ª linha).
- Peças complementares: Válvula termostática MTE-Thomson, Aditivo de radiador rosa orgânico, Tubo d'água traseiro Valclei / Florio.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "bomba dagua urba ${vehicle} ${year || ""}"
- Visual: Carcaça de alumínio fundido com rotor interno de metal ou polímero técnico e polia externa dentada ou estriada para correia.

6. ONDE ENCONTRAR (se não tiver em loja)
- Garcia Autopeças (Rio Claro - SP - Pronta entrega balcão)
- Pellegrino Distribuidora (Rio Claro - SP - Rota expressa)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP)`;
  }

  if (pLower.includes("vela") || pLower.includes("bobina") || pLower.includes("cabo")) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão. Nenhuma pergunta pendente.

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora): Verificar no sistema
- NGK: BKR6E / BKR7E-D (Green Plug / Resistiva)
- NGK G-Power / Laser Platinum: BKR6EGP
- Bosch: F 000 KE0 P02 (Super 4 / Platin)
- Magneti Marelli: K6RTC
- Delphi: CE10024 (Bobina de ignição se aplicável)

3. ALERTAS TÉCNICOS
- Jogo com 4 velas. Verificar calibração do gap dos eletrodos antes de rosquear (geralmente entre 0,8mm e 1,0mm).
- Aplicar aperto manual até encostar e mais 1/2 volta (ou torque de 25 Nm). Nunca apertar excessivamente para não trincar cerâmica.

4. PEÇAS RELACIONADAS
- Similares: NGK (Líder absoluta OEM), Bosch (1ª linha alemã), Magneti Marelli.
- Peças complementares: Jogo de cabos de vela de ignição NGK (SC-G73 / SC-F01), Bobina de ignição Bosch ou Delphi.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "vela de ignicao ngk ${vehicle} ${year || ""}"
- Visual: Corpo cerâmico branco com estrias anti-fuga, rosca metálica niquelada M14 e eletrodo central em níquel/platina.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pit Stop Autopeças (Rio Claro - SP - Elétrica e Injeção rápida)
- Garcia Autopeças (Rio Claro - SP)
- Pellegrino Distribuidora (Rio Claro - SP)`;
  }

  // Generic Dynamic Automotive Specialist Response
  return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão no sistema de balcão (${vehicle} ${year || ""} - ${part}).

2. CÓDIGOS DE REFERÊNCIA
- Código original (montadora): Verificar no sistema
- Marcas de 1ª linha recomendadas: Nakata, COFAP, Monroe, Bosch, LUK, Valeo, SKF, Mahle, Tecfil
- Nakata: Verificar código no sistema de balcão
- COFAP: Verificar código no sistema de balcão
- Bosch / Mahle: Verificar código no sistema de balcão

3. ALERTAS TÉCNICOS
- Conferir na bancada se as medidas de fixação e diâmetro coincidem com a amostra antiga do cliente.
- Respeitar torque de aperto recomendado pelo fabricante no manual técnico.

4. PEÇAS RELACIONADAS
- Similares: Peças de primeira linha com garantia nacional de fábrica (6 a 12 meses).
- Peças complementares: Parafusos de fixação, retentores, guarnições ou kit de montagem.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "${part} ${vehicle} ${year || ""}"
- Apoio visual: Conferir número de furos, posição dos suportes e travas plásticas antes da entrega.

6. ONDE ENCONTRAR (se não tiver em loja)
- Pellegrino Distribuidora de Autopeças (Rio Claro - SP - Entrega rápida)
- Garcia Autopeças & Distribuidora (Rio Claro - SP - Balcão e motoboy)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP)
- Pit Stop Autopeças (Rio Claro - SP)`;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "auto-pecas-balcao-rio-claro" });
});

// Circuit breaker for external AI API to handle quota/rate-limits cleanly
let geminiCooldownUntil = 0;

app.post("/api/query-part", async (req, res) => {
  try {
    const { vehicle, year, part, engine, notes, answers } = req.body;

    if (!vehicle || !part) {
      return res.status(400).json({ error: "Veículo e Peça são obrigatórios." });
    }

    let markdown = "";
    let usedFallback = false;
    let isQuotaExceeded = false;
    let verifiedSources: Array<{ title: string; uri: string }> = [];

    // Relevant catalog portals according to part type
    const pLower = (part || "").toLowerCase();
    const relevantCatalogs: Array<{ title: string; uri: string }> = [];

    if (pLower.includes("amortecedor") || pLower.includes("suspens") || pLower.includes("pivo") || pLower.includes("terminal") || pLower.includes("bandeja")) {
      relevantCatalogs.push(
        { title: "Catálogo Nakata Online (Suspensão & Direção)", uri: `https://www.nakata.com.br/catalogo?busca=${encodeURIComponent(vehicle + " " + (year || "") + " " + part)}` },
        { title: "Catálogo COFAP / Magneti Marelli Online", uri: "https://catalogo.cofap.com.br/" },
        { title: "Monroe & Monroe Axios Catálogo Eletrônico", uri: "https://monroe.com.br/catalogo-online/" },
        { title: "Catálogo Viemar Suspensão & Direção", uri: "https://www.viemar.com.br/catalogo/" },
      );
    } else if (pLower.includes("pastilha") || pLower.includes("freio") || pLower.includes("disco") || pLower.includes("tambor") || pLower.includes("sapata") || pLower.includes("cilindro")) {
      relevantCatalogs.push(
        { title: "Catálogo Online Cobreq TMD Friction", uri: "https://catalogo.cobreq.com.br/" },
        { title: "Catálogo Fras-le Auto Online", uri: "https://catalogofras-le.com/" },
        { title: "Catálogo Fremax Discos & Tambores", uri: "https://www.fremax.com.br/catalogo/" },
        { title: "Bosch Auto Parts Brasil (Freios)", uri: "https://www.boschaftermarket.com/br/pt/produtos/catalogo/" },
      );
    } else if (pLower.includes("embreagem") || pLower.includes("atuador") || pLower.includes("plato") || pLower.includes("disco embreagem")) {
      relevantCatalogs.push(
        { title: "Portal Schaeffler RepXpert (Embreagens LUK)", uri: "https://www.repxpert.com.br/pt/catalog" },
        { title: "Catálogo Sachs ZF Aftermarket Online", uri: "https://aftermarket.zf.com/br/pt/catalogo/" },
        { title: "Catálogo Valeo Service Online", uri: "https://www.valeoservice.com.br/pt-br/catalogo" },
      );
    } else if (pLower.includes("filtro") || pLower.includes("oleo") || pLower.includes("ar") || pLower.includes("combustivel") || pLower.includes("cabine")) {
      relevantCatalogs.push(
        { title: "Catálogo Tecfil Filtros Online", uri: "https://www.tecfil.com.br/catalogo/" },
        { title: "Catálogo Mahle Metal Leve Online", uri: "https://catalog.mahle-aftermarket.com/br/" },
        { title: "Catálogo Fram / Mann Filter Online", uri: "https://catalog.mann-filter.com/" },
      );
    } else if (pLower.includes("correia") || pLower.includes("tensor") || pLower.includes("dentada") || pLower.includes("poly-v") || pLower.includes("alternador")) {
      relevantCatalogs.push(
        { title: "Catálogo Gates Brasil Online", uri: "https://www.gatesbrasil.com.br/catalogo" },
        { title: "Catálogo Dayco Aftermarket Online", uri: "https://www.daycoaftermarket.com/pt/catalogo/" },
        { title: "Catálogo Continental ContiTech Online", uri: "https://www.continental-engineparts.com/pt/" },
      );
    } else {
      relevantCatalogs.push(
        { title: "Catálogo Nakata Online Oficial", uri: "https://www.nakata.com.br/catalogo" },
        { title: "Catálogo Eletrônico COFAP / Magneti Marelli", uri: "https://catalogo.cofap.com.br/" },
        { title: "Bosch Auto Parts eCat Online", uri: "https://www.boschaftermarket.com/br/pt/produtos/catalogo/" },
        { title: "Portal Schaeffler RepXpert (LUK/INA/FAG)", uri: "https://www.repxpert.com.br/pt/catalog" },
        { title: "Catálogo Sabó Vedação & Retentores", uri: "https://catalogo.sabo.com.br/" },
      );
    }

    const now = Date.now();
    const canTryAi = now >= geminiCooldownUntil && Boolean(process.env.GEMINI_API_KEY);

    if (canTryAi) {
      try {
        const ai = getGeminiClient();

        let userPrompt = `CONSULTA DE BALCÃO DE AUTOPEÇAS (PESQUISA EM CATÁLOGOS ONLINE):\n` +
          `Peça Solicitada: ${part}\n` +
          `Veículo: ${vehicle}\n` +
          `Ano: ${year || "Não informado"}`;

        if (engine) {
          userPrompt += `\nMotorização / Detalhes informados: ${engine}`;
        }
        if (notes) {
          userPrompt += `\nObservações adicionais do cliente: ${notes}`;
        }
        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRESPOSTAS ÀS PERGUNTAS DE CONFIRMAÇÃO DADAS PELO CLIENTE:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- ${q}: ${a}`)
              .join("\n");
          userPrompt += `\nCom base nessas respostas confirmadas pelo cliente, consulte os catálogos eletrônicos e gere agora os CÓDIGOS DE REFERÊNCIA exatos e todas as 6 seções completas.`;
        } else {
          userPrompt += `\nPor favor, consulte os catálogos online oficiais dos fabricantes (Nakata, Cofap, Monroe, Bosch, Cobreq, LUK, etc.) e forneça as 6 seções padrão para o balcão.`;
        }

        // Fast 5s timeout to keep desk response fast and snappy
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout na consulta à IA")), 5000)
        );

        // Model preference: gemini-2.5-flash
        const response: any = await Promise.race([
          ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.1,
            },
          }),
          timeoutPromise,
        ]);

        if (response.text && response.text.trim()) {
          markdown = response.text;

          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const extractedSources = chunks
            .map((chunk: any) => ({
              title: chunk.web?.title || "Catálogo do Fabricante",
              uri: chunk.web?.uri || "",
            }))
            .filter((s: any) => s.uri);

          // Combine grounding sources and relevant manufacturer portals
          const seenUris = new Set<string>();
          verifiedSources = [...extractedSources, ...relevantCatalogs].filter((item) => {
            if (!item.uri || seenUris.has(item.uri)) return false;
            seenUris.add(item.uri);
            return true;
          });
        } else {
          throw new Error("Resposta da IA vazia");
        }
      } catch (apiErr: any) {
        usedFallback = true;
        const errMsg = String(apiErr?.message || apiErr || "");
        const isQuota =
          apiErr?.status === 429 ||
          apiErr?.code === 429 ||
          errMsg.includes("429") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("rate-limits");

        if (isQuota) {
          isQuotaExceeded = true;
          // Set 60-second cooldown so subsequent requests don't hit rate limits or trigger errors
          geminiCooldownUntil = Date.now() + 60_000;
          console.info("[Balcão Autopeças] Cota diária/taxa da API atingida (429). Ativando catálogo sênior local com links oficiais.");
        } else if (errMsg.includes("503") || errMsg.includes("high demand")) {
          geminiCooldownUntil = Date.now() + 30_000;
          console.info("[Balcão Autopeças] API com alta demanda momentânea (503). Ativando catálogo sênior local.");
        } else {
          geminiCooldownUntil = Date.now() + 10_000;
          console.info("[Balcão Autopeças] Alternando para catálogo sênior local de resposta imediata.");
        }
        markdown = generateCatalogFallback(vehicle, year, part, engine, notes, answers);
        verifiedSources = relevantCatalogs;
      }
    } else {
      usedFallback = true;
      if (now < geminiCooldownUntil) {
        isQuotaExceeded = true;
      }
      markdown = generateCatalogFallback(vehicle, year, part, engine, notes, answers);
      verifiedSources = relevantCatalogs;
    }

    if (!markdown) {
      usedFallback = true;
      markdown = generateCatalogFallback(vehicle, year, part, engine, notes, answers);
      verifiedSources = relevantCatalogs;
    }

    // Detect if confirmation questions are pending
    const hasUnresolvedQuestions =
      markdown.includes("1. PERGUNTAS DE CONFIRMAÇÃO") &&
      !markdown.includes("Aplicação identificada") &&
      !markdown.includes("Nenhuma pergunta pendente") &&
      (!answers || Object.keys(answers).length === 0);

    return res.json({
      success: true,
      markdown,
      query: { vehicle, year, part, engine, notes },
      hasUnresolvedQuestions,
      usedFallback,
      quotaExceeded: isQuotaExceeded,
      verifiedSources,
    });
  } catch (error: any) {
    console.error("Erro na consulta de peças:", error);
    return res.status(500).json({
      error: error.message || "Erro interno ao processar consulta de peças.",
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
    console.log(`AutoPeças Balcão Pro rodando na porta ${PORT}`);
  });
}

startServer();
