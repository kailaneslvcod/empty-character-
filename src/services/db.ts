import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseEnabled } from "../firebase/config";
import { Character, Category, Tag } from "../types";

// Local storage keys
const CHARACTERS_KEY = "empty_character_list";
const CATEGORIES_KEY = "empty_character_categories";
const TAGS_KEY = "empty_character_tags";

// Mock collections for fallback
const DEFAULT_CATEGORIES: Category[] = [
  { id: "geral", name: "Geral", createdAt: new Date().toISOString() },
  { id: "fantasia", name: "Fantasia", createdAt: new Date().toISOString() },
  { id: "sci-fi", name: "Sci-Fi", createdAt: new Date().toISOString() },
  { id: "cyberpunk", name: "Cyberpunk", createdAt: new Date().toISOString() },
  { id: "terror", name: "Terror", createdAt: new Date().toISOString() },
  { id: "historico", name: "Histórico", createdAt: new Date().toISOString() },
];

const DEFAULT_TAGS: Tag[] = [
  { id: "protagonista", name: "Protagonista", createdAt: new Date().toISOString() },
  { id: "antagonista", name: "Antagonista", createdAt: new Date().toISOString() },
  { id: "mago", name: "Mago", createdAt: new Date().toISOString() },
  { id: "guerreiro", name: "Guerreiro", createdAt: new Date().toISOString() },
  { id: "humano", name: "Humano", createdAt: new Date().toISOString() },
  { id: "elfo", name: "Elfo", createdAt: new Date().toISOString() },
  { id: "ciborgue", name: "Ciborgue", createdAt: new Date().toISOString() },
];

// Base64 to Blob helper
const base64ToBlob = (base64DataUrl: string): Blob => {
  const arr = base64DataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Upload de imagem para o Firebase Storage se configurado, ou fallback para retornar a própria base64
 */
export const uploadImageToStorage = async (
  base64DataUrl: string,
  userId: string,
  pathSegment: string
): Promise<string> => {
  if (!base64DataUrl.startsWith("data:")) {
    return base64DataUrl; // Já é uma URL externa ou caminho estático
  }

  if (isFirebaseEnabled && storage && userId) {
    try {
      const blob = base64ToBlob(base64DataUrl);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
      const storageRef = ref(storage, `users/${userId}/${pathSegment}/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.warn("Falha ao subir para Firebase Storage, utilizando Base64 local:", error);
      return base64DataUrl;
    }
  }

  return base64DataUrl;
};

/* ==========================================================================
   CRUD - PERSONAGENS
   ========================================================================== */

export const getCharacters = async (userId: string | null): Promise<Character[]> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      const q = query(collection(db, "characters"), where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);
      const chars: Character[] = [];
      querySnapshot.forEach((docSnap) => {
        chars.push({ id: docSnap.id, ...docSnap.data() } as Character);
      });
      return chars;
    } catch (error) {
      console.error("Erro ao buscar personagens do Firestore, usando LocalStorage:", error);
    }
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(CHARACTERS_KEY);
  if (localData) {
    try {
      const allChars = JSON.parse(localData) as Character[];
      if (userId) {
        return allChars.filter((c) => c.createdBy === userId || !c.createdBy);
      }
      return allChars;
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const saveCharacter = async (
  character: Character,
  userId: string | null
): Promise<Character> => {
  const currentUserId = userId || "guest_user";
  const updatedChar = {
    ...character,
    createdBy: currentUserId,
    updatedAt: new Date().toISOString(),
  };

  // Se for novo, gera ID se não tiver
  if (!updatedChar.id) {
    updatedChar.id = `char_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    updatedChar.createdAt = new Date().toISOString();
  }

  // 1. Processamento de imagens assíncrono (avatar, banner, galeria) se houver novas imagens base64
  if (updatedChar.avatarUrl && updatedChar.avatarUrl.startsWith("data:")) {
    updatedChar.avatarUrl = await uploadImageToStorage(updatedChar.avatarUrl, currentUserId, "avatars");
  }
  if (updatedChar.bannerUrl && updatedChar.bannerUrl.startsWith("data:")) {
    updatedChar.bannerUrl = await uploadImageToStorage(updatedChar.bannerUrl, currentUserId, "banners");
  }
  if (updatedChar.gallery && updatedChar.gallery.length > 0) {
    const processedGallery: string[] = [];
    for (const img of updatedChar.gallery) {
      if (img.startsWith("data:")) {
        const url = await uploadImageToStorage(img, currentUserId, "gallery");
        processedGallery.push(url);
      } else {
        processedGallery.push(img);
      }
    }
    updatedChar.gallery = processedGallery;
  }

  // 2. Salvar no Firebase Firestore se ativado
  if (isFirebaseEnabled && db && userId) {
    try {
      await setDoc(doc(db, "characters", updatedChar.id), updatedChar);
      // Salva localmente também para manter cache atualizado
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  }

  // 3. Salvar no LocalStorage (sempre mantém cópia local ou funciona de fallback completo)
  const localData = localStorage.getItem(CHARACTERS_KEY);
  let allChars: Character[] = [];
  if (localData) {
    try {
      allChars = JSON.parse(localData) as Character[];
    } catch (e) {
      console.error(e);
    }
  }

  const existingIndex = allChars.findIndex((c) => c.id === updatedChar.id);
  if (existingIndex >= 0) {
    allChars[existingIndex] = updatedChar;
  } else {
    allChars.push(updatedChar);
  }

  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(allChars));
  return updatedChar;
};

export const deleteCharacter = async (id: string, userId: string | null): Promise<boolean> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      await deleteDoc(doc(db, "characters", id));
    } catch (error) {
      console.error("Erro ao deletar no Firestore:", error);
    }
  }

  const localData = localStorage.getItem(CHARACTERS_KEY);
  if (localData) {
    try {
      const allChars = JSON.parse(localData) as Character[];
      const filtered = allChars.filter((c) => c.id !== id);
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  return false;
};

/* ==========================================================================
   CRUD - CATEGORIAS
   ========================================================================== */

export const getCategories = async (userId: string | null): Promise<Category[]> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      const q = query(collection(db, "categories"));
      const querySnapshot = await getDocs(q);
      const list: Category[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      if (list.length > 0) return list;
    } catch (error) {
      console.error("Erro ao buscar categorias do Firestore, usando LocalStorage:", error);
    }
  }

  const localData = localStorage.getItem(CATEGORIES_KEY);
  if (localData) {
    try {
      return JSON.parse(localData) as Category[];
    } catch (e) {
      console.error(e);
    }
  }

  // Se não houver nada local, salvar as default e retornar
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

export const saveCategory = async (category: Category, userId: string | null): Promise<Category> => {
  const updatedCategory = { ...category };
  if (!updatedCategory.id) {
    updatedCategory.id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  if (isFirebaseEnabled && db && userId) {
    try {
      await setDoc(doc(db, "categories", updatedCategory.id), updatedCategory);
    } catch (error) {
      console.error("Erro ao salvar categoria no Firestore:", error);
    }
  }

  const list = await getCategories(userId);
  const existingIndex = list.findIndex((c) => c.id === updatedCategory.id);
  if (existingIndex >= 0) {
    list[existingIndex] = updatedCategory;
  } else {
    list.push(updatedCategory);
  }

  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
  return updatedCategory;
};

export const deleteCategory = async (id: string, userId: string | null): Promise<boolean> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Erro ao deletar categoria no Firestore:", error);
    }
  }

  const list = await getCategories(userId);
  const filtered = list.filter((c) => c.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
  return true;
};

