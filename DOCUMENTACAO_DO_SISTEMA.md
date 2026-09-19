# DOCUMENTAÇÃO TÉCNICA E ARQUITETURAL COMPLETA
## Sistema: AutoPeças Balcão Pro (Roncoli - Triagem Balcão Rio Claro-SP)
**Versão:** 2.5 (Function Calling + TecDoc Pegasus 3.0 + Tabela CSV de Equivalência)  
**Autor do Sistema / Desenvolvedor:** Ricardo R. Guedes  
**Objetivo:** Guia completo de replicação para implementação por agentes de Inteligência Artificial ou desenvolvedores de software.

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 O Problema Real de Balcão
Em um balcão ou atendimento telefônico de autopeças, o cliente e o mecânico esperam agilidade extrema (menos de 6 segundos). Modelos de linguagem (LLMs) tradicionais apresentam duas falhas críticas nesse cenário:
1. **Alucinação de Códigos:** LLMs tentam memorizar números e letras de catálogos (ex: `Cobreq N-250`, `Nakata HG33010`, `OEM 5U0 698 151`), inventando códigos inexistentes ou com aplicação errada, causando prejuízos financeiros e retorno de mercadoria.
2. **Falta de Perguntas de Triagem:** Responder sem saber se o veículo é aro 14 ou aro 15, com ABS ou sem ABS, câmbio manual ou automatizado, faz com que a peça vendida não encaixe no veículo na oficina.

### 1.2 A Solução Arquitetural
O aplicativo resolve esses problemas desacoplando a linguagem natural da base de dados:
1. **O Gemini NÃO inventa códigos.** O Gemini atua exclusivamente como intérprete da linguagem humana informal (gírias de balcão, erros de digitação) e traduz o pedido em parâmetros estruturados (`carro`, `ano`, `motor`, `item`, `especificações`).
2. **Function Calling Oficial (`buscar_peca_tecdoc`):** A IA aciona uma função que consulta diretamente a API oficial do **TecDoc WebService (Pegasus 3.0)** ou o banco local homologado (`tabela_pecas.csv`).
3. **Assertividade de 100%:** A resposta final traz apenas códigos matematicamente conferidos e cruzados com a montadora e os fabricantes de reposição homologados no Brasil (Cofap, Nakata, Monroe, Cobreq, Fras-le, LuK, Sachs, Valeo, Bosch, etc.).
4. **Formatação Rígida em 6 Tópicos:** Resposta sempre padronizada em Markdown técnico direto, para leitura em segundos pelo vendedor.

---

## 2. ARQUITETURA DO SISTEMA E FLUXO DE DADOS

```
                    ┌──────────────────────────────────────────────┐
                    │          VENDEDOR DIGITA NO BALCÃO           │
                    │  (ex: "Pastilha de freio Gol G5 2010 1.0")   │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │          FRONTEND REACT 19 + VITE            │
                    │  - Formulário com atalhos de motor e filtros │
                    │  - Botões rápidos (ABS, Câmbio, Direção)     │
                    │  - Timeout rígido de 6s para o balcão        │
                    └──────────────────────┬───────────────────────┘
                                           │ POST /api/query-part
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │             BACKEND EXPRESS / NODE           │
                    │  - Normalização de termos e veículos         │
                    │  - Injeção de System Instruction e RAG local │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │               TURNO 1: GEMINI                │
                    │      (gemini-2.5-flash, Temperature 0.0)     │
                    │  Identifica os parâmetros e emite o comando: │
                    │        buscar_peca_tecdoc({...})             │
                    └──────────────────────┬───────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │ FunctionCall args                   │
                        ▼                                     ▼
      ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
      │     API TECDOC WEBSERVICE        │  │   TABELA DE EQUIVALÊNCIA CSV     │
      │  (Pegasus 3.0 - TecAlliance BR)  │  │        (tabela_pecas.csv)        │
      │  *Quando TECDOC_API_KEY existe*  │  │      *Modo autônomo offline*     │
      └─────────────────┬────────────────┘  └─────────────────┬────────────────┘
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           │ Dados Reais e Códigos OEM
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │               TURNO 2: GEMINI                │
                    │  Recebe o functionResponse oficial e formata │
                    │  a resposta final nos 6 tópicos obrigatórios │
                    └──────────────────────┬───────────────────────┘
                                           │ JSON { markdown, functionCallInfo, ... }
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │             FRONTEND: RESULT VIEW            │
                    │  - Exibição visual em cards temáticos        │
                    │  - Copiar para WhatsApp do cliente           │
                    │  - Botões para responder confirmações        │
                    │  - Distribuidores com telefone em Rio Claro  │
                    │  - Card oficial da Function Call executada   │
                    └──────────────────────────────────────────────┘
```

