import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { generateInstantCatalogResult } from "../src/data/partsCatalogEngine";

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

const SYSTEM_INSTRUCTION = `Você é um balconista sênior especialista em autopeças brasileiras e catálogos automotivos (Nakata, Cofap, Monroe, Bosch, Cobreq, LUK, Valeo, Sachs, Gates, Dayco, Continental, TSA, DS, etc.).

OBJETIVO CRÍTICO:
Fornecer o resultado da pesquisa como UMA LISTA DIRETA com os CÓDIGOS DE REFERÊNCIA EXATOS DAS MARCAS NO ATO DA CONSULTA para o balconista vender no balcão e lançar imediatamente no sistema da loja.

REGRA DE OURO:
- NUNCA, EM HIPÓTESE ALGUMA, responda "Verificar no sistema" ou mande o balconista consultar outro catálogo.
- Você DEVE fornecer os códigos de catálogo reais das principais marcas de 1ª linha de reposição e da montadora no ato.

REGRA DE TRIAGEM E FILTRO (SEMPRE APLICAR):
Sempre que o usuário informar peça + modelo + ano (+ motorização opcional):
- Verifique se esses dados são suficientes para uma aplicação 100% única.
- Se houver mais de uma motorização, geração de carroceria ou variação possível (ex: Gol G5 vs G4, com ABS ou sem ABS, lado LD ou LE, 1.0 ou 1.6):
  1. Na Seção 1 (PERGUNTAS DE CONFIRMAÇÃO): liste APENAS as perguntas críticas e diretas de triagem pertinentes à PEÇA solicitada.
     * ATENÇÃO: NÃO pergunte informações que já foram fornecidas na consulta (ex: se o usuário já preencheu a motorização, NÃO pergunte qual a motorização).
     * ATENÇÃO: NÃO faça perguntas irrelevantes (ex: não pergunte lado direito/esquerdo para sensor de nível, bomba de combustível, ou embreagem, pois essas peças não possuem lado).
  2. Na Seção 2 (CÓDIGOS DE REFERÊNCIA): Liste APENAS os códigos da peça EXATAMENTE solicitada. É ESTRITAMENTE PROIBIDO listar códigos de peças relacionadas, variações ou componentes do conjunto que não sejam a peça que o usuário digitou. (Exemplo: se o usuário pediu "Sensor de Nível", liste APENAS códigos de Sensor de Nível na Seção 2; NÃO liste Refil ou Flange aqui). NÃO chute uma única versão nem fique em branco! LISTE OS CÓDIGOS DE CADA VERSÃO/OPÇÃO (ex: "Opção A - Versão 1.0 / G5: Nakata HG 33010 | Cofap GP30263"). Dessa forma o balconista JÁ TEM OS CÓDIGOS REAIS IMEDIATAMENTE NA TELA enquanto confirma com o cliente!
- Se o modelo, ano e motorização já forem suficientes para aplicação única, declare na Seção 1 "Aplicação identificada com precisão" e liste os códigos específicos na Seção 2.

ESTRUTURA DE RESPOSTA OBRIGATÓRIA EM MARKDOWN (Nesta exata sequência numerada de 1 a 6):
1. PERGUNTAS DE CONFIRMAÇÃO
- Liste perguntas diretas de triagem técnica (ex: geração do veículo, motorização 1.0 ou 1.6, com ou sem ABS, tipo de freio, câmbio manual ou automático).
- Se a aplicação for 100% única e clara, escreva: "Aplicação identificada com precisão."

2. CÓDIGOS DE REFERÊNCIA
- Liste em bullet points os códigos de referência exatos no ato, APENAS para a peça buscada principal.
- INCLUA SEMPRE os códigos para todos os fabricantes disponíveis (Montadora Original, Bosch, TSA, DS, VP, Magneti Marelli, Delphi, VDO, Continental, Nakata, COFAP, Monroe, Cobreq, Fras-le, LUK, Valeo, Sachs, SKF). Não oculte fabricantes!
- PARA CADA CÓDIGO DE REFERÊNCIA, ADICIONE UMA DESCRIÇÃO TÉCNICA OBRIGATÓRIA usando um traço e separe os dados técnicos EXCLUSIVAMENTE RELEVANTES PARA A VENDA (ex: Dimensões, Pressão, Vazão, Lado, Pinos, Valor Ohmico) com barras verticais (|). NÃO inclua informações teóricas inúteis como "Função" ou "Tecnologia".
- OBRIGATÓRIO: DESTAQUE A PEÇA ORIGINAL DE FÁBRICA (OEM). No item que for o original da montadora, inclua obrigatoriamente a tag "Origem: Peça Original" ou "Linha Original de Montagem" na descrição técnica.
- Exemplo para Sensores: "* DS: 2334 - Sistema: Bosch | Valor Ôhmico: Cheio: 38 ± 4 Ω / Vazio: 283 ± 4 Ω | Combustível: Flex".
- Exemplo para Bombas: "* Bosch: F 000 TE1 98U - Pressão: 4.2 Bar | Vazão: 85 L/h | Sistema: Multiponto".
- Exemplo para Flanges: "* TSA: T-030018 - Pinos: 4 | Saídas: 2 (Engate Rápido) | Sistema: Bosch". Siga rigorosamente este padrão focado em conversão e aplicação real!

3. ALERTAS TÉCNICOS
- Liste os alertas críticos de montagem (ex: escorvamento/sangria do amortecedor a gás, substituição em pares, diferença de lado LD e LE, medição de espessura de disco, retífica de volante na embreagem).

4. PEÇAS RELACIONADAS (VENDA CASADA NO BALCÃO)
- Liste as peças complementares para agregar valor à venda do balcão. INCLUA OS CÓDIGOS REAIS dessas peças complementares se possível (ex: "- Kit Coxim com Rolamento: Nakata NKC 3001" ou "- Flange da Bomba de Combustível: TSA T-030018").
- Para amortecedor: kit coxim com rolamento axial, batente, coifa, bieletas. Para freio: fluido DOT 4, discos novos. Para bomba: filtro de combustível, flange, sensor de nível.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "[nome da peça] [marca e código] [veículo]"
- Descrição visual da peça (formato do corpo, número de furos na base, suportes soldados, pinos, conectores e travas) para conferir com a peça velha na bancada.

6. ONDE ENCONTRAR (se não tiver em loja - Rio Claro - SP)
- Liste distribuidoras e atacados locais de Rio Claro - SP com rota rápida de entrega e motoboy (Pellegrino Distribuidora, Garcia Autopeças, Bezerra Autopeças, Pit Stop Rio Claro, Disauto).

TOM: Ultra-objetivo, técnico e focado no balcão de vendas.`;

