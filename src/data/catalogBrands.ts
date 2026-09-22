import { VehiclePreset } from '../types';

export interface CatalogBrand {
  name: string;
  category: string;
  description: string;
  warranty: string;
  salesPitch: string;
  oemStatus: 'Equipamento Original (OEM)' | '1ª Linha Reposição Homologada' | 'Distribuidora Especialista';
  portalUrl: string;
  technicalHighlights: string[];
}

export const CATALOG_BRANDS: CatalogBrand[] = [
  {
    name: 'LUK',
    category: 'Embreagem e Transmissão',
    description: 'Kits de embreagem RepSet, atuadores hidráulicos e volantes bimassa (Grupo Schaeffler).',
    warranty: '1 ano ou 20.000 km (garantia nacional Schaeffler)',
    salesPitch: 'Equipamento original (OEM) na maioria das montadoras mundiais. A tecnologia de amortecimento torcional do disco LUK evita trancos e protege a caixa de câmbio contra desgaste prematuro.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.repxpert.com.br/pt/catalog',
    technicalHighlights: ['Revestimento sem amianto de alta densidade', 'Molas com pré-amortecimento gradual', 'Volantes DMF com tolerância micrométrica'],
  },
  {
    name: 'Valeo',
    category: 'Embreagem, Térmico e Elétrica',
    description: 'Sistemas de embreagem, atuadores, motores de partida, alternadores e palhetas de limpador.',
    warranty: '1 ano ou 20.000 km',
    salesPitch: 'Padrão europeu de qualidade, montada de fábrica em Renault, Peugeot, Citroën e Fiat. Pedal macio, engate preciso e rolamento autolubrificado de longa vida útil.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.valeoservice.com.br/pt-br/catalogo',
    technicalHighlights: ['Tecnologia HEC de compensação de desgaste', 'Pedal até 15% mais leve', 'Atuadores concêntricos CSC reforçados'],
  },
  {
    name: 'Sachs',
    category: 'Embreagem e Suspensão',
    description: 'Platôs, discos de embreagem, atuadores e amortecedores (ZF Aftermarket).',
    warranty: '1 ano ou 20.000 km',
    salesPitch: 'Engenharia alemã ZF. Alta resistência térmica em tráfego urbano pesado, suportando até 300°C sem vitrificar o disco de fricção.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://aftermarket.zf.com/br/pt/portal-aftermarket/',
    technicalHighlights: ['Placas de pressão retificadas a laser', 'Tratamento térmico de mola diafragma', 'Excelente resistência à fadiga'],
  },
  {
    name: 'Nakata',
    category: 'Suspensão, Direção e Freios',
    description: 'Amortecedores HG pressurizados, pivôs, terminais, barras axiais, bandejas e cubos.',
    warranty: 'Amortecedores: 2 anos ou 50.000 km • Pivôs/Terminais: 1 ano ou 40.000 km',
    salesPitch: 'Referência absoluta no mecânico brasileiro. Pivôs forjados em peça única com coifa de borracha cloropreno resistente a óleo e ozônio, sem risco de rasgar precocemente.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.nakata.com.br/catalogo',
    technicalHighlights: ['Amortecedores HG com gás nitrogênio', 'Pivôs com pino esférico tratado termicamente', 'Graxa sintética permanente de fábrica'],
  },
  {
    name: 'Monroe',
    category: 'Suspensão e Amortecedores',
    description: 'Amortecedores pressurizados OESpectrum, GasPremium e kits de amortecedor Monroe Axios.',
    warranty: '2 anos ou 40.000 km (garantia estendida OESpectrum)',
    salesPitch: 'Tecnologia patenteada Tenneco com sistema de válvulas inteligentes que reage instantaneamente a buracos e lombadas, garantindo estabilidade imediata e frenagem mais curta.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.monroe.com.br/',
    technicalHighlights: ['Válvula de controle de impacto Twin Technology', 'Haste cromada super polida anti-risco', 'Retentor multi-labial de alta pressão'],
  },
  {
    name: 'COFAP',
    category: 'Suspensão e Amortecedores',
    description: 'Amortecedores Turbogás, molas helicoidais, bandejas e buchas (Magneti Marelli).',
    warranty: '2 anos ou 50.000 km para linha Turbogás',
    salesPitch: 'Líder indiscutível de vendas no Brasil. O amortecedor Turbogás pressurizado impede a formação de bolhas de ar no óleo (cavitação), mantendo o carro firme mesmo em pistas irregulares.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://catalogo.cofap.com.br/',
    technicalHighlights: ['Pressurização com gás Nitrogênio N2', 'Pistão revestido com teflon autolubrificante', 'Líder em aplicação na frota nacional'],
  },
  {
    name: 'KYB',
    category: 'Suspensão e Amortecedores',
    description: 'Amortecedores japoneses Excel-G e Gas-a-Just para veículos asiáticos, nacionais e importados.',
    warranty: '2 anos ou 40.000 km',
    salesPitch: '1 em cada 5 carros no mundo sai de fábrica com amortecedor KYB. Essencial para Toyota, Honda, Nissan, Hyundai e Mitsubishi, restaurando o conforto original de zero km.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.kyb.com.br/',
    technicalHighlights: ['Válvula patenteada de 3 estágios', 'Haste com cromo duro sem microfissuras', 'Fluído sintético estável de -40°C a +120°C'],
  },
  {
    name: 'Bosch',
    category: 'Injeção, Freios e Ignição',
    description: 'Bombas de combustível, velas, bobinas, bicos injetores, sondas lambda, pastilhas e filtros.',
    warranty: '1 ano sem limite de quilometragem',
    salesPitch: 'Pioneira mundial em injeção eletrônica e segurança veicular. Peças com tolerância de micrômetros que garantem menor consumo de combustível e emissões rigorosas.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.boschaftermarket.com/br/pt/produtos/catalogo/',
    technicalHighlights: ['Bombas com motor induzido de baixo ruído', 'Pastilhas com composto ecológico Copper-Free', 'Velas de ignição com solda a laser 360°'],
  },
  {
    name: 'NGK',
    category: 'Ignição e Sensores (Niterra)',
    description: 'Velas de ignição convencionais, G-Power Platina, Iridium IX, cabos de vela e bobinas.',
    warranty: '6 meses ou 10.000 km (linha normal) • 1 ano para Iridium',
    salesPitch: 'Fornecedora original de 90% das montadoras. O eletrodo com núcleo de cobre embutido dissipa calor rapidamente, evitando a pré-ignição e falhas de centelha no motor flex.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.ngkntk.com.br/catalogo/',
    technicalHighlights: ['Isolador de cerâmica de alumina pura', 'Eletrodo central ultrafino em liga nobre', 'Resistor cerâmico anti-interferência eletromagnética'],
  },
  {
    name: 'SKF',
    category: 'Rolamentos, Cubos e Distribuição',
    description: 'Rolamentos de roda de 1ª, 2ª e 3ª geração, cubos com sensor ABS e kits de correia.',
    warranty: '1 ano ou 30.000 km',
    salesPitch: 'Padrão mundial supremo em rolamentos. Aço cromo desgaseificado a vácuo com pistas superfinas e vedações de baixo atrito que não deixam entrar água nem poeira.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.skf.com/br/support/engineering-tools/automotive-catalogue',
    technicalHighlights: ['Aço de pureza extrema 100Cr6', 'Sensores magnéticos de ABS integrados', 'Lubrificação permanente com graxa de lítio de alta rotação'],
  },
  {
    name: 'DS',
    category: 'Injeção Eletrônica e Sensores',
    description: 'Sensores de nível de combustível (boias), TPS, MAP, atuadores de marcha lenta e reguladores.',
    warranty: '1 ano de garantia de fábrica',
    salesPitch: 'Fabricação 100% brasileira com laboratório de ensaios eletrônicos. Sensores de nível resistentes à corrosão severa do etanol brasileiro com placas de cerâmica vitrificada.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.ds.ind.br/',
    technicalHighlights: ['Filamento de platina nos sensores MAP', 'Contatos de liga nobre anti-oxidação em etanol', 'Calibração individual em bancada computadorizada'],
  },
  {
    name: 'COBREQ',
    category: 'Sistemas de Freio (TMD Friction)',
    description: 'Pastilhas de freio, sapatas com lona montada, discos e fluidos de freio.',
    warranty: '3 meses ou 10.000 km',
    salesPitch: 'Tecnologia TMD Friction, montada em veículos premium. Fórmula de baixo desprendimento de fuligem que não mancha as rodas de liga leve e placa anti-ruído metálica colada a quente.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://catalogo.cobreq.com.br/',
    technicalHighlights: ['Composto cerâmico e semi-metálico balanceado', 'Placas shim antirressonância originais', 'Coeficiente de atrito estável até 500°C'],
  },
  {
    name: 'SYL',
    category: 'Sistemas de Freio',
    description: 'Pastilhas de freio dianteiras e traseiras com chapinha anti-ruído para linha leve e utilitários.',
    warranty: '3 meses ou 10.000 km',
    salesPitch: 'O melhor custo-benefício de pastilha do balcão. Excelente poder de frenagem a frio, com chanfros laterais e ranhuras centrais para rápida evacuação de gases e água.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://syl.com.br/catalogo/',
    technicalHighlights: ['Chanfros e ranhuras originais de projeto', 'Subcamada térmica entre atrito e plaqueta', 'Homologação pelo Inmetro em todos os lotes'],
  },
  {
    name: 'TECPADS',
    category: 'Sistemas de Freio',
    description: 'Pastilhas de freio de alta densidade metálica e cerâmica para reposição ágil.',
    warranty: '3 meses ou 10.000 km',
    salesPitch: 'Composto formulado para trânsito urbano com paradas frequentes. Não risca o disco de freio e oferece pegada imediata no pedal desde os primeiros quilômetros.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://tecpads.com.br/',
    technicalHighlights: ['Rápido assentamento no disco', 'Sem ruído metálico estridente', 'Certificação Inmetro gravada no dorso'],
  },
  {
    name: 'CONTINENTAL',
    category: 'Correias e Distribuição (ContiTech)',
    description: 'Correias dentadas sincronizadoras, correias Poly-V em V e tensores mecânicos/hidráulicos.',
    warranty: '1 ano ou 50.000 km',
    salesPitch: 'Montada de fábrica em VW, GM, Ford e Fiat. Borracha sintética EPDM reforçada com cordonéis de fibra de vidro que não esticam nem ressecam com temperaturas de motor de até 150°C.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.continental-aftermarket.com/br-pt/',
    technicalHighlights: ['Dentes moldados com tecido de poliamida', 'Resistente a óleo e vapores de combustível', 'Kits completos com rolamento tensionador original'],
  },
  {
    name: 'DAYCO',
    category: 'Correias e Tensores',
    description: 'Correias dentadas, tensores automáticos, polias damper antivibratórias e kits de distribuição.',
    warranty: '1 ano ou 50.000 km',
    salesPitch: 'Pioneira mundial em correias de distribuição banhadas a óleo (BIO) e perfil de dente curvo silencioso. Evita ruídos de zunido na frente do motor.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.daycogarage.com/pt-br/catalogo/',
    technicalHighlights: ['Estrutura em fibra aramida de alta tenacidade', 'Tensionadores com mola de torção tratada', 'Isenção total de estiramento operacional'],
  },
  {
    name: 'GATES',
    category: 'Correias, Tensores e Mangueiras',
    description: 'Correias dentadas Micro-V, mangueiras vulcanizadas de radiador e kits de sincronismo PowerGrip.',
    warranty: '1 ano ou 50.000 km',
    salesPitch: 'Líder global em transmissão de força. A correia Gates PowerGrip possui perfil de dente milimetricamente dimensionado para encaixar perfeito nas polias sem folgas nem folga de sincronismo.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.gatesbrasil.com.br/catalogo/',
    technicalHighlights: ['Cordonéis helicoidais de tração superior', 'Mangueiras moldadas em borracha EPDM anti-colapso', 'Kits com bomba d\'água sincronizada'],
  },
  {
    name: 'MAHLE',
    category: 'Motor e Filtragem (Metal Leve)',
    description: 'Pistões com anéis, camisas, bronzinas de biela e mancal, válvulas e filtros Metal Leve.',
    warranty: '1 ano ou 50.000 km',
    salesPitch: 'A maior referência de componentes de motor do mundo. Pistões fundidos em liga hypereutética com dilatação térmica controlada que previne engripamento e queima de óleo.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://catalog.mahle-aftermarket.com/br/',
    technicalHighlights: ['Tratamento superficial Grafal anti-fricção', 'Anéis de pistão com revestimento cerâmico PVD', 'Bronzinas trimetálicas de ultra suporte de carga'],
  },
  {
    name: 'TECFIL',
    category: 'Filtros Automotivos',
    description: 'Filtros de óleo lubrificante blindados e ecológicos, ar do motor, combustível e ar-condicionado.',
    warranty: 'Garantia legal pelo período de troca da montadora',
    salesPitch: 'A maior fábrica de filtros da América Latina. Papel de celulose micronizado com resina sintética plissada que retém partículas de até 5 micras sem restringir o fluxo de óleo.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://tecfil.com.br/catalogo/',
    technicalHighlights: ['Válvula de alívio e retenção em borracha de silicone', 'Plissagem uniforme com trava de espaçamento', 'Filtros de cabine com camada de carvão ativado antibacteriano'],
  },
  {
    name: 'SABO',
    category: 'Retentores e Juntas de Motor',
    description: 'Retentores de virabrequim, comando de válvulas, cubos, juntas de cabeçote e guarnições.',
    warranty: '1 ano sem limite de km',
    salesPitch: 'Fornecedor original de vedação para todas as montadoras nacionais. Retentores em fluoroelastômero (Viton) e poliacrílico que vedam com perfeição mesmo com altas rotações do virabrequim.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://catalogo.sabo.com.br/',
    technicalHighlights: ['Lábio de vedação hidrodinâmico com ranhuras direcionais', 'Mola helicoidal em aço inoxidável', 'Resistente aos óleos lubrificantes 100% sintéticos modernos'],
  },
  {
    name: 'TARANTO',
    category: 'Juntas e Parafusos de Motor',
    description: 'Juntas de cabeçote MLS multicamadas de aço, juntas de cárter e parafusos elásticos torx.',
    warranty: '1 ano de garantia',
    salesPitch: 'Especialista em vedação de alta performance. Juntas MLS com vedação perimétrica em elastômero que suportam as maiores taxas de compressão dos modernos motores flex e turbo.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.taranto.com.br/',
    technicalHighlights: ['Aço inox mola de alta recuperação elástica', 'Parafusos elásticos de aperto angular garantido', 'Kits completos descarbonização e motor'],
  },
  {
    name: 'THOMSON',
    category: 'Arrefecimento e Sensores (MTE-Thomson)',
    description: 'Válvulas termostáticas, sensores de temperatura da água e ar, sondas lambda e corpo termostático.',
    warranty: '1 ano de garantia de fábrica',
    salesPitch: 'Especialista consagrado em temperatura automotiva. As válvulas termostáticas contam com cera expansiva de alta sensibilidade que abre exatamente na temperatura especificada pela montadora.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://mte-thomson.com.br/catalogo-online/',
    technicalHighlights: ['Corpo em aço inoxidável e latão naval', 'Válvula de alívio de ar integrada (jiggle pin)', 'Sondas lambda planar com aquecedor cerâmico rápido'],
  },
  {
    name: 'VALCLEI',
    category: 'Arrefecimento e Tubulações',
    description: 'Tubos de refrigeração do bloco, carcaças termostáticas em alumínio e plástico PA66, tampas.',
    warranty: '1 ano de garantia',
    salesPitch: 'Líder em soluções de tubulação e carcaças completas com sensor e válvula integrados. Polímero reforçado com fibra de vidro que não resseca nem racha com o calor do líquido de arrefecimento.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://valclei.com.br/',
    technicalHighlights: ['Plástico de engenharia PA66 GF30 resistente a glicol', 'Tubos de água zincados anti-corrosão interna', 'Vedação perfeita com anéis de nitrila de alta densidade'],
  },
  {
    name: 'FLORIO',
    category: 'Arrefecimento e Reservatórios',
    description: 'Reservatórios de expansão do radiador, tampas valvuladas pressurizadas e defletores.',
    warranty: '1 ano de garantia',
    salesPitch: 'Reservatórios em polipropileno translúcido de alta densidade com marcações nítidas de nível. Tampas calibradas na pressão exata de alívio (ex: 1.0 bar, 1.4 bar) que evitam fervura do motor.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.florio.com.br/',
    technicalHighlights: ['Solda por termofusão sem rebarbas internas', 'Tampas com dupla válvula de alívio e vácuo', 'Resistente a picos de pressão do sistema'],
  },
  {
    name: 'IGUAÇU',
    category: 'Arrefecimento e Elétrica Térmica',
    description: 'Válvulas termostáticas, interruptores térmicos (cebolões do radiador) e sensores de temperatura.',
    warranty: '1 ano de garantia',
    salesPitch: 'Precisão milimétrica no acionamento do eletroventilador. Discos bimetálicos com resposta ultrarrápida que impedem o superaquecimento do cabeçote em congestionamentos.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.iguacu.com.br/',
    technicalHighlights: ['Contatos elétricos em prata nobre', 'Calibração térmica individual em banho de óleo', 'Conectores selados anti-umidade'],
  },
  {
    name: 'VISCONDE',
    category: 'Radiadores e Climatização',
    description: 'Radiadores de água brasados, condensadores de ar-condicionado, eletroventiladores e radiadores de ar quente.',
    warranty: '1 ano de garantia',
    salesPitch: 'Tecnologia de colmeia brasada em alumínio com aletas de alta dissipação térmica. Pesa metade dos modelos antigos de cobre e oferece 30% mais eficiência de troca de calor.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.visconde.com.br/',
    technicalHighlights: ['Tubos microcanal com revestimento de zinco', 'Caixas plásticas reforçadas cravadas sob controle eletrônico', 'Testados 100% contra vazamento a 2.5 bar de pressão'],
  },
  {
    name: 'URBA',
    category: 'Bombas d\'Água Automotivas',
    description: 'Bombas d\'água mecânicas para motores ciclo Otto e Diesel (Grupo Urba-Brosol).',
    warranty: '1 ano ou 40.000 km',
    salesPitch: 'Tradicionalíssima no mercado nacional. Rotor com pás balanceadas dinamicamente e selo mecânico de carbeto de silício que não vaza nem com água quente contendo aditivo orgânico.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://urba-brosol.com.br/catalogo/',
    technicalHighlights: ['Rolamento de duplo suporte de carga axial e radial', 'Selo mecânico de vedação de altíssima durabilidade', 'Rotor metálico ou compósito conforme especificação OEM'],
  },
  {
    name: 'SCHADEK',
    category: 'Bombas de Óleo e Lubrificação',
    description: 'Bombas de óleo de alta vazão para motores, bombas de vácuo e componentes de lubrificação.',
    warranty: '1 ano sem limite de quilometragem',
    salesPitch: 'A bomba de óleo preferida dos retificadores de motores. Engrenagens com perfil trocoidal usinadas em CNC que geram pressão de óleo instantânea já na partida a frio.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://schadek.com.br/',
    technicalHighlights: ['Válvula reguladora de alívio calibrada com precisão', 'Corpo em ferro fundido nodular ou alumínio injetado', 'Vazão contínua sem pulsos destrutivos'],
  },
  {
    name: 'BROSOL',
    category: 'Bombas de Combustível e Alimentação',
    description: 'Bombas de combustível mecânicas e elétricas, carburadores e corpos de alimentação.',
    warranty: '1 ano de garantia',
    salesPitch: 'Líder histórica em alimentação automotiva. Diafragmas em borracha nitrílica reforçada com tecido sintético resistentes ao álcool e gasolinas adulteradas.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://urba-brosol.com.br/catalogo/',
    technicalHighlights: ['Diafragma multi-camadas anti-deformação', 'Filtro interno de tela fina em aço inox', 'Válvulas unidirecionais de retenção instantânea'],
  },
  {
    name: 'JAMAICA',
    category: 'Mangueiras Automotivas Moldadas',
    description: 'Mangueiras de água do radiador, ar quente, respiro de óleo do motor e tubos de admissão.',
    warranty: '1 ano de garantia',
    salesPitch: 'Mangueiras vulcanizadas em borracha sintética com trama interna de fios de poliéster de alta resistência. Não colapsam com a sucção da bomba d\'água nem incham com a pressão.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.mangueirasjamaica.com.br/',
    technicalHighlights: ['Camada têxtil reforçada de poliéster trançado', 'Curvaturas exatas originais que não dobram na montagem', 'Resistente a temperaturas de até 130°C'],
  },
  {
    name: 'NOVO KIT',
    category: 'Kits de Amortecedor e Suspensão',
    description: 'Kits de batente em poliuretano microcelular, coifas sanfonadas de proteção e coxins com rolamento.',
    warranty: '1 ano de garantia',
    salesPitch: 'Batentes fabricados em poliuretano elástico de célula fechada (não quebra nem esfarela). A coifa evita que areia e pedriscos risquem a haste cromada do amortecedor novo.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.novokit.com.br/',
    technicalHighlights: ['Poliuretano microcelular amortecedor de fim de curso', 'Coifas com fole de longa extensão anti-rasgo', 'Coxins com rolamentos axiais de giro suave'],
  },
  {
    name: 'NK',
    category: 'Juntas Homocinéticas e Transmissão',
    description: 'Juntas homocinéticas fixas e deslizantes, semieixos completos e trizetas de tração.',
    warranty: '1 ano ou 30.000 km',
    salesPitch: 'Aço liga cementado com esferas temperadas sob rigoroso controle de folga angular. Transmite o torque do câmbio para as rodas sem estalos mesmo com esterçamento total do volante.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.nkbrasil.com.br/',
    technicalHighlights: ['Pistas esféricas temperadas por indução', 'Coifas termoplásticas anti-graxa e solventes', 'Acompanha porca de travamento e graxa bissulfeto de molibdênio'],
  },
  {
    name: 'DPL',
    category: 'Sensores e Injeção Eletrônica',
    description: 'Sensores de velocidade (VSS), sensores de rotação hall e indutivos, sensores ABS e atuadores.',
    warranty: '1 ano de garantia',
    salesPitch: 'Eletrônica embarcada com circuitos integrados resinados anti-vibração e calor de cofre do motor. Leitura estável sem oscilações no painel de instrumentos.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.dpl.com.br/',
    technicalHighlights: ['Blindagem eletromagnética classe automotiva', 'Chicotes com proteção espaguete corrugada antichama', 'Resistência a picos de voltagem do alternador'],
  },
  {
    name: 'MAGNETI MARELLI',
    category: 'Injeção, Ignição e Elétrica',
    description: 'Módulos de injeção, corpos de borboleta TBI, bobinas de ignição e bombas de combustível.',
    warranty: '1 ano sem limite de km',
    salesPitch: 'Criadora do sistema Flexfuel no Brasil. Sensores e atuadores com calibração digital de montadora, garantindo partida rápida mesmo no inverno e aceleração linear.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.magnetimarelli.com.br/',
    technicalHighlights: ['Corpos de borboleta com engrenagens de polímero aeroespacial', 'Bobinas de alta energia de ignição sem perda de faísca', 'Módulos ECU testados em câmaras climáticas'],
  },
  {
    name: 'WAHLER',
    category: 'Termostatos de Alta Precisão (BorgWarner)',
    description: 'Válvulas termostáticas de controle eletrônico e mecânico de temperatura para linha premium.',
    warranty: '1 ano de garantia BorgWarner',
    salesPitch: 'Equipamento original nas montadoras alemãs Mercedes-Benz, BMW, Audi e Volkswagen. Ajuste micrométrico de vazão térmica que reduz em até 3% o consumo de combustível.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.borgwarner.com/en/aftermarket/thermostats',
    technicalHighlights: ['Cápsula de dilatação térmica com parafina de grau laboratorial', 'Termostatos pilotados eletronicamente por mapa de injeção', 'Mola de aço sueco de memória permanente'],
  },
  {
    name: 'MOBENSANI',
    category: 'Borrachas, Coxins e Buchas',
    description: 'Coxins de motor e câmbio hidráulicos e de borracha, buchas de bandeja, batentes e bieletas.',
    warranty: '1 ano de garantia de fábrica',
    salesPitch: 'O melhor padrão em metal-borracha do Brasil. Coxins com fluido hidráulico anti-ressonância que eliminam a vibração no volante e no painel em marcha lenta.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.mobensani.com.br/',
    technicalHighlights: ['Borracha natural vulcanizada sob pressão controlada', 'Adesão metal-borracha resistente ao rasgo', 'Bieletas com articulação esférica de alta carga'],
  },
  {
    name: 'JAHU',
    category: 'Borrachas, Fixação e Perfis',
    description: 'Guarnições de porta e parabrisa, presilhas plásticas de parabarro, mangotes e coxins.',
    warranty: '6 meses de garantia',
    salesPitch: 'Catálogo gigante com mais de 30.000 itens de fixação e acabamento. Encaixes perfeitos nos furos originais da lataria sem folgas ou estalos de acabamento.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.jahu.com.br/',
    technicalHighlights: ['Polímeros de alta flexibilidade anti-envelhecimento', 'Presilhas com trava de retenção elástica', 'Perfis de vedação contra poeira e água'],
  },
  {
    name: 'IMA',
    category: 'Cubos de Roda, Pontas de Eixo e Semieixos',
    description: 'Cubos de roda forjados dianteiros e traseiros, pontas de eixo e juntas homocinéticas.',
    warranty: '1 ano de garantia de fábrica',
    salesPitch: 'Forjados em aço estrutural de alta densidade sem porosidades internas. Encaixe preciso do rolamento e das estrias do semieixo sem folga axial.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.ima.ind.br/',
    technicalHighlights: ['Aço forjado com tratamento de alívio de tensões', 'Furação balanceada para evitar trepidações no volante', 'Modelos com rolamento e sensor ABS já montados'],
  },
  {
    name: 'TSA',
    category: 'Sensores de Nível e Boias de Combustível',
    description: 'Sensores de nível tubular e de alavanca para tanques de combustível de carros e caminhões.',
    warranty: '1 ano de garantia',
    salesPitch: 'Especialista consagrado em medição de combustível. Resistência cerâmica blindada que não queima nem perde a escala de leitura com a umidade do etanol.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.tsadobrasil.com.br/',
    technicalHighlights: ['Flutuador de polímero microcelular imune a perfuração', 'Contatos dourados anti-oxidação galvânica', 'Calibrados na curva exata ohmica do painel'],
  },
  {
    name: 'FANIA',
    category: 'Cabos de Comando Automotivos',
    description: 'Cabos de acelerador, embreagem, freio de estacionamento, velocímetro e capô.',
    warranty: '1 ano de garantia',
    salesPitch: 'Fornecedora original das montadoras brasileiras. Cordoalha de aço galvanizado lubrificada internamente com graxa especial e duto revestido em teflon de baixo atrito.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://www.fania.com.br/',
    technicalHighlights: ['Conduíte flexível com alma interna de polímero antifricção', 'Terminais de chumbo injetados sob alta pressão', 'Zero risco de quebra prematura sob tensão'],
  },
  {
    name: 'FAMA',
    category: 'Cabos de Comando e Molas',
    description: 'Cabos de comando automotivo para linha pesada, utilitários e veículos leves.',
    warranty: '1 ano de garantia',
    salesPitch: 'Resistência extrema a esforços cíclicos de tração contínua. Proteção externa contra calor do escapamento e ataque químico de graxa e solventes.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.famamolas.com.br/',
    technicalHighlights: ['Aço de alta resistência à ruptura', 'Encaixes e presilhas idênticos aos de fábrica', 'Testados em bancadas de ciclo de 100.000 acionamentos'],
  },
  {
    name: 'DISAUTO',
    category: 'Distribuição e Atacado Especializado',
    description: 'Distribuidora automotiva regional com portfólio completo de peças multimarcas de 1ª linha.',
    warranty: 'Garantia oficial total de cada fabricante homologado',
    salesPitch: 'Logística ágil e faturamento imediato para oficinas mecânicas e autopeças da região de Rio Claro-SP, garantindo peças genuínas e com procedência rastreada.',
    oemStatus: 'Distribuidora Especialista',
    portalUrl: 'https://www.disauto.com.br/',
    technicalHighlights: ['Estoque próprio regional em Rio Claro e cidades vizinhas', 'Catálogo integrado TecDoc multi-fabricantes', 'Equipe técnica de suporte ao balconista'],
  },
  {
    name: 'ZF AFTERMARKET',
    category: 'Transmissão, Direção e Chassis',
    description: 'Sistemas completos de direção hidráulica/elétrica, caixas de câmbio, embreagens Sachs e suspensão Lemförder.',
    warranty: '1 ano ou 20.000 km',
    salesPitch: 'A maior corporação de tecnologia de transmissão e chassis do mundo. Peças de nível aeroespacial montadas nas montadoras mais exigentes da Europa e Américas.',
    oemStatus: 'Equipamento Original (OEM)',
    portalUrl: 'https://aftermarket.zf.com/br/pt/portal-aftermarket/',
    technicalHighlights: ['Caixas de direção com pinhão e cremalheira microfresados', 'Fluidos e componentes de reposição homologados pelas montadoras', 'Máxima durabilidade e segurança veicular'],
  },
  {
    name: 'VETOR',
    category: 'Lâmpadas, Palhetas, Buzinas e Rolamentos',
    description: 'Componentes elétricos, lâmpadas halógenas e LED, palhetas de silicone e tensores mecânicos.',
    warranty: '6 meses a 1 ano conforme a linha',
    salesPitch: 'Excelente custo-benefício para giro rápido de balcão. Palhetas de silicone com deslizamento silencioso e lâmpadas automotivas com selo do Inmetro de alta luminosidade.',
    oemStatus: '1ª Linha Reposição Homologada',
    portalUrl: 'https://www.vetorauto.com.br/',
    technicalHighlights: ['Palhetas aerodinâmicas com curvatura uniforme', 'Lâmpadas com vidro de quartzo resistente a choques térmicos', 'Gama ampla de aplicações nacionais e importados'],
  },
];

