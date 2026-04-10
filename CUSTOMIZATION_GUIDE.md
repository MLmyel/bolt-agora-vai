# Guia de Customização - Menu de Perfil

## Alterar Dados do Usuário Padrão

### 1. Editar Dados Mockados
Abra `src/lib/roleContext.tsx` e atualize `DEFAULT_USER`:

```typescript
const DEFAULT_USER: UserData = {
  id: "seu-id-aqui",
  name: "Seu Nome Completo",
  email: "seu.email@empresa.com.br",
  role: "user", // ou "manager"
  position: "Seu Cargo",
  avatar: "https://sua-url-de-foto.com/perfil.jpg",
};
```

### 2. Usar Foto Local
Se quiser usar uma foto local, coloque-a em `src/assets/` e importe:

```typescript
import perfilImg from "@assets/seu-foto.jpg";

const DEFAULT_USER: UserData = {
  // ... outros campos
  avatar: perfilImg,
};
```

## Customizar Estilos

### 1. Alterar Cores de Role
Em `src/components/UserProfileMenu.tsx`, localize `getRoleBadgeStyles()`:

```typescript
const getRoleBadgeStyles = () => {
  if (role === "manager") {
    return "bg-red-500/12 text-red-600 border border-red-500/20"; // Novo: vermelho
  }
  return "bg-green-500/12 text-green-600 border border-green-500/20"; // Novo: verde
};
```

### 2. Alterar Tamanho do Avatar
Procure por classes como `w-8 h-8`, `w-12 h-12`, `w-16 h-16`:

```typescript
// Avatar pequeno (trigger)
// De: w-8 h-8
// Para: w-10 h-10

// Avatar médio (header do menu)
// De: w-12 h-12
// Para: w-14 h-14

// Avatar grande (seção perfil)
// De: w-16 h-16
// Para: w-20 h-20
```

### 3. Alterar Largura do Dropdown
Em `UserProfileMenu.tsx`, mude `w-80`:

```typescript
<div className="absolute right-0 mt-2 w-80 bg-white..."> {/* ← mude de w-80 */}
```

Opções: `w-64`, `w-72`, `w-80`, `w-96`

## Adicionar Novos Campos de Usuário

### 1. Estender Interface
Em `src/lib/roleContext.tsx`:

```typescript
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  position: string;
  avatar: string;
  department?: string;     // ← Novo
  phone?: string;          // ← Novo
  joinDate?: string;       // ← Novo
}
```

### 2. Atualizar DEFAULT_USER
```typescript
const DEFAULT_USER: UserData = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@empresa.com.br",
  role: "user",
  position: "Analista de Dados",
  avatar: "...",
  department: "Engenharia de Dados",     // ← Novo
  phone: "+55 (11) 98765-4321",          // ← Novo
  joinDate: "15/01/2024",                // ← Novo
};
```

### 3. Exibir nos Componentes
Em `UserProfileMenu.tsx`, adicione na seção de perfil:

```typescript
{/* Profile View */}
{activeSection === "profile" && (
  <>
    {/* ... código existente ... */}

    <div className="space-y-3 text-center">
      {/* ... campos existentes ... */}

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Departamento
        </p>
        <p className="text-sm font-medium text-foreground">
          {user.department}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Data de Ingresso
        </p>
        <p className="text-sm font-medium text-foreground">
          {user.joinDate}
        </p>
      </div>
    </div>
  </>
)}
```

## Adicionar Novas Seções

### Exemplo: Adicionar Seção "Privacidade"

1. **Adicione ao tipo:**
```typescript
type ActiveSection = "menu" | "profile" | "settings" | "privacy"; // ← Novo
```

2. **Adicione estado:**
```typescript
const [activeSection, setActiveSection] = useState<ActiveSection>("menu");
```

3. **Adicione método:**
```typescript
const handlePrivacyClick = () => {
  setActiveSection("privacy");
};
```

4. **Adicione botão no menu:**
```typescript
<button
  onClick={handlePrivacyClick}
  className="w-full px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors duration-150 flex items-center gap-2"
>
  <Lock className="w-4 h-4 text-muted-foreground" />
  Privacidade
</button>
```

5. **Adicione conteúdo:**
```typescript
{activeSection === "privacy" && (
  <>
    <div className="p-4 border-b border-border flex items-center justify-between">
      <h3 className="font-semibold text-foreground">Privacidade</h3>
      <button
        onClick={handleMenuClick}
        className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wider"
      >
        Voltar
      </button>
    </div>

    <div className="p-4 space-y-4">
      {/* Conteúdo da seção */}
    </div>
  </>
)}
```

## Conectar com Supabase

### 1. Criar Hook Personalizado
Crie `src/hooks/useUserProfile.ts`:

```typescript
import { useEffect, useState } from "react";
import { useRole } from "@/lib/roleContext";
import { supabase } from "@/lib/supabase"; // Configure sua instância

export function useUserProfile() {
  const { setUser } = useRole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          setUser({
            id: user.id,
            name: profile.name,
            email: user.email || "",
            role: profile.role,
            position: profile.position,
            avatar: profile.avatar,
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [setUser]);

  return { loading };
}
```

### 2. Usar no App
Em `src/App.tsx`:

```typescript
import { useUserProfile } from "@/hooks/useUserProfile";

function App() {
  useUserProfile(); // Carrega dados do Supabase na inicialização

  return (
    // ... resto do app
  );
}
```

## Estender com Logout Real

Em `UserProfileMenu.tsx`, altere `handleLogout`:

```typescript
const handleLogout = async () => {
  // Chamada real de logout
  await supabase.auth.signOut();

  setIsOpen(false);
  setActiveSection("menu");

  // Redirecionar para login se tiver rota
  // window.location.href = "/login";
};
```

## Adicionar Notificações de Click

```typescript
const handleProfileClick = () => {
  setActiveSection("profile");
  console.log("Usuário acessou: Meu Perfil");
};

const handleSettingsClick = () => {
  setActiveSection("settings");
  console.log("Usuário acessou: Configurações");
};
```

## Temas Escuros (Dark Mode)

Se implementar dark mode no futuro, atualize as classes:

```typescript
// De:
<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl">

// Para:
<div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-2xl dark:shadow-xl">
```

---

**Dicas**:
- Sempre testar no navegador após mudanças
- Use `npm run build` para verificar erros
- Commit mudanças incrementalmente
- Documente customizações importantes