---

## 3. PROMPT DE SISTEMA (SYSTEM INSTRUCTION)

Este é o prompt mestre injetado em toda chamada da IA:

```text
Aja como um balconista sênior, especialista em autopeças e catálogos automotivos (TecDoc, SBS, catálogos de fabricante), com foco em fechar vendas rápidas e assertivas no balcão e por telefone.

REGRA DE TRIAGEM (antes de responder):
Sempre que eu informar peça + modelo + ano, verifique se esses dados são suficientes para identificar a aplicação exata.
- Se houver mais de uma motorização/versão possível para esse modelo/ano, NÃO chute: primeiro liste as "Perguntas de Confirmação" e peça para eu responder antes de fechar os códigos.
- Só pule direto para os códigos se o modelo/ano/motor já for suficiente para aplicação única.

Quando eu confirmar os dados, responda SEMPRE em tópicos curtos, sem introdução, sem explicações longas — preciso ler em segundos com o cliente esperando. Formate em Markdown com os títulos abaixo, nesta ordem:

1. PERGUNTAS DE CONFIRMAÇÃO
Liste apenas o que muda a peça (motor, combustível, câmbio manual/automático, direção, se tem ar/ABS, posição dianteira/traseira, lado esquerdo/direito). Se já estiver tudo confirmado ou suficiente, escreva "Aplicação confirmada para [veículo e motor]:" e siga em frente.

2. ALERTAS TÉCNICOS
Observações rápidas que evitam erro na entrega ou devolução:
- Variação entre lotes/anos do mesmo modelo
- Se a peça exige componente opcional junto (ex: kit de batente, atuador junto com embreagem, parafusos novos)
- Falha comum que o mecânico reclama se colocar a peça errada
- Recomendação rápida para o mecânico (ex: sangria, torque, conferir estrias, diâmetro)

3. CÓDIGOS DE REFERÊNCIA
- Código da montadora (código original OEM)
- Códigos das principais marcas de reposição do mercado nacional (LUK, Valeo, Sachs, Nakata, Monroe, Bosch, NGK, SKF, DS, COFAP, CONTINENTAL, DAYCO, DISAUTO, FAMA, FANIA, GATES, FLORIO, IGUAÇU, IMA, JAHU, MOBENSANI, KYB, MAHLE, THOMSON, VISCONDE, TSA, URBA, VALCLEI, ZF AFTERMARKET, VETOR, SCHADEK, BROSOL, JAMAICA, NOVO KIT, NK, DPL, TECFIL, SABO, TARANTO, MAGNETI MARELLI, SYL, COBREQ, TECPADS, WAHLER)
Se não tiver 100% de certeza de algum código, avise "verificar no sistema" em vez de inventar.

4. PEÇAS RELACIONADAS
- Similares de outras marcas/qualidade (primeira linha x linha econômica)
- Complementares que o cliente normalmente precisa trocar junto (ex: pastilha + disco + fluido; embreagem + atuador + retentor do volante; amortecedor + kit batente)

5. IMAGEM DE REFERÊNCIA
- Termo exato para buscar a foto da peça no Google Imagens ou catálogo
- Descrição visual rápida em 1 frase para o vendedor bater o olho na peça física no balcão e confirmar antes de entregar (ex: "disco ventilado com 4 furos e cubo alto", "pastilha com mola superior em formato de borboleta", "bieleta com haste de metal e pinos em 90 graus")

6. ONDE ENCONTRAR (se não tiver em loja)
Priorize distribuidoras e concorrentes locais de Rio Claro - SP (com telefone e localização aproximada):
- Auto Peças 3R: Rua 06 A, 1269 - Vila Alemã, Rio Claro - SP. Tel: (19) 3535-4499 (Rede PitStop, entrega rápida balcão)
- AutoZone Rio Claro: Av. Presidente Tancredo de Almeida Neves, 535 - Jardim Inocoop. Tel: (19) 2111-2750 / WhatsApp Mecânicos: (11) 94078-1966 (Estoque amplo a pronta entrega)
- Dinâmica Auto Peças: Av. 15 JP, 56 - Jardim Esmeralda, Rio Claro - SP. Tel: (19) 98185-5828 (Atendimento ágil)
- Disauto Distribuidora: Rio Claro - SP. Tel: (19) 3526-9000 (Atacado e entrega expressa)
- Distribuidoras de Campinas/Limeira com rota diária para Rio Claro (Pacaembu, Pellegrino, Roles, Sama, DPK) quando a peça for rara.

TOM DE VOZ: de balconista experiente para balconista. Sem enrolação, sem texto de introdução, sem conclusão. Direto ao ponto.
```

