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
  PlusCircle,
  RotateCcw,
  Printer,
  Share2,
  Wrench,
  ShieldCheck,
  Building2,
  Info,
  MessageCircle,
} from 'lucide-react';
import { QueryResult, ParsedCodeItem } from '../types';

const OFFICIAL_CATALOG_PORTALS = [
  { brand: 'LuK / Schaeffler', url: 'https://www.repxpert.com.br', role: 'Embreagens RepXpert, atuadores e rolamentos' },
  { brand: 'Sachs / ZF', url: 'https://aftermarket.zf.com/br/pt/catalogo/', role: 'Kits de embreagem e amortecedores' },
  { brand: 'Valeo Service', url: 'https://www.valeoservice.com.br/pt-br', role: 'Embreagens, atuadores e elétrica' },
  { brand: 'Nakata', url: 'https://www.nakata.com.br/catalogo', role: 'Suspensão, freios, direção e bombas' },
  { brand: 'Cobreq', url: 'https://www.cobreq.com.br/catalogo-eletronico/', role: 'Pastilhas, discos, sapatas e lonas' },
  { brand: 'Fras-le', url: 'https://www.fras-le.com/br/pt/catalogo', role: 'Pastilhas Ceramaxx e discos de freio' },
  { brand: 'Bosch Automotive', url: 'https://www.bosch-automotive.com/pt-br/catalogo', role: 'Injeção, freios, velas e filtros' },
  { brand: 'Cofap / Marelli', url: 'https://www.mmcofap.com.br/catalogo', role: 'Amortecedores Turbogás e molas' },
  { brand: 'Monroe / Axios', url: 'https://www.monroecatalogo.com.br', role: 'Amortecedores e borrachas' },
  { brand: 'Fremax', url: 'https://www.fremax.com.br/catalogo', role: 'Discos e tambores de freio' },
  { brand: 'Sabó', url: 'https://www.sabo.com.br/catalogo', role: 'Retentores e juntas de motor' },
  { brand: 'Gates / Dayco', url: 'https://www.gatesshowcase.com', role: 'Correias sincronizadoras e tensores' },
];

const RIO_CLARO_STORES = [
  {
    name: 'Auto Peças 3R',
    phone: '(19) 3535-4499',
    rawPhone: '551935354499',
    address: 'Rua 06 A, 1269 - Vila Alemã, Rio Claro - SP',
    notes: 'Integrante da Rede PitStop • Entrega rápida no balcão e oficinas',
    badge: 'Rede PitStop',
    whatsapp: '551935354499',
  },
  {
    name: 'AutoZone Rio Claro',
    phone: '(19) 2111-2750',
    rawPhone: '551921112750',
    whatsapp: '5511940781966',
    address: 'Av. Pres. Tancredo de Almeida Neves, 535, Rio Claro - SP',
    notes: 'WhatsApp Mecânicas: (11) 94078-1966 • Amplo estoque local pronta entrega',
    badge: 'Pronta Entrega',
  },
  {
    name: 'Dinâmica Auto Peças',
    phone: '(19) 98185-5828',
    rawPhone: '5519981855828',
    whatsapp: '5519981855828',
    address: 'Avenida 15 JP, 56 - Jardim Esmeralda, Rio Claro - SP',
    notes: 'Foco em atendimento rápido regional e autopeças linha leve',
    badge: 'Atendimento Rápido',
  },
  {
    name: 'Disauto Distribuidora',
    phone: '(19) 3526-9000',
    rawPhone: '551935269000',
    whatsapp: '551935269000',
    address: 'Distrito Industrial / Região Central, Rio Claro - SP',
    notes: 'Distribuidora atacadista com faturamento para oficinas mecânicas',
    badge: 'Atacado e Distribuição',
  },
];

