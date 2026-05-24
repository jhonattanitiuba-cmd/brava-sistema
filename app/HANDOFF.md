# Brava CRM - Handoff Visual & Tokens (v1.2)

> **Para:** Claude Code / Cursor / dev humano
> **Conteúdo:** decisões visuais já tomadas + tokens prontos para colar em `tailwind.config.js` ou `globals.css`. Use junto com o BRIEF.md original (escopo funcional, multi-tenant, planos, Brava Admin).

---

## 1. Stack confirmada (resumo)

- React 18 + Tailwind 3 + shadcn/ui
- Fontes: **Space Grotesk** (display, 400/500/700), **Inter** (body, 400/500/700), **JetBrains Mono** (mono inputs/codes)
- Ícones: **Lucide** (line, 1.5px). **Zero emoji** em qualquer parte.
- Modo padrão: **dark** (`#000000`). Light em **off-white `#F0F0F0`** (não branco puro).

---

## 2. Tokens CSS prontos

Cole em `:root` (modo dark é o default; light vive sob `[data-theme="light"]`):

```css
:root {
  /* Marca */
  --brava-purple: #7B3FE4;
  --brava-blue:   #1E90FF;
  --brava-grad: linear-gradient(90deg, #7B3FE4 0%, #1E90FF 100%);

  /* Estados (mesmas em ambos os modos) */
  --success: #1D9E75; --success-bg: #E1F5EE; --success-fg: #085041;
  --warning: #BA7517; --warning-bg: #FAEEDA; --warning-fg: #633806;
  --danger:  #A32D2D; --danger-bg:  #FCEBEB; --danger-fg:  #791F1F;
  --info:    #185FA5; --info-bg:    #E6F1FB; --info-fg:    #0C447C;

  /* Tipografia */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* Raios */
  --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 20px; --r-2xl: 28px;
}

/* Dark (default) */
:root, :root[data-theme="dark"] {
  --bg-deep:     #000000;
  --bg-elevated: #0E0E14;
  --bg-card:     #15151E;
  --bg-card-elev:#1B1B27;
  --border:      #2A2A3A;
  --border-soft: #1F1F2A;
  --text-1: #F5F5F7;
  --text-2: #A0A0AA;
  --text-3: #6E6E78;
  --shadow-card: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.45);
}

/* Light (off-white, não branco puro) */
:root[data-theme="light"] {
  --bg-deep:     #F0F0F0;
  --bg-elevated: #F0F0F0;
  --bg-card:     #FFFFFF;
  --bg-card-elev:#FFFFFF;
  --border:      #D8D8D8;
  --border-soft: #E6E6E6;
  --text-1: #0A0A0F;
  --text-2: #4A4A52;
  --text-3: #8E8E94;
  --shadow-card: 0 1px 2px rgba(20,20,40,.06), 0 6px 20px rgba(20,20,40,.06);
}
```

