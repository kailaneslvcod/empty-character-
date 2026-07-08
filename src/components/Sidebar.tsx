import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FolderOpen,
  Tag as TagIcon,
  Server,
  Plus,
  Trash2,
  Edit2,
  X,
  User as UserIcon,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { UserProfile } from "../services/auth";
import { Category, Tag } from "../types";
import { isFirebaseEnabled } from "../firebase/config";

interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
  categories: Category[];
  tags: Tag[];
  onAddCategory: (name: string, desc?: string) => Promise<void>;
  onEditCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onAddTag: (name: string) => Promise<void>;
  onEditTag: (id: string, name: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  onOpenFirebaseSettings: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  activeTab: "dashboard" | "characters";
  setActiveTab: (tab: "dashboard" | "characters") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogout,
  categories,
  tags,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddTag,
  onEditTag,
  onDeleteTag,
  onOpenFirebaseSettings,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  activeTab,
  setActiveTab,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Inline state for adding category / tag
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  const handleSaveCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (editingCatId) {
      await onEditCategory(editingCatId, newCatName.trim());
    } else {
      await onAddCategory(newCatName.trim());
    }

    setNewCatName("");
    setEditingCatId(null);
    setShowAddCat(false);
  };

  const handleSaveTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    if (editingTagId) {
      await onEditTag(editingTagId, newTagName.trim());
    } else {
      await onAddTag(newTagName.trim());
    }

    setNewTagName("");
    setEditingTagId(null);
    setShowAddTag(false);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setShowAddCat(true);
  };

  const startEditTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setNewTagName(tag.name);
    setShowAddTag(true);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800 text-slate-100 font-sans">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <BookOpen className="w-6 h-6 text-indigo-400 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-md tracking-wider uppercase font-mono bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
              Empty Character
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Session Profile Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/20">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-5 h-5 text-indigo-400" />
          </div>
          {!isCollapsed && (
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-semibold text-white truncate leading-tight">
                {user?.displayName || "Mestre"}
              </h4>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                {user?.isOffline ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                ) : (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
                {user?.isOffline ? "Local Offline" : "Sincronizado"}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              title="Sair do Codex"
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-grow overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Core Sections */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("characters");
              setIsMobileOpen(false);
              setSelectedCategory("");
              setSelectedTag("");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "characters" && !selectedCategory && !selectedTag
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Personagens</span>}
          </button>
        </div>

        {/* Categories Section */}
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="w-3 h-3 text-indigo-400" />
                Categorias
              </span>
              <button
                onClick={() => {
                  setEditingCatId(null);
                  setNewCatName("");
                  setShowAddCat(true);
                }}
                className="hover:text-indigo-400 p-0.5 rounded transition-colors"
                title="Criar Categoria"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence>
              {showAddCat && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveCatSubmit}
                  className="px-2 py-1 space-y-1"
                >
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder={editingCatId ? "Editar nome..." : "Nova categoria..."}
                    className="w-full px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded focus:outline-none focus:border-indigo-500 text-slate-100"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCat(false);
                        setEditingCatId(null);
                      }}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] font-semibold text-white"
                    >
                      Salvar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setActiveTab("characters");
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  !selectedCategory && activeTab === "characters" && !selectedTag
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <span>Todas as categorias</span>
              </button>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat.name && activeTab === "characters"
                      ? "bg-indigo-950/40 text-indigo-300 border-l-2 border-indigo-500 pl-2"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedTag("");
                      setActiveTab("characters");
                      setIsMobileOpen(false);
                    }}
                    className="flex-grow text-left truncate"
                  >
                    {cat.name}
                  </button>

                  {/* Add visual flair: Edit and delete categories (never allow deleting "Geral") */}
                  {cat.id !== "geral" && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Editar"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja excluir a categoria "${cat.name}"?`)) {
                            onDeleteCategory(cat.id);
                          }
                        }}
                        className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <TagIcon className="w-3 h-3 text-emerald-400" />
                Tags
              </span>
              <button
                onClick={() => {
                  setEditingTagId(null);
                  setNewTagName("");
                  setShowAddTag(true);
                }}
                className="hover:text-emerald-400 p-0.5 rounded transition-colors"
                title="Criar Tag"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence>
              {showAddTag && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveTagSubmit}
                  className="px-2 py-1 space-y-1"
                >
                  <input
                    type="text"
                    required
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder={editingTagId ? "Editar nome..." : "Nova tag..."}
                    className="w-full px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded focus:outline-none focus:border-indigo-500 text-slate-100"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTag(false);
                        setEditingTagId(null);
                      }}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] font-semibold text-white"
                    >
                      Salvar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-1.5 px-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                    selectedTag === tag.name && activeTab === "characters"
                      ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10"
                      : "bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedTag(tag.name);
                      setSelectedCategory("");
                      setActiveTab("characters");
                      setIsMobileOpen(false);
                    }}
                    className="truncate max-w-[90px]"
                  >
                    #{tag.name}
                  </button>

                  <div className="hidden group-hover:flex items-center gap-1 ml-1 scale-90">
                    <button
                      onClick={() => startEditTag(tag)}
                      className="text-slate-400 hover:text-white"
                      title="Editar"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir tag #${tag.name}?`)) {
                          onDeleteTag(tag.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-400"
                      title="Excluir"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Firebase Settings */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-2">
        <button
          onClick={onOpenFirebaseSettings}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isFirebaseEnabled
              ? "bg-slate-900 border-indigo-500/30 text-indigo-300 hover:bg-slate-800"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
          }`}
        >
          <Server className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          {!isCollapsed && (
            <div className="text-left flex-grow truncate">
              <span>Firebase</span>
              <span className="block text-[8px] font-mono font-medium text-slate-500">
                {isFirebaseEnabled ? "CONFIGURADO" : "MODO OFFLINE"}
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <motion.aside
        animate={{ width: isCollapsed ? "72px" : "256px" }}
        transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
        className="hidden md:flex flex-col h-screen flex-shrink-0 sticky top-0 overflow-hidden select-none"
      >
        {sidebarContent}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute bottom-4 left-6 z-20 p-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </motion.aside>

      {/* Mobile Top Header */}
      <div className="md:hidden w-full h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm tracking-wider uppercase font-mono text-white">
            Empty Character
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFirebaseSettings}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Server className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-mono text-xs font-semibold"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[85vw] h-full z-10"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-[-44px] p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
