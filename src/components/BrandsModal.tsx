import React, { useState } from 'react';
import { X, Search, BookOpen, ShieldCheck, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { CATALOG_BRANDS, CatalogBrand } from '../data/catalogBrands';

interface BrandsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandsModal: React.FC<BrandsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  if (!isOpen) return null;

  const categories = ['Todas', ...Array.from(new Set(CATALOG_BRANDS.map((b) => b.category)))];

  const filteredBrands = CATALOG_BRANDS.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.salesPitch.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden text-zinc-900">
        {/* Header */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-tight">Catálogo das 44 Marcas Parceiras de Balcão</h2>
                <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded border border-zinc-700">
                  44 Marcas Prioritárias
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Argumentos técnicos de venda, prazos de garantia e catálogos eletrônicos oficiais
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

        {/* Filter bar */}
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar entre as 44 marcas (ex: LUK, Nakata, Monroe, Bosch, Embreagem, Pastilha, Correia)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all text-xs ${
                  selectedCategory === cat
                    ? 'bg-zinc-950 text-white font-black'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brands List */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-zinc-100">
          {filteredBrands.map((brand: CatalogBrand) => (
            <div
              key={brand.name}
              className="p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all flex flex-col justify-between shadow-xs space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="font-black text-base text-zinc-950 tracking-tight block">
                      {brand.name}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-600">
                      {brand.category}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-300 whitespace-nowrap">
                    {brand.oemStatus}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-2.5">
                  {brand.description}
                </p>

                {/* Argumento Técnico de Venda */}
                <div className="bg-zinc-50 rounded-lg p-2.5 border border-zinc-200 space-y-1 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1">
                    <Award className="w-3 h-3 text-zinc-800" />
                    Argumento Técnico de Balcão:
                  </span>
                  <p className="text-xs text-zinc-800 italic leading-snug font-medium">
                    "{brand.salesPitch}"
                  </p>
                </div>

                {/* Destaques Técnicos */}
                {brand.technicalHighlights && brand.technicalHighlights.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {brand.technicalHighlights.map((th, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-700">
                        <CheckCircle2 className="w-3 h-3 text-zinc-900 shrink-0" />
                        <span>{th}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warranty & Official Portal */}
              <div className="pt-2.5 border-t border-zinc-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-zinc-800 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                  <span className="font-bold">Garantia:</span> {brand.warranty}
                </div>
                {brand.portalUrl && (
                  <a
                    href={brand.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:text-zinc-600 underline shrink-0"
                  >
                    <span>Catálogo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
          <span>Total: <strong className="text-zinc-200">{filteredBrands.length}</strong> marcas cadastradas</span>
          <button
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
