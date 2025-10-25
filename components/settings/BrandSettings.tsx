'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, Plus } from 'lucide-react';
import { getBrands, deleteBrand } from '@/app/actions/brand-actions';
import BrandModal from '@/components/dashboard/BrandModal';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  primary_color?: string;
  created_at: string;
}

export default function BrandSettings() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = () => {
    setEditingBrand(undefined);
    setShowModal(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowModal(true);
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      return;
    }

    setDeletingId(brandId);
    try {
      await deleteBrand(brandId);
      await loadBrands();
    } catch (error: any) {
      alert(error.message || 'Failed to delete brand');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = () => {
    loadBrands();
    setShowModal(false);
    setEditingBrand(undefined);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Brand Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Your Brands</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage multiple brands for your organization
          </p>
        </div>
        <Button onClick={handleCreateBrand} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Brand</span>
        </Button>
      </div>

      {/* Brands List */}
      {brands.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first brand to start organizing your media kits
            </p>
            <Button onClick={handleCreateBrand}>
              Create Your First Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {brand.logo_url ? (
                      <img 
                        src={brand.logo_url} 
                        alt={brand.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: brand.primary_color || '#000000' }}
                      >
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{brand.name}</CardTitle>
                      <p className="text-xs text-gray-500">{brand.slug}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {brand.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Created {new Date(brand.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBrand(brand)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id)}
                      disabled={deletingId === brand.id}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Brand Modal */}
      <BrandModal
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={handleModalSuccess}
        brand={editingBrand}
      />
    </div>
  );
}
