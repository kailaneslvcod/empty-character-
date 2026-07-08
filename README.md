# Empty Character 🌌

Empty Character é uma **Wiki/Codex moderna, interativa e altamente polida** desenvolvida para que mestres de RPG, escritores, criadores de jogos e entusiastas de universos fictícios possam criar, organizar, conectar e gerenciar as biografias completas de seus personagens.

O projeto foi projetado seguindo as melhores práticas de engenharia de software front-end (arquitetura modular, SOLID, DRY) e com uma interface premium inspirada em ferramentas icônicas como **Obsidian, Notion, GitBook, Arc Browser e Codex de jogos AAA**.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** & **Vite** (Garante builds ultra-rápidos e recarregamento otimizado)
- **TypeScript** (Tipagem forte em todo o ciclo de vida dos dados)
- **Tailwind CSS v4** (Estilização premium, ágil e 100% responsiva)
- **Motion (framer-motion)** (Micro-interações e transições cinemáticas fluidas)
- **Lucide Icons** (Biblioteca de ícones moderna e consistente)
- **Firebase Core SDK** (Firestore Database, Cloud Storage e Authentication)

---

## 🏗️ Estrutura de Pastas & Arquitetura

O projeto adota uma estrutura de pastas modular e limpa para facilitar a escalabilidade e a manutenção:

```bash
/
├── .env.example          # Modelo de variáveis de ambiente
├── index.html            # Ponto de entrada do documento HTML
├── metadata.json         # Metadados do aplicativo para a AI Studio
├── package.json          # Manifesto de dependências e scripts npm
├── tsconfig.json         # Configurações de compilação do TypeScript
├── vite.config.ts        # Configurações de empacotamento do Vite
└── src/
    ├── main.tsx          # Ponto de entrada do aplicativo React
    ├── index.css         # Configurações globais de CSS, fontes e temas do Tailwind v4
    ├── types.ts          # Definições globais de interfaces de dados (SOLID)
    ├── firebase/
    │   └── config.ts     # Configuração e inicialização dinâmica do Firebase Core
    ├── services/
    │   ├── auth.ts       # Serviço unificado de autenticação (Firebase Auth + Fallback Local)
    │   └── db.ts         # Camada unificada de persistência (Firebase Firestore + Storage + Fallback Local)
    ├── utils/
    │   └── image.ts      # Utilitários de compressão automática e validação de imagens
    ├── components/
    │   ├── Sidebar.tsx   # Painel lateral retrátil com gerência de categorias/tags
    │   ├── Dashboard.tsx # Painel de estatísticas, novos e atualizados personagens
    │   ├── CharacterCard.tsx # Visualização em grade elegante do personagem
    │   ├── CharacterForm.tsx # Formulário dinâmico multi-abas de criação/edição (~40 campos + upload D&D)
    │   ├── FirebaseSettingsModal.tsx # Painel para inserção de chaves do Firebase diretamente na UI
    │   └── Toast.tsx     # Contexto e animações de notificações flutuantes (Toasts)
    └── pages/
        ├── AuthPage.tsx  # Tela de autenticação unificada de usuários
        └── Home.tsx      # Dashboard geral, barra de pesquisa inteligente e filtros dinâmicos
```

### Arquitetura de Sincronização e Resiliência (Fallback Mode)
O sistema possui uma camada arquitetural avançada de sincronização de dados:
1. **Modo Offline/LocalStorage (Padrão)**: Caso as credenciais do Firebase não estejam configuradas, o sistema opera de forma autônoma salvando tudo localmente no navegador. Imagens carregadas são compactadas para resoluções de alto desempenho e salvas em Base64 compactado.
2. **Modo Cloud/Firebase (Nuvem)**: Quando configurado, o aplicativo migra de forma totalmente transparente e em tempo real para sincronização de coleções no **Firestore**, upload físico de imagens tratadas no **Firebase Storage** e autenticação de usuários múltiplos no **Firebase Authentication**.

---

## 🚀 Como Instalar e Rodar Localmente

