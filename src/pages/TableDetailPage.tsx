import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  Key,
  Link2,
  Minus,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Users,
  Crown,
  MessageSquare,
  Calendar,
  RefreshCw,
  Database,
  Shield,
  Clock,
  Server,
  Tag,
  Table,
  Eye,
  Code2,
  Layers,
  Hash,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { MOCK_CATALOG } from "@/lib/mockData";
import { useRole } from "@/lib/roleContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

/* ─── SQL Syntax Highlighter ───────────────────────────────────────── */

const SQL_KEYWORDS = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|AS|DISTINCT|GROUP\s+BY|ORDER\s+BY|HAVING|WITH|UNION|INTERSECT|EXCEPT|LIMIT|OFFSET|BY|DESC|ASC|INTO|INSERT|UPDATE|DELETE|SET|VALUES|CREATE|TABLE|VIEW|INDEX|DROP|ALTER|ADD|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|CHECK|CONSTRAINT|ALL|ANY|SOME|OVER|PARTITION|ROWS|RANGE|UNBOUNDED|PRECEDING|FOLLOWING|CURRENT\s+ROW|TRUE|FALSE|CAST|CONVERT|TRIM|LEFT|RIGHT)\b/gi;

const SQL_FUNCTIONS = /\b(COUNT|SUM|AVG|MAX|MIN|ROUND|FLOOR|CEIL|ABS|COALESCE|NULLIF|ISNULL|NVL|FORMAT|TO_DATE|TO_CHAR|TO_NUMBER|DATEADD|DATEDIFF|DATEPART|DATENAME|GETDATE|NOW|CURRENT_DATE|CURRENT_TIMESTAMP|ROW_NUMBER|RANK|DENSE_RANK|NTILE|LAG|LEAD|FIRST_VALUE|LAST_VALUE|SUBSTR|SUBSTRING|LENGTH|UPPER|LOWER|REPLACE|CONCAT|TRIM|LTRIM|RTRIM|SPLIT_PART|STRPOS|CHARINDEX|PATINDEX|CAST|CONVERT|DECODE|SIGN|POWER|SQRT|MOD|TRUNC|EXTRACT|DATE_TRUNC|DATE_PART|YEAR|MONTH|DAY|HOUR|MINUTE|SECOND|IIF|CHOOSE|STUFF|STUFF|STRING_AGG|LISTAGG|GROUP_CONCAT|ARRAY_AGG|JSON_AGG|UNNEST|GENERATE_SERIES|REGEXP_REPLACE|REGEXP_MATCH|LIKE)\s*(?=\()/gi;

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightLine(raw: string): string {
  // 1. Check for pure comment line first
  const commentMatch = raw.match(/^(\s*)(--.*)/);
  if (commentMatch) {
    const indent = escapeHtml(commentMatch[1]);
    const comment = escapeHtml(commentMatch[2]);
    return `${indent}<span style="color:#6a9955;font-style:italic">${comment}</span>`;
  }

  // 2. Split on inline comments (-- ...) to protect them
  const commentIdx = raw.indexOf("--");
  let code = commentIdx !== -1 ? raw.slice(0, commentIdx) : raw;
  const trailingComment = commentIdx !== -1 ? raw.slice(commentIdx) : "";

  // 3. Tokenize: protect string literals first
  const parts: { text: string; type: "string" | "code" }[] = [];
  let remaining = code;
  const strRegex = /'[^']*'/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  strRegex.lastIndex = 0;
  while ((m = strRegex.exec(code)) !== null) {
    if (m.index > lastIndex) parts.push({ text: code.slice(lastIndex, m.index), type: "code" });
    parts.push({ text: m[0], type: "string" });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < code.length) parts.push({ text: code.slice(lastIndex), type: "code" });

  // 4. Highlight code segments
  let html = parts.map(({ text, type }) => {
    if (type === "string") {
      return `<span style='color:#ce9178'>${escapeHtml(text)}</span>`;
    }
    let t = escapeHtml(text);
    // Functions (before keywords so CAST etc. get function color when followed by paren)
    t = t.replace(SQL_FUNCTIONS, (fn) => `<span style='color:#dcdcaa'>${fn}</span>`);
    SQL_FUNCTIONS.lastIndex = 0;
    t = t.replace(SQL_KEYWORDS, (kw) => `<span style='color:#569cd6; font-weight:bold'>${kw}</span>`);
    SQL_KEYWORDS.lastIndex = 0;
    // Numbers
    t = t.replace(/\b(\d+\.?\d*)\b/g, `<span style='color:#b5cea8'>$1</span>`);
    return t;
  }).join("");

  // 5. Append inline comment
  if (trailingComment) {
    html += `<span style="color:#6a9955;font-style:italic">${escapeHtml(trailingComment)}</span>`;
  }

  return html;
}

