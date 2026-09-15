export interface QueryParams {
  vehicle: string;
  brand?: string;
  model?: string;
  year: string;
  part: string;
  engine?: string;
  engineSize?: string;
  engineVersion?: string;
  abs?: 'com_abs' | 'sem_abs' | '';
  transmission?: 'manual' | 'automatico' | 'automatizado' | '';
  steering?: 'hidraulica' | 'eletrica' | 'mecanica' | '';
  fuel?: string;
  position?: string;
  airConditioning?: 'com_ar' | 'sem_ar' | '';
  notes?: string;
  answers?: Record<string, string>;
}

export interface ParsedCodeItem {
  brand: string;
  code: string;
  category: 'original' | 'aftermarket' | 'warning';
  notes?: string;
  catalogUrl?: string;
  catalogName?: string;
}

export interface VerifiedSource {
  title: string;
  uri: string;
}

export interface OfficialCatalogPortal {
  brand: string;
  name: string;
  url: string;
  searchUrl?: string;
  badge: string;
}

export interface QueryResult {
  id: string;
  timestamp: number;
  query: QueryParams;
  rawMarkdown: string;
  hasUnresolvedQuestions: boolean;
  confirmationQuestions: string[];
  codes: ParsedCodeItem[];
  technicalAlerts: string[];
  relatedParts: {
    similars: string[];
    complementary: string[];
  };
  visualInspection: {
    searchTerm: string;
    description: string;
  };
  suppliersRioClaro: string[];
  verifiedSources?: VerifiedSource[];
  officialCatalogs?: OfficialCatalogPortal[];
  usedFallback?: boolean;
  quotaExceeded?: boolean;
}

export interface VehiclePreset {
  title: string;
  vehicle: string;
  year: string;
  part: string;
  engine?: string;
  notes?: string;
}
