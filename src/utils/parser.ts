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

    // 2 or 3. Alertas técnicos (flexível de ordem)
    else if (/ALERTAS TÉCNICOS|ALERTAS TECNICOS/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      if (!result.structuredAlerts) {
        result.structuredAlerts = [];
      }
      for (const line of lines) {
        const clean = line.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (!clean) continue;
        result.technicalAlerts.push(clean);

        // Classify structured alert
        let alertType: 'lote' | 'opcional' | 'falha' | 'mecanica' | 'geral' = 'geral';
        let alertTitle = 'Alerta Técnico';
        let alertDesc = clean;

        const colonIdx = clean.indexOf(':');
        if (colonIdx > 0 && colonIdx < 35) {
          const prefix = clean.substring(0, colonIdx).trim().toLowerCase();
          alertDesc = clean.substring(colonIdx + 1).trim();

          if (prefix.includes('lote') || prefix.includes('varia')) {
            alertType = 'lote';
            alertTitle = 'Variação de Lote / Ano';
          } else if (prefix.includes('opcional') || prefix.includes('inclus') || prefix.includes('acompanha')) {
            alertType = 'opcional';
            alertTitle = 'Componente Opcional / Inclusões';
          } else if (prefix.includes('falha') || prefix.includes('comum') || prefix.includes('defeito') || prefix.includes('sintoma')) {
            alertType = 'falha';
            alertTitle = 'Falha Comum no Modelo';
          } else if (prefix.includes('mecânica') || prefix.includes('mecanica') || prefix.includes('recomenda') || prefix.includes('montagem')) {
            alertType = 'mecanica';
            alertTitle = 'Recomendação Mecânica / Garantia';
          } else {
            alertTitle = clean.substring(0, colonIdx).trim();
          }
        } else {
          const lower = clean.toLowerCase();
          if (lower.includes('lote') || lower.includes('estria') || lower.includes('diâmetro') || lower.includes('diametro')) {
            alertType = 'lote';
            alertTitle = 'Variação de Lote / Medidas';
          } else if (lower.includes('não acompanha') || lower.includes('opcional') || lower.includes('atuador')) {
            alertType = 'opcional';
            alertTitle = 'Componente Opcional';
          } else if (lower.includes('falha') || lower.includes('pedal duro') || lower.includes('trepida')) {
            alertType = 'falha';
            alertTitle = 'Falha Comum';
          } else if (lower.includes('volante') || lower.includes('passe') || lower.includes('sangria') || lower.includes('torque')) {
            alertType = 'mecanica';
            alertTitle = 'Recomendação Mecânica';
          }
        }

        result.structuredAlerts.push({
          type: alertType,
          title: alertTitle,
          description: alertDesc,
        });
      }
    }

    // 4. Peças relacionadas
    else if (/PEÇAS RELACIONADAS|PECAS RELACIONADAS/i.test(trimmed)) {
      const lines = trimmed.split('\n').slice(1);
      if (!result.relatedParts.structuredItems) {
        result.relatedParts.structuredItems = [];
      }
      let subMode: 'similars' | 'complementary' = 'complementary';

      for (const line of lines) {
        const clean = line.trim();
        if (/similar/i.test(clean)) {
          subMode = 'similars';
        } else if (/complementar|trocad|junto|kit|venda casada/i.test(clean)) {
          subMode = 'complementary';
        }

        const bullet = clean.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (bullet && !/^#+\s/.test(bullet)) {
          if (subMode === 'similars') {
            result.relatedParts.similars.push(bullet);
          } else {
            result.relatedParts.complementary.push(bullet);
          }

          // Structured extraction of related component, brand and code
          // Example: "Atuador Hidráulico de Embreagem (Pedal): LuK - 511012710"
          const colonMatch = bullet.match(/^([^:]+):\s*(.+)$/);
          if (colonMatch) {
            const comp = colonMatch[1].trim();
            const rest = colonMatch[2].trim();
            const dashMatch = rest.match(/^([^-–—]+)\s*[-–—]\s*(.+)$/);
            if (dashMatch) {
              result.relatedParts.structuredItems.push({
                component: comp,
                brand: dashMatch[1].trim(),
                code: dashMatch[2].trim(),
                fullText: bullet,
              });
            } else {
              result.relatedParts.structuredItems.push({
                component: comp,
                fullText: bullet,
                code: rest,
              });
            }
          } else {
            result.relatedParts.structuredItems.push({
              component: bullet,
              fullText: bullet,
            });
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
      'Auto Peças 3R: Rua 06 A, 1269 - Vila Alemã. Telefone: (19) 3535-4499. Integrante da Rede PitStop, com entrega rápida de balcão.',
      'AutoZone Rio Claro: Av. Presidente Tancredo de Almeida Neves, 535. Telefone fixo: (19) 2111-2750 / WhatsApp Mecânicas: (11) 94078-1966. Amplo estoque local para pronta entrega.',
      'Dinâmica Auto Peças: Avenida 15 JP, 56 - Jardim Esmeralda. Telefone/WhatsApp: (19) 98185-5828. Foco em atendimento rápido regional.',
      'Disauto Distribuidora (Rio Claro): Atacado de autopeças com entrega rápida para balcão e oficinas.',
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
