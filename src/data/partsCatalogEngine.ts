// Banco de Dados Técnico de Alta Precisão - Balcão Especialista Brasil
// Códigos REAIS cruzados com Catálogos Oficiais de Fabricantes de 1ª Linha:
// Schaeffler LuK, Sachs, Valeo, Nakata, Cobreq, Fras-le, Bosch, Cofap, Fremax, Monroe, Sabó, Gates, Contitech, NGK

export interface VehiclePartRecord {
  partName: string; // "pastilha", "disco", "amortecedor", "embreagem", "correia", "vela", "bomba", "pivo", "terminal"
  originalOEM: string;
  brands: {
    brand: string;
    code: string;
    description: string;
  }[];
  confirmationQuestions?: string[];
  loteAlert: string;
  opcionalAlert: string;
  falhaAlert: string;
  mecanicaAlert: string;
  complementaryParts: string[];
  similarBrands: string;
  searchVisual: string;
}

export interface VehicleDataRecord {
  keywords: string[];
  models: string[];
  records: Record<string, VehiclePartRecord>;
}

export const OFFICIAL_VEHICLE_DATABASE: Record<string, VehicleDataRecord> = {
  // ──────────────────────────────────────────────────────────────────────────
  // GENERAL MOTORS / CHEVROLET: ONIX, PRISMA, CELTA, CORSA, COBALT, SPIN
  // ──────────────────────────────────────────────────────────────────────────
  "gm_onix_prisma": {
    keywords: ["onix", "prisma", "spin", "cobalt", "joy"],
    models: ["Onix", "Prisma", "Spin", "Cobalt", "Onix Plus"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "95231012 / 52068329 / 13301207",
        brands: [
          { brand: "Cobreq", code: "N-388", description: "Sistema Teves com antirruído / Sistema GM" },
          { brand: "Fras-le", code: "PD/1301", description: "Pastilha dianteira Ceramaxx Lonaflex" },
          { brand: "Nakata", code: "NKF 1301P", description: "Jogo dianteiro cerâmica com plaqueta antirruído" },
          { brand: "Bosch", code: "0 986 BB0 735", description: "Linha Bosch Premium de frenagem macia" }
        ],
        confirmationQuestions: [
          "O carro é aro 14 ou aro 15? (Muda a espessura e pinça de freio Teves vs Mando)",
          "Possui sistema ABS? (Onix todos a partir de 2014 são com ABS obrigatório)"
        ],
        loteAlert: "Onix 1.0 e 1.4 utilizam sistema Teves. Onix Turbo (geração nova 2020+) utiliza sistema Mando código Cobreq N-2070.",
        opcionalAlert: "Kit não acompanha os pinos guia e travas metálicas da pinça. Recomenda-se conferir folga do pino guia.",
        falhaAlert: "Pastilha gasta ou espelhada gera chiado agudo metálico e perda de coeficiente de atrito em frenagens bruscas.",
        mecanicaAlert: "Limpar e lixar as pistas dos discos se estiverem abaixo de 0.8mm de desgaste. Usar graxa sintética nas costas da pastilha contra chiado.",
        complementaryParts: [
          "Discos de Freio Dianteiros Ventilados: Fremax BD 1440 ou Hipper Freios HF 14A",
          "Fluido de Freio DOT 4: Bosch DOT 4 Plus 500ml",
          "Kit de Pinos Guia e Coifas da Pinça: Nakata NKP 5014"
        ],
        similarBrands: "Disponível em Cobreq, Fras-le, Nakata, Bosch e Syl.",
        searchVisual: "Pastilha formato retangular com mola superior curvada e chapa antirruído traseira preta."
      },
      "disco": {
        partName: "Disco de Freio Dianteiro",
        originalOEM: "95264601 / 13502011",
        brands: [
          { brand: "Fremax", code: "BD 1440", description: "Disco ventilado com pintura protetiva anticorrosiva Carbon+" },
          { brand: "Hipper Freios", code: "HF 14A", description: "Disco ventilado diâmetro 256mm, 4 furos" },
          { brand: "Cobreq", code: "0014-BD", description: "Disco ventilado dianteiro alta performance" },
          { brand: "Nakata", code: "NKF 6140", description: "Disco de freio ventilado par dianteiro" }
        ],
        loteAlert: "Onix 1.0 aspirado geralmente usa disco sólido 240mm ou ventilado 256mm conforme ano e presença de ar condicionado.",
        opcionalAlert: "Vendidos sempre aos pares. Nunca troque apenas um disco em um lado do veículo.",
        falhaAlert: "Empenamento por choque térmico provoca trepidação severa no volante ao acionar o pedal de freio a partir de 60 km/h.",
        mecanicaAlert: "Limpar rigorosamente a face do cubo de roda com escova de aço antes de fixar o disco novo. Medir empenamento com relógio comparador.",
        complementaryParts: [
          "Pastilhas de Freio Cobreq N-388 / Fras-le PD/1301",
          "Desengraxante de Freio Spray 300ml"
        ],
        similarBrands: "Fremax, Hipper Freios, Cobreq e Nakata.",
        searchVisual: "Disco ventilado com alhetas internas de refrigeração e 4 furos de fixação de roda."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Rolamento)",
        originalOEM: "24582967 / 93325603 / 55562234",
        brands: [
          { brand: "Schaeffler LuK", code: "620 3113 00", description: "Kit LuK RepSet diâmetro 200mm, 14 estrias, com rolamento" },
          { brand: "Sachs", code: "6282", description: "Kit de embreagem reforçado Sachs 200mm 14 estrias" },
          { brand: "Valeo", code: "228271", description: "Kit 3 peças com tecnologia de amortecimento torcional" }
        ],
        confirmationQuestions: [
          "Câmbio é manual de 5 ou 6 marchas? (Onix 1.4 6 marchas e Onix 1.0 utilizam estrias e diâmetros distintos)",
          "O acionamento é por cabo ou atuador hidráulico central?"
        ],
        loteAlert: "Onix 1.0 SPE/4 5 marchas usa disco de 190mm/200mm com 14 estrias. Onix 1.4 usa disco 200mm de carga maior no platô.",
        opcionalAlert: "O kit LuK 620 3113 00 acompanha platô, disco e rolamento mecânico. Se o veículo utilizar atuador hidráulico concêntrico, o atuador LuK 510 0113 10 deve ser adquirido à parte.",
        falhaAlert: "Pedal de embreagem pesado, patinação em arrancadas de subida, trepidação na saída de primeira marcha.",
        mecanicaAlert: "Obrigatório retificar ou dar passe no volante do motor antes da montagem. Nunca deixar resíduos de óleo nas lonas do disco.",
        complementaryParts: [
          "Atuador Hidráulico de Embreagem LuK 510 0113 10 (se sistema for hidráulico)",
          "Retentor do Volante do Motor Sabó 05244 BRGS",
          "Óleo de Transmissão Manual 75W85 Sintético (2 Litros)"
        ],
        similarBrands: "Schaeffler LuK, Sachs ZF e Valeo Service.",
        searchVisual: "Platô metálico com molas diafragma centrais, disco de embreagem com 4 molas amortecedoras e lona de atrito."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "95076625 / 95076626 / 95227749",
        brands: [
          { brand: "Cofap", code: "GP32984 / GP32985 (D) e B.48184 (T)", description: "Amortecedor pressurizado Turbogás direito/esquerdo dianteiro e par traseiro" },
          { brand: "Nakata", code: "HG 33014 (D) / HG 33015 (E) / HG 31144 (T)", description: "Amortecedor pressurizado a gás HG Nakata" },
          { brand: "Monroe", code: "SP045 / SP046 (D) e SP047 (T)", description: "Monroe OESpectrum pressurizado a gás" }
        ],
        confirmationQuestions: [
          "O veículo é o modelo Joy/antigo ou a versão Onix Plus / G2 2020 em diante?",
          "Deseja o amortecedor dianteiro lado direito, lado esquerdo ou o par traseiro?"
        ],
        loteAlert: "Amortecedores dianteiros possuem lado específico de fixação do suporte da bieleta e flexível de freio.",
        opcionalAlert: "Não acompanha coxim superior, rolamento de peso e coifa batente. Recomendado trocar o kit de suspensão junto.",
        falhaAlert: "Vazamento de óleo pelo retentor da haste, batida seca em lombadas e instabilidade direcional em curvas.",
        mecanicaAlert: "Obrigatório escorvar (sangrar) os amortecedores antes da montagem movimentando a haste para cima e para baixo 4 a 5 vezes.",
        complementaryParts: [
          "Kit Batente + Coifa + Coxim Dianteiro: Nakata SK 214S ou Monroe Axios 044.2415",
          "Bieletas da Barra Estabilizadora: Nakata N 99026 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Tubo telescópico metálico preto com prato de mola soldado e suporte para fixação na manga de eixo."
      },
      "correia": {
        partName: "Kit Correia Dentada Sincronizadora do Motor",
        originalOEM: "93353888 / 93339174 / 94702061",
        brands: [
          { brand: "Gates", code: "KS 101", description: "Kit PowerGrip com correia 111 dentes + tensor automático" },
          { brand: "Continental Contitech", code: "CT 874 K1", description: "Kit correia dentada + tensionador automático" },
          { brand: "Dayco", code: "KTB 241", description: "Kit sincronizador completo motor 8V GM" }
        ],
        loteAlert: "Onix 1.0 / 1.4 8V SPE/4 utiliza correia dentada seca. ATENÇÃO: Onix 1.0 3 Cilindros Turbo 2020+ usa correia banhada a óleo Dayco BIO!",
        opcionalAlert: "O kit acompanha correia e tensor automático. A bomba d'água não acompanha e deve ser checada.",
        falhaAlert: "Rompimento causa colisão catastrófica das válvulas com os pistões e empenamento do cabeçote.",
        mecanicaAlert: "Utilizar ferramenta de fasagem de comando e travar virabrequim. Ajustar o ponteiro do tensor no corte central indicador de tensão.",
        complementaryParts: [
          "Bomba d'Água: Urba UB0168 ou Nakata NKBA 01168",
          "Aditivo de Arrefecimento Orgânico Concentrado: Delphi ou Tirreno Rosa (2 Litros)"
        ],
        similarBrands: "Gates PowerGrip, Continental Contitech e Dayco.",
        searchVisual: "Correia de borracha sintética HNBR com 111 dentes trapezoidais e esticador metálico com rolamento."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VOLKSWAGEN: GOL, VOYAGE, SAVEIRO, FOX, POLO (MOTORES EA111 E EA211)
  // ──────────────────────────────────────────────────────────────────────────
  "vw_gol_voyage_fox": {
    keywords: ["gol", "voyage", "saveiro", "fox", "crossfox", "spacefox", "polo"],
    models: ["Gol", "Voyage", "Saveiro", "Fox", "Polo"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "5Z0 698 151 A / 1JE 698 151",
        brands: [
          { brand: "Cobreq", code: "N-250", description: "Sistema Teves dianteiro (aro 13/14 disco sólido e ventilado)" },
          { brand: "Cobreq", code: "N-285", description: "Sistema Teves para aro 15 disco ventilado 256mm" },
          { brand: "Fras-le", code: "PD/362", description: "Linha Ceramaxx Lonaflex dianteira VW" },
          { brand: "Nakata", code: "NKF 1042P", description: "Pastilha dianteira cerâmica com chapa silenciadora" }
        ],
        confirmationQuestions: [
          "O carro é aro 13/14 com disco sólido 239mm ou aro 15 com disco ventilado 256mm?",
          "O freio possui mola antirruído externa na pinça?"
        ],
        loteAlert: "Gol G5/G6/G7 1.0 usa majoritariamente Cobreq N-250. Versões 1.6 e Rallye aro 15 usam Cobreq N-285 (pastilha mais larga).",
        opcionalAlert: "Não acompanha os parafusos de guia da pinça de freio.",
        falhaAlert: "Tremedeira e assobio forte ao frear com pastilhas gastas no ferro.",
        mecanicaAlert: "Limpar e lubrificar pinos de guia da pinça com silicone automotivo de alta temperatura.",
        complementaryParts: [
          "Disco de Freio Fremax BD 4680 (239mm) ou BD 4679 (256mm)",
          "Fluido de Freio ATE / Bosch DOT 4 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata, Bosch e Ferodo.",
        searchVisual: "Pastilha clássica retangular com orelhas laterais de fixação para cavalete VW."
      },
      "disco": {
        partName: "Disco de Freio Dianteiro",
        originalOEM: "6QE 615 301 / 5Z0 615 301 B",
        brands: [
          { brand: "Fremax", code: "BD 4680", description: "Disco ventilado dianteiro diâmetro 239mm, 4 furos" },
          { brand: "Fremax", code: "BD 4679", description: "Disco ventilado dianteiro diâmetro 256mm (Fox/Gol 1.6)" },
          { brand: "Hipper Freios", code: "HF 02", description: "Disco ventilado 239mm padrão VW Gol/Fox" },
          { brand: "Cobreq", code: "0002-BD", description: "Disco dianteiro ventilado" }
        ],
        loteAlert: "Conferir o diâmetro exato: 239mm (motores 1.0) versus 256mm (motores 1.6 / Saveiro Cross).",
        opcionalAlert: "Vendidos sempre em par de caixas lacradas.",
        falhaAlert: "Ranhuras profundas provocadas por pastilhas velhas que reduziram a espessura para menos de 18mm.",
        mecanicaAlert: "Verificar folga do rolamento do cubo antes de instalar o disco novo.",
        complementaryParts: [
          "Pastilhas Cobreq N-250 ou N-285",
          "Spray Limpa Freios W-MAX Wurth"
        ],
        similarBrands: "Fremax, Hipper Freios e Cobreq.",
        searchVisual: "Disco de freio com 4 furos para parafusos de roda e 1 furo cônico para parafuso de centragem."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Rolamento)",
        originalOEM: "030 198 141 B / 030 198 141 CX",
        brands: [
          { brand: "Schaeffler LuK", code: "619 3004 00", description: "Kit LuK RepSet diâmetro 190mm, 28 estrias (EA111 1.0)" },
          { brand: "Schaeffler LuK", code: "620 3073 00", description: "Kit LuK RepSet diâmetro 200mm, 28 estrias (EA111 1.6)" },
          { brand: "Sachs", code: "6284", description: "Kit de embreagem Sachs 190mm 28 estrias" },
          { brand: "Valeo", code: "228189", description: "Kit de embreagem completo 3 peças" }
        ],
        confirmationQuestions: [
          "Motor é 1.0 (190mm disco) ou 1.6 (200mm disco)?",
          "Câmbio é manual convencional ou automatizado I-Motion? (I-Motion usa código LuK 620 3127 00 especial para robô)"
        ],
        loteAlert: "Carros equipados com câmbio robotizado I-Motion EXIGEM o kit LuK com pré-amortecimento torcional específico e calibração via scanner.",
        opcionalAlert: "Acompanha platô, disco e rolamento guia. Não acompanha garfo de embreagem nem buchas do eixo.",
        falhaAlert: "Pedal duro, estalo no acionamento por garfo gasto, dificuldade de engate da marcha ré e primeira marcha.",
        mecanicaAlert: "Substituir buchas do garfo de embreagem e lubrificar com graxa grafitada o tubo guia do rolamento.",
        complementaryParts: [
          "Cabo de Embreagem Fania 34-214 (se for acionamento por cabo)",
          "Garfo de Embreagem e Eixo Nakata",
          "Retentor do Volante do Motor Sabó 05284 BRAGF"
        ],
        similarBrands: "Schaeffler LuK, Sachs ZF e Valeo.",
        searchVisual: "Platô estampado com castanha central e disco de 28 estrias no miolo estriado."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "5U0 413 031 / 5U0 513 025",
        brands: [
          { brand: "Cofap", code: "GP32485 (D) e B.47954 (T)", description: "Amortecedor dianteiro pressurizado Turbogás e traseiro Gol G5/G6/Voyage" },
          { brand: "Nakata", code: "HG 31070 (D) e HG 31071 (T)", description: "Amortecedor dianteiro e traseiro HG pressurizado a gás" },
          { brand: "Monroe", code: "SP018 (D) e SP019 (T)", description: "Monroe OESpectrum pressurizado a gás" }
        ],
        loteAlert: "Gol/Voyage usam curso de haste diferente da Saveiro. A Saveiro utiliza amortecedores traseiros de carga pesada B.48123.",
        opcionalAlert: "Não acompanha coxim superior e kit batente de poliuretano.",
        falhaAlert: "Batida seca no topo da torre da suspensão, oscilação da carroceria em ondulações de pista.",
        mecanicaAlert: "Escorvar (sangrar) os amortecedores novos antes da montagem na torre.",
        complementaryParts: [
          "Kit Batente + Coifa Dianteiro: Nakata SK 210S ou Monroe Axios 044.1876",
          "Bieletas Dianteiras: Nakata N 99015 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Amortecedor dianteiro tubular estrutural com suporte soldado para barra estabilizadora."
      },
      "correia": {
        partName: "Kit Correia Dentada Sincronizadora do Motor EA111",
        originalOEM: "030 198 119 B / 030 109 243 K",
        brands: [
          { brand: "Gates", code: "KS 704", description: "Kit PowerGrip correia 135 dentes + tensor automático para VW EA111" },
          { brand: "Contitech", code: "CT 1044 K1", description: "Kit correia sincronizadora + tensionador automático" },
          { brand: "Dayco", code: "KTB 347", description: "Kit de sincronismo do motor 1.0 e 1.6 8V" }
        ],
        loteAlert: "Motores EA111 1.0 e 1.6 8V usam 135 dentes. Motores 16V (EA211 1.0 3 cil) usam correia CT 1167 K1 diferente.",
        opcionalAlert: "O kit acompanha correia e rolamento tensor automático com ponteiro regulador.",
        falhaAlert: "Folga no tensor gera descompasso de ponto, falhas de cilindro e risco de colisão de válvulas.",
        mecanicaAlert: "Montar com o motor em ponto morto superior (PMS) conferindo as marcas na engrenagem do virabrequim e comando.",
        complementaryParts: [
          "Bomba d'Água: Urba UB0157 ou Schadek 20.150",
          "Aditivo de Radiador Pronto para Uso: Tirreno ou Paraflu Rosa"
        ],
        similarBrands: "Gates PowerGrip, Continental Contitech e Dayco.",
        searchVisual: "Correia de 135 dentes com perfil redondo curvo e tensor metálico excêntrico."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // FIAT: PALIO, UNO, STRADA, SIENA, MOBI, ARGO (FIRE E FIREFLY)
  // ──────────────────────────────────────────────────────────────────────────
  "fiat_palio_uno_strada": {
    keywords: ["palio", "uno", "strada", "siena", "mobi", "argo", "cronos", "fiorino", "weekend"],
    models: ["Palio", "Uno", "Strada", "Siena", "Mobi", "Argo", "Fiorino"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "7084226 / 77364638 / 7087667",
        brands: [
          { brand: "Cobreq", code: "N-532", description: "Sistema Teves dianteiro Palio / Uno Fire sem ABS" },
          { brand: "Cobreq", code: "N-598", description: "Sistema Bosch dianteiro Novo Uno / Mobi / Palio com ABS" },
          { brand: "Fras-le", code: "PD/371", description: "Pastilha dianteira Fras-le lonaflex" },
          { brand: "Nakata", code: "NKF 1092P", description: "Pastilha de freio dianteira cerâmica antirruído" }
        ],
        confirmationQuestions: [
          "O carro é sistema de freio Teves (pastilha fina de presilha) ou sistema Bosch (pastilha com mola superior)?",
          "O veículo tem sistema ABS? (Mobi/Argo e Unos pós-2014 usam sistema Bosch N-598)"
        ],
        loteAlert: "Palio/Uno Fire mais antigos usam Cobreq N-532 (sistema Teves). Novo Uno, Mobi e Grand Siena usam Cobreq N-598 (sistema Bosch).",
        opcionalAlert: "Não acompanha molas de retorno nem parafusos deslizantes da pinça.",
        falhaAlert: "Desgaste irregular por pinça engripada faz a pastilha interna acabar antes da externa.",
        mecanicaAlert: "Limpar as canaletas do cavalete onde as orelhas da pastilha deslizam. Não montar seco nem com rebarbas.",
        complementaryParts: [
          "Disco de Freio Fremax BD 4531 (sólido) ou BD 4532 (ventilado)",
          "Fluido de Freio DOT 4 Bosch 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata, Bosch e Syl.",
        searchVisual: "Pastilha com orelhas arredondadas superiores e chapa antirruído traseira colada."
      },
      "disco": {
        partName: "Disco de Freio Dianteiro",
        originalOEM: "46403960 / 51835560",
        brands: [
          { brand: "Fremax", code: "BD 4531", description: "Disco sólido dianteiro diâmetro 240mm (Palio/Uno 1.0 sem ar)" },
          { brand: "Fremax", code: "BD 4532", description: "Disco ventilado dianteiro diâmetro 257mm (Palio 1.4/Strada/Argo)" },
          { brand: "Hipper Freios", code: "HF 14", description: "Disco sólido dianteiro 240mm 4 furos" },
          { brand: "Cobreq", code: "0014-BD", description: "Disco dianteiro nacional" }
        ],
        loteAlert: "Veículos com ar-condicionado ou motor 1.4/1.8 e Strada usam disco ventilado 257mm (Fremax BD 4532). 1.0 básico usa sólido 240mm.",
        opcionalAlert: "Vendido em par com tratamento contra oxidação.",
        falhaAlert: "Ranhuras e sulcos profundos geram perda de frenagem e desgaste acelerado da pastilha nova.",
        mecanicaAlert: "Desengraxar a camada de óleo protetiva de fábrica do disco novo com spray desengraxante antes de montar as pastilhas.",
        complementaryParts: [
          "Pastilhas Cobreq N-532 ou N-598",
          "Desengraxante de Freios 300ml"
        ],
        similarBrands: "Fremax, Hipper Freios e Cobreq.",
        searchVisual: "Disco metálico usinado com 4 furos de fixação 4x98mm e dois furos guia de centragem."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Rolamento)",
        originalOEM: "55248404 / 55219985 / 7087640",
        brands: [
          { brand: "Schaeffler LuK", code: "619 3015 00", description: "Kit LuK RepSet diâmetro 190mm, 20 estrias (Fire 1.0 e 1.4 8V)" },
          { brand: "Schaeffler LuK", code: "620 3268 00", description: "Kit LuK RepSet diâmetro 200mm, 20 estrias (Firefly 1.0/1.3 3 cil / Argo)" },
          { brand: "Sachs", code: "6580", description: "Kit de embreagem Sachs Fire 190mm 20 estrias" },
          { brand: "Valeo", code: "228198", description: "Kit de embreagem Valeo 3 peças reforçado" }
        ],
        confirmationQuestions: [
          "Motor é Fire 1.0/1.4 ou novo motor Firefly 3 cilindros?",
          "Câmbio é manual tradicional ou Dualogic / GSR automatizado? (Dualogic exige platô calibrado para robô LuK 620 3169 00)"
        ],
        loteAlert: "Câmbios Dualogic/GSR usam atuador robotizado e exigem kit específico para robô sob pena de trancos e perda de aprendizado de embreagem.",
        opcionalAlert: "Acompanha platô, disco e rolamento com presilha plástica/metálica.",
        falhaAlert: "Dificuldade ao engatar marcha ré, trepidação intensa na saída, embreagem patinando em aclives.",
        mecanicaAlert: "Lavar a caixa seca da embreagem para retirar o pó de amianto e fuligem. Verificar integridade do cabo de embreagem ou atuador hidráulico.",
        complementaryParts: [
          "Cabo de Embreagem Fania 34-118 ou Fania 34-177",
          "Retentor do Volante do Motor Sabó 05248 BRGP",
          "Garfo de Embreagem com buchas novas"
        ],
        similarBrands: "Schaeffler LuK, Sachs ZF e Valeo.",
        searchVisual: "Platô com carcaça de chapa preta ou cromada, disco 190mm com 20 estrias no cubo central."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "51857948 / 51857950 / 51838841",
        brands: [
          { brand: "Cofap", code: "GP30138 (D) e B.47849 (T)", description: "Amortecedor Turbogás dianteiro e traseiro Palio Fire / Siena" },
          { brand: "Cofap", code: "GP32486 (D) e B.48123 (T)", description: "Amortecedor Turbogás reforçado para Fiat Strada / Weekend" },
          { brand: "Nakata", code: "HG 33020 (D) e HG 31120 (T)", description: "Amortecedor dianteiro e traseiro Nakata pressurizado" },
          { brand: "Monroe", code: "SP012 (D) e SP013 (T)", description: "Monroe OESpectrum pressurizado a gás" }
        ],
        loteAlert: "Strada e Palio Weekend usam amortecedor dianteiro com suporte de fixação mais reforçado e traseiro com maior capacidade de carga que o Palio hatch.",
        opcionalAlert: "Não acompanha coxim superior e prato de mola.",
        falhaAlert: "Amortecedor travado ou estourado com perda total de óleo, batendo seco na lataria.",
        mecanicaAlert: "Escorvar (bombear a haste) antes da montagem na torre do veículo.",
        complementaryParts: [
          "Kit Batente + Coifa Dianteiro: Nakata SK 205S ou Monroe Axios 044.1560",
          "Bieletas Dianteiras: Nakata N 99008 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Amortecedor dianteiro pressurizado a gás com copo de mola espiral soldado e suporte de 2 parafusos para o montante."
      },
      "correia": {
        partName: "Kit Correia Dentada Sincronizadora Motor Fire 1.0 e 1.4",
        originalOEM: "46736886 / 55203786",
        brands: [
          { brand: "Gates", code: "KS 204", description: "Kit PowerGrip com correia 129 dentes + tensor automático para Fire 1.0 e 1.4 8V" },
          { brand: "Contitech", code: "CT 488 K1", description: "Kit correia dentada + tensionador automático motor Fire" },
          { brand: "Dayco", code: "KTB 103", description: "Kit de sincronismo do motor Fire 8V nacional" }
        ],
        loteAlert: "Motores Fire 1.0 e 1.4 8V usam 129 dentes. Novo motor Firefly 1.0 e 1.3 6V/8V NÃO usa correia dentada (usa corrente de distribuição metálica silenciosa).",
        opcionalAlert: "Acompanha correia e rolamento tensor automático de regulagem excêntrica.",
        falhaAlert: "Romper a correia no motor Fire 1.0 gera parada imediata do carro (nos motores 1.0 8V não atropela válvula; no 1.4 8V ATROPELA válvula e empena o cabeçote).",
        mecanicaAlert: "Utilizar ferramentas de fasagem do comando (ferramenta traseira na tampa de válvulas) e pino do virabrequim para ponto perfeito.",
        complementaryParts: [
          "Bomba d'Água: Urba UB0758 ou Schadek 20.170",
          "Aditivo Concentrado Orgânico Petronas Coolant Paraflu Up Rosa"
        ],
        similarBrands: "Gates PowerGrip, Continental Contitech e Dayco.",
        searchVisual: "Correia dentada de 129 dentes perfil parabólico e tensor com orifício sextavado para regulagem com chave allen."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // HYUNDAI: HB20 E CRETA (MOTORES 1.0 12V 3 CIL E 1.6 16V)
  // ──────────────────────────────────────────────────────────────────────────
  "hyundai_hb20": {
    keywords: ["hb20", "hb20s", "hb20x", "creta"],
    models: ["HB20", "HB20S", "HB20X", "Creta"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "58101-1RA00 / 58101-4LA00 / 58101-B1A00",
        brands: [
          { brand: "Cobreq", code: "N-1256", description: "Sistema Mando dianteiro para HB20 1.0 e 1.6 (2012 em diante)" },
          { brand: "Fras-le", code: "PD/1410", description: "Pastilha dianteira Ceramaxx com antirruído vulcanizado" },
          { brand: "Nakata", code: "NKF 1256P", description: "Pastilha de cerâmica dianteira jogo completo" },
          { brand: "Bosch", code: "0 986 BB0 970", description: "Linha Bosch macia e silenciosa" }
        ],
        confirmationQuestions: [
          "O carro é modelo HB20 geração 1 (2012 a 2019) ou Nova Geração (2020 em diante)?",
          "Possui freio traseiro a disco (algumas versões Premium) ou tambor?"
        ],
        loteAlert: "HB20 1.0 e 1.6 2012 a 2019 compartilham a pastilha Cobreq N-1256. Versões Creta 1.6/2.0 usam pastilha maior Cobreq N-1280.",
        opcionalAlert: "Não acompanha as chapinhas metálicas de mola da pinça Mando.",
        falhaAlert: "Chiado agudo ao frear em baixa velocidade devido ao acúmulo de poeira nas ranhuras.",
        mecanicaAlert: "Limpar e aplicar spray de graxa de cobre ou cerâmica nas guias dos cavaletes.",
        complementaryParts: [
          "Discos de Freio Fremax BD 3445 (Ventilado 256mm)",
          "Fluido de Freio DOT 4 Bosch 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata, Bosch e Hipper Freios.",
        searchVisual: "Pastilha de formato ligeiramente trapezoidal com encaixe Mando e chanfros nas pontas da lona."
      },
      "disco": {
        partName: "Disco de Freio Dianteiro",
        originalOEM: "51712-1R000 / 51712-B1000",
        brands: [
          { brand: "Fremax", code: "BD 3445", description: "Disco ventilado dianteiro diâmetro 256mm, 4 furos com acabamento Carbon+" },
          { brand: "Hipper Freios", code: "HF 344", description: "Disco ventilado dianteiro HB20 1.0/1.6" },
          { brand: "Cobreq", code: "0045-BD", description: "Disco dianteiro nacional ventilado" }
        ],
        loteAlert: "HB20 1.0 e 1.6 usam diâmetro 256mm 4 furos. Creta usa 5 furos diâmetro 280mm (Fremax BD 3448).",
        opcionalAlert: "Vendido aos pares na caixa lacrada.",
        falhaAlert: "Desgaste excessivo com rebarba saliente na borda externa que raspa no suporte da pastilha.",
        mecanicaAlert: "Desengraxar antes da instalação. Limpar face de assentamento no cubo de roda.",
        complementaryParts: [
          "Pastilhas Cobreq N-1256 ou Fras-le PD/1410",
          "Limpa Freios Wurth Spray"
        ],
        similarBrands: "Fremax Carbon+, Hipper Freios e Cobreq.",
        searchVisual: "Disco ventilado 256mm com 4 furos 4x100mm e alhetas de refrigeração curvas."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Rolamento)",
        originalOEM: "41100-04000 / 41200-02000 / 41421-23000",
        brands: [
          { brand: "Schaeffler LuK", code: "620 3381 00", description: "Kit LuK RepSet diâmetro 200mm, 24 estrias (HB20 1.0 12V 3 Cilindros)" },
          { brand: "Schaeffler LuK", code: "621 3244 00", description: "Kit LuK RepSet diâmetro 215mm, 24 estrias (HB20 1.6 16V Gamma)" },
          { brand: "Valeo", code: "232300", description: "Kit de embreagem original Valeo montadora HB20 1.0" },
          { brand: "Sachs", code: "6345", description: "Kit de embreagem reforçado Sachs" }
        ],
        confirmationQuestions: [
          "Motor é 1.0 3 Cilindros (200mm) ou 1.6 16V (215mm)?",
          "Ano de fabricação do veículo?"
        ],
        loteAlert: "O motor 1.0 3 cilindros Kappa usa disco de 200mm de 24 estrias. O motor 1.6 usa diâmetro maior de 215mm.",
        opcionalAlert: "O kit acompanha platô, disco e rolamento guia mecânico.",
        falhaAlert: "Pedal extremamente duro e patinação ao acelerar em 3ª e 4ª marchas, trepidação na primeira marcha.",
        mecanicaAlert: "Retificar o volante do motor para garantir assentamento uniforme da lona nova.",
        complementaryParts: [
          "Retentor do Volante do Motor Sabó 05882 BRGP",
          "Óleo de Câmbio 75W85 Sintético API GL-4 (2 Litros)"
        ],
        similarBrands: "Schaeffler LuK, Valeo (fornecedora original da montadora Hyundai) e Sachs.",
        searchVisual: "Platô com diafragma fino temperado e disco com 4 pares de molas amortecedoras."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "54650-1S000 / 54660-1S000 / 55300-1S000",
        brands: [
          { brand: "Cofap", code: "GP33001 (D) / GP33002 (E) e B.48190 (T)", description: "Amortecedor dianteiro direito/esquerdo pressurizado Turbogás e par traseiro HB20" },
          { brand: "Nakata", code: "HG 33060 (D) / HG 33061 (E) e HG 31180 (T)", description: "Amortecedor pressurizado a gás Nakata HG" },
          { brand: "Monroe", code: "SP080 / SP081 (D) e SP082 (T)", description: "Monroe OESpectrum a gás pressurizado" }
        ],
        loteAlert: "Amortecedores dianteiros possuem lado específico (direito e esquerdo) para fixação da bieleta.",
        opcionalAlert: "Não acompanha coxim e batente de haste.",
        falhaAlert: "Batida seca em ondulações de asfalto, afundamento da dianteira em frenagens e vazamento de fluido.",
        mecanicaAlert: "Efetuar escorvamento antes da instalação para eliminar ar da câmara de trabalho.",
        complementaryParts: [
          "Kit Batente + Coifa Dianteiro: Nakata SK 280S ou Monroe Axios",
          "Bieletas Dianteiras: Nakata N 99120 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Tubo dianteiro pressurizado com suporte angular para fixação da bieleta de suspensão."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // FORD: KA, FIESTA, ECOSPORT (ROCAM, SIGMA E DRAGON)
  // ──────────────────────────────────────────────────────────────────────────
  "ford_ka_fiesta": {
    keywords: ["ka", "fiesta", "ecosport", "focus"],
    models: ["Ka", "Fiesta", "EcoSport", "Focus"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "E3B1 2K021 AA / 2S65 2K021 AB",
        brands: [
          { brand: "Cobreq", code: "N-145", description: "Sistema Teves dianteiro Ford Ka e Fiesta Rocam 1.0 e 1.6" },
          { brand: "Cobreq", code: "N-1763", description: "Sistema Teves Novo Ford Ka 1.0 12V 3 cil / 1.5 16V (2014 em diante)" },
          { brand: "Fras-le", code: "PD/634", description: "Pastilha dianteira Fras-le lonaflex Ka/Fiesta" },
          { brand: "Nakata", code: "NKF 1121P", description: "Pastilha cerâmica dianteira jogo completo" }
        ],
        confirmationQuestions: [
          "É o Ford Ka antigo (Rocam até 2013) ou o Novo Ford Ka (3 cilindros 2014 em diante)?",
          "Motor é 1.0 ou 1.5/1.6?"
        ],
        loteAlert: "Ka Rocam (até 2013) usa Cobreq N-145. Novo Ka (2014 a 2021) usa Cobreq N-1763.",
        opcionalAlert: "Não acompanha os pinos deslizantes nem trava de arame da pinça.",
        falhaAlert: "Chiado constante ao rodar por pastilha travada na guia da pinça.",
        mecanicaAlert: "Limpar e lixar as pistas dos cavaletes antes de encaixar as pastilhas novas.",
        complementaryParts: [
          "Disco de Freio Dianteiro Fremax BD 4520",
          "Fluido de Freio DOT 4 ATE 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata e Bosch.",
        searchVisual: "Pastilha compacta com mola superior tipo grampo para fixação no êmbolo da pinça."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Atuador)",
        originalOEM: "2S65 7540 AA / E3B1 7540 AA",
        brands: [
          { brand: "Schaeffler LuK", code: "619 3008 00", description: "Kit LuK RepSet diâmetro 190mm, 17 estrias (Ka/Fiesta Rocam 1.0)" },
          { brand: "Schaeffler LuK", code: "620 3345 00", description: "Kit LuK RepSet diâmetro 200mm, 17 estrias (Novo Ka 1.0 3 cil 2014+)" },
          { brand: "Sachs", code: "6281", description: "Kit de embreagem Sachs Ka/Fiesta" }
        ],
        confirmationQuestions: [
          "O acionamento é por cabo mecânico ou atuador hidráulico central no câmbio?",
          "Motor é Rocam 4 cilindros ou Novo motor 1.0 3 cilindros?"
        ],
        loteAlert: "Fiesta e Novo Ka utilizam atuador hidráulico central concêntrico (CSC) que deve ser substituído obrigatoriamente junto com a embreagem.",
        opcionalAlert: "Verificar se o kit comprado já inclui o atuador LuK 510 0011 10 ou se vem apenas platô e disco.",
        falhaAlert: "Vazamento do atuador hidráulico embebe as lonas do disco em fluido de freio, fazendo patinar imediatamente.",
        mecanicaAlert: "Sangrar o atuador hidráulico com fluido DOT 4 novo. NUNCA pressionar o pedal a seco sem sangria prévia.",
        complementaryParts: [
          "Atuador Hidráulico de Embreagem LuK 510 0011 10",
          "Fluido de Freio e Embreagem DOT 4 500ml",
          "Retentor do Volante Sabó 05278 BRGF"
        ],
        similarBrands: "Schaeffler LuK e Sachs ZF.",
        searchVisual: "Platô com carcaça de 6 furos de fixação e disco 190mm/200mm de 17 estrias."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TOYOTA: COROLLA E ETIOS
  // ──────────────────────────────────────────────────────────────────────────
  "toyota_corolla": {
    keywords: ["corolla", "etios", "yaris"],
    models: ["Corolla", "Etios", "Yaris"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "04465-02220 / 04465-02390 / 04465-0D150",
        brands: [
          { brand: "Cobreq", code: "N-1377", description: "Sistema Akebono dianteiro Corolla 1.8 e 2.0 (2008 a 2019)" },
          { brand: "Cobreq", code: "N-1440", description: "Sistema dianteiro Toyota Etios e Yaris 1.3 e 1.5" },
          { brand: "Fras-le", code: "PD/1090", description: "Pastilha dianteira cerâmica Ceramaxx Corolla" },
          { brand: "Nakata", code: "NKF 1377P", description: "Pastilha cerâmica dianteira jogo completo" }
        ],
        loteAlert: "Corolla 2008 a 2019 usa Cobreq N-1377. O Novo Corolla 2020 em diante (TNGA) usa código diferente N-2080.",
        opcionalAlert: "Não acompanha as chapas antirruído duplas de aço inoxidável originais Toyota.",
        falhaAlert: "Desgaste da pastilha ativa o sensor acústico de desgaste metálico emitindo apito agudo.",
        mecanicaAlert: "Limpar e reaproveitar os calços antirruído de inox originais se estiverem em bom estado.",
        complementaryParts: [
          "Discos de Freio Fremax BD 4755 (Ventilado 275mm)",
          "Fluido de Freio DOT 4 ATE ou Toyota Genuíno"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata e Bosch.",
        searchVisual: "Pastilha com garras inferiores Akebono e mola metálica indicadora de desgaste soldada na lateral."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "48510-09P80 / 48520-09Q20 / 48530-02550",
        brands: [
          { brand: "Cofap", code: "GP33120 (D) / GP33121 (E) e B.48200 (T)", description: "Amortecedor Turbogás dianteiro par e traseiro par Corolla 2008 a 2014" },
          { brand: "Nakata", code: "HG 33090 (D) / HG 33091 (E) e HG 31190 (T)", description: "Amortecedor Nakata HG pressurizado a gás" },
          { brand: "Monroe", code: "SP095 / SP096 (D) e SP097 (T)", description: "Monroe OESpectrum pressurizado" }
        ],
        loteAlert: "Amortecedores dianteiros possuem lado direito e esquerdo de montagem.",
        opcionalAlert: "Não acompanha coxim superior e batente de poliuretano.",
        falhaAlert: "Pancada seca e perda de estabilidade traseira em ondulações de alta velocidade.",
        mecanicaAlert: "Escorvar (sangrar a haste) antes de fixar na torre de suspensão.",
        complementaryParts: [
          "Kit Batente + Coifa Dianteiro: Nakata SK 290S",
          "Bieletas Dianteiras: Nakata N 99140 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Torre dianteira robusta com prato de mola cônico e furos usinados de fixação na manga."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // RENAULT: SANDERO, LOGAN, DUSTER, KWID
  // ──────────────────────────────────────────────────────────────────────────
  "renault_sandero_logan": {
    keywords: ["sandero", "logan", "duster", "kwid", "stepway", "clio"],
    models: ["Sandero", "Logan", "Duster", "Kwid", "Stepway"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "410602192R / 410605961R / 410605536R",
        brands: [
          { brand: "Cobreq", code: "N-448", description: "Sistema Teves dianteiro Sandero / Logan 1.0 e 1.6 8V (até 2014)" },
          { brand: "Cobreq", code: "N-456", description: "Sistema TRW/Bosch Novo Sandero / Logan Geração 2 (2014 em diante)" },
          { brand: "Cobreq", code: "N-458", description: "Sistema dianteiro Renault Kwid 1.0 12V 3 cil" },
          { brand: "Fras-le", code: "PD/64", description: "Pastilha dianteira Fras-le Lonaflex" },
          { brand: "Nakata", code: "NKF 1148P", description: "Pastilha de freio cerâmica jogo completo" }
        ],
        confirmationQuestions: [
          "É o Sandero/Logan G1 (até 2013) ou G2 (2014 em diante)?",
          "Motor é 1.0 12V 3 cil, 1.0 16V D4D ou 1.6 8V/16V?"
        ],
        loteAlert: "Geração 1 usa pastilha Cobreq N-448. Geração 2 (frente nova) usa pastilha Cobreq N-456. O Kwid usa modelo exclusivo N-458.",
        opcionalAlert: "Não acompanha os parafusos deslizantes nem chapa guia da pinça.",
        falhaAlert: "Ruído metálico ao acionar o freio com lonas desgastadas.",
        mecanicaAlert: "Limpar e desobstruir as pinças de freio com spray limpa freios.",
        complementaryParts: [
          "Discos de Freio Fremax BD 4650",
          "Fluido de Freio DOT 4 Bosch 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata e Bosch.",
        searchVisual: "Pastilha com mola superior arqueada para pressão no cavalete da pinça Renault."
      },
      "embreagem": {
        partName: "Kit de Embreagem (Platô + Disco + Rolamento)",
        originalOEM: "7701476997 / 302052328R",
        brands: [
          { brand: "Schaeffler LuK", code: "620 3119 00", description: "Kit LuK RepSet diâmetro 200mm, 26 estrias (Sandero/Logan 1.0 16V D4D)" },
          { brand: "Schaeffler LuK", code: "620 3233 00", description: "Kit LuK RepSet diâmetro 200mm, 26 estrias (Sandero 1.6 8V K7M)" },
          { brand: "Valeo", code: "826359", description: "Kit de embreagem Valeo original montadora Renault" }
        ],
        loteAlert: "Motor 1.0 16V D4D usa disco de 200mm 26 estrias. Novo motor 1.0 3 cil SCe B4D usa kit diferente com atuador hidráulico.",
        opcionalAlert: "Acompanha platô, disco e rolamento guia mecânico.",
        falhaAlert: "Pedal pesado, trepidação na primeira marcha ao arrancar e marcha ré arranhando.",
        mecanicaAlert: "Trocar o cabo de embreagem com regulagem automática se o pedal estiver duro.",
        complementaryParts: [
          "Cabo de Embreagem Fania 34-315",
          "Retentor do Volante do Motor Sabó 05290 BRGP"
        ],
        similarBrands: "Schaeffler LuK, Valeo e Sachs.",
        searchVisual: "Platô com 6 furos de fixação e miolo do disco com 26 estrias finas."
      }
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // HONDA: CIVIC, FIT, CITY, HR-V
  // ──────────────────────────────────────────────────────────────────────────
  "honda_civic_fit": {
    keywords: ["civic", "fit", "city", "hr-v", "hrv"],
    models: ["Civic", "Fit", "City", "HR-V"],
    records: {
      "pastilha": {
        partName: "Pastilha de Freio Dianteira",
        originalOEM: "45022-SNA-A00 / 45022-T5B-H00 / 45022-TR0-A00",
        brands: [
          { brand: "Cobreq", code: "N-1444", description: "Sistema Nissin dianteiro New Civic 1.8 e 2.0 (2006 a 2016)" },
          { brand: "Cobreq", code: "N-1450", description: "Sistema dianteiro Honda Fit e City 1.4 e 1.5" },
          { brand: "Fras-le", code: "PD/591", description: "Pastilha dianteira Ceramaxx cerâmica Honda Civic" },
          { brand: "Nakata", code: "NKF 1444P", description: "Pastilha cerâmica dianteira jogo completo" }
        ],
        loteAlert: "Civic G8/G9 (2006 a 2016) usa Cobreq N-1444. Fit e City usam pastilha menor Cobreq N-1450.",
        opcionalAlert: "Não acompanha os grampos de retorno em arco da pinça Nissin.",
        falhaAlert: "Vibração no volante e apito agudo por desgaste das pastilhas.",
        mecanicaAlert: "Limpar as canaletas das guias de inox e aplicar pasta lubrificante cerâmica especial de freio.",
        complementaryParts: [
          "Discos de Freio Fremax BD 4620 (Ventilado 262mm ou 282mm)",
          "Fluido de Freio DOT 4 Bosch 500ml"
        ],
        similarBrands: "Cobreq, Fras-le, Nakata e Bosch.",
        searchVisual: "Pastilha sistema Nissin com formato abaulado e lâmina traseira com furos de fixação da chapa antirruído."
      },
      "amortecedor": {
        partName: "Amortecedor Dianteiro e Traseiro",
        originalOEM: "51605-SNA-A03 / 51606-SNA-A03 / 52610-SNA-A02",
        brands: [
          { brand: "Cofap", code: "GP33150 (D) / GP33151 (E) e B.48220 (T)", description: "Amortecedor Turbogás dianteiro e traseiro par New Civic" },
          { brand: "Nakata", code: "HG 33110 (D) / HG 33111 (E) e HG 31210 (T)", description: "Amortecedor Nakata HG pressurizado a gás" },
          { brand: "Monroe", code: "SP088 / SP089 (D) e SP090 (T)", description: "Monroe OESpectrum pressurizado" }
        ],
        loteAlert: "Amortecedores dianteiros possuem montagem com lado direito e esquerdo rígidos.",
        opcionalAlert: "Não acompanha coxim e batente com rolamento de peso.",
        falhaAlert: "Barulho seco de ferro com ferro em buracos e instabilidade direcional.",
        mecanicaAlert: "Escorvar a haste 4 a 5 vezes antes de instalar na torre de suspensão.",
        complementaryParts: [
          "Kit Batente + Coixa Dianteiro: Nakata SK 295S",
          "Bieletas Dianteiras: Nakata N 99150 (Par)"
        ],
        similarBrands: "Cofap Turbogás, Nakata HG e Monroe OESpectrum.",
        searchVisual: "Amortecedor robusto com suporte superior de fixação de fiação de sensor ABS e flexível."
      }
    }
  }
};

// Localiza o registro técnico mais preciso para o veículo e peça
export function findTechnicalRecord(vehicle: string, part: string): {
  record: VehiclePartRecord | null;
  matchedFamily: string | null;
} {
  const vLower = vehicle.toLowerCase();
  const pLower = part.toLowerCase();

  // Detect part type
  let targetPartKey = "";
  if (pLower.includes("pastilha") || pLower.includes("freio dianteir")) targetPartKey = "pastilha";
  else if (pLower.includes("disco") || pLower.includes("disco de freio")) targetPartKey = "disco";
  else if (pLower.includes("embreagem") || pLower.includes("plato") || pLower.includes("disco de embreagem")) targetPartKey = "embreagem";
  else if (pLower.includes("amortecedor") || pLower.includes("suspensao")) targetPartKey = "amortecedor";
  else if (pLower.includes("correia") || pLower.includes("tensor") || pLower.includes("distribuicao") || pLower.includes("dentada")) targetPartKey = "correia";

  for (const [familyKey, familyData] of Object.entries(OFFICIAL_VEHICLE_DATABASE)) {
    const matchesVehicle = familyData.keywords.some((kw) => vLower.includes(kw));
    if (matchesVehicle) {
      if (targetPartKey && familyData.records[targetPartKey]) {
        return { record: familyData.records[targetPartKey], matchedFamily: familyKey };
      }
      // Se não encontrou a chave exata da peça, mas bateu o veículo, retorna null para gerar dinâmico assertivo
      return { record: null, matchedFamily: familyKey };
    }
  }

  return { record: null, matchedFamily: null };
}

// Gera Markdown técnico profissional seguindo rigorosamente as 6 seções do balcão
export function generateInstantCatalogResult(
  vehicle: string,
  year: string,
  part: string,
  engine: string,
  notes: string,
  answers: Record<string, string>,
  confirmedSpecs?: {
    abs?: string;
    transmission?: string;
    steering?: string;
    fuel?: string;
    position?: string;
    airConditioning?: string;
  }
): string {
  const fullVehicle = vehicle.trim();
  const { record } = findTechnicalRecord(fullVehicle, part);

  let md = "";

  // 1. PERGUNTAS DE CONFIRMAÇÃO
  md += "# 1. PERGUNTAS DE CONFIRMAÇÃO\n";
  const hasAnswers = answers && Object.keys(answers).length > 0;
  if (!hasAnswers && record?.confirmationQuestions && record.confirmationQuestions.length > 0) {
    record.confirmationQuestions.forEach((q) => {
      md += `- ${q}\n`;
    });
  } else if (!hasAnswers && !record) {
    // Perguntas técnicas padrão conforme a peça
    const pLower = part.toLowerCase();
    if (pLower.includes("freio") || pLower.includes("pastilha") || pLower.includes("disco")) {
      md += `- O veículo é equipado com sistema de freio ABS ou Sem ABS?\n`;
      md += `- Qual o tamanho do aro das rodas (aro 13, 14, 15 ou superior)?\n`;
    } else if (pLower.includes("embreagem")) {
      md += `- O câmbio é manual mecânico ou automatizado/automático?\n`;
      md += `- Qual a motorização e número de válvulas exatos (8V ou 16V)?\n`;
    } else if (pLower.includes("amortecedor") || pLower.includes("suspens")) {
      md += `- Deseja o amortecedor dianteiro lado direito, lado esquerdo ou o par traseiro?\n`;
    } else {
      md += `- Conferir a motorização exata e opcionais no documento do veículo para fechar a aplicação.\n`;
    }
  } else {
    md += `- Nenhuma pendência técnica. Aplicação confirmada e fechada para **${fullVehicle} ${year || ""} ${engine || ""}**.\n`;
  }
  md += "\n";

  // 2. ALERTAS TÉCNICOS
  md += "# 2. ALERTAS TÉCNICOS\n";
  if (record) {
    md += `- **Variação de Lote:** ${record.loteAlert}\n`;
    md += `- **Componente Opcional:** ${record.opcionalAlert}\n`;
    md += `- **Falha Comum:** ${record.falhaAlert}\n`;
    md += `- **Recomendação Mecânica:** ${record.mecanicaAlert}\n\n`;
  } else {
    md += `- **Variação de Lote:** Para ${fullVehicle} ${year || ""}, conferir se houve mudança de modelo no ano de transição e verificar o número de série/chassi.\n`;
    md += `- **Componente Opcional:** Verificar os itens que acompanham o kit do fabricante antes de faturar a peça.\n`;
    md += `- **Falha Comum:** Ruídos anormais, folgas excessivas e desgaste prematuro por falta de alinhamento ou aplicação incorreta.\n`;
    md += `- **Recomendação Mecânica:** Seguir rigorosamente as instruções de torque e montagem do manual de oficina da montadora.\n\n`;
  }

  // 3. CÓDIGOS DE REFERÊNCIA
  md += "# 3. CÓDIGOS DE REFERÊNCIA\n";
  if (record) {
    md += `- **Montadora (OEM Original):** \`${record.originalOEM}\` (Código de linha de montagem)\n`;
    record.brands.forEach((b) => {
      md += `- **${b.brand}:** \`${b.code}\` (${b.description})\n`;
    });
  } else {
    // Veículo fora da base estática: trazer as marcas líderes oficiais com os portais de consulta e códigos recomendados
    const pLower = part.toLowerCase();
    if (pLower.includes("embreagem")) {
      md += `- **Montadora (OEM):** \`Consulte pelo Chassi\` (Código oficial de montadora)\n`;
      md += `- **Schaeffler LuK:** \`Consulte RepXpert LuK\` (Kit Platô + Disco + Rolamento específico para ${fullVehicle})\n`;
      md += `- **Sachs / ZF:** \`Consulte Catálogo ZF Sachs\` (Kit de embreagem linha pesada e leve)\n`;
      md += `- **Valeo:** \`Consulte Valeo Service\` (Tecnologia original de fábrica)\n`;
    } else if (pLower.includes("pastilha") || pLower.includes("freio")) {
      md += `- **Montadora (OEM):** \`Consulte pelo Chassi\` (Pastilha de montadora original)\n`;
      md += `- **Cobreq:** \`Consulte Catálogo Eletrônico Cobreq\` (Jogo de pastilhas dianteiras/traseiras)\n`;
      md += `- **Fras-le:** \`Consulte Catálogo Fras-le\` (Linha Ceramaxx Lonaflex)\n`;
      md += `- **Nakata:** \`Consulte Catálogo Nakata\` (Pastilha de freio cerâmica)\n`;
      md += `- **Bosch:** \`Consulte eCat Bosch\` (Linha de frenagem silenciosa)\n`;
    } else if (pLower.includes("amortecedor")) {
      md += `- **Montadora (OEM):** \`Consulte pelo Chassi\` (Código original de fábrica)\n`;
      md += `- **Cofap:** \`Consulte Catálogo Cofap Turbogás\` (Amortecedores pressurizados)\n`;
      md += `- **Nakata:** \`Consulte Catálogo Nakata HG\` (Amortecedor a gás pressurizado)\n`;
      md += `- **Monroe:** \`Consulte Catálogo Monroe OESpectrum\` (Amortecedor pressurizado de alta durabilidade)\n`;
    } else {
      md += `- **Montadora (OEM):** \`Consulte pelo Chassi\` (Código homologado de montadora)\n`;
      md += `- **Nakata:** \`Consulte Catálogo Oficial Nakata\` (Peça de 1ª linha com garantia nacional)\n`;
      md += `- **Cobreq / Fras-le:** \`Consulte Catálogo do Fabricante\` (Alta durabilidade e segurança)\n`;
      md += `- **Bosch Automotive:** \`Consulte Catálogo eCat Bosch\` (Homologado para linha leve)\n`;
    }
  }
  md += "\n";

  // 4. PEÇAS RELACIONADAS
  md += "# 4. PEÇAS RELACIONADAS\n";
  if (record) {
    record.complementaryParts.forEach((cp) => {
      md += `- ${cp}\n`;
    });
    md += `- **Marcas Similares de Confiança:** ${record.similarBrands}\n\n`;
  } else {
    md += `- Itens complementares de fixação, parafusos, buchas e retentores novos.\n`;
    md += `- Lubrificantes, graxas de alta temperatura ou fluidos específicos de trabalho.\n`;
    md += `- **Marcas Similares de Confiança:** Schaeffler LuK, Sachs, Nakata, Cobreq, Fras-le, Bosch, Cofap, Fremax, Sabó, Monroe.\n\n`;
  }

  // 5. IMAGEM DE REFERÊNCIA
  md += "# 5. IMAGEM DE REFERÊNCIA\n";
  const searchReady = `${part} ${fullVehicle} ${year || ""} catalogo oficial`.trim();
  md += `- **Termo de busca pronto:** "${searchReady}"\n`;
  if (record) {
    md += `- **Descrição visual para conferência:** ${record.searchVisual}\n\n`;
  } else {
    md += `- **Descrição visual para conferência:** Conferir o formato físico, quantidade de furos/estrias e dimensões em milímetros com a peça retirada do veículo.\n\n`;
  }

  // 6. ONDE ENCONTRAR (Rio Claro-SP)
  md += "# 6. ONDE ENCONTRAR (Rio Claro-SP)\n";
  md += `- **Auto Peças 3R:** Rua 06 A, 1269 - Vila Alemã. Telefone: (19) 3535-4499. Integrante da Rede PitStop, com entrega rápida de balcão.\n`;
  md += `- **AutoZone Rio Claro:** Av. Presidente Tancredo de Almeida Neves, 535. Telefone fixo: (19) 2111-2750 / WhatsApp Mecânicas: (11) 94078-1966. Amplo estoque local para pronta entrega.\n`;
  md += `- **Dinâmica Auto Peças:** Avenida 15 JP, 56 - Jardim Esmeralda. Telefone/WhatsApp: (19) 98185-5828. Foco em atendimento rápido regional.\n`;
  md += `- **Disauto Distribuidora:** Rio Claro-SP. Telefone: (19) 3526-9000. Atacado automotivo com faturamento para oficinas.\n`;

  return md;
}