// Helper to find brand technical info
export function getBrandTechnicalInfo(brandName: string): CatalogBrand | undefined {
  const clean = (brandName || '').toLowerCase().trim();
  return CATALOG_BRANDS.find(b => {
    const nameLower = b.name.toLowerCase();
    return clean.includes(nameLower) || nameLower.includes(clean);
  });
}

// Technical blueprints / schematics database with cotas, measures, tolerances
export interface TechnicalSchematic {
  partCategory: string;
  title: string;
  diagramType: 'pastilha' | 'amortecedor' | 'embreagem' | 'correia' | 'bomba_dagua' | 'disco' | 'pivo' | 'rolamento' | 'sensor' | 'valvula';
  dimensions: { label: string; value: string; tolerance?: string; unit?: string }[];
  keyInspectionPoints: string[];
  benchChecklist: string[];
}

export function getPartSchematic(partName: string, vehicle?: string): TechnicalSchematic {
  const p = (partName || '').toLowerCase();
  const v = (vehicle || '').toLowerCase();

  if (p.includes('pastilha') || p.includes('freio dianteir') || p.includes('freio traseir')) {
    const isHb20 = v.includes('hb20');
    const isOnix = v.includes('onix') || v.includes('prisma');
    const isGol = v.includes('gol') || v.includes('fox') || v.includes('voyage');

    return {
      partCategory: 'Pastilha de Freio',
      title: `Esquema Técnico de Pastilhas de Freio - ${vehicle || 'Linha Leve'}`,
      diagramType: 'pastilha',
      dimensions: [
        { label: 'Comprimento Total (A)', value: isHb20 ? '132.8' : isOnix ? '137.0' : isGol ? '146.0' : '136.5', unit: 'mm', tolerance: '± 0.2 mm' },
        { label: 'Altura da Pastilha (B)', value: isHb20 ? '58.2' : isOnix ? '51.5' : isGol ? '54.7' : '52.0', unit: 'mm', tolerance: '± 0.2 mm' },
        { label: 'Espessura Nominal (C)', value: isHb20 ? '17.5' : isOnix ? '16.8' : isGol ? '19.5' : '17.0', unit: 'mm', tolerance: '± 0.15 mm' },
        { label: 'Espessura Mínima Descarte', value: '3.0', unit: 'mm', tolerance: 'Limite seguro' },
        { label: 'Sistema de Freio', value: isHb20 ? 'Mando' : isOnix ? 'Teves / TRW' : isGol ? 'Teves / VW' : 'TRW / Varga' },
      ],
      keyInspectionPoints: [
        'Conferir se o jogo acompanha as molas de fixação e placa metálica anti-ruído (Shim) colada no dorso.',
        'Verificar se o pistão da pinça é liso ou com garras de encaixe na pastilha interna.',
        'Conferir chanfro lateral de 45° que evita chiado nos primeiros 500 km.',
      ],
      benchChecklist: [
        'Comparar as 4 pastilhas com as retiradas do veículo sobre a bancada antes de entregar.',
        'Verificar se há sensor de desgaste acústico (chapa metálica) na pastilha interna.',
        'Limpar a pinça com escova de aço e aplicar graxa sintética especial para freios nos pontos de apoio.',
      ],
    };
  }

  if (p.includes('amortecedor')) {
    const isDianteiro = p.includes('dianteir') || !p.includes('traseir');
    return {
      partCategory: 'Amortecedor Automotivo',
      title: `Cotas Técnicas do Amortecedor ${isDianteiro ? 'Dianteiro' : 'Traseiro'} - ${vehicle || 'Linha Leve'}`,
      diagramType: 'amortecedor',
      dimensions: [
        { label: 'Comprimento Aberto (Extendido)', value: isDianteiro ? '512.0' : '580.0', unit: 'mm', tolerance: '± 2.0 mm' },
        { label: 'Comprimento Fechado (Comprimido)', value: isDianteiro ? '348.0' : '362.0', unit: 'mm', tolerance: '± 2.0 mm' },
        { label: 'Curso Útil da Haste', value: isDianteiro ? '164.0' : '218.0', unit: 'mm', tolerance: '± 1.5 mm' },
        { label: 'Diâmetro da Haste Cromada', value: isDianteiro ? '20.0' : '12.5', unit: 'mm', tolerance: '± 0.05 mm' },
        { label: 'Rosca da Haste Superior', value: isDianteiro ? 'M12 x 1.25' : 'M10 x 1.0', unit: 'passo fino' },
        { label: 'Fixação Inferior', value: isDianteiro ? 'Flange com 2 Furos Ø 12.2mm' : 'Olhal com Bucha de Borracha', unit: '' },
      ],
      keyInspectionPoints: [
        'Efetuar a sangria (equalização) do amortecedor antes da montagem: acionar 4x a haste verticalmente.',
        'Verificar se o prato de mola inferior possui suporte para o flexível de freio e fiação do sensor de ABS.',
        'Nunca segurar a haste com alicate de pressão (grifo), pois arranhões destroem o retentor.',
      ],
      benchChecklist: [
        'Conferir lado de montagem (Direito x Esquerdo quando há suporte assimétrico de bieleta).',
        'Inspecionar o alinhamento dos dois furos da manga de eixo na base do tubo.',
        'Sugerir troca do par dianteiro e dos kits de batente + coifa + rolamento do coxim.',
      ],
    };
  }

  if (p.includes('embreagem') || p.includes('plato') || p.includes('disco')) {
    const isFire = v.includes('palio') || v.includes('uno') || v.includes('fire');
    return {
      partCategory: 'Kit de Embreagem',
      title: `Esquema Técnico de Embreagem (Platô + Disco) - ${vehicle || 'Linha Leve'}`,
      diagramType: 'embreagem',
      dimensions: [
        { label: 'Diâmetro Externo do Disco (A)', value: isFire ? '190.0' : '200.0', unit: 'mm', tolerance: '± 0.5 mm' },
        { label: 'Diâmetro Interno do Revestimento', value: isFire ? '134.0' : '140.0', unit: 'mm', tolerance: '± 0.5 mm' },
        { label: 'Quantidade de Estrias do Cubo', value: isFire ? '20 estrias' : '14 a 28 estrias', unit: '', tolerance: 'Contagem exata' },
        { label: 'Diâmetro do Eixo Piloto', value: isFire ? '15.0 x 17.2' : '18.2 x 20.8', unit: 'mm', tolerance: 'Perfil estriado' },
        { label: 'Espessura do Disco Novo', value: '7.8', unit: 'mm', tolerance: '± 0.2 mm' },
        { label: 'Tipo de Acionamento', value: isFire ? 'Alavanca / Garfo' : 'Atuador Hidráulico Central (CSC)' },
      ],
      keyInspectionPoints: [
        'Contar rigorosamente o número de estrias antes de montar (ex: Palio Fire usa 20 estrias).',
        'Verificar lado de montagem do disco: o lado do cubo sobressalente sempre fica voltado para o câmbio.',
        'Fazer a sangria do fluido de freio DOT 4 se o veículo utilizar atuador hidráulico.',
      ],
      benchChecklist: [
        'Verificar se o volante do motor precisa de passe ou retífica para eliminar espelhamento e trincas.',
        'Não tocar com as mãos engorduradas na lona de fricção do disco.',
        'Centralizar o disco com guia de centralização antes de apertar os parafusos do platô em cruz.',
      ],
    };
  }

  if (p.includes('correia') || p.includes('dentada') || p.includes('sincronizadora')) {
    const isEa111 = v.includes('gol') || v.includes('fox') || v.includes('ea111');
    return {
      partCategory: 'Correia Dentada / Sincronismo',
      title: `Esquema Técnico de Correia Dentada - ${vehicle || 'Linha Leve'}`,
      diagramType: 'correia',
      dimensions: [
        { label: 'Número de Dentes da Correia', value: isEa111 ? '135 dentes' : '121 a 142 dentes', unit: '', tolerance: 'Contagem exata' },
        { label: 'Largura da Correia (B)', value: isEa111 ? '19.0' : '20.0', unit: 'mm', tolerance: '± 0.2 mm' },
        { label: 'Passo dos Dentes (Pitch)', value: '9.525 (3/8")', unit: 'mm', tolerance: 'Perfil curvo RPP/HTD' },
        { label: 'Material da Composição', value: 'Borracha EPDM com Cordonéis de Fibra de Vidro', unit: '' },
        { label: 'Torque do Tensor', value: '25 a 30', unit: 'N.m', tolerance: 'Com torquímetro' },
      ],
      keyInspectionPoints: [
        'Conferir a posição das setas de sentido de rotação impressas no dorso da correia.',
        'Verificar a bomba d\'água: se girar com folga ou aspereza, trocar obrigatoriamente junto.',
        'Girar o motor 2 voltas manuais após o tensionamento para conferir as marcas de ponto PMS.',
      ],
      benchChecklist: [
        'Contar os dentes da correia velha sobreposta à correia nova na bancada.',
        'Inspecionar se os dentes das polias do virabrequim e comando estão com desgaste afiado.',
        'Instalar tensor novo do kit (nunca reaproveitar tensor antigo).',
      ],
    };
  }

  // Generic schematic for other parts
  return {
    partCategory: 'Componente Automotivo de Precisão',
    title: `Esquema Técnico e Cotas Dimensionais - ${partName}`,
    diagramType: 'sensor',
    dimensions: [
      { label: 'Encaixe e Furação', value: 'Padrão Dimensional Original OEM', unit: 'mm' },
      { label: 'Tolerância Mecânica', value: 'Norma ISO / DIN 9001', unit: '± 0.05 mm' },
      { label: 'Material de Fabricação', value: 'Aço Liga Tratado / Polímero Técnico PA66', unit: '' },
      { label: 'Lado de Montagem', value: 'Conforme posição especificada (Dianteiro/Traseiro/L.E./L.D.)', unit: '' },
    ],
    keyInspectionPoints: [
      'Conferir conectores, pinagem e chicotes elétricos antes da fixação.',
      'Checar se o código gravado no corpo da peça coincide com a caixa.',
      'Garantir limpeza da superfície de assentamento livre de ferrugem.',
    ],
    benchChecklist: [
      'Comparar formato, furações e guias visuais com a peça defeituosa do cliente.',
      'Consultar garantia oficial de fábrica na embalagem selada.',
    ],
  };
}

