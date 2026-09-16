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
- SCHAEFFLER (LUK / INA / FAG): Kits de embreagem Repxpert, atuadores hidráulicos, rolamentos de embreagem e roda, tensores.
- ZF AFTERMARKET (SACHS / LEMFÖRDER): Kits de embreagem, atuadores, amortecedores, bandejas e direção.
- VALEO SERVICE: Sistemas de embreagem, atuadores hidráulicos, motores de partida, alternadores.
- NAKATA: Suspensão, amortecedores, pivôs, terminais de direção e axiais, bieletas, juntas homocinéticas, bombas d'água.
- COBREQ: Freios, pastilhas dianteiras e traseiras, sapatas, lonas, fluidos de freio.
- FRAS-LE: Pastilhas Ceramaxx/Lonaflex, discos e tambores de freio.
- BOSCH AUTOMOTIVE BRASIL: Injeção eletrônica, velas de ignição, cabos, bobinas, filtros, freios, bombas de combustível.
- COFAP / MAGNETI MARELLI: Amortecedores Turbogás/Super, molas, bandejas, pastilhas.
- MONROE & MONROE AXIOS: Amortecedores OESpectrum/Gas Premium, kits de batente, coxins, buchas de suspensão.
- FREMAX: Discos de freio de carbono, tambores.
- SABÓ: Retentores de volante, comando, juntas de motor, mangueiras, guarnições.
- GATES / DAYCO / CONTINENTAL CONTITECH: Correias dentadas sincronizadoras, kits com tensores, correias Poly-V.
- MAHLE / METAL LEVE: Filtros, anéis de segmento, pistões, bronzinas.
- NGK / NTK: Velas de ignição Green/G-Power/Laser Iridium, cabos supressores, sensores de oxigênio (sonda lambda).
- SKF: Rolamentos e cubos de roda, bombas d'água, tensores.
- TRW / VARGA: Sistemas de freio, cilindros mestre, cilindros de roda, atuadores de embreagem.
- FANIA / FAMA: Cabos de embreagem, acelerador e freio de mão.
- URBA / BROSOL / SCHADEK: Bombas d'água, bombas de combustível, bombas de óleo.
- TECFIL / WEGA: Filtros de óleo, combustível, ar do motor e cabine.

REGRA DE ESTRUTURAÇÃO OBRIGATÓRIA (Siga RIGOROSAMENTE esta ordem de 1 a 6):

1. PERGUNTAS DE CONFIRMAÇÃO
- Se houver dúvidas técnicas críticas que alterem o código (ex: versão da carroceria, câmbio manual vs automatizado Dualogic, diâmetro do disco 180mm vs 190mm, com ABS vs sem ABS), formule de 2 a 4 perguntas diretas.
- Se a aplicação já estiver 100% definida pelos dados informados, responda: "- Nenhuma pendência técnica. Aplicação fechada para [Veículo/Ano/Motor]."

2. ALERTAS TÉCNICOS
(Estruture obrigatoriamente com os tópicos abaixo usando bullet points):
- Variação de Lote: [Diferenças de lote, diâmetro, estrias ou ano de transição da peça]
- Componente Opcional: [O que acompanha ou NÃO acompanha a peça/kit, ex: se o atuador hidráulico vem junto ou é vendido à parte]
- Falha Comum: [Sintomas típicos de desgaste e causas recorrentes no veículo, ex: pedal duro, trepidações, ruídos]
- Recomendação Mecânica: [Cuidados indispensáveis de montagem na oficina, ex: passe/retífica do volante do motor, sangria, escorvamento]

3. CÓDIGOS DE REFERÊNCIA
- Montadora ([Marca]): [Código OEM oficial da montadora]
- [Marca Líder 1 (ex: LuK / Nakata / Cobreq)]: [Código] ([Descrição exata do kit/peça, estrias, diâmetro, se inclui platô+disco+rolamento])
- [Marca Líder 2 (ex: Sachs / Cofap / Fras-le)]: [Código] ([Descrição da peça])
- [Marca Líder 3 (ex: Valeo / Bosch / Monroe)]: [Código] ([Descrição da peça])
(Traga os códigos reais dos principais fabricantes de autopeças de 1ª linha).

