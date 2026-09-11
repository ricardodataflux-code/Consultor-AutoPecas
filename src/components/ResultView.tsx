import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  HelpCircle,
  Hash,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Printer,
  FileCode,
  Send,
  Eye,
  PlusCircle,
  Truck,
  Building2,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { QueryResult } from '../types';
import { formatWhatsAppBudget } from '../utils/parser';

interface ResultViewProps {
  result: QueryResult;
  onAnswerConfirmations: (answers: Record<string, string>) => void;
  onQueryRelatedPart: (partName: string) => void;
  isLoading: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onAnswerConfirmations,
  onQueryRelatedPart,
  isLoading,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'markdown'>('cards');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopyWhatsApp = () => {
    const text = formatWhatsAppBudget(result);
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswerConfirmations(answerInputs);
  };

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    result.visualInspection.searchTerm || `${result.query.part} ${result.query.vehicle}`
  )}`;

  return (
    <div className="space-y-4 print:space-y-2">
      {/* Top Action Bar for Balconista */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md print:hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
              Consulta Ativa no Balcão
            </span>
            {result.quotaExceeded ? (
              <span
                id="badge-quota-notice"
                className="text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs"
                title="Cota da API externa em resfriamento. Catálogo técnico do balcão e links oficiais em operação normal."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Catálogo Técnico Balcão (Cota API em espera)
              </span>
            ) : result.usedFallback ? (
              <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Catálogo Técnico Balcão Offline
              </span>
            ) : (
              <span className="text-[11px] font-bold bg-blue-900/90 text-blue-200 border border-blue-600 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Pesquisa por IA em Catálogos Online
              </span>
            )}
            <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Catálogos Oficiais Atualizados
            </span>
          </div>
          <div className="text-base font-bold flex items-center gap-2 text-white">
            <span className="text-blue-400">{result.query.part}</span>
            <span className="text-slate-500">|</span>
            <span>
              {result.query.vehicle} {result.query.year || ''}
            </span>
            {result.query.engine && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                {result.query.engine}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* WhatsApp Quote Share */}
          <button
            id="btn-copy-whatsapp"
            type="button"
            onClick={handleCopyWhatsApp}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Copiar mensagem pronta para enviar no WhatsApp do cliente"
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado para WhatsApp!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar Orçamento WhatsApp</span>
              </>
            )}
          </button>

          {/* Print / Separation Sheet */}
          <button
            id="btn-print-sheet"
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Imprimir ficha de separação para o estoque"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Ficha Balcão</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Painel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('markdown')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'markdown'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Texto Markdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* Raw Markdown view if selected */}
      {viewMode === 'markdown' ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="markdown-body prose max-w-none text-slate-800 text-sm leading-relaxed">
            <ReactMarkdown>{result.rawMarkdown}</ReactMarkdown>
          </div>
        </div>
      ) : (
        /* Structured Senior Clerk Cards Layout */
        <div className="space-y-4">
          {/* PAINEL DE CATÁLOGOS ONLINE CONSULTADOS PELA IA */}
          <div
            id="panel-online-catalogs"
            className="bg-linear-to-r from-blue-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-blue-800/80"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Catálogos Online Oficiais dos Fabricantes
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Consulta por IA Ativa
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    A IA consulta as bases eletrônicas atualizadas dos fabricantes. Clique no catálogo para abrir a ficha técnica oficial do fabricante:
                  </p>
                </div>
              </div>
            </div>

            {/* Manufacturer Portal Buttons */}
            {result.officialCatalogs && result.officialCatalogs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.officialCatalogs.map((portal, pIdx) => (
                  <a
                    key={pIdx}
                    href={portal.searchUrl || portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 rounded-lg text-xs font-semibold text-slate-100 hover:text-white transition-all group shadow-2xs"
                    title={`Abrir consulta online oficial no ${portal.name}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white shrink-0" />
                    <span>{portal.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 1. PERGUNTAS DE CONFIRMAÇÃO (TRIAGEM) */}
          {result.confirmationQuestions && result.confirmationQuestions.length > 0 && (
            <div
              id="card-confirmation-questions"
              className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-5 shadow-sm animate-pulse-border"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide flex items-center gap-2">
                      1. Perguntas de Confirmação (Regra de Triagem)
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold">
                        Ação Necessária
                      </span>
                    </h3>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Para não errar a aplicação, confirme com o cliente antes de entregar a peça no balcão:
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-3 mt-3">
                <div className="space-y-2">
                  {result.confirmationQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 p-3 rounded-lg border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="text-xs font-semibold text-slate-800 flex-1">
                        • {q}
                      </span>
                      <input
                        type="text"
                        placeholder="Resposta do cliente (ex: 1.4 Flex, Com ABS, LD)..."
                        value={answerInputs[q] || ''}
                        onChange={(e) =>
                          setAnswerInputs({
                            ...answerInputs,
                            [q]: e.target.value,
                          })
                        }
                        className="text-xs px-3 py-1.5 bg-amber-50/50 border border-amber-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 w-full sm:w-64"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmar Respostas & Atualizar Códigos Exatos</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. CÓDIGOS DE REFERÊNCIA */}
          <div
            id="card-reference-codes"
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 flex-wrap">
                    <span>2. Códigos de Referência (Montadora & Catálogos Fabricantes)</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 normal-case">
                      Catálogos Online Atualizados
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Referências pesquisadas e validadas nos catálogos oficiais dos fabricantes. Clique para copiar ou conferir online.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium self-start sm:self-auto">
                {result.codes.length} marcas/códigos listados
              </div>
            </div>

            {result.codes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {result.codes.map((item, idx) => {
                  const isCopied = copiedText === item.code;
                  const isOriginal = item.category === 'original';
                  const isWarning = item.category === 'warning';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isOriginal
                          ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/30'
                          : isWarning
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black uppercase tracking-wider ${
                              isOriginal
                                ? 'text-blue-900'
                                : isWarning
                                ? 'text-amber-900'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.brand}
                          </span>
                          {isOriginal && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-600 text-white uppercase">
                              OEM / Montadora
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.code, item.code)}
                          className="p-1 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 transition-colors shrink-0 shadow-2xs"
                          title="Copiar código"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="font-mono text-xs font-bold text-slate-900 break-all select-all flex items-center justify-between">
                        <span>{item.code}</span>
                      </div>

                      {/* Direct link to manufacturer online catalog */}
                      <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-200/70 text-[10px]">
                        <span className="text-slate-500 truncate max-w-[130px]" title={item.catalogName}>
                          {item.catalogName || 'Catálogo Oficial'}
                        </span>
                        {item.catalogUrl && (
                          <a
                            href={item.catalogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline shrink-0"
                            title={`Abrir catálogo oficial de ${item.brand}`}
                          >
                            <span>Checar Catálogo</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Official Manufacturer Catalog Portals */}
              {result.officialCatalogs && result.officialCatalogs.length > 0 && (
                <div className="mt-4 p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Catálogos Online Oficiais dos Fabricantes</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      Links Oficiais Diretos
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-tight">
                    Acesse o catálogo eletrônico oficial de cada fabricante para confirmar dimensões, fichas técnicas e lotes de fabricação em tempo real:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.officialCatalogs.map((portal, pIdx) => (
                      <a
                        key={pIdx}
                        href={portal.searchUrl || portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-blue-200 hover:border-blue-400 rounded-lg text-xs font-bold text-blue-950 hover:text-blue-700 shadow-2xs hover:shadow-xs transition-all"
                        title={`Abrir portal ${portal.name}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{portal.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Online Grounding Sources if available */}
              {result.verifiedSources && result.verifiedSources.length > 0 && (
                <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700 shrink-0">Bases Online Consultadas:</span>
                  {result.verifiedSources.slice(0, 5).map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium"
                    >
                      <span className="truncate max-w-[180px]">{src.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </>
            ) : (
              <div className="text-xs text-slate-500 py-3 italic">
                Nenhum código explícito detectado. Verifique o modo markdown completo.
              </div>
            )}
          </div>

          {/* 3. ALERTAS TÉCNICOS */}
          {result.technicalAlerts && result.technicalAlerts.length > 0 && (
            <div
              id="card-technical-alerts"
              className="bg-rose-50/80 border border-rose-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                    3. Alertas Técnicos de Aplicação & Instalação
                  </h3>
                  <p className="text-xs text-rose-800">
                    Avisos cruciais para orientar o mecânico ou cliente no balcão e evitar devoluções:
                  </p>
                </div>
              </div>

              <ul className="space-y-1.5">
                {result.technicalAlerts.map((alert, idx) => (
                  <li
                    key={idx}
                    className="text-xs font-medium text-rose-900 bg-white/70 p-2 rounded-lg border border-rose-200 flex items-start gap-2"
                  >
                    <span className="text-rose-600 font-bold shrink-0">⚠️</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. PEÇAS RELACIONADAS (VENDA CASADA NO BALCÃO) */}
          <div
            id="card-related-parts"
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  4. Peças Relacionadas & Oportunidade de Venda
                </h3>
                <p className="text-xs text-slate-500">
                  Aumente o ticket médio do balcão sugerindo peças complementares trocadas junto.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Similares */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Similares (Outras Marcas / 1ª e 2ª Linha)
                </div>
                {result.relatedParts.similars.length > 0 ? (
                  <ul className="space-y-1.5">
                    {result.relatedParts.similars.map((sim, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-center justify-between"
                      >
                        <span>{sim}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">Consulte outras marcas no catálogo de marcas.</p>
                )}
              </div>

              {/* Complementares */}
              <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200">
                <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Peças Complementares (Trocar Junto)
                </div>
                {result.relatedParts.complementary.length > 0 ? (
                  <ul className="space-y-1.5">
                    {result.relatedParts.complementary.map((comp, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-emerald-900 bg-white p-2 rounded border border-emerald-200 flex items-center justify-between gap-2"
                      >
                        <span className="font-medium">• {comp}</span>
                        <button
                          type="button"
                          onClick={() => onQueryRelatedPart(comp)}
                          className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold shrink-0 transition-colors"
                          title="Consultar esta peça agora"
                        >
                          Consultar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 italic">Nenhuma peça complementar listada.</p>
                )}
              </div>
            </div>
          </div>

          {/* 5. IMAGEM DE REFERÊNCIA & APOIO VISUAL */}
          <div
            id="card-visual-reference"
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    5. Imagem de Referência & Apoio Visual no Balcão
                  </h3>
                  <p className="text-xs text-slate-500">
                    Termo pronto para Google Imagens e conferência física de formato e fixações.
                  </p>
                </div>
              </div>

              <a
                href={googleImagesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto"
              >
                <span>Abrir Fotos no Google Imagens</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3">
              {/* Search term box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Termo de Busca Direto:
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    "{result.visualInspection.searchTerm}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      result.visualInspection.searchTerm,
                      result.visualInspection.searchTerm
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-700 font-medium flex items-center gap-1 self-start sm:self-auto"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Termo</span>
                </button>
              </div>

              {/* Physical shape description */}
              {result.visualInspection.description && (
                <div className="p-3.5 bg-cyan-50/50 rounded-lg border border-cyan-200 text-xs text-slate-800 leading-relaxed">
                  <span className="font-bold text-cyan-950 block mb-1">
                    Características Físicas de Apoio (Conferência com a peça velha):
                  </span>
                  <p className="whitespace-pre-line text-slate-700">
                    {result.visualInspection.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 6. ONDE ENCONTRAR (RIO CLARO - SP) */}
          <div
            id="card-suppliers-rioclaro"
            className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-emerald-200/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                    6. Onde Encontrar em Rio Claro - SP
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-700 text-white uppercase">
                      Entrega Rápida Local
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-900">
                    Distribuidoras e atacadistas de autopeças sediadas ou com rota expressa diária em Rio Claro-SP:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.suppliersRioClaro.map((sup, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {sup}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Rio Claro - SP • Pronta Entrega / Motoboy
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(sup, sup)}
                    className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                    title="Copiar fornecedor"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
