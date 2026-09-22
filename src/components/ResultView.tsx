import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Building2,
  Phone,
  MapPin,
  ImageIcon,
  Wrench,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Layers,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  Compass,
  FileSpreadsheet,
  Globe,
  ShoppingCart,
  Ruler,
} from 'lucide-react';
import { QueryResult, ReferenceCode } from '../types';
import {
  OFFICIAL_CATALOG_PORTALS,
  RIO_CLARO_STORES,
  getBrandDirectCatalogUrl,
  getBrandTechnicalInfo,
} from '../data/catalogBrands';
import { TechnicalSchematicModal } from './TechnicalSchematicModal';

interface ResultViewProps {
  result: QueryResult;
  onAnswerConfirmations?: (answers: Record<string, string>) => void;
  onQueryRelatedPart?: (partName: string) => void;
  isLoading?: boolean;
  onNewQuery?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onAnswerConfirmations,
  onQueryRelatedPart,
  isLoading,
  onNewQuery,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [filterAnswers, setFilterAnswers] = useState<Record<string, string>>({});
  const [isRawExpanded, setIsRawExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'markdown'>('visual');
  const [isSchematicOpen, setIsSchematicOpen] = useState(false);

  // Group codes by application
  const groupedCodes = React.useMemo(() => {
    const groups: { application?: string; items: ReferenceCode[] }[] = [];
    const map = new Map<string, ReferenceCode[]>();

    result.codes.forEach((code) => {
      const app = code.application || 'Aplicação Principal';
      if (!map.has(app)) {
        map.set(app, []);
      }
      map.get(app)!.push(code);
    });

    map.forEach((items, application) => {
      groups.push({
        application: application === 'Aplicação Principal' && map.size === 1 ? undefined : application,
        items,
      });
    });

    return groups;
  }, [result.codes]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  const handleCopyFullQuote = () => {
    let text = `*ORÇAMENTO DE AUTOPEÇAS - BALCÃO PRO*\n`;
    text += `*Peça:* ${result.query.part}\n`;
    text += `*Veículo:* ${result.query.vehicle} ${result.query.year ? `(${result.query.year})` : ''}\n`;
    if (result.query.engine) text += `*Motor:* ${result.query.engine}\n`;
    text += `\n*CÓDIGOS E MARCAS DE REPOSIÇÃO:*\n`;

    result.codes.forEach((c) => {
      text += `• ${c.brand.toUpperCase()}: ${c.code} ${c.notes ? `(${c.notes})` : ''}\n`;
    });

    if (result.technicalAlerts.length > 0) {
      text += `\n*ALERTAS TÉCNICOS & RECOMENDAÇÃO:*\n`;
      result.technicalAlerts.slice(0, 3).forEach((a) => {
        text += `! ${a}\n`;
      });
    }

    if (result.relatedParts.complementary.length > 0) {
      text += `\n*PEÇAS COMPLEMENTARES RECOMENDADAS:*\n`;
      result.relatedParts.complementary.slice(0, 3).forEach((r) => {
        text += `+ ${r}\n`;
      });
    }

    text += `\n*ONDE RETIRAR EM RIO CLARO-SP:*\n`;
    text += `• Auto Peças 3R: (19) 3535-4499\n`;
    text += `• AutoZone Rio Claro: (19) 2111-2750 / Whats: (11) 94078-1966\n`;
    text += `• Dinâmica Auto Peças: (19) 98185-5828\n`;
    text += `• Disauto Distribuidora: (19) 3526-9000\n`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2200);
  };

  const handlePrint = () => {
    window.print();
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

  const getQuestionChips = (q: string): string[] => {
    const qLower = q.toLowerCase();
    const chips: string[] = [];

    if (qLower.includes('carroceria') || qLower.includes('versão') || qLower.includes('versao') || qLower.includes('palio')) {
      chips.push('Celebration / Fire', 'ELX / Attractive', 'Way / Trekking', 'Weekend');
    }
    if (qLower.includes('diâmetro') || qLower.includes('diametro') || qLower.includes('180') || qLower.includes('190')) {
      chips.push('190mm (20 Estrias)', '180mm (Lote Anterior)');
    }
    if (qLower.includes('dualogic') || qLower.includes('câmbio') || qLower.includes('cambio')) {
      chips.push('Manual Convencional', 'Dualogic Automatizado');
    }
    if (qLower.includes('motor') || qLower.includes('motorização') || qLower.includes('motorizacao')) {
      chips.push('1.0 8V Fire Flex', '1.4 8V Fire Flex', '1.0 12V 3 Cilindros', '1.6 8V / 1.6 16V');
    }
    if (qLower.includes('abs')) {
      chips.push('Com ABS', 'Sem ABS');
    }
    if (qLower.includes('direção') || qLower.includes('direcao')) {
      chips.push('Hidráulica', 'Elétrica', 'Mecânica (Manual)');
    }

    return chips;
  };

  // Structured Alerts categorization
  const structuredAlerts = React.useMemo(() => {
    if (result.structuredAlerts && result.structuredAlerts.length > 0) {
      return result.structuredAlerts;
    }
    return result.technicalAlerts.map((raw) => {
      const lower = raw.toLowerCase();
      let type: 'lote' | 'opcional' | 'falha' | 'mecanica' | 'geral' = 'geral';
      let title = 'Alerta Técnico';
      let description = raw;

      const colonIdx = raw.indexOf(':');
      if (colonIdx > 0 && colonIdx < 35) {
        title = raw.substring(0, colonIdx).trim();
        description = raw.substring(colonIdx + 1).trim();
      }

      if (lower.includes('lote') || lower.includes('estria') || lower.includes('diâmetro') || lower.includes('diametro')) {
        type = 'lote';
        if (title === 'Alerta Técnico') title = 'Variação de Lote / Medidas';
      } else if (lower.includes('opcional') || lower.includes('não acompanha') || lower.includes('nao acompanha') || lower.includes('atuador')) {
        type = 'opcional';
        if (title === 'Alerta Técnico') title = 'Componente Opcional / Inclusões';
      } else if (lower.includes('falha') || lower.includes('pedal duro') || lower.includes('trepida') || lower.includes('ruído') || lower.includes('desgaste')) {
        type = 'falha';
        if (title === 'Alerta Técnico') title = 'Falha Comum no Modelo';
      } else if (lower.includes('mecânica') || lower.includes('mecanica') || lower.includes('passe') || lower.includes('volante') || lower.includes('sangria') || lower.includes('torque')) {
        type = 'mecanica';
        if (title === 'Alerta Técnico') title = 'Recomendação Mecânica / Montagem';
      }

      return { type, title, description };
    });
  }, [result.structuredAlerts, result.technicalAlerts]);

  const cleanSearchTerm = result.visualInspection.searchTerm || `${result.query.part} ${result.query.vehicle} ${result.query.year || ''}`.trim();
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(cleanSearchTerm)}`;
  const mercadoLivreUrl = `https://lista.mercadolivre.com.br/${encodeURIComponent(cleanSearchTerm)}`;
  const hipervarejoUrl = `https://www.google.com/search?q=${encodeURIComponent('hipervarejo ' + cleanSearchTerm)}`;

  return (
    <div className="w-full mt-4 flex flex-col items-center animate-fade-in space-y-4">
      {/* PAINEL DE CONTROLE DE BALCÃO */}
      <div className="w-full bg-white rounded-xl border border-zinc-200 shadow-xs p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Veículo e Especificações */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black tracking-wider uppercase bg-zinc-950 text-white px-3 py-1.5 rounded-lg border border-zinc-950">
              {result.query.part}
            </span>
            <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-300">
              {result.query.vehicle} {result.query.year ? `• ${result.query.year}` : ''}
            </span>
            {result.query.engine && (
              <span className="text-xs font-medium text-zinc-800 bg-zinc-100 px-2.5 py-1.5 rounded-lg border border-zinc-300">
                {result.query.engine}
              </span>
            )}
            {result.query.transmission && (
              <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300 capitalize">
                Câmbio {result.query.transmission}
              </span>
            )}
            {result.query.abs && (
              <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300">
                {result.query.abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}
              </span>
            )}
            {result.query.steering && (
              <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-300 capitalize">
                Direção {result.query.steering}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <ShieldCheck className="w-4 h-4 text-zinc-950 shrink-0" />
            <span>Pesquisa especialista com as 44 marcas parceiras e consulta a catálogos oficiais</span>
          </div>
        </div>

        {/* Barra de Ações Rápidas do Balcão */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botão de Foto / Esquema Técnico com Medidas e Cotas */}
          <button
            id="btn-schematic-top"
            onClick={() => setIsSchematicOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            title="Abrir Esquema Técnico, Cotas de Medição e Gabarito da Peça"
          >
            <Ruler className="w-3.5 h-3.5 text-zinc-200" />
            <span>Foto / Esquema Técnico</span>
          </button>

          {/* Alternador de Modo */}
          <div className="bg-zinc-100 p-1 rounded-lg border border-zinc-300 flex items-center text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                viewMode === 'visual'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>6 Tópicos</span>
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                viewMode === 'markdown'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Texto Puro</span>
            </button>
          </div>

          <button
            id="btn-copy-quote"
            onClick={handleCopyFullQuote}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all border ${
              copiedQuote
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-50'
            }`}
            title="Copiar cotação completa formatada para colar no WhatsApp do cliente"
          >
            {copiedQuote ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedQuote ? 'Orçamento Copiado!' : 'Copiar Orçamento'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 shadow-2xs transition-colors"
            title="Imprimir folha de balcão"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODO MARKDOWN BRUTO */}
      {viewMode === 'markdown' ? (
        <div className="w-full bg-white rounded-xl border border-zinc-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-xs font-bold text-zinc-700 font-mono">
              RESPOSTA PADRÃO BALCÃO (MARKDOWN ESTRUTURADO)
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.rawMarkdown);
                setCopiedItem('raw');
                setTimeout(() => setCopiedItem(null), 1800);
              }}
              className="text-xs font-bold text-zinc-800 hover:text-zinc-950 flex items-center gap-1"
            >
              {copiedItem === 'raw' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'raw' ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono bg-zinc-50 p-4 rounded-lg border border-zinc-200 overflow-x-auto whitespace-pre-wrap text-zinc-800 leading-relaxed max-h-[600px]">
            {result.rawMarkdown}
          </pre>
        </div>
      ) : (
        /* MODO VISUAL DOS 6 TÓPICOS */
        <div className="w-full space-y-4">
          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 1: PERGUNTAS DE CONFIRMAÇÃO
          ══════════════════════════════════════════════════════════════════ */}
          {result.confirmationQuestions.length > 0 ? (
            <div className="bg-zinc-50 border-2 border-zinc-400 rounded-xl p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-zinc-800" />
                      1. PERGUNTAS DE CONFIRMAÇÃO (Triagem Técnica de Balcão)
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium">
                      Para evitar peças incompatíveis ou devolução, confirme as especificações abaixo com o cliente ou mecânico:
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-zinc-200 text-zinc-950 px-2.5 py-1 rounded border border-zinc-400 uppercase tracking-wider">
                  Triagem Necessária
                </span>
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-3 mt-3">
                {result.confirmationQuestions.map((q, idx) => {
                  const chips = getQuestionChips(q);
                  const currentValue = filterAnswers[q] || '';

                  return (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-zinc-300 space-y-2">
                      <label className="text-xs font-bold text-zinc-900 block">
                        • {q}
                      </label>

                      {chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {chips.map((chip, cIdx) => {
                            const isSelected = currentValue === chip;
                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => handleSelectAnswerChip(q, chip)}
                                className={`text-[11px] px-3 py-1 rounded-md font-bold transition-all border ${
                                  isSelected
                                    ? 'bg-zinc-950 text-white border-zinc-950'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                                }`}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) =>
                          setFilterAnswers((prev) => ({
                            ...prev,
                            [q]: e.target.value,
                          }))
                        }
                        placeholder="Clique em uma das opções acima ou digite a resposta..."
                        className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-950 bg-white text-zinc-900"
                      />
                    </div>
                  );
                })}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isLoading ? 'Cruzando Catálogos...' : 'Aplicar Confirmação & Fechar Aplicação'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-300 rounded-xl p-4 flex items-center gap-3 text-zinc-900 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-xs shrink-0">
                1
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" />
                <p className="text-xs font-bold text-zinc-900">
                  1. Aplicação Técnica Definida: Nenhuma pendência técnica impeditiva para {result.query.vehicle} {result.query.year || ''}.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 2: ALERTAS TÉCNICOS
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-zinc-800" />
                    2. ALERTAS TÉCNICOS (Atenção no Balcão)
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Orientações essenciais de balcão para evitar devolução por garantia ou erro de montagem
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-900 px-2.5 py-1 rounded border border-zinc-300 uppercase font-mono">
                {structuredAlerts.length} Orientações
              </span>
            </div>

            {/* Grid com Tipos de Alertas Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {structuredAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-zinc-400 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-zinc-950 uppercase tracking-wide">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-300 bg-white text-zinc-800 uppercase">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 3: CÓDIGOS DE REFERÊNCIA & ARGUMENTOS TÉCNICOS DE VENDA
          ══════════════════════════════════════════════════════════════════ */}
          <div id="card-reference-codes" className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-zinc-800" />
                    3. CÓDIGOS DE REFERÊNCIA & ARGUMENTOS DE VENDA
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Códigos das 44 marcas prioritárias, prazos de garantia e argumentos persuasivos para balcão
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSchematicOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold border border-zinc-300 transition-colors shadow-2xs"
                >
                  <Ruler className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Ver Esquema e Cotas</span>
                </button>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-900 px-2.5 py-1 rounded border border-zinc-300 uppercase font-mono">
                  {result.codes.length} Referências
                </span>
              </div>
            </div>

            {/* Lista de Códigos de Referência */}
            {groupedCodes.length > 0 ? (
              <div className="space-y-4">
                {groupedCodes.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    {group.application && (
                      <div className="bg-zinc-100 px-4 py-2.5 border-b border-zinc-200 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-zinc-600" />
                        <span className="font-black text-xs text-zinc-950 uppercase tracking-wide">
                          Aplicação: {group.application}
                        </span>
                      </div>
                    )}

                    <div className="divide-y divide-zinc-200 bg-white">
                      {group.items.map((item, idx) => {
                        const uniqueId = `code-${groupIdx}-${idx}`;
                        const isCopied = copiedItem === uniqueId;
                        const isOriginal =
                          item.category === 'original' ||
                          item.brand.toLowerCase().includes('montadora') ||
                          item.brand.toLowerCase().includes('fiat') ||
                          item.brand.toLowerCase().includes('vw') ||
                          item.brand.toLowerCase().includes('gm');

                        const brandInfo = getBrandTechnicalInfo(item.brand);

                        return (
                          <div
                            key={uniqueId}
                            className="p-4 flex flex-col gap-3 hover:bg-zinc-50/80 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-3">
                                {/* Marca Badge */}
                                <span
                                  className={`text-[11px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shrink-0 border ${
                                    isOriginal
                                      ? 'bg-zinc-950 text-white border-zinc-950'
                                      : 'bg-zinc-100 text-zinc-900 border-zinc-300'
                                  }`}
                                >
                                  {item.brand}
                                </span>

                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-base sm:text-lg font-black text-zinc-950 select-all tracking-tight">
                                      {item.code}
                                    </span>
                                    {isOriginal && (
                                      <span className="inline-flex items-center gap-1 bg-zinc-200 text-zinc-950 border border-zinc-400 text-[10px] uppercase font-black px-2 py-0.5 rounded">
                                        <Sparkles className="w-3 h-3 text-zinc-800" />
                                        ORIGINAL OEM
                                      </span>
                                    )}
                                    {brandInfo?.warranty && (
                                      <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                                        Garantia: {brandInfo.warranty}
                                      </span>
                                    )}
                                  </div>
                                  {item.notes && (
                                    <p className="text-xs text-zinc-600 font-medium mt-0.5">
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Ações Rápidas do Item */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 flex-wrap">
                                {/* Portal Oficial da Marca */}
                                {(() => {
                                  const directPortal = getBrandDirectCatalogUrl(item.brand, item.code);
                                  if (!directPortal) return null;
                                  return (
                                    <a
                                      href={directPortal.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-300 transition-colors shadow-2xs"
                                      title={`Abrir consulta direta no catálogo da ${directPortal.name}`}
                                    >
                                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                                      <span>Catálogo Oficial</span>
                                    </a>
                                  );
                                })()}

                                <button
                                  onClick={() => handleCopyCode(item.code, uniqueId)}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
                                    isCopied
                                      ? 'bg-zinc-950 text-white border-zinc-950'
                                      : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800'
                                  }`}
                                  title="Copiar código para colar no ERP"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                                </button>

                                <a
                                  href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${result.query.part} ${item.brand} ${item.code}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-600 hover:text-zinc-950 transition-colors shadow-2xs"
                                  title="Ver foto oficial desta peça"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                </a>

                                <a
                                  href={`https://lista.mercadolivre.com.br/${encodeURIComponent(`${item.brand} ${item.code}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-600 hover:text-zinc-950 transition-colors shadow-2xs"
                                  title="Conferir preço de mercado de reposição"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            {/* Argumento Técnico Persuasivo de Venda (da base das 44 marcas) */}
                            {brandInfo?.salesPitch && (
                              <div className="bg-zinc-50 rounded-lg p-2.5 border border-zinc-200 text-xs text-zinc-700 flex items-start gap-2">
                                <span className="font-bold text-zinc-900 shrink-0 text-[11px] uppercase tracking-wider bg-zinc-200 px-1.5 py-0.5 rounded">
                                  Argumento de Balcão:
                                </span>
                                <span>{brandInfo.salesPitch}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-zinc-50 rounded-lg text-center text-xs text-zinc-500">
                Nenhum código retornado. Verifique as perguntas de confirmação na Seção 1.
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 4: PEÇAS RELACIONADAS
          ══════════════════════════════════════════════════════════════════ */}
          {(result.relatedParts.complementary.length > 0 || result.relatedParts.similars.length > 0) && (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-zinc-800" />
                      4. PEÇAS RELACIONADAS (Venda Agregada & Periféricos)
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Componentes complementares para garantir a troca completa e evitar retrabalho mecânico
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-900 px-2.5 py-1 rounded border border-zinc-300 uppercase font-mono">
                  Venda Agregada
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.relatedParts.complementary.map((partText, idx) => {
                  const uniqueId = `rel-${idx}`;
                  const isCopied = copiedItem === uniqueId;

                  const parts = partText.split(':');
                  const title = parts.length > 1 ? parts[0].trim() : partText;
                  const detail = parts.length > 1 ? parts.slice(1).join(':').trim() : '';

                  return (
                    <div
                      key={uniqueId}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/70 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900 leading-snug">
                            {title}
                          </span>
                          {detail && (
                            <span className="text-[11px] font-mono font-bold text-zinc-800 mt-0.5 select-all">
                              {detail}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyCode(detail || title, uniqueId)}
                          className="p-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-700 hover:text-zinc-950 shadow-2xs transition-colors"
                          title="Copiar item"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {onQueryRelatedPart && (
                          <button
                            onClick={() => onQueryRelatedPart(title)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-2xs"
                            title="Consultar este item no catálogo agora"
                          >
                            <Search className="w-3 h-3" />
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

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 5: IMAGEM DE REFERÊNCIA & CONFERÊNCIA VISUAL
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-zinc-800" />
                    5. IMAGEM DE REFERÊNCIA & CONFERÊNCIA VISUAL
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Inspeção na bancada: confira medidas, diâmetro, estrias e furação da peça antes de entregar
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-900 px-2.5 py-1 rounded border border-zinc-300 uppercase font-mono">
                Conferência de Bancada
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Card de Especificação Física */}
              <div className="lg:col-span-2 p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-zinc-700" />
                    Especificação Visual & Características da Peça:
                  </div>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    {result.visualInspection.description || `Peça automotiva com medidas, furação e encaixes originais para ${result.query.vehicle} ${result.query.year || ''}.`}
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                      Termo pronto para pesquisa de imagens:
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg border border-zinc-300 block select-all">
                      {cleanSearchTerm}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-zinc-200">
                  <button
                    onClick={() => setIsSchematicOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black shadow-xs transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Esquema Técnico com Medidas e Cotas</span>
                  </button>

                  <a
                    href={googleImagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-300 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Ver Fotos no Google</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>

                  <a
                    href={mercadoLivreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-300 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Mercado Livre</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>

              {/* Acesso rápido aos catálogos eletrônicos oficiais */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block mb-2">
                    Catálogos Oficiais das Fabricantes:
                  </span>
                  <div className="space-y-1.5">
                    {OFFICIAL_CATALOG_PORTALS.slice(0, 5).map((portal, pIdx) => (
                      <a
                        key={pIdx}
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-900 font-bold transition-colors group"
                      >
                        <span>{portal.brand}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900" />
                      </a>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">
                  Consulte aplicações detalhadas nos portais oficiais das marcas.
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 6: ONDE ENCONTRAR (se não tiver em loja - RIO CLARO / SP)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm">
                  6
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-zinc-800" />
                    6. ONDE ENCONTRAR (se não tiver em loja)
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Fornecedores e distribuidores em Rio Claro-SP para cotação e retirada imediata
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-900 px-2.5 py-1 rounded border border-zinc-300 uppercase font-mono">
                Rio Claro - SP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {RIO_CLARO_STORES.map((store, sIdx) => {
                const isCopied = copiedItem === `store-${sIdx}`;
                const encodedWhatsappMsg = encodeURIComponent(
                  `Olá, tudo bem? Gostaria de consultar a disponibilidade e valor da seguinte peça:\n\n*Peça:* ${result.query.part}\n*Veículo:* ${result.query.vehicle} ${result.query.year || ''}\n*Códigos:* ${result.codes.map((c) => `${c.brand} ${c.code}`).join(', ')}`
                );

                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/70 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-zinc-950">
                          {store.name}
                        </span>
                        <span className="text-[10px] font-bold bg-zinc-200 text-zinc-900 px-2 py-0.5 rounded border border-zinc-300">
                          {store.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span>{store.address}</span>
                      </div>

                      <p className="text-[11px] text-zinc-600 font-medium">
                        {store.notes}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200">
                      <a
                        href={`tel:${store.rawPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-100 text-xs font-bold shadow-2xs transition-colors"
                        title="Ligar agora"
                      >
                        <Phone className="w-3.5 h-3.5 text-zinc-700" />
                        <span>{store.phone}</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        {store.whatsapp && (
                          <a
                            href={`https://wa.me/${store.whatsapp}?text=${encodedWhatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors border border-emerald-900"
                            title="Chamar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleCopyCode(`${store.name}\nEnd: ${store.address}\nTel: ${store.phone}`, `store-${sIdx}`)}
                          className="p-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-600 hover:text-zinc-950 shadow-2xs transition-colors"
                          title="Copiar endereço e telefone"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RODAPÉ DE AÇÃO RÁPIDA: NOVA CONSULTA (ESC) */}
          {onNewQuery && (
            <div className="pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <RotateCcw className="w-4 h-4 text-zinc-700" />
                <span>Atendimento finalizado? Clique para limpar tudo e iniciar nova consulta de balcão.</span>
              </div>
              <button
                id="btn-result-bottom-new-query"
                onClick={onNewQuery}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                title="Limpar todos os campos e filtros para nova consulta"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nova Consulta (Limpar Balcão)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Esquema Técnico com Medidas e Cotas */}
      <TechnicalSchematicModal
        isOpen={isSchematicOpen}
        onClose={() => setIsSchematicOpen(false)}
        partName={result.query.part}
        vehicle={`${result.query.vehicle} ${result.query.year || ''}`.trim()}
      />
    </div>
  );
};
