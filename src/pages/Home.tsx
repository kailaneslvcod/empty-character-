import React, { useState, useMemo } from "react";
import { Character, Category, Tag } from "../types";
import { CharacterCard } from "../components/CharacterCard";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  Users,
  Grid,
  Heart,
  Undo2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface HomeProps {
  characters: Character[];
  categories: Category[];
  tags: Tag[];
  onAddNewCharacter: () => void;
  onSelectCharacter: (char: Character) => void;
  onToggleFavorite: (e: React.MouseEvent, char: Character) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  isLoading: boolean;
}

type SortType = "name_asc" | "name_desc" | "date_new" | "date_old" | "level_high" | "level_low" | "last_edit";

// Accent and case normalization helper
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const Home: React.FC<HomeProps> = ({
  characters,
  categories,
  tags,
  onAddNewCharacter,
  onSelectCharacter,
  onToggleFavorite,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  isLoading,
}) => {
  // Query States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("last_edit");
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filterRace, setFilterRace] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterElement, setFilterElement] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Collect unique classes, races, elements for dynamic filters dropdowns
  const uniqueRaces = useMemo(() => {
    const races = characters.map((c) => c.race).filter(Boolean) as string[];
    return Array.from(new Set(races));
  }, [characters]);

  const uniqueClasses = useMemo(() => {
    const classes = characters.map((c) => c.charClass).filter(Boolean) as string[];
    return Array.from(new Set(classes));
  }, [characters]);

  const uniqueElements = useMemo(() => {
    const elements = characters.map((c) => c.element).filter(Boolean) as string[];
    return Array.from(new Set(elements));
  }, [characters]);

  // Combined Search and Filter Logic
  const filteredCharacters = useMemo(() => {
    let result = [...characters];

    // 1. Sidebar Category filter
    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // 2. Sidebar Tag filter
    if (selectedTag) {
      result = result.filter((c) => c.tags.includes(selectedTag));
    }

    // 3. Only Favorites
    if (onlyFavorites) {
      result = result.filter((c) => c.isFavorite);
    }

    // 4. Dropdowns filters
    if (filterRace) {
      result = result.filter((c) => c.race === filterRace);
    }
    if (filterClass) {
      result = result.filter((c) => c.charClass === filterClass);
    }
    if (filterStatus) {
      result = result.filter((c) => c.status === filterStatus);
    }
    if (filterElement) {
      result = result.filter((c) => c.element === filterElement);
    }

    // 5. Query Search (while typing, ignore accents and ignore case)
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeString(searchQuery.trim());
      result = result.filter((c) => {
        const matchName = c.name && normalizeString(c.name).includes(normalizedQuery);
        const matchNickname = c.nickname && normalizeString(c.nickname).includes(normalizedQuery);
        const matchRace = c.race && normalizeString(c.race).includes(normalizedQuery);
        const matchClass = c.charClass && normalizeString(c.charClass).includes(normalizedQuery);
        const matchOrg = c.organization && normalizeString(c.organization).includes(normalizedQuery);
        const matchCat = c.category && normalizeString(c.category).includes(normalizedQuery);
        const matchHistory = c.history && normalizeString(c.history).includes(normalizedQuery);
        const matchPersonality = c.personality && normalizeString(c.personality).includes(normalizedQuery);
        const matchTags = c.tags && c.tags.some((tag) => normalizeString(tag).includes(normalizedQuery));

        return (
          matchName ||
          matchNickname ||
          matchRace ||
          matchClass ||
          matchOrg ||
          matchCat ||
          matchHistory ||
          matchPersonality ||
          matchTags
        );
      });
    }

    // 6. Sorting Logic
    result.sort((a, b) => {
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name_desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "date_new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "date_old") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "level_high") {
        const numA = parseInt(a.level || "0", 10) || 0;
        const numB = parseInt(b.level || "0", 10) || 0;
        return numB - numA;
      }
      if (sortBy === "level_low") {
        const numA = parseInt(a.level || "0", 10) || 0;
        const numB = parseInt(b.level || "0", 10) || 0;
        return numA - numB;
      }
      if (sortBy === "last_edit") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

    return result;
  }, [
    characters,
    selectedCategory,
    selectedTag,
    onlyFavorites,
    filterRace,
    filterClass,
    filterStatus,
    filterElement,
    searchQuery,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setFilterRace("");
    setFilterClass("");
    setFilterStatus("");
    setFilterElement("");
    setOnlyFavorites(false);
    setSelectedCategory("");
    setSelectedTag("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            {selectedCategory
              ? `Categoria: ${selectedCategory}`
              : selectedTag
              ? `Tag: #${selectedTag}`
              : "Codex de Personagens"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualizando {filteredCharacters.length} de {characters.length} registros cadastrados.
          </p>
        </div>

        <button
          onClick={onAddNewCharacter}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Adicionar Personagem
        </button>
      </div>

      {/* Search & Sorting Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Real-time Search input */}
        <div className="relative w-full md:flex-grow">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por nome, apelido, raça, classe, história ou tags..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0 justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-2 ${
              showFilters || filterRace || filterClass || filterStatus || filterElement || onlyFavorites
                ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300"
                : "bg-slate-900/20 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="appearance-none pl-4 pr-10 py-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-300 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer w-full md:w-44"
            >
              <option value="last_edit">Última Edição</option>
              <option value="name_asc">Nome (A - Z)</option>
              <option value="name_desc">Nome (Z - A)</option>
              <option value="date_new">Mais Recentes</option>
              <option value="date_old">Mais Antigos</option>
              <option value="level_high">Nível (Maior)</option>
              <option value="level_low">Nível (Menor)</option>
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Collapsible Filter Panel */}
      {showFilters && (
        <div className="p-5 border border-slate-800 bg-slate-900/10 backdrop-blur-md rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in select-none">
          {/* Race dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raça</label>
            <select
              value={filterRace}
              onChange={(e) => setFilterRace(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todas</option>
              {uniqueRaces.map((race, i) => (
                <option key={i} value={race}>{race}</option>
              ))}
            </select>
          </div>

          {/* Class dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classe</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todas</option>
              {uniqueClasses.map((cls, i) => (
                <option key={i} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Status vital dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Vital</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Falecido">Falecido</option>
              <option value="Desaparecido">Desaparecido</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Element dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elemento</label>
            <select
              value={filterElement}
              onChange={(e) => setFilterElement(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todos</option>
              {uniqueElements.map((el, i) => (
                <option key={i} value={el}>{el}</option>
              ))}
            </select>
          </div>

          {/* Toggle Favorites / Clear */}
          <div className="flex flex-col justify-end gap-1.5 pt-4 sm:pt-0">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                onlyFavorites
                  ? "bg-rose-950/40 border-rose-800/30 text-rose-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-rose-500" : ""}`} />
              Favoritos
            </button>
          </div>
        </div>
      )}

      {/* Selected Filters feedback banner */}
      {(selectedCategory || selectedTag || filterRace || filterClass || filterStatus || filterElement || onlyFavorites || searchQuery) && (
        <div className="flex items-center justify-between p-3 border border-slate-800/60 bg-slate-900/10 rounded-xl text-xs text-slate-400 select-none">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Filtros ativos:</span>
            {selectedCategory && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 font-medium">Categoria: {selectedCategory}</span>
            )}
            {selectedTag && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 font-medium">Tag: #{selectedTag}</span>
            )}
            {filterRace && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">Raça: {filterRace}</span>}
            {filterClass && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">Classe: {filterClass}</span>}
            {filterStatus && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">Status: {filterStatus}</span>}
            {filterElement && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">Elemento: {filterElement}</span>}
            {onlyFavorites && <span className="px-2 py-0.5 rounded-md bg-rose-950/40 text-rose-300">Apenas Favoritos</span>}
            {searchQuery && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">Busca: "{searchQuery}"</span>}
          </div>

          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Limpar tudo
          </button>
        </div>
      )}

      {/* Grid of Characters */}
      {isLoading ? (
        // Skeleton loaders grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[380px] rounded-2xl border border-slate-800/60 bg-slate-900/10 flex flex-col justify-between p-5 space-y-4 animate-pulse"
            >
              <div className="h-44 w-full bg-slate-850 rounded-xl" />
              <div className="space-y-2 flex-grow">
                <div className="h-5 w-2/3 bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-850 rounded" />
                <div className="h-3 w-full bg-slate-900 rounded" />
                <div className="h-3 w-full bg-slate-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCharacters.length === 0 ? (
        // Empty placeholder
        <div className="p-16 border border-slate-800/80 bg-slate-900/10 rounded-2xl text-center space-y-4 select-none">
          <Grid className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Nenhum registro correspondente</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Nenhum personagem fictício atende às chaves de busca ou filtros aplicados atualmente. Tente redefinir seus filtros ou pesquise novamente.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs font-semibold text-slate-300 border border-slate-800"
          >
            Limpar Filtros e Buscar Tudo
          </button>
        </div>
      ) : (
        // Real list grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onClick={() => onSelectCharacter(char)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
