import { ParsedCodeItem, QueryResult, QueryParams, OfficialCatalogPortal } from '../types';
import { getBrandCatalogPortal, buildCatalogVerificationUrl } from '../data/catalogBrands';

export function parseSeniorClerkMarkdown(
  markdown: string,
  query: QueryParams
): QueryResult {
  const result: QueryResult = {
    id: 'query-' + Date.now(),
    timestamp: Date.now(),
    query,
    rawMarkdown: markdown,
    hasUnresolvedQuestions: false,
    confirmationQuestions: [],
    codes: [],
    technicalAlerts: [],
    relatedParts: {
      similars: [],
      complementary: [],
    },
    visualInspection: {
      searchTerm: '',
      description: '',
    },
    suppliersRioClaro: [],
    officialCatalogs: [],
  };

  const detectedCatalogBrands = new Set<string>();

  // Section splitting - Highly resilient to missing numbers or markdown headers
  const sections = markdown.split(/(?=(?:#+\s*)?(?:[1-6]\.\s*)?(?:PERGUNTAS DE CONFIRMAÇÃO|CÓDIGOS DE REFERÊNCIA|CÓDIGOS DE REFERENCIA|ALERTAS TÉCNICOS|ALERTAS TECNICOS|PEÇAS RELACIONADAS|PECAS RELACIONADAS|IMAGEM DE REFERÊNCIA|IMAGEM DE REFERENCIA|ONDE ENCONTRAR(?:.*)?))/i);

  for (const sec of sections) {
    const trimmed = sec.trim();
    if (!trimmed) continue;

    // 1. Perguntas de confirmação
    if (/PERGUNTAS DE CONFIRMAÇÃO/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•\d.]\s*/, '').trim();
        if (
          clean &&
          !clean.toLowerCase().includes('aplicação identificada') &&
          !clean.toLowerCase().includes('nenhuma pergunta pendente') &&
          !clean.toLowerCase().includes('não há perguntas') &&
          !clean.toLowerCase().includes('não é necessário')
        ) {
          result.confirmationQuestions.push(clean);
        }
      }
      if (result.confirmationQuestions.length > 0) {
        result.hasUnresolvedQuestions = true;
      }
    }

    // 2. Códigos de referência
    else if (/CÓDIGOS DE REFERÊNCIA|CÓDIGOS DE REFERENCIA/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (!clean) continue;

        if (clean.toLowerCase().includes('aguardando confirmação')) {
           // Se a IA se recusou a dar código pq quer confirmação primeiro
           continue;
        }

        const colonMatch = clean.match(/^([^:]+):\s*(.+)$/);
        if (colonMatch) {
          const brand = colonMatch[1].replace(/\*\*/g, '').trim();
          let codeVal = colonMatch[2].replace(/\*\*/g, '').trim();
          let notes: string | undefined;
          
          // Extract notes in parentheses or after a dash for descriptions
          const noteMatch = codeVal.match(/^(.*?)(?:\s*\(([^)]+)\)|\s+-\s+(.+))$/);
          if (noteMatch) {
            codeVal = noteMatch[1].trim();
            notes = (noteMatch[2] || noteMatch[3]).trim();
          }

          let category: 'original' | 'aftermarket' | 'warning' = 'aftermarket';
          if (
            brand.toLowerCase().includes('original') ||
            brand.toLowerCase().includes('montadora') ||
            brand.toLowerCase().includes('oem') ||
            (notes && (notes.toLowerCase().includes('original') || notes.toLowerCase().includes('oem')))
          ) {
            category = 'original';
          } else if (
            codeVal.toLowerCase().includes('verificar') ||
            codeVal.toLowerCase().includes('sistema')
          ) {
            category = 'warning';
          }

          const portal = getBrandCatalogPortal(brand);
          if (portal) {
            detectedCatalogBrands.add(portal.name);
          }

          const catalogUrl = portal
            ? portal.portalUrl
            : buildCatalogVerificationUrl(brand, codeVal, query.vehicle);

          result.codes.push({
            brand,
            code: codeVal,
            notes,
            category,
            catalogUrl,
            catalogName: portal?.name || `Catálogo ${brand}`,
          });
        } else {
          result.codes.push({
            brand: 'Aplicação',
            code: clean.replace(/\*\*/g, ''),
            category: 'aftermarket',
            catalogUrl: `https://www.google.com/search?q=${encodeURIComponent('catalogo auto pecas ' + clean + ' ' + query.vehicle)}`,
            catalogName: 'Catálogo de Reposição',
          });
        }
      }
    }

    // 3. Alertas técnicos
    else if (/^3\.\s+ALERTAS TÉCNICOS/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (clean) {
          result.technicalAlerts.push(clean);
        }
      }
    }

    // 4. Peças relacionadas
    else if (/^4\.\s+PEÇAS RELACIONADAS/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      let subMode: 'similars' | 'complementary' = 'similars';

      for (const line of lines) {
        const clean = line.trim();
        if (/similar/i.test(clean)) {
          subMode = 'similars';
        } else if (/complementar|trocad|junto|kit/i.test(clean)) {
          subMode = 'complementary';
        }

        const bullet = clean.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (bullet && !/^#+\s/.test(bullet)) {
          if (subMode === 'similars') {
            result.relatedParts.similars.push(bullet);
          } else {
            result.relatedParts.complementary.push(bullet);
          }
        }
      }
    }

    // 5. Imagem de referência
    else if (/IMAGEM DE REFERÊNCIA|IMAGEM DE REFERENCIA/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•]\s*/, '').trim();
        if (!clean) continue;

        if (
          clean.toLowerCase().includes('termo de busca') ||
          clean.toLowerCase().includes('termo:') ||
          clean.includes('"') ||
          !result.visualInspection.searchTerm
        ) {
          const quoted = clean.match(/"([^"]+)"/);
          if (quoted) {
            result.visualInspection.searchTerm = quoted[1];
          } else if (!result.visualInspection.searchTerm) {
            result.visualInspection.searchTerm = clean.replace(/termo de busca:?/i, '').replace(/[*_"]/g, '').trim();
          }
        }
        result.visualInspection.description += (result.visualInspection.description ? '\n' : '') + clean;
      }
      if (!result.visualInspection.searchTerm) {
        result.visualInspection.searchTerm = `${query.part} ${query.vehicle} ${query.year || ''}`.trim();
      }
    }

    // 6. Onde encontrar (Rio Claro - SP)
    else if (/ONDE ENCONTRAR/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (clean) {
          result.suppliersRioClaro.push(clean);
        }
      }
    }
  }

  // Fallback search term if empty
  if (!result.visualInspection.searchTerm) {
    result.visualInspection.searchTerm = `${query.part} ${query.vehicle} ${query.year || ''}`.trim();
  }

  // Ensure default Rio Claro suppliers list if none detected
  if (result.suppliersRioClaro.length === 0) {
    result.suppliersRioClaro = [
      'Distribuidoras e atacados locais de Rio Claro-SP (Pellegrino, Garcia Autopeças, Bezerra, Pit Stop Rio Claro)',
      'Consulte entrega expressa via motoboy para oficinas mecânicas de Rio Claro e região',
    ];
  }

  // Map official catalog portals for all referenced brands and part category
  const brandNamesSeen = new Set<string>();
  const portals: OfficialCatalogPortal[] = [];

  // First add portals from identified codes
  for (const c of result.codes) {
    const p = getBrandCatalogPortal(c.brand);
    if (p && !brandNamesSeen.has(p.name)) {
      brandNamesSeen.add(p.name);
      portals.push({
        brand: c.brand,
        name: p.name,
        url: p.portalUrl,
        badge: p.badge,
        searchUrl: buildCatalogVerificationUrl(c.brand, c.code, query.vehicle),
      });
    }
  }

  // Also proactively populate major manufacturer catalogs matching the part category
  const pLower = (query.part || '').toLowerCase();
  const pushPortalIfNew = (brandKey: string, customName?: string) => {
    const p = getBrandCatalogPortal(brandKey);
    if (p && !brandNamesSeen.has(p.name)) {
      brandNamesSeen.add(p.name);
      portals.push({
        brand: p.badge,
        name: customName || p.name,
        url: p.portalUrl,
        badge: p.badge,
        searchUrl: `https://www.google.com/search?q=${encodeURIComponent('catalogo ' + p.badge + ' ' + query.part + ' ' + query.vehicle)}`,
      });
    }
  };

  if (pLower.includes('amortecedor') || pLower.includes('suspens') || pLower.includes('pivo') || pLower.includes('terminal')) {
    pushPortalIfNew('nakata', 'Catálogo Nakata Online (Suspensão)');
    pushPortalIfNew('cofap', 'Catálogo Eletrônico COFAP');
    pushPortalIfNew('monroe', 'Catálogo Monroe Axios Online');
    pushPortalIfNew('kyb', 'Catálogo KYB Amortecedores');
  } else if (pLower.includes('pastilha') || pLower.includes('freio') || pLower.includes('disco')) {
    pushPortalIfNew('cobreq', 'Catálogo Online Cobreq Freios');
    pushPortalIfNew('fras-le', 'Catálogo Fras-le Auto');
    pushPortalIfNew('bosch', 'Catálogo Bosch Auto Parts (Freios)');
    pushPortalIfNew('syl', 'Catálogo SYL Freios');
  } else if (pLower.includes('embreagem') || pLower.includes('atuador') || pLower.includes('plato')) {
    pushPortalIfNew('luk', 'Portal Schaeffler RepXpert (LUK)');
    pushPortalIfNew('sachs', 'Catálogo Sachs ZF Aftermarket');
    pushPortalIfNew('valeo', 'Catálogo Valeo Service');
  } else if (pLower.includes('filtro') || pLower.includes('oleo') || pLower.includes('ar')) {
    pushPortalIfNew('tecfil', 'Catálogo Tecfil Filtros Online');
    pushPortalIfNew('mahle', 'Catálogo MAHLE Metal Leve');
  } else if (pLower.includes('correia') || pLower.includes('tensor') || pLower.includes('dentada')) {
    pushPortalIfNew('gates', 'Catálogo Gates Brasil Online');
    pushPortalIfNew('dayco', 'Catálogo Dayco Garage');
    pushPortalIfNew('continental', 'Catálogo Continental ContiTech');
  } else {
    pushPortalIfNew('nakata');
    pushPortalIfNew('cofap');
    pushPortalIfNew('bosch');
    pushPortalIfNew('sabo');
  }

  // If still empty or as universal reference, add TecDoc
  if (!brandNamesSeen.has('Catálogo TecDoc Alliance Web')) {
    portals.push({
      brand: 'TecDoc',
      name: 'Catálogo Eletrônico TecDoc Alliance',
      url: 'https://web.tecalliance.net/tecdocws/pt/home',
      badge: 'TecDoc Global',
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent('catalogo tecdoc ' + query.part + ' ' + query.vehicle)}`,
    });
  }

  result.officialCatalogs = portals;

  return result;
}

export function formatWhatsAppBudget(result: QueryResult): string {
  const { query, codes, technicalAlerts, relatedParts } = result;
  let text = `*COTAÇÃO DE AUTOPEÇAS - BALCÃO*\n`;
  text += `🚗 *Veículo:* ${query.vehicle} ${query.year || ''} ${query.engine ? `(${query.engine})` : ''}\n`;
  text += `🔧 *Peça Solicitada:* ${query.part}\n\n`;

  if (codes.length > 0) {
    text += `*CÓDIGOS E MARCAS DISPONÍVEIS:*\n`;
    for (const c of codes.slice(0, 6)) {
      text += `• ${c.brand}: ${c.code}\n`;
    }
    text += `\n`;
  }

  if (technicalAlerts.length > 0) {
    text += `*OBSERVAÇÃO TÉCNICA:* ${technicalAlerts[0]}\n\n`;
  }

  if (relatedParts.complementary.length > 0) {
    text += `*RECOMENDAÇÃO TÉCNICA (Trocar junto):*\n`;
    for (const r of relatedParts.complementary.slice(0, 3)) {
      text += `• ${r}\n`;
    }
    text += `\n`;
  }

  text += `📍 *Retirada no balcão ou entrega rápida em Rio Claro-SP.*\n`;
  text += `Deseja fechar o pedido ou verificar preço e disponibilidade no estoque?`;
  return text;
}
