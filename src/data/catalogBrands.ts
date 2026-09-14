import { VehiclePreset } from '../types';

export interface CatalogBrand {
  name: string;
  category: string;
  description: string;
}

export const CATALOG_BRANDS: CatalogBrand[] = [
  { name: 'Ideia2001 (Catálogo Expresso)', category: 'Catálogo Eletrônico', description: 'Sistema de Catálogo Eletrônico Integrado Multi-marcas' },
  { name: 'LUK', category: 'Embreagem', description: 'Kits de embreagem, atuadores hidráulicos e volantes bimassa (Líder OEM)' },
  { name: 'Valeo', category: 'Embreagem e Elétrica', description: 'Sistemas de embreagem, motores de partida, alternadores e palhetas' },
  { name: 'Sachs', category: 'Embreagem e Suspensão', description: 'Platôs, discos de embreagem e amortecedores linha pesada/leve' },
  { name: 'Nakata', category: 'Suspensão e Direção', description: 'Amortecedores, pivôs, terminais, barras axiais e bandejas' },
  { name: 'Monroe', category: 'Suspensão', description: 'Amortecedores convencionais e pressurizados OESpectrum/GasPremium' },
  { name: 'COFAP', category: 'Suspensão', description: 'Amortecedores Turbogás, molas helicoidais e bandejas (Líder nacional)' },
  { name: 'KYB', category: 'Suspensão', description: 'Amortecedores japoneses alta precisão para linha asiática e nacional' },
  { name: 'Bosch', category: 'Injeção e Freios', description: 'Bombas de combustível, velas, bobinas, sondas lambdas e pastilhas' },
  { name: 'NGK', category: 'Ignição', description: 'Velas de ignição comuns, G-Power e Iridium, cabos de vela e bobinas' },
  { name: 'SKF', category: 'Rolamentos e Cubos', description: 'Rolamentos de roda, tensores de correia e cubos de roda automotivos' },
  { name: 'IMA', category: 'Cubos e Semieixos', description: 'Cubos de roda dianteiros e traseiros, pontas de eixo e juntas homocinéticas' },
  { name: 'DS', category: 'Injeção e Sensores', description: 'Sensores de nível de combustível, TPS, MAP, atuadores de marcha lenta' },
  { name: 'TSA', category: 'Sensores e Combustível', description: 'Sensores de nível de combustível e boias' },
  { name: 'CONTINENTAL', category: 'Correias', description: 'Correias sincronizadoras (dentadas), correias poly-v e tensores' },
  { name: 'DAYCO', category: 'Correias', description: 'Kits de correia dentada, tensores e polias antivibratórias' },
  { name: 'GATES', category: 'Correias e Mangueiras', description: 'Correias dentadas Micro-V, mangueiras de radiador e termostatos' },
  { name: 'MAHLE', category: 'Motor e Filtros', description: 'Pistões, anéis, bronzinas e filtros Metal Leve' },
  { name: 'TECFIL', category: 'Filtros', description: 'Filtros de óleo, combustível, ar do motor e cabine (ar-condicionado)' },
  { name: 'SABO', category: 'Retentores e Juntas', description: 'Retentores de volante, comando, virabrequim e juntas de motor' },
  { name: 'TARANTO', category: 'Juntas e Parafusos', description: 'Juntas de cabeçote metálicas e de fibra, parafusos de cabeçote' },
  { name: 'THOMSON', category: 'Arrefecimento e Sensores', description: 'Válvulas termostáticas, sensores de temperatura MTE-Thomson' },
  { name: 'VALCLEI', category: 'Arrefecimento', description: 'Tubos de água, carcaças termostáticas e tampas de reservatório' },
  { name: 'FLORIO', category: 'Arrefecimento', description: 'Reservatórios de expansão, tampas e tubulações' },
  { name: 'IGUAÇU', category: 'Arrefecimento', description: 'Válvulas termostáticas, sensores e interruptores térmicos' },
  { name: 'VISCONDE', category: 'Radiadores', description: 'Radiadores de água, condensadores e eletroventiladores' },
  { name: 'URBA', category: 'Bombas d\'Água', description: 'Bombas d\'água de motor (Urba e Brosol)' },
  { name: 'SCHADEK', category: 'Bombas de Óleo', description: 'Bombas de óleo de motor e bombas de combustível mecânicas' },
  { name: 'BROSOL', category: 'Alimentação', description: 'Bombas de combustível mecânicas e elétricas' },
  { name: 'COBREQ', category: 'Freios', description: 'Pastilhas de freio, lonas de freio e sapatas' },
  { name: 'SYL', category: 'Freios', description: 'Pastilhas de freio dianteiras e traseiras com anti-ruído' },
  { name: 'TECPADS', category: 'Freios', description: 'Pastilhas de freio cerâmicas e metálicas de reposição' },
  { name: 'MOBENSANI', category: 'Borrachas e Coxins', description: 'Coxins de motor e câmbio, buchas de suspensão e batentes' },
  { name: 'JAHU', category: 'Borrachas e Fixação', description: 'Guarnições, coxins, presilhas e abraçadeiras' },
  { name: 'NOVO KIT', category: 'Kits de Suspensão', description: 'Kits de amortecedor (batente, coifa e coxim com rolamento)' },
  { name: 'FANIA', category: 'Cabos', description: 'Cabos de acelerador, freio de mão, embreagem e velocímetro' },
  { name: 'FAMA', category: 'Cabos de Comando', description: 'Cabos de comando automotivos' },
  { name: 'DISAUTO', category: 'Distribuição', description: 'Distribuidora automotiva de reposição de auto peças' },
  { name: 'ZF AFTERMARKET', category: 'Transmissão e Direção', description: 'Sistemas Lemförder, Sachs e caixas de direção ZF' },
  { name: 'VETOR', category: 'Elétrica e Iluminação', description: 'Palhetas, buzinas, lâmpadas e componentes mecânicos' },
  { name: 'JAMAICA', category: 'Mangueiras', description: 'Mangueiras de água e arrefecimento moldadas' },
  { name: 'NK', category: 'Juntas Homocinéticas', description: 'Semieixos e juntas homocinéticas' },
  { name: 'DPL', category: 'Injeção e Elétrica', description: 'Sensores de velocidade, ABS e atuadores' },
  { name: 'MAGNETI MARELLI', category: 'Injeção e Ignição', description: 'Módulos de injeção, corpos de borboleta e bombas' },
  { name: 'WAHLER', category: 'Termostatos', description: 'Válvulas termostáticas de alta precisão linha premium' },
];

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
    name: 'Pellegrino Distribuidora de Autopeças',
    address: 'Atendimento e Logística Regional Rio Claro e Região',
    features: 'Líder em marcas OEM e reposição pesada e leve, catálogo TecDoc',
    tag: 'Distribuidora Master',
  },
  {
    name: 'Garcia Autopeças & Distribuidora',
    address: 'Rio Claro - SP',
    features: 'Pronta-entrega de suspensão, embreagens e motor com motoboy rápido',
    tag: 'Entrega Rápida Balcão',
  },
  {
    name: 'Bezerra Distribuidora de Autopeças',
    address: 'Unidade Regional Rio Claro / SP',
    features: 'Estoque amplo para mecânicas e autopeças de balcão, linha completa Nakata, Cofap, Bosch',
    tag: 'Atacado e Varejo',
  },
  {
    name: 'Pit Stop Autopeças Rio Claro',
    address: 'Rio Claro - SP',
    features: 'Peças elétricas, injeção eletrônica e freios pronta retirada',
    tag: 'Atendimento Balcão',
  },
  {
    name: 'DPaschoal / DPK Distribuidora',
    address: 'Canal Distribuição Regional Rio Claro - SP',
    features: 'Pneus, baterias, suspensão e freios com entrega expressa',
    tag: 'Distribuição Express',
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
    brandKeywords: ['ideia2001', 'catalogo expresso', 'ideia'],
    name: 'Ideia2001 - Catálogo Expresso',
    portalUrl: 'https://www.ideia2001.com.br/',
    badge: 'Ideia2001 Integrado',
    description: 'Catálogo de Auto Peças e Sistema de Busca Multi-fabricantes.',
  },
  {
    brandKeywords: ['nakata'],
    name: 'Catálogo Oficial Nakata Online',
    portalUrl: 'https://www.nakata.com.br/catalogo',
    badge: 'Nakata Eletrônico',
    description: 'Catálogo oficial de amortecedores, suspensão, direção e transmissão Nakata.',
  },
  {
    brandKeywords: ['cofap', 'magneti marelli'],
    name: 'Catálogo Eletrônico COFAP / Magneti Marelli',
    portalUrl: 'https://catalogo.cofap.com.br/',
    badge: 'COFAP Oficial',
    description: 'Catálogo eletrônico de amortecedores Turbogás, molas e componentes Magneti Marelli.',
  },
  {
    brandKeywords: ['monroe'],
    name: 'Catálogo Oficial Monroe Brasil',
    portalUrl: 'https://www.monroe.com.br/',
    badge: 'Monroe Amortecedores',
    description: 'Catálogo de amortecedores OESpectrum, GasPremium e kits Monroe.',
  },
  {
    brandKeywords: ['luk', 'schaeffler'],
    name: 'Portal Schaeffler RepXpert (LUK)',
    portalUrl: 'https://www.repxpert.com.br/pt/catalog',
    badge: 'LUK Schaeffler',
    description: 'Catálogo oficial RepXpert de embreagens, atuadores e volantes bimassa LUK.',
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
    brandKeywords: ['ngk', 'ntk'],
    name: 'Catálogo Eletrônico NGK / NTK',
    portalUrl: 'https://www.ngkntk.com.br/catalogo/',
    badge: 'NGK NTK Oficial',
    description: 'Catálogo oficial de velas de ignição, cabos, bobinas e sensores de oxigênio.',
  },
  {
    brandKeywords: ['cobreq'],
    name: 'Catálogo Online Cobreq (TMD Friction)',
    portalUrl: 'https://catalogo.cobreq.com.br/',
    badge: 'Cobreq Oficial',
    description: 'Catálogo de pastilhas de freio, sapatas e lonas Cobreq para reposição.',
  },
  {
    brandKeywords: ['fras-le', 'frasle', 'fremax'],
    name: 'Catálogo Online Fras-le & Fremax',
    portalUrl: 'https://autopecas.fras-le.com/catalogo',
    badge: 'Fras-le / Fremax',
    description: 'Catálogo oficial de pastilhas, lonas e discos de freio usinados Fremax.',
  },
  {
    brandKeywords: ['syl', 'tecpads'],
    name: 'Catálogo Eletrônico SYL Freios',
    portalUrl: 'https://syl.com.br/catalogo/',
    badge: 'SYL Freios',
    description: 'Catálogo oficial de pastilhas de freio dianteiras e traseiras SYL.',
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
  {
    brandKeywords: ['skf'],
    name: 'Catálogo Automotivo SKF Brasil',
    portalUrl: 'https://www.skf.com/br/support/engineering-tools/automotive-catalogue',
    badge: 'SKF Automotivo',
    description: 'Catálogo oficial de rolamentos de roda, cubos e kits de distribuição SKF.',
  },
];

export function getBrandCatalogPortal(brand: string): OfficialCatalogEntry | undefined {
  const brandLower = brand.toLowerCase();
  return OFFICIAL_MANUFACTURER_CATALOGS.find((entry) =>
    entry.brandKeywords.some((kw) => brandLower.includes(kw))
  );
}

export function buildCatalogVerificationUrl(brand: string, code: string, vehicle?: string): string {
  const portal = getBrandCatalogPortal(brand);
  // Direct Google search targeted at manufacturer catalog or site verification
  const query = `catalogo ${brand} "${code}" ${vehicle || ''}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
