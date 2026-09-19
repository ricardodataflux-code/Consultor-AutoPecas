import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { generateInstantCatalogResult } from '../src/data/partsCatalogEngine';
import {
  executeTecDocFunctionCall,
  TecDocQueryParams,
} from '../src/data/equivalenceTableEngine';

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

// Function Calling Declaration para TecDoc Catalogue Brasil & Tabela de Equivalência CSV
const buscarPecaTecdocTool: FunctionDeclaration = {
  name: "buscar_peca_tecdoc",
  description: "Consulta a base oficial TecDoc Catalogue Brasil e a Tabela de Equivalência CSV de autopeças. Extrai os parâmetros e obtém os códigos oficiais de montadora (OEM) e as conversões exatas para as marcas de reposição homologadas (Cofap, Nakata, Monroe, Cobreq, Fras-le, LuK, Sachs, Valeo, Bosch, NGK, etc.). Use esta função SEMPRE para garantir 100% de assertividade no balcão sem alucinação.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      montadora: {
        type: Type.STRING,
        description: "Montadora do veículo (ex: Volkswagen, Fiat, Chevrolet, Ford, Renault, Hyundai, Toyota, Honda)",
      },
      carro: {
        type: Type.STRING,
        description: "Nome do modelo do veículo (ex: Gol, Onix, Palio, HB20, Corolla, Civic)",
      },
      geracao_ou_modelo: {
        type: Type.STRING,
        description: "Geração ou versão (ex: G5, G4, Joy, Fire, Sedan)",
      },
      ano: {
        type: Type.STRING,
        description: "Ano do modelo (ex: 2010)",
      },
      motor: {
        type: Type.STRING,
        description: "Motorização e válvulas (ex: 1.0 8V, 1.6 8V, 1.4)",
      },
      item: {
        type: Type.STRING,
        description: "Nome da peça automotiva solicitada (ex: amortecedor dianteiro, pastilha de freio dianteira, kit embreagem)",
      },
      especificacoes: {
        type: Type.STRING,
        description: "Opcionais e detalhes (ex: Com ABS, Manual, Direção Hidráulica)",
      },
    },
    required: ["carro", "item"],
  },
};