### Equivalente Tailwind (`tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      brava: { purple: '#7B3FE4', blue: '#1E90FF' },
      bg:    { deep: 'var(--bg-deep)', elevated: 'var(--bg-elevated)', card: 'var(--bg-card)' },
      ink:   { 1: 'var(--text-1)', 2: 'var(--text-2)', 3: 'var(--text-3)' },
      success: '#1D9E75', warning: '#BA7517', danger: '#A32D2D', info: '#185FA5',
    },
    fontFamily: {
      display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      sans:    ['Inter', 'ui-sans-serif', 'system-ui'],
      mono:    ['JetBrains Mono', 'ui-monospace'],
    },
    backgroundImage: {
      'brava-grad': 'linear-gradient(90deg, #7B3FE4 0%, #1E90FF 100%)',
    },
    boxShadow: {
      'brava-cta': '0 6px 20px rgba(123,63,228,.35)',
    },
    borderRadius: { sm: '6px', md: '10px', lg: '14px', xl: '20px', '2xl': '28px' },
  },
},
```

---

## 3. Tipografia - escala adotada

| Token | Tamanho | Peso | Família |
|---|---|---|---|
| H1 | 56-72px | 700 | Space Grotesk |
| H2 | 36-44px | 500 | Space Grotesk |
| H3 | 24-28px | 500 | Space Grotesk |
| Body | 17px | 400 | Inter |
| Small | 14px | 500 | Inter |
| Micro/mono | 12px | 400 | JetBrains Mono |

Letter-spacing display: `-0.02em` em H1/H2, `-0.01em` em H3.

---

## 4. Componentes-base implementados

Já desenhados no protótipo HTML (referência visual em `Brava CRM.html`). Replicar com shadcn:

- **Button**: variantes `primary` (gradient), `solid`, `outline`, `ghost`, `danger`. Tamanhos sm/md/lg. Suporta ícone à esquerda/direita.
- **Input**: label, ícone à esquerda, suffix à direita (ex: `.brava.app`), estado de erro, hint.
- **Card**: padding 22px, raio 14px. Variante `accent` com borda gradient (técnica `linear-gradient padding-box + border-box`).
- **Badge**: `neutral`, `brand` (gradient), `success`, `warning`, `danger`, `info`. Aceita ícone Lucide 12px.
- **Avatar**: iniciais sobre gradiente; status dot (verde/cinza, sem ícone).
- **Toggle**: track 38×22, thumb 18×18, gradiente quando ligado.

### Regras de uso do gradiente

- ✅ CTAs primários, headlines com palavra-chave (`background-clip: text`), bordas de item destacado, ícones de destaque, avatar fallback, status do passo ativo.
- ❌ Nunca em corpo de texto longo, fundo de seção inteira, ou aplicação geral de UI.

---

## 5. Telas implementadas (referência)

1. **Brand Proof** (`/brand`) - fundação visual, 4 seções: Lockup, Paleta, Tipografia, Primitivos, Princípios.
2. **Login** (`/login`) - split (painel de marca preto + form claro/escuro). Indicador de workspace (`<slug>.brava.app`). Toggle de senha. Link "Esqueci senha". SSO Enterprise desabilitado.
3. **Forgot password** (`/forgot-password`) - card centralizado com estados pré e pós-envio (hints de TTL 30min, uso único).
4. **Onboarding** (`/onboarding`) - wizard de 4 passos com sidebar de progresso:
   - **01 Workspace**: nome, slug, upload de logo, color picker (6 presets com Brava destacada), preview ao vivo da sidebar do tenant.
   - **02 Canal**: dois modos (Evolution API com QR code + Cloud API). QR code gerado proceduralmente, com simulação de scan.
   - **03 Equipe**: 3 cards de role, tabela de convites com role select, barra de limite do plano (`X de 10`).
   - **04 Agente IA**: form de contexto (o que faz, horário, FAQ, tom, modelo) + chat preview + meter de "contexto fornecido".

---

## 6. Padrões de página (esqueleto a seguir nas demais telas)

### Workspace operacional (Dashboard, Conversas, Pipeline, etc.)

```
┌──────────┬─────────────────────────────────────────────────────────┐
│ Sidebar  │  Header (breadcrumb + busca + notif + avatar)           │
│ 240px    ├─────────────────────────────────────────────────────────┤
│          │                                                         │
│ • Logo   │  Conteúdo principal                                     │
│ • Nav    │  (max-width 1440, padding 32px)                         │
│ • Footer │                                                         │
│   - SUP  │                                                         │
│   - SAIR │                                                         │
└──────────┴─────────────────────────────────────────────────────────┘
```

- Sidebar `bg: var(--bg-elevated)`, border-right `var(--border-soft)`.
- Item ativo: fundo `color-mix(in oklab, var(--brava-purple) 12%, transparent)` + borda esquerda 2px gradient.
- Aba "Suporte" no rodapé, separada por divisor.

### Brava Admin - sinalização visual

- Topo da sidebar ganha **faixa gradient roxo→azul de 4px** + label `BRAVA ADMIN` em mono.
- Header ganha banner discreto: "Você está no painel interno Brava".

### Impersonate - banner obrigatório

- Faixa fixa no topo, fundo `var(--danger)`, altura 40px, texto branco: "Você está vendo como **[Cliente]** · [Sair do modo impersonate]".
- Body recebe `padding-top: 40px` adicional.

---

## 7. Iconografia - mapeamento Lucide

| Conceito | Lucide |
|---|---|
| Dashboard | `LayoutDashboard` |
| Conversas | `MessageCircle` ou `Inbox` |
| Pipeline | `KanbanSquare` |
| Analytics | `BarChart3` |
| Contatos | `Users` |
| Etiquetas | `Tag` |
| Configurações | `Settings` |
| Suporte | `LifeBuoy` |
| Reservas (vertical auto) | `CalendarCheck` |
| Sair | `LogOut` |
| Tema | `Moon` / `Sun` |
| Busca | `Search` · Notif | `Bell` |
| Anexo | `Paperclip` · Áudio | `Mic` · Enviar | `Send` |
| Tenants | `Building2` · Equipe Brava | `UsersRound` |
| MRR | `TrendingUp` · Saúde | `Activity` · Logs | `ScrollText` |
| Bug | `Bug` · Sugestão | `Lightbulb` · Dúvida | `HelpCircle` · KB | `BookOpen` |
| Impersonate | `EyeOff` |
| IA | `Sparkles` |

Tamanhos: 14px inline, 16-18px em botões, 20-24px em headers, 48-64px em empty states (opacidade 30-40%).

---

## 8. Próximos entregáveis sugeridos

Em ordem de impacto (cada um é uma tela ou um set):

1. **Dashboard** + **Conversas** (inbox 3 colunas) - coração operacional.
2. **Pipeline** + **Analytics** - diferencial vs. concorrência básica.
3. **Configurações** (9 abas + Billing) - fechamento do produto do cliente.
4. **Aba Suporte do cliente** + **Brava Admin Home** + **Inbox de chamados** - o loop de feedback.
5. **Tenants & Impersonate** + **Equipe Brava** - operação interna.
6. **MRR / Planos / Saúde / Logs** - financeiro & técnico.

---

## 9. Princípios visuais (não negociáveis)

1. **Gradiente é assinatura, não fundo.** Acento pontual.
2. **Zero emoji.** Lucide outline, sempre.
3. **Off-white > branco puro.** Light vive em `#F0F0F0`.
4. **Três pesos de fonte.** Não cinco.
5. **Hierarquia carrega o sistema.** Display Space Grotesk faz o trabalho pesado.
6. **Empresário paga R$ 1.297/mês - o produto tem que parecer R$ 1.297/mês.**

---

## 10. Como usar este arquivo com Claude Code

```
1. Cole BRIEF.md (o documento original com escopo funcional) na raiz do repo.
2. Cole HANDOFF.md (este arquivo) ao lado.
3. Inicie sessão: "Leia BRIEF.md + HANDOFF.md. Implemente a Fase 0 da Fundação:
   tokens, fontes, primitivos, telas de auth e onboarding. Siga o
   Brava CRM.html como referência visual."
4. Próximas sessões: "Implemente a Fase 1 (Dashboard + Conversas). Mantenha
   os tokens de HANDOFF.md."
```

Versão: 1.2 · maio/2026
