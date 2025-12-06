
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
 * 3. Ponles nombres descriptivos. El sistema detectará la categoría según el nombre:
 *    - Si contiene "intro" o "inicio" -> Se va a INTRO.
 *    - Si contiene "fin" o "ending" -> Se va a FINAL.
 *    - Si contiene "donacion" o "alerta" -> Se va a DONACIONES.
 *    - Si contiene "camara" o "webcam" -> Se va a MARCO DE CÁMARA.
 *    - Si contiene "brb" o "espera" -> Se va a YA VUELVO.
 */

// 1. Esta función mágica busca todos los archivos en la carpeta src/animaciones
// Usamos './animaciones' asumiendo que este archivo constants.ts está en 'src/'
// NOTA: Se ha agregado 'svg' a la lista de extensiones permitidas.
const assetsFiles = (import.meta as any).glob('./animaciones/*.{mp4,webm,png,gif,jpg,jpeg,svg}', { 
  eager: true, 
  query: '?url',
  import: 'default' 
});

// Función auxiliar para adivinar la categoría por el nombre
const guessCategory = (fileName: string): Category => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('intro') || lowerName.includes('inicio')) return Category.SCENE_INTRO;
  if (lowerName.includes('fin') || lowerName.includes('ending') || lowerName.includes('cierre')) return Category.SCENE_ENDING;
  if (lowerName.includes('donacion') || lowerName.includes('alerta') || lowerName.includes('alert') || lowerName.includes('follow') || lowerName.includes('sub')) return Category.ALERTS_DONATION;
  if (lowerName.includes('brb') || lowerName.includes('espera') || lowerName.includes('vuelvo')) return Category.SCENE_BRB;
  if (lowerName.includes('camara') || lowerName.includes('cam') || lowerName.includes('webcam') || lowerName.includes('marco')) return Category.OVERLAY_CAM;
  
  return Category.SCENE_INTRO; // Categoría por defecto si no sabe qué es
};

// Función para determinar si es Video o Imagen
const guessType = (path: string): AssetType => {
  const extension = path.split('.').pop()?.toLowerCase();
  if (['mp4', 'webm', 'mov'].includes(extension || '')) return AssetType.VIDEO;
  if (['gif'].includes(extension || '')) return AssetType.GIF;
  return AssetType.IMAGE;
};

// Función para hacer el título bonito (ej: 'mi-video-intro.mp4' -> 'Mi Video Intro')
const formatTitle = (fileName: string): string => {
  // Quitar extensión
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  // Reemplazar guiones y guiones bajos con espacios
  const withSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
  // Capitalizar primera letra de cada palabra
  return withSpaces.replace(/\b\w/g, l => l.toUpperCase());
};

// 2. Procesamos los archivos encontrados para crear la lista automáticamente
export const INITIAL_ASSETS: AnimationAsset[] = Object.entries(assetsFiles).map(([path, url]) => {
  // Extraemos el nombre del archivo de la ruta
  const fileName = path.split('/').pop() || 'archivo-desconocido';
  
  return {
    id: fileName.replace(/\./g, '-'), // ID único basado en el nombre
    title: formatTitle(fileName),
    category: guessCategory(fileName),
    type: guessType(fileName),
    src: url as string, // La URL generada automáticamente por Vite
    loop: true, // Por defecto todo en loop (puedes cambiarlo si quieres)
  };
});

// Si la carpeta está vacía, añadimos un ejemplo de internet para que no se vea vacío el sitio
if (INITIAL_ASSETS.length === 0) {
  // Solo se muestra si NO hay archivos en la carpeta
  console.log("No se encontraron archivos en src/animaciones. Mostrando demo.");
}
