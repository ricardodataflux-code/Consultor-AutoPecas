import React from 'react';
import { X, MapPin, Truck, Phone, Navigation, Clock, Building2 } from 'lucide-react';
import { SUPPLIERS_RIO_CLARO } from '../data/catalogBrands';

interface SuppliersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuppliersModal: React.FC<SuppliersModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Distribuidores de Autopeças em Rio Claro - SP
              </h2>
              <p className="text-xs text-emerald-200">
                Fornecedores locais com rota diária expressa e motoboy para entrega rápida no balcão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3.5 bg-slate-50">
          <div className="p-3 bg-emerald-100/60 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Regra Restrita de Logística:</span>
              <span>
                As indicações priorizam distribuidores e estoques situados diretamente em Rio Claro-SP, garantindo tempo de resposta mínimo para fechar a venda com o cliente na loja ou na linha.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUPPLIERS_RIO_CLARO.map((s, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm text-slate-900 leading-tight">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {s.tag}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.address}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {s.features}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Entrega rápida no dia
                  </span>
                  <span className="text-slate-400 text-[10px]">Rio Claro - SP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
