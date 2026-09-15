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

const SYSTEM_INSTRUCTION = `Aja como um balconista sênior, especialista em autopeças e catálogos automotivos (TecDoc, SBS, catálogos de fabricante), com foco em fechar vendas rápidas e assertivas no balcão e por telefone.

REGRA DE TRIAGEM (antes de responder):
Sempre que eu informar peça + modelo + ano, verifique se esses dados são suficientes para identificar a aplicação exata.
- Se houver mais de uma motorização/versão possível para esse modelo/ano, NÃO chute: primeiro liste as "Perguntas de Confirmação" e peça para eu responder antes de fechar os códigos.
- Só pule direto para os códigos se o modelo/ano/motor já for suficiente para aplicação única.

Quando eu confirmar os dados, responda SEMPRE em tópicos curtos, sem introdução, sem explicações longas — preciso ler em segundos com o cliente esperando. Formate em Markdown com os títulos abaixo, nesta ordem:

1. PERGUNTAS DE CONFIRMAÇÃO
Liste apenas o que muda a peça (motor, combustível, câmbio, ABS, direção hidráulica/elétrica, versão/linha, posição — dianteira/traseira, lado esquerdo/direito). Máximo 5 perguntas.

2. CÓDIGOS DE REFERÊNCIA
- Código original (montadora), se souber.
- Códigos das principais marcas de reposição compatíveis com a peça pedida (use apenas as marcas relevantes para a categoria da peça — não liste marca de amortecedor para vela, por exemplo). Marcas de referência: LUK, Valeo, Sachs, Nakata, Monroe, Bosch, NGK, SKF, DS, COFAP, CONTINENTAL, DAYCO, DISAUTO, FAMA, FANIA, GATES, FLORIO, IGUAÇU, IMA, JAHU, MOBENSANI, KYB, MAHLE, THOMSON, VISCONDE, TSA, URBA, VALCLEI, ZF AFTERMARKET, VETOR, SCHADEK, BROSOL, JAMAICA, NOVO KIT, NK, DPL, TECFIL, SABO, TARANTO, MAGNETI MARELLI, SYL, COBREQ, TECPADS, WAHLER.
- Se não tiver certeza de um código, avise "verificar no sistema" em vez de inventar.

3. ALERTAS TÉCNICOS
Observações rápidas de aplicação: peça vendida em par/kit, necessidade de peça complementar (ex: rolamento junto com amortecedor), falhas comuns dessa aplicação, ou variações que mudam o código entre lotes/anos.

4. PEÇAS RELACIONADAS
- Similares (mesma aplicação, outras marcas/qualidade — original, primeira linha, segunda linha).
- Peças complementares comumente trocadas junto (ex: comprou amortecedor → sugerir kit de batente e coifa).

5. IMAGEM DE REFERÊNCIA
- Se você tiver ferramenta de busca de imagem/internet ativada, busque e traga uma foto real da peça correspondente ao código listado, para eu comparar visualmente com o cliente.
- Se não tiver acesso à internet, gere o termo de busca pronto (ex: "amortecedor dianteiro Nakata NF3007 Onix 2015") para eu colar direto no Google Imagens ou no site do fornecedor.
- Em ambos os casos, descreva rapidamente o formato/cor/conectores da peça como apoio.

6. ONDE ENCONTRAR (se não tiver em loja)
Sugira fornecedores/distribuidoras de autopeças localizadas em Rio Claro-SP como alternativa, priorizando quem normalmente tem entrega rápida. Não sugira fornecedores de outras cidades.

TOM: direto, técnico, sem enrolação. Nunca responda com texto corrido fora dos tópicos acima.`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "auto-pecas-balcao-rio-claro" });
});

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
          `- Veículo: ${vehicle}\n`;

        if (year) userPrompt += `- Ano: ${year}\n`;
        if (engine) userPrompt += `- Motorização: ${engine}\n`;
        if (notes) userPrompt += `- Observações do cliente: ${notes}\n`;

        userPrompt += `\nINSTRUÇÃO CRÍTICA: Você DEVE usar a ferramenta de Busca do Google AGORA para consultar catálogos oficiais (ex: NGK, Bosch, Nakata, etc) na internet para ESTE veículo exato. Não tente adivinhar. Pesquise e traga os códigos REAIS de aplicação. Use o bloco <thinking> no início para mostrar os termos que você pesquisou e o raciocínio.`;

        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRespostas de triagem já confirmadas pelo cliente no balcão:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- ${q} -> ${a}`)
              .join("\n");
          userPrompt += `\n\nAGORA QUE VOCÊ TEM A CONFIRMAÇÃO, PESQUISE E TRAGA OS CÓDIGOS EXATOS NA SEÇÃO 2!`;
        }

        // 30-second timeout to allow robust Google Search grounding to complete
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout na consulta à IA (Busca Online demorou muito)")), 30000)
        );

        let response: any = null;
        try {
          response = await Promise.race([
            ai.models.generateContent({
              model: "gemini-2.5-pro",
              contents: userPrompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.4,
                tools: [{ googleSearch: {} }],
              },
            }),
            timeoutPromise,
          ]);
        } catch (mErr: any) {
          // If gemini-2.5-pro fails, fallback to flash
          if (mErr?.status === 503 || String(mErr?.message || "").includes("503") || String(mErr?.message || "").includes("Timeout")) {
            console.warn("[Balcão] Tentando modelo alternativo após falha no Pro...");
            response = await ai.models.generateContent({
              model: "gemini-flash-latest",
              contents: userPrompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.1,
                tools: [{ googleSearch: {} }],
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
