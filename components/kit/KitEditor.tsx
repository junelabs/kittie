"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDropzone } from "./UploadDropzone";
import { AssetGrid } from "./AssetGrid";
import { EmbedModal } from "./EmbedModal";
import { MediaKit, Asset, AssetKind } from "../../types";
import { ArrowLeft, Settings, Share, Palette } from "lucide-react";

interface KitEditorProps {
  kit: MediaKit;
  assets: Asset[];
}

export function KitEditor({ kit, assets }: KitEditorProps) {
  const router = useRouter();
  const [currentKit, setCurrentKit] = useState(kit);
  const [currentAssets, setCurrentAssets] = useState(assets);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [kitName, setKitName] = useState(kit.name);
  const [kitColor, setKitColor] = useState(kit.brand_color || "");
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const handleUpdateKit = async (updates: Partial<MediaKit>) => {
    try {
      const response = await fetch(`/api/kits/${kit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedKit = await response.json();
        setCurrentKit(updatedKit);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update kit");
      }
    } catch (error) {
      console.error("Error updating kit:", error);
      alert("Failed to update kit");
    }
  };

  const handleNameSave = async () => {
    if (kitName.trim() !== kit.name) {
      await handleUpdateKit({ name: kitName.trim() });
    }
    setIsEditingName(false);
  };

  const handleColorSave = async () => {
    await handleUpdateKit({ brand_color: kitColor || null });
    setIsEditingColor(false);
  };

  const handleAssetReorder = (updates: { id: string; order_index: number }[]) => {
    setCurrentAssets(prev => {
      const newAssets = [...prev];
      updates.forEach(({ id, order_index }) => {
        const asset = newAssets.find(a => a.id === id);
        if (asset) {
          asset.order_index = order_index;
        }
      });
      return newAssets.sort((a, b) => a.order_index - b.order_index);
    });
  };

  const handleAssetUpdate = (id: string, updates: Partial<Asset>) => {
    setCurrentAssets(prev => 
      prev.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    );
  };

  const handleAssetDelete = (id: string) => {
    setCurrentAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleUploadComplete = () => {
    router.refresh();
  };

  const getAssetsByKind = (kind: AssetKind) => {
    return currentAssets.filter(asset => asset.kind === kind);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={kitName}
                      onChange={(e) => setKitName(e.target.value)}
                      className="text-2xl font-bold"
                      autoFocus
                      onBlur={handleNameSave}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNameSave();
                        if (e.key === "Escape") {
                          setKitName(kit.name);
                          setIsEditingName(false);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <h1 
                    className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => setIsEditingName(true)}
                  >
                    {currentKit.name}
                  </h1>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                {isEditingColor ? (
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Brand Color:</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={kitColor}
                        onChange={(e) => setKitColor(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={kitColor}
                        onChange={(e) => setKitColor(e.target.value)}
                        placeholder="#000000"
                        className="w-24"
                      />
                      <Button size="sm" onClick={handleColorSave}>
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setKitColor(kit.brand_color || "");
                          setIsEditingColor(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Brand Color:</Label>
                    <div 
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:ring-2 hover:ring-gray-400"
                      style={{ backgroundColor: currentKit.brand_color || "#f3f4f6" }}
                      onClick={() => setIsEditingColor(true)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingColor(true)}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEmbedModal(true)}
              >
                <Share className="mr-2 h-4 w-4" />
                Embed
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="logos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  kitId={kit.id}
                  kind="logo"
                  onUploadComplete={handleUploadComplete}
                />
                <div className="mt-6">
                  <AssetGrid
                    assets={getAssetsByKind("logo")}
                    onReorder={handleAssetReorder}
                    onUpdate={handleAssetUpdate}
                    onDelete={handleAssetDelete}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  kitId={kit.id}
                  kind="image"
                  onUploadComplete={handleUploadComplete}
                />
                <div className="mt-6">
                  <AssetGrid
                    assets={getAssetsByKind("image")}
                    onReorder={handleAssetReorder}
                    onUpdate={handleAssetUpdate}
                    onDelete={handleAssetDelete}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  kitId={kit.id}
                  kind="doc"
                  onUploadComplete={handleUploadComplete}
                />
                <div className="mt-6">
                  <AssetGrid
                    assets={getAssetsByKind("doc")}
                    onReorder={handleAssetReorder}
                    onUpdate={handleAssetUpdate}
                    onDelete={handleAssetDelete}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bio tab removed to align with AssetKind ('logo' | 'image' | 'doc') */}
        </Tabs>
      </div>

      {showEmbedModal && (
        <EmbedModal
          kit={currentKit}
          onClose={() => setShowEmbedModal(false)}
        />
      )}
    </div>
  );
}