export const COMMON_PRESETS: VehiclePreset[] = [
  {
    title: 'Onix 2015 - Amortecedor Dianteiro',
    vehicle: 'Chevrolet Onix',
    year: '2015',
    part: 'Amortecedor dianteiro',
    engine: '1.4 8V SPE/4 Flex',
    notes: 'Cliente no balcão pedindo o par dianteiro. Perguntar se tem ABS.',
  },
  {
    title: 'Gol G5 2010 - Kit Correia Dentada',
    vehicle: 'Volkswagen Gol G5',
    year: '2010',
    part: 'Kit Correia Dentada + Tensor',
    engine: '1.0 8V EA111 Total Flex',
    notes: 'Cliente quer trocar correia preventiva. Verificar bomba d\'água junto.',
  },
  {
    title: 'HB20 2016 - Pastilha de Freio',
    vehicle: 'Hyundai HB20',
    year: '2016',
    part: 'Pastilha de freio dianteira',
    engine: '1.0 12V 3 Cilindros Flex',
    notes: 'Verificar se sistema é Teves ou Mando e se tem ABS.',
  },
  {
    title: 'Palio Fire 2008 - Kit Embreagem',
    vehicle: 'Fiat Palio Fire',
    year: '2008',
    part: 'Kit de Embreagem (Platô, Disco e Rolamento)',
    engine: '1.0 8V Fire Flex',
    notes: 'Verificar quantidade de estrias e diâmetro do disco.',
  },
  {
    title: 'Corolla 2016 - Coxim do Motor',
    vehicle: 'Toyota Corolla',
    year: '2016',
    part: 'Coxim do motor lado direito (hidráulico)',
    engine: '2.0 16V Dual VVT-i Flex',
    notes: 'Cliente reclama de vibração forte na marcha lenta.',
  },
  {
    title: 'Sandero 2014 - Bomba D\'água',
    vehicle: 'Renault Sandero',
    year: '2014',
    part: 'Bomba d\'água',
    engine: '1.6 8V Hi-Torque (K7M)',
    notes: 'Verificar modelo com ou sem polia de 19 dentes.',
  },
];

