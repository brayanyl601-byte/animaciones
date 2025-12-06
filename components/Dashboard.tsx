
import React, { useState, useRef } from 'react';
import { AnimationAsset, Category, CategoryLabels, AssetType } from '../types';
import { AssetCard } from './AssetCard';
import { LoginModal } from './Login';
import { Upload, MonitorPlay, FolderOpen, Video, Github, Lock, Unlock, LogOut, Link as LinkIcon, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
  assets: AnimationAsset[];
  setAssets: React.Dispatch<React.SetStateAction<AnimationAsset[]>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ assets, setAssets }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [isAdmin, setIsAdmin] = useState(false); // Estado de modo edición
  const [showLogin, setShowLogin] = useState(false); // Mostrar modal de login
  const [externalUrl, setExternalUrl] = useState(''); // Para el generador de links
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = activeCategory === 'ALL' 
    ? assets 
    : assets.filter(a => a.category === activeCategory);

  const handleDelete = (id: string) => {
    // Mensaje claro explicando que esto NO borra el archivo de GitHub
    const confirmMessage = `⚠️ ATENCIÓN:\n\nEsta acción solo OCULTARÁ la animación de tu vista actual.\n\nComo esto es una página web estática, NO PUEDO borrar el archivo real de tu GitHub.\n\nPara borrarlo permanentemente:\n1. Ve a tu carpeta 'src/animaciones' en tu PC.\n2. Borra el archivo.\n3. Sube los cambios a GitHub.\n\n¿Quieres ocultarlo por ahora?`;
    
    if (confirm(confirmMessage)) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a local URL for previewing
    const objectUrl = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? AssetType.VIDEO : AssetType.IMAGE;
    
    const newAsset: AnimationAsset = {
      id: `temp-${Date.now()}`,
      title: `${file.name} (Solo Local)`,
      category: activeCategory === 'ALL' ? Category.ALERTS_DONATION : activeCategory,
      type: type,
      src: objectUrl,
      loop: type === AssetType.VIDEO
    };

    setAssets(prev => [newAsset, ...prev]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    alert("NOTA: Este archivo solo es visible en TU navegador actual. Para usarlo permanentemente, arrástralo a la carpeta 'src/animaciones' en tu código.");
  };

  const generateExternalLink = () => {
    if (!externalUrl) return;
    const baseUrl = window.location.href.split('#')[0];
    const link = `${baseUrl}#/overlay/custom?src=${encodeURIComponent(externalUrl)}&type=VIDEO`;
    navigator.clipboard.writeText(link);
    alert("¡Link copiado! Pégalo en OBS. \n\nNota: Asegúrate de que la URL que pusiste sea un archivo directo.");
    setExternalUrl('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans relative">
      {/* Login Modal Overlay */}
      {showLogin && (
        <LoginModal 
          onSuccess={() => {
            setIsAdmin(true);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full z-10 shadow-xl overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950 sticky top-0 z-20">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0">
            <MonitorPlay size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Stream Assets</h1>
            <p className="text-[10px] text-slate-500 font-medium">Gestor de Overlays OBS</p>
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

        {/* Footer Area: Admin Controls */}
        <div className={`p-4 border-t border-slate-800 transition-colors ${isAdmin ? 'bg-purple-900/10' : 'bg-slate-900/50'}`}>
           
           {!isAdmin ? (
             <button 
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-medium transition-all py-3 border border-dashed border-slate-700 hover:border-slate-500"
             >
               <Lock size={14} />
               Acceso Administrador
             </button>
           ) : (
             <div className="animate-in slide-in-from-bottom-5 duration-300 fade-in space-y-4">
               <div className="flex items-center justify-between px-1">
                 <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                   <Unlock size={10} />
                   Modo Editor
                 </span>
                 <button 
                  onClick={() => setIsAdmin(false)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="Salir del modo editor"
                 >
                   <LogOut size={14} />
                 </button>
               </div>

                {/* AUTOMATIC UPLOAD INSTRUCTIONS */}
               <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded border border-purple-500/30 p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Sparkles size={14} />
                    <span className="text-[11px] font-bold">Carga Automática</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                    Solo arrastra tus videos a la carpeta:
                  </p>
                  <code className="block bg-black/40 p-1.5 rounded text-[10px] text-purple-300 font-mono mb-2 text-center border border-purple-500/20">
                    src/animaciones
                  </code>
                  <p className="text-[9px] text-slate-500 leading-tight">
                    * Pon palabras clave en el nombre (ej: "intro", "donacion") para que se clasifiquen solas.
                  </p>
               </div>

               {/* External Link Tool */}
               <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 shadow-lg">
                 <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <LinkIcon size={14} />
                    <span className="text-[11px] font-bold">Link de Prueba</span>
                  </div>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[10px] text-white focus:border-blue-500 outline-none"
                    />
                    <button 
                      onClick={generateExternalLink}
                      disabled={!externalUrl}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded px-2 flex items-center justify-center"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
               </div>

               {/* Local Upload (Preview) */}
               <div className="bg-slate-800/50 p-3 rounded-xl border border-dashed border-slate-700 opacity-60 hover:opacity-100 transition-opacity">
                  <h4 className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <Upload size={12} />
                    Prueba Rápida (Solo RAM)
                  </h4>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="video/*,image/*"
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold text-slate-300"
                  >
                    Seleccionar Archivo
                  </button>
               </div>

             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-purple-500 font-bold tracking-wider text-xs uppercase mb-1 block">
              Galería Activa
            </span>
            <h2 className="text-4xl font-bold text-white mb-2">
              {activeCategory === 'ALL' ? 'Vista General' : CategoryLabels[activeCategory]}
            </h2>
            <p className="text-slate-400 text-sm">
              {filteredAssets.length} {filteredAssets.length === 1 ? 'animación detectada' : 'animaciones detectadas'}
            </p>
          </div>
        </header>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 bg-slate-900/50">
            <Video size={64} className="mb-6 opacity-30" />
            <p className="text-xl font-medium text-slate-400">Carpeta Vacía</p>
            <p className="text-sm mt-2 max-w-md text-center">
              No se encontraron videos en <code>src/animaciones</code> que coincidan con esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredAssets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
