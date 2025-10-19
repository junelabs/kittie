"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NewKitDialogProps {
  variant?: string;
}

export function NewKitDialog({ variant }: NewKitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter a kit name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/kits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          brand_color: brandColor || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        setName("");
        setBrandColor("");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create kit");
      }
    } catch (error) {
      console.error("Error creating kit:", error);
      alert("Failed to create kit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Kit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Media Kit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Media Kit"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandColor">Brand Color (optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="brandColor"
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Kit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