function SqlViewer({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(sql).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = sql.split("\n");

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Consulta SQL</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {lines.length} linhas
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied
            ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado!</>
            : <><Copy className="w-3.5 h-3.5" /> Copiar SQL</>
          }
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto" style={{ background: "#1e1e2e" }}>
        {/* Dot row decoration */}
        <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>SQL Query</span>
        </div>
        <table className="w-full font-mono text-[13px] leading-6">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group" style={{ transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.035)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td
                  className="text-right select-none pl-4 pr-4 w-10"
                  style={{ color: "rgba(255,255,255,0.22)", fontSize: "12px", verticalAlign: "top", paddingTop: "0px", userSelect: "none" }}
                >
                  {i + 1}
                </td>
                <td
                  className="pr-8 whitespace-pre"
                  style={{ color: "#d4d4d4", verticalAlign: "top" }}
                  dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
                />
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
    </div>
  );
}

const TYPE_ICONS = { tabela: Table, visao: Eye, consulta: Code2 };
const TYPE_COLORS: Record<string, string> = {
  tabela: "bg-blue-50 text-blue-700 border-blue-100",
  visao: "bg-purple-50 text-purple-700 border-purple-100",
  consulta: "bg-emerald-50 text-emerald-700 border-emerald-100",
};
const TYPE_LABELS: Record<string, string> = {
  tabela: "Tabela", visao: "Visão", consulta: "Consulta",
};

const TAG_COLORS = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-sky-50 text-sky-700",
  "bg-teal-50 text-teal-700",
  "bg-slate-100 text-slate-600",
];
function tagColor(tag: string) {
  return TAG_COLORS[tag.charCodeAt(0) % TAG_COLORS.length];
}