let geminiCooldownUntil = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    const { vehicle, year, part, engine, notes, answers } = req.body;

    if (!vehicle || !part) {
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

        let userPrompt = `CONSULTA DE BALCÃO DE AUTOPEÇAS (BUSCA DE CÓDIGOS DE REFERÊNCIA):\n` +
          `- Peça Solicitada: ${part}\n` +
          `- Veículo: ${vehicle}\n` +
          `- Ano: ${year || "Não informado"}`;

        if (engine) {
          userPrompt += `\n- Motorização / Versão: ${engine}`;
        }
        if (notes) {
          userPrompt += `\n- Observações adicionais: ${notes}`;
        }

        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRESPOSTAS ÀS PERGUNTAS DE CONFIRMAÇÃO DADAS PELO CLIENTE NO BALCÃO:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- Pergunta: "${q}" -> Resposta: "${a}"`)
              .join("\n");
          userPrompt += `\nCom base nessas respostas confirmadas pelo cliente, filtre e forneça agora os códigos de referência únicos e exatos das marcas e todas as 6 seções completas.`;
        } else {
          userPrompt += `\nLembre-se: Liste as perguntas de triagem na Seção 1 se houver variações. E na Seção 2 FORNEÇA NO ATO OS CÓDIGOS REAIS DAS MARCAS (Nakata, Cofap, Monroe, Bosch, etc.) para cada opção. NUNCA diga 'verificar no sistema'.`;
        }

        // 8-second timeout to ensure the counter clerk never waits too long
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout na consulta à IA")), 8000)
        );

        let response: any = null;
        try {
          response = await Promise.race([
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
        } catch (mErr: any) {
          // If gemini-2.5-flash has temporary demand spike, try fallback model gemini-flash-latest
          if (mErr?.status === 503 || String(mErr?.message || "").includes("503")) {
            console.warn("[Balcão] Tentando modelo alternativo após 503...");
            response = await ai.models.generateContent({
              model: "gemini-flash-latest",
              contents: userPrompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.1,
              },
            });
          } else {
            throw mErr;
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
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (isQuota) {
          isQuotaExceeded = true;
          geminiCooldownUntil = Date.now() + 60_000;
          console.info("[Balcão Autopeças] Cota diária/taxa da API atingida (429). Ativando catálogo local com códigos reais.");
        } else if (errMsg.includes("503") || errMsg.includes("high demand")) {
          geminiCooldownUntil = Date.now() + 30_000;
          console.info("[Balcão Autopeças] API com alta demanda momentânea (503). Ativando catálogo sênior local de resposta imediata.");
        } else {
          geminiCooldownUntil = Date.now() + 15_000;
          console.info("[Balcão Autopeças] Utilizando catálogo sênior local.");
        }

        markdown = generateInstantCatalogResult(vehicle, year, part, engine, notes, answers);
        verifiedSources = relevantCatalogs;
      }
    } else {
      usedFallback = true;
      if (now < geminiCooldownUntil) {
        isQuotaExceeded = true;
      }
      markdown = generateInstantCatalogResult(vehicle, year, part, engine, notes, answers);
      verifiedSources = relevantCatalogs;
    }

    res.json({
      markdown,
      usedFallback,
      isQuotaExceeded,
      verifiedSources,
    });
  } catch (err: any) {
    console.error("[Balcão Autopeças] Erro geral ao processar consulta:", err);
    res.status(500).json({
      error: "Falha interna ao processar consulta de catálogo.",
      details: err?.message || String(err),
    });
  }
}