/* ==========================================================================
   CRUD - TAGS
   ========================================================================== */

export const getTags = async (userId: string | null): Promise<Tag[]> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      const q = query(collection(db, "tags"));
      const querySnapshot = await getDocs(q);
      const list: Tag[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Tag);
      });
      if (list.length > 0) return list;
    } catch (error) {
      console.error("Erro ao buscar tags do Firestore, usando LocalStorage:", error);
    }
  }

  const localData = localStorage.getItem(TAGS_KEY);
  if (localData) {
    try {
      return JSON.parse(localData) as Tag[];
    } catch (e) {
      console.error(e);
    }
  }

  localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
  return DEFAULT_TAGS;
};

export const saveTag = async (tag: Tag, userId: string | null): Promise<Tag> => {
  const updatedTag = { ...tag };
  if (!updatedTag.id) {
    updatedTag.id = `tag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  if (isFirebaseEnabled && db && userId) {
    try {
      await setDoc(doc(db, "tags", updatedTag.id), updatedTag);
    } catch (error) {
      console.error("Erro ao salvar tag no Firestore:", error);
    }
  }

  const list = await getTags(userId);
  const existingIndex = list.findIndex((t) => t.id === updatedTag.id);
  if (existingIndex >= 0) {
    list[existingIndex] = updatedTag;
  } else {
    list.push(updatedTag);
  }

  localStorage.setItem(TAGS_KEY, JSON.stringify(list));
  return updatedTag;
};

export const deleteTag = async (id: string, userId: string | null): Promise<boolean> => {
  if (isFirebaseEnabled && db && userId) {
    try {
      await deleteDoc(doc(db, "tags", id));
    } catch (error) {
      console.error("Erro ao deletar tag no Firestore:", error);
    }
  }

  const list = await getTags(userId);
  const filtered = list.filter((t) => t.id !== id);
  localStorage.setItem(TAGS_KEY, JSON.stringify(filtered));
  return true;
};
