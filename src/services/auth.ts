import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseEnabled } from "../firebase/config";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isOffline: boolean;
}

const LOCAL_USER_KEY = "empty_character_local_user";

// Keep track of active subscribers for auth state
type AuthCallback = (user: UserProfile | null) => void;
const subscribers: Set<AuthCallback> = new Set();
let currentUser: UserProfile | null = null;

// Initialize from local storage if offline
const loadLocalUser = (): UserProfile | null => {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  if (data) {
    try {
      return JSON.parse(data) as UserProfile;
    } catch (e) {
      console.error(e);
    }
  }
  return null;
};

currentUser = loadLocalUser();

// Notify all subscribers of auth changes
const notifySubscribers = () => {
  subscribers.forEach((cb) => cb(currentUser));
};

// Listen to real Firebase Auth changes if enabled
if (isFirebaseEnabled && auth) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      currentUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
        isOffline: false,
      };
    } else {
      currentUser = loadLocalUser(); // Fallback to local user if logged out of Firebase but has local session
    }
    notifySubscribers();
  });
}

export const subscribeToAuth = (callback: AuthCallback): (() => void) => {
  subscribers.add(callback);
  callback(currentUser); // Immediately trigger with current state
  return () => {
    subscribers.delete(callback);
  };
};

export const getActiveUser = (): UserProfile | null => {
  return currentUser;
};

export const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  if (isFirebaseEnabled && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    const profile: UserProfile = {
      uid: u.uid,
      email: u.email || "",
      displayName: u.displayName || u.email?.split("@")[0] || "Usuário",
      isOffline: false,
    };
    currentUser = profile;
    notifySubscribers();
    return profile;
  } else {
    // Simulated Local Login
    if (password.length < 4) {
      throw new Error("Senha deve ter no mínimo 4 caracteres para teste offline.");
    }
    const profile: UserProfile = {
      uid: "local_user_" + email.replace(/[^a-zA-Z0-9]/g, "_"),
      email: email,
      displayName: email.split("@")[0],
      isOffline: true,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    currentUser = profile;
    notifySubscribers();
    return profile;
  }
};

export const signupWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> => {
  if (isFirebaseEnabled && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    await updateProfile(u, { displayName });
    const profile: UserProfile = {
      uid: u.uid,
      email: u.email || "",
      displayName: displayName,
      isOffline: false,
    };
    currentUser = profile;
    notifySubscribers();
    return profile;
  } else {
    // Simulated Local Signup
    const profile: UserProfile = {
      uid: "local_user_" + email.replace(/[^a-zA-Z0-9]/g, "_"),
      email: email,
      displayName: displayName,
      isOffline: true,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    currentUser = profile;
    notifySubscribers();
    return profile;
  }
};

export const logoutUser = async (): Promise<void> => {
  if (isFirebaseEnabled && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Erro ao deslogar do Firebase", e);
    }
  }
  
  localStorage.removeItem(LOCAL_USER_KEY);
  currentUser = null;
  notifySubscribers();
};
