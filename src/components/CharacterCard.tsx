import React from "react";
import { motion } from "motion/react";
import { Character } from "../types";
import { Heart, Tag, BookOpen, Star, Calendar } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent, char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <motion.div
      layoutId={`card-container-${character.id}`}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative cursor-pointer flex flex-col h-[380px] rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700/80 hover:bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-lg transition-colors select-none"
    >
      {/* Banner/Overlay Background */}
      <div className="relative h-44 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
        {character.bannerUrl ? (
          <img
            src={character.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30" />
        )}

        {/* Favorite Icon (Absolute top-right) */}
        <button
          onClick={(e) => onToggleFavorite(e, character)}
          className="absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md bg-black/40 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-black/60 transition-all z-20"
          title={character.isFavorite ? "Desfavoritar" : "Favoritar"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              character.isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-200"
            }`}
          />
        </button>

        {/* Category Label (Absolute top-left) */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/40 border border-white/10 text-indigo-300 rounded-lg">
          {character.category || "Geral"}
        </span>

        {/* Avatar centered at the bottom of banner */}
        <div className="absolute bottom-[-32px] left-5 z-10">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-slate-900 shadow-xl bg-slate-950"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-850 flex items-center justify-center border-2 border-slate-900 text-slate-400 shadow-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-grow p-5 pt-10 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors truncate">
            {character.name}
          </h3>
          {character.title && (
            <p className="text-xs text-slate-400 font-medium tracking-wide truncate">
              {character.title}
            </p>
          )}
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1 font-sans">
            {character.summary}
          </p>
        </div>

        {/* Bottom tags & metadata */}
        <div className="space-y-3 pt-3 border-t border-slate-800/40">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 max-h-[22px] overflow-hidden">
            {character.tags && character.tags.length > 0 ? (
              character.tags.slice(0, 3).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-950/60 border border-slate-800 text-slate-400"
                >
                  #{t}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-600 font-mono italic">sem tags</span>
            )}
          </div>

          {/* Quick stats indicators */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-600" />
              {new Date(character.createdAt).toLocaleDateString("pt-BR")}
            </span>
            {character.status && (
              <span
                className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  character.status === "Ativo"
                    ? "bg-emerald-950/40 text-emerald-400"
                    : character.status === "Falecido"
                    ? "bg-rose-950/40 text-rose-400"
                    : "bg-slate-950/60 text-slate-400"
                }`}
              >
                {character.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