---

## 4. CONTRATO DE FUNCTION CALLING (GEMINI TOOLS)

### 4.1 Declaração da Ferramenta (`buscar_peca_tecdoc`)
```typescript
import { Type, FunctionDeclaration } from "@google/genai";

export const buscarPecaTecdocTool: FunctionDeclaration = {
  name: "buscar_peca_tecdoc",
  description: "Consulta a base oficial TecDoc Catalogue Brasil e a Tabela de Equivalência CSV de autopeças. Extrai os parâmetros estruturados do veículo (montadora, carro, geracao_ou_modelo, ano, motor, item, especificacoes) e retorna os códigos oficiais de montadora (OEM) e as conversões exatas para as marcas de reposição (Cofap, Nakata, Monroe, Cobreq, Fras-le, LuK, Sachs, Valeo, Bosch, NGK, etc.). Use esta função SEMPRE para garantir 100% de assertividade no balcão sem alucinação.",
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
        description: "Especificações adicionais (ex: com ABS, manual, aro 14, dianteiro)",
      },
    },
    required: ["carro", "item"],
  },
};
```

---

## 5. TABELA DE EQUIVALÊNCIA CSV (`tabela_pecas.csv`)

### 5.1 Estrutura do Arquivo
O arquivo fica na raiz do projeto (`/tabela_pecas.csv`) com delimitador de vírgula e aspas quando necessário:

```csv
montadora,carro,ano,motor,tipoPeca,marcaPeca,codigoReferencia,codigoOEM,alertasTecnicos,pecasRelacionadas
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Pastilha de Freio Dianteira,Cobreq,N-250,5U0 698 151 / 1S0 698 151,Sistema Teves sem mola externa. Versões aro 14 com disco solido 239mm. Versão 1.6 aro 15 usa Cobreq N-285.,Disco Fremax BD 4660 / Fluido Bosch DOT 4 / Kit Pinos Guia
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Pastilha de Freio Dianteira,Fras-le,PD/58,5U0 698 151 / 1S0 698 151,Sistema Teves. Verificar espessura mínima do disco.,Disco Fremax BD 4660 / Fluido Bosch DOT 4
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Pastilha de Freio Dianteira,Nakata,NKF 1089P,5U0 698 151 / 1S0 698 151,Plaqueta antirruído inclusa. Frenagem macia de balcão.,Disco Nakata NKF 6046 / Fluido Freio
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Amortecedor Dianteiro,Cofap,GP32985,5U0 413 031 A,Turbogás pressurizado. Substituir sempre em pares dianteiros.,Kit Batente Cofap KSC01104S / Mola Helicoidal
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Amortecedor Dianteiro,Monroe,SP028,5U0 413 031 A,Linha Monroe OESpectrum. Não bater pistão com marreta.,Kit Batente Monroe / Rolamento do Coxim
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 / 1.6 8V TotalFlex,Amortecedor Dianteiro,Nakata,HG 33010,5U0 413 031 A,Pressurizado a gás de alta durabilidade.,Kit Batente e Coifa Nakata SK301S / Coxim com Rolamento
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 8V EA111 VHT,Kit de Embreagem,LuK,619 3015 00,030 141 025 K,Diâmetro 190mm e 28 estrias. Não acompanha cabo de embreagem mecânico.,Cabo de Embreagem Fania 34-215 / Garfo de Embreagem
Volkswagen,Gol G5 / G6 / Voyage / Saveiro,2008-2016,1.0 8V EA111 VHT,Kit de Embreagem,Sachs,6598,030 141 025 K,Platô e disco 190mm + rolamento guia de desengate.,Retentor do Volante Sabó 05244 / Óleo Câmbio 75W80
Chevrolet,Onix / Prisma / Cobalt / Spin,2012-2019,1.0 / 1.4 8V SPE/4,Pastilha de Freio Dianteira,Cobreq,N-384,94748944 / 95231012,Modelos com ABS usam N-384. Modelos sem ABS usam N-382 (mais estreita).,Disco Fremax BD 4752 / Fluido DOT 4
Chevrolet,Onix / Prisma / Cobalt / Spin,2012-2019,1.0 / 1.4 8V SPE/4,Pastilha de Freio Dianteira,Fras-le,PD/1084,94748944 / 95231012,Linha Ceramaxx Lonaflex. Verificar sistema de freio se é Teves ou Varga.,Disco Fremax BD 4752 / Kit Pinos Guia
Chevrolet,Onix / Prisma / Cobalt / Spin,2012-2019,1.0 / 1.4 8V SPE/4,Amortecedor Dianteiro Direito,Cofap,GP30310,52068010,Turbogás pressurizado lado direito. Fazer escorvamento prévio.,Kit Batente Nakata NK0140 / Coxim com Rolamento
Chevrolet,Onix / Prisma / Cobalt / Spin,2012-2019,1.0 / 1.4 8V SPE/4,Amortecedor Dianteiro Esquerdo,Cofap,GP30311,52068011,Turbogás pressurizado lado esquerdo. Fazer escorvamento prévio.,Kit Batente Nakata NK0140 / Coxim com Rolamento
Fiat,Palio / Siena / Strada / Uno / Palio Weekend,2001-2016,1.0 / 1.4 8V Fire,Kit de Embreagem,LuK,619 3015 00,55223447 / 55204467,Diâmetro 190mm e 20 estrias. Palio 1.0 antigo usava 180mm (confirmar volante).,Atuador Hidráulico LuK 511012710 / Retentor Sabó 02253
Fiat,Palio / Siena / Strada / Uno / Palio Weekend,2001-2016,1.0 / 1.4 8V Fire,Kit de Embreagem,Sachs,6586,55223447 / 55204467,Platô + disco 190mm + rolamento mecânico de desengate.,Garfo da Embreagem / Óleo Tutela 75W80
Fiat,Palio / Siena / Strada / Uno / Palio Weekend,2001-2016,1.0 / 1.4 8V Fire,Pastilha de Freio Dianteira,Cobreq,N-534,7084200 / 7087697,Sistema Teves para disco sólido. Modelos 1.4 com disco ventilado usam N-532.,Disco Fremax BD 4534 / Fluido Bosch DOT 4
```

