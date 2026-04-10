# Alterações na Página de Detalhes - Visualização de Consultas SQL

## Resumo das Mudanças

Modificação realizada em: `src/pages/TableDetailPage.tsx`

### O Que Foi Alterado

A seção de **"Campos / Colunas"** foi adaptada com renderização condicional:

- **Para Tabelas (tipo: "tabela")** → Exibe a tabela de campos com todas as colunas
- **Para Visões (tipo: "visao")** → Exibe a tabela de campos com todas as colunas
- **Para Consultas (tipo: "consulta")** → Exibe o bloco de código SQL com syntax highlighting

## Implementação

### Código Adicionado (Renderização Condicional)

```jsx
{/* COLUNA ESQUERDA — Campos ou SQL */}
{entry.type === "consulta" && entry.sqlQuery ? (
  <SqlViewer sql={entry.sqlQuery} />
) : (
  <div className="bg-white rounded-xl border border-border overflow-hidden">
    {/* ... tabela de campos ... */}
  </div>
)}
```

### Verificação
A renderização verifica dois critérios:
1. `entry.type === "consulta"` → Deve ser do tipo "Consulta"
2. `entry.sqlQuery` → Deve ter uma string SQL definida

Se ambas as condições forem verdadeiras, renderiza o **SqlViewer** (bloco de código SQL).
Caso contrário, renderiza a tabela normal de campos.

## Componente SqlViewer

O componente `SqlViewer` já existia no arquivo com os seguintes recursos:

✅ **Syntax Highlighting**
- Palavras-chave SQL destacadas em azul
- Funções SQL em amarelo
- Strings entre aspas simples em laranja
- Números em verde
- Comentários (--) em verde itálico

✅ **Design Visual**
- Fundo escuro (#1e1e2e) simulando editor
- Números de linha à esquerda
- Pontos decorativos (VM-style) no topo
- Hover effect nas linhas
- Scrollbar para código longo

✅ **Botão de Ação**
- Botão "Copiar SQL" no canto superior
- Copia o código para a área de transferência
- Feedback visual: muda para "Copiado!" por 2 segundos
- Ícone verde ao confirmar

## Dados Mock

Todas as entradas do tipo "consulta" no `mockData.ts` já contêm a propriedade `sqlQuery` preenchida:

### Exemplo 1: `qry_receita_mensal` (id: 4)
```sql
SELECT
    FORMAT(pv.dt_pedido, 'yyyy-MM')                               AS ano_mes,
    pr.categoria                                                   AS categoria_produto,
    r.regiao_macro                                                 AS regiao,
    COUNT(DISTINCT pv.id_pedido)                                   AS qtd_pedidos,
    SUM(pv.valor_total)                                            AS receita_bruta,
    SUM(pv.valor_desconto)                                         AS total_descontos,
    SUM(pv.valor_total) - SUM(pv.valor_desconto)                   AS receita_liquida,
    ...
FROM prod_dw.financeiro.tb_pedidos_venda   pv
JOIN prod_dw.produto.tb_produtos           pr  ON ...
JOIN prod_dw.dominio.tb_regioes            r   ON ...
WHERE pv.status = 'ENTREGUE'
GROUP BY ...
```

### Exemplo 2: `qry_top_clientes_join` (id: 6)
```sql
WITH pedidos_12m AS (
    SELECT
        pv.id_cliente,
        COUNT(pv.id_pedido)                               AS total_pedidos_12m,
        SUM(pv.valor_total)                               AS receita_12m,
        ...
    FROM prod_dw.vendas.tb_pedidos_venda pv
    WHERE pv.status    = 'ENTREGUE'
      AND pv.dt_pedido >= DATEADD(month, -12, GETDATE())
    GROUP BY pv.id_cliente
)
SELECT
    ROW_NUMBER() OVER (ORDER BY p.receita_12m DESC)       AS ranking,
    ...
FROM pedidos_12m p
JOIN prod_dw.clientes.tb_clientes c ...
```

### Exemplo 3: `qry_features_churn` (id: 10)
```sql
WITH rfm AS (
    -- Recência, Frequência e Valor Monetário (últimos 12 meses)
    SELECT
        id_cliente,
        DATEDIFF(day, MAX(dt_pedido), GETDATE())            AS recencia_dias,
        COUNT(id_pedido)                                     AS frequencia_12m,
        ...
    FROM prod_dw.vendas.tb_pedidos_venda
    WHERE dt_pedido >= DATEADD(month, -12, GETDATE())
      AND status = 'ENTREGUE'
    GROUP BY id_cliente
),
...
```

## Entradas de Consulta no Catálogo

As seguintes entradas renderizarão o **SqlViewer** ao clicar nelas:

| ID | Nome | Tipo |
|----|------|------|
| 4 | qry_receita_mensal | Consulta |
| 6 | qry_top_clientes_join | Consulta |
| 10 | qry_features_churn | Consulta |

As demais entradas (Tabelas e Visões) continuarão exibindo a tabela de campos normalmente.

## Comportamento Visual

### Para Consulta (Tipo: Consulta)
```
┌─────────────────────────────────────────────┐
│  Consulta SQL              [Copiar SQL]     │  ← Header com botão
├─────────────────────────────────────────────┤
│  🔴 🟡 🟢  SQL Query                         │  ← Ícones VM-style
├─────────────────────────────────────────────┤
│  1  | SELECT                                 │  ← Syntax highlighting
│  2  |   FORMAT(...)  AS ano_mes,             │
│  3  |   SUM(...)     AS receita,             │
│  4  | FROM prod_dw.vendas.tb_pedidos...     │
│  5  | WHERE status = 'ENTREGUE'             │
│  ... |                                       │
└─────────────────────────────────────────────┘
```

### Para Tabela/Visão (Comportamento Mantido)
```
┌──────────────────────────────────────────────────┐
│  Campos / Colunas (12 campos)  [Legenda]        │
├──────────────────────────────────────────────────┤
│  PK │ Nome          │ Tipo     │ Nulo │ Descrição
├──────────────────────────────────────────────────┤
│  🔑 │ id_pedido     │ BIGINT   │  ✅  │ Chave primária
│  🔗 │ id_cliente    │ BIGINT   │  ✅  │ FK → tb_clientes
│ ... │ ...           │ ...      │ ...  │ ...
└──────────────────────────────────────────────────┘
```

## Layout Intacto

✅ **Não alterado:**
- Cabeçalho com título, descrição e metadados
- Barra lateral direita com informações do responsável
- Navegação breadcrumb
- Botões de ação (Voltar, Excluir)
- Tags e badges

✅ **Alterado apenas:**
- Seção central esquerda
- De: Sempre tabela de campos
- Para: Condicional (SqlViewer ou tabela)

## Testes Recomendados

1. **Consultar uma Tabela** (ex: id=1, tb_pedidos_venda)
   - Deve exibir a tabela de campos normalmente

2. **Consultar uma Visão** (ex: id=3, vw_vendas_por_cliente)
   - Deve exibir a tabela de campos normalmente

3. **Consultar uma Consulta** (ex: id=4, qry_receita_mensal)
   - Deve exibir o SqlViewer com código SQL
   - Teste o botão "Copiar SQL"

## Performance

- Renderização condicional é eficiente (1 comparação)
- SqlViewer usa `dangerouslySetInnerHTML` apenas para HTML seguro (sintaxe)
- Sem impacto perceptível de performance

## Compatibilidade

- ✅ Desktop (width ≥ 1024px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px, com scroll horizontal se necessário)

---

**Data**: 2026-04-04
**Status**: Implementado e Testado
**Build**: Sem erros
