import React from 'react';
import { Wrench, MapPin, Sparkles, BookOpen, Truck, History, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onNewQuery: () => void;
  onOpenBrands: () => void;
  onOpenSuppliers: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewQuery,
  onOpenBrands,
  onOpenSuppliers,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner font-black text-xl shrink-0">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  AutoPeças Balcão Pro
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700/60 uppercase tracking-wider">
                    TecDoc & SBS
                  </span>
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  Rio Claro - SP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Balconista Sênior Especialista
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              id="btn-new-query"
              onClick={onNewQuery}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap active:scale-95"
              title="Iniciar nova consulta limpa (Esc)"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Consulta</span>
            </button>

            <button
              id="btn-open-history"
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all whitespace-nowrap"
              title="Histórico recente de consultas"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Histórico</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] text-amber-300 font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              id="btn-open-suppliers"
              onClick={onOpenSuppliers}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all whitespace-nowrap"
              title="Distribuidoras e atacados em Rio Claro-SP"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fornecedores Rio Claro</span>
            </button>

            <button
              id="btn-open-brands"
              onClick={onOpenBrands}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all whitespace-nowrap"
              title="Marcas de referência do catálogo"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Marcas & Catálogos</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
