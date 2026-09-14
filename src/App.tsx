import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryForm } from './components/QueryForm';
import { ResultView } from './components/ResultView';
import { BrandsModal } from './components/BrandsModal';
import { SuppliersModal } from './components/SuppliersModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { QueryParams, QueryResult } from './types';
import { parseSeniorClerkMarkdown } from './utils/parser';
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'auto_pecas_balcao_history_v1';

export default function App() {
  const [activeParams, setActiveParams] = useState<QueryParams | null>(null);
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Consultando catálogos...');
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [isBrandsModalOpen, setIsBrandsModalOpen] = useState(false);
  const [isSuppliersModalOpen, setIsSuppliersModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // History
  const [history, setHistory] = useState<QueryResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.error('Falha ao salvar histórico:', e);
    }
  }, [history]);

  // Loading message animator
  useEffect(() => {
    if (!isLoading) return;
    const messages = [
      'IA consultando os catálogos eletrônicos oficiais online...',
      'Cruzando catálogos dos fabricantes (Nakata, COFAP, Monroe, Bosch, LUK, Cobreq)...',
      'Identificando aplicação técnica, motorização e código original (OEM)...',
      'Localizando códigos exatos de reposição e referências cruzadas...',
      'Verificando alertas de montagem, pares e fornecedores em Rio Claro-SP...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingMessage(messages[idx]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Keyboard shortcut listener (Esc for clean new query / close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isBrandsModalOpen) setIsBrandsModalOpen(false);
        else if (isSuppliersModalOpen) setIsSuppliersModalOpen(false);
        else if (isHistoryDrawerOpen) setIsHistoryDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBrandsModalOpen, isSuppliersModalOpen, isHistoryDrawerOpen]);

  const executeQuery = async (params: QueryParams, answers?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    setActiveParams(params);

    try {
      const response = await fetch('/api/query-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: params.vehicle,
          year: params.year,
          part: params.part,
          engine: params.engine,
          notes: params.notes,
          answers: answers || params.answers,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      const parsedResult = parseSeniorClerkMarkdown(data.markdown, {
        ...params,
        answers: answers || params.answers,
      });

      if (data.verifiedSources && data.verifiedSources.length > 0) {
        parsedResult.verifiedSources = data.verifiedSources;
      }
      parsedResult.usedFallback = data.usedFallback;
      parsedResult.quotaExceeded = data.quotaExceeded;

      setActiveResult(parsedResult);

      // Add to history
      setHistory((prev) => [
        parsedResult,
        ...prev.filter((item) => item.id !== parsedResult.id),
      ]);

      // Scroll to result smoothly
      setTimeout(() => {
        const el = document.getElementById('card-reference-codes') || document.getElementById('card-confirmation-questions');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Erro na requisição:', err);
      setError(
        err.message ||
          'Não foi possível consultar os catálogos no momento. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (params: QueryParams) => {
    executeQuery(params);
  };

  const handleAnswerConfirmations = (answers: Record<string, string>) => {
    if (!activeParams) return;
    executeQuery(activeParams, answers);
  };

  const handleQueryRelatedPart = (partName: string) => {
    if (!activeParams) return;
    const updated: QueryParams = {
      ...activeParams,
      part: partName,
      answers: undefined,
    };
    executeQuery(updated);
  };

  const handleNewQuery = () => {
    setActiveResult(null);
    setActiveParams(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (result: QueryResult) => {
    setActiveParams(result.query);
    setActiveResult(result);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        onNewQuery={handleNewQuery}
        onOpenBrands={() => setIsBrandsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Alert if any */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">Atenção no Balcão</h4>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 underline"
            >
              Dispensar
            </button>
          </div>
        )}

        {/* Query Input Section */}
        <section id="section-query-form">
          <QueryForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            initialParams={activeParams || undefined}
          />
        </section>

        {/* Loading Banner with real steps */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center" />
              <RefreshCw className="w-5 h-5 text-blue-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Processando Triagem de Balcão & Telefone
              </h3>
              <p className="text-xs text-blue-600 font-medium mt-1 animate-fadeIn">
                {loadingMessage}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Balconista Sênior</span>
              <span>•</span>
              <span>Catálogos TecDoc / SBS</span>
              <span>•</span>
              <span>Fornecedores Rio Claro - SP</span>
            </div>
          </div>
        )}

        {/* Active Result View */}
        {activeResult && !isLoading && (
          <section id="section-result-view">
            <ResultView
              result={activeResult}
              onAnswerConfirmations={handleAnswerConfirmations}
              onQueryRelatedPart={handleQueryRelatedPart}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Idle Instructions / Empty State */}
        {!activeResult && !isLoading && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Pronto para Atender no Balcão ou Telefone
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
              Informe a peça e o veículo acima ou selecione um dos exemplos rápidos. O assistente sênior aplicará a triagem de catálogos automotivos para garantir a aplicação correta em segundos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6 text-left">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Regra de Triagem
                </div>
                <p className="text-[11px] text-slate-500">
                  Se faltar motor ou ano que altere a peça, perguntas de confirmação serão feitas antes de fechar os códigos.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Marcas de Reposição
                </div>
                <p className="text-[11px] text-slate-500">
                  Códigos originais e marcas líderes: LUK, Nakata, Cofap, Monroe, Bosch, NGK, Mahle, Tecfil, etc.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Rio Claro - SP
                </div>
                <p className="text-[11px] text-slate-500">
                  Indicação de distribuidores locais com entrega rápida e motoboy para não perder a venda.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">AutoPeças Balcão Pro</span>
            <span>•</span>
            <span>Especialista em Catálogos & Reposição Automotiva</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Base de dados: TecDoc, SBS e Catálogos Fabricantes • Rio Claro - SP
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <BrandsModal
        isOpen={isBrandsModalOpen}
        onClose={() => setIsBrandsModalOpen(false)}
      />

      <SuppliersModal
        isOpen={isSuppliersModalOpen}
        onClose={() => setIsSuppliersModalOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onSelectQuery={handleSelectFromHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
