'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KitData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  download_button_text?: string;
  download_button_color?: string;
  hide_branding: boolean;
  sections: Array<{
    id: string;
    type: 'hero' | 'gallery' | 'logos' | 'team';
    title?: string;
    description?: string;
    order: number;
    assets: Array<{
      id: string;
      url: string;
      alt_text?: string;
      order: number;
    }>;
    team_members: Array<{
      id: string;
      name: string;
      title?: string;
      avatar_url?: string;
      order: number;
    }>;
  }>;
}

interface EmbedKitViewerProps {
  kit: KitData;
}

export default function EmbedKitViewer({ kit }: EmbedKitViewerProps) {
  const heroSection = kit.sections.find(s => s.type === 'hero');
  const otherSections = kit.sections
    .filter(s => s.type !== 'hero')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {heroSection && (
        <section className="bg-gradient-to-br from-gray-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {kit.logo_url && (
              <div className="mb-6">
                <Image
                  src={kit.logo_url}
                  alt={`${kit.name} logo`}
                  width={100}
                  height={100}
                  className="mx-auto rounded-xl"
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {kit.name}
            </h1>
            
            {kit.description && (
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                {kit.description}
              </p>
            )}
            
            {kit.download_button_text && (
              <Button
                size="lg"
                className="rounded-xl px-6 py-2.5 text-base font-medium"
                style={{ 
                  backgroundColor: kit.download_button_color || '#3b82f6',
                  color: 'white'
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                {kit.download_button_text}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Other Sections */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        {otherSections.map((section) => (
          <section key={section.id} className="mb-12">
            {section.title && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-base text-gray-600">
                    {section.description}
                  </p>
                )}
              </div>
            )}

            {/* Gallery/Logos Section */}
            {(section.type === 'gallery' || section.type === 'logos') && section.assets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.assets.map((asset) => (
                  <div key={asset.id} className="group">
                    <div className="relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <Image
                        src={asset.url}
                        alt={asset.alt_text || `${kit.name} asset`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Team Section */}
            {section.type === 'team' && section.team_members.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.team_members.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-semibold text-gray-600">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    {member.title && (
                      <p className="text-sm text-gray-600">
                        {member.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer - Only show if branding is not hidden */}
      {!kit.hide_branding && (
        <footer className="bg-gray-50 py-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500">
              Made with{' '}
              <a 
                href="https://kittie.so" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Kittie
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