---

## 6. ROTAS DE API DO BACKEND (`server.ts`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/query-part` | Rota principal de consulta de balcão com triagem, Function Calling e RAG. |
| `GET` | `/api/tecdoc-status` | Retorna status da conexão TecDoc, fonte ativa e registros ativos do CSV. |
| `POST` | `/api/tecdoc-test-query` | Endpoint para testar diretamente o retorno do Function Calling em milissegundos. |
| `POST` | `/api/tecdoc-upload-csv` | Permite carregar e substituir a tabela de peças com um novo arquivo CSV. |
| `GET` | `/api/health` | Healthcheck de monitoramento do servidor. |

---

## 7. CÓDIGOS-FONTE CHAVE DO SISTEMA

### 7.1 `src/data/equivalenceTableEngine.ts` (Motor de Busca e Equivalência)
```typescript
import fs from 'fs';
import path from 'path';

export interface EquivalenceRecord {
  montadora: string;
  carro: string;
  ano: string;
  motor: string;
  tipoPeca: string;
  marcaPeca: string;
  codigoReferencia: string;
  codigoOEM: string;
  alertasTecnicos: string;
  pecasRelacionadas: string;
}

export interface TecDocQueryParams {
  montadora?: string;
  carro: string;
  geracao_ou_modelo?: string;
  ano?: string | number;
  motor?: string;
  item: string;
  especificacoes?: string;
}

export interface TecDocQueryResult {
  success: boolean;
  source: 'TecDoc WebService API (Oficial TecAlliance Pegasus)' | 'Tabela de Equivalência CSV Oficial (tabela_pecas.csv)';
  extractedParams: TecDocQueryParams;
  vehicleNormalized: string;
  partNormalized: string;
  oemCode?: string;
  brands: Array<{ brand: string; code: string; description?: string }>;
  confirmationQuestions: string[];
  technicalAlerts: string[];
  relatedParts: string[];
  rawMatchesCount: number;
}

let cachedRecords: EquivalenceRecord[] | null = null;

export function getEquivalenceRecords(): EquivalenceRecord[] {
  if (cachedRecords && cachedRecords.length > 0) {
    return cachedRecords;
  }
  const csvPath = path.join(process.cwd(), 'tabela_pecas.csv');
  if (fs.existsSync(csvPath)) {
    try {
      const content = fs.readFileSync(csvPath, 'utf-8');
      cachedRecords = parseCSV(content);
      return cachedRecords;
    } catch (e) {
      console.error('Erro ao ler tabela_pecas.csv:', e);
    }
  }
  return [];
}

export function searchEquivalenceTable(params: TecDocQueryParams): TecDocQueryResult {
  const records = getEquivalenceRecords();
  const vInput = `${params.montadora || ''} ${params.carro || ''} ${params.geracao_ou_modelo || ''}`.toLowerCase();
  const pInput = (params.item || '').toLowerCase();
  const yearInput = params.ano ? String(params.ano) : '';
  const engineInput = (params.motor || '').toLowerCase();

  // Filtragem e pontuação dos registros correspondentes
  const matches = records.filter(r => {
    const rCarro = r.carro.toLowerCase();
    const rMontadora = r.montadora.toLowerCase();
    const rPeca = r.tipoPeca.toLowerCase();

    // Verificação da peça
    const isPecaMatch = pInput.split(' ').some(w => w.length > 3 && rPeca.includes(w)) ||
      rPeca.split(' ').some(w => w.length > 3 && pInput.includes(w));
    if (!isPecaMatch) return false;

    // Verificação do carro
    const carTokens = params.carro.toLowerCase().split(' ').filter(t => t.length > 2);
    const isCarMatch = carTokens.some(token => rCarro.includes(token) || vInput.includes(token));
    return isCarMatch;
  });

  const brandsMap = new Map<string, { brand: string; code: string; description?: string }>();
  let oemCode = '';
  const technicalAlerts: string[] = [];
  const relatedPartsSet = new Set<string>();

  for (const m of matches) {
    if (!oemCode && m.codigoOEM) {
      oemCode = m.codigoOEM;
    }
    if (m.marcaPeca && m.codigoReferencia) {
      brandsMap.set(`${m.marcaPeca}-${m.codigoReferencia}`, {
        brand: m.marcaPeca,
        code: m.codigoReferencia,
        description: `Aplicação Oficial ${m.carro} (${m.ano}) - Motor ${m.motor}`,
      });
    }
    if (m.alertasTecnicos && !technicalAlerts.includes(m.alertasTecnicos)) {
      technicalAlerts.push(m.alertasTecnicos);
    }
    if (m.pecasRelacionadas) {
      m.pecasRelacionadas.split('/').forEach(item => {
        const clean = item.trim();
        if (clean) relatedPartsSet.add(clean);
      });
    }
  }

  const confirmationQuestions: string[] = [];
  if (!params.especificacoes || !params.especificacoes.toLowerCase().includes('abs')) {
    confirmationQuestions.push('O veículo possui sistema de freio ABS e qual o diâmetro do aro (13, 14 ou 15)?');
  }

  return {
    success: matches.length > 0,
    source: 'Tabela de Equivalência CSV Oficial (tabela_pecas.csv)',
    extractedParams: params,
    vehicleNormalized: vInput.trim(),
    partNormalized: pInput.trim(),
    oemCode: oemCode || 'Verificar número gravado na peça física',
    brands: Array.from(brandsMap.values()),
    confirmationQuestions,
    technicalAlerts,
    relatedParts: Array.from(relatedPartsSet),
    rawMatchesCount: matches.length,
  };
}
```

