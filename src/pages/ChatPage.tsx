import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Database,
  RotateCcw,
} from "lucide-react";
import { INITIAL_CHAT, ChatMessage } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const MOCK_RESPONSES = [
  "Pesquisei o catálogo e encontrei **2 entradas correspondentes** à sua consulta. Quer que eu mostre os detalhes completos?",
  "Com base nos metadados do catálogo, a tabela mais relevante é `tb_clientes`, de propriedade do **time-crm**. Tags: `clientes`, `crm`, `dados-mestre`.",
  "Vejo **3 consultas** que referenciam essa tabela. A mais recente é `vw_desempenho_produto`, criada em **05/05/2024** pelo time de analytics.",
  "Esse padrão de join aparece em **5 entradas do catálogo**. A abordagem recomendada usa `qry_top_clientes_join` como base, com LEFT JOIN em `tb_produtos` via `id_produto`.",
  "Não encontrei correspondência exata, mas **2 entradas similares** existem com tags sobrepostas. Quer que eu sugira consultas alternativas dos times de analytics ou ciência de dados?",
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  function renderContent(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="font-mono text-xs bg-black/10 px-1.5 py-0.5 rounded">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part === "\n") return <br key={i} />;
      return part;
    });
  }

  function renderTable(content: string) {
    const lines = content.split("\n");
    const tableLines = lines.filter(l => l.includes("|"));
    const otherLines = lines.filter(l => !l.includes("|"));
    const tableRows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/));

    return (
      <div className="space-y-2">
        <div className="text-sm leading-relaxed">
          {otherLines.filter(l => l.trim()).map((line, i) => (
            <p key={i}>{renderContent(line)}</p>
          ))}
        </div>
        {tableRows.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-white/20">
            <table className="text-xs w-full">
              {tableRows.map((row, i) => {
                const cells = row.split("|").filter(c => c.trim());
                return i === 0 ? (
                  <thead key={i}>
                    <tr className="bg-white/10">
                      {cells.map((cell, j) => (
                        <th key={j} className="text-left px-3 py-1.5 font-semibold">
                          {renderContent(cell.trim())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : (
                  <tbody key={i}>
                    <tr className="border-t border-white/10 hover:bg-white/5">
                      {cells.map((cell, j) => (
                        <td key={j} className="px-3 py-1.5">
                          {renderContent(cell.trim())}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        )}
      </div>
    );
  }

  const hasTable = message.content.includes("|");

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={cn(
        "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-primary text-white rounded-br-sm"
          : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
      )}>
        {hasTable && !isUser ? renderTable(message.content) : (
          <div className={cn("space-y-1", isUser ? "text-white" : "text-foreground")}>
            {message.content.split("\n").map((line, i) => {
              if (!line.trim()) return <br key={i} />;
              if (line.startsWith("> ")) {
                return (
                  <p key={i} className={cn("pl-2 border-l-2 text-xs opacity-70", isUser ? "border-white/40" : "border-border")}>
                    {renderContent(line.slice(2))}
                  </p>
                );
              }
              return <p key={i}>{renderContent(line)}</p>;
            })}
          </div>
        )}

        <div className={cn("text-xs mt-1.5", isUser ? "text-white/60 text-right" : "text-muted-foreground")}>
          {message.timestamp}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <UserIcon className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndex = useRef(0);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function now() {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: text,
      timestamp: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[responseIndex.current % MOCK_RESPONSES.length];
      responseIndex.current++;
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: response,
        timestamp: now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetChat() {
    setMessages(INITIAL_CHAT);
    responseIndex.current = 0;
  }

  const SUGGESTIONS = [
    "Quais tabelas fazem join?",
    "Mostre tabelas de dados mestre",
    "Quem são os donos analytics?",
    "Encontre entradas financeiras",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Assistente IA do Catálogo</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Conectado ao catálogo · {INITIAL_CHAT.length / 2} conversas de contexto</span>
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar chat
        </button>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground border border-border">
            <Database className="w-3.5 h-3.5 text-primary" />
            A IA tem acesso a 12 entradas em 3 bancos de dados
          </div>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões */}
      <div className="px-6 pb-3 flex flex-wrap gap-2 flex-shrink-0">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Campo de entrada */}
      <div className="px-6 pb-6 flex-shrink-0">
        <div className="flex items-end gap-3 bg-white border border-border rounded-xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre tabelas, consultas, responsáveis ou tags... (Enter para enviar)"
            rows={1}
            className="flex-1 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none resize-none leading-relaxed"
            style={{ minHeight: "24px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150",
              input.trim() && !isTyping
                ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          Shift+Enter para nova linha · Enter para enviar
        </p>
      </div>
    </div>
  );
}
