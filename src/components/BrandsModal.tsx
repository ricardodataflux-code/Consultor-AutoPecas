import React, { useState } from 'react';
import { X, Search, BookOpen, ShieldCheck, Tag } from 'lucide-react';
import { CATALOG_BRANDS } from '../data/catalogBrands';

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
      b.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold">Catálogo de Marcas de Referência</h2>
              <p className="text-xs text-slate-400">
                Marcas oficiais do mercado de reposição e fornecedores homologados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar marca ou produto (ex: LUK, Nakata, Cofap, Embreagem, Pastilha)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brands List */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBrands.map((brand) => (
            <div
              key={brand.name}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-900 tracking-wide">
                    {brand.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {brand.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{brand.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span>Total: {filteredBrands.length} marcas catalogadas</span>
            <button
              type="button"
              className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition-colors"
              onClick={() => {
                alert('Funcionalidade de adicionar novo catálogo será implementada em breve.');
              }}
            >
              + Adicionar Catálogo
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
