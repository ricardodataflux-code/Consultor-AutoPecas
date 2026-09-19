import React, { useState, useEffect } from 'react';
import { Wrench, MapPin, Sparkles, BookOpen, Clock, PlusCircle, Database } from 'lucide-react';
import { RoncoliLogo } from './RoncoliLogo';

interface HeaderProps {
  onNewQuery: () => void;
  onOpenBrands: () => void;
  onOpenSuppliers?: () => void;
  onOpenHistory?: () => void;
  onOpenTecDoc?: () => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewQuery,
  onOpenBrands,
  onOpenTecDoc,
}) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <RoncoliLogo className="w-14 h-14" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Roncoli - Triagem
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  <Database className="w-3 h-3 text-emerald-400" />
                  TecDoc / CSV Ativo
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  Rio Claro - SP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Ricardo R. Guedes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {dateTime.toLocaleDateString('pt-BR')} {dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {onOpenTecDoc && (
              <button
                id="btn-open-tecdoc"
                onClick={onOpenTecDoc}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs font-bold border border-emerald-600/40 transition-all whitespace-nowrap active:scale-95 shadow-xs"
                title="Arquitetura TecDoc e Tabela de Equivalência CSV"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>TecDoc & CSV</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">100%</span>
              </button>
            )}
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

