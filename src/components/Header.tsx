import React, { useState, useEffect } from 'react';
import { MapPin, Clock, PlusCircle, BookOpen, Database, Truck } from 'lucide-react';
import { RoncoliLogo } from './RoncoliLogo';

interface HeaderProps {
  onNewQuery: () => void;
  onOpenBrands: () => void;
  onOpenSuppliers?: () => void;
  onOpenTecDoc?: () => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewQuery,
  onOpenBrands,
  onOpenSuppliers,
  onOpenTecDoc,
}) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-zinc-950 border-b border-zinc-800 text-zinc-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <RoncoliLogo className="w-14 h-14 bg-white" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Roncoli - Triagem Balcão Pro
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded">
                  44 Marcas • Rio Claro-SP
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-0.5">
                <span className="flex items-center gap-1 text-zinc-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  Rio Claro - SP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-300">
                  Ricardo R. Guedes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-400 font-mono">
                  <Clock className="w-3 h-3 text-zinc-500" />
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
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold border border-zinc-700 transition-all whitespace-nowrap active:scale-95 shadow-xs"
                title="Arquitetura de Catálogos e RAG"
              >
                <Database className="w-3.5 h-3.5 text-zinc-300" />
                <span>Base RAG / Catálogo</span>
              </button>
            )}

            {onOpenSuppliers && (
              <button
                id="btn-open-suppliers"
                onClick={onOpenSuppliers}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 transition-all whitespace-nowrap"
                title="Onde encontrar em Rio Claro-SP"
              >
                <Truck className="w-3.5 h-3.5 text-zinc-300" />
                <span>Distribuidores Rio Claro</span>
              </button>
            )}

            <button
              id="btn-open-brands"
              onClick={onOpenBrands}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 transition-all whitespace-nowrap"
              title="44 Marcas prioritárias de referência"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
              <span>44 Marcas</span>
            </button>

            <button
              id="btn-new-query"
              onClick={onNewQuery}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-black shadow-sm transition-all whitespace-nowrap active:scale-95 border border-zinc-200"
              title="Iniciar nova consulta limpa (Esc)"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Consulta</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
