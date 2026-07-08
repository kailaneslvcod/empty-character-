export interface Relationship {
  name: string;
  relation: string; // 'Aliado' | 'Inimigo' | 'Família' | 'Outro'
  characterId?: string; // Optional link to another character in the system
}

export interface Character {
  id: string;
  name: string;
  nickname?: string;
  title?: string;
  avatarUrl?: string; // Main image
  bannerUrl?: string; // Banner image
  gallery?: string[]; // Image gallery URLs/Base64
  summary: string;
  history?: string;
  personality?: string;
  appearance?: string;
  
  // Attributes
  age?: string;
  height?: string;
  weight?: string;
  gender?: string;
  race?: string;
  species?: string;
  charClass?: string; // "class" is reserved
  level?: string;
  status?: string; // e.g. "Ativo", "Inativo", "Desaparecido", "Falecido"
  alignment?: string; // e.g. "Neutro", "Leal e Bom", etc.
  element?: string;
  
  // Affiliations
  affiliation?: string;
  organization?: string;
  faction?: string;
  profession?: string;
  occupation?: string;
  
  // Combat & Abilities
  powers?: string;
  abilities?: string;
  weaknesses?: string;
  equipments?: string;
  weapons?: string;
  inventory?: string;
  
  // Relationships
  relationships?: Relationship[];
  
  // Extra
  trivia?: string[];
  quotes?: string[];
  notes?: string;
  
  // System fields
  tags: string[];
  category: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isFavorite: boolean;
  createdBy: string; // User ID
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
