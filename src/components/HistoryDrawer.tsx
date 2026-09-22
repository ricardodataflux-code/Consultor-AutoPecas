import React from 'react';
import { X, History, Trash2, ArrowRight, Clock, Car } from 'lucide-react';
import { QueryResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryResult[];
  onSelectQuery: (result: QueryResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectQuery,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-2xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-zinc-200">
        {/* Header */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-100" />
            <div>
              <h2 className="text-sm font-black">Histórico de Balcão</h2>
              <p className="text-xs text-zinc-400">
                {history.length} consultas recentes salvas nesta sessão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
              Nenhuma consulta registrada ainda. Realize uma busca para salvar no balcão.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectQuery(item);
                  onClose();
                }}
                className="p-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-400 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-black text-xs text-zinc-950">
                    {item.query.part}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-xs text-zinc-700 flex items-center gap-1 mb-1.5 font-medium">
                  <Car className="w-3.5 h-3.5 text-zinc-500" />
                  <span>
                    {item.query.vehicle} {item.query.year || ''}{' '}
                    {item.query.engine ? `(${item.query.engine})` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-zinc-200 text-[10px] text-zinc-500">
                  <span>{item.codes.length} códigos identificados</span>
                  <span className="text-zinc-950 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Reabrir <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-zinc-700 hover:text-zinc-950 flex items-center gap-1 font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar histórico
            </button>
            <span className="text-[10px] text-zinc-400">Salvo no navegador</span>
          </div>
        )}
      </div>
    </div>
  );
};
