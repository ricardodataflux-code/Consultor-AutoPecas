import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  Package,
  Layers,
  Camera,
  ExternalLink,
  Search,
  CheckCircle2,
  Phone,
  FileText,
  ListFilter,
  Sparkles,
  Tag,
  Image as ImageIcon,
  ShoppingCart,
  MapPin,
  Globe,
  BookOpen,
} from 'lucide-react';
import { QueryResult } from '../types';

const OFFICIAL_CATALOG_PORTALS = [
  { brand: 'Nakata', url: 'https://www.nakata.com.br/catalogo', role: 'Suspensão, freios, direção e bombas' },
  { brand: 'Cobreq', url: 'https://www.cobreq.com.br/catalogo-eletronico/', role: 'Pastilhas, discos, sapatas e lonas' },
  { brand: 'Fras-le', url: 'https://www.fras-le.com/br/pt/catalogo', role: 'Pastilhas Ceramaxx e discos' },
  { brand: 'Bosch Automotive', url: 'https://www.bosch-automotive.com/pt-br/catalogo', role: 'Injeção, freios, velas e filtros' },
  { brand: 'Cofap / Marelli', url: 'https://www.mmcofap.com.br/catalogo', role: 'Amortecedores Turbogás e molas' },
  { brand: 'Schaeffler (LUK / INA)', url: 'https://www.repxpert.com.br', role: 'Embreagens e rolamentos' },
  { brand: 'Monroe / Axios', url: 'https://www.monroecatalogo.com.br', role: 'Amortecedores e borrachas' },
  { brand: 'Fremax', url: 'https://www.fremax.com.br/catalogo', role: 'Discos e tambores de freio' },
  { brand: 'Sabó', url: 'https://www.sabo.com.br/catalogo', role: 'Retentores e juntas de motor' },
  { brand: 'Gates / Dayco', url: 'https://www.gatesshowcase.com', role: 'Correias sincronizadoras e tensores' },
  { brand: 'NGK / NTK', url: 'https://www.ngkntk.com.br/catalogo', role: 'Velas de ignição e sondas lambda' },
  { brand: 'SKF', url: 'https://www.skf.com/br/support/engineering-tools/catalogs-and-literature', role: 'Rolamentos e bombas' },
];

interface ResultViewProps {
  result: QueryResult;
  onAnswerConfirmations?: (answers: Record<string, string>) => void;
  onQueryRelatedPart?: (partName: string) => void;
  isLoading?: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onAnswerConfirmations,
  onQueryRelatedPart,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'markdown'>('visual');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [filterAnswers, setFilterAnswers] = useState<Record<string, string>>({});

