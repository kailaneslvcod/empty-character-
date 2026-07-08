import React, { useState, useEffect, useRef } from "react";
import { Character, Category, Tag, Relationship } from "../types";
import { validateAndCompressImage } from "../utils/image";
import {
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Heart,
  PlusCircle,
  HelpCircle,
  Info,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface CharacterFormProps {
  character?: Character | null; // null if creating a new one
  categories: Category[];
  tags: Tag[];
  onSave: (char: Character) => Promise<void>;
  onClose: () => void;
  showToast: (msg: string, type: "success" | "error" | "info" | "warning") => void;
}

type TabType = "basico" | "atributos" | "combate" | "relacoes" | "midia" | "trivia";

export const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  categories,
  tags,
  onSave,
  onClose,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("basico");

  // Form Fields State
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState("");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");

  // Attributes & Affiliations
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [species, setSpecies] = useState("");
  const [charClass, setCharClass] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [alignment, setAlignment] = useState("");
  const [element, setElement] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [organization, setOrganization] = useState("");
  const [faction, setFaction] = useState("");
  const [profession, setProfession] = useState("");
  const [occupation, setOccupation] = useState("");

  // Combat & Abilities
  const [powers, setPowers] = useState("");
  const [abilities, setAbilities] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [equipments, setEquipments] = useState("");
  const [weapons, setWeapons] = useState("");
  const [inventory, setInventory] = useState("");

  // Media
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  // Relationships, Trivia, Tags, Category
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState("Geral");
  const [quotesList, setQuotesList] = useState<string[]>([]);
  const [triviaList, setTriviaList] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Temporary inputs
  const [newQuote, setNewQuote] = useState("");
  const [newTrivia, setNewTrivia] = useState("");
  const [newRelName, setNewRelName] = useState("");
  const [newRelType, setNewRelType] = useState("Aliado");

  // Drag and Drop State
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Autosave tracking ref
  const lastSavedJson = useRef<string>("");
  const isSaving = useRef(false);

  // Initialize form with character details if editing
  useEffect(() => {
    if (character) {
      setName(character.name || "");
      setNickname(character.nickname || "");
      setTitle(character.title || "");
      setSummary(character.summary || "");
      setHistory(character.history || "");
      setPersonality(character.personality || "");
      setAppearance(character.appearance || "");

      setAge(character.age || "");
      setHeight(character.height || "");
      setWeight(character.weight || "");
      setGender(character.gender || "");
      setRace(character.race || "");
      setSpecies(character.species || "");
      setCharClass(character.charClass || "");
      setLevel(character.level || "");
      setStatus(character.status || "Ativo");
      setAlignment(character.alignment || "");
      setElement(character.element || "");
      setAffiliation(character.affiliation || "");
      setOrganization(character.organization || "");
      setFaction(character.faction || "");
      setProfession(character.profession || "");
      setOccupation(character.occupation || "");

      setPowers(character.powers || "");
      setAbilities(character.abilities || "");
      setWeaknesses(character.weaknesses || "");
      setEquipments(character.equipments || "");
      setWeapons(character.weapons || "");
      setInventory(character.inventory || "");

      setAvatarUrl(character.avatarUrl || "");
      setBannerUrl(character.bannerUrl || "");
      setGallery(character.gallery || []);

      setRelationships(character.relationships || []);
      setSelectedTags(character.tags || []);
      setCategory(character.category || "Geral");
      setQuotesList(character.quotes || []);
      setTriviaList(character.trivia || []);
      setNotes(character.notes || "");
    } else {
      // Clear all fields for creation
      setName("");
      setNickname("");
      setTitle("");
      setSummary("");
      setHistory("");
      setPersonality("");
      setAppearance("");

      setAge("");
      setHeight("");
      setWeight("");
      setGender("");
      setRace("");
      setSpecies("");
      setCharClass("");
      setLevel("");
      setStatus("Ativo");
      setAlignment("");
      setElement("");
      setAffiliation("");
      setOrganization("");
      setFaction("");
      setProfession("");
      setOccupation("");

      setPowers("");
      setAbilities("");
      setWeaknesses("");
      setEquipments("");
      setWeapons("");
      setInventory("");

      setAvatarUrl("");
      setBannerUrl("");
      setGallery([]);
      setRelationships([]);
      setSelectedTags([]);
      setCategory("Geral");
      setQuotesList([]);
      setTriviaList([]);
      setNotes("");
    }
  }, [character]);

  // Construct character object from form values
  const getFormDataAsCharacter = (): Character => {
    return {
      id: character?.id || "",
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      title: title.trim() || undefined,
      summary: summary.trim(),
      history: history.trim() || undefined,
      personality: personality.trim() || undefined,
      appearance: appearance.trim() || undefined,

      age: age.trim() || undefined,
      height: height.trim() || undefined,
      weight: weight.trim() || undefined,
      gender: gender.trim() || undefined,
      race: race.trim() || undefined,
      species: species.trim() || undefined,
      charClass: charClass.trim() || undefined,
      level: level.trim() || undefined,
      status: status || "Ativo",
      alignment: alignment.trim() || undefined,
      element: element.trim() || undefined,
      
      affiliation: affiliation.trim() || undefined,
      organization: organization.trim() || undefined,
      faction: faction.trim() || undefined,
      profession: profession.trim() || undefined,
      occupation: occupation.trim() || undefined,

      powers: powers.trim() || undefined,
      abilities: abilities.trim() || undefined,
      weaknesses: weaknesses.trim() || undefined,
      equipments: equipments.trim() || undefined,
      weapons: weapons.trim() || undefined,
      inventory: inventory.trim() || undefined,

      avatarUrl: avatarUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      gallery: gallery,

      relationships: relationships,
      tags: selectedTags,
      category: category,
      quotes: quotesList,
      trivia: triviaList,
      notes: notes.trim() || undefined,

      createdAt: character?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: character?.isFavorite || false,
      createdBy: character?.createdBy || "",
    };
  };

  // AUTOSAVE IMPLEMENTATION
  useEffect(() => {
    // Only autosave for existing characters to prevent spamming empty creations
    if (!character?.id) return;

    const interval = setInterval(async () => {
      if (isSaving.current) return;

      const currentCharacterData = getFormDataAsCharacter();
      const currentJson = JSON.stringify({
        ...currentCharacterData,
        updatedAt: "", // Ignore timestamp differences for checking changes
      });

      // Avoid redundant saving if nothing changed
      if (currentJson === lastSavedJson.current) return;

      if (!currentCharacterData.name || !currentCharacterData.summary) return; // Must have basics

      isSaving.current = true;
      try {
        await onSave(currentCharacterData);
        lastSavedJson.current = currentJson;
        // Silent successful autosave feedback can be printed in console
        console.log("Alterações salvas automaticamente.");
      } catch (e) {
        console.error("Falha no salvamento automático:", e);
      } finally {
        isSaving.current = false;
      }
    }, 4000); // Check for modifications every 4 seconds

    return () => clearInterval(interval);
  }, [
    character?.id,
    name,
    nickname,
    title,
    summary,
    history,
    personality,
    appearance,
    age,
    height,
    weight,
    gender,
    race,
    species,
    charClass,
    level,
    status,
    alignment,
    element,
    affiliation,
    organization,
    faction,
    profession,
    occupation,
    powers,
    abilities,
    weaknesses,
    equipments,
    weapons,
    inventory,
    avatarUrl,
    bannerUrl,
    gallery,
    relationships,
    selectedTags,
    category,
    quotesList,
    triviaList,
    notes,
  ]);

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("O nome do personagem é obrigatório!", "warning");
      return;
    }
    if (!summary.trim()) {
      showToast("O resumo biográfico do personagem é obrigatório!", "warning");
      return;
    }

    const currentCharacterData = getFormDataAsCharacter();
    isSaving.current = true;
    try {
      await onSave(currentCharacterData);
      showToast(
        character ? "Personagem editado com sucesso!" : "Personagem criado com sucesso!",
        "success"
      );
      onClose();
    } catch (e: any) {
      showToast(e.message || "Erro ao salvar personagem", "error");
    } finally {
      isSaving.current = false;
    }
  };

  // Image upload handling
  const handleImageFile = async (file: File, target: "avatar" | "banner" | "gallery") => {
    try {
      showToast("Tratando e comprimindo imagem...", "info");
      // Compressing image dynamically in client
      const compressedBase64 = await validateAndCompressImage(file);
      
      if (target === "avatar") {
        setAvatarUrl(compressedBase64);
        showToast("Avatar carregado com sucesso!", "success");
      } else if (target === "banner") {
        setBannerUrl(compressedBase64);
        showToast("Banner carregado com sucesso!", "success");
      } else if (target === "gallery") {
        setGallery((prev) => [...prev, compressedBase64]);
        showToast("Imagem adicionada à galeria!", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Falha no upload da imagem", "error");
    }
  };

  // Drag-and-drop actions
  const handleDragOver = (e: React.DragEvent, setter: (b: boolean) => void) => {
    e.preventDefault();
    setter(true);
  };

  const handleDragLeave = (setter: (b: boolean) => void) => {
    setter(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    setter: (b: boolean) => void,
    target: "avatar" | "banner" | "gallery"
  ) => {
    e.preventDefault();
    setter(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFile(files[0], target);
    }
  };

  // Relationship helpers
  const addRelationship = () => {
    if (!newRelName.trim()) return;
    const newRel: Relationship = {
      name: newRelName.trim(),
      relation: newRelType,
    };
    setRelationships((prev) => [...prev, newRel]);
    setNewRelName("");
  };

  const removeRelationship = (idx: number) => {
    setRelationships((prev) => prev.filter((_, i) => i !== idx));
  };

  // Quotes helpers
  const addQuote = () => {
    if (!newQuote.trim()) return;
    setQuotesList((prev) => [...prev, newQuote.trim()]);
    setNewQuote("");
  };

  const removeQuote = (idx: number) => {
    setQuotesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Trivia helpers
  const addTrivia = () => {
    if (!newTrivia.trim()) return;
    setTriviaList((prev) => [...prev, newTrivia.trim()]);
    setNewTrivia("");
  };

  const removeTrivia = (idx: number) => {
    setTriviaList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Tags toggle helpers
  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              {character ? `Editando: ${name}` : "Novo Personagem fictício"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Preencha as informações detalhadas para o Codex. {character?.id && <span className="text-indigo-400 font-medium">Autosave ativo.</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 overflow-x-auto select-none no-scrollbar">
          {[
            { id: "basico", label: "Identidade" },
            { id: "atributos", label: "Atributos & Organização" },
            { id: "combate", label: "Combate & Poderes" },
            { id: "midia", label: "Arquivos de Mídia" },
            { id: "relacoes", label: "Relacionamentos" },
            { id: "trivia", label: "Notas & Trivia" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Fields body */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-950/20">
          
          {/* Tab 1: Básico */}
          {activeTab === "basico" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Name & Title */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Geralt de Rívia"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Apelido
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: Lobo Branco"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Categoria <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Título / Epíteto
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O Carniceiro de Blaviken"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Resumo Biográfico <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Um breve resumo sobre o personagem para visualização rápida no card (1 a 2 frases)..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                />
              </div>

              {/* History & Personality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    História do Personagem
                  </label>
                  <textarea
                    rows={6}
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Escreva a biografia detalhada do personagem, origens, eventos importantes e conquistas..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Personalidade & Comportamento
                    </label>
                    <textarea
                      rows={2}
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="Como o personagem se comporta, seus traços psicológicos..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Aparência Física & Estilo
                    </label>
                    <textarea
                      rows={2}
                      value={appearance}
                      onChange={(e) => setAppearance(e.target.value)}
                      placeholder="Características visuais, cabelos, roupas comuns..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Atributos */}
          {activeTab === "atributos" && (
            <div className="space-y-6 animate-fade-in">
              {/* Biological Attributes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Atributos Biológicos</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Idade</label>
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ex: 95"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Altura</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Ex: 1.88m"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peso</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Ex: 85kg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gênero</label>
                    <input
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder="Ex: Masculino"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raça</label>
                    <input
                      type="text"
                      value={race}
                      onChange={(e) => setRace(e.target.value)}
                      placeholder="Ex: Humano"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Espécie</label>
                    <input
                      type="text"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      placeholder="Ex: Mutante"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Mythological & RPG Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Dados do Universo & Mitologia</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classe / Arquétipo</label>
                    <input
                      type="text"
                      value={charClass}
                      onChange={(e) => setCharClass(e.target.value)}
                      placeholder="Ex: Bruxo"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nível / Poder</label>
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      placeholder="Ex: 50"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Vital</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Falecido">Falecido</option>
                      <option value="Desaparecido">Desaparecido</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alinhamento</label>
                    <input
                      type="text"
                      value={alignment}
                      onChange={(e) => setAlignment(e.target.value)}
                      placeholder="Ex: Neutro e Caótico"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elemento / Força</label>
                    <input
                      type="text"
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      placeholder="Ex: Fogo / Magia"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Affiliations & Organizations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Afiliações & Ocupação</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grupo / Afiliação</label>
                    <input
                      type="text"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      placeholder="Ex: Escola do Lobo"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organização</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Ex: Loja das Feiticeiras"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facção</label>
                    <input
                      type="text"
                      value={faction}
                      onChange={(e) => setFaction(e.target.value)}
                      placeholder="Ex: Império de Nilfgaard"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profissão</label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: Caçador de Monstros"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ocupação</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="Ex: Mercenário Errante"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Combate */}
          {activeTab === "combate" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Poderes & Habilidades Místicas</label>
                  <textarea
                    rows={4}
                    value={powers}
                    onChange={(e) => setPowers(e.target.value)}
                    placeholder="Sinais mágicos, mutações, encantamentos ou magias sobrenaturais..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Perícias & Habilidades Físicas</label>
                  <textarea
                    rows={4}
                    value={abilities}
                    onChange={(e) => setAbilities(e.target.value)}
                    placeholder="Esgrima, alquimia, furtividade, liderança, intelecto tático..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Fraquezas & Limitações</label>
                  <textarea
                    rows={3}
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="Vulnerabilidade a prata, fadiga mística, impulsividade, medo de altura..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Equipamentos Notáveis</label>
                  <textarea
                    rows={3}
                    value={equipments}
                    onChange={(e) => setEquipments(e.target.value)}
                    placeholder="Medalhão de lobo, poções de bruxo, armadura reforçada, runas..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Armas Utilizadas</label>
                  <textarea
                    rows={3}
                    value={weapons}
                    onChange={(e) => setWeapons(e.target.value)}
                    placeholder="Espada de Aço e Espada de Prata para monstros..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Inventário de Itens</label>
                  <textarea
                    rows={3}
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    placeholder="Moedas de ouro, cartas geográficas, frascos de veneno..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Mídia */}
          {activeTab === "midia" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Avatar Upload Container */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Imagem Principal / Avatar</label>
                  <div
                    onDragOver={(e) => handleDragOver(e, setIsDraggingAvatar)}
                    onDragLeave={() => handleDragLeave(setIsDraggingAvatar)}
                    onDrop={(e) => handleDrop(e, setIsDraggingAvatar, "avatar")}
                    className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all relative group overflow-hidden ${
                      isDraggingAvatar
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/10"
                    }`}
                  >
                    {avatarUrl ? (
                      <>
                        <img
                          src={avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button
                            type="button"
                            onClick={() => setAvatarUrl("")}
                            className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2 pointer-events-none">
                        <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="text-xs font-semibold text-slate-300">Arraste a foto principal aqui</p>
                        <p className="text-[10px] text-slate-500">ou clique para selecionar (JPEG, PNG)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile(e.target.files[0], "avatar");
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Upload Container */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Imagem de Fundo / Banner</label>
                  <div
                    onDragOver={(e) => handleDragOver(e, setIsDraggingBanner)}
                    onDragLeave={() => handleDragLeave(setIsDraggingBanner)}
                    onDrop={(e) => handleDrop(e, setIsDraggingBanner, "banner")}
                    className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all relative group overflow-hidden ${
                      isDraggingBanner
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/10"
                    }`}
                  >
                    {bannerUrl ? (
                      <>
                        <img
                          src={bannerUrl}
                          alt="Banner preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button
                            type="button"
                            onClick={() => setBannerUrl("")}
                            className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="text-xs font-semibold text-slate-300">Arraste a capa de fundo aqui</p>
                        <p className="text-[10px] text-slate-500">ou clique para selecionar</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile(e.target.files[0], "banner");
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Gallery upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Galeria de Ilustrações / Mídias</label>
                <div
                  onDragOver={(e) => handleDragOver(e, setIsDraggingGallery)}
                  onDragLeave={() => handleDragLeave(setIsDraggingGallery)}
                  onDrop={(e) => handleDrop(e, setIsDraggingGallery, "gallery")}
                  className={`border-2 border-dashed rounded-xl p-6 transition-all relative hover:border-slate-700 hover:bg-slate-900/5 ${
                    isDraggingGallery ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800"
                  }`}
                >
                  <div className="text-center space-y-1.5 pointer-events-none">
                    <PlusCircle className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">Adicione imagens extras à galeria</p>
                    <p className="text-[10px] text-slate-500">Arraste arquivos ou clique para selecionar</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0], "gallery");
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-3">
                    {gallery.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button
                            type="button"
                            onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-1 bg-rose-600 hover:bg-rose-500 rounded-md text-white scale-90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Relações */}
          {activeTab === "relacoes" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-sm font-semibold text-slate-200">Adicionar Relacionamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-6 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome do Personagem Relacionado</label>
                    <input
                      type="text"
                      value={newRelName}
                      onChange={(e) => setNewRelName(e.target.value)}
                      placeholder="Ex: Yennefer de Vengerberg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Relação</label>
                    <select
                      value={newRelType}
                      onChange={(e) => setNewRelType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="Aliado">Aliado / Amigo</option>
                      <option value="Inimigo">Inimigo / Rival</option>
                      <option value="Família">Família / Cônjuge</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addRelationship}
                    className="md:col-span-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Active relationships list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lista de Relações</h4>
                {relationships.length === 0 ? (
                  <div className="p-6 border border-slate-800/60 rounded-xl text-center text-xs text-slate-500">
                    Nenhum relacionamento cadastrado. Adicione acima!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relationships.map((rel, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <h5 className="text-sm font-semibold text-slate-200">{rel.name}</h5>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1 ${
                              rel.relation === "Aliado"
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/20"
                                : rel.relation === "Inimigo"
                                ? "bg-rose-950/40 text-rose-400 border border-rose-900/20"
                                : "bg-blue-950/40 text-blue-400 border border-blue-900/20"
                            }`}
                          >
                            {rel.relation}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRelationship(idx)}
                          className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 6: Trivia */}
          {activeTab === "trivia" && (
            <div className="space-y-6 animate-fade-in">
              {/* Quotes Manager */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Citações e Frases Marcantes</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="Ex: 'O mal é o mal... menor, maior, médio, é tudo igual.'"
                    className="flex-grow px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addQuote}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white text-sm"
                  >
                    Adicionar
                  </button>
                </div>

                {quotesList.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {quotesList.map((q, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 text-xs italic text-slate-300"
                      >
                        <span>"{q}"</span>
                        <button
                          type="button"
                          onClick={() => removeQuote(idx)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Trivia Curiosities Manager */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Curiosidades e Trivia</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTrivia}
                    onChange={(e) => setNewTrivia(e.target.value)}
                    placeholder="Ex: Possui cicatrizes que contam a história de cada um de seus monstros."
                    className="flex-grow px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTrivia}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white text-sm"
                  >
                    Adicionar
                  </button>
                </div>

                {triviaList.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {triviaList.map((t, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 text-xs text-slate-300"
                      >
                        <span className="flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          {t}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTrivia(idx)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notes & Extra Observations */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Notas & Observações do Autor</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anotações internas sobre o papel do personagem na campanha ou enredo do livro..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
                />
              </div>

              {/* Tags select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tags do Personagem</label>
                <p className="text-[10px] text-slate-500">Selecione as tags que se aplicam a esta criação (gerencie as tags no menu lateral):</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                            : "bg-slate-950 border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-850 rounded-xl transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleManualSave}
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar no Codex
          </button>
        </div>

      </div>
    </div>
  );
};
