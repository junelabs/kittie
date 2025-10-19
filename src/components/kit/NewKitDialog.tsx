"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { EnhancedKitDialog } from "./EnhancedKitDialog";

interface NewKitDialogProps {
  variant?: "default" | "prominent";
}

export function NewKitDialog({ variant = "default" }: NewKitDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={variant === "prominent" ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3" : "font-medium"}
      >
        {variant === "prominent" ? (
          <>
            <FolderPlus className="mr-2 h-5 w-5" />
            Create a new media kit
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            New Kit
          </>
        )}
      </Button>
      
      <EnhancedKitDialog open={open} onOpenChange={setOpen} />
    </>
  );
}