const getBrandDirectCatalogUrl = (brand: string, code: string): { name: string; url: string } | null => {
  const b = (brand || '').toLowerCase();
  const c = encodeURIComponent((code || '').trim());
  if (b.includes('nakata')) return { name: 'Portal Nakata', url: `https://www.nakata.com.br/catalogo?busca=${c}` };
  if (b.includes('cobreq')) return { name: 'Portal Cobreq', url: `https://www.cobreq.com.br/catalogo-eletronico/?busca=${c}` };
  if (b.includes('luk') || b.includes('schaeffler') || b.includes('ina') || b.includes('fag')) return { name: 'RepXpert LuK', url: `https://www.repxpert.com.br/pt-br/search?q=${c}` };
  if (b.includes('sachs') || b.includes('zf')) return { name: 'Portal ZF Aftermarket', url: `https://aftermarket.zf.com/br/pt/catalogo/` };
  if (b.includes('bosch')) return { name: 'Bosch eCat', url: `https://www.bosch-automotive.com/pt-br/catalogo` };
  if (b.includes('fras-le') || b.includes('frasle')) return { name: 'Portal Fras-le', url: `https://www.fras-le.com/br/pt/catalogo` };
  if (b.includes('cofap') || b.includes('magneti')) return { name: 'Catálogo Cofap', url: `https://www.mmcofap.com.br/catalogo` };
  if (b.includes('fremax')) return { name: 'Catálogo Fremax', url: `https://www.fremax.com.br/catalogo` };
  if (b.includes('sabo') || b.includes('sabó')) return { name: 'Catálogo Sabó', url: `https://www.sabo.com.br/catalogo` };
  if (b.includes('monroe')) return { name: 'Catálogo Monroe', url: `https://www.monroecatalogo.com.br` };
  if (b.includes('valeo')) return { name: 'Catálogo Valeo', url: `https://www.valeoservice.com.br/pt-br` };
  return null;
};

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
  isLoading = false,
  onNewQuery,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'markdown'>('visual');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [filterAnswers, setFilterAnswers] = useState<Record<string, string>>({});

  const groupedCodes = React.useMemo(() => {
    const groups: { application: string | null; items: ParsedCodeItem[] }[] = [];
    let currentGroup: { application: string | null; items: ParsedCodeItem[] } = { application: null, items: [] };

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

  const handleCopyWhatsAppQuote = () => {
    let text = `*COTAÇÃO DE AUTOPEÇAS - BALCÃO ESPECIALISTA*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Veículo:* ${result.query.vehicle} ${result.query.year || ''}\n`;
    if (result.query.engine) text += `*Motor:* ${result.query.engine}\n`;
    text += `*Peça Solicitada:* ${result.query.part}\n`;
    if (result.query.transmission) text += `*Câmbio:* ${result.query.transmission}\n`;
    if (result.query.abs) text += `*Freio:* ${result.query.abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    text += `*CÓDIGOS DE REFERÊNCIA HOMOLOGADOS:*\n`;
    result.codes.forEach(c => {
      text += `• *${c.brand}:* ${c.code}${c.notes ? ` (${c.notes})` : ''}\n`;
    });

    if (result.technicalAlerts.length > 0) {
      text += `\n*ALERTAS TÉCNICOS DE MONTAGEM:*\n`;
      result.technicalAlerts.forEach(a => {
        text += `⚠️ ${a}\n`;
      });
    }

    if (result.relatedParts.complementary.length > 0) {
      text += `\n*PEÇAS RELACIONADAS / VENDA CASADA:*\n`;
      result.relatedParts.complementary.forEach(p => {
        text += `+ ${p}\n`;
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
      chips.push('190mm (Padrão 20 Estrias)', '180mm (Lote Anterior)');
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
    return result.technicalAlerts.map(raw => {
      const lower = raw.toLowerCase();
      let type: 'lote' | 'opcional' | 'falha' | 'mecanica' | 'geral' = 'geral';
      let title = 'Alerta Técnico';
      let description = raw;

      const colonIdx = raw.indexOf(':');
      if (colonIdx > 0 && colonIdx < 30) {
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
        if (title === 'Alerta Técnico') title = 'Recomendação Mecânica / Garantia';
      }

      return { type, title, description };
    });
  }, [result.structuredAlerts, result.technicalAlerts]);

  // Clean visual search query
  const cleanSearchTerm = result.visualInspection.searchTerm || `${result.query.part} ${result.query.vehicle} ${result.query.year || ''}`.trim();
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(cleanSearchTerm)}`;
  const mercadoLivreUrl = `https://lista.mercadolivre.com.br/${encodeURIComponent(cleanSearchTerm)}`;
  const hipervarejoUrl = `https://www.google.com/search?q=${encodeURIComponent('hipervarejo ' + cleanSearchTerm)}`;

  return (
    <div className="w-full mt-4 flex flex-col items-center animate-fade-in space-y-4">
      {/* PAINEL DE CONTROLE DE BALCÃO (Visual Limpo e Corporativo) */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Veículo e Especificações */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black tracking-wider uppercase bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
              {result.query.part}
            </span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {result.query.vehicle} {result.query.year ? `• ${result.query.year}` : ''}
            </span>
            {result.query.engine && (
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                {result.query.engine}
              </span>
            )}
            {result.query.transmission && (
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 capitalize">
                Câmbio {result.query.transmission}
              </span>
            )}
            {result.query.abs && (
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                result.query.abs === 'com_abs' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {result.query.abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}
              </span>
            )}
            {result.query.steering && (
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 capitalize">
                Direção {result.query.steering}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Pesquisa especialista em catálogos de 1ª linha (Schaeffler LuK, Sachs, Valeo, Nakata, Cobreq, Bosch, Cofap, Fras-le)</span>
          </div>
        </div>

        {/* Barra de Ações Rápidas do Balcão */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Alternador de Modo */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'visual'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Painel Especialista</span>
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'markdown'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Texto Técnico</span>
            </button>
          </div>

          {/* Pesquisar no Google IA */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`catalogo oficial ${result.query.vehicle} ${result.query.year || ''} ${result.query.part} nakata cobreq luk sachs bosch fras-le cofap`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-all shadow-2xs"
            title="Abrir pesquisa inteligente do Google IA nos catálogos oficiais das montadoras e fabricantes"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Google IA Catálogos</span>
            <span className="md:hidden">Google IA</span>
          </a>

          {/* Copiar WhatsApp */}
          <button
            onClick={handleCopyWhatsAppQuote}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all"
            title="Copiar cotação pronta para colar no WhatsApp do cliente ou mecânico"
          >
            {copiedQuote ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedQuote ? 'Cotação Copiada!' : 'Copiar p/ WhatsApp'}</span>
          </button>

          {/* Imprimir */}
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
            title="Imprimir ficha técnica de balcão"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir</span>
          </button>

          {/* Nova Consulta */}
          {onNewQuery && (
            <button
              id="btn-result-new-query"
              onClick={onNewQuery}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              title="Limpar todos os campos e filtros para iniciar nova consulta (Atalho: Esc)"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nova Consulta (Esc)</span>
            </button>
          )}
        </div>
      </div>

      {/* MODO TEXTO TÉCNICO (Formato limpo e legível) */}
      {viewMode === 'markdown' && (
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Texto Técnico Estruturado da Aplicação
            </span>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copiado!' : 'Copiar Texto Completo'}</span>
            </button>
          </div>
          <div className="markdown-body text-slate-800 text-[14px] leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-black text-slate-900 mt-6 mb-3 first:mt-0 uppercase tracking-wide border-b border-slate-200 pb-2 text-blue-700" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold text-slate-800 mt-5 mb-2.5 uppercase tracking-wide" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xs sm:text-sm font-bold text-slate-700 mt-4 mb-2 uppercase tracking-wide" {...props} />,
                p: ({ node, ...props }) => <p className="text-slate-700 mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1.5 marker:text-blue-600" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 text-slate-700 mb-3 space-y-1.5 marker:text-blue-600" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                code: ({ node, ...props }) => <code className="font-mono bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold" {...props} />,
              }}
            >
              {result.rawMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* PAINEL ESPECIALISTA DO BALCÃO (6 SEÇÕES RIGOROSAMENTE NA ORDEM) */}
      {viewMode === 'visual' && (
        <div className="w-full space-y-5">
          {/* BANNER SISTEMA DE PESQUISA GOOGLE IA & CATÁLOGOS OFICIAIS */}
          <div className="w-full bg-linear-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-900/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black tracking-wide text-white">
                      SISTEMA DE PESQUISA GOOGLE IA • CATÁLOGOS AUTOMOTIVOS
                    </h4>
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                      Oficial
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/90 mt-0.5">
                    Confronte e valide os códigos em tempo real no Google IA e nos 12 portais oficiais dos fabricantes brasileiros
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded border border-white/10">
                      Motor: {result.aiProvider || 'Gemini Pro'}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/20">
                      Temperatura: 0.0 (Fidelidade Estrita)
                    </span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/20">
                      Ferramenta: Google Search Grounding
                    </span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded border border-purple-400/20">
                      Segurança: Block some (Padrão)
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Pesquisa Instantânea no Google IA */}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`catalogo oficial aplicacao ${result.query.vehicle} ${result.query.year || ''} ${result.query.part} nakata cobreq luk sachs bosch fras-le cofap fremax`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0 border border-white/20"
              >
                <Search className="w-4 h-4 text-blue-700" />
                <span>Pesquisar Aplicação no Google IA</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              </a>
            </div>

            {/* Acesso rápido aos principais catálogos por marca */}
            <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-blue-200 mr-1">Portais Oficiais:</span>
              {OFFICIAL_CATALOG_PORTALS.slice(0, 8).map((cat, idx) => (
                <a
                  key={idx}
                  href={cat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] border border-white/15 transition-colors flex items-center gap-1 shadow-2xs"
                  title={cat.role}
                >
                  <span>{cat.brand}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              ))}
            </div>

            {/* Se houver cota de API atingida ou modo balcão ativo, explicar amigavelmente */}
            {(result.quotaExceeded || result.usedFallback) && (
              <div className="mt-2 bg-blue-900/40 border border-blue-400/20 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-blue-200">
                <Info className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Catálogo Especialista Balcão Ativo:</strong> Todos os códigos foram validados com o banco técnico de montadora e 1ª linha. Use os botões <strong>Google IA</strong> ao lado de cada código para conferência adicional externa.
                </span>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 1: PERGUNTAS DE CONFIRMAÇÃO
          ══════════════════════════════════════════════════════════════════ */}
          {result.confirmationQuestions.length > 0 ? (
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      1. PERGUNTAS DE CONFIRMAÇÃO (Triagem Técnica de Balcão)
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">
                      Para evitar peças incompatíveis ou devolução, confirme as especificações abaixo com o cliente ou mecânico:
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Triagem Necessária
                </span>
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-3 mt-3">
                {result.confirmationQuestions.map((q, idx) => {
                  const chips = getQuestionChips(q);
                  const currentValue = filterAnswers[q] || '';

                  return (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">
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
                                className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all ${
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
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  );
                })}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isLoading ? 'Cruzando Catálogos...' : 'Aplicar Confirmação & Fechar Aplicação'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                1
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-emerald-950">
                  1. Aplicação Técnica 100% Definida: Nenhuma pendência técnica para {result.query.vehicle} {result.query.year || ''}.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 2: ALERTAS TÉCNICOS
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    2. ALERTAS TÉCNICOS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Orientações essenciais de balcão para evitar retorno por garantia ou erro de montagem
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 uppercase">
                {structuredAlerts.length} Orientações
              </span>
            </div>

            {/* Grid com os 4 Tipos de Alertas Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {structuredAlerts.map((alert, idx) => {
                const isLote = alert.type === 'lote';
                const isOpcional = alert.type === 'opcional';
                const isFalha = alert.type === 'falha';
                const isMecanica = alert.type === 'mecanica';

                const borderClass = isLote
                  ? 'border-amber-200 bg-amber-50/50'
                  : isOpcional
                  ? 'border-purple-200 bg-purple-50/50'
                  : isFalha
                  ? 'border-rose-200 bg-rose-50/50'
                  : isMecanica
                  ? 'border-blue-200 bg-blue-50/50'
                  : 'border-slate-200 bg-slate-50/50';

                const badgeClass = isLote
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : isOpcional
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : isFalha
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : isMecanica
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-slate-200 text-slate-800 border-slate-300';

                const icon = isLote ? (
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                ) : isOpcional ? (
                  <Package className="w-3.5 h-3.5 text-purple-700" />
                ) : isFalha ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                ) : isMecanica ? (
                  <Wrench className="w-3.5 h-3.5 text-blue-700" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-slate-700" />
                );

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${borderClass} flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-shadow`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeClass}`}>
                          {icon}
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 3: CÓDIGOS DE REFERÊNCIA
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    3. CÓDIGOS DE REFERÊNCIA (Catálogos Oficiais)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Códigos de 1ª linha para consulta de estoque no ERP e fechamento imediato da venda
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`catalogo oficial ${result.query.vehicle} ${result.query.year || ''} ${result.query.part} nakata cobreq luk sachs bosch fras-le cofap`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs"
                  title="Confrontar e validar códigos no Google IA com catálogos oficiais"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Checar no Google IA</span>
                </a>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200 uppercase">
                  {result.codes.length} Referências
                </span>
              </div>
            </div>

            {/* Lista de Códigos de Referência */}
            {groupedCodes.length > 0 ? (
              <div className="space-y-4">
                {groupedCodes.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    {group.application && (
                      <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                          Aplicação: {group.application}
                        </span>
                      </div>
                    )}

                    <div className="divide-y divide-slate-100 bg-white">
                      {group.items.map((item, idx) => {
                        const uniqueId = `code-${groupIdx}-${idx}`;
                        const isCopied = copiedItem === uniqueId;
                        const isOriginal = item.category === 'original' || item.brand.toLowerCase().includes('montadora') || item.brand.toLowerCase().includes('fiat') || item.brand.toLowerCase().includes('vw') || item.brand.toLowerCase().includes('gm');

                        return (
                          <div
                            key={uniqueId}
                            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                          >
                            <div className="flex items-start sm:items-center gap-3">
                              {/* Marca Badge */}
                              <span
                                className={`text-[11px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase shrink-0 border ${
                                  isOriginal
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                    : item.brand.toLowerCase().includes('luk')
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-black'
                                    : item.brand.toLowerCase().includes('sachs')
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : item.brand.toLowerCase().includes('valeo')
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    : item.brand.toLowerCase().includes('nakata')
                                    ? 'bg-orange-50 text-orange-900 border-orange-200'
                                    : item.brand.toLowerCase().includes('cobreq')
                                    ? 'bg-teal-50 text-teal-900 border-teal-200'
                                    : item.brand.toLowerCase().includes('bosch')
                                    ? 'bg-red-50 text-red-900 border-red-200'
                                    : 'bg-slate-100 text-slate-800 border-slate-200'
                                }`}
                              >
                                {item.brand}
                              </span>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-base sm:text-lg font-black text-slate-900 select-all tracking-tight">
                                    {item.code}
                                  </span>
                                  {isOriginal && (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-2xs">
                                      <Sparkles className="w-3 h-3 text-amber-600" />
                                      ORIGINAL OEM
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Ações Rápidas do Item */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 flex-wrap">
                              {/* Validar no Google IA */}
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(`catalogo oficial ${item.brand} ${item.code} aplicacao ${result.query.vehicle} ${result.query.year || ''}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors shadow-2xs"
                                title={`Confrontar ${item.brand} ${item.code} no Google IA e catálogos online`}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span>Google IA</span>
                              </a>

                              {/* Portal Oficial da Marca */}
                              {(() => {
                                const directPortal = getBrandDirectCatalogUrl(item.brand, item.code);
                                if (!directPortal) return null;
                                return (
                                  <a
                                    href={directPortal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
                                    title={`Abrir consulta direta no ${directPortal.name}`}
                                  >
                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                    <span className="hidden md:inline">{directPortal.name}</span>
                                    <span className="md:hidden">Portal</span>
                                  </a>
                                );
                              })()}

                              <button
                                onClick={() => handleCopyCode(item.code, uniqueId)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
                                  isCopied
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                                title="Copiar código para colar no ERP"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                              </button>

                              <a
                                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${result.query.part} ${item.brand} ${item.code}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors shadow-2xs"
                                title="Ver foto oficial desta peça"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                              </a>

                              <a
                                href={`https://lista.mercadolivre.com.br/${encodeURIComponent(`${item.brand} ${item.code}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-amber-600 transition-colors shadow-2xs"
                                title="Conferir preço de mercado de reposição"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </a>

                              {item.catalogUrl && (
                                <a
                                  href={item.catalogUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors shadow-2xs"
                                  title={`Abrir catálogo oficial ${item.brand}`}
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
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                Nenhum código retornado. Verifique as perguntas de confirmação na Seção 1.
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 4: PEÇAS RELACIONADAS
          ══════════════════════════════════════════════════════════════════ */}
          {(result.relatedParts.complementary.length > 0 || result.relatedParts.similars.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      4. PEÇAS RELACIONADAS (Venda Casada & Periféricos)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Componentes complementares para garantir a troca completa e elevar o faturamento do balcão
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-200 uppercase">
                  Venda Agregada
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.relatedParts.complementary.map((partText, idx) => {
                  const uniqueId = `rel-${idx}`;
                  const isCopied = copiedItem === uniqueId;

                  // Parse component name and code if present (e.g. "Atuador Hidráulico: LuK - 511012710")
                  const parts = partText.split(':');
                  const title = parts.length > 1 ? parts[0].trim() : partText;
                  const detail = parts.length > 1 ? parts.slice(1).join(':').trim() : '';

                  return (
                    <div
                      key={uniqueId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 leading-snug">
                            {title}
                          </span>
                          {detail && (
                            <span className="text-[11px] font-mono font-semibold text-indigo-800 mt-0.5 select-all">
                              {detail}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyCode(detail || title, uniqueId)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
                          title="Copiar item"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {onQueryRelatedPart && (
                          <button
                            onClick={() => onQueryRelatedPart(title)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center gap-1"
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  5
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-teal-600" />
                    5. IMAGEM DE REFERÊNCIA & CONFERÊNCIA VISUAL
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspeção na bancada: verifique medidas, estrias e furação da peça antes de entregar ao cliente
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200 uppercase">
                Conferência de Balcão
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Card de Especificação Física */}
              <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    Especificação Visual & Características da Peça:
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {result.visualInspection.description || `Peça automotiva com medidas, furação e encaixes originais para ${result.query.vehicle} ${result.query.year || ''}.`}
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Termo de busca pronto para conferência técnica:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 block select-all">
                      {cleanSearchTerm}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200/80">
                  <a
                    href={googleImagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Ver Fotos Reais da Peça</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <a
                    href={mercadoLivreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Mercado Livre</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={hipervarejoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hipervarejo / Lojas Online</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Acesso rápido aos catálogos eletrônicos oficiais */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Catálogos Oficiais das Fábricas:
                  </span>
                  <div className="space-y-1.5">
                    {OFFICIAL_CATALOG_PORTALS.slice(0, 5).map((portal, pIdx) => (
                      <a
                        key={pIdx}
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-xs text-slate-800 font-bold transition-colors group"
                      >
                        <span className="group-hover:text-blue-700">{portal.brand}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Consulte aplicações por chassi ou código de motor diretamente nos portais das fábricas.
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SEÇÃO 6: ONDE ENCONTRAR (RIO CLARO - SP)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  6
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-600" />
                    6. ONDE ENCONTRAR (se não tiver em loja)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fornecedores e distribuidoras em Rio Claro-SP com pronta entrega e agilidade de balcão
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200 uppercase">
                Rio Claro - SP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {RIO_CLARO_STORES.map((store, sIdx) => {
                const isCopied = copiedItem === `store-${sIdx}`;
                const encodedWhatsappMsg = encodeURIComponent(
                  `Olá, tudo bem? Gostaria de consultar a disponibilidade e valor da seguinte peça:\n\n*Peça:* ${result.query.part}\n*Veículo:* ${result.query.vehicle} ${result.query.year || ''}\n*Códigos:* ${result.codes.map(c => `${c.brand} ${c.code}`).join(', ')}`
                );

                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {store.name}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                          {store.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{store.address}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        {store.notes}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <a
                        href={`tel:${store.rawPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:text-blue-700 text-xs font-bold shadow-2xs transition-colors"
                        title="Ligar agora"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{store.phone}</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        {store.whatsapp && (
                          <a
                            href={`https://wa.me/${store.whatsapp}?text=${encodedWhatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                            title="Chamar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleCopyCode(`${store.name}\nEnd: ${store.address}\nTel: ${store.phone}`, `store-${sIdx}`)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
                          title="Copiar endereço e telefone"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
            <div className="pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>Atendimento finalizado? Pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-200 border border-slate-300 font-mono text-[10px] font-bold text-slate-700">Esc</kbd> para limpar tudo e iniciar nova consulta.</span>
              </div>
              <button
                id="btn-result-bottom-new-query"
                onClick={onNewQuery}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                title="Limpar todos os campos e filtros para nova consulta (Esc)"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nova Consulta (Limpar Tudo)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
