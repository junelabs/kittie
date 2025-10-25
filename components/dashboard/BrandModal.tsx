'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createBrand, updateBrand } from '@/app/actions/brand-actions';
import { Building2, Palette, Upload, Users, Zap } from 'lucide-react';
import ColorPicker from '@/components/ui/color-picker';

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(60, 'Brand name must be under 60 characters'),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  brand?: {
    id: string;
    name: string;
    description?: string;
    primary_color?: string;
    logo_url?: string;
  };
}


export default function BrandModal({ open, onOpenChange, onSuccess, brand }: BrandModalProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(brand?.primary_color || '#000000');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo_url || null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || '',
      description: brand?.description || '',
      primary_color: brand?.primary_color || '#000000',
    },
  });

  const nameValue = watch('name');

  const onSubmit = (data: BrandFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set('name', data.name);
        if (data.description) formData.set('description', data.description);
        formData.set('primary_color', selectedColor);
        
        // Handle logo upload
        if (logoFile) {
          formData.set('logo', logoFile);
        }

        if (brand) {
          await updateBrand(brand.id, formData);
        } else {
          await createBrand(formData);
        }

        onSuccess();
        reset();
        setSelectedColor('#000000');
        setLogoFile(null);
        setLogoPreview(null);
      } catch (err: any) {
        setError(err.message || 'Failed to save brand');
      }
    });
  };

  const handleClose = () => {
    if (!pending) {
      onOpenChange(false);
      reset();
      setError(null);
      setSelectedColor('#000000');
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>{brand ? 'Edit Brand' : 'Create New Brand'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Acme Corporation"
                {...register('name')}
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
              {nameValue && (
                <p className="text-xs text-gray-500">
                  Slug: {nameValue.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your brand..."
                {...register('description')}
                className={errors.description ? 'border-red-300' : ''}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Brand Logo (Optional)</Label>
              <div className="space-y-3">
                {logoPreview ? (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{logoFile?.name || 'Current logo'}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Click to upload logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setLogoPreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <ColorPicker
                value={selectedColor}
                onChange={setSelectedColor}
                label="Primary Color"
                className="w-full"
              />
            </div>

            {/* Team Members Section */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team Members</span>
                <span className="text-xs text-gray-500">(Coming Soon)</span>
              </Label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Team collaboration features will be available soon.</p>
              </div>
            </div>

            {/* Integrations Section */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Integrations</span>
                <span className="text-xs text-gray-500">(Coming Soon)</span>
              </Label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Connect with your favorite tools and services.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
            >
              {pending ? 'Saving...' : brand ? 'Update Brand' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
