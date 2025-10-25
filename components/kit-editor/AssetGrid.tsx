'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, GripVertical, FileText } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { reorderAssets, deleteAsset, updateAsset } from '@/app/kits/[id]/actions';
import type { KitAsset } from '@/app/kits/[id]/actions';

interface AssetGridProps {
  kitId: string;
  sectionId: string;
  assets: KitAsset[];
  onAssetDeleted?: () => void;
  onAssetUpdated?: () => void;
}

export default function AssetGrid({
  kitId,
  sectionId,
  assets,
  onAssetDeleted,
  onAssetUpdated,
}: AssetGridProps) {
  const [items, setItems] = useState<KitAsset[]>(assets);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<string>('');

  // Sync items when assets prop changes
  useEffect(() => {
    setItems(assets);
  }, [assets]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Persist to server
      try {
        await reorderAssets({
          sectionId,
          orderedIds: newItems.map((item) => item.id),
        });
      } catch (error) {
        console.error('Failed to reorder:', error);
        // Revert on error
        setItems(items);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this asset? This cannot be undone.');
    if (!confirmed) return;

    setDeleting(id);
    try {
      await deleteAsset(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onAssetDeleted?.();
    } catch (error) {
      console.error('Failed to delete asset:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditDescription = (asset: KitAsset) => {
    setEditingDescription(asset.id);
    setDescriptionValue(asset.alt || '');
  };

  const handleSaveDescription = async (assetId: string) => {
    try {
      await updateAsset({ id: assetId, alt: descriptionValue });
      setItems((prev) => 
        prev.map((item) => 
          item.id === assetId 
            ? { ...item, alt: descriptionValue }
            : item
        )
      );
      setEditingDescription(null);
      setDescriptionValue('');
      onAssetUpdated?.();
    } catch (error) {
      console.error('Failed to update asset description:', error);
    }
  };

  const handleCancelDescription = () => {
    setEditingDescription(null);
    setDescriptionValue('');
  };

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-0">
                {items.map((asset) => (
                  <SortableAssetItem
                    key={asset.id}
                    asset={asset}
                    onDelete={() => handleDelete(asset.id)}
                    isDeleting={deleting === asset.id}
                    onEditDescription={() => handleEditDescription(asset)}
                    isEditingDescription={editingDescription === asset.id}
                    descriptionValue={descriptionValue}
                    onDescriptionChange={setDescriptionValue}
                    onSaveDescription={() => handleSaveDescription(asset.id)}
                    onCancelDescription={handleCancelDescription}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
      )}

      {items.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No assets yet. Upload some images to get started.
        </p>
      )}
    </div>
  );
}

function SortableAssetItem({
  asset,
  onDelete,
  isDeleting,
  onEditDescription,
  isEditingDescription,
  descriptionValue,
  onDescriptionChange,
  onSaveDescription,
  onCancelDescription,
}: {
  asset: KitAsset;
  onDelete: () => void;
  isDeleting: boolean;
  onEditDescription: () => void;
  isEditingDescription: boolean;
  descriptionValue: string;
  onDescriptionChange: (value: string) => void;
  onSaveDescription: () => void;
  onCancelDescription: () => void;
}) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 z-10 cursor-grab touch-none rounded bg-white/90 p-1 text-gray-400 opacity-0 shadow-sm transition-opacity hover:text-gray-600 group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-3 w-3" />
      </button>

      <Image
        src={asset.url}
        alt={asset.alt || 'Asset'}
        width={200}
        height={200}
        className="rounded-lg object-cover"
      />

      <div className="absolute bottom-1 right-1 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          onClick={onEditDescription}
          className="h-6 w-6 bg-blue-600 text-white hover:bg-blue-700"
        >
          <FileText className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          disabled={isDeleting}
          className="h-6 w-6 bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {isEditingDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Image Description</h3>
            <Input
              value={descriptionValue}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Enter a description for this image..."
              className="mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                onClick={onSaveDescription}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={onCancelDescription}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

