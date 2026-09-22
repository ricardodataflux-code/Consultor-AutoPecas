export interface SearchQuery {
  part: string;
  model: string;
  year?: string;
  engine?: string;
  transmission?: 'manual' | 'automatico' | 'automatizado' | '';
  abs?: 'com_abs' | 'sem_abs' | '';
  airConditioning?: 'com_ar' | 'sem_ar' | '';
  steering?: 'hidraulica' | 'eletrica' | 'mecanica' | '';
  notes?: string;
  plateOrChassis?: string;
}

export interface AftermarketBrand {
  brand: string;
  badge: '1ª Linha' | 'Original Montadora' | 'Melhor Custo-Benefício' | 'Mais Vendida' | 'Homologada';
  code: string;
  warranty: string;
  description: string;
  directCatalogUrl?: string;
  isTopChoice?: boolean;
}

export interface OEMCode {
  code: string;
  note?: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface CrossSellingItem {
  part: string;
  reason: string;
  urgency: 'obrigatorio' | 'recomendado' | 'preventivo';
}

export interface RioClaroSupplier {
  id: string;
  name: string;
  category: 'Suspensão e Freios' | 'Motor e Transmissão' | 'Injeção Eletrônica e Elétrica' | 'Geral e Balcão Multimarcas';
  address: string;
  neighborhood: string;
  phone: string;
  whatsapp?: string;
  specialty: string;
  isPitStopOrPartner?: boolean;
  deliverySpeed?: string;
}

export interface OfficialSource {
  title: string;
  url: string;
}

export interface PartSearchResult {
  id: string;
  timestamp: number;
  query: SearchQuery;
  vehicleSummary: string;
  partCategory: string;
  quantityNeeded: string;
  oemCodes: OEMCode[];
  aftermarketBrands: AftermarketBrand[];
  criticalAlerts: string[];
  technicalSpecs: TechnicalSpec[];
  crossSelling: CrossSellingItem[];
  phoneSalesPitch: string;
  whatsappMessage: string;
  rioClaroSuppliers: RioClaroSupplier[];
  officialSources: OfficialSource[];
  provider: string;
  isOfflineFallback: boolean;
  rawAnalysis?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  query: SearchQuery;
  vehicleSummary: string;
  partCategory: string;
  topCode: string;
  topBrand: string;
  result: PartSearchResult;
}

export interface FollowUpMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
