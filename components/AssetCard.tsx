
import React, { useState, useRef } from 'react';
import { AnimationAsset, AssetType, CategoryLabels } from '../types';
import { Copy, Check, ExternalLink, Trash2, Play, AlertCircle } from 'lucide-react';

interface AssetCardProps {
  asset: AnimationAsset;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete, isAdmin }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false); // Estado para detectar errores de carga
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generamos el link basado en la URL actual + el hash router
  const getObsLink = () => {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#/overlay/${asset.id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getObsLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPreview = () => {
    window.open(getObsLink(), '_blank', 'width=1280,height=720');
  };

  // Manejo del Hover para reproducir/pausar
  const handleMouseEnter = () => {
    if (asset.type === AssetType.VIDEO && videoRef.current && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => console.log("Reproducción automática prevenida:", error));
      }
    }
  };

  const handleMouseLeave = () => {
    if (asset.type === AssetType.VIDEO && videoRef.current && !hasError) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reinicia el video al principio
      setIsPlaying(false);
    }
  };

  return (
    <div className="group bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex flex-col">
      
      {/* AREA VISUAL: Video o Imagen */}
      <div 
        className="aspect-video bg-black/50 relative flex items-center justify-center overflow-hidden cursor-pointer border-b border-slate-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={!hasError ? handleOpenPreview : undefined}
        title={hasError ? "Error al cargar archivo" : "Clic para ver en grande"}
      >
        {hasError ? (
          <div className="flex flex-col items-center justify-center text-red-400 p-4 text-center">
            <AlertCircle size={32} className="mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Archivo Dañado</span>
          </div>
        ) : (
          <>
            {asset.type === AssetType.VIDEO ? (
              <>
                <video 
                  ref={videoRef}
                  src={asset.src} 
                  className="w-full h-full object-contain" 
                  muted 
                  loop 
                  playsInline
                  onError={() => setHasError(true)} // Detecta si el video falla
                />
                {/* Icono de Play SOLO visible cuando NO se reproduce */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="bg-black/60 backdrop-blur-sm p-3 rounded-full border border-white/10 shadow-xl">
                    <Play size={24} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </>
            ) : (
              <img 
                src={asset.src} 
                alt={asset.title} 
                className="w-full h-full object-contain" 
                onError={() => setHasError(true)} // Detecta si la imagen falla
              />
            )}
          </>
        )}
      </div>

      {/* AREA DE INFORMACIÓN Y CONTROLES */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Cabecera: Categoría + Botones de Acción */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-900/20 px-2 py-1 rounded border border-purple-500/20">
            {CategoryLabels[asset.category]}
          </span>

          <div className="flex items-center gap-2">
            {!hasError && (
              <button 
                onClick={handleOpenPreview}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="Abrir vista previa en ventana nueva"
              >
                <ExternalLink size={16} />
              </button>
            )}
            
            {isAdmin && (
              <button 
                onClick={() => onDelete(asset.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Ocultar (No borra el archivo)"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Título */}
        <h3 className={`font-medium text-base leading-tight mb-4 line-clamp-2 ${hasError ? 'text-red-400 line-through decoration-2' : 'text-white'}`} title={asset.title}>
          {asset.title}
        </h3>

        {/* Link OBS (Parte inferior) */}
        <div className="mt-auto">
          {!hasError ? (
            <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between gap-2 border border-slate-800 hover:border-slate-600 transition-colors group-hover:border-purple-500/30">
              <code className="text-[10px] text-slate-500 truncate flex-1 font-mono pl-1">
                .../overlay/{asset.id}
              </code>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-purple-600 hover:text-white'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Listo' : 'Copiar'}
              </button>
            </div>
          ) : (
            <div className="p-2.5 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
              <span className="text-[10px] text-red-400 font-bold uppercase">No disponible</span>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};