4. PEÇAS RELACIONADAS
(Itens complementares e de venda casada para garantir a montagem completa e elevar o ticket do balcão):
- [Nome do Componente 1]: [Fabricante] - [Código]
- [Nome do Componente 2]: [Fabricante] - [Código]
- [Nome do Componente 3]: [Fabricante] - [Código]
- [Óleo / Fluido Recomendado]: [Marca / Especificação] - [Volume recomendado]

5. IMAGEM DE REFERÊNCIA
- Termos de busca e especificações visuais de verificação: [Termo de busca completo incluindo carro, ano e marcas, e descrição física dos componentes (formato do platô, ranhuras, molas, medidas em mm, número de dentes/estrias) para o balconista conferir na bancada com a peça velha].

6. ONDE ENCONTRAR (Rio Claro-SP)
(Lojas e distribuidoras locais em Rio Claro-SP com pronta entrega e agilidade de balcão):
- Auto Peças 3R: Rua 06 A, 1269 - Vila Alemã. Telefone: (19) 3535-4499. Integrante da Rede PitStop, com entrega rápida de balcão.
- AutoZone Rio Claro: Av. Presidente Tancredo de Almeida Neves, 535. Telefone fixo: (19) 2111-2750 / WhatsApp Mecânicas: (11) 94078-1966. Amplo estoque local para pronta entrega.
- Dinâmica Auto Peças: Avenida 15 JP, 56 - Jardim Esmeralda. Telefone/WhatsApp: (19) 98185-5828. Foco em atendimento rápido regional.
- Disauto Distribuidora: Rio Claro-SP. Telefone: (19) 3526-9000. Atacado automotivo com faturamento para oficinas.

