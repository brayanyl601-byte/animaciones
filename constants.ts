
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
 * 3. Ponles nombres descriptivos usando palabras clave + números si quieres:
 *    
 *    EJEMPLOS VÁLIDOS:
 *    - "inicio 1.mp4", "inicio 2.mp4" -> Se van a Inicio
 *    - "donacion 1.webm", "donacion 2.webm" -> Se van a Donaciones
 *    - "camara v1.png", "camara v2.png" -> Se van a Cámara
 *
 *    PALABRAS CLAVE:
 *    - Intro: "intro", "inicio"
 *    - Fin: "fin", "ending", "cierre"
 *    - BRB: "brb", "espera", "vuelvo"
 *    - Cámara: "cam", "webcam", "marco"
 *    - Donación: "donacion", "bits", "dinero"
 *    - Seguidor: "follow", "seguidor"
 *    - Suscriptor: "sub", "prime"
 */

// 1. Esta función mágica busca todos los archivos en la carpeta src/animaciones
const assetsFiles = (import.meta as any).glob('./animaciones/*.{mp4,webm,png,gif,jpg,jpeg,svg}', { 
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
  
  // 4. Donaciones (Si dice donación, bits, dinero, etc.)
  if (lowerName.includes('donacion') || lowerName.includes('donation') || lowerName.includes('bit') || lowerName.includes('dinero') || lowerName.includes('tip')) return Category.ALERTS_DONATION;
  
  // Categoría por defecto si no sabe qué es (lo mandamos a Intro para que sea visible al menos)
  return Category.SCENE_INTRO; 
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
const rawAssets: AnimationAsset[] = Object.entries(assetsFiles).map(([path, url]) => {
  // Extraemos el nombre del archivo de la ruta
  const fileName = path.split('/').pop() || 'archivo-desconocido';
  
  return {
    id: fileName.replace(/\./g, '-'), // ID único basado en el nombre
    title: formatTitle(fileName),
    category: guessCategory(fileName),
    type: guessType(fileName),
    src: url as string, // La URL generada automáticamente por Vite
    loop: true, // Por defecto todo en loop
  };
});

// 3. Ordenamos alfanuméricamente (Para que "Inicio 1" vaya antes que "Inicio 2")
export const INITIAL_ASSETS = rawAssets.sort((a, b) => {
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
});

// Si la carpeta está vacía, añadimos un log
if (INITIAL_ASSETS.length === 0) {
  console.log("No se encontraron archivos en src/animaciones.");
}
