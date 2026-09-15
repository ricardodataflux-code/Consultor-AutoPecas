import React, { useState, useEffect } from 'react';
import {
  Search,
  Car,
  Cog,
  Calendar,
  FileText,
  ChevronRight,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  Disc,
  Gauge,
  Compass,
  Flame,
  Snowflake,
  Fuel,
  RotateCcw,
} from 'lucide-react';
import { QueryParams, VehiclePreset } from '../types';
import { COMMON_PRESETS } from '../data/catalogBrands';

interface QueryFormProps {
  onSubmit: (params: QueryParams) => void;
  isLoading: boolean;
  initialParams?: QueryParams;
}

const COMMON_PARTS = [
  'Pastilha de freio dianteira',
  'Disco de freio dianteiro',
  'Amortecedor dianteiro',
  'Amortecedor traseiro',
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

const POPULAR_BRANDS = [
  'Chevrolet',
  'Volkswagen',
  'Fiat',
  'Hyundai',
  'Toyota',
  'Renault',
  'Ford',
  'Honda',
  'Jeep',
  'Nissan',
  'Peugeot',
  'Citroën',
];

const COMMON_ENGINE_SIZES = ['1.0', '1.3', '1.4', '1.5', '1.6', '1.8', '2.0', '2.4', '2.8', '3.0'];

const COMMON_ENGINE_VERSIONS = [
  '8V Flex',
  '16V Flex',
  '12V 3 Cilindros',
  'Fire / Firefly',
  'EA111 / MSI',
  'Turbo / TSI',
  'Dual VVT-i',
  'SPE/4 Flex',
  'AP Gasolina/Etanol',
];

const decomposeVehicle = (v: string): { brand: string; model: string } => {
  const trimmed = (v || '').trim();
  if (!trimmed) return { brand: '', model: '' };

  for (const b of POPULAR_BRANDS) {
    if (trimmed.toLowerCase().startsWith(b.toLowerCase())) {
      const rest = trimmed.slice(b.length).trim();
      return { brand: b, model: rest };
    }
  }
  const parts = trimmed.split(' ');
  if (parts.length > 1) {
    return { brand: parts[0], model: parts.slice(1).join(' ') };
  }
  return { brand: '', model: trimmed };
};

const decomposeEngine = (eng: string): { engineSize: string; engineVersion: string } => {
  const trimmed = (eng || '').trim();
  if (!trimmed) return { engineSize: '', engineVersion: '' };

  const match = trimmed.match(/^(\d\.\d)\s*(.*)$/);
  if (match) {
    return { engineSize: match[1], engineVersion: match[2] };
  }
  return { engineSize: '', engineVersion: trimmed };
};

export const QueryForm: React.FC<QueryFormProps> = ({
  onSubmit,
  isLoading,
  initialParams,
}) => {
  // 1. Peça Solicitada
  const [part, setPart] = useState(initialParams?.part || '');

  // 2. Veículo (Montadora / Marca) e 3. Modelo (Campos separados conforme solicitado)
  const initialVehicleSplit = decomposeVehicle(initialParams?.brand ? `${initialParams.brand} ${initialParams.model || ''}` : initialParams?.vehicle || '');
  const [brand, setBrand] = useState(initialParams?.brand || initialVehicleSplit.brand);
  const [model, setModel] = useState(initialParams?.model || initialVehicleSplit.model);

  // 4. Ano
  const [year, setYear] = useState(initialParams?.year || '');

  // 5. Motorização e 6. Versão do Motor (Campos separados conforme solicitado)
  const initialEngineSplit = decomposeEngine(initialParams?.engineSize ? `${initialParams.engineSize} ${initialParams.engineVersion || ''}` : initialParams?.engine || '');
  const [engineSize, setEngineSize] = useState(initialParams?.engineSize || initialEngineSplit.engineSize);
  const [engineVersion, setEngineVersion] = useState(initialParams?.engineVersion || initialEngineSplit.engineVersion);

  // Filtros em formato de botões de múltipla escolha
  const [abs, setAbs] = useState<'com_abs' | 'sem_abs' | ''>(initialParams?.abs || '');
  const [transmission, setTransmission] = useState<'manual' | 'automatico' | 'automatizado' | ''>(initialParams?.transmission || '');
  const [steering, setSteering] = useState<'hidraulica' | 'eletrica' | 'mecanica' | ''>(initialParams?.steering || '');
  const [fuel, setFuel] = useState<string>(initialParams?.fuel || '');
  const [position, setPosition] = useState<string>(initialParams?.position || '');
  const [airConditioning, setAirConditioning] = useState<'com_ar' | 'sem_ar' | ''>(initialParams?.airConditioning || '');

  // Observações do Balcão
  const [notes, setNotes] = useState(initialParams?.notes || '');

  // Sync if initialParams changes
  useEffect(() => {
    if (initialParams) {
      setPart(initialParams.part || '');
      const vSplit = decomposeVehicle(initialParams.brand ? `${initialParams.brand} ${initialParams.model || ''}` : initialParams.vehicle || '');
      setBrand(initialParams.brand || vSplit.brand);
      setModel(initialParams.model || vSplit.model);
      setYear(initialParams.year || '');

      const eSplit = decomposeEngine(initialParams.engineSize ? `${initialParams.engineSize} ${initialParams.engineVersion || ''}` : initialParams.engine || '');
      setEngineSize(initialParams.engineSize || eSplit.engineSize);
      setEngineVersion(initialParams.engineVersion || eSplit.engineVersion);

      setAbs(initialParams.abs || '');
      setTransmission(initialParams.transmission || '');
      setSteering(initialParams.steering || '');
      setFuel(initialParams.fuel || '');
      setPosition(initialParams.position || '');
      setAirConditioning(initialParams.airConditioning || '');
      setNotes(initialParams.notes || '');
    }
  }, [initialParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!part.trim() || (!model.trim() && !brand.trim())) return;

    const fullVehicle = [brand.trim(), model.trim()].filter(Boolean).join(' ');
    const fullEngine = [engineSize.trim(), engineVersion.trim()].filter(Boolean).join(' ');

    onSubmit({
      part: part.trim(),
      vehicle: fullVehicle,
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim(),
      engine: fullEngine,
      engineSize: engineSize.trim(),
      engineVersion: engineVersion.trim(),
      abs,
      transmission,
      steering,
      fuel,
      position,
      airConditioning,
      notes: notes.trim(),
    });
  };

  const handleApplyPreset = (preset: VehiclePreset) => {
    const vSplit = decomposeVehicle(preset.vehicle);
    const eSplit = decomposeEngine(preset.engine || '');

    setPart(preset.part);
    setBrand(vSplit.brand);
    setModel(vSplit.model);
    setYear(preset.year);
    setEngineSize(eSplit.engineSize);
    setEngineVersion(eSplit.engineVersion);
    setNotes(preset.notes || '');

    // Reset or set relevant filters from preset note keywords
    const noteLower = (preset.notes || '').toLowerCase();
    const newAbs = noteLower.includes('com abs') ? 'com_abs' : noteLower.includes('sem abs') ? 'sem_abs' : '';
    const newTrans = noteLower.includes('manual') ? 'manual' : noteLower.includes('automático') || noteLower.includes('automatico') ? 'automatico' : '';
    const newSteer = noteLower.includes('hidráulic') || noteLower.includes('hidraulic') ? 'hidraulica' : noteLower.includes('elétric') || noteLower.includes('eletric') ? 'eletrica' : '';
    
    setAbs(newAbs);
    setTransmission(newTrans);
    setSteering(newSteer);

    onSubmit({
      part: preset.part,
      vehicle: preset.vehicle,
      brand: vSplit.brand,
      model: vSplit.model,
      year: preset.year,
      engine: preset.engine || '',
      engineSize: eSplit.engineSize,
      engineVersion: eSplit.engineVersion,
      abs: newAbs,
      transmission: newTrans,
      steering: newSteer,
      fuel,
      position,
      airConditioning,
      notes: preset.notes || '',
    });
  };

  const handleClearFilters = () => {
    setAbs('');
    setTransmission('');
    setSteering('');
    setFuel('');
    setPosition('');
    setAirConditioning('');
  };

  // Count active multiple-choice filters
  const activeFilterCount = [
    abs !== '',
    transmission !== '',
    steering !== '',
    fuel !== '',
    position !== '',
    airConditioning !== '',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Consulta Rápida de Balcão & Telefone
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preenchimento em lista vertical com filtros de múltipla escolha para triagem instantânea.
          </p>
        </div>
        {activeFilterCount > 0 && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <SlidersHorizontal className="w-3 h-3" />
            {activeFilterCount} {activeFilterCount === 1 ? 'filtro selecionado' : 'filtros selecionados'}
          </span>
        )}
      </div>

      {/* Main Form - Vertical List Layout */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* 1. PEÇA SOLICITADA */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Cog className="w-4 h-4 text-blue-600" />
                1. Peça Solicitada *
              </span>
              <span className="text-[11px] text-slate-400 font-normal">O que o cliente pediu</span>
            </label>
            <input
              id="input-part"
              type="text"
              required
              value={part}
              onChange={(e) => setPart(e.target.value)}
              placeholder="Ex: Pastilha de freio dianteira, Amortecedor dianteiro, Bomba d'água..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />
            
            {/* Quick Part Shortcuts */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Atalhos rápidos:
              </span>
              {COMMON_PARTS.slice(0, 8).map((cp) => (
                <button
                  key={cp}
                  type="button"
                  onClick={() => setPart(cp)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    part.toLowerCase() === cp.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {cp}
                </button>
              ))}
            </div>
          </div>

          {/* 2. VEÍCULO (MONTADORA / MARCA) */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Car className="w-4 h-4 text-blue-600" />
                2. Veículo (Montadora / Marca) *
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Ex: Chevrolet, Volkswagen, Fiat...</span>
            </label>
            <input
              id="input-vehicle-brand"
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Chevrolet, Volkswagen, Fiat, Hyundai, Toyota, Ford..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />

            {/* Popular Brand Buttons */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Marcas populares:
              </span>
              {POPULAR_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    brand.toLowerCase() === b.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MODELO DO VEÍCULO */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Car className="w-4 h-4 text-blue-600" />
                3. Modelo do Veículo *
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Ex: HB20, Onix, Gol, Palio, Corolla, Strada...</span>
            </label>
            <input
              id="input-vehicle-model"
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex: HB20, Onix, Gol G5, Palio Fire, Corolla, Sandero, Strada..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />
          </div>

          {/* 4. ANO */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                4. Ano / Modelo
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Ex: 2016 ou 2015/2016</span>
            </label>
            <input
              id="input-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ex: 2016, 2014, 2010, 2008..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />
          </div>

          {/* 5. MOTORIZAÇÃO (CILINDRADA) */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Gauge className="w-4 h-4 text-blue-600" />
                5. Motorização (Cilindrada / Litragem)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Ex: 1.0, 1.4, 1.6, 2.0</span>
            </label>
            <input
              id="input-engine-size"
              type="text"
              value={engineSize}
              onChange={(e) => setEngineSize(e.target.value)}
              placeholder="Ex: 1.0, 1.3, 1.4, 1.6, 1.8, 2.0..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />

            {/* Quick Engine Size Buttons */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Litragem rápida:
              </span>
              {COMMON_ENGINE_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setEngineSize(sz)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    engineSize === sz
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 6. VERSÃO DO MOTOR / VÁLVULAS */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Gauge className="w-4 h-4 text-blue-600" />
                6. Versão do Motor / Válvulas / Família
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Ex: 8V, 16V, 12V 3 Cil, Firefly, EA111, Turbo</span>
            </label>
            <input
              id="input-engine-version"
              type="text"
              value={engineVersion}
              onChange={(e) => setEngineVersion(e.target.value)}
              placeholder="Ex: 8V Flex, 16V, 12V 3 Cilindros, Firefly, EA111, Turbo/TSI, Dual VVT-i..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all shadow-2xs"
            />

            {/* Quick Engine Version Buttons */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Versões comuns:
              </span>
              {COMMON_ENGINE_VERSIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setEngineVersion(v)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    engineVersion === v
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7. BOTÕES DE MÚLTIPLA ESCOLHA (INFORMAÇÕES DO CARRO) */}
        <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/30 rounded-xl p-5 border-2 border-blue-200/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Filtros Técnicos do Veículo (Botões de Múltipla Escolha)
                </h3>
                <p className="text-[11px] text-slate-600">
                  Selecione as opções do carro para a IA fechar a aplicação correta sem fazer perguntas extras.
                </p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar opções
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* FILTRO 1: SISTEMA DE FREIO (ABS) */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-blue-600" />
                  Sistema de Freio (ABS)
                </span>
                {abs && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAbs('')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    abs === ''
                      ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Indiferente
                </button>
                <button
                  type="button"
                  onClick={() => setAbs('com_abs')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    abs === 'com_abs'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  🟢 Com ABS
                </button>
                <button
                  type="button"
                  onClick={() => setAbs('sem_abs')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    abs === 'sem_abs'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  ⚪ Sem ABS
                </button>
              </div>
            </div>

            {/* FILTRO 2: CÂMBIO / TRANSMISSÃO */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Cog className="w-3.5 h-3.5 text-blue-600" />
                  Câmbio / Transmissão
                </span>
                {transmission && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded capitalize">
                    {transmission}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => setTransmission('')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center truncate ${
                    transmission === ''
                      ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Indiferente
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission('manual')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center ${
                    transmission === 'manual'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission('automatico')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center ${
                    transmission === 'automatico'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Automático
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission('automatizado')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center truncate ${
                    transmission === 'automatizado'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  title="Dualogic, I-Motion, Easytronic"
                >
                  Automatz.
                </button>
              </div>
            </div>

            {/* FILTRO 3: DIREÇÃO */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  Sistema de Direção
                </span>
                {steering && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded capitalize">
                    {steering}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => setSteering('')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center truncate ${
                    steering === ''
                      ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Indiferente
                </button>
                <button
                  type="button"
                  onClick={() => setSteering('hidraulica')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center ${
                    steering === 'hidraulica'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  💧 Hidráulica
                </button>
                <button
                  type="button"
                  onClick={() => setSteering('eletrica')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center ${
                    steering === 'eletrica'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  ⚡ Elétrica
                </button>
                <button
                  type="button"
                  onClick={() => setSteering('mecanica')}
                  className={`text-[11px] py-2 px-1 rounded-md border font-medium transition-all text-center ${
                    steering === 'mecanica'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  🔧 Mecânica
                </button>
              </div>
            </div>

            {/* FILTRO 4: COMBUSTÍVEL */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-blue-600" />
                  Combustível
                </span>
                {fuel && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {fuel}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['', 'Flex', 'Gasolina', 'Etanol', 'Diesel', 'GNV'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFuel(f)}
                    className={`text-xs py-1.5 px-1 rounded-md border font-medium transition-all text-center ${
                      fuel === f
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f === '' ? 'Indiferente' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTRO 5: POSIÇÃO / LADO DA PEÇA */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  Posição / Lado da Peça
                </span>
                {position && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {position}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: '', label: 'Indiferente' },
                  { id: 'Dianteiro', label: 'Dianteiro' },
                  { id: 'Traseiro', label: 'Traseiro' },
                  { id: 'Lado Direito (LD)', label: 'LD (Direito)' },
                  { id: 'Lado Esquerdo (LE)', label: 'LE (Esquerdo)' },
                  { id: 'Par (Ambos os lados)', label: 'Par (Ambos)' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id)}
                    className={`text-xs py-1.5 px-1 rounded-md border font-medium transition-all text-center truncate ${
                      position === pos.id
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTRO 6: AR-CONDICIONADO */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                  Ar-Condicionado
                </span>
                {airConditioning && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {airConditioning === 'com_ar' ? 'Com Ar' : 'Sem Ar'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAirConditioning('')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    airConditioning === ''
                      ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Indiferente
                </button>
                <button
                  type="button"
                  onClick={() => setAirConditioning('com_ar')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    airConditioning === 'com_ar'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  ❄️ Com Ar
                </button>
                <button
                  type="button"
                  onClick={() => setAirConditioning('sem_ar')}
                  className={`text-xs py-2 px-1.5 rounded-md border font-medium transition-all text-center ${
                    airConditioning === 'sem_ar'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  ☀️ Sem Ar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. OBSERVAÇÕES ADICIONAIS DO BALCÃO */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-all hover:border-blue-300">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700">
              <FileText className="w-4 h-4 text-slate-500" />
              Observações Adicionais do Balcão (opcional)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Ex: Cliente com amostra, código gravado antigo...</span>
          </label>
          <input
            id="input-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Cliente trouxe pastilha gasta na mão; verificar se é sistema Teves ou Mando..."
            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all shadow-2xs"
          />
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs"></span>
            <span>
              A IA pesquisará nos catálogos oficiais online aplicando todos os filtros selecionados acima.
            </span>
          </div>

          <button
            id="btn-submit-query"
            type="submit"
            disabled={isLoading || !part.trim() || (!model.trim() && !brand.trim())}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed active:scale-[0.98]"
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
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Exemplos Reais para Demonstração Rápida no Balcão:
          </span>
          <span className="text-[10px] text-slate-400">1 clique para carregar nos campos</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              disabled={isLoading}
              className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-xs group shadow-2xs"
            >
              <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                {p.vehicle}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {p.part}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
