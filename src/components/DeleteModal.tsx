import { AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ open, itemName, itemType, onConfirm, onCancel }: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">Excluir {itemType}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tem certeza que deseja excluir{" "}
              <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">
                {itemName}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-white hover:bg-muted text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
