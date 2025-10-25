'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Building2, Settings, Users, Zap } from 'lucide-react';
import { getBrands } from '@/app/actions/brand-actions';
import BrandModal from './BrandModal';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
}

interface BrandSelectorProps {
  activeBrandId?: string;
  onBrandChange: (brandId: string) => void;
}

export default function BrandSelector({ activeBrandId, onBrandChange }: BrandSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
      
      // Set first brand as active if none selected
      if (!activeBrandId && data.length > 0) {
        onBrandChange(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeBrand = brands.find(brand => brand.id === activeBrandId);

  const handleBrandSelect = (brandId: string) => {
    onBrandChange(brandId);
  };

  const handleBrandCreated = () => {
    loadBrands();
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        <span className="text-sm text-gray-500">Loading brands...</span>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <Button
        variant="ghost"
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <Plus className="w-4 h-4" />
        <span>Add Brand</span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <span className="font-medium">{activeBrand?.name || 'Select Brand'}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: activeBrand?.primary_color || '#6b7280' }}
              >
                {activeBrand?.name?.charAt(0) || 'B'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{activeBrand?.name}</div>
                <div className="text-sm text-gray-500">Brand</div>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">BRAND SETTINGS</div>
          </div>
          
          <DropdownMenuItem onClick={() => setShowModal(true)} className="flex items-center space-x-3">
            <Settings className="w-4 h-4" />
            <span>Brand Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem disabled className="flex items-center space-x-3 text-gray-400">
            <Users className="w-4 h-4" />
            <span>Team Members</span>
            <Badge variant="secondary" className="ml-auto text-xs">Coming Soon</Badge>
          </DropdownMenuItem>
          
          <DropdownMenuItem disabled className="flex items-center space-x-3 text-gray-400">
            <Zap className="w-4 h-4" />
            <span>Integrations</span>
            <Badge variant="secondary" className="ml-auto text-xs">Coming Soon</Badge>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BrandModal
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={handleBrandCreated}
        brand={activeBrand}
      />
    </>
  );
}
