# Estrutura Visual do Menu de Perfil

## Fluxo de Navegação

```
┌─────────────────────────────────────────┐
│  HEADER (Layout.tsx)                    │
│  ┌──────────────────────────────────┐   │
│  │ Simular Perfil: [Usuário][Gestor]│   │
│  │                          [Avatar]│←──┼─── UserProfileMenu Component
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
        Clique no Avatar [Avatar]
                    ↓
┌──────────────────────────────────────────┐
│         DROPDOWN MENU (w-80)             │
├──────────────────────────────────────────┤
│                                          │
│  MENU PRINCIPAL                          │
│  ┌────────────────────────────────────┐ │
│  │ ┌──────────┐                       │ │
│  │ │[  IMG  ] │  João Silva           │ │
│  │ │[  :JS:] │  joao.silva@...       │ │
│  │ └──────────┘                       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Cargo: Analista de Dados           │ │
│  │ Nível: [Usuário] ou [Gestor]       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ● Meu Perfil          ← Navega    │ │
│  │ ⚙ Configurações       ← Navega    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ⊘ Sair                             │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
     ↙              ↓              ↘
   Clica           Clica           Clica
   Perfil          Sair            Config
     ↓              ↓                ↓
  [PERFIL]       [FECHA]          [CONFIG]
     ↓                               ↓
  DROPDOWN                        DROPDOWN
   (diff)                          (diff)
```

## Seção 1: Menu Principal

### Estrutura HTML
```
┌─────────────────────────────────────┐
│ HEADER (bg-gradient-to-r)           │
├─────────────────────────────────────┤
│  [Avatar 12x12]  Nome               │
│                  Email              │
├─────────────────────────────────────┤
│  Cargo: [Texto]                     │
│  Nível: [Badge: Usuário/Gestor]     │
├─────────────────────────────────────┤
│  ● Meu Perfil                       │
│  ⚙ Configurações                    │
├─────────────────────────────────────┤
│  ⊘ Sair                             │
└─────────────────────────────────────┘
```

### Cores
- Header background: `from-primary/5 to-primary/2`
- Badge Usuário: Azul (blue-500)
- Badge Gestor: Laranja (primary/orange)
- Ícones: Muted-foreground

## Seção 2: Meu Perfil

### Estrutura HTML
```
┌─────────────────────────────────────┐
│ HEADER (com botão Voltar)           │
│ Meu Perfil              [Voltar]    │
├─────────────────────────────────────┤
│         [Avatar 16x16]              │ ← Ampliado
│                                     │
│  NOME COMPLETO                      │
│  João Silva                         │
│                                     │
│  EMAIL                              │
│  joao.silva@empresa.com.br          │
│                                     │
│  CARGO                              │
│  Analista de Dados                  │
│                                     │
│  NÍVEL DE ACESSO                    │
│  [Badge: Usuário]                   │
│                                     │
├─────────────────────────────────────┤
│  ID do Usuário: 1                   │
└─────────────────────────────────────┘
```

### Layout
- Avatar: Centralizado, w-16 h-16
- Informações: Centradas, espaçamento vertical
- Formato: Rótulo (uppercase) + Valor (destacado)

## Seção 3: Configurações

### Estrutura HTML
```
┌─────────────────────────────────────┐
│ HEADER                              │
│ Configurações           [Voltar]    │
├─────────────────────────────────────┤
│                                     │
│  PREFERÊNCIAS                       │
│  ☑ Notificações por email           │
│  ☑ Atualizações do catálogo         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  SIMULAÇÃO DE PAPEL                 │
│  Mude o modo de acesso para         │
│  testar a interface como Gestor.    │
│                                     │
│  [Usuário] [Gestor]                 │
│    ↑                                │
│   Botões desativados de acordo      │
│   com role atual                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  SOBRE                              │
│  Data Catalog Pro v1.0.0            │
│                                     │
└─────────────────────────────────────┘
```

### Elementos Interativos
- Checkboxes: Simulados, sem funcionalidade
- Botões Usuário/Gestor: Um desativado por vez
- "Voltar": Retorna ao menu principal

## Componentes Internos

