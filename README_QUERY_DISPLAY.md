# Visualização de Consultas SQL - Guia Rápido

## O Que É

Um sistema de renderização adaptável na página de detalhes do catálogo que:
- Mostra **tabelas de campos** para Tabelas e Visões
- Mostra **código SQL formatado** para Consultas

## Como Usar

### 1. Abrir uma Consulta

1. Vá para a página **Catálogo** (`/`)
2. Procure por uma entrada do tipo **"Consulta"** (verde):
   - qry_receita_mensal
   - qry_top_clientes_join
   - qry_features_churn
3. Clique no nome da consulta

### 2. Visualizar o SQL

Você verá um bloco de código com:
- **Syntax Highlighting**: Keywords em azul, funções em amarelo, strings em laranja
- **Números de Linha**: Alinhados à esquerda
- **Botão "Copiar SQL"**: Copia o código para a área de transferência
- **Tema Visual**: Fundo escuro com ícones decorativos no topo

### 3. Copiar o Código

1. Clique no botão **"Copiar SQL"**
2. Veja a confirmação: **"Copiado!"** em verde
3. Cole em qualquer lugar com **Ctrl+V** (ou **Cmd+V** no Mac)

## Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `src/pages/TableDetailPage.tsx` | +13 linhas: renderização condicional |

## Consultas Disponíveis

| Nome | ID | Linhas | Descrição |
|------|----|----|-----------|
| qry_receita_mensal | 4 | 21 | Receita mensal por categoria e região |
| qry_top_clientes_join | 6 | 14 | Top 100 clientes por receita (12m) |
| qry_features_churn | 10 | 51 | Features para modelo de churn |

## Comportamento

### Tabela (tipo: "tabela")
```
Mostra: Tabela com campos, tipos de dados, nullable, descrição
Exemplo: tb_pedidos_venda, tb_clientes, tb_produtos
```

### Visão (tipo: "visao")
```
Mostra: Tabela com campos, tipos de dados, nullable, descrição
Exemplo: vw_vendas_por_cliente, vw_funil_conversao, vw_desempenho_produto
```

### Consulta (tipo: "consulta")
```
Mostra: Bloco de código SQL com syntax highlighting
Exemplo: qry_receita_mensal, qry_top_clientes_join, qry_features_churn

Recursos:
- Syntax highlighting (keywords, funções, strings, números)
- Números de linha
- Botão "Copiar SQL"
- Scroll horizontal para linhas longas
- Hover effects
```

## Recursos Visuais

### Syntax Highlighting
- **Keywords**: SELECT, FROM, WHERE, JOIN, etc. → Azul e negrito
- **Funções**: COUNT, SUM, AVG, MAX, etc. → Amarelo
- **Strings**: Valores entre aspas → Laranja
- **Números**: Valores numéricos → Verde
- **Comentários**: -- comentário → Verde itálico

### Design
- **Tema**: Escuro (#1e1e2e) com tema de editor profissional
- **Ícones VM**: 🔴 🟡 🟢 no topo (decorativos)
- **Espaçamento**: Números de linha em coluna separada
- **Interatividade**: Hover nas linhas para destaque

### Responsividade
- **Desktop**: Layout completo
- **Tablet**: Layout adapta com scroll se necessário
- **Mobile**: Scroll horizontal para código longo

## Teste Rápido

```
1. Abra: http://localhost:5173/
2. Clique em um catálogo (página / Catálogo)
3. Clique em "qry_receita_mensal" (Consulta)
4. Veja o código SQL no bloco de código
5. Clique "Copiar SQL" para testar
```

## Perguntas Frequentes

### P: Onde vejo as consultas SQL?
**R:** Na página de detalhes de qualquer consulta do catálogo. Clique em uma entrada do tipo "Consulta" (verde).

### P: O botão "Copiar SQL" funciona?
**R:** Sim! Copia o código para a área de transferência. Você verá "Copiado!" em verde por 2 segundos.

### P: E as tabelas e visões? Continuam iguais?
**R:** Sim! Tabelas e Visões continuam mostrando a tabela de campos normalmente.

### P: Posso editar o código?
**R:** Não, é apenas visualização. O código é copiável mas não editável na interface.

### P: Como adicionar mais consultas?
**R:** Adicione entradas com `type: "consulta"` e `sqlQuery: "..."` em `src/lib/mockData.ts`.

## Para Desenvolvedores

### Localização do Código

```typescript
// Arquivo: src/pages/TableDetailPage.tsx
// Linhas: 337-449

{/* COLUNA ESQUERDA — Campos ou SQL */}
{entry.type === "consulta" && entry.sqlQuery ? (
  <SqlViewer sql={entry.sqlQuery} />
) : (
  <div className="bg-white rounded-xl border border-border overflow-hidden">
    {/* Tabela de campos ... */}
  </div>
)}
```

### Componente SqlViewer

Já existe no mesmo arquivo (linhas 104-172) com:
- Syntax highlighting customizado
- Tratamento de strings e comentários
- Botão "Copiar" com feedback
- Números de linha

### Adicionar Nova Consulta

```typescript
// Em src/lib/mockData.ts
{
  id: "99",
  tableName: "qry_minha_consulta",
  type: "consulta",
  sqlQuery: `SELECT * FROM tabela WHERE ...`,
  // ... outros campos ...
}
```

## Status

✅ **Implementado**: Renderização condicional funcional
✅ **Testado**: Build sem erros
✅ **Produção**: Pronto para usar

---

**Versão**: 1.0.0
**Data**: 2026-04-04
**Status**: Production Ready
