import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; 
import { AnimationAsset, AssetType } from '../types';

interface OverlayProps {
  assets: AnimationAsset[];
}

export const Overlay: React.FC<OverlayProps> = ({ assets }) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [asset, setAsset] = useState<AnimationAsset | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Intentar buscar en la lista de assets guardados (constants.ts o subidos)
    const foundLocal = assets.find(a => a.id === id);

    if (foundLocal) {
      setAsset(foundLocal);
    } 
    // 2. Si no está en la lista, revisar si es un "Link Mágico" (URL externa pasada por parámetros)
    else if (searchParams.get('src')) {
      const src = searchParams.get('src');
      const typeParam = searchParams.get('type');
      
      setAsset({
        id: 'external-preview',
        title: 'Vista Previa Externa',
        // Asignamos una categoría por defecto, no importa para el overlay
        category:  'SCENE_INTRO' as any, 
        type: typeParam === 'IMAGE' ? AssetType.IMAGE : AssetType.VIDEO,
        src: src || '',
        loop: true
      });
    } 
    else {
      setError("Animación no encontrada. Verifica el ID o la URL.");
    }

    // Forzar transparencia para OBS
    document.body.classList.add('obs-transparent');
    document.documentElement.classList.add('obs-transparent');
    const root = document.getElementById('root');
    if (root) root.classList.add('obs-transparent');

    return () => {
      document.body.classList.remove('obs-transparent');
      document.documentElement.classList.remove('obs-transparent');
      if (root) root.classList.remove('obs-transparent');
    };
  }, [id, assets, searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-red-500 font-bold text-2xl bg-transparent p-4 text-center">
        ⚠️ {error}
      </div>
    );
  }

  if (!asset) return null;

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {asset.type === AssetType.VIDEO ? (
        <video
          src={asset.src}
          autoPlay
          muted={false} // Permitir audio si la animación lo tiene
          loop={asset.loop}
          playsInline
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <img
          src={asset.src}
          alt="Overlay"
          className="max-w-full max-h-full object-contain"
        />
      )}
    </div>
  );
};