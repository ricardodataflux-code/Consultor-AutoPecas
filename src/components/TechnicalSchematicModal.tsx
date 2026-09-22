import React from 'react';
import { X, Ruler, CheckCircle2, ShieldCheck, Wrench, Eye, Printer } from 'lucide-react';
import { getPartSchematic, TechnicalSchematic } from '../data/catalogBrands';

interface TechnicalSchematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  partName: string;
  vehicle: string;
}

export const TechnicalSchematicModal: React.FC<TechnicalSchematicModalProps> = ({
  isOpen,
  onClose,
  partName,
  vehicle,
}) => {
  if (!isOpen) return null;

  const schematic: TechnicalSchematic = getPartSchematic(partName, vehicle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-zinc-900">
        {/* Header */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">{schematic.title}</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Cotas Técnicas Milimétricas • Tolerâncias ISO • Inspeção de Balcão
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1 border border-zinc-800"
              title="Imprimir Esquema Técnico"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-zinc-50">
          {/* Blueprint Visual Diagram */}
          <div className="bg-zinc-950 text-zinc-100 rounded-xl p-5 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <Eye className="w-3 h-3 text-zinc-400" />
              Croqui Técnico Dimensional CAD
            </div>
            <div className="w-full max-w-md py-4 flex flex-col items-center">
              {/* Dynamic SVG Schematic Based on Type */}
              {schematic.diagramType === 'pastilha' && (
                <svg viewBox="0 0 320 140" className="w-full max-h-40 stroke-zinc-100 fill-zinc-900">
                  {/* Outer pad shape */}
                  <rect x="50" y="30" width="220" height="70" rx="10" strokeWidth="2.5" />
                  {/* Friction material center groove */}
                  <line x1="160" y1="30" x2="160" y2="100" strokeWidth="2" strokeDasharray="3 3" />
                  {/* Anti-noise shim backplate clips */}
                  <path d="M 40 45 L 50 45 L 50 85 L 40 85" fill="none" strokeWidth="2" />
                  <path d="M 280 45 L 270 45 L 270 85 L 280 85" fill="none" strokeWidth="2" />
                  {/* Dimension lines */}
                  <line x1="50" y1="115" x2="270" y2="115" strokeWidth="1.5" stroke="#a1a1aa" />
                  <line x1="50" y1="110" x2="50" y2="120" strokeWidth="1.5" stroke="#a1a1aa" />
                  <line x1="270" y1="110" x2="270" y2="120" strokeWidth="1.5" stroke="#a1a1aa" />
                  <text x="160" y="128" fill="#f4f4f5" fontSize="11" textAnchor="middle" fontFamily="monospace">Comprimento (A)</text>
                  
                  <line x1="25" y1="30" x2="25" y2="100" strokeWidth="1.5" stroke="#a1a1aa" />
                  <line x1="20" y1="30" x2="30" y2="30" strokeWidth="1.5" stroke="#a1a1aa" />
                  <line x1="20" y1="100" x2="30" y2="100" strokeWidth="1.5" stroke="#a1a1aa" />
                  <text x="20" y="68" fill="#f4f4f5" fontSize="11" textAnchor="end" fontFamily="monospace">Altura (B)</text>
                </svg>
              )}

              {schematic.diagramType === 'amortecedor' && (
                <svg viewBox="0 0 320 140" className="w-full max-h-40 stroke-zinc-100 fill-zinc-900">
                  {/* Cylinder Tube */}
                  <rect x="110" y="45" width="100" height="50" rx="4" strokeWidth="2" />
                  {/* Chrome Rod */}
                  <rect x="210" y="58" width="80" height="24" rx="2" strokeWidth="2" fill="#27272a" />
                  {/* Top Thread */}
                  <rect x="290" y="64" width="18" height="12" strokeWidth="1.5" />
                  {/* Bottom Bracket */}
                  <path d="M 110 50 L 80 40 L 80 100 L 110 90 Z" strokeWidth="2" />
                  <circle cx="95" cy="70" r="6" strokeWidth="2" fill="#18181b" />
                  {/* Dimension arrows */}
                  <line x1="80" y1="120" x2="308" y2="120" strokeWidth="1.5" stroke="#a1a1aa" />
                  <text x="194" y="132" fill="#f4f4f5" fontSize="11" textAnchor="middle" fontFamily="monospace">Comprimento Aberto / Extendido</text>
                </svg>
              )}

              {schematic.diagramType === 'embreagem' && (
                <svg viewBox="0 0 320 140" className="w-full max-h-40 stroke-zinc-100 fill-zinc-900">
                  {/* Disc outer circle */}
                  <circle cx="160" cy="70" r="55" strokeWidth="2.5" />
                  {/* Inner friction circle */}
                  <circle cx="160" cy="70" r="35" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Splined hub */}
                  <circle cx="160" cy="70" r="14" strokeWidth="2" fill="#27272a" />
                  {/* 4 torsion springs */}
                  <rect x="140" y="35" width="10" height="18" rx="2" strokeWidth="1.5" />
                  <rect x="170" y="35" width="10" height="18" rx="2" strokeWidth="1.5" />
                  <rect x="140" y="87" width="10" height="18" rx="2" strokeWidth="1.5" />
                  <rect x="170" y="87" width="10" height="18" rx="2" strokeWidth="1.5" />
                  <text x="160" y="135" fill="#f4f4f5" fontSize="11" textAnchor="middle" fontFamily="monospace">Diâmetro Externo (mm) × Quantidade Estrias</text>
                </svg>
              )}

              {schematic.diagramType === 'correia' && (
                <svg viewBox="0 0 320 140" className="w-full max-h-40 stroke-zinc-100 fill-zinc-900">
                  {/* Belt loop */}
                  <path d="M 80 40 L 240 40 A 30 30 0 0 1 240 100 L 80 100 A 30 30 0 0 1 80 40 Z" fill="none" strokeWidth="4" />
                  {/* Teeth markings */}
                  <line x1="100" y1="40" x2="100" y2="46" strokeWidth="2" />
                  <line x1="120" y1="40" x2="120" y2="46" strokeWidth="2" />
                  <line x1="140" y1="40" x2="140" y2="46" strokeWidth="2" />
                  <line x1="160" y1="40" x2="160" y2="46" strokeWidth="2" />
                  <line x1="180" y1="40" x2="180" y2="46" strokeWidth="2" />
                  <line x1="200" y1="40" x2="200" y2="46" strokeWidth="2" />
                  <line x1="220" y1="40" x2="220" y2="46" strokeWidth="2" />
                  <text x="160" y="74" fill="#f4f4f5" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Perfil dos Dentes HTD/RPP</text>
                  <text x="160" y="130" fill="#a1a1aa" fontSize="11" textAnchor="middle" fontFamily="monospace">Passo (Pitch) 9.525mm • EPDM</text>
                </svg>
              )}

              {schematic.diagramType !== 'pastilha' && schematic.diagramType !== 'amortecedor' && schematic.diagramType !== 'embreagem' && schematic.diagramType !== 'correia' && (
                <svg viewBox="0 0 320 140" className="w-full max-h-40 stroke-zinc-100 fill-zinc-900">
                  <rect x="90" y="35" width="140" height="70" rx="8" strokeWidth="2.5" />
                  <circle cx="160" cy="70" r="18" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="160" y="75" fill="#f4f4f5" fontSize="12" textAnchor="middle" fontFamily="monospace">Padrão OEM Homologado</text>
                  <text x="160" y="125" fill="#a1a1aa" fontSize="10" textAnchor="middle" fontFamily="monospace">Encaixe 100% Preciso de Montadora</text>
                </svg>
              )}
            </div>
          </div>

          {/* Table of Exact Measures and Cotas */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
            <div className="bg-zinc-100 px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between">
              <span className="text-xs font-black text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-zinc-700" />
                Cotas Críticas Dimensionais (em Milímetros)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Tolerância Fabril</span>
            </div>
            <div className="divide-y divide-zinc-200">
              {schematic.dimensions.map((dim, idx) => (
                <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-zinc-50">
                  <span className="font-medium text-zinc-700">{dim.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {dim.value} {dim.unit || ''}
                    </span>
                    {dim.tolerance && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {dim.tolerance}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Inspection Points */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2 shadow-xs">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-800" />
              Pontos Críticos de Conferência no Balcão
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-700">
              {schematic.keyInspectionPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bench Checklist */}
          <div className="bg-zinc-100 rounded-xl border border-zinc-200 p-4 space-y-2">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-zinc-800" />
              Checklist de Entrega e Garantia ao Mecânico
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-700">
              {schematic.benchChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-zinc-400 text-xs">
          <span>Aplicação: <strong className="text-zinc-200">{vehicle || 'Catálogo Automotivo'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-all text-xs"
          >
            Fechar Esquema
          </button>
        </div>
      </div>
    </div>
  );
};
