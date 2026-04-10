export interface FieldDefinition {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  foreignRef?: string;
}

export interface OwnerInfo {
  name: string;
  email: string;
  team: string;
  teamLead: string;
  slack: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  sla: string;
  updateFrequency: string;
  dataSource: string;
}

export interface CatalogEntry {
  id: string;
  tableName: string;
  description: string;
  longDescription: string;
  owner: string;
  ownerInfo: OwnerInfo;
  tags: string[];
  createdAt: string;
  type: "tabela" | "visao" | "consulta";
  database: string;
  schema: string;
  rowCount: string;
  fields: FieldDefinition[];
  sqlQuery?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const MOCK_CATALOG: CatalogEntry[] = [
  {
    id: "1",
    tableName: "tb_pedidos_venda",
    description: "Tabela transacional contendo todos os pedidos de venda de clientes, incluindo itens, totais e status de entrega.",
    longDescription: "Tabela principal de pedidos de venda do sistema transacional (OLTP). Armazena cada pedido gerado pelos canais de venda (e-commerce, loja física e televendas), com granularidade de cabeçalho. Os itens do pedido estão em tb_itens_pedido. Atualizada em tempo real via CDC (Change Data Capture) a partir do banco de dados de origem.",
    owner: "engenharia-de-dados",
    ownerInfo: {
      name: "Carlos Mendes",
      email: "carlos.mendes@empresa.com.br",
      team: "Engenharia de Dados",
      teamLead: "Ana Paula Souza",
      slack: "#dados-engenharia",
      createdAt: "15/01/2024",
      updatedAt: "10/03/2025",
      version: "3.2",
      sla: "99,5% de disponibilidade",
      updateFrequency: "Tempo real (CDC)",
      dataSource: "ERP Salesforce / Oracle",
    },
    tags: ["vendas", "pedidos", "transacional"],
    createdAt: "15/01/2024",
    type: "tabela",
    database: "prod_dw",
    schema: "vendas",
    rowCount: "~18,4 mi",
    fields: [
      { name: "id_pedido", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do pedido (chave primária)." },
      { name: "id_cliente", type: "BIGINT", nullable: false, isForeignKey: true, foreignRef: "tb_clientes.id_cliente", description: "Referência ao cliente que realizou o pedido." },
      { name: "id_canal_venda", type: "INT", nullable: false, description: "Canal pelo qual o pedido foi gerado (1=e-commerce, 2=loja física, 3=televendas)." },
      { name: "dt_pedido", type: "TIMESTAMP", nullable: false, description: "Data e hora em que o pedido foi registrado no sistema." },
      { name: "dt_entrega_prevista", type: "DATE", nullable: true, description: "Data prevista para entrega ao cliente." },
      { name: "dt_entrega_real", type: "DATE", nullable: true, description: "Data real de entrega. Nulo se ainda não entregue." },
      { name: "status", type: "VARCHAR(30)", nullable: false, description: "Status atual do pedido: PENDENTE, APROVADO, EM_TRANSITO, ENTREGUE, CANCELADO." },
      { name: "valor_total", type: "DECIMAL(15,2)", nullable: false, description: "Valor total do pedido incluindo frete, impostos e descontos." },
      { name: "valor_desconto", type: "DECIMAL(15,2)", nullable: false, description: "Valor total de descontos aplicados ao pedido." },
      { name: "id_cupom", type: "VARCHAR(20)", nullable: true, description: "Código do cupom de desconto utilizado. Nulo se não houver cupom." },
      { name: "criado_em", type: "TIMESTAMP", nullable: false, description: "Data de criação do registro na tabela." },
      { name: "atualizado_em", type: "TIMESTAMP", nullable: false, description: "Data da última atualização do registro." },
    ],
  },
  {
    id: "2",
    tableName: "tb_clientes",
    description: "Tabela mestre de clientes com dados demográficos, informações de contato, segmentação e métricas de valor vitalício.",
    longDescription: "Tabela mestre (Master Data) de clientes, consolidada a partir de múltiplas fontes: CRM Salesforce, sistema de e-commerce e dados de fidelidade. Contém o registro golden de cada cliente após processo de deduplicação. Utilizada como referência principal para análises de CRM, segmentação de marketing e modelos preditivos.",
    owner: "time-crm",
    ownerInfo: {
      name: "Fernanda Lima",
      email: "fernanda.lima@empresa.com.br",
      team: "CRM & Dados de Cliente",
      teamLead: "Roberto Alves",
      slack: "#crm-dados",
      createdAt: "20/01/2024",
      updatedAt: "22/03/2025",
      version: "5.1",
      sla: "99,9% de disponibilidade",
      updateFrequency: "Diária (00h00)",
      dataSource: "Salesforce CRM / E-commerce",
    },
    tags: ["clientes", "crm", "dados-mestre"],
    createdAt: "20/01/2024",
    type: "tabela",
    database: "prod_dw",
    schema: "clientes",
    rowCount: "~2,1 mi",
    fields: [
      { name: "id_cliente", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do cliente (chave primária, gerado pelo sistema)." },
      { name: "cpf_hash", type: "VARCHAR(64)", nullable: true, description: "Hash SHA-256 do CPF do cliente para fins de identificação sem expor dados sensíveis." },
      { name: "nome_completo", type: "VARCHAR(200)", nullable: false, description: "Nome completo do cliente conforme cadastro." },
      { name: "email", type: "VARCHAR(150)", nullable: false, description: "E-mail principal do cliente. Único por cliente." },
      { name: "telefone", type: "VARCHAR(20)", nullable: true, description: "Telefone de contato principal com DDD." },
      { name: "dt_nascimento", type: "DATE", nullable: true, description: "Data de nascimento do cliente." },
      { name: "genero", type: "CHAR(1)", nullable: true, description: "Gênero declarado: M (masculino), F (feminino), O (outro), N (não informado)." },
      { name: "segmento", type: "VARCHAR(30)", nullable: true, description: "Segmento de valor do cliente: PLATINUM, GOLD, SILVER, BRONZE." },
      { name: "valor_vitalicio", type: "DECIMAL(15,2)", nullable: false, description: "Valor total gasto pelo cliente ao longo de toda a sua história." },
      { name: "dt_primeiro_pedido", type: "DATE", nullable: true, description: "Data do primeiro pedido realizado pelo cliente." },
      { name: "dt_ultimo_pedido", type: "DATE", nullable: true, description: "Data do pedido mais recente do cliente." },
      { name: "total_pedidos", type: "INT", nullable: false, description: "Quantidade total de pedidos realizados pelo cliente." },
      { name: "ativo", type: "BOOLEAN", nullable: false, description: "Indica se o cliente está ativo (true) ou foi removido/anonimizado (false)." },
      { name: "criado_em", type: "TIMESTAMP", nullable: false, description: "Data de criação do registro." },
    ],
  },
  {
    id: "3",
    tableName: "vw_vendas_por_cliente",
    description: "Visão agregada que une tb_pedidos_venda com tb_clientes para fornecer resumos de receita por segmento de cliente.",
    longDescription: "Visão analítica que consolida dados de vendas no nível de cliente, calculando métricas de receita, frequência e recência de compras por segmento. Otimizada para consultas dos painéis de CRM e análises de cohort. Materializada diariamente às 03h00 via pipeline Airflow.",
    owner: "analytics",
    ownerInfo: {
      name: "Thiago Ribeiro",
      email: "thiago.ribeiro@empresa.com.br",
      team: "Analytics",
      teamLead: "Juliana Costa",
      slack: "#analytics-bi",
      createdAt: "03/02/2024",
      updatedAt: "15/03/2025",
      version: "2.0",
      sla: "95% de disponibilidade",
      updateFrequency: "Diária (03h00)",
      dataSource: "tb_pedidos_venda + tb_clientes",
    },
    tags: ["vendas", "clientes", "join", "agregado"],
    createdAt: "03/02/2024",
    type: "visao",
    database: "prod_dw",
    schema: "analytics",
    rowCount: "~2,1 mi",
    fields: [
      { name: "id_cliente", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do cliente." },
      { name: "nome_completo", type: "VARCHAR(200)", nullable: false, description: "Nome completo do cliente." },
      { name: "segmento", type: "VARCHAR(30)", nullable: true, description: "Segmento de valor: PLATINUM, GOLD, SILVER, BRONZE." },
      { name: "total_pedidos", type: "INT", nullable: false, description: "Total de pedidos concluídos pelo cliente." },
      { name: "receita_total", type: "DECIMAL(15,2)", nullable: false, description: "Soma de todos os valores de pedidos do cliente." },
      { name: "ticket_medio", type: "DECIMAL(15,2)", nullable: false, description: "Valor médio por pedido (receita_total / total_pedidos)." },
      { name: "dt_ultimo_pedido", type: "DATE", nullable: true, description: "Data do pedido mais recente." },
      { name: "dias_desde_ultimo_pedido", type: "INT", nullable: true, description: "Recência em dias (diferença entre hoje e dt_ultimo_pedido)." },
      { name: "atualizado_em", type: "TIMESTAMP", nullable: false, description: "Timestamp da última atualização desta visão." },
    ],
  },
  {
    id: "4",
    tableName: "qry_receita_mensal",
    description: "Detalhamento de receita mensal por categoria de produto e região. Utilizado pelo painel financeiro.",
    longDescription: "Consulta parametrizada que agrega receita bruta, receita líquida, descontos e número de pedidos por categoria de produto e região geográfica, com granularidade mensal. Alimenta o dashboard financeiro e o relatório de fechamento mensal da diretoria.",
    owner: "bi-financeiro",
    ownerInfo: {
      name: "Mariana Santos",
      email: "mariana.santos@empresa.com.br",
      team: "BI Financeiro",
      teamLead: "Eduardo Fonseca",
      slack: "#bi-financeiro",
      createdAt: "14/02/2024",
      updatedAt: "28/02/2025",
      version: "1.3",
      sla: "99% disponibilidade em dias úteis",
      updateFrequency: "Mensal (1º dia útil)",
      dataSource: "tb_pedidos_venda + tb_produtos + tb_regioes",
    },
    tags: ["receita", "financeiro", "mensal"],
    createdAt: "14/02/2024",
    type: "consulta",
    database: "prod_dw",
    schema: "financeiro",
    rowCount: "Calculada dinamicamente",
    sqlQuery: `SELECT
    FORMAT(pv.dt_pedido, 'yyyy-MM')                               AS ano_mes,
    pr.categoria                                                   AS categoria_produto,
    r.regiao_macro                                                 AS regiao,
    COUNT(DISTINCT pv.id_pedido)                                   AS qtd_pedidos,
    SUM(pv.valor_total)                                            AS receita_bruta,
    SUM(pv.valor_desconto)                                         AS total_descontos,
    SUM(pv.valor_total) - SUM(pv.valor_desconto)                   AS receita_liquida,
    (SUM(pv.valor_total) - SUM(pv.valor_desconto))
        / NULLIF(COUNT(DISTINCT pv.id_pedido), 0)                  AS ticket_medio
FROM prod_dw.financeiro.tb_pedidos_venda   pv
JOIN prod_dw.produto.tb_produtos           pr  ON pr.id_produto = pv.id_produto
JOIN prod_dw.dominio.tb_regioes            r   ON r.id_regiao   = pv.id_regiao
WHERE
    pv.status = 'ENTREGUE'
GROUP BY
    FORMAT(pv.dt_pedido, 'yyyy-MM'),
    pr.categoria,
    r.regiao_macro
ORDER BY
    ano_mes         DESC,
    receita_liquida DESC;`,
    fields: [
      { name: "ano_mes", type: "CHAR(7)", nullable: false, description: "Período de referência no formato YYYY-MM (ex: 2024-03)." },
      { name: "categoria_produto", type: "VARCHAR(80)", nullable: false, description: "Categoria hierárquica do produto." },
      { name: "regiao", type: "VARCHAR(50)", nullable: false, description: "Região geográfica de entrega do pedido." },
      { name: "qtd_pedidos", type: "INT", nullable: false, description: "Quantidade total de pedidos no período." },
      { name: "receita_bruta", type: "DECIMAL(18,2)", nullable: false, description: "Soma dos valores totais de pedidos sem deduções." },
      { name: "total_descontos", type: "DECIMAL(18,2)", nullable: false, description: "Total de descontos concedidos no período." },
      { name: "receita_liquida", type: "DECIMAL(18,2)", nullable: false, description: "Receita bruta menos descontos." },
      { name: "ticket_medio", type: "DECIMAL(15,2)", nullable: false, description: "Receita líquida dividida pela quantidade de pedidos." },
    ],
  },
  {
    id: "5",
    tableName: "tb_produtos",
    description: "Catálogo de produtos com SKUs, categorias, faixas de preço e atributos de estoque.",
    longDescription: "Tabela mestre do catálogo de produtos, gerenciada pelo time de Produto e sincronizada com o sistema ERP. Contém hierarquia de categorias (departamento > categoria > subcategoria), atributos físicos, preços vigentes e informações de estoque mínimo. Referência para todas as análises que envolvem dimensão de produto.",
    owner: "engenharia-de-dados",
    ownerInfo: {
      name: "Lucas Ferreira",
      email: "lucas.ferreira@empresa.com.br",
      team: "Engenharia de Dados",
      teamLead: "Ana Paula Souza",
      slack: "#dados-engenharia",
      createdAt: "22/02/2024",
      updatedAt: "05/03/2025",
      version: "4.0",
      sla: "99,5% de disponibilidade",
      updateFrequency: "Diária (01h00)",
      dataSource: "ERP Oracle / Sistema de Produto",
    },
    tags: ["produtos", "estoque", "dados-mestre"],
    createdAt: "22/02/2024",
    type: "tabela",
    database: "prod_dw",
    schema: "produto",
    rowCount: "~340 mil",
    fields: [
      { name: "id_produto", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do produto (SKU interno)." },
      { name: "sku_externo", type: "VARCHAR(50)", nullable: true, description: "Código do produto no sistema de origem (ERP)." },
      { name: "nome_produto", type: "VARCHAR(300)", nullable: false, description: "Nome completo do produto conforme catálogo." },
      { name: "departamento", type: "VARCHAR(80)", nullable: false, description: "Nível mais alto da hierarquia de categorias." },
      { name: "categoria", type: "VARCHAR(80)", nullable: false, description: "Categoria do produto dentro do departamento." },
      { name: "subcategoria", type: "VARCHAR(80)", nullable: true, description: "Subcategoria específica do produto." },
      { name: "marca", type: "VARCHAR(100)", nullable: true, description: "Marca ou fabricante do produto." },
      { name: "preco_venda", type: "DECIMAL(12,2)", nullable: false, description: "Preço de venda vigente ao consumidor final." },
      { name: "preco_custo", type: "DECIMAL(12,2)", nullable: true, description: "Custo de aquisição do produto (sensível)." },
      { name: "estoque_disponivel", type: "INT", nullable: false, description: "Quantidade disponível em estoque." },
      { name: "estoque_minimo", type: "INT", nullable: false, description: "Nível mínimo de estoque antes de acionar reposição." },
      { name: "ativo", type: "BOOLEAN", nullable: false, description: "Indica se o produto está ativo no catálogo." },
    ],
  },
  {
    id: "6",
    tableName: "qry_top_clientes_join",
    description: "Consulta que une tb_pedidos_venda e tb_clientes para classificar os 100 principais clientes por valor vitalício nos últimos 12 meses.",
    longDescription: "Consulta analítica que realiza um JOIN entre pedidos e clientes para rankear os 100 maiores clientes por receita gerada nos últimos 12 meses. Usada pelo time comercial para ações de retenção e upsell, e como insumo para o modelo de propensão de churn.",
    owner: "analytics",
    ownerInfo: {
      name: "Thiago Ribeiro",
      email: "thiago.ribeiro@empresa.com.br",
      team: "Analytics",
      teamLead: "Juliana Costa",
      slack: "#analytics-bi",
      createdAt: "01/03/2024",
      updatedAt: "20/03/2025",
      version: "1.5",
      sla: "Melhor esforço",
      updateFrequency: "Semanal (segunda-feira)",
      dataSource: "tb_pedidos_venda + tb_clientes",
    },
    tags: ["vendas", "clientes", "join", "ranking"],
    createdAt: "01/03/2024",
    type: "consulta",
    database: "prod_dw",
    schema: "analytics",
    rowCount: "100 registros fixos",
    sqlQuery: `WITH pedidos_12m AS (
    SELECT
        pv.id_cliente,
        COUNT(pv.id_pedido)                               AS total_pedidos_12m,
        SUM(pv.valor_total)                               AS receita_12m,
        SUM(pv.valor_total) / NULLIF(COUNT(pv.id_pedido), 0) AS ticket_medio_12m
    FROM prod_dw.vendas.tb_pedidos_venda pv
    WHERE pv.status    = 'ENTREGUE'
      AND pv.dt_pedido >= DATEADD(month, -12, GETDATE())
    GROUP BY pv.id_cliente
)
SELECT
    ROW_NUMBER() OVER (ORDER BY p.receita_12m DESC)       AS ranking,
    c.id_cliente,
    c.nome_completo,
    c.email,
    c.segmento,
    p.receita_12m,
    p.total_pedidos_12m,
    p.ticket_medio_12m
FROM pedidos_12m                       p
JOIN prod_dw.clientes.tb_clientes      c  ON c.id_cliente = p.id_cliente
WHERE c.ativo = TRUE
ORDER BY p.receita_12m DESC
LIMIT 100;`,
    fields: [
      { name: "ranking", type: "INT", nullable: false, description: "Posição do cliente no ranking (1 = maior receita)." },
      { name: "id_cliente", type: "BIGINT", nullable: false, isForeignKey: true, foreignRef: "tb_clientes.id_cliente", description: "Identificador do cliente." },
      { name: "nome_completo", type: "VARCHAR(200)", nullable: false, description: "Nome do cliente." },
      { name: "email", type: "VARCHAR(150)", nullable: false, description: "E-mail do cliente." },
      { name: "segmento", type: "VARCHAR(30)", nullable: true, description: "Segmento de valor do cliente." },
      { name: "receita_12m", type: "DECIMAL(15,2)", nullable: false, description: "Receita total gerada nos últimos 12 meses." },
      { name: "total_pedidos_12m", type: "INT", nullable: false, description: "Quantidade de pedidos nos últimos 12 meses." },
      { name: "ticket_medio_12m", type: "DECIMAL(15,2)", nullable: false, description: "Ticket médio no período." },
    ],
  },
  {
    id: "7",
    tableName: "tb_campanhas_marketing",
    description: "Todas as definições de campanhas de marketing, canais, orçamentos e públicos-alvo.",
    longDescription: "Tabela de definição e controle de campanhas de marketing. Armazena metadados de cada campanha ativa ou encerrada, incluindo canais utilizados (e-mail, mídia paga, push, SMS), orçamento aprovado, audiência-alvo e período de vigência. Integrada com ferramentas de automação de marketing (Braze, Google Ads).",
    owner: "ops-marketing",
    ownerInfo: {
      name: "Camila Nunes",
      email: "camila.nunes@empresa.com.br",
      team: "Marketing Operations",
      teamLead: "Diego Carvalho",
      slack: "#mktops-dados",
      createdAt: "10/03/2024",
      updatedAt: "12/03/2025",
      version: "2.1",
      sla: "99% em dias úteis",
      updateFrequency: "Sob demanda",
      dataSource: "Braze / Google Ads / Manual",
    },
    tags: ["marketing", "campanhas"],
    createdAt: "10/03/2024",
    type: "tabela",
    database: "marketing_db",
    schema: "campanhas",
    rowCount: "~1.200",
    fields: [
      { name: "id_campanha", type: "INT", nullable: false, isPrimaryKey: true, description: "Identificador único da campanha." },
      { name: "nome_campanha", type: "VARCHAR(200)", nullable: false, description: "Nome descritivo da campanha." },
      { name: "tipo_campanha", type: "VARCHAR(50)", nullable: false, description: "Tipo: AQUISICAO, RETENCAO, REATIVACAO, UPSELL." },
      { name: "canais", type: "VARCHAR(200)", nullable: true, description: "Canais utilizados separados por vírgula (EMAIL, PUSH, SMS, MIDIA_PAGA)." },
      { name: "dt_inicio", type: "DATE", nullable: false, description: "Data de início da campanha." },
      { name: "dt_fim", type: "DATE", nullable: true, description: "Data de encerramento. Nulo se campanha sempre ativa." },
      { name: "orcamento_aprovado", type: "DECIMAL(15,2)", nullable: true, description: "Orçamento total aprovado para a campanha." },
      { name: "publico_alvo", type: "TEXT", nullable: true, description: "Descrição textual do público-alvo e critérios de segmentação." },
      { name: "status", type: "VARCHAR(20)", nullable: false, description: "Status: RASCUNHO, ATIVA, PAUSADA, ENCERRADA." },
      { name: "criado_por", type: "VARCHAR(100)", nullable: false, description: "Login do usuário que criou a campanha." },
    ],
  },
  {
    id: "8",
    tableName: "vw_funil_conversao",
    description: "Visão do funil de marketing desde a aquisição de leads até o fechamento, unindo dados de CRM e vendas.",
    longDescription: "Visão que consolida o funil de conversão de marketing end-to-end, desde a entrada do lead (via campanha ou orgânico) até a efetivação da primeira compra. Combina dados de campanhas, leads do CRM e pedidos de venda para calcular taxas de conversão por etapa, canal e segmento de produto.",
    owner: "ops-marketing",
    ownerInfo: {
      name: "Camila Nunes",
      email: "camila.nunes@empresa.com.br",
      team: "Marketing Operations",
      teamLead: "Diego Carvalho",
      slack: "#mktops-dados",
      createdAt: "18/03/2024",
      updatedAt: "18/03/2025",
      version: "1.2",
      sla: "95% de disponibilidade",
      updateFrequency: "Diária (04h00)",
      dataSource: "tb_campanhas_marketing + Salesforce CRM + tb_pedidos_venda",
    },
    tags: ["funil", "conversao", "join", "marketing"],
    createdAt: "18/03/2024",
    type: "visao",
    database: "marketing_db",
    schema: "analytics",
    rowCount: "~85 mil por ciclo",
    fields: [
      { name: "id_lead", type: "VARCHAR(40)", nullable: false, description: "Identificador do lead no sistema de CRM." },
      { name: "id_campanha", type: "INT", nullable: true, isForeignKey: true, foreignRef: "tb_campanhas_marketing.id_campanha", description: "Campanha de origem do lead. Nulo se orgânico." },
      { name: "canal_aquisicao", type: "VARCHAR(50)", nullable: false, description: "Canal pelo qual o lead entrou: EMAIL, ORGANICO, PAGO, REFERRAL." },
      { name: "dt_entrada_funil", type: "TIMESTAMP", nullable: false, description: "Data/hora de entrada no funil." },
      { name: "etapa_atual", type: "VARCHAR(30)", nullable: false, description: "Etapa atual: LEAD, MQL, SQL, OPORTUNIDADE, CLIENTE." },
      { name: "dt_conversao", type: "DATE", nullable: true, description: "Data em que se tornou cliente. Nulo se ainda não converteu." },
      { name: "id_primeiro_pedido", type: "BIGINT", nullable: true, isForeignKey: true, foreignRef: "tb_pedidos_venda.id_pedido", description: "Referência ao primeiro pedido após conversão." },
      { name: "taxa_conversao_etapa", type: "DECIMAL(5,2)", nullable: false, description: "Taxa de passagem para a próxima etapa (%)." },
    ],
  },
  {
    id: "9",
    tableName: "tb_chamados_suporte",
    description: "Histórico de chamados de suporte ao cliente com tempos de resolução, categorias e pontuações CSAT.",
    longDescription: "Tabela transacional de chamados abertos no sistema de suporte ao cliente (Zendesk). Captura toda a jornada do chamado desde a abertura até o fechamento, incluindo categoria do problema, agente responsável, SLA de atendimento e pontuação de satisfação (CSAT) coletada pós-fechamento.",
    owner: "time-cx",
    ownerInfo: {
      name: "Beatriz Oliveira",
      email: "beatriz.oliveira@empresa.com.br",
      team: "Customer Experience",
      teamLead: "Gabriel Teixeira",
      slack: "#cx-dados",
      createdAt: "02/04/2024",
      updatedAt: "21/03/2025",
      version: "1.8",
      sla: "99% de disponibilidade",
      updateFrequency: "A cada 30 minutos",
      dataSource: "Zendesk API",
    },
    tags: ["suporte", "clientes", "csat"],
    createdAt: "02/04/2024",
    type: "tabela",
    database: "cx_db",
    schema: "suporte",
    rowCount: "~620 mil",
    fields: [
      { name: "id_chamado", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do chamado de suporte." },
      { name: "id_cliente", type: "BIGINT", nullable: false, isForeignKey: true, foreignRef: "tb_clientes.id_cliente", description: "Cliente que abriu o chamado." },
      { name: "categoria", type: "VARCHAR(80)", nullable: false, description: "Categoria do problema: ENTREGA, PRODUTO_DEFEITUOSO, COBRANCA, CANCELAMENTO, OUTROS." },
      { name: "subcategoria", type: "VARCHAR(100)", nullable: true, description: "Subcategoria específica do problema." },
      { name: "canal_abertura", type: "VARCHAR(30)", nullable: false, description: "Canal pelo qual o chamado foi aberto: CHAT, EMAIL, TELEFONE, APP." },
      { name: "prioridade", type: "VARCHAR(10)", nullable: false, description: "Prioridade: BAIXA, MEDIA, ALTA, CRITICA." },
      { name: "agente_responsavel", type: "VARCHAR(100)", nullable: true, description: "Login do agente de suporte responsável." },
      { name: "dt_abertura", type: "TIMESTAMP", nullable: false, description: "Data e hora de abertura do chamado." },
      { name: "dt_fechamento", type: "TIMESTAMP", nullable: true, description: "Data e hora de fechamento. Nulo se ainda aberto." },
      { name: "tempo_resolucao_min", type: "INT", nullable: true, description: "Tempo total de resolução em minutos." },
      { name: "csat_score", type: "DECIMAL(3,1)", nullable: true, description: "Nota CSAT de 1,0 a 5,0 fornecida pelo cliente após fechamento." },
      { name: "dentro_sla", type: "BOOLEAN", nullable: true, description: "Indica se o chamado foi resolvido dentro do SLA acordado." },
    ],
  },
  {
    id: "10",
    tableName: "qry_features_churn",
    description: "Conjunto de features para modelo de ML de churn, combinando recência, frequência de compras e sinais de suporte.",
    longDescription: "Consulta de engenharia de features para o modelo de predição de churn de clientes. Combina sinais de comportamento de compra (RFM — recência, frequência e valor monetário), histórico de suporte e engajamento com campanhas para gerar um vetor de features por cliente, atualizado semanalmente para retreino e inferência do modelo.",
    owner: "ciencia-de-dados",
    ownerInfo: {
      name: "Rafael Gomes",
      email: "rafael.gomes@empresa.com.br",
      team: "Ciência de Dados",
      teamLead: "Isabela Rocha",
      slack: "#data-science",
      createdAt: "15/04/2024",
      updatedAt: "24/03/2025",
      version: "2.3",
      sla: "Melhor esforço",
      updateFrequency: "Semanal (domingo)",
      dataSource: "vw_vendas_por_cliente + tb_chamados_suporte + tb_campanhas_marketing",
    },
    tags: ["churn", "ml", "clientes", "join"],
    createdAt: "15/04/2024",
    type: "consulta",
    database: "prod_dw",
    schema: "ml",
    rowCount: "~2,1 mi (1 por cliente)",
    sqlQuery: `WITH rfm AS (
    -- Recência, Frequência e Valor Monetário (últimos 12 meses)
    SELECT
        id_cliente,
        DATEDIFF(day, MAX(dt_pedido), GETDATE())            AS recencia_dias,
        COUNT(id_pedido)                                     AS frequencia_12m,
        SUM(valor_total)                                     AS valor_monetario_12m,
        SUM(valor_total) / NULLIF(COUNT(id_pedido), 0)       AS ticket_medio
    FROM prod_dw.vendas.tb_pedidos_venda
    WHERE dt_pedido >= DATEADD(month, -12, GETDATE())
      AND status     = 'ENTREGUE'
    GROUP BY id_cliente
),
suporte AS (
    -- Histórico de chamados de suporte (últimos 6 meses)
    SELECT
        id_cliente,
        COUNT(id_chamado)    AS qtd_chamados_6m,
        AVG(csat_score)      AS csat_medio
    FROM cx_db.suporte.tb_chamados_suporte
    WHERE dt_abertura >= DATEADD(month, -6, GETDATE())
    GROUP BY id_cliente
),
mkt AS (
    -- Engajamento com campanhas de marketing (últimos 3 meses)
    SELECT
        id_cliente,
        COUNT(id_envio)                                              AS campanhas_recebidas_3m,
        AVG(CASE WHEN fl_aberto = 1 THEN 1.0 ELSE 0.0 END) * 100   AS taxa_abertura_email
    FROM marketing_db.campanhas.tb_envios_campanha
    WHERE dt_envio >= DATEADD(month, -3, GETDATE())
    GROUP BY id_cliente
)
SELECT
    c.id_cliente,
    COALESCE(r.recencia_dias,          999)  AS recencia_dias,
    COALESCE(r.frequencia_12m,           0)  AS frequencia_12m,
    COALESCE(r.valor_monetario_12m,    0.0)  AS valor_monetario_12m,
    COALESCE(r.ticket_medio,           0.0)  AS ticket_medio,
    COALESCE(s.qtd_chamados_6m,          0)  AS qtd_chamados_6m,
    s.csat_medio                             AS csat_medio,
    COALESCE(m.campanhas_recebidas_3m,   0)  AS campanhas_recebidas_3m,
    m.taxa_abertura_email                    AS taxa_abertura_email,
    c.segmento,
    NULL                                     AS label_churn,  -- definido em pós-processo
    CAST(GETDATE() AS DATE)                  AS dt_referencia
FROM prod_dw.clientes.tb_clientes            c
LEFT JOIN rfm     r  ON r.id_cliente = c.id_cliente
LEFT JOIN suporte s  ON s.id_cliente = c.id_cliente
LEFT JOIN mkt     m  ON m.id_cliente = c.id_cliente
WHERE c.ativo = TRUE
ORDER BY c.id_cliente;`,
    fields: [
      { name: "id_cliente", type: "BIGINT", nullable: false, isPrimaryKey: true, description: "Identificador único do cliente." },
      { name: "recencia_dias", type: "INT", nullable: false, description: "Dias desde o último pedido (feature de recência)." },
      { name: "frequencia_12m", type: "INT", nullable: false, description: "Número de pedidos nos últimos 12 meses." },
      { name: "valor_monetario_12m", type: "DECIMAL(15,2)", nullable: false, description: "Receita gerada nos últimos 12 meses." },
      { name: "ticket_medio", type: "DECIMAL(15,2)", nullable: false, description: "Ticket médio histórico do cliente." },
      { name: "qtd_chamados_6m", type: "INT", nullable: false, description: "Chamados de suporte abertos nos últimos 6 meses." },
      { name: "csat_medio", type: "DECIMAL(3,1)", nullable: true, description: "Média das notas CSAT do cliente." },
      { name: "campanhas_recebidas_3m", type: "INT", nullable: false, description: "Campanhas de marketing recebidas nos últimos 3 meses." },
      { name: "taxa_abertura_email", type: "DECIMAL(5,2)", nullable: true, description: "Taxa de abertura de e-mails de marketing (%)." },
      { name: "segmento", type: "VARCHAR(30)", nullable: true, description: "Segmento de valor atual do cliente." },
      { name: "label_churn", type: "BOOLEAN", nullable: true, description: "Label de treino: true = cliente churnou no período seguinte." },
      { name: "dt_referencia", type: "DATE", nullable: false, description: "Data de referência para cálculo das features." },
    ],
  },
  {
    id: "11",
    tableName: "tb_regioes",
    description: "Tabela de domínio para regiões geográficas, países e atribuições de território.",
    longDescription: "Tabela de domínio (lookup) com a hierarquia geográfica completa utilizada em todo o ecossistema de dados: país, região, estado, cidade e CEP de faixa. Define também os territórios comerciais e responsáveis regionais de vendas. Raramente alterada; alterações passam por processo de aprovação do time de Engenharia.",
    owner: "engenharia-de-dados",
    ownerInfo: {
      name: "Carlos Mendes",
      email: "carlos.mendes@empresa.com.br",
      team: "Engenharia de Dados",
      teamLead: "Ana Paula Souza",
      slack: "#dados-engenharia",
      createdAt: "20/04/2024",
      updatedAt: "10/01/2025",
      version: "1.0",
      sla: "99,9% de disponibilidade",
      updateFrequency: "Sob demanda (raro)",
      dataSource: "Cadastro manual aprovado",
    },
    tags: ["geografia", "dominio", "dados-mestre"],
    createdAt: "20/04/2024",
    type: "tabela",
    database: "prod_dw",
    schema: "dominio",
    rowCount: "~5.500",
    fields: [
      { name: "id_regiao", type: "INT", nullable: false, isPrimaryKey: true, description: "Identificador único da região." },
      { name: "pais", type: "CHAR(2)", nullable: false, description: "Código ISO do país (ex: BR, AR, US)." },
      { name: "regiao_macro", type: "VARCHAR(30)", nullable: false, description: "Macrorregião geográfica (ex: Sudeste, Norte, Nordeste)." },
      { name: "estado_uf", type: "CHAR(2)", nullable: true, description: "Sigla da UF para registros brasileiros." },
      { name: "cidade", type: "VARCHAR(100)", nullable: true, description: "Nome do município." },
      { name: "cep_faixa_inicio", type: "CHAR(8)", nullable: true, description: "Início da faixa de CEP da região." },
      { name: "cep_faixa_fim", type: "CHAR(8)", nullable: true, description: "Fim da faixa de CEP da região." },
      { name: "territorio_comercial", type: "VARCHAR(80)", nullable: true, description: "Nome do território comercial ao qual a região pertence." },
      { name: "gerente_regional", type: "VARCHAR(100)", nullable: true, description: "Nome do gerente regional responsável." },
    ],
  },
  {
    id: "12",
    tableName: "vw_desempenho_produto",
    description: "Visão mensal de desempenho de produtos unindo tb_produtos, tb_pedidos_venda e tb_regioes.",
    longDescription: "Visão analítica de desempenho de produtos com granularidade mensal e regional, consolidando vendas, receita, margem estimada e variação percentual em relação ao período anterior. Usada pelo time de Produto e pela diretoria comercial para análise de portfólio e tomada de decisão sobre sortimento.",
    owner: "analytics",
    ownerInfo: {
      name: "Thiago Ribeiro",
      email: "thiago.ribeiro@empresa.com.br",
      team: "Analytics",
      teamLead: "Juliana Costa",
      slack: "#analytics-bi",
      createdAt: "05/05/2024",
      updatedAt: "03/03/2025",
      version: "1.1",
      sla: "95% de disponibilidade",
      updateFrequency: "Mensal (2º dia útil)",
      dataSource: "tb_produtos + tb_pedidos_venda + tb_regioes",
    },
    tags: ["produtos", "vendas", "join", "mensal"],
    createdAt: "05/05/2024",
    type: "visao",
    database: "prod_dw",
    schema: "analytics",
    rowCount: "~680 mil por mês",
    fields: [
      { name: "ano_mes", type: "CHAR(7)", nullable: false, description: "Período de referência no formato YYYY-MM." },
      { name: "id_produto", type: "BIGINT", nullable: false, isForeignKey: true, foreignRef: "tb_produtos.id_produto", description: "Identificador do produto." },
      { name: "nome_produto", type: "VARCHAR(300)", nullable: false, description: "Nome do produto." },
      { name: "categoria", type: "VARCHAR(80)", nullable: false, description: "Categoria do produto." },
      { name: "id_regiao", type: "INT", nullable: false, isForeignKey: true, foreignRef: "tb_regioes.id_regiao", description: "Região de venda." },
      { name: "regiao_macro", type: "VARCHAR(30)", nullable: false, description: "Macrorregião." },
      { name: "qtd_vendida", type: "INT", nullable: false, description: "Quantidade de unidades vendidas no período." },
      { name: "receita_bruta", type: "DECIMAL(15,2)", nullable: false, description: "Receita bruta total do produto na região." },
      { name: "margem_estimada", type: "DECIMAL(15,2)", nullable: true, description: "Margem de contribuição estimada." },
      { name: "variacao_receita_pct", type: "DECIMAL(6,2)", nullable: true, description: "Variação percentual da receita vs período anterior." },
    ],
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Quais consultas devo usar para cruzar dados de vendas com clientes?",
    timestamp: "10:24",
  },
  {
    id: "2",
    role: "assistant",
    content: `Encontrei **3 consultas** no catálogo que fazem JOIN entre as tabelas \`tb_pedidos_venda\` e \`tb_clientes\`. Veja:

**1. vw_vendas_por_cliente**
> Visão agregada unindo pedidos de venda com clientes para resumos de receita por segmento.
> Dono: analytics · Tags: vendas, clientes, join

**2. qry_top_clientes_join**
> Classifica os 100 melhores clientes por valor vitalício nos últimos 12 meses.
> Dono: analytics · Tags: vendas, clientes, join, ranking

**3. qry_features_churn**
> Conjunto de features combinando recência, frequência e sinais de suporte — inclui join com clientes.
> Dono: ciencia-de-dados · Tags: churn, ml, clientes, join

Quer que eu mostre o SQL de alguma dessas consultas?`,
    timestamp: "10:24",
  },
  {
    id: "3",
    role: "user",
    content: "Mostre todas as tabelas que pertencem ao time de analytics.",
    timestamp: "10:26",
  },
  {
    id: "4",
    role: "assistant",
    content: `O time de **analytics** possui **3 entradas** no catálogo:

| Nome | Tipo | Descrição |
|------|------|-----------|
| vw_vendas_por_cliente | Visão | Resumos de receita por segmento de cliente |
| qry_top_clientes_join | Consulta | Top 100 clientes por valor vitalício |
| vw_desempenho_produto | Visão | Desempenho mensal de produtos por região |

Todas as entradas estão no banco \`prod_dw\`. Você pode ver os detalhes completos na aba Catálogo. Quer que eu busque tabelas relacionadas que o time de analytics costuma usar em joins?`,
    timestamp: "10:26",
  },
  {
    id: "5",
    role: "user",
    content: "Quais tags são mais usadas no catálogo?",
    timestamp: "10:28",
  },
  {
    id: "6",
    role: "assistant",
    content: `Com base no catálogo atual, aqui estão as **tags mais utilizadas**:

| Tag | Ocorrências |
|-----|-------------|
| join | 5 entradas |
| clientes | 5 entradas |
| vendas | 4 entradas |
| dados-mestre | 3 entradas |
| mensal | 2 entradas |
| marketing | 2 entradas |

As tags **join** e **clientes** são as mais frequentes, o que indica que o time frequentemente constrói consultas entre domínios, ligando dados transacionais e de CRM. Quer que eu encontre todas as entradas com uma tag específica?`,
    timestamp: "10:28",
  },
];

export const ALL_TAGS = [
  "vendas", "pedidos", "clientes", "crm", "join", "agregado", "receita",
  "financeiro", "mensal", "produtos", "estoque", "dados-mestre", "ranking",
  "marketing", "campanhas", "funil", "conversao", "suporte", "csat",
  "churn", "ml", "geografia", "dominio", "transacional",
];
