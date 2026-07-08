import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { FirebaseConfig } from "../types";

const CONFIG_KEY = "empty_character_firebase_config";

// Default config from environment variables (if any)
const getEnvConfig = (): FirebaseConfig | null => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: authDomain || "",
      projectId,
      storageBucket: storageBucket || "",
      messagingSenderId: messagingSenderId || "",
      appId: appId || "",
    };
  }
  return null;
};

// Retrieve config (either localStorage or env)
export const getActiveFirebaseConfig = (): FirebaseConfig | null => {
  const localConfigStr = localStorage.getItem(CONFIG_KEY);
  if (localConfigStr) {
    try {
      return JSON.parse(localConfigStr) as FirebaseConfig;
    } catch (e) {
      console.error("Erro ao carregar config local do Firebase", e);
    }
  }
  return getEnvConfig();
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isFirebaseEnabled = false;

const config = getActiveFirebaseConfig();

if (config && config.apiKey && config.projectId) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseEnabled = true;
    console.log("Firebase inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o Firebase com as credenciais fornecidas:", error);
  }
}

export { app, auth, db, storage, isFirebaseEnabled };

export const saveFirebaseConfig = (newConfig: FirebaseConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  window.location.reload();
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
  window.location.reload();
};