export const SUPPLIERS_RIO_CLARO = [
  {
    name: 'Auto Peças 3R',
    phone: '(19) 3535-4499',
    rawPhone: '551935354499',
    whatsapp: '551935354499',
    address: 'Rua 06 A, 1269 - Vila Alemã, Rio Claro - SP',
    features: 'Integrante da Rede PitStop • Estoque imediato balcão e entrega rápida a oficinas',
    tag: 'Rede PitStop',
  },
  {
    name: 'AutoZone Rio Claro',
    phone: '(19) 2111-2750',
    rawPhone: '551921112750',
    whatsapp: '5511940781966',
    address: 'Av. Presidente Tancredo de Almeida Neves, 535 - Jardim Inocoop, Rio Claro - SP',
    features: 'WhatsApp exclusivo mecânicas: (11) 94078-1966 • Loja ampla aberta com grande estoque local',
    tag: 'Pronta Entrega',
  },
  {
    name: 'Dinâmica Auto Peças',
    phone: '(19) 98185-5828',
    rawPhone: '5519981855828',
    whatsapp: '5519981855828',
    address: 'Avenida 15 JP, 56 - Jardim Esmeralda, Rio Claro - SP',
    features: 'Atendimento via WhatsApp e balcão linha leve com motoboy local expresso',
    tag: 'Atendimento Rápido',
  },
  {
    name: 'Disauto Distribuidora',
    phone: '(19) 3526-9000',
    rawPhone: '551935269000',
    whatsapp: '551935269000',
    address: 'Distrito Industrial / Acesso Rodovias, Rio Claro - SP',
    features: 'Distribuidora atacadista com faturamento PJ para oficinas mecânicas e autopeças',
    tag: 'Atacado e Distribuição',
  },
  {
    name: 'Rotas de Distribuição Expressa (Entrega Diária em Rio Claro)',
    phone: 'Atendimento Regional',
    rawPhone: '',
    whatsapp: '',
    address: 'Entregas diárias (manhã e tarde) para Rio Claro - SP',
    features: 'Pellegrino, Pacaembu Autopeças, Roles, Sama e DPK / DPaschoal Distribuição',
    tag: 'Distribuição Diária',
  },
];