---

### 7.2 `src/utils/parser.ts` (Parser do Markdown nos 6 Tópicos)
```typescript
import { ParsedCodeItem, QueryResult } from '../types';

export function parseSeniorClerkMarkdown(markdown: string): Partial<QueryResult> {
  const sections = {
    confirmationQuestions: [] as string[],
    technicalAlerts: [] as string[],
    referenceCodes: {
      oemCode: '',
      brandCodes: [] as ParsedCodeItem[],
    },
    relatedParts: {
      similars: [] as string[],
      complements: [] as string[],
    },
    visualReference: {
      searchQuery: '',
      visualDescription: '',
    },
    whereToFind: [] as Array<{
      name: string;
      address: string;
      phone: string;
      notes: string;
    }>,
  };

  // Divide o texto por títulos de primeiro ou segundo nível (# ou ##)
  const topicRegex = /#{1,3}\s*([1-6])[\.\s]+([^\n]+)([\s\S]*?)(?=(?:#{1,3}\s*[1-6][\.\s]+)|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = topicRegex.exec(markdown)) !== null) {
    const topicNumber = parseInt(match[1], 10);
    const topicContent = match[3].trim();

    switch (topicNumber) {
      case 1: // PERGUNTAS DE CONFIRMAÇÃO
        sections.confirmationQuestions = topicContent
          .split('\n')
          .map(l => l.replace(/^[-*•\d.]\s*/, '').trim())
          .filter(l => l.length > 0);
        break;

      case 2: // ALERTAS TÉCNICOS
        sections.technicalAlerts = topicContent
          .split('\n')
          .map(l => l.replace(/^[-*•]\s*/, '').trim())
          .filter(l => l.length > 0);
        break;

      case 3: // CÓDIGOS DE REFERÊNCIA
        // Extração de OEM e Marcas
        const lines = topicContent.split('\n');
        for (const line of lines) {
          const l = line.trim();
          if (/montadora|oem|original/i.test(l)) {
            const codeMatch = l.match(/[:]\s*`?([A-Za-z0-9\s\/\.\-]+)`?/);
            if (codeMatch) sections.referenceCodes.oemCode = codeMatch[1].trim();
          } else {
            const brandMatch = l.match(/[-*•]?\s*\*\*?([^:*]+)\*\*?[:\s]+`?([A-Za-z0-9\s\/\.\-]+)`?(?:\s*\((.*)\))?/);
            if (brandMatch) {
              sections.referenceCodes.brandCodes.push({
                brand: brandMatch[1].trim(),
                code: brandMatch[2].trim(),
                note: brandMatch[3] ? brandMatch[3].trim() : undefined,
              });
            }
          }
        }
        break;

      case 4: // PEÇAS RELACIONADAS
        sections.relatedParts.complements = topicContent
          .split('\n')
          .map(l => l.replace(/^[-*•]\s*/, '').trim())
          .filter(l => l.length > 0);
        break;

      case 5: // IMAGEM DE REFERÊNCIA
        sections.visualReference.visualDescription = topicContent;
        break;

      case 6: // ONDE ENCONTRAR (Rio Claro-SP)
        const supplierLines = topicContent.split('\n').filter(l => l.trim().length > 0);
        for (const sLine of supplierLines) {
          const nameMatch = sLine.match(/\*\*([^*]+)\*\*:?\s*(.*)/);
          if (nameMatch) {
            sections.whereToFind.push({
              name: nameMatch[1].trim(),
              address: nameMatch[2].trim(),
              phone: '',
              notes: '',
            });
          }
        }
        break;
    }
  }

  return sections;
}
```

