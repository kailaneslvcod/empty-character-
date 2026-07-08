import React, { useState } from "react";
import { motion } from "motion/react";
import { loginWithEmail, signupWithEmail } from "../services/auth";
import { useToast } from "../components/Toast";
import { Shield, Sparkles, BookOpen, KeyRound, Mail, User, WifiOff, Cloud } from "lucide-react";
import { isFirebaseEnabled } from "../firebase/config";

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !displayName)) {
      showToast("Preencha todos os campos obrigatórios!", "warning");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        showToast("Bem-vindo ao Codex!", "success");
      } else {
        await signupWithEmail(email, password, displayName);
        showToast("Conta criada com sucesso!", "success");
      }
      onAuthSuccess();
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Erro de autenticação", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090D16] text-slate-100 p-4 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/15 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px]" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl relative z-10">
        
        {/* Left Side: Editorial Banner */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span className="font-mono text-sm uppercase tracking-widest text-indigo-300 font-bold">Empty Character</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight mt-6">
              O Codex de Todas as Suas Histórias
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crie, organize e conecte personagens para RPG, livros, jogos e universos fictícios autorais. Uma Wiki pessoal elegante e moderna.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Campos Detalhados</h4>
                <p className="text-xs text-slate-400">Status, perícias, alinhamento, relações e muito mais.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                {isFirebaseEnabled ? (
                  <Cloud className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">
                  {isFirebaseEnabled ? "Modo Cloud Firebase" : "Modo Local Offline"}
                </h4>
                <p className="text-xs text-slate-400">
                  {isFirebaseEnabled 
                    ? "Seus dados estão sincronizados na nuvem em tempo real." 
                    : "Os dados são salvos no navegador. Configure o Firebase no app para nuvem."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-4">
            <span>VERSION 1.0.0</span>
            <span>© {new Date().getFullYear()} EMPTY CHARACTER</span>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-slate-900/60">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {isLogin ? "Entrar no Codex" : "Criar Nova Conta"}
              </h2>
              <p className="text-sm text-slate-400">
                {isLogin 
                  ? "Acesse seus personagens e continue expandindo seu universo fictício." 
                  : "Comece sua jornada e organize todas as suas criações em um só lugar."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nome Completo / Apelido
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ex: Mestre do RPG"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    {isLogin ? "Acessar Codex" : "Criar Cadastro"}
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {isLogin 
                  ? "Não possui registro? Crie sua conta gratuita" 
                  : "Já possui conta? Entre por aqui"}
              </button>
            </div>

            {!isFirebaseEnabled && (
              <div className="text-center p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl">
                <p className="text-[10px] text-amber-300 leading-normal">
                  💡 <strong>Modo Teste Offline Ativo:</strong> Digite qualquer e-mail e senha de 4+ dígitos para fazer login simulado imediato!
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
