import React, { useState } from "react";
import { Character, Relationship } from "../types";
import {
  Edit,
  Trash2,
  Copy,
  Share2,
  ArrowLeft,
  Calendar,
  User,
  Heart,
  Briefcase,
  ShieldAlert,
  Sword,
  MessageSquare,
  Sparkles,
  Link2,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";

interface CharacterDetailProps {
  character: Character;
  allCharacters: Character[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onSelectCharacter: (char: Character) => void;
  showToast: (msg: string, type: "success" | "error" | "info" | "warning") => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  allCharacters,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onSelectCharacter,
  showToast,
}) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  const handleShare = () => {
    // Generate a beautiful copyable link using the current URL (hash or query param-friendly)
    const shareUrl = `${window.location.origin}${window.location.pathname}?charId=${character.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Link de compartilhamento copiado para a área de transferência!", "success");
  };

  // Find related characters: matching either the same category OR sharing at least one tag, excluding current character
  const relatedCharacters = allCharacters
    .filter((c) => c.id !== character.id)
    .filter((c) => {
      const hasSameCategory = c.category === character.category;
      const hasSharedTags = c.tags.some((t) => character.tags.includes(t));
      return hasSameCategory || hasSharedTags;
    })
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-200 pb-12">
      
      {/* Navigation Top Header */}
      <div className="flex items-center justify-between p-1 bg-transparent select-none">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Lista
        </button>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              character.isFavorite
                ? "bg-rose-950/40 border-rose-800/30 text-rose-400 hover:bg-rose-950/60"
                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title={character.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={`w-4 h-4 ${character.isFavorite ? "fill-rose-500" : ""}`} />
          </button>

          <button
            onClick={onDuplicate}
            className="p-2 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Duplicar Personagem"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Compartilhar Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <span className="w-px h-6 bg-slate-800 mx-1" />

          <button
            onClick={onEdit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Editar Personagem
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Tem certeza absoluta que deseja excluir "${character.name}" do Codex? Esta ação é irreversível.`)) {
                onDelete();
              }
            }}
            className="px-3 py-2 bg-rose-950/40 border border-rose-900/30 text-rose-400 hover:bg-rose-900/20 rounded-xl text-sm font-semibold transition-all"
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Hero Banner Area */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {character.bannerUrl ? (
          <img
            src={character.bannerUrl}
            alt="Character Banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Floating basic metadata info over banner bottom */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div className="flex items-center gap-5">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-slate-400 shadow-2xl flex-shrink-0">
                <BookOpen className="w-10 h-10" />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {character.name}
                </h1>
                {character.nickname && (
                  <span className="text-sm font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-900/30 px-2 py-0.5 rounded-lg">
                    "{character.nickname}"
                  </span>
                )}
              </div>
              {character.title && (
                <p className="text-sm font-medium text-slate-300 drop-shadow-sm italic">
                  {character.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg">
              {character.category || "Geral"}
            </span>
            {character.status && (
              <span
                className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg border ${
                  character.status === "Ativo"
                    ? "bg-emerald-950/50 text-emerald-400 border-emerald-850/50"
                    : character.status === "Falecido"
                    ? "bg-rose-950/50 text-rose-400 border-rose-850/50"
                    : "bg-slate-900/80 text-slate-300 border-slate-800"
                }`}
              >
                {character.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Metadata/Specifications table) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Panel */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Especificações do Personagem
            </h3>

            {/* Biological Specifications */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Atributos Biológicos</h4>
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                {[
                  { label: "Idade", value: character.age },
                  { label: "Altura", value: character.height },
                  { label: "Peso", value: character.weight },
                  { label: "Gênero", value: character.gender },
                  { label: "Raça", value: character.race },
                  { label: "Espécie", value: character.species },
                ].map(
                  (item, i) =>
                    item.value && (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-850">
                        <span className="block text-[10px] font-semibold text-slate-500 uppercase">{item.label}</span>
                        <span className="text-slate-200 mt-1 block">{item.value}</span>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Universe Specifications */}
            {(character.charClass || character.level || character.alignment || character.element) && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Mitologia & RPG</h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  {[
                    { label: "Classe", value: character.charClass },
                    { label: "Nível / Poder", value: character.level },
                    { label: "Alinhamento", value: character.alignment },
                    { label: "Elemento", value: character.element },
                  ].map(
                    (item, i) =>
                      item.value && (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-850">
                          <span className="block text-[10px] font-semibold text-slate-500 uppercase">{item.label}</span>
                          <span className="text-slate-200 mt-1 block">{item.value}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Affiliations Specifications */}
            {(character.affiliation || character.organization || character.faction || character.profession || character.occupation) && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Afiliações & Ocupações</h4>
                <div className="space-y-2">
                  {[
                    { label: "Grupo / Afiliação", value: character.affiliation },
                    { label: "Organização", value: character.organization },
                    { label: "Facção", value: character.faction },
                    { label: "Profissão", value: character.profession },
                    { label: "Ocupação", value: character.occupation },
                  ].map(
                    (item, i) =>
                      item.value && (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-850/50 text-xs">
                          <span className="text-slate-500 font-semibold uppercase">{item.label}</span>
                          <span className="text-slate-200 text-right">{item.value}</span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {/* Creation metadata */}
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Criado: {new Date(character.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <span>Modificado: {new Date(character.updatedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          {/* Tags cloud */}
          {character.tags && character.tags.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags Associadas</h4>
              <div className="flex flex-wrap gap-1.5">
                {character.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 border border-slate-800 text-indigo-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Biography, Personality, Combat, Gallery) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Biography section */}
          <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-6">
            
            {/* Quick Summary block */}
            <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 relative">
              <div className="absolute top-3 right-3 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1.5 font-mono">Resumo</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {character.summary}
              </p>
            </div>

            {/* History markdown-style text */}
            {character.history && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2">História & Origens</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {character.history}
                </p>
              </div>
            )}

            {/* Personality and Appearance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {character.personality && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Personalidade</h4>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-950/30 p-3.5 rounded-xl border border-slate-900">
                    {character.personality}
                  </p>
                </div>
              )}
              {character.appearance && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Aparência Física</h4>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-950/30 p-3.5 rounded-xl border border-slate-900">
                    {character.appearance}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Combat / Powers Section */}
          {(character.powers || character.abilities || character.weaknesses || character.equipments || character.weapons || character.inventory) && (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2">
                <Sword className="w-4 h-4 text-indigo-400" />
                Atributos de Combate & Arsenal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.powers && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Poderes & Habilidades</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-rose-955/20 rounded-xl">
                      {character.powers}
                    </p>
                  </div>
                )}

                {character.abilities && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Perícias & Talentos</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-emerald-955/20 rounded-xl">
                      {character.abilities}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.weaknesses && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Fraquezas & Limitações
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-amber-955/20 rounded-xl">
                      {character.weaknesses}
                    </p>
                  </div>
                )}

                {character.equipments && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      Equipamentos Notáveis
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-indigo-955/20 rounded-xl">
                      {character.equipments}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.weapons && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Armas Primárias</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                      {character.weapons}
                    </p>
                  </div>
                )}

                {character.inventory && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Inventário de Itens</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                      {character.inventory}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Relationships list */}
          {character.relationships && character.relationships.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2">
                Conexões & Relacionamentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.relationships.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{rel.name}</h4>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest mt-1 border ${
                          rel.relation === "Aliado"
                            ? "bg-emerald-950/40 border-emerald-900/20 text-emerald-400"
                            : rel.relation === "Inimigo"
                            ? "bg-rose-950/40 border-rose-900/20 text-rose-400"
                            : "bg-blue-950/40 border-blue-900/20 text-blue-400"
                        }`}
                      >
                        {rel.relation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quotes and Trivia tab style */}
          {((character.quotes && character.quotes.length > 0) || (character.trivia && character.trivia.length > 0)) && (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-6">
              {character.quotes && character.quotes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Citações Memoráveis
                  </h3>
                  <div className="space-y-3">
                    {character.quotes.map((q, idx) => (
                      <blockquote
                        key={idx}
                        className="pl-4 border-l-2 border-indigo-500 italic text-slate-300 leading-relaxed text-sm bg-slate-950/20 p-3 rounded-r-xl"
                      >
                        "{q}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {character.trivia && character.trivia.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Curiosidades & Trivia
                  </h3>
                  <ul className="space-y-2.5">
                    {character.trivia.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                        <span className="text-indigo-400 font-extrabold mt-1">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Gallery display */}
          {character.gallery && character.gallery.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Galeria do Codex
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {character.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-slate-850 cursor-pointer hover:border-indigo-500/55 transition-all shadow-md bg-slate-950"
                  >
                    <img src={img} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes display */}
          {character.notes && (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-md space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800/80 pb-2">Anotações do Autor</h3>
              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
                {character.notes}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Related characters widget list at bottom */}
      {relatedCharacters.length > 0 && (
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            Personagens Relacionados no Universo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className="p-4 bg-slate-900/20 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/40 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
              >
                {char.avatarUrl ? (
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-850 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-850 flex items-center justify-center border border-slate-800 text-slate-400 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                    {char.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{char.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal for gallery zoom */}
      {activeGalleryIndex !== null && character.gallery && (
        <div
          onClick={() => setActiveGalleryIndex(null)}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={character.gallery[activeGalleryIndex]}
            alt="Zoomed gallery item"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
