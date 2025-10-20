"use client";

import { MediaKit } from "../../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function KitList({ kits }: { kits: MediaKit[] }) {
  if (!kits?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kits.map((kit) => (
        <Card key={kit.id} className="border border-amber-200">
          <CardHeader>
            <CardTitle className="truncate">{kit.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-amber-600">{new Date(kit.created_at).toLocaleDateString()}</span>
            <Link href={`/kit/${kit.id}`} className="text-orange-700 font-medium hover:underline">Open</Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default KitList;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Share } from "lucide-react";
import { MediaKit } from "../../../types";
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
        <p className="text-amber-600">Create your first media kit to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map((kit) => (
          <Card key={kit.id} className="hover:shadow-lg transition-all duration-200 border border-amber-200 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold truncate tracking-tight text-gray-900">
                  {kit.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#fcfcf0]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push(`/kit/${kit.id}`)} className="py-2.5">
                      <Edit className="mr-3 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEmbedKit(kit)} className="py-2.5">
                      <Share className="mr-3 h-4 w-4" />
                      Embed
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(kit.id)}
                      className="text-red-600 focus:text-red-600 py-2.5"
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-amber-600">
                  <span className="font-medium">Created</span>
                  <span>{formatDate(kit.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-amber-600">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    kit.is_public 
                      ? "bg-green-100 text-green-800" 
                      : "bg-[#fcfcf0] text-amber-800"
                  }`}>
                    {kit.is_public ? "Public" : "Private"}
                  </span>
                </div>
                {kit.brand_color && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-amber-600">Brand Color</span>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-amber-300"
                      style={{ backgroundColor: kit.brand_color }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-amber-100">
                <Button 
                  onClick={() => router.push(`/kit/${kit.id}`)}
                  className="w-full font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
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