const SYSTEM_INSTRUCTION = `Aja como um balconista sênior, especialista em autopeças e catálogos automotivos (TecDoc, SBS, catálogos de fabricante), com foco em fechar vendas rápidas e assertivas no balcão e por telefone.


REGRA DE TRIAGEM (antes de responder):
Sempre que eu informar peça + modelo + ano, verifique se esses dados são suficientes para identificar a aplicação exata.
- Se houver mais de uma motorização/versão possível para esse modelo/ano, NÃO chute: primeiro liste as "Perguntas de Confirmação" e peça para eu responder antes de fechar os códigos.
- Só pule direto para os códigos se o modelo/ano/motor já for suficiente para aplicação única.

Quando eu confirmar os dados, responda SEMPRE em tópicos curtos, sem introdução, sem explicações longas — preciso ler em segundos com o cliente esperando. Formate em Markdown com os títulos abaixo, nesta ordem:

1. PERGUNTAS DE CONFIRMAÇÃO
Liste apenas o que muda a peça (motor, combustível, câmbio, ABS, direção hidráulica/elétrica, versão/linha, posição — dianteira/traseira, lado esquerdo/direito). Máximo 5 perguntas.
(Se todos os dados já tiverem sido informados ou confirmados, responda: "- Aplicação confirmada e fechada para o veículo informado.")

2. ALERTAS TÉCNICOS
Observações rápidas de aplicação: peça vendida em par/kit, necessidade de peça complementar (ex: rolamento junto com amortecedor), falhas comuns dessa aplicação, ou variações que mudam o código entre lotes/anos.

3. CÓDIGOS DE REFERÊNCIA
- Código atualizado(montadora), se souber.
- Códigos das principais marcas de reposição compatíveis com a peça pedida atualizada pelo catalogo online das marcas, CONSULTAR ESTRITAMENTE E MINUSCIOSAMENTE NOS CATALOGOS OLINE E OBTER O CODIGO EXATO E ATUALIZADO (use apenas as marcas relevantes para a categoria da peça — não liste marca de amortecedor para vela, por exemplo). Marcas de referência: LUK, Valeo, Sachs, Nakata, Monroe, Bosch, NGK, SKF, DS, COFAP, CONTINENTAL, DAYCO, DISAUTO, FAMA, FANIA, GATES, FLORIO, IGUAÇU, IMA, JAHU, MOBENSANI, KYB, MAHLE, THOMSON, VISCONDE, TSA, URBA, VALCLEI, ZF AFTERMARKET, VETOR, SCHADEK, BROSOL, JAMAICA, NOVO KIT, NK, DPL, TECFIL, SABO, TARANTO, MAGNETI MARELLI, SYL, COBREQ, TECPADS, WAHLER.
- Se não tiver certeza de um código, avise "verificar no sistema" em vez de inventar.

4. PEÇAS RELACIONADAS
- Similares (mesma aplicação, outras marcas/qualidade — original, primeira linha, segunda linha).
- Peças complementares comumente trocadas junto (ex: comprou amortecedor → sugerir kit de batente e coifa).
- listar as peças relacionadas com marca e codigo de referencia

5. IMAGEM DE REFERÊNCIA
- traga imagens dos produtos solicitados para pesquisa (termos de busca visual completos e características de inspeção de bancada).

6. ONDE ENCONTRAR (se não tiver em loja)
Sugira fornecedores/distribuidoras de autopeças localizadas em Rio Claro-SP como alternativa, priorizando quem normalmente tem entrega rápida. Não sugira fornecedores de outras cidades:
- Auto Peças 3R: Rua 06 A, 1269 - Vila Alemã. Telefone: (19) 3535-4499. Integrante da Rede PitStop, entrega rápida de balcão.
- AutoZone Rio Claro: Av. Presidente Tancredo de Almeida Neves, 535. Telefone fixo: (19) 2111-2750 / WhatsApp Mecânicas: (11) 94078-1966.
- Dinâmica Auto Peças: Avenida 15 JP, 56 - Jardim Esmeralda. Telefone/WhatsApp: (19) 98185-5828.
- Disauto Distribuidora: Rio Claro-SP. Telefone: (19) 3526-9000. Atacado automotivo regional.

Enquanto nao inserir um novo produto para pesquisa ou um carro diferente, as informações para pesquisa deve ser mantido para o mesmo carro.

TOM: direto, técnico, sem enrolação. Nunca responda com texto corrido fora dos tópicos acima.`;

