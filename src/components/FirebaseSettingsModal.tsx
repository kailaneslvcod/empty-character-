import React, { useState } from "react";
import { X, HelpCircle, Server, AlertTriangle } from "lucide-react";
import { FirebaseConfig } from "../types";
import { getActiveFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, isFirebaseEnabled } from "../firebase/config";

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const currentConfig = getActiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || "");
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || "");
  const [projectId, setProjectId] = useState(currentConfig?.projectId || "");
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || "");
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || "");
  const [appId, setAppId] = useState(currentConfig?.appId || "");
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert("API Key e Project ID são obrigatórios!");
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(config);
    onSuccess("Configurações do Firebase salvas! Recarregando...");
    onClose();
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja remover a configuração do Firebase? O Codex voltará ao modo offline/localStorage.")) {
      clearFirebaseConfig();
      onSuccess("Configuração removida. Recarregando...");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Configuração do Firebase</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto space-y-6">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">Status da Conexão:</span>
              {isFirebaseEnabled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Conectado (Cloud)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Offline (LocalStorage)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Por padrão, o Empty Character armazena tudo localmente no navegador. Para habilitar nuvem permanente, autenticação de múltiplos usuários e upload de imagens reais para o storage, configure seu projeto do Firebase.
            </p>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHelp ? "Ocultar instruções" : "Como obter essas chaves?"}
            </button>

            {showHelp && (
              <div className="text-xs text-slate-300 bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2 mt-2 leading-relaxed">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Console do Firebase</a> e crie um projeto.</li>
                  <li>Ative o <strong>Authentication</strong> (provedor E-mail/Senha).</li>
                  <li>Ative o <strong>Firestore Database</strong> no modo de teste ou produção.</li>
                  <li>Ative o <strong>Storage</strong> (para imagens).</li>
                  <li>Crie um aplicativo Web em seu projeto e copie o objeto <code>firebaseConfig</code> fornecido.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="empty-character-123"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="empty-character-123.firebaseapp.com"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="empty-character-123.appspot.com"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  App ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456:web:abcd123"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
                placeholder="1234567890"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {isFirebaseEnabled && (
            <div className="p-4 bg-rose-950/20 border border-rose-800/30 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-rose-300">Desconectar Firebase</h4>
                <p className="text-xs text-rose-200/75 leading-relaxed">
                  Caso queira voltar a usar apenas armazenamento offline local (LocalStorage), você pode remover as credenciais salvas a qualquer momento clicando no botão abaixo.
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-2 inline-flex items-center text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors hover:underline"
                >
                  Remover Conexão e Voltar para LocalStorage
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            Salvar e Inicializar
          </button>
        </div>

      </div>
    </div>
  );
};
