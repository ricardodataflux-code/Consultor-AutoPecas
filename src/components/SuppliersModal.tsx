import React from 'react';
import { X, MapPin, Truck, Phone, MessageCircle, Clock } from 'lucide-react';
import { SUPPLIERS_RIO_CLARO } from '../data/catalogBrands';

interface SuppliersModalProps {
  isOpen: boolean;
  onClose: () => void;
  partQuery?: string;
  vehicleQuery?: string;
}

export const SuppliersModal: React.FC<SuppliersModalProps> = ({
  isOpen,
  onClose,
  partQuery = '',
  vehicleQuery = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden text-zinc-900">
        {/* Header */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight flex items-center gap-2">
                Distribuidores e Fornecedores em Rio Claro - SP
              </h2>
              <p className="text-xs text-zinc-400">
                Seção Obrigatória: Onde encontrar se não houver em estoque na loja
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

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-zinc-50">
          <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs text-zinc-800 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-zinc-950 block">Logística Local Imediata em Rio Claro:</span>
              <span className="text-zinc-600">
                Fornecedores e atacadistas com entrega no mesmo dia via motoboy ou retirada imediata no balcão para não perder a venda.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SUPPLIERS_RIO_CLARO.map((s, idx) => {
              const zapMsg = encodeURIComponent(
                `Olá! Sou da Roncoli Auto Peças de Rio Claro. Gostaria de cotar disponibilidade para retirada/entrega: ${partQuery ? `Peça: ${partQuery}` : 'Peça automotiva'}${vehicleQuery ? ` para ${vehicleQuery}` : ''}.`
              );
              return (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-black text-sm text-zinc-950 leading-tight">
                        {s.name}
                      </span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-300 shrink-0">
                        {s.tag}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{s.address}</span>
                    </div>

                    <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      {s.features}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-200 flex items-center justify-between gap-2">
                    {s.phone && (
                      <a
                        href={`tel:${s.rawPhone || s.phone}`}
                        className="text-xs font-bold text-zinc-800 hover:text-zinc-950 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-zinc-700" />
                        <span>{s.phone}</span>
                      </a>
                    )}

                    {s.whatsapp && (
                      <a
                        href={`https://wa.me/${s.whatsapp}?text=${zapMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-900 text-xs font-bold transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>Atendimento focado em <strong>Rio Claro - SP</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-all text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