let geminiCooldownUntil = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    let aiProvider = "Google Gemini IA • Catálogos Oficiais (Busca Online)";
    let verifiedSources: Array<{ title: string; uri: string }> = [];
    let functionCallInfo: any = null;

    const now = Date.now();
    const canTryAi = !!process.env.GEMINI_API_KEY && now >= geminiCooldownUntil;

    // Portais oficiais de catálogo de acordo com o tipo de peça
    const pLower = (part || "").toLowerCase();
    const relevantCatalogs: Array<{ title: string; uri: string }> = [];

    if (pLower.includes("amortecedor") || pLower.includes("suspens") || pLower.includes("pivo") || pLower.includes("terminal") || pLower.includes("bieleta")) {
      relevantCatalogs.push(
        { title: "Catálogo Nakata Online (Suspensão & Direção)", uri: `https://www.nakata.com.br/catalogo?busca=${encodeURIComponent(fullVehicle + " " + (year || "") + " " + part)}` },
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

        const confirmedSpecs: string[] = [];
        if (abs === 'com_abs') confirmedSpecs.push("Sistema de Freio: COM ABS");
        else if (abs === 'sem_abs') confirmedSpecs.push("Sistema de Freio: SEM ABS");

        if (transmission === 'manual') confirmedSpecs.push("Câmbio: MANUAL");
        else if (transmission === 'automatico') confirmedSpecs.push("Câmbio: AUTOMÁTICO");
        else if (transmission === 'automatizado') confirmedSpecs.push("Câmbio: AUTOMATIZADO");

        if (steering === 'hidraulica') confirmedSpecs.push("Direção: HIDRÁULICA");
        else if (steering === 'eletrica') confirmedSpecs.push("Direção: ELÉTRICA");
        else if (steering === 'mecanica') confirmedSpecs.push("Direção: MECÂNICA");

        if (fuel) confirmedSpecs.push(`Combustível: ${fuel}`);
        if (position) confirmedSpecs.push(`Posição / Lado: ${position}`);
        if (airConditioning === 'com_ar') confirmedSpecs.push("Ar-Condicionado: COM AR");
        else if (airConditioning === 'sem_ar') confirmedSpecs.push("Ar-Condicionado: SEM AR");

        if (confirmedSpecs.length > 0) {
          userPrompt += `- DADOS CONFIRMADOS NO BALCÃO:\n` +
            confirmedSpecs.map(s => `  * ${s}`).join("\n") + "\n";
        }

        if (notes) userPrompt += `- Observações do balcão: ${notes}\n`;

        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRespostas de confirmação já validadas pelo cliente:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- ${q} -> ${a}`)
              .join("\n");
          userPrompt += `\n\nAGORA QUE OS DADOS ESTÃO CONFIRMADOS, PULE DIRETO PARA OS CÓDIGOS E DETALHES DE VENDA!`;
        }

        userPrompt += `\n\nESTRUTURA OBRIGATÓRIA (TÓPICOS 1 A 6):\n` +
          `1. PERGUNTAS DE CONFIRMAÇÃO\n` +
          `2. ALERTAS TÉCNICOS\n` +
          `3. CÓDIGOS DE REFERÊNCIA\n` +
          `4. PEÇAS RELACIONADAS\n` +
          `5. IMAGEM DE REFERÊNCIA\n` +
          `6. ONDE ENCONTRAR (se não tiver em loja)\n` +
          `REGRA: Se não tiver 100% de certeza de algum código, avise "verificar no sistema" em vez de inventar.`;

        const directTecDocQuery: TecDocQueryParams = {
          montadora: brand || "",
          carro: model || vehicle,
          geracao_ou_modelo: vehicle,
          ano: year || "",
          motor: fullEngine || "",
          item: part,
          especificacoes: [abs, transmission, steering, fuel, position].filter(Boolean).join(", "),
        };
        const tecdocDirectResult = await executeTecDocFunctionCall(directTecDocQuery);

        let response: any = null;
        functionCallInfo = null;
        const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];

        for (const targetModel of candidateModels) {
          if (markdown.trim()) break;

          // Tentativa 1: Function Calling Oficial (buscar_peca_tecdoc) -> 100% de assertividade
          try {
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout Function Calling ${targetModel}`)), 12000)
            );

            const initialResponse = await Promise.race([
              ai.models.generateContent({
                model: targetModel,
                contents: userPrompt,
                config: {
                  systemInstruction: SYSTEM_INSTRUCTION,
                  temperature: 0.0,
                  tools: [{ functionDeclarations: [buscarPecaTecdocTool] }],
                },
              }),
              timeoutPromise,
            ]);

            if (initialResponse?.functionCalls && initialResponse.functionCalls.length > 0) {
              const fc = initialResponse.functionCalls[0];
              const tecdocResult = await executeTecDocFunctionCall(fc.args as any);

              const turn2Timeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`Timeout Turno 2 ${targetModel}`)), 12000)
              );

              const secondResponse = await Promise.race([
                ai.models.generateContent({
                  model: targetModel,
                  contents: [
                    { role: "user", parts: [{ text: userPrompt }] },
                    { role: "model", parts: [{ functionCall: { name: fc.name, args: fc.args } }] },
                    {
                      role: "user",
                      parts: [
                        {
                          functionResponse: {
                            name: fc.name,
                            response: {
                              status: "success",
                              fonte: tecdocResult.source,
                              resultado_oficial: tecdocResult,
                            },
                          },
                        },
                      ],
                    },
                  ],
                  config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.0,
                  },
                }),
                turn2Timeout,
              ]);

              if (secondResponse?.text && secondResponse.text.trim()) {
                markdown = secondResponse.text;
                aiProvider = `Google Gemini IA • Function Calling (buscar_peca_tecdoc ➔ ${tecdocResult.source})`;
                functionCallInfo = {
                  functionName: fc.name,
                  parameters: fc.args,
                  source: tecdocResult.source,
                  matchesCount: tecdocResult.rawMatchesCount,
                  oemCode: tecdocResult.oemCode,
                  brandsCount: tecdocResult.brands.length,
                  executedAt: Date.now(),
                };
                break;
              }
            } else if (initialResponse?.text && initialResponse.text.trim()) {
              markdown = initialResponse.text;
              aiProvider = `Google Gemini IA (${targetModel}) • Validação Direta`;
              functionCallInfo = {
                functionName: "buscar_peca_tecdoc",
                parameters: directTecDocQuery,
                source: tecdocDirectResult.source,
                matchesCount: tecdocDirectResult.rawMatchesCount,
                oemCode: tecdocDirectResult.oemCode,
                brandsCount: tecdocDirectResult.brands.length,
                executedAt: Date.now(),
              };
              break;
            }
          } catch (fcErr: any) {
            console.warn(`[Balcão] ${targetModel} Function Calling falhou:`, fcErr?.message || fcErr);
          }

          // Tentativa 2: Com Google Search Grounding (15s timeout)
          try {
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout Busca ${targetModel}`)), 15000)
            );

            response = await Promise.race([
              ai.models.generateContent({
                model: targetModel,
                contents: userPrompt,
                config: {
                  systemInstruction: SYSTEM_INSTRUCTION,
                  temperature: 0.0,
                  tools: [{ googleSearch: {} }],
                },
              }),
              timeoutPromise,
            ]);

            if (response?.text && response.text.trim()) {
              markdown = response.text;
              aiProvider = `Google Gemini IA (${targetModel}) • Busca Online Google (Temp 0.0)`;
              break;
            }
          } catch (searchErr: any) {
            const errStr = String(searchErr?.message || searchErr);
            if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED")) {
              isQuotaExceeded = true;
            }

            // Tentativa 3: Direta sem ferramentas de busca (12s timeout)
            try {
              const timeoutPromise2 = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`Timeout Direto ${targetModel}`)), 12000)
              );

              response = await Promise.race([
                ai.models.generateContent({
                  model: targetModel,
                  contents: userPrompt,
                  config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.0,
                  },
                }),
                timeoutPromise2,
              ]);

              if (response?.text && response.text.trim()) {
                markdown = response.text;
                aiProvider = `Google Gemini IA (${targetModel}) • Catálogo Rápido (Temp 0.0)`;
                break;
              }
            } catch (directErr: any) {
              const errStr2 = String(directErr?.message || directErr);
              if (errStr2.includes("429") || errStr2.includes("quota") || errStr2.includes("RESOURCE_EXHAUSTED")) {
                isQuotaExceeded = true;
              }
            }
          }
        }

        if (!functionCallInfo) {
          functionCallInfo = {
            functionName: "buscar_peca_tecdoc",
            parameters: directTecDocQuery,
            source: tecdocDirectResult.source,
            matchesCount: tecdocDirectResult.rawMatchesCount,
            oemCode: tecdocDirectResult.oemCode,
            brandsCount: tecdocDirectResult.brands.length,
            executedAt: Date.now(),
          };
        }

        if (response?.text && response.text.trim()) {
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
        } else if (!markdown.trim()) {
          usedFallback = true;
          aiProvider = `Catálogo Técnico de Balcão (${tecdocDirectResult.source})`;
          markdown = generateInstantCatalogResult(
            fullVehicle,
            year || '',
            part,
            fullEngine || '',
            notes || '',
            answers || {},
            {
              abs,
              transmission,
              steering,
              fuel,
              position,
              airConditioning,
            }
          );
          verifiedSources = relevantCatalogs;
        }
      } catch (apiErr: any) {
        usedFallback = true;
        markdown = generateInstantCatalogResult(
          fullVehicle,
          year || '',
          part,
          fullEngine || '',
          notes || '',
          answers || {},
          {
            abs,
            transmission,
            steering,
            fuel,
            position,
            airConditioning,
          }
        );
        verifiedSources = relevantCatalogs;
      }
    } else {
      usedFallback = true;
      markdown = generateInstantCatalogResult(
        fullVehicle,
        year || '',
        part,
        fullEngine || '',
        notes || '',
        answers || {},
        {
          abs,
          transmission,
          steering,
          fuel,
          position,
          airConditioning,
        }
      );
      verifiedSources = relevantCatalogs;
    }

    return res.status(200).json({
      markdown,
      usedFallback,
      quotaExceeded: isQuotaExceeded,
      isQuotaExceeded,
      verifiedSources,
      aiProvider,
      functionCallInfo,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Falha interna ao processar consulta de balcão.",
      details: error?.message || String(error),
    });
  }
}