### Avatar Component
```typescript
<div className="w-[size] h-[size] rounded-full">
  {user.avatar ? (
    <img src={user.avatar} />
  ) : (
    <span>{initials}</span>  // ex: JS
  )}
</div>
```

### Badge Component
```typescript
<span className={cn(
  "inline-block px-2.5 py-1 rounded-md text-xs font-semibold",
  role === "manager"
    ? "bg-orange-500/12 text-orange-600 border border-orange-500/20"
    : "bg-blue-500/12 text-blue-600 border border-blue-500/20"
)}>
  {role === "manager" ? "Gestor" : "Usuário"}
</span>
```

### Button States
```typescript
// Normal
hover:bg-muted
transition-colors duration-150

// Ativo (Meu Perfil)
flex items-center gap-2
icon: primary/20 dot

// Logout (Sair)
text-destructive
hover:bg-destructive/5
```

## Animações

### Entrada do Dropdown
```css
animate-in fade-in zoom-in-95 duration-200
```
- Fade: 0 → 100% opacity
- Zoom: 95% → 100% scale
- Duração: 200ms

### Hover nos Botões
```css
hover:bg-muted
transition-colors duration-150
```
- Background muda para muted
- Suave em 150ms

### Focus no Avatar
```css
hover:ring-2 hover:ring-primary/30
focus:outline-none focus:ring-2 focus:ring-primary/50
```
- Ring visual ao focar
- Cores suaves (primary/30 e primary/50)

## Responsividade

### Desktop (≥1024px)
```
Header
├─ Simular Perfil
├─ Botões [Usuário][Gestor]
└─ UserProfileMenu
   └─ Dropdown (w-80)
```

### Tablet (768px - 1023px)
```
Layout igual
Dropdown pode ocupar mais largura se necessário
```

### Mobile (< 768px)
```
Header
├─ Simular Perfil (pode ficar em una linha)
├─ Botões [Usuário][Gestor] (pode ser ícone)
└─ UserProfileMenu
   └─ Dropdown (w-72 ou w-64)
      Ajusta automaticamente
```

## Hierarquia de Espaçamento (8px system)

```
Padding Interno:    p-3 (12px) ou p-4 (16px)
Gap entre items:    gap-2 (8px) ou gap-3 (12px)
Border Radius:      rounded-md (4px) ou rounded-lg (8px)
Avatar Border:      border-2 (2px)
Divisões:           border-b (1px)
```

## Hierarquia Tipográfica

```
Nome:               font-semibold text-sm
Email:              text-xs text-muted-foreground
Labels:             text-xs uppercase tracking-wider
Valores:            font-medium text-sm text-foreground
Botões:             font-medium text-sm
```

## Estados Possíveis

### Avatar
- Ativo (com foco): `ring-2 ring-primary/50`
- Hover: `ring-2 ring-primary/30`
- Normal: Sem ring

### Dropdown
- Aberto: Visível com animação
- Fechado: Hidden/Display:none

### Seção Ativa
- menu | profile | settings
- Renderização condicional de conteúdo

### Role
- user (azul)
- manager (laranja)

## Estrutura de Arquivos

```
src/
├── components/
│   ├── UserProfileMenu.tsx    ← Novo componente
│   ├── Layout.tsx              ← Modificado (adiciona menu)
│   └── ui/
│       └── dropdown-menu.tsx   ← Já existe (não modificado)
│
└── lib/
    └── roleContext.tsx         ← Modificado (expandido)
```

## Props e State

### State Gerenciado
```typescript
const [isOpen, setIsOpen] = useState(false);
const [activeSection, setActiveSection] = useState<"menu" | "profile" | "settings">("menu");
```

### Context Consumido
```typescript
const { user, role } = useRole();
```

### Funções Principais
```typescript
getInitials(name)      → "JS"
getRoleBadgeStyles()   → className string
handleProfileClick()   → Navega para perfil
handleSettingsClick()  → Navega para config
handleMenuClick()      → Retorna ao menu
handleLogout()         → Fecha dropdown
```

---

**Nota**: Toda a estrutura é visual e interativa sem modificação de rotas ou páginas reais.