export interface OfficialCatalogEntry {
  brandKeywords: string[];
  name: string;
  portalUrl: string;
  badge: string;
  description: string;
}

export const OFFICIAL_MANUFACTURER_CATALOGS: OfficialCatalogEntry[] = [
  {
    brandKeywords: ['luk', 'schaeffler', 'repxpert'],
    name: 'Portal Schaeffler RepXpert (LUK)',
    portalUrl: 'https://www.repxpert.com.br/pt/catalog',
    badge: 'LUK Schaeffler',
    description: 'Catálogo oficial RepXpert de embreagens, atuadores e volantes bimassa LUK.',
  },
  {
    brandKeywords: ['nakata'],
    name: 'Catálogo Oficial Nakata Online',
    portalUrl: 'https://www.nakata.com.br/catalogo',
    badge: 'Nakata Eletrônico',
    description: 'Catálogo oficial de amortecedores HG, suspensão, direção e transmissão Nakata.',
  },
  {
    brandKeywords: ['cofap', 'magneti marelli', 'marelli'],
    name: 'Catálogo Eletrônico COFAP / Magneti Marelli',
    portalUrl: 'https://catalogo.cofap.com.br/',
    badge: 'COFAP Oficial',
    description: 'Catálogo eletrônico de amortecedores Turbogás, molas e injeção Magneti Marelli.',
  },
  {
    brandKeywords: ['monroe', 'tenneco', 'axios'],
    name: 'Catálogo Oficial Monroe Brasil',
    portalUrl: 'https://www.monroe.com.br/',
    badge: 'Monroe Amortecedores',
    description: 'Catálogo de amortecedores OESpectrum, GasPremium e borrachas Monroe Axios.',
  },
  {
    brandKeywords: ['valeo'],
    name: 'Valeo Service WebCat Brasil',
    portalUrl: 'https://www.valeoservice.com.br/pt-br/catalogo',
    badge: 'Valeo Service',
    description: 'Catálogo eletrônico oficial Valeo de embreagens, elétrica, térmico e palhetas.',
  },
  {
    brandKeywords: ['sachs', 'zf'],
    name: 'Portal ZF Aftermarket (Sachs)',
    portalUrl: 'https://aftermarket.zf.com/br/pt/portal-aftermarket/',
    badge: 'ZF / Sachs',
    description: 'Catálogo oficial de embreagens Sachs e transmissão ZF Aftermarket.',
  },
  {
    brandKeywords: ['bosch'],
    name: 'Bosch Auto Parts / eCat Online',
    portalUrl: 'https://www.boschaftermarket.com/br/pt/produtos/catalogo/',
    badge: 'Bosch eCat',
    description: 'Catálogo eletrônico Bosch de injeção, freios, filtros, velas e ignição.',
  },
  {
    brandKeywords: ['ngk', 'ntk', 'niterra'],
    name: 'Catálogo Eletrônico NGK / NTK',
    portalUrl: 'https://www.ngkntk.com.br/catalogo/',
    badge: 'NGK NTK Oficial',
    description: 'Catálogo oficial de velas de ignição, cabos, bobinas e sensores de oxigênio.',
  },
  {
    brandKeywords: ['cobreq', 'tmd'],
    name: 'Catálogo Online Cobreq (TMD Friction)',
    portalUrl: 'https://catalogo.cobreq.com.br/',
    badge: 'Cobreq Oficial',
    description: 'Catálogo de pastilhas de freio cerâmicas, sapatas e lonas Cobreq.',
  },
  {
    brandKeywords: ['syl', 'tecpads'],
    name: 'Catálogo Eletrônico SYL Freios',
    portalUrl: 'https://syl.com.br/catalogo/',
    badge: 'SYL Freios',
    description: 'Catálogo oficial de pastilhas de freio dianteiras e traseiras SYL.',
  },
  {
    brandKeywords: ['skf'],
    name: 'Catálogo Automotivo SKF Brasil',
    portalUrl: 'https://www.skf.com/br/support/engineering-tools/automotive-catalogue',
    badge: 'SKF Automotivo',
    description: 'Catálogo oficial de rolamentos de roda, cubos e kits de distribuição SKF.',
  },
  {
    brandKeywords: ['gates'],
    name: 'Catálogo Gates Brasil Online',
    portalUrl: 'https://www.gatesbrasil.com.br/catalogo/',
    badge: 'Gates Brasil',
    description: 'Catálogo oficial de correias dentadas, tensores e mangueiras Gates.',
  },
  {
    brandKeywords: ['continental', 'contitech'],
    name: 'Catálogo Continental ContiTech Brasil',
    portalUrl: 'https://www.continental-aftermarket.com/br-pt/',
    badge: 'ContiTech Oficial',
    description: 'Catálogo de correias sincronizadoras e kits de distribuição Continental.',
  },
  {
    brandKeywords: ['dayco'],
    name: 'Dayco Garage Catálogo Eletrônico',
    portalUrl: 'https://www.daycogarage.com/pt-br/catalogo/',
    badge: 'Dayco Garage',
    description: 'Catálogo oficial de correias, tensores e polias antivibratórias Dayco.',
  },
  {
    brandKeywords: ['mahle', 'metal leve'],
    name: 'Catálogo Online MAHLE Aftermarket',
    portalUrl: 'https://catalog.mahle-aftermarket.com/br/',
    badge: 'MAHLE / Metal Leve',
    description: 'Catálogo oficial de componentes de motor, pistões, anéis e filtros MAHLE.',
  },
  {
    brandKeywords: ['tecfil'],
    name: 'Catálogo Eletrônico Tecfil Filtros',
    portalUrl: 'https://tecfil.com.br/catalogo/',
    badge: 'Tecfil Oficial',
    description: 'Catálogo oficial de filtros de óleo, ar, combustível e cabine Tecfil.',
  },
  {
    brandKeywords: ['sabo', 'sabó'],
    name: 'Catálogo Eletrônico SABÓ Online',
    portalUrl: 'https://catalogo.sabo.com.br/',
    badge: 'SABÓ Oficial',
    description: 'Catálogo de retentores, juntas de cabeçote e vedação automotiva SABÓ.',
  },
  {
    brandKeywords: ['thomson', 'mte-thomson', 'mte'],
    name: 'Catálogo Eletrônico MTE-Thomson',
    portalUrl: 'https://mte-thomson.com.br/catalogo-online/',
    badge: 'MTE-Thomson',
    description: 'Catálogo de válvulas termostáticas, sensores de temperatura e sonda lambda.',
  },
  {
    brandKeywords: ['urba', 'brosol'],
    name: 'Catálogo Oficial Urba Brosol',
    portalUrl: 'https://urba-brosol.com.br/catalogo/',
    badge: 'Urba Brosol',
    description: 'Catálogo oficial de bombas d\'água de motor e bombas de combustível.',
  },
];