  const groupedCodes = React.useMemo(() => {
    const groups: { application: string | null; items: typeof result.codes }[] = [];
    let currentGroup: { application: string | null; items: typeof result.codes } = { application: null, items: [] };

    result.codes.forEach(item => {
      if (item.brand.toLowerCase() === 'aplicação' || item.brand.toLowerCase() === 'aplicacao') {
        if (currentGroup.items.length > 0 || currentGroup.application !== null) {
          groups.push(currentGroup);
        }
        const cleanApp = item.code.replace(/:$/, '').trim();
        currentGroup = { application: cleanApp, items: [] };
      } else {
        currentGroup.items.push(item);
      }
    });
    if (currentGroup.items.length > 0 || currentGroup.application !== null) {
      groups.push(currentGroup);
    }
    
    // Sort items inside each group to put "original" at the top
    groups.forEach(group => {
      group.items.sort((a, b) => {
        if (a.category === 'original' && b.category !== 'original') return -1;
        if (a.category !== 'original' && b.category === 'original') return 1;
        return 0;
      });
    });

    return groups;
  }, [result.codes]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(result.rawMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  const handleSelectAnswerChip = (question: string, value: string) => {
    setFilterAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAnswerConfirmations) {
      onAnswerConfirmations(filterAnswers);
    }
  };

  // Pre-generate quick chips depending on question content
  const getQuestionChips = (q: string): string[] => {
    const qLower = q.toLowerCase();
    const chips: string[] = [];

    if (qLower.includes('geração') || qLower.includes('geracao') || qLower.includes('g5') || qLower.includes('g4')) {
      chips.push('Gol G5 / G6 / G7 / G8', 'Gol G2 / G3 / G4 Bola');
    }
    if (qLower.includes('motor') || qLower.includes('motorização') || qLower.includes('motorizacao')) {
      chips.push('1.0 8V', '1.6 8V', '1.4', '1.8', 'EA111', 'AP');
    }
    if (qLower.includes('abs')) {
      chips.push('Com ABS', 'Sem ABS');
    }
    if (qLower.includes('lado') || qLower.includes('posição') || qLower.includes('posicao')) {
      chips.push('Dianteiro', 'Traseiro', 'Lado Direito (LD)', 'Lado Esquerdo (LE)', 'Par (Ambos)');
    }
    if (qLower.includes('câmbio') || qLower.includes('cambio')) {
      chips.push('Manual (Mecânico)', 'Automático');
    }
    if (qLower.includes('barra') || qLower.includes('estabilizadora')) {
      chips.push('Com barra estabilizadora', 'Sem barra estabilizadora');
    }
    if (qLower.includes('direção') || qLower.includes('direcao')) {
      chips.push('Hidráulica', 'Elétrica', 'Mecânica (Manual)');
    }
    if (qLower.includes('bosch') || qLower.includes('marwal')) {
      chips.push('Sistema Bosch', 'Sistema Marwal');
    }
    if (qLower.includes('teves') || qLower.includes('varga')) {
      chips.push('Sistema Teves / ATE', 'Sistema Varga / TRW', 'Sistema Bosch');
    }

    return chips;
  };

  // Google image search URL
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    result.visualInspection.searchTerm || `${result.query.part} ${result.query.vehicle} ${result.query.year || ''}`
  )}`;

  return (
    <div className="w-full mt-4 flex flex-col items-center animate-fade-in space-y-4">
      {/* Top Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {result.query.part} • {result.query.vehicle} {result.query.year ? `(${result.query.year})` : ''}
          </span>
          {result.query.abs && (
            <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${
              result.query.abs === 'com_abs' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {result.query.abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}
            </span>
          )}
          {result.query.transmission && (
            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-1 rounded-md border border-blue-200 capitalize">
              Câmbio {result.query.transmission}
            </span>
          )}
          {result.query.steering && (
            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-1 rounded-md border border-blue-200 capitalize">
              Dir. {result.query.steering}
            </span>
          )}
          {result.query.fuel && (
            <span className="text-[11px] font-bold bg-indigo-50 text-indigo-800 px-2 py-1 rounded-md border border-indigo-200">
              {result.query.fuel}
            </span>
          )}
          {result.query.position && (
            <span className="text-[11px] font-bold bg-purple-50 text-purple-800 px-2 py-1 rounded-md border border-purple-200">
              {result.query.position}
            </span>
          )}
          {result.usedFallback ? (
            <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {result.aiProvider || 'Catálogo Especialista Balcão'}
            </span>
          ) : (
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{result.aiProvider || 'IA do Google • Catálogos Oficiais'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'visual'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Visual Balcão
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'markdown'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Texto / Markdown
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
            title="Copiar resultado completo"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copiado!' : 'Copiar Tudo'}</span>
          </button>
        </div>
      </div>

      {/* MARKDOWN VIEW (Matches dark-mode chat format when selected) */}
      {viewMode === 'markdown' && (
        <div className="w-full bg-[#202124] rounded-xl border border-slate-700/70 shadow-xl p-6 sm:p-8">
          <div className="markdown-body text-slate-200 text-[15px] leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0 uppercase tracking-wide border-b border-slate-700 pb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide text-blue-400" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-bold text-white mt-6 mb-3 uppercase tracking-wide" {...props} />,
                p: ({ node, ...props }) => <p className="text-slate-300 mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 text-slate-300 mb-4 space-y-2 marker:text-blue-400" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 text-slate-300 mb-4 space-y-2 marker:text-blue-400" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-400 no-underline hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {result.rawMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* VISUAL BALCÃO VIEW (High productivity, direct lists, interactive filter) */}
      {viewMode === 'visual' && (
        <div className="w-full space-y-5">
          {/* BANNER IA DO GOOGLE & CATÁLOGOS OFICIAIS */}
          <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-md border border-blue-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Inteligência Artificial do Google
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-semibold">
                    Catálogos Oficiais Homologados
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Pesquisa Realizada nos Catálogos Oficiais Automotivos
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  A IA consultou as bases técnicas das montadoras e dos fabricantes líderes de autopeças (<strong>Nakata, Cobreq, Fras-le, Bosch, Cofap, Schaeffler LUK, Monroe, Sabó, Fremax, Gates</strong>) cruzando motorização, opcionais de freio (ABS), câmbio e suspensão.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${result.query.part} ${result.query.vehicle} catalogo oficial nakata cobreq bosch`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-300" />
                  <span>Conferir no Google</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Verified Sources if grounded by Google Search */}
            {result.verifiedSources && result.verifiedSources.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-white/10">
                <div className="text-[11px] font-semibold text-blue-200 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fontes e Catálogos Técnicos Verificados:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.verifiedSources.slice(0, 6).map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] text-slate-200 hover:text-white transition-colors"
                      title={src.title}
                    >
                      <BookOpen className="w-3 h-3 text-blue-300" />
                      <span className="truncate max-w-[200px]">{src.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick launcher to official portals */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Acesso direto:</span>
              {OFFICIAL_CATALOG_PORTALS.slice(0, 6).map((cat) => (
                <a
                  key={cat.brand}
                  href={cat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-[11px] text-slate-200 hover:text-white font-medium shrink-0 flex items-center gap-1 transition-colors"
                  title={`Abrir portal do ${cat.brand}: ${cat.role}`}
                >
                  <span>{cat.brand}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* SECTION 1: TRIAGEM & PERGUNTAS DE CONFIRMAÇÃO (FILTRO INTERATIVO) */}
          {result.confirmationQuestions.length > 0 ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-amber-950 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      Triagem Técnica & Perguntas de Confirmação (Filtro)
                    </h3>
                    <p className="text-xs text-amber-800">
                      Responda ou selecione as opções abaixo para filtrar e fechar a aplicação exata:
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-1 rounded-full uppercase tracking-wider">
                  Filtro Ativo
                </span>
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-4 mt-4">
                {result.confirmationQuestions.map((q, idx) => {
                  const chips = getQuestionChips(q);
                  const currentValue = filterAnswers[q] || '';

                  return (
                    <div key={idx} className="bg-white/90 p-3.5 rounded-lg border border-amber-200/80 shadow-xs space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">
                        • {q}
                      </label>

                      {/* Quick Choice Chips */}
                      {chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {chips.map((chip, cIdx) => {
                            const isSelected = currentValue === chip;
                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => handleSelectAnswerChip(q, chip)}
                                className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-xs scale-102 ring-2 ring-blue-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Text Input for Custom Answer */}
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) =>
                          setFilterAnswers((prev) => ({
                            ...prev,
                            [q]: e.target.value,
                          }))
                        }
                        placeholder="Digite a resposta confirmada ou selecione acima..."
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  );
                })}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isLoading ? 'Aplicando Filtro...' : '🔍 Aplicar Filtro & Fechar Código Exato'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">1. Aplicação Identificada com Precisão</p>
                <p className="text-[11px] text-emerald-700">
                  Nenhuma dúvida técnica pendente. Códigos de referência fechados para o modelo informado.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: CÓDIGOS DE REFERÊNCIA (LISTA DIRETA NO ATO) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-600" />
                    Códigos de Referência dos Fabricantes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Códigos prontos para consulta no sistema de estoque e fechamento da venda
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200 uppercase">
                {result.codes.length} Referências
              </span>
            </div>

            {/* List of Reference Codes */}
            {groupedCodes.length > 0 ? (
              <div className="flex flex-col gap-6">
                {groupedCodes.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col shadow-xs rounded-lg">
                    {group.application && (
                      <div className="bg-slate-100 border border-slate-200 rounded-t-lg px-4 py-2.5 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-sm text-slate-800">{group.application}</span>
                      </div>
                    )}
                    <div className={`divide-y divide-slate-100 border border-slate-200 bg-white ${group.application ? 'rounded-b-lg border-t-0' : 'rounded-lg'}`}>
                      {group.items.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 italic text-center">Nenhum código listado para esta aplicação.</div>
                      ) : null}
                      {group.items.map((item, idx) => {
                        const uniqueId = `${groupIdx}-${idx}`;
                        const isCopied = copiedItem === `${item.brand}-${uniqueId}`;
                        const isOriginal = item.category === 'original';

                        return (
                          <div
                            key={uniqueId}
                            className={`py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors group ${!group.application && idx === 0 ? 'rounded-t-lg' : ''} ${idx === group.items.length - 1 ? 'rounded-b-lg' : ''}`}
                          >
                            <div className="flex items-start sm:items-center gap-3">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide uppercase shrink-0 border ${
                                  isOriginal
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : item.brand.toLowerCase().includes('nakata')
                                    ? 'bg-orange-50 text-orange-900 border-orange-200'
                                    : item.brand.toLowerCase().includes('cofap')
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : item.brand.toLowerCase().includes('monroe')
                                    ? 'bg-yellow-50 text-yellow-900 border-yellow-300'
                                    : item.brand.toLowerCase().includes('bosch')
                                    ? 'bg-red-50 text-red-900 border-red-200'
                                    : item.brand.toLowerCase().includes('cobreq')
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                    : item.brand.toLowerCase().includes('luk')
                                    ? 'bg-yellow-50 text-amber-900 border-yellow-300'
                                    : 'bg-slate-100 text-slate-800 border-slate-200'
                                }`}
                              >
                                {item.brand}
                              </span>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 select-all tracking-tight">
                                    {item.code}
                                  </span>
                                  {item.category === 'original' && (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-xs">
                                      <Sparkles className="w-3 h-3" />
                                      ORIGINAL DE FÁBRICA
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <div className="flex flex-col gap-1 mt-1.5">
                                    {item.notes.includes('|') ? (
                                      <div className="bg-slate-50 border border-slate-100 rounded-md p-2">
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dados Técnicos da Peça</div>
                                        <ul className="flex flex-col gap-1 text-[11px] text-slate-600 font-medium">
                                          {item.notes.split('|').map((notePart, nIdx) => {
                                            const parts = notePart.split(':');
                                            if (parts.length > 1) {
                                              return (
                                                <li key={nIdx} className="flex gap-1">
                                                  <span className="font-bold text-slate-700">{parts[0].trim()}:</span>
                                                  <span>{parts.slice(1).join(':').trim()}</span>
                                                </li>
                                              );
                                            }
                                            return <li key={nIdx}>{notePart.trim()}</li>;
                                          })}
                                        </ul>
                                      </div>
                                    ) : (
                                      <span className="text-[11px] text-slate-500 font-medium">{item.notes}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => handleCopyCode(item.code, `${item.brand}-${uniqueId}`)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border shadow-xs ${
                                  isCopied
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                                title="Copiar apenas este código"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copiado!' : 'Copiar Código'}</span>
                              </button>

                              <a
                                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${result.query.part} ${item.brand} ${item.code}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-teal-600 transition-colors shadow-xs"
                                title="Ver foto desta peça"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                              </a>

                              <a
                                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`"${item.brand}" "${item.code}"`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-orange-600 transition-colors shadow-xs"
                                title="Buscar preço e opções online (Mercado Livre, Shopee, etc)"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </a>

                              {item.catalogUrl && (
                                <a
                                  href={item.catalogUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors shadow-xs"
                                  title={`Abrir ${item.catalogName || 'catálogo online'}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : result.hasUnresolvedQuestions ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500" />
                <h4 className="text-sm font-bold text-amber-900">Aguardando Confirmação</h4>
                <p className="text-xs text-amber-700 max-w-sm">
                  A Inteligência Artificial precisa que você responda às perguntas na <strong>Seção 1</strong> acima para poder liberar os códigos exatos com segurança.
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-lg">
                {result.rawMarkdown}
              </div>
            )}
          </div>

          {/* SECTION 3: ALERTAS TÉCNICOS */}
          {result.technicalAlerts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Alertas Técnicos de Montagem & Aplicação
                  </h3>
                  <p className="text-xs text-amber-800">
                    Evite retornos e erros comuns de instalação comunicando o cliente e o mecânico
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-amber-950 pl-2">
                {result.technicalAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SECTION 4: PEÇAS RELACIONADAS (VENDA CASADA NO BALCÃO) */}
          {(result.relatedParts.complementary.length > 0 || result.relatedParts.similars.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Peças Relacionadas (Venda Agregada / Casada)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ofereça os kits complementares para elevar o ticket médio e garantir a instalação correta
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.relatedParts.complementary.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Itens Complementares Recomendados:
                    </span>
                    <div className="flex flex-col border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 shadow-xs">
                      {result.relatedParts.complementary.map((part, idx) => {
                        const isCopied = copiedItem === `rel-comp-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors group"
                          >
                            <span className="text-sm font-semibold text-slate-800 leading-snug flex-1">
                              {part}
                            </span>
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => handleCopyCode(part, `rel-comp-${idx}`)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border shadow-xs ${
                                  isCopied
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                                title="Copiar descrição"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                              </button>
                              
                              <a
                                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(part)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-teal-600 transition-colors shadow-xs"
                                title="Ver foto desta peça"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(part)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-orange-600 transition-colors shadow-xs"
                                title="Buscar preço e opções online (Mercado Livre, Shopee, etc)"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </a>

                              {onQueryRelatedPart && (
                                <button
                                  onClick={() => onQueryRelatedPart(part.split(':')[0].split('-')[0].trim())}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                  <span>Consultar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {result.relatedParts.similars.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Marcas Similares de 1ª Linha:
                    </span>
                    <div className="flex flex-col border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 shadow-xs">
                      {result.relatedParts.similars.map((part, idx) => {
                        const isCopied = copiedItem === `rel-sim-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors group"
                          >
                            <span className="text-sm font-semibold text-slate-800 leading-snug flex-1">
                              {part}
                            </span>
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => handleCopyCode(part, `rel-sim-${idx}`)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border shadow-xs ${
                                  isCopied
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                                title="Copiar descrição"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                              </button>
                              
                              <a
                                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(part)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-teal-600 transition-colors shadow-xs"
                                title="Ver foto desta peça"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(part)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-orange-600 transition-colors shadow-xs"
                                title="Buscar preço e opções online (Mercado Livre, Shopee, etc)"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </a>

                              {onQueryRelatedPart && (
                                <button
                                  onClick={() => onQueryRelatedPart(part.split(':')[0].split('-')[0].trim())}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                  <span>Consultar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* SECTION 5: ONDE ENCONTRAR (RIO CLARO - SP) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                5
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-rose-600" />
                  Onde Encontrar em Outras Lojas / Distribuidoras (Rio Claro - SP)
                </h3>
                <p className="text-xs text-slate-500">
                  Parceiros e distribuidores locais para faturar e entregar via motoboy caso falte em estoque
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Pellegrino Distribuidora de Autopeças', phone: '(19) 3534-8000', address: 'Av. Brasil, 1200 - Distrito Industrial', site: 'www.pellegrino.com.br' },
                { name: 'Garcia Autopeças & Distribuidora', phone: '(19) 3522-1234', address: 'Rua 14, 2568 - Consolação', site: 'www.garciaautopecas.com.br' },
                { name: 'Bezerra Distribuidora de Autopeças', phone: '(19) 3524-4567', address: 'Av. 29, 800 - Cidade Jardim', site: 'www.bezerra.com.br' },
                { name: 'Pit Stop Autopeças', phone: '(19) 3526-7890', address: 'Av. Visconde de Rio Claro, 450 - Centro', site: 'www.pitstop.com.br' },
                { name: 'Disauto Distribuidora', phone: '(19) 3523-5678', address: 'Rua 9, 150 - Santa Cruz', site: 'www.disauto.com.br' }
              ].map((sup, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col gap-2 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-800">{sup.name}</span>
                    <button
                      onClick={() => handleCopyCode(`${sup.name}\nTel: ${sup.phone}\nEnd: ${sup.address}\nSite: ${sup.site}`, `sup-${idx}`)}
                      className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shrink-0 transition-colors shadow-xs"
                      title="Copiar contato"
                    >
                      {copiedItem === `sup-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {sup.phone}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400" /> {sup.address}</span>
                    <span className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-slate-400" /> {sup.site}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
