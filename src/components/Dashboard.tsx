import React from "react";
import { Character, Category, Tag } from "../types";
import {
  Users,
  Folder,
  Tag as TagIcon,
  Sparkles,
  Clock,
  Heart,
  BookOpen,
  Calendar,
  ChevronRight,
  Plus,
} from "lucide-react";

interface DashboardProps {
  characters: Character[];
  categories: Category[];
  tags: Tag[];
  onSelectCharacter: (char: Character) => void;
  onAddNewCharacter: () => void;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  characters,
  categories,
  tags,
  onSelectCharacter,
  onAddNewCharacter,
  userName,
}) => {
  // Compute some interesting stats
  const totalCharacters = characters.length;
  const totalCategories = categories.length;
  const totalTags = tags.length;

  const favoriteCharacters = characters.filter((c) => c.isFavorite);
  const totalFavorites = favoriteCharacters.length;

  // Sorting for recently added
  const recentlyAdded = [...characters]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Sorting for recently updated
  const recentlyUpdated = [...characters]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-xl">
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            Codex Ativo
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Saudações, {userName || "Mestre do Codex"}!
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bem-vindo ao seu painel administrativo de Empty Character. Aqui você pode gerenciar a mitologia do seu universo fictício, criar biografias ricas e catalogar todas as suas criações.
          </p>
          <div className="pt-2">
            <button
              onClick={onAddNewCharacter}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Criar Novo Personagem
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Characters */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400">Personagens</span>
            <span className="text-2xl font-bold text-white">{totalCharacters}</span>
          </div>
        </div>

        {/* Categories count */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400">Categorias</span>
            <span className="text-2xl font-bold text-white">{totalCategories}</span>
          </div>
        </div>

        {/* Tags count */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TagIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400">Tags Utilizadas</span>
            <span className="text-2xl font-bold text-white">{totalTags}</span>
          </div>
        </div>

        {/* Favorites count */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Heart className="w-5 h-5 fill-rose-500/15" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-400">Favoritos</span>
            <span className="text-2xl font-bold text-white">{totalFavorites}</span>
          </div>
        </div>
      </div>

      {/* Recents Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recently Added */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-950/20 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Últimos Adicionados</h3>
          </div>

          <div className="p-4 divide-y divide-slate-800/50">
            {recentlyAdded.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 leading-relaxed">
                Nenhum personagem catalogado ainda.<br />Crie seu primeiro personagem para ver o Codex ganhar vida!
              </div>
            ) : (
              recentlyAdded.map((char) => (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/30 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {char.avatarUrl ? (
                      <img
                        src={char.avatarUrl}
                        alt={char.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-850 flex items-center justify-center text-slate-400 border border-slate-800">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {char.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {char.title || char.summary}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recently Updated */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-950/20 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Recentemente Editados</h3>
          </div>

          <div className="p-4 divide-y divide-slate-800/50">
            {recentlyUpdated.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 leading-relaxed">
                Nenhuma modificação recente encontrada.
              </div>
            ) : (
              recentlyUpdated.map((char) => (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/30 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {char.avatarUrl ? (
                      <img
                        src={char.avatarUrl}
                        alt={char.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-850 flex items-center justify-center text-slate-400 border border-slate-800">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {char.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <span>Atualizado em:</span>
                        <span>{new Date(char.updatedAt).toLocaleDateString("pt-BR")}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