export function getBrandCatalogPortal(brand: string): OfficialCatalogEntry | undefined {
  const brandLower = brand.toLowerCase();
  return OFFICIAL_MANUFACTURER_CATALOGS.find((entry) =>
    entry.brandKeywords.some((kw) => brandLower.includes(kw))
  );
}

export function getBrandDirectCatalogUrl(brand: string, code?: string): { name: string; url: string } | undefined {
  const portal = getBrandCatalogPortal(brand);
  if (!portal) return undefined;
  return {
    name: portal.name,
    url: portal.portalUrl,
  };
}

export function buildCatalogVerificationUrl(brand: string, code: string, vehicle?: string): string {
  const query = `catalogo ${brand} "${code}" ${vehicle || ''}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export const RIO_CLARO_STORES = SUPPLIERS_RIO_CLARO.map(s => ({
  name: s.name,
  phone: s.phone,
  rawPhone: s.rawPhone,
  whatsapp: s.whatsapp,
  address: s.address,
  badge: s.tag,
  notes: s.features,
}));

export const OFFICIAL_CATALOG_PORTALS = OFFICIAL_MANUFACTURER_CATALOGS.map(c => ({
  brand: c.brandKeywords[0].toUpperCase(),
  name: c.name,
  url: c.portalUrl,
  badge: c.badge,
}));