### Pré-requisitos
Certifique-se de possuir o [Node.js (LTS)](https://nodejs.org/) instalado em sua máquina.

### Passos de Execução
1. Clone este repositório para o seu ambiente local:
   ```bash
   git clone https://github.com/seu-usuario/empty-character.git
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd empty-character
   ```
3. Instale todas as dependências requeridas:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev
   ```
5. Abra o navegador no endereço indicado (geralmente [http://localhost:3000](http://localhost:3000)).

---

## 🔥 Como Configurar o Firebase

Você não precisa modificar o código-fonte para testar a integração com o Firebase! O aplicativo possui uma tela de configurações nativa:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2. No menu lateral do console:
   - Ative o **Authentication** e habilite o provedor de login por **E-mail/Senha**.
   - Ative o **Firestore Database** em modo de teste ou de produção.
   - Ative o **Storage** para gerenciar os uploads de imagens.
3. No painel principal do projeto no Firebase, adicione um novo **aplicativo Web** e copie as chaves de configuração geradas (objeto `firebaseConfig`).
4. Abra o Empty Character no navegador, clique no botão **Firebase** no rodapé do menu lateral e cole suas chaves nos campos correspondentes.
5. Clique em **Salvar e Inicializar**. A página será recarregada e seu Codex estará integrado à nuvem!

---

## 🌐 Como Publicar no GitHub Pages

O Empty Character foi projetado para funcionar 100% de forma estática com caminhos relativos, tornando-o perfeitamente compatível com o **GitHub Pages**:

1. Instale o pacote utilitário do GitHub Pages como dependência de desenvolvimento:
   ```bash
   npm install -D gh-pages
   ```
2. Adicione ou edite o campo `base` em seu arquivo `vite.config.ts` para corresponder ao nome do repositório no GitHub:
   ```typescript
   export default defineConfig({
     base: '/nome-do-repositorio/',
     // restante das configurações...
   })
   ```
3. No seu `package.json`, adicione os seguintes scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Execute o deploy automático:
   ```bash
   npm run deploy
   ```
5. Acesse as configurações do seu repositório no GitHub, vá em **Pages** e certifique-se de que a origem do build está definida para a branch `gh-pages`. Seu Codex estará publicado no ar em instantes!

---

## 🎨 Guia de Customização

### Como Alterar Cores
As variáveis de cores principais são baseadas no ecossistema escuro elegante do Tailwind CSS. Para modificar a paleta cromática do site, acesse o arquivo `/src/index.css` e substitua as cores padrão usando classes utilitárias ou as variáveis globais de CSS:
- Para modificar o tom geral do fundo principal (`bg-[#090D16]`), altere as referências nas páginas principais em `AuthPage.tsx`, `App.tsx` e `Home.tsx` para os tons desejados (ex: `bg-slate-950` ou `bg-zinc-950`).
- O tom azulado de destaque é baseado na cor `indigo` do Tailwind (ex: `bg-indigo-600`, `text-indigo-400`). Você pode alterar todas as referências de `indigo` para outras paletas como `violet`, `emerald`, `amber` ou `rose` para mudar completamente o visual do Codex.

### Como Alterar Fontes
O aplicativo utiliza as fontes do Google Fonts (`Inter` para interface comum, `Space Grotesk` para títulos e `JetBrains Mono` para dados técnicos). Para trocar as fontes:
1. Altere o link de importação `@import url(...)` no topo de `/src/index.css` com a nova fonte desejada do Google Fonts.
2. Modifique as diretivas de tema `@theme` no mesmo arquivo:
   ```css
   @theme {
     --font-sans: "Sua Nova Fonte Sans", sans-serif;
     --font-display: "Sua Nova Fonte Display", sans-serif;
     --font-mono: "Sua Nova Fonte Mono", monospace;
   }
   ```

### Como Adicionar Novos Campos aos Personagens
Graças à tipagem robusta e centralizada do projeto, adicionar novos campos é extremamente simples:
1. Abra `/src/types.ts` e declare a nova propriedade na interface `Character` (opcional ou obrigatória):
   ```typescript
   export interface Character {
     // ...campos existentes...
     customField?: string; // Exemplo de novo campo
   }
   ```
2. Abra `/src/components/CharacterForm.tsx`:
   - Adicione o estado para o novo campo: `const [customField, setCustomField] = useState("");`.
   - Popule-o no `useEffect` de inicialização: `setCustomField(character?.customField || "");`.
   - Adicione o valor no retorno do método `getFormDataAsCharacter`: `customField: customField.trim() || undefined,`.
   - Adicione um novo input/textarea na interface correspondente à aba de sua preferência para permitir a edição.
3. Abra `/src/pages/CharacterDetail.tsx` para exibir visualmente o valor do novo campo na página do personagem onde desejar!

---

## 📜 Licença

Este projeto está licenciado sob as diretivas acadêmicas e de software livre Apache 2.0. Consulte o cabeçalho das páginas de código para mais detalhes.

Desenvolvido com maestria por **Empty Character** 🌌.
