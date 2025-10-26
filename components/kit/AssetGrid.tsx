"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, Trash2, GripVertical, Download, FileText, Image, Palette } from "lucide-react";
import { Asset, AssetKind } from "../../types";

interface AssetGridProps {
  assets: Asset[];
  onReorder: (updates: { id: string; order_index: number }[]) => void;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
}

function AssetCard({ asset, onUpdate, onDelete }: { 
  asset: Asset; 
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(asset.label || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleLabelSave = async () => {
    if (label !== (asset.label || "")) {
      try {
        const response = await fetch(`/api/assets/${asset.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label: label.trim() || null }),
        });

        if (response.ok) {
          onUpdate(asset.id, { label: label.trim() || null });
        } else {
          const error = await response.json();
          alert(error.error || "Failed to update label");
        }
      } catch (error) {
        console.error("Error updating label:", error);
        alert("Failed to update label");
      }
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this asset?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(asset.id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert("Failed to delete asset");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAssetIcon = (kind: AssetKind) => {
    switch (kind) {
      case "logo": return <Palette className="h-8 w-8 text-blue-500" />;
      case "image": return <Image className="h-8 w-8 text-green-500" />;
      case "doc": return <FileText className="h-8 w-8 text-orange-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  // Using minimal fields defined in current Asset type

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${isDeleting ? "opacity-50" : ""}`}
      >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            {getAssetIcon(asset.kind)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Asset label"
                className="text-sm"
                autoFocus
                onBlur={handleLabelSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLabelSave();
                  if (e.key === "Escape") {
                    setLabel(asset.label || "");
                    setIsEditing(false);
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-medium text-sm truncate">
                {asset.label || asset.file_path.split("/").pop() || "Untitled"}
              </div>
              <div className="text-xs text-gray-500">&nbsp;</div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(asset.file_path, "_blank")}
          >
            <Download className="mr-2 h-3 w-3" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export function AssetGrid({ assets, onReorder, onUpdate, onDelete }: AssetGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = assets.findIndex((asset) => asset.id === active.id);
      const newIndex = assets.findIndex((asset) => asset.id === over?.id);

      const newAssets = arrayMove(assets, oldIndex, newIndex) as Asset[];
      
      // Create updates for the reorder API
      const updates = newAssets.map((asset, index) => ({
        id: asset.id,
        order_index: index + 1,
      }));

      try {
        const response = await fetch("/api/assets/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates }),
        });

        if (response.ok) {
          onReorder(updates);
        } else {
          const error = await response.json();
          alert(error.error || "Failed to reorder assets");
        }
      } catch (error) {
        console.error("Error reordering assets:", error);
        alert("Failed to reorder assets");
      }
    }
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📁</div>
        <p>No assets yet. Upload some files to get started.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={assets.map(asset => asset.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
