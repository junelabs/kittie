'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import TeamAvatarUploader from './TeamAvatarUploader';
import type { KitTeamMember } from '@/app/kits/[id]/actions';

interface TeamEditorProps {
  kitId: string;
  team: KitTeamMember[];
  onAdd: (data: { name: string; title?: string; avatarUrl?: string }) => Promise<void>;
  onUpdate: (id: string, data: { name?: string; title?: string; avatarUrl?: string }) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TeamEditor({
  kitId,
  team,
  onAdd,
  onUpdate,
  onReorder,
  onDelete,
}: TeamEditorProps) {
  const [items, setItems] = useState(team);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', title: '', avatarUrl: '' });

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

      await onReorder(newItems.map((item) => item.id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    await onAdd({
      name: newMember.name,
      title: newMember.title || undefined,
      avatarUrl: newMember.avatarUrl || undefined,
    });

    setNewMember({ name: '', title: '', avatarUrl: '' });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Remove this team member?');
    if (!confirmed) return;

    await onDelete(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };


  // Sync items when team prop changes
  if (team.length !== items.length) {
    setItems(team);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Team Members</Label>
      </div>

      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((member) => (
                <SortableTeamMemberItem
                  key={member.id}
                  kitId={kitId}
                  member={member}
                  onUpdate={(data) => onUpdate(member.id, data)}
                  onDelete={() => handleDelete(member.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isAdding ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded-xl border bg-white p-4">
          <div className="space-y-2">
            <Label htmlFor="new-name">Name *</Label>
            <Input
              id="new-name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Jane Doe"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-title">Title</Label>
            <Input
              id="new-title"
              value={newMember.title}
              onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
              placeholder="CEO"
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <TeamAvatarUploader
              memberId="new"
              kitId={kitId}
              onUploadComplete={(url) => {
                setNewMember({ ...newMember, avatarUrl: url });
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Add Member
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewMember({ name: '', title: '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      )}
    </div>
  );
}

function SortableTeamMemberItem({
  kitId,
  member,
  onUpdate,
  onDelete,
}: {
  kitId: string;
  member: KitTeamMember;
  onUpdate: (data: { name?: string; title?: string; avatarUrl?: string }) => Promise<void>;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [title, setTitle] = useState(member.title || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    await onUpdate({
      name: name.trim(),
      title: title.trim() || undefined,
    });

    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-2 rounded-xl border bg-white p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-8"
            />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="h-8"
            />
            <TeamAvatarUploader
              memberId={member.id}
              kitId={kitId}
              currentAvatarUrl={member.avatar_url}
              onUploadComplete={(url) => onUpdate({ avatarUrl: url })}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="h-7">
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setName(member.name);
                  setTitle(member.title || '');
                  setIsEditing(false);
                }}
                className="h-7"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            {member.avatar_url && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                <Image src={member.avatar_url} alt={member.name} fill className="object-contain" />
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 text-left cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              {member.title && (
                <p className="text-xs text-muted-foreground">{member.title}</p>
              )}
            </button>
          </div>
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={onDelete}
        className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5 text-red-600" />
      </Button>
    </div>
  );
}

