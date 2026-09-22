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
  onNewQuery?: () => void;
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

  for (const sz of COMMON_ENGINE_SIZES) {
    if (trimmed.startsWith(sz)) {
      const rest = trimmed.slice(sz.length).trim();
      return { engineSize: sz, engineVersion: rest };
    }
  }

  const parts = trimmed.split(' ');
  if (parts.length > 1) {
    return { engineSize: parts[0], engineVersion: parts.slice(1).join(' ') };
  }
  return { engineSize: trimmed, engineVersion: '' };
};

export const QueryForm: React.FC<QueryFormProps> = ({
  onSubmit,
  isLoading,
  initialParams,
  onNewQuery,
}) => {
  // Input fields
  const [part, setPart] = useState(initialParams?.part || '');
  const [brand, setBrand] = useState(initialParams?.brand || '');
  const [model, setModel] = useState(initialParams?.model || '');
  const [year, setYear] = useState(initialParams?.year || '');
  const [engineSize, setEngineSize] = useState(initialParams?.engineSize || '');
  const [engineVersion, setEngineVersion] = useState(initialParams?.engineVersion || '');

  // Multiple Choice Filters
  const [abs, setAbs] = useState<'com_abs' | 'sem_abs' | ''>(initialParams?.abs || '');
  const [transmission, setTransmission] = useState<'manual' | 'automatico' | 'automatizado' | ''>(initialParams?.transmission || '');
  const [steering, setSteering] = useState<'hidraulica' | 'eletrica' | 'mecanica' | ''>(initialParams?.steering || '');
  const [fuel, setFuel] = useState(initialParams?.fuel || '');
  const [position, setPosition] = useState(initialParams?.position || '');
  const [airConditioning, setAirConditioning] = useState<'com_ar' | 'sem_ar' | ''>(initialParams?.airConditioning || '');
  const [notes, setNotes] = useState(initialParams?.notes || '');

  const handleResetAll = () => {
    setPart('');
    setBrand('');
    setModel('');
    setYear('');
    setEngineSize('');
    setEngineVersion('');
    setAbs('');
    setTransmission('');
    setSteering('');
    setFuel('');
    setPosition('');
    setAirConditioning('');
    setNotes('');

    if (onNewQuery) {
      onNewQuery();
    }

    setTimeout(() => {
      const input = document.getElementById('input-part') as HTMLInputElement | null;
      if (input) input.focus();
    }, 50);
  };

  useEffect(() => {
    if (!initialParams) {
      setPart('');
      setBrand('');
      setModel('');
      setYear('');
      setEngineSize('');
      setEngineVersion('');
      setAbs('');
      setTransmission('');
      setSteering('');
      setFuel('');
      setPosition('');
      setAirConditioning('');
      setNotes('');
      return;
    }

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

    const noteLower = (preset.notes || '').toLowerCase();
    const newAbs: 'com_abs' | 'sem_abs' | '' = noteLower.includes('com abs') ? 'com_abs' : noteLower.includes('sem abs') ? 'sem_abs' : '';
    const newTrans: 'manual' | 'automatico' | 'automatizado' | '' = noteLower.includes('manual') ? 'manual' : noteLower.includes('automático') || noteLower.includes('automatico') ? 'automatico' : '';
    const newSteer: 'hidraulica' | 'eletrica' | 'mecanica' | '' = noteLower.includes('hidráulic') || noteLower.includes('hidraulic') ? 'hidraulica' : noteLower.includes('elétric') || noteLower.includes('eletric') ? 'eletrica' : '';
    
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

  const activeFilterCount = [
    abs !== '',
    transmission !== '',
    steering !== '',
    fuel !== '',
    position !== '',
    airConditioning !== '',
  ].filter(Boolean).length;

  const hasAnyData = Boolean(
    part.trim() ||
    brand.trim() ||
    model.trim() ||
    year.trim() ||
    engineSize.trim() ||
    engineVersion.trim() ||
    notes.trim() ||
    activeFilterCount > 0
  );

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5 sm:p-6 text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-zinc-200">
        <div>
          <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-800" />
            Consulta Rápida de Balcão & Telefone
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Formulário técnico vertical com parâmetros de aplicação e filtros rápidos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-300">
              <SlidersHorizontal className="w-3 h-3 text-zinc-700" />
              {activeFilterCount} {activeFilterCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </span>
          )}

          {hasAnyData && (
            <button
              id="btn-form-new-query"
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-bold transition-all active:scale-95"
              title="Limpar todos os campos e filtros para nova consulta"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
              <span>Limpar Formulário</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form - Vertical List Layout */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3.5">
          {/* 1. PEÇA SOLICITADA */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-950">
                <Cog className="w-4 h-4 text-zinc-700" />
                1. Peça Solicitada *
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">O que o cliente pediu no balcão</span>
            </label>
            <input
              id="input-part"
              type="text"
              required
              value={part}
              onChange={(e) => setPart(e.target.value)}
              placeholder="Ex: Pastilha de freio dianteira, Amortecedor dianteiro, Kit de embreagem, Bomba d'água..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
            />
            
            {/* Quick Part Shortcuts */}
            <div className="mt-2.5 pt-2 border-t border-zinc-200 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                Atalhos rápidos:
              </span>
              {COMMON_PARTS.slice(0, 8).map((cp) => (
                <button
                  key={cp}
                  type="button"
                  onClick={() => setPart(cp)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    part.toLowerCase() === cp.toLowerCase()
                      ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                  }`}
                >
                  {cp}
                </button>
              ))}
            </div>
          </div>

          {/* 2. VEÍCULO (MONTADORA / MARCA) */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-950">
                <Car className="w-4 h-4 text-zinc-700" />
                2. Montadora / Fabricante *
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Ex: Chevrolet, Volkswagen, Fiat...</span>
            </label>
            <input
              id="input-vehicle-brand"
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Chevrolet, Volkswagen, Fiat, Hyundai, Toyota, Ford, Renault..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
            />

            {/* Popular Brand Buttons */}
            <div className="mt-2.5 pt-2 border-t border-zinc-200 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                Principais:
              </span>
              {POPULAR_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    brand.toLowerCase() === b.toLowerCase()
                      ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                      : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MODELO DO VEÍCULO */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-950">
                <Car className="w-4 h-4 text-zinc-700" />
                3. Modelo do Veículo *
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Ex: HB20, Onix, Gol, Palio, Corolla, Strada...</span>
            </label>
            <input
              id="input-vehicle-model"
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex: HB20, Onix, Gol G5, Palio Fire, Corolla, Sandero, Strada..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* 4. ANO */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
            <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-950">
                <Calendar className="w-4 h-4 text-zinc-700" />
                4. Ano / Modelo
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Ex: 2016 ou 2015/2016</span>
            </label>
            <input
              id="input-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ex: 2016, 2014, 2010, 2008..."
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* 5. MOTORIZAÇÃO (CILINDRADA) & VERSÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
              <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-950">
                  <Gauge className="w-4 h-4 text-zinc-700" />
                  5. Cilindrada / Litragem
                </span>
                <span className="text-[11px] text-zinc-500 font-normal">Ex: 1.0, 1.4, 1.6</span>
              </label>
              <input
                id="input-engine-size"
                type="text"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="Ex: 1.0, 1.4, 1.6, 2.0..."
                className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
              />

              <div className="mt-2 pt-2 border-t border-zinc-200 flex flex-wrap items-center gap-1">
                {COMMON_ENGINE_SIZES.slice(0, 7).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setEngineSize(sz)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                      engineSize === sz
                        ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
              <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-950">
                  <Gauge className="w-4 h-4 text-zinc-700" />
                  6. Válvulas / Família Motor
                </span>
                <span className="text-[11px] text-zinc-500 font-normal">Ex: 8V, 16V, Firefly</span>
              </label>
              <input
                id="input-engine-version"
                type="text"
                value={engineVersion}
                onChange={(e) => setEngineVersion(e.target.value)}
                placeholder="Ex: 8V Flex, 16V, 12V 3 Cilindros, Firefly..."
                className="w-full text-sm font-medium px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
              />

              <div className="mt-2 pt-2 border-t border-zinc-200 flex flex-wrap items-center gap-1">
                {['8V Flex', '16V Flex', '12V 3 Cil', 'Firefly'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setEngineVersion(v)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                      engineVersion === v
                        ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 7. BOTÕES DE MÚLTIPLA ESCOLHA (FILTROS TÉCNICOS) */}
        <div className="bg-zinc-100 rounded-xl p-4 sm:p-5 border border-zinc-300 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-950">
                  Filtros Técnicos de Aplicação (Múltipla Escolha)
                </h3>
                <p className="text-[11px] text-zinc-600">
                  Defina os detalhes opcionais para fechar a aplicação sem pendências.
                </p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-bold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar opções
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* ABS */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-zinc-700" />
                  Sistema de Freio (ABS)
                </span>
                {abs && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {abs === 'com_abs' ? 'Com ABS' : 'Sem ABS'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAbs('')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    abs === '' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Indif.
                </button>
                <button
                  type="button"
                  onClick={() => setAbs('com_abs')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    abs === 'com_abs' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Com ABS
                </button>
                <button
                  type="button"
                  onClick={() => setAbs('sem_abs')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    abs === 'sem_abs' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Sem ABS
                </button>
              </div>
            </div>

            {/* CÂMBIO */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Cog className="w-3.5 h-3.5 text-zinc-700" />
                  Câmbio / Transmissão
                </span>
                {transmission && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 capitalize">
                    {transmission}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: '', label: 'Indif.' },
                  { id: 'manual', label: 'Manual' },
                  { id: 'automatico', label: 'Autom.' },
                  { id: 'automatizado', label: 'Robô' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTransmission(t.id as any)}
                    className={`text-xs py-1.5 rounded border font-medium truncate ${
                      transmission === t.id ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DIREÇÃO */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-700" />
                  Sistema de Direção
                </span>
                {steering && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 capitalize">
                    {steering}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: '', label: 'Indif.' },
                  { id: 'hidraulica', label: 'Hidrául.' },
                  { id: 'eletrica', label: 'Elétr.' },
                  { id: 'mecanica', label: 'Mecân.' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSteering(st.id as any)}
                    className={`text-xs py-1.5 rounded border font-medium truncate ${
                      steering === st.id ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* COMBUSTÍVEL */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-zinc-700" />
                  Combustível
                </span>
                {fuel && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
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
                    className={`text-xs py-1 rounded border font-medium ${
                      fuel === f ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    {f === '' ? 'Indif.' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* POSIÇÃO / LADO */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-zinc-700" />
                  Posição / Lado
                </span>
                {position && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {position}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: '', label: 'Indif.' },
                  { id: 'Dianteiro', label: 'Dianteiro' },
                  { id: 'Traseiro', label: 'Traseiro' },
                  { id: 'Lado Direito (LD)', label: 'LD' },
                  { id: 'Lado Esquerdo (LE)', label: 'LE' },
                  { id: 'Par (Ambos os lados)', label: 'Par' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id)}
                    className={`text-xs py-1 rounded border font-medium truncate ${
                      position === pos.id ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AR CONDICIONADO */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-zinc-700" />
                  Ar-Condicionado
                </span>
                {airConditioning && (
                  <span className="text-[10px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {airConditioning === 'com_ar' ? 'Com Ar' : 'Sem Ar'}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAirConditioning('')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    airConditioning === '' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Indif.
                </button>
                <button
                  type="button"
                  onClick={() => setAirConditioning('com_ar')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    airConditioning === 'com_ar' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Com Ar
                </button>
                <button
                  type="button"
                  onClick={() => setAirConditioning('sem_ar')}
                  className={`text-xs py-1.5 rounded border font-medium ${
                    airConditioning === 'sem_ar' ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                  }`}
                >
                  Sem Ar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. OBSERVAÇÕES ADICIONAIS DO BALCÃO */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
          <label className="block text-xs font-black text-zinc-900 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-950">
              <FileText className="w-4 h-4 text-zinc-700" />
              Observações Adicionais do Balcão (opcional)
            </span>
            <span className="text-[11px] text-zinc-500 font-normal">Ex: Amostra na mão, gravado na peça...</span>
          </label>
          <input
            id="input-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Cliente com pastilha gasta na bancada, conferir se é sistema Teves ou Mando..."
            className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 focus:border-zinc-950 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 text-zinc-900 transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-950 shrink-0"></span>
            <span>
              A busca pesquisa nos catálogos oficiais das <strong>44 marcas parceiras</strong> e gera os 6 tópicos do balcão.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasAnyData && (
              <button
                id="btn-form-clear-bottom"
                type="button"
                onClick={handleResetAll}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 text-zinc-600" />
                <span>Limpar</span>
              </button>
            )}

            <button
              id="btn-submit-query"
              type="submit"
              disabled={isLoading || !part.trim() || (!model.trim() && !brand.trim())}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Consultando Catálogos Oficiais...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-zinc-100" />
                  <span>Consultar Catálogo de Autopeças</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset vehicle shortcuts */}
      <div className="mt-6 pt-5 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-800" />
            Aplicações Frequentes em Rio Claro (Carregamento Rápido):
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">1 clique para preencher</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              disabled={isLoading}
              className="text-left p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-400 transition-all text-xs shadow-2xs"
            >
              <div className="font-bold text-zinc-900 truncate">
                {p.vehicle}
              </div>
              <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                {p.part}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