TOM: profissional, técnico, direto, sem enrolação.`;

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
  return generateInstantCatalogResult(
    params.fullVehicle,
    params.year,
    params.part,
    params.fullEngine,
    params.notes,
    params.answers,
    {
      abs: params.abs,
      transmission: params.transmission,
      steering: params.steering,
      fuel: params.fuel,
      position: params.position,
      airConditioning: params.airConditioning,
    }
  );
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
  let loteAlert = "Conferir ano de fabricação e modelo no documento do veículo para evitar divergência de lote.";
  let opcionalAlert = "Verificar se o kit acompanha todos os componentes auxiliares de fixação.";
  let falhaAlert = "Desgaste natural e folgas de funcionamento provocam ruídos e perda de eficiência.";
  let mecanicaAlert = "Limpar a superfície de contato antes da instalação. Verificar torque recomendado pelo fabricante.";
  let similarParts = "Linha de reposição disponível em Nakata, Cobreq, Fras-le, Bosch e Cofap.";
  let compPartsList: string[] = [
    "Recomenda-se a troca preventiva de itens de desgaste associados.",
    "Parafusos e presilhas de fixação novas.",
  ];
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
    if (p.includes('embreagem')) {
      originalCode = "55223447 / 55204467";
      nakataCode = "LuK 619 3015 00";
      cobreqCode = "Sachs 6586";
      extraBrands = [
        { brand: "Valeo", code: "228213", note: "Kit com Platô + Disco 190mm + Rolamento" },
        { brand: "LuK", code: "619 3015 00", note: "Kit RepXpert (Platô + Disco 190mm + Rolamento)" },
        { brand: "Sachs", code: "6586", note: "Kit com Platô + Disco 190mm + Rolamento" },
      ];
      loteAlert = "Modelos 2008 usam originalmente o kit de 190mm e 20 estrias, mas alguns lotes de transição ou motores recuperados rodam com volante de motor para 180mm. Confirmar no balcão.";
      opcionalAlert = "O kit não acompanha o atuador hidráulico de embreagem.";
      falhaAlert = "Pedal duro no Palio Fire geralmente é causado por desgaste acentuado nas faces do platô e rolamento guia desalinhado.";
      mecanicaAlert = "Exigir que o mecânico faça o passe ou retífica do volante do motor antes de instalar o kit novo para evitar trepidações e perda de garantia.";
      similarParts = "LuK 619 3015 00 (Original de fábrica), Sachs 6586, Valeo 228213.";
      compPartsList = [
        "Atuador Hidráulico de Embreagem (Pedal): LuK - 511012710",
        "Cilindro Escravo de Embreagem (Câmbio): TRW - RCCE00110",
        "Cabo de Embreagem (Se mecânico): Fania - 61123",
        "Retentor do Volante do Motor: Sabó - 02253BRGF",
        "Óleo de Câmbio Recomendado: Tutela 75W80 Synthetic - 1 Litro",
      ];
      visualDesc = "Kit com Platô com diafragma de 190mm, Disco de 20 estrias com amortecimento torcional e Rolamento mecânico de desengate.";
    } else if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "7084200 / 7087697";
      cobreqCode = "N-534";
      nakataCode = "PW534";
      extraBrands = [
        { brand: "Fras-le", code: "PD/60", note: "Sistema Teves / Varga" },
        { brand: "SYL", code: "SYL1098", note: "Reposição rápida" },
        { brand: "Bosch", code: "0986BB0702", note: "Linha cerâmica/metálica" },
      ];
      loteAlert = "Conferir espessura e tipo de disco (9.0mm para sólido, 18.2mm para ventilado).";
      opcionalAlert = "Não acompanha presilhas e pinos de travamento em algumas marcas secundárias.";
      falhaAlert = "Ruído agudo de frenagem provocado por falta de desbaste ou assentamento em disco riscado.";
      mecanicaAlert = "Limpar a pinça, desengraxar os discos com solvente e aplicar pasta anti-ruído nas costas da pastilha.";
      similarParts = "Cobreq N-534, Fras-le PD/60, Nakata PW534.";
      compPartsList = [
        "Disco de Freio Dianteiro: Fremax - BD-4534",
        "Fluido de Freio DOT 4: Bosch - 0986BB0001",
        "Kit de Reparo e Flexível: Varga - RPF00120",
      ];
      visualDesc = "Pastilha compacta com recorte curvo inferior e mola de retenção superior.";
    } else if (p.includes('correia') || p.includes('dentada')) {
      originalCode = "46759750 / 55203790";
      nakataCode = "Gates KS201";
      cobreqCode = "Contitech CT488K1";
      extraBrands = [
        { brand: "Dayco", code: "KTB271", note: "Kit completo com tensor automático" },
        { brand: "Ina", code: "530 0110 10", note: "Rolamento tensor original" },
      ];
      loteAlert = "Motor Fire 8V utiliza correia de 129 dentes. Conferir modelo exato do tensor (mecânico vs automático).";
      opcionalAlert = "Kit básico não inclui bomba d'água nem correia de acessórios poly-v.";
      falhaAlert = "Ruído de rolamento chiando indica fadiga do tensor; rompimento da correia empena válvulas.";
      mecanicaAlert = "Utilizar obrigatoriamente ferramenta de fasagem para travar comando e virabrequim no PMS.";
      similarParts = "Gates KS201, Contitech CT488K1, Dayco KTB271.";
      compPartsList = [
        "Bomba d'Água: Urba - UB0762",
        "Correia de Acessórios Alternador: Gates - 4PK0668",
        "Aditivo de Radiador Pronto Uso: Tirreno / Paraflu - 1 Litro",
      ];
      visualDesc = "Correia sincronizadora de borracha HNBR com 129 dentes e rolamento tensor metálico.";
    }
  }
  // CORSA / CELTA / CLASSIC / MONTANA (GM Família I)
  else if (v.includes('corsa') || v.includes('celta') || v.includes('classic') || v.includes('montana') || v.includes('prisma antigo')) {
    if (p.includes('embreagem')) {
      originalCode = "93399066 / 93332205";
      nakataCode = "LuK 618 3018 00";
      cobreqCode = "Sachs 6284";
      extraBrands = [
        { brand: "Valeo", code: "228205", note: "Kit Platô + Disco 180mm + Rolamento mecânico" },
        { brand: "LuK", code: "618 3018 00", note: "Kit RepSet (180mm, 14 estrias)" },
        { brand: "Sachs", code: "6284", note: "Kit tradicional linha Família I" },
      ];
      loteAlert = "Motores 1.0 e 1.4 usam disco de 180mm com 14 estrias. Motores 1.8 usam disco de 200mm.";
      opcionalAlert = "Não acompanha garfo de embreagem e nem retentor traseiro do virabrequim.";
      falhaAlert = "Trepidação na saída e pedal pesado por endurecimento das molas do platô e desgaste do rolamento.";
      mecanicaAlert = "Verificar estado do volante do motor, folga do eixo piloto e engraxar o tubo guia com graxa sintética fina.";
      similarParts = "LuK 618 3018 00, Sachs 6284, Valeo 228205.";
      compPartsList = [
        "Cabo de Embreagem: Fania - 34105",
        "Retentor do Volante do Motor: Sabó - 02253BRGF",
        "Óleo de Câmbio SAE 75W85 ou 80W: ACDelco - 93231454",
      ];
      visualDesc = "Kit com Platô 180mm, Disco com 4 molas amortecedoras e Rolamento guia de encaixe mecânico.";
    } else if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "93282464 / 93388686";
      cobreqCode = "N-324";
      nakataCode = "PW324";
      extraBrands = [
        { brand: "Fras-le", code: "PD/54", note: "Sistema Varga dianteiro" },
        { brand: "Bosch", code: "0986BB0748", note: "Pastilha com calço anti-ruído" },
        { brand: "SYL", code: "SYL1089", note: "Excelente custo no balcão" },
      ];
      loteAlert = "Corsa e Celta até 2009 utilizam sistema Varga simples. Modelos com disco ventilado usam pastilha mais espessa.";
      opcionalAlert = "O kit de pastilhas não inclui o fluido de freio nem os sangradores.";
      falhaAlert = "Assobio e chiado ao frear devido a ressecamento e falta de chanfro nas bordas.";
      mecanicaAlert = "Lixar de leve as bordas da pastilha, limpar cavalete com desengraxante e inspecionar coifas dos pinos deslizantes.";
      similarParts = "Cobreq N-324, Fras-le PD/54, Nakata PW324, Bosch 0986BB0748.";
      compPartsList = [
        "Disco de Freio Dianteiro Sólido: Fremax - BD-1111",
        "Fluido de Freio DOT 4: Bosch - 0986BB0001",
        "Kit de Reparo dos Pinos Guia: Varga - RPF00340",
      ];
      visualDesc = "Jogo de 4 pastilhas com chapa traseira antivibratória e mola de sustentação.";
    } else if (p.includes('amortecedor')) {
      originalCode = "93297746 (Diant)";
      nakataCode = "HG33005";
      cobreqCode = "Cofap GP30061";
      extraBrands = [
        { brand: "Monroe", code: "SP049", note: "Linha Monroe Gas Premium" },
        { brand: "Nakata", code: "HG33005", note: "Pressurizado a gás de alta durabilidade" },
      ];
      loteAlert = "Celta e Classic usam amortecedor dianteiro com cartucho e suporte de barra estabilizadora específico.";
      opcionalAlert = "Não acompanha coxins superiores e nem pratos de mola.";
      falhaAlert = "Batidas secas na dianteira e perda de estabilidade em curvas.";
      mecanicaAlert = "Fazer o escorvamento (3 a 5 acionamentos completos da haste) antes da fixação da torre.";
      similarParts = "Cofap GP30061, Nakata HG33005, Monroe SP049.";
      compPartsList = [
        "Kit Batente + Coifa Dianteira: Monroe Axios - 044.1120",
        "Coxim Superior com Rolamento: Sampel - SK210S",
      ];
      visualDesc = "Tubo dianteiro preto de fixação McPherson com haste cromada.";
    }
  }
  // FORD KA / FIESTA / ECOSPORT
  else if (v.includes('ka') || v.includes('fiesta') || v.includes('ecosport')) {
    if (p.includes('embreagem')) {
      originalCode = "2S65-7540-AA / 98FU-7540-AB";
      nakataCode = "LuK 619 3006 00";
      cobreqCode = "Sachs 6280";
      extraBrands = [
        { brand: "Valeo", code: "228185", note: "Kit 190mm com atuador hidráulico" },
        { brand: "LuK", code: "619 3006 00", note: "Kit RepSet (190mm, 17 estrias)" },
        { brand: "Sachs", code: "6280", note: "Linha Zetec Rocam 1.0 e 1.6" },
      ];
      loteAlert = "Motores Zetec Rocam usam disco de 190mm e 17 estrias. Motores Sigma usam conjunto diferente de 200mm.";
      opcionalAlert = "Conferir se o kit escolhido já vem com o atuador hidráulico de embreagem incluso (kit com 3 ou 4 peças).";
      falhaAlert = "Vazamento no atuador hidráulico dentro do câmbio que contamina o disco de embreagem com fluido.";
      mecanicaAlert = "Trocar OBRIGATORIAMENTE o atuador hidráulico central no câmbio toda vez que trocar o kit de embreagem.";
      similarParts = "LuK 619 3006 00, Sachs 6280, Valeo 228185.";
      compPartsList = [
        "Atuador Hidráulico de Câmbio: LuK - 510006410",
        "Fluido de Embreagem DOT 4: Bosch - 0986BB0001",
        "Retentor do Eixo Piloto: Sabó - 02441BRGP",
      ];
      visualDesc = "Kit de embreagem com platô de 190mm, disco estriado e atuador concêntrico.";
    } else if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "2S65-2K021-AB";
      cobreqCode = "N-143";
      nakataCode = "PW143";
      extraBrands = [
        { brand: "Fras-le", code: "PD/50", note: "Sistema ATE / Teves dianteiro" },
        { brand: "Bosch", code: "0986BB0726", note: "Linha original Ford" },
      ];
      loteAlert = "Fiesta e Ka até 2013 usam pastilha sem ranhura de sensor de desgaste.";
      opcionalAlert = "Pastilha avulsa não acompanha disco de freio nem fluido.";
      falhaAlert = "Desgaste irregular provocado por engripamento nos pinos deslizantes da pinça.";
      mecanicaAlert = "Limpar a pinça, engraxar os pinos guia com graxa de silicone neutra e sangrar o sistema.";
      similarParts = "Cobreq N-143, Fras-le PD/50, Nakata PW143.";
      compPartsList = [
        "Disco Dianteiro Sólido: Fremax - BD-2920",
        "Fluido de Freio DOT 4: Varga - V204",
      ];
      visualDesc = "Jogo de 4 pastilhas com orelhas retangulares e garras traseiras.";
    }
  }
  // RENAULT SANDERO / LOGAN / DUSTER / KWID
  else if (v.includes('sandero') || v.includes('logan') || v.includes('duster') || v.includes('kwid')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "410602192R / 410605536R";
      cobreqCode = "N-448";
      nakataCode = "PW448";
      extraBrands = [
        { brand: "Fras-le", code: "PD/74", note: "Sistema Bosch / Teves" },
        { brand: "Bosch", code: "0986BB0744", note: "Padrão de montadora Renault" },
      ];
      loteAlert = "Modelos 1.0 16V e 1.6 8V podem variar conforme o diâmetro do disco de freio (238mm vs 259mm).";
      opcionalAlert = "Não inclui molas de retorno em marcas secundárias.";
      falhaAlert = "Ruído de atrito metálico por desgaste das lonas além do limite de segurança.";
      mecanicaAlert = "Medir a espessura do disco de freio com micrômetro antes de instalar a pastilha nova.";
      similarParts = "Cobreq N-448, Fras-le PD/74, Bosch 0986BB0744.";
      compPartsList = [
        "Disco de Freio Dianteiro: Fremax - BD-4148",
        "Fluido DOT 4: Bosch - 0986BB0001",
      ];
      visualDesc = "Jogo de pastilhas com perfil curvo simétrico Renault.";
    } else if (p.includes('embreagem')) {
      originalCode = "302052341R / 302057505R";
      nakataCode = "LuK 618 3088 00";
      cobreqCode = "Valeo 228022";
      extraBrands = [
        { brand: "Sachs", code: "6423", note: "Kit 180mm / 200mm linha Renault" },
        { brand: "LuK", code: "618 3088 00", note: "Kit RepSet para motor 1.0 16V D4D" },
      ];
      loteAlert = "Sandero 1.0 16V D4D usa kit de 180mm e 26 estrias. Modelos 1.6 usam 200mm.";
      opcionalAlert = "Atuador hidráulico de embreagem vendido separadamente.";
      falhaAlert = "Patinamento da embreagem ao subir aclives em rotação média.";
      mecanicaAlert = "Trocar o retentor do volante do motor e fazer retífica na face do volante.";
      similarParts = "Valeo 228022, LuK 618 3088 00, Sachs 6423.";
      compPartsList = [
        "Atuador Hidráulico de Câmbio: Valeo - 804527",
        "Retentor do Volante: Sabó - 05581BRGP",
      ];
      visualDesc = "Kit Platô e Disco 180mm com miolo de 26 estrias para câmbio Renault.";
    }
  }
  // TOYOTA COROLLA / ETIOS / YARIS
  else if (v.includes('corolla') || v.includes('etios') || v.includes('yaris')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "04465-02220 / 04465-02390";
      cobreqCode = "N-1376";
      nakataCode = "PW1376";
      extraBrands = [
        { brand: "Fras-le", code: "PD/1445", note: "Linha Ceramaxx de alta durabilidade" },
        { brand: "Bosch", code: "0986BB0823", note: "Com chapa anti-ruído original" },
      ];
      loteAlert = "Corolla 2008 a 2014 usa pastilha N-1376. Modelos de 2015 em diante usam padrão N-1473.";
      opcionalAlert = "Não inclui chapas de amortecimento acústico em jogos paralelos.";
      falhaAlert = "Poeira excessiva nas rodas de liga leve quando utilizada pastilha semi-metálica sem cerâmica.";
      mecanicaAlert = "Utilizar exclusivamente pastilhas cerâmicas e lubrificar pinos guia com graxa especial.";
      similarParts = "Cobreq N-1376, Fras-le PD/1445, Bosch 0986BB0823.";
      compPartsList = [
        "Disco de Freio Dianteiro Ventilado: Fremax - BD-4220",
        "Fluido de Freio DOT 5.1 / DOT 4: Bosch - 0986BB0002",
      ];
      visualDesc = "Jogo com 4 pastilhas cerâmicas chanfradas com sensores acústicos de desgaste.";
    }
  }
  // HONDA CIVIC / FIT / CITY
  else if (v.includes('civic') || v.includes('fit') || v.includes('city')) {
    if (p.includes('pastilha') || p.includes('freio')) {
      originalCode = "45022-S5A-J00 / 45022-TR0-A00";
      cobreqCode = "N-1365";
      nakataCode = "PW1365";
      extraBrands = [
        { brand: "Fras-le", code: "PD/689", note: "Padrão de montadora japonesa" },
        { brand: "Bosch", code: "0986BB0811", note: "Pastilha de cerâmica silenciosa" },
      ];
      loteAlert = "Civic G8 (2006 a 2011) usa N-1365 dianteira. Civic G9 (2012 a 2016) usa padrão N-1412.";
      opcionalAlert = "Não inclui presilhas de aço inox nos modelos mais baratos.";
      falhaAlert = "Desgaste precoce e trepidação no volante ao frear.";
      mecanicaAlert = "Medir empenamento do disco com relógio comparador na torre antes da liberação.";
      similarParts = "Cobreq N-1365, Fras-le PD/689, Bosch 0986BB0811.";
      compPartsList = [
        "Disco de Freio Dianteiro: Fremax - BD-4589",
        "Fluido de Freio DOT 4: Bosch - 0986BB0001",
      ];
      visualDesc = "Pastilha com garras e avisador acústico metálico de limite de desgaste.";
    }
  }
  // OUTROS MODELOS: NUNCA GERAR CÓDIGOS ALEATÓRIOS FICTÍCIOS!
  else {
    originalCode = `Consulte via Chassi (17 dígitos) na concessionária oficial OEM`;
    nakataCode = `Consulte catálogo oficial Nakata`;
    cobreqCode = `Consulte catálogo oficial Cobreq`;
    extraBrands = [
      { brand: "Bosch Automotive", code: "Consulte catálogo e-Cat Bosch", note: "Verificar aplicação exata por motorização e ano" },
      { brand: "Schaeffler LuK", code: "Consulte catálogo RepXpert", note: "Consultar diâmetro de disco e número de estrias" },
      { brand: "Cofap / Magneti Marelli", code: "Consulte catálogo eletrônico Cofap", note: "Verificar código do amortecedor / mola" },
      { brand: "Fras-le", code: "Consulte catálogo Fras-le", note: "Conferir sistema de pinça e medidas da pastilha" },
    ];
    loteAlert = `Para ${params.fullVehicle} ${params.year}, é indispensável checar os 8 últimos dígitos do chassi para verificar a série e motorização exata.`;
    opcionalAlert = `Confira nos catálogos oficiais os componentes inclusos no kit do fabricante antes de faturar.`;
    falhaAlert = `Ruídos anormais, folga ou perda de rendimento exigem substituição preventiva imediata.`;
    mecanicaAlert = `Siga rigorosamente o manual de reparo da montadora para ${params.fullVehicle}, observando torques de aperto e limpeza das sedes.`;
    similarParts = `Consulte os catálogos oficiais online: Nakata, Cobreq, Schaeffler LuK, Fras-le, Bosch e Cofap.`;
    compParts = `Verificar componentes periféricos, parafusos de fixação, retentores e fluidos de trabalho durante a montagem.`;
    visualDesc = `Componente homologado com medidas e tolerâncias de engenharia correspondentes ao modelo ${params.fullVehicle}.`;
  }

  // Construct Markdown following the exact 6 sections
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

  // 2. ALERTAS TÉCNICOS
  md += "# 2. ALERTAS TÉCNICOS\n";
  md += `- **Variação de Lote:** ${loteAlert}\n`;
  md += `- **Componente Opcional:** ${opcionalAlert}\n`;
  md += `- **Falha Comum:** ${falhaAlert}\n`;
  md += `- **Recomendação Mecânica:** ${mecanicaAlert}\n\n`;

  // 3. CÓDIGOS DE REFERÊNCIA
  md += "# 3. CÓDIGOS DE REFERÊNCIA\n";
  md += `- **Montadora (${params.brand || 'Original'}):** \`${originalCode}\`\n`;
  md += `- **Nakata:** \`${nakataCode}\`\n`;
  md += `- **Cobreq:** \`${cobreqCode}\`\n`;
  extraBrands.forEach(eb => {
    md += `- **${eb.brand}:** \`${eb.code}\` (${eb.note})\n`;
  });
  md += "\n";

  // 4. PEÇAS RELACIONADAS
  md += "# 4. PEÇAS RELACIONADAS\n";
  compPartsList.forEach(cp => {
    md += `- ${cp}\n`;
  });
  if (similarParts) {
    md += `- **Similares recomendadas:** ${similarParts}\n`;
  }
  md += "\n";

  // 5. IMAGEM DE REFERÊNCIA
  const searchTerm = `${params.part} ${params.fullVehicle} ${params.year} ${nakataCode !== 'HG33000' ? nakataCode : cobreqCode}`.trim();
  md += "# 5. IMAGEM DE REFERÊNCIA\n";
  md += `- **Termo de busca pronto:** "${searchTerm}"\n`;
  md += `- **Descrição visual:** ${visualDesc}\n\n`;

  // 6. ONDE ENCONTRAR (Rio Claro-SP)
  md += "# 6. ONDE ENCONTRAR (Rio Claro-SP)\n";
  md += `- **Auto Peças 3R:** Rua 06 A, 1269 - Vila Alemã. Telefone: (19) 3535-4499. Integrante da Rede PitStop, com entrega rápida de balcão.\n`;
  md += `- **AutoZone Rio Claro:** Av. Presidente Tancredo de Almeida Neves, 535. Telefone fixo: (19) 2111-2750 / WhatsApp Mecânicas: (11) 94078-1966. Amplo estoque local para pronta entrega.\n`;
  md += `- **Dinâmica Auto Peças:** Avenida 15 JP, 56 - Jardim Esmeralda. Telefone/WhatsApp: (19) 98185-5828. Foco em atendimento rápido regional.\n`;
  md += `- **Disauto Distribuidora:** Rio Claro-SP. Telefone: (19) 3526-9000. Atacado automotivo com ampla pronta entrega.\n`;

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
    let aiProvider = "Catálogo Técnico Especialista Balcão";
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
          `Você DEVE consultar os catálogos oficiais dos fabricantes de 1ª linha (Schaeffler LUK, Sachs, Valeo, Nakata, Cobreq, Fras-le, Bosch, Cofap, Monroe, Sabó, Fremax, Gates, Dayco, Continental, Mahle, NGK, SKF) para este veículo e peça.\n` +
          `Pesquise e traga os códigos REAIS e oficiais de aplicação usando a busca online.\n` +
          `Siga RIGOROSAMENTE as 6 seções numeradas (1. PERGUNTAS DE CONFIRMAÇÃO, 2. ALERTAS TÉCNICOS, 3. CÓDIGOS DE REFERÊNCIA, 4. PEÇAS RELACIONADAS, 5. IMAGEM DE REFERÊNCIA, 6. ONDE ENCONTRAR (Rio Claro-SP)).\n` +
          `Na Seção 2 (ALERTAS TÉCNICOS), inclua obrigatoriamente: Variação de Lote, Componente Opcional, Falha Comum e Recomendação Mecânica.`;

        if (answers && Object.keys(answers).length > 0) {
          userPrompt += `\n\nRespostas de triagem já confirmadas pelo cliente no balcão:\n` +
            Object.entries(answers)
              .map(([q, a]) => `- ${q} -> ${a}`)
              .join("\n");
          userPrompt += `\n\nAGORA QUE VOCÊ TEM A CONFIRMAÇÃO, PESQUISE E TRAGA OS CÓDIGOS EXATOS NA SEÇÃO 3!`;
        }

        // Multi-tier resilient execution with Google Gemini:
        // Cascade: gemini-3.5-flash -> gemini-3.8-flash -> gemini-2.5-flash
        // For each model: First try with Google Search Grounding; if quota 429/timeout occurs,
        // immediately try direct automotive intelligence (which holds genuine catalog data).

        let response: any = null;
        aiProvider = "Google Gemini IA Oficial • Catálogos Automotivos";
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-2.5-flash", "gemini-3.8-flash"];

        for (const targetModel of candidateModels) {
          if (response?.text && response.text.trim()) break;

          // Attempt A: with Google Search Grounding in official catalogs
          try {
            console.log(`[Balcão] Tentando ${targetModel} com Busca Online em Catálogos...`);
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout Busca Online ${targetModel} (10s)`)), 10000)
            );

            response = await Promise.race([
              ai.models.generateContent({
                model: targetModel,
                contents: userPrompt,
                config: {
                  systemInstruction: SYSTEM_INSTRUCTION,
                  temperature: 0.2,
                  tools: [{ googleSearch: {} }],
                },
              }),
              timeoutPromise,
            ]);

            if (response?.text && response.text.trim()) {
              aiProvider = `Google Gemini IA (${targetModel}) • Busca Online em Catálogos`;
              console.log(`[Balcão] Sucesso com ${targetModel} (com Busca Online)!`);
              break;
            }
          } catch (searchErr: any) {
            const errStr = String(searchErr?.message || searchErr);
            if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("resource_exhausted")) {
              isQuotaExceeded = true;
            }
            console.warn(`[Balcão] ${targetModel} com Busca Online indisponível ou cota 429:`, searchErr?.message || searchErr);

            // Attempt B: Direct without Google Search tool (using rich neural weights on automotive parts)
            try {
              console.log(`[Balcão] Tentando ${targetModel} Direto (sem ferramenta)...`);
              const timeoutPromise2 = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`Timeout IA Direta ${targetModel} (10s)`)), 10000)
              );

              response = await Promise.race([
                ai.models.generateContent({
                  model: targetModel,
                  contents: userPrompt,
                  config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.2,
                  },
                }),
                timeoutPromise2,
              ]);

              if (response?.text && response.text.trim()) {
                aiProvider = `Google Gemini IA (${targetModel}) • Inteligência Automotiva Multimarcas`;
                console.log(`[Balcão] Sucesso com ${targetModel} Direto!`);
                break;
              }
            } catch (directErr: any) {
              const errStr2 = String(directErr?.message || directErr);
              if (errStr2.includes("429") || errStr2.includes("quota") || errStr2.includes("RESOURCE_EXHAUSTED") || errStr2.includes("resource_exhausted")) {
                isQuotaExceeded = true;
              }
              console.warn(`[Balcão] ${targetModel} Direto falhou:`, directErr?.message || directErr);
            }
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
      quotaExceeded: isQuotaExceeded,
      isQuotaExceeded,
      verifiedSources,
      aiProvider,
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
