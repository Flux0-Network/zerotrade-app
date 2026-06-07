"use client";

import { MousePointer2, Minus, TrendingUp, Square, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawingTool = "cursor" | "trendline" | "horizontal" | "rectangle";

interface DrawingToolbarProps {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClear: () => void;
  hasDrawings: boolean;
}

const TOOLS: { value: DrawingTool; label: string; icon: typeof MousePointer2 }[] = [
  { value: "cursor", label: "Cursor", icon: MousePointer2 },
  { value: "trendline", label: "Trendlinie", icon: TrendingUp },
  { value: "horizontal", label: "Horizontale Linie", icon: Minus },
  { value: "rectangle", label: "Rechteck", icon: Square },
];

export function DrawingToolbar({ tool, onToolChange, onClear, hasDrawings }: DrawingToolbarProps) {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 rounded-lg border border-border/60 bg-card/80 p-1 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      {TOOLS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          title={label}
          aria-label={label}
          onClick={() => onToolChange(value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            tool === value
              ? "bg-emerald-500/15 text-emerald-400"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
      <div className="my-1 h-px bg-border/60" />
      <button
        title="Zeichnungen löschen"
        aria-label="Zeichnungen löschen"
        onClick={onClear}
        disabled={!hasDrawings}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-red-400 disabled:pointer-events-none disabled:opacity-30"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
