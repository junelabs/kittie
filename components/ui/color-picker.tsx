"use client";

import * as React from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value: string;                           // "#FF6B6B"
  onChange: (hex: string) => void;
  onChangeComplete?: (hex: string) => void; // Called after user stops dragging
  className?: string;
  label?: string;
  swatchSize?: number;                     // 20-28 looks nice
};

export default function ColorPicker({
  value,
  onChange,
  onChangeComplete,
  className,
  label = "Color",
  swatchSize = 22,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(() => normalizeHex(value || '#FF6B6B'));
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync local color when external value changes
  React.useEffect(() => {
    setLocalColor(normalizeHex(value || '#FF6B6B'));
  }, [value]);

  const handleColorChange = (newColor: string) => {
    const normalized = normalizeHex(newColor);
    setLocalColor(normalized);
    onChange(normalized); // Update local state immediately

    // Debounce the onChangeComplete call
    if (onChangeComplete) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChangeComplete(normalized);
      }, 300); // Wait 300ms after user stops dragging
    }
  };

  const hex = localColor;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <div className="text-sm font-medium text-foreground/90">{label}</div> : null}

      <div className="flex items-center gap-2">
        {/* Trigger (swatch + hex input) */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Open color picker"
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-muted/40 px-2 py-1.5 cursor-pointer",
                "hover:bg-muted/60 transition focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
            >
              <span
                className="inline-block rounded-full ring-1 ring-black/10"
                style={{ width: swatchSize, height: swatchSize, backgroundColor: hex }}
              />
              <span className="text-sm tabular-nums">{hex.toUpperCase()}</span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-[220px] rounded-xl border bg-popover p-3 shadow-lg"
          >
            <div className="space-y-3">
              {/* Saturation/Brightness square */}
              <HexColorPicker color={hex} onChange={handleColorChange} />

              {/* Preview and hex input */}
              <div className="flex items-center justify-between">
                <span
                  className="inline-block rounded-full ring-1 ring-black/10"
                  style={{ width: 28, height: 28, backgroundColor: hex }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">HEX</span>
                  <HexColorInput
                    color={hex}
                    onChange={handleColorChange}
                    prefixed
                    alpha={false}
                    className="h-8 w-[110px] rounded-md border bg-background px-2 text-sm uppercase"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                        if (onChangeComplete) {
                          onChangeComplete(hex);
                        }
                      } else if (e.key === "Escape") {
                        setOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Editable hex input inline (optional) */}
        <Input
          value={hex.toUpperCase()}
          onChange={(e) => handleColorChange(e.target.value)}
          onBlur={() => {
            if (onChangeComplete) {
              onChangeComplete(hex);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              if (onChangeComplete) {
                onChangeComplete(hex);
              }
            }
          }}
          className="h-9 w-full uppercase font-mono text-sm"
        />
      </div>
    </div>
  );
}

/** Ensure "#RRGGBB" form, clamp invalid chars. */
function normalizeHex(input: string): string {
  let v = (input || "").trim().replace(/^#/, "").toLowerCase();
  v = v.replace(/[^0-9a-f]/g, "").slice(0, 6);
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  if (v.length < 6) v = v.padEnd(6, "0");
  return `#${v}`;
}

