export enum AssetType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  GIF = 'GIF'
}

export enum Category {
  ALERTS_DONATION = 'ALERTS_DONATION',
  ALERTS_FOLLOWER = 'ALERTS_FOLLOWER',
  ALERTS_SUB = 'ALERTS_SUB',
  SCENE_INTRO = 'SCENE_INTRO',
  SCENE_ENDING = 'SCENE_ENDING',
  SCENE_BRB = 'SCENE_BRB',
  OVERLAY_CAM = 'OVERLAY_CAM'
}

export interface AnimationAsset {
  id: string;
  title: string;
  category: Category;
  type: AssetType;
  src: string; // URL o path local
  width?: number;
  height?: number;
  loop?: boolean;
}

export const CategoryLabels: Record<Category, string> = {
  [Category.ALERTS_DONATION]: 'Donaciones',
  [Category.ALERTS_FOLLOWER]: 'Nuevos Seguidores',
  [Category.ALERTS_SUB]: 'Suscriptores',
  [Category.SCENE_INTRO]: 'Inicio de Stream',
  [Category.SCENE_ENDING]: 'Fin de Stream',
  [Category.SCENE_BRB]: 'Ya Vuelvo (BRB)',
  [Category.OVERLAY_CAM]: 'Marco de Cámara',
};