const DATA_TYPE_COLORS: Record<string, string> = {
  BIGINT: "text-violet-600 bg-violet-50",
  INT: "text-violet-600 bg-violet-50",
  VARCHAR: "text-amber-600 bg-amber-50",
  CHAR: "text-amber-600 bg-amber-50",
  TEXT: "text-amber-600 bg-amber-50",
  DECIMAL: "text-emerald-600 bg-emerald-50",
  BOOLEAN: "text-sky-600 bg-sky-50",
  DATE: "text-rose-600 bg-rose-50",
  TIMESTAMP: "text-rose-600 bg-rose-50",
};
function typeColor(type: string) {
  const base = type.split("(")[0].toUpperCase();
  return DATA_TYPE_COLORS[base] ?? "text-slate-600 bg-slate-100";
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm text-foreground mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function TableDetailPage() {
  const params = useParams<{ id: string }>();
  const { isManager } = useRole();
  const [deleteModal, setDeleteModal] = useState(false);

  const entry = MOCK_CATALOG.find((e) => e.id === params.id);

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Database className="w-10 h-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Entrada não encontrada no catálogo.</p>
        <Link href="/">
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao catálogo
          </button>
        </Link>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[entry.type];

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Breadcrumb + ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <button className="hover:text-foreground transition-colors">Catálogo</button>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{entry.tableName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg border border-border transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar
            </button>
          </Link>
          {isManager && (
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg border border-destructive/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          )}
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                TYPE_COLORS[entry.type]
              )}>
                <TypeIcon className="w-3.5 h-3.5" />
                {TYPE_LABELS[entry.type]}
              </span>
              <h1 className="text-xl font-bold text-foreground font-mono">{entry.tableName}</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{entry.longDescription}</p>
          </div>
        </div>

        {/* Meta rápida */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono">{entry.database}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Schema: <span className="font-mono">{entry.schema}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <span>{entry.rowCount} registros</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Criado em {entry.createdAt}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                tagColor(tag)
              )}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Duas colunas: Campos + Owner */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">

        {/* COLUNA ESQUERDA — Campos ou SQL */}
        {entry.type === "consulta" && entry.sqlQuery ? (
          <SqlViewer sql={entry.sqlQuery} />
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Campos / Colunas
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {entry.fields.length} campos
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-500" /> PK
                </span>
                <span className="flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-blue-500" /> FK
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Obrigatório
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-muted-foreground/50" /> Opcional
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-8"></th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nulo</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entry.fields.map((field, idx) => (
                    <tr
                      key={field.name}
                      className={cn(
                        "hover:bg-muted/20 transition-colors",
                        field.isPrimaryKey && "bg-amber-50/50 hover:bg-amber-50"
                      )}
                    >
                      {/* Ícones PK/FK */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          {field.isPrimaryKey && (
                            <Key className="w-3.5 h-3.5 text-amber-500" title="Chave Primária" />
                          )}
                          {field.isForeignKey && (
                            <Link2 className="w-3.5 h-3.5 text-blue-500" title={`FK → ${field.foreignRef}`} />
                          )}
                          {!field.isPrimaryKey && !field.isForeignKey && (
                            <Minus className="w-3 h-3 text-muted-foreground/30" />
                          )}
                        </div>
                      </td>

                      {/* Nome */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-mono text-sm font-semibold",
                            field.isPrimaryKey ? "text-amber-700" : "text-foreground"
                          )}>
                            {field.name}
                          </span>
                        </div>
                        {field.isForeignKey && field.foreignRef && (
                          <p className="text-xs text-blue-600 font-mono mt-0.5 opacity-70">
                            → {field.foreignRef}
                          </p>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3">
                        <span className={cn(
                          "font-mono text-xs px-2 py-0.5 rounded font-medium",
                          typeColor(field.type)
                        )}>
                          {field.type}
                        </span>
                      </td>

                      {/* Nullable */}
                      <td className="px-4 py-3 text-center">
                        {field.nullable ? (
                          <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" title="Opcional (NULL)" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" title="Obrigatório (NOT NULL)" />
                        )}
                      </td>

                      {/* Descrição */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground leading-snug">{field.description}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COLUNA DIREITA — Owner Info */}
        <div className="space-y-4">
          {/* Card do Responsável */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Responsável</h2>
            </div>

            <div className="p-5">
              {/* Avatar + nome */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  {entry.ownerInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{entry.ownerInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.ownerInfo.team}</p>
                </div>
              </div>

              <div className="space-y-0 divide-y divide-border">
                <InfoCard icon={Mail} label="E-mail" value={entry.ownerInfo.email} />
                <InfoCard icon={Users} label="Time" value={entry.ownerInfo.team} />
                <InfoCard icon={Crown} label="Líder do Time" value={entry.ownerInfo.teamLead} />
                <InfoCard icon={MessageSquare} label="Canal Slack" value={entry.ownerInfo.slack} />
              </div>
            </div>
          </div>

          {/* Card de Metadados Técnicos */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Metadados Técnicos</h2>
            </div>
            <div className="p-5 space-y-0 divide-y divide-border">
              <InfoCard icon={Calendar} label="Criado em" value={entry.ownerInfo.createdAt} />
              <InfoCard icon={RefreshCw} label="Última Atualização" value={entry.ownerInfo.updatedAt} />
              <InfoCard icon={Clock} label="Frequência de Atualização" value={entry.ownerInfo.updateFrequency} />
              <InfoCard icon={Shield} label="SLA" value={entry.ownerInfo.sla} />
              <InfoCard icon={Database} label="Fonte de Dados" value={entry.ownerInfo.dataSource} />
              <InfoCard icon={Hash} label="Versão do Schema" value={`v${entry.ownerInfo.version}`} />
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        open={deleteModal}
        itemName={entry.tableName}
        itemType={TYPE_LABELS[entry.type]}
        onConfirm={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}
