"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewKitDialog({ variant = "default" as "default" | "prominent" }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  // Placeholder submit - wire to API later
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={
          variant === "prominent"
            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            : undefined
        }>
          New Kit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Media Kit</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="kit-name">Name</Label>
            <Input id="kit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Brand" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewKitDialog;


