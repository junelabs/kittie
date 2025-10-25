'use client';

import { useState, useEffect } from 'react';
import { GripVertical, Image as ImageIcon, Grid3x3, Users, Plus, Trash2 } from 'lucide-react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { KitSection } from '@/app/kits/[id]/actions';

interface OutlineProps {
  sections: KitSection[];
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
  onReorder: (orderedIds: string[]) => Promise<void>;
  onAddSection: (type: 'logos' | 'gallery') => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
}

const sectionIcons = {
  hero: ImageIcon,
  logos: Grid3x3,
  gallery: ImageIcon,
  team: Users,
};

const sectionLabels = {
  hero: 'Hero',
  logos: 'Logos',
  gallery: 'Gallery',
  team: 'Team',
};

export default function Outline({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onAddSection,
  onDeleteSection,
}: OutlineProps) {
  const [items, setItems] = useState(sections);
  const [adding, setAdding] = useState(false);

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
      await onReorder(newItems.map((item) => item.id));
    }
  };

  const handleAddSection = async (type: 'logos' | 'gallery') => {
    setAdding(true);
    try {
      await onAddSection(type);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this section? All assets will be removed.');
    if (!confirmed) return;

    await onDeleteSection(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Sync items when sections prop changes (including title/description updates)
  useEffect(() => {
    setItems(sections);
  }, [sections]);

  // Hero is always first and not draggable
  const hero = items.find((s) => s.type === 'hero');
  const draggableSections = items.filter((s) => s.type !== 'hero');

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Sections</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Hero (fixed) */}
          {hero && (
            <button
              onClick={() => onSelect(hero.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer',
                selectedSectionId === hero.id
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
              )}
            >
              <ImageIcon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-sm font-medium">Hero</span>
            </button>
          )}

          {/* Draggable sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draggableSections}
              strategy={verticalListSortingStrategy}
            >
              {draggableSections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => onSelect(section.id)}
                  onDelete={() => handleDelete(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Add Section */}
      <div className="border-t p-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleAddSection('logos')}
          disabled={adding}
          className="w-full justify-start"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>
    </div>
  );
}

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: KitSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = sectionIcons[section.type];
  const label = section.title || sectionLabels[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 rounded-xl transition-colors',
        isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'cursor-grab touch-none p-2 active:cursor-grabbing',
          isSelected ? 'text-white/70' : 'text-gray-400 hover:text-gray-600'
        )}
        suppressHydrationWarning
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        onClick={onSelect}
        className="flex flex-1 items-center gap-2 py-2.5 pr-2 text-left cursor-pointer"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-sm font-medium">{label}</span>
      </button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={cn(
          'mr-2 h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100',
          isSelected && 'hover:bg-white/20'
        )}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

