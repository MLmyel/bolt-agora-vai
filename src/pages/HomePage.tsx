import { Link } from "wouter";
import { Search, FilePlus, LayoutDashboard, MessageSquare } from "lucide-react";

const TAG_COLORS = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-sky-50 text-sky-700",
  "bg-teal-50 text-teal-700",
  "bg-slate-100 text-slate-600",
];

function tagColor(tag: string) {
  const idx = tag.charCodeAt(0) % TAG_COLORS.length;
  return TAG_COLORS[idx];
}

const ROW1_TAGS = ["vendas", "pedidos", "clientes", "crm", "join", "agregado", "receita"];
const ROW2_TAGS = ["financeiro", "mensal", "produtos", "estoque", "dados-mestre", "ranking"];

const CARDS = [
  {
    href: "/nova-consulta",
    icon: FilePlus,
    title: "Nova Consulta",
    description: "Cadastre uma nova consulta SQL ou definição de tabela no catálogo.",
  },
  {
    href: "/catalogo",
    icon: LayoutDashboard,
    title: "Catálogo de Dados",
    description: "Explore, pesquise e descubra consultas SQL e tabelas catalogadas.",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    title: "Assistente IA",
    description: "Converse com o assistente inteligente para extrair informações do catálogo.",
  },
];

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full py-16 px-6">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-foreground text-center mb-8">
        Olá, o que você procura?
      </h1>

      {/* Search bar + Advanced Search button */}
      <div className="flex items-center gap-3 w-full max-w-2xl mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground text-sm select-none">Pesquisar por nome, descrição, responsável ou tag...</span>
        </div>
        <button
          type="button"
          className="flex-shrink-0 px-4 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-foreground shadow-sm cursor-default"
          tabIndex={-1}
        >
          Busca Avançada
        </button>
      </div>

      {/* Tags section */}
      <div className="flex flex-col gap-2 w-full max-w-2xl mb-10">
        {/* Row 1 */}
        <div className="flex flex-wrap gap-2">
          {ROW1_TAGS.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-default select-none ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Row 2 + "Confira mais tags" */}
        <div className="flex flex-wrap gap-2 items-center">
          {ROW2_TAGS.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-default select-none ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          <span className="text-xs font-medium text-primary underline underline-offset-2 cursor-default select-none px-1">
            Confira mais tags
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
        {CARDS.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-sm transition-all duration-150 cursor-pointer h-full">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/60">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
