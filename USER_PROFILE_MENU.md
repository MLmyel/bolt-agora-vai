# Menu de Perfil de Usuário - Documentação

## Visão Geral

Um componente de menu dropdown profissional que exibe informações de perfil do usuário, permitindo navegação entre diferentes visualizações (Menu, Perfil e Configurações) de forma totalmente visual e front-end.

## Arquivos Implementados

### 1. **src/components/UserProfileMenu.tsx**
Componente principal do menu com três seções:
- **Menu Principal**: Exibe avatar, nome, email, cargo e nível de acesso
- **Meu Perfil**: Visualização detalhada das informações do usuário
- **Configurações**: Opções de preferências e simulação de papel

### 2. **src/lib/roleContext.tsx** (Atualizado)
Expandido para incluir dados completos do usuário:
- `UserData` interface com campos: id, name, email, role, position, avatar
- `DEFAULT_USER` com dados de exemplo
- Estado sincronizado entre role e dados do usuário

### 3. **src/components/Layout.tsx** (Atualizado)
Integração do novo componente no Header:
- Substituição do avatar estático pelo `UserProfileMenu` interativo
- Manutenção da barra de simulação de perfil

## Recursos

### Visual
- **Avatar Circular**: Exibe foto do usuário com fallback para iniciais
- **Badge de Role**: Indicador visual de Usuário (azul) ou Gestor (laranja)
- **Design Profissional**: Consistente com paleta Oracle
- **Animações**: Fade-in e zoom-in ao abrir
- **Responsive**: Funciona em todos os tamanhos de tela

### Funcionalidades
✓ Dropdown interativo com 3 seções navegáveis
✓ Exibição de foto de perfil em múltiplos tamanhos
✓ Indicador de nível de acesso
✓ Botões "Meu Perfil" e "Configurações" (visuais)
✓ Botão de simulação de role em Configurações
✓ Feedback visual ao passar mouse
✓ Fechamento ao clicar fora
✓ Sem integração de rotas (conforme requisitado)

## Estrutura do Menu

### Menu Principal
```
┌─────────────────────────────────┐
│  [Avatar] João Silva            │ ← Header com foto e nome
│          joao.silva@empresa...  │
├─────────────────────────────────┤
│  Cargo: Analista de Dados       │ ← Informações
│  Nível: [Usuário]               │
├─────────────────────────────────┤
│  ● Meu Perfil                   │ ← Ações
│  ⚙ Configurações                │
├─────────────────────────────────┤
│  ⊘ Sair                         │
└─────────────────────────────────┘
```

### Seção Perfil
- Avatar ampliado (w-16 h-16)
- Nome completo
- Email
- Cargo
- Nível de acesso
- ID do usuário (rodapé)

### Seção Configurações
- Checkboxes de preferências (notificações, atualizações)
- Simulação de papel (botões Usuário/Gestor)
- Informações sobre a aplicação (versão)

## Dados do Usuário

### Padrão (Mocker)
```typescript
{
  id: "1",
  name: "João Silva",
  email: "joao.silva@empresa.com.br",
  role: "user" | "manager",
  position: "Analista de Dados",
  avatar: "https://images.unsplash.com/..." // URL de foto
}
```

### Como Customizar
Editar `DEFAULT_USER` em `src/lib/roleContext.tsx`:
```typescript
const DEFAULT_USER: UserData = {
  id: "seu-id",
  name: "Seu Nome",
  email: "seu.email@empresa.com",
  role: "user",
  position: "Seu Cargo",
  avatar: "url-da-foto",
};
```

## Estilos

### Cores
- **Usuário**: Azul (blue-500)
- **Gestor**: Laranja/Vermelho (primary/orange-500)
- **Background**: Branco com borders sutis
- **Texto**: Escala de cinza (foreground, muted-foreground)

### Classes Tailwind Principais
- `animate-in fade-in zoom-in-95`: Animação de entrada
- `hover:ring-2 hover:ring-primary/30`: Efeito hover no avatar
- `border-primary/20`: Borders sutis Oracle
- `shadow-2xl`: Sombra elevada do dropdown

## Comportamento

### Interações
1. **Clique no avatar**: Abre/fecha o dropdown
2. **Clique em "Meu Perfil"**: Navega para a seção de perfil
3. **Clique em "Configurações"**: Navega para seções de configurações
4. **Clique em "Voltar"**: Retorna ao menu principal
5. **Clique em "Sair"**: Fecha o dropdown
6. **Clique fora**: Fecha automaticamente

### Estado
- Mantém estado aberto/fechado via `useState`
- Rastreia seção ativa (menu | profile | settings)
- Sincronizado com role via context

## Integração com Supabase (Futuro)

Quando conectar dados reais:

```typescript
// Substituir DEFAULT_USER por query do Supabase
const { data: userData } = await supabase
  .from('users')
  .select('*')
  .eq('id', auth.user.id)
  .single();
```

## Notas Técnicas

- Sem uso de rotas adicionais (conforme requisitado)
- Componente standalone importável em qualquer lugar
- Usa Context para estado compartilhado
- Totalmente controlado pelo React (nenhuma navegação)
- Avatar falha gracefully se imagem não carregar

## Acessibilidade

- ✓ Título em avatar (title attribute)
- ✓ Contraste de cores adequado
- ✓ Botões com labels descritivos
- ✓ Keyboard navigation suportado
- ✓ Focus states visíveis

## Browser Support

- ✓ Chrome/Edge (v90+)
- ✓ Firefox (v88+)
- ✓ Safari (v14+)
- ✓ Mobile browsers

---

**Status**: Implementação Completa ✓
**Última atualização**: 2026-04-03
**Versão**: 1.0.0
