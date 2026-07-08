import React, { useState, useEffect, useCallback } from "react";
import { ToastProvider, useToast } from "./components/Toast";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Dashboard } from "./components/Dashboard";
import { CharacterDetail } from "./pages/CharacterDetail";
import { CharacterForm } from "./components/CharacterForm";
import { FirebaseSettingsModal } from "./components/FirebaseSettingsModal";
import { AuthPage } from "./pages/AuthPage";
import { UserProfile, subscribeToAuth, logoutUser } from "./services/auth";
import {
  Character,
  Category,
  Tag,
} from "./types";
import {
  getCharacters,
  saveCharacter,
  deleteCharacter,
  getCategories,
  saveCategory,
  deleteCategory,
  getTags,
  saveTag,
  deleteTag,
} from "./services/db";

function AppContent() {
  const { showToast } = useToast();

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Business State
  const [characters, setCharacters] = useState<Character[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Selection & Navigation States
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "characters">("dashboard");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null | undefined>(undefined);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  // Subscribe to Authentication state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((profile) => {
      setUser(profile);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all business collections from DB
  const loadAllData = useCallback(async (userId: string | null) => {
    setIsLoadingData(true);
    try {
      const [charsList, catsList, tagsList] = await Promise.all([
        getCharacters(userId),
        getCategories(userId),
        getTags(userId),
      ]);
      setCharacters(charsList);
      setCategories(catsList);
      setTags(tagsList);
    } catch (e) {
      console.error("Erro ao carregar dados do banco:", e);
      showToast("Falha ao carregar registros do Codex", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, [showToast]);

  // Load data once user is loaded
  useEffect(() => {
    if (user) {
      loadAllData(user.uid);
    } else {
      setCharacters([]);
    }
  }, [user, loadAllData]);

  // Deep linking for shared characters
  useEffect(() => {
    if (characters.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const charId = params.get("charId");
      if (charId) {
        const found = characters.find((c) => c.id === charId);
        if (found) {
          setSelectedCharacter(found);
          setActiveTab("characters");
          // Clear query param without full page reload
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [characters]);

  // --- CRUD ACTIONS ---

  const handleSaveCharacter = async (char: Character) => {
    if (!user) return;
    const saved = await saveCharacter(char, user.uid);
    
    // Update local state list
    setCharacters((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      } else {
        return [...prev, saved];
      }
    });

    // If currently viewing this character, update selection too
    if (selectedCharacter && selectedCharacter.id === saved.id) {
      setSelectedCharacter(saved);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!user || !selectedCharacter) return;
    const success = await deleteCharacter(selectedCharacter.id, user.uid);
    if (success) {
      setCharacters((prev) => prev.filter((c) => c.id !== selectedCharacter.id));
      setSelectedCharacter(null);
      showToast("Personagem excluído com sucesso!", "success");
    } else {
      showToast("Falha ao excluir personagem.", "error");
    }
  };

  const handleDuplicateCharacter = async () => {
    if (!user || !selectedCharacter) return;
    
    try {
      showToast("Duplicando personagem no Codex...", "info");
      const duplicated: Character = {
        ...selectedCharacter,
        id: "", // clear ID for new creation
        name: `${selectedCharacter.name} (Cópia)`,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const saved = await saveCharacter(duplicated, user.uid);
      setCharacters((prev) => [...prev, saved]);
      setSelectedCharacter(saved); // view the duplicated copy
      showToast("Personagem duplicado com sucesso!", "success");
    } catch (e) {
      showToast("Erro ao duplicar personagem.", "error");
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, char: Character) => {
    e.stopPropagation(); // Avoid triggering card click
    if (!user) return;

    const updated = { ...char, isFavorite: !char.isFavorite };
    try {
      const saved = await saveCharacter(updated, user.uid);
      setCharacters((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      
      if (selectedCharacter && selectedCharacter.id === saved.id) {
        setSelectedCharacter(saved);
      }
      
      showToast(
        saved.isFavorite ? "Adicionado aos favoritos!" : "Removido dos favoritos.",
        "success"
      );
    } catch (e) {
      showToast("Erro ao favoritar.", "error");
    }
  };

  const handleToggleFavoriteDetail = async () => {
    if (!selectedCharacter || !user) return;
    const updated = { ...selectedCharacter, isFavorite: !selectedCharacter.isFavorite };
    try {
      const saved = await saveCharacter(updated, user.uid);
      setCharacters((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      setSelectedCharacter(saved);
      showToast(
        saved.isFavorite ? "Adicionado aos favoritos!" : "Removido dos favoritos.",
        "success"
      );
    } catch (e) {
      showToast("Erro ao favoritar.", "error");
    }
  };

  // --- CATEGORIES ---

  const handleAddCategory = async (name: string, desc?: string) => {
    if (!user) return;
    const newCat: Category = {
      id: "",
      name,
      description: desc,
      createdAt: new Date().toISOString(),
    };
    const saved = await saveCategory(newCat, user.uid);
    setCategories((prev) => [...prev, saved]);
    showToast(`Categoria "${name}" adicionada!`, "success");
  };

  const handleEditCategory = async (id: string, name: string) => {
    if (!user) return;
    const found = categories.find((c) => c.id === id);
    if (!found) return;

    const updated = { ...found, name };
    const saved = await saveCategory(updated, user.uid);
    setCategories((prev) => prev.map((c) => (c.id === id ? saved : c)));
    showToast(`Categoria atualizada para "${name}"!`, "success");
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user) return;
    const success = await deleteCategory(id, user.uid);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Categoria removida.", "success");
    }
  };

  // --- TAGS ---

  const handleAddTag = async (name: string) => {
    if (!user) return;
    const newTag: Tag = {
      id: "",
      name,
      createdAt: new Date().toISOString(),
    };
    const saved = await saveTag(newTag, user.uid);
    setTags((prev) => [...prev, saved]);
    showToast(`Tag #${name} criada!`, "success");
  };

  const handleEditTag = async (id: string, name: string) => {
    if (!user) return;
    const found = tags.find((t) => t.id === id);
    if (!found) return;

    const updated = { ...found, name };
    const saved = await saveTag(updated, user.uid);
    setTags((prev) => prev.map((t) => (t.id === id ? saved : t)));
    showToast(`Tag atualizada para #${name}!`, "success");
  };

  const handleDeleteTag = async (id: string) => {
    if (!user) return;
    const success = await deleteTag(id, user.uid);
    if (success) {
      setTags((prev) => prev.filter((t) => t.id !== id));
      showToast("Tag removida.", "success");
    }
  };

  // --- AUTH ---

  const handleLogout = async () => {
    if (window.confirm("Deseja sair do Codex?")) {
      await logoutUser();
      showToast("Sessão finalizada com sucesso.", "info");
    }
  };

  // --- RENDERING PATHS ---

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090D16] text-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs text-indigo-300 tracking-widest uppercase">Iniciando Codex...</span>
      </div>
    );
  }

  // Not authenticated, render AuthPage
  if (!user) {
    return <AuthPage onAuthSuccess={() => loadAllData(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col md:flex-row text-slate-100 font-sans relative">
      
      {/* Retractable Sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        categories={categories}
        tags={tags}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddTag={handleAddTag}
        onEditTag={handleEditTag}
        onDeleteTag={handleDeleteTag}
        onOpenFirebaseSettings={() => setShowFirebaseModal(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCharacter(null); // Return to list view
        }}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-h-screen select-none">
        <div className="max-w-7xl mx-auto">
          
          {selectedCharacter ? (
            /* Character Detail Page View */
            <CharacterDetail
              character={selectedCharacter}
              allCharacters={characters}
              onBack={() => setSelectedCharacter(null)}
              onEdit={() => setEditingCharacter(selectedCharacter)}
              onDelete={handleDeleteCharacter}
              onDuplicate={handleDuplicateCharacter}
              onToggleFavorite={handleToggleFavoriteDetail}
              onSelectCharacter={(char) => setSelectedCharacter(char)}
              showToast={showToast}
            />
          ) : activeTab === "dashboard" ? (
            /* Dashboard View */
            <Dashboard
              characters={characters}
              categories={categories}
              tags={tags}
              onSelectCharacter={(char) => setSelectedCharacter(char)}
              onAddNewCharacter={() => setEditingCharacter(null)}
              userName={user.displayName}
            />
          ) : (
            /* Characters Explorer List Grid View */
            <Home
              characters={characters}
              categories={categories}
              tags={tags}
              onAddNewCharacter={() => setEditingCharacter(null)}
              onSelectCharacter={(char) => setSelectedCharacter(char)}
              onToggleFavorite={handleToggleFavorite}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              isLoading={isLoadingData}
            />
          )}

        </div>
      </main>

      {/* Creation & Editing Modal Form Overlay */}
      {editingCharacter !== undefined && (
        <CharacterForm
          character={editingCharacter}
          categories={categories}
          tags={tags}
          onSave={handleSaveCharacter}
          onClose={() => setEditingCharacter(undefined)}
          showToast={showToast}
        />
      )}

      {/* Firebase Settings Config Modal */}
      <FirebaseSettingsModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
        onSuccess={(msg) => showToast(msg, "success")}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
