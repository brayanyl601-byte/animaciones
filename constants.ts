
import { AnimationAsset, AssetType, Category } from './types';

/**
 * --- CARGADOR AUTOMÁTICO DE ANIMACIONES (SMART LOADER) ---
 * 
 * YA NO NECESITAS EDITAR ESTE ARCHIVO MANUALMENTE.
 * 
 * INSTRUCCIONES:
 * 1. Crea una carpeta llamada 'animaciones' DENTRO de la carpeta 'src'.
 *    Ruta completa: src/animaciones/
 * 2. Arrastra tus archivos ahí.
 * 3. Ponles nombres descriptivos.
 */

// 1. Buscamos en AMBAS rutas posibles para evitar errores (dentro de src y en la raíz)
const assetsFiles = (import.meta as any).glob(['./src/animaciones/*.{mp4,webm,png,gif,jpg,jpeg,svg}', './animaciones/*.{mp4,webm,png,gif,jpg,jpeg,svg}'], { 
  eager: true, 
  query: '?url',
  import: 'default' 
});

// Función auxiliar para adivinar la categoría por el nombre de forma precisa
const guessCategory = (fileName: string): Category => {
  const lowerName = fileName.toLowerCase();
  
  // Lógica de Prioridad (El orden importa)
  
  // 1. Escenas Principales
  if (lowerName.includes('intro') || lowerName.includes('inicio') || lowerName.includes('comienzo')) return Category.SCENE_INTRO;
  if (lowerName.includes('fin') || lowerName.includes('ending') || lowerName.includes('cierre') || lowerName.includes('off')) return Category.SCENE_ENDING;
  if (lowerName.includes('brb') || lowerName.includes('espera') || lowerName.includes('vuelvo') || lowerName.includes('pausa')) return Category.SCENE_BRB;
  
  // 2. Elementos Visuales
  if (lowerName.includes('camara') || lowerName.includes('cam') || lowerName.includes('webcam') || lowerName.includes('marco') || lowerName.includes('frame')) return Category.OVERLAY_CAM;
  
  // 3. Alertas Específicas
  if (lowerName.includes('follow') || lowerName.includes('seguidor')) return Category.ALERTS_FOLLOWER;
  if (lowerName.includes('sub') || lowerName.includes('suscri') || lowerName.includes('prime')) return Category.ALERTS_SUB;
  
  // 4. Donaciones y Alertas Generales
  // Si dice "alerta" y no especificó qué tipo, lo mandamos aquí también para que no se pierda.
  if (lowerName.includes('donacion') || lowerName.includes('donation') || lowerName.includes('bit') || lowerName.includes('dinero') || lowerName.includes('tip') || lowerName.includes('alerta') || lowerName.includes('alert')) return Category.ALERTS_DONATION;
  
  // Categoría por defecto si no sabe qué es
  return Category.SCENE_INTRO; 
};

// Función para determinar si es Video o Imagen
const guessType = (path: string): AssetType => {
  const extension = path.split('.').pop()?.toLowerCase();
  if (['mp4', 'webm', 'mov'].includes(extension || '')) return AssetType.VIDEO;
  if (['gif'].includes(extension || '')) return AssetType.GIF;
  return AssetType.IMAGE;
};

// Función para hacer el título bonito
const formatTitle = (fileName: string): string => {
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
  return withSpaces.replace(/\b\w/g, l => l.toUpperCase());
};

// 2. Procesamos los archivos encontrados
const rawAssets: AnimationAsset[] = Object.entries(assetsFiles).map(([path, url]) => {
  const fileName = path.split('/').pop() || 'archivo-desconocido';
  
  return {
    id: fileName.replace(/\./g, '-'),
    title: formatTitle(fileName),
    category: guessCategory(fileName),
    type: guessType(fileName),
    src: url as string,
    loop: true,
  };
});

// 3. Ordenamos alfanuméricamente
export const INITIAL_ASSETS = rawAssets.sort((a, b) => {
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
});

if (INITIAL_ASSETS.length === 0) {
  console.log("⚠️ No se encontraron archivos. Asegúrate de ponerlos en 'src/animaciones/'");
}
