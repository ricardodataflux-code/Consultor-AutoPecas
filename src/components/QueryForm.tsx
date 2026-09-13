import React, { useState } from 'react';
import { Search, Sparkles, Car, Cog, Calendar, FileText, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import { QueryParams, VehiclePreset } from '../types';
import { COMMON_PRESETS } from '../data/catalogBrands';

interface QueryFormProps {
  onSubmit: (params: QueryParams) => void;
  isLoading: boolean;
  initialParams?: QueryParams;
}

const COMMON_PARTS = [
  'Amortecedor dianteiro',
  'Amortecedor traseiro',
  'Pastilha de freio dianteira',
  'Disco de freio dianteiro',
  'Kit de embreagem',
  'Kit correia dentada + tensor',
  'Bomba d\'água',
  'Vela de ignição',
  'Cabo de vela',
  'Bobina de ignição',
  'Filtro de óleo',
  'Filtro de combustível',
  'Coxim do motor',
  'Bandeja de suspensão',
  'Pivô de suspensão',
  'Terminal de direção',
  'Radiador de água',
  'Válvula termostática',
];

export const QueryForm: React.FC<QueryFormProps> = ({
  onSubmit,
  isLoading,
  initialParams,
}) => {
  const [part, setPart] = useState(initialParams?.part || '');
  const [vehicle, setVehicle] = useState(initialParams?.vehicle || '');
  const [year, setYear] = useState(initialParams?.year || '');
  const [engine, setEngine] = useState(initialParams?.engine || '');
  const [notes, setNotes] = useState(initialParams?.notes || '');

  // Sync if initialParams changes
  React.useEffect(() => {
    if (initialParams) {
      setPart(initialParams.part || '');
      setVehicle(initialParams.vehicle || '');
      setYear(initialParams.year || '');
      setEngine(initialParams.engine || '');
      setNotes(initialParams.notes || '');
    } else {
      setPart('');
      setVehicle('');
      setYear('');
      setEngine('');
      setNotes('');
      setQuickPhrase('');
    }
  }, [initialParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!part.trim() || !vehicle.trim()) return;

    onSubmit({
      part: part.trim(),
      vehicle: vehicle.trim(),
      year: year.trim(),
      engine: engine.trim(),
      notes: notes.trim(),
    });
  };

  const handleApplyPreset = (preset: VehiclePreset) => {
    setPart(preset.part);
    setVehicle(preset.vehicle);
    setYear(preset.year);
    setEngine(preset.engine || '');
    setNotes(preset.notes || '');

    // Directly trigger query
    onSubmit({
      part: preset.part,
      vehicle: preset.vehicle,
      year: preset.year,
      engine: preset.engine || '',
      notes: preset.notes || '',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Consulta Rápida de Balcão & Telefone
          </h2>
          <p className="text-xs text-slate-500">
            Preencha os dados do cliente para triagem técnica e busca de códigos cruzados (TecDoc & Fornecedores Rio Claro).
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Peça Solicitada */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Cog className="w-3.5 h-3.5 text-blue-600" />
                Peça Solicitada *
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Ex: Amortecedor, Pastilha</span>
            </label>
            <input
              id="input-part"
              type="text"
              required
              value={part}
              onChange={(e) => setPart(e.target.value)}
              placeholder="Ex: Amortecedor dianteiro, Bomba d'água"
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            />
          </div>

          {/* Veículo / Modelo */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                Veículo / Modelo *
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Ex: Onix, Gol G5, HB20</span>
            </label>
            <input
              id="input-vehicle"
              type="text"
              required
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="Ex: Chevrolet Onix, Fiat Palio"
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            />
          </div>

          {/* Ano */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Ano
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Ex: 2015</span>
            </label>
            <input
              id="input-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ex: 2015 ou 2014/2015"
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Secondary line: Motorização e Observações */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center justify-between">
              <span>Motorização / Versão (se souber)</span>
              <span className="text-[10px] text-slate-400">Ex: 1.4 8V SPE/4 Flex</span>
            </label>
            <input
              id="input-engine"
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="Ex: 1.0 Fire, 1.6 MSI, 2.0 Dual VVT-i"
              className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="md:col-span-7">
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                Observações do Cliente / Balcão
              </span>
              <span className="text-[10px] text-slate-400">Ex: Com ABS, Câmbio Manual, Lado direito</span>
            </label>
            <input
              id="input-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente trouxe amostra gasta; verificar se é vendido em par"
              className="w-full text-xs px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Quick Part Chips */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <span>Atalhos de peças mais pedidas no balcão:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PARTS.slice(0, 10).map((cp) => (
              <button
                key={cp}
                type="button"
                onClick={() => setPart(cp)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  part.toLowerCase() === cp.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {cp}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Pesquisa por IA consultando os catálogos oficiais online (Nakata, Cofap, Bosch, Monroe, LUK, Cobreq).</span>
          </div>

          <button
            id="btn-submit-query"
            type="submit"
            disabled={isLoading || !part.trim() || !vehicle.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>IA Consultando Catálogos Online...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Pesquisar por IA nos Catálogos Online</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset vehicle shortcuts for fast testing */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Exemplos Reais para Demonstração Rápida no Balcão:
          </span>
          <span className="text-[10px] text-slate-400">1 clique para testar a triagem</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              disabled={isLoading}
              className="text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all text-xs group"
            >
              <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                {p.vehicle}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {p.part}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