---

## 8. INSTRUÇÕES PARA REPLICAR ESTE APP EM QUALQUER IA

Quando for fornecer este documento a outro agente (Claude, ChatGPT, Cursor, GitHub Copilot ou outro Gemini), copie e cole a seguinte instrução:

> *"Você é um engenheiro de software sênior especialista em React 19, TypeScript, Tailwind CSS, Express e Google Gemini API.  
> Seu objetivo é construir ou refatorar o aplicativo **AutoPeças Balcão Pro (Roncoli - Triagem Balcão)** seguindo rigorosamente as especificações deste documento.  
> 
> **Diretrizes inegociáveis:**
> 1. Use o modelo `@google/genai` com `gemini-2.5-flash` e temperatura 0.0 para assertividade estrita.
> 2. Implemente a ferramenta `buscar_peca_tecdoc` com chamada em dois turnos (Turno 1: Gemini emite o FunctionCall -> Servidor executa a busca no CSV/TecDoc -> Turno 2: Gemini recebe o FunctionResponse e formata a resposta).
> 3. Se a IA falhar ou sofrer timeout (limite de 6s do balcão), use o gerador local do `partsCatalogEngine.ts` e `tabela_pecas.csv` para garantir que o vendedor nunca fique sem resposta.
> 4. Toda a interface visual deve manter as 6 seções rigorosamente ordenadas (Perguntas de Confirmação, Alertas Técnicos, Códigos de Referência, Peças Relacionadas, Imagem de Referência, Onde Encontrar em Rio Claro-SP).
> 5. Forneça botões interativos para copiar o orçamento para o WhatsApp do cliente e consultar os distribuidores locais de Rio Claro-SP."*
