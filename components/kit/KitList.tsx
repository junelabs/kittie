"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Share } from "lucide-react";
import { MediaKit } from "../../types";
import { EmbedModal } from "./EmbedModal";

interface KitListProps {
  kits: MediaKit[];
}

export function KitList({ kits }: KitListProps) {
  const router = useRouter();
  const [embedKit, setEmbedKit] = useState<MediaKit | null>(null);

  const handleDelete = async (kitId: string) => {
    if (!confirm("Are you sure you want to delete this kit? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/kits/${kitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete kit");
      }
    } catch (error) {
      console.error("Error deleting kit:", error);
      alert("Failed to delete kit");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (kits.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No kits yet</h3>
        <p className="text-gray-500">Create your first media kit to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map((kit) => (
          <Card key={kit.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold truncate">
                  {kit.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/kit/${kit.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEmbedKit(kit)}>
                      <Share className="mr-2 h-4 w-4" />
                      Embed
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(kit.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created</span>
                  <span>{formatDate(kit.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    kit.is_public 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {kit.is_public ? "Public" : "Private"}
                  </span>
                </div>
                {kit.brand_color && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Brand Color</span>
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: kit.brand_color }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button 
                  onClick={() => router.push(`/kit/${kit.id}`)}
                  className="w-full"
                >
                  Open Kit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {embedKit && (
        <EmbedModal 
          kit={embedKit} 
          onClose={() => setEmbedKit(null)} 
        />
      )}
    </>
  );
}
