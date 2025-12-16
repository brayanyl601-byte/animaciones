import React, { useState } from 'react';
import { AnimationAsset, Category, CategoryLabels } from '../types';
import { AssetCard } from './AssetCard';
import { FolderOpen, Video, MonitorPlay, Sparkles } from 'lucide-react';

interface DashboardProps {
  assets: AnimationAsset[];
}

export const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');

  const filteredAssets = activeCategory === 'ALL' 
    ? assets 
    : assets.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans relative">
      
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full z-10 shadow-xl overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950 sticky top-0 z-20">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0">
            <MonitorPlay size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Stream Assets</h1>
            <p className="text-[10px] text-slate-500 font-medium">Galería de Animaciones</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
              activeCategory === 'ALL' 
                ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FolderOpen size={18} />
            Todas las Animaciones
          </button>

          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Categorías
          </div>
          
          <div className="space-y-1">
            {Object.keys(CategoryLabels).map((catKey) => {
              const cat = catKey as Category;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors border-l-2 ${
                    activeCategory === cat 
                      ? 'bg-slate-800 text-white border-purple-500' 
                      : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {CategoryLabels[cat]}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer: Instrucciones Simples */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded border border-purple-500/30 p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Sparkles size={14} />
                <span className="text-[11px] font-bold">¿Cómo agregar más?</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                Sube tus archivos a la carpeta en tu PC:
              </p>
              <code className="block bg-black/40 p-1.5 rounded text-[10px] text-purple-300 font-mono mb-2 text-center border border-purple-500/20">
                src/animaciones
              </code>
              <p className="text-[9px] text-slate-500 leading-tight">
                Usa nombres como "intro", "fin", "donacion" y el sistema los ordenará solo.
              </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-purple-500 font-bold tracking-wider text-xs uppercase mb-1 block">
              Vista de Galería
            </span>
            <h2 className="text-4xl font-bold text-white mb-2">
              {activeCategory === 'ALL' ? 'Vista General' : CategoryLabels[activeCategory]}
            </h2>
            <p className="text-slate-400 text-sm">
              {filteredAssets.length} {filteredAssets.length === 1 ? 'animación disponible' : 'animaciones disponibles'}
            </p>
          </div>
        </header>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 bg-slate-900/50">
            <Video size={64} className="mb-6 opacity-30" />
            <p className="text-xl font-medium text-slate-400">Carpeta Vacía</p>
            <p className="text-sm mt-2 max-w-md text-center">
              No hay archivos en <code>src/animaciones</code> que coincidan con esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredAssets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};