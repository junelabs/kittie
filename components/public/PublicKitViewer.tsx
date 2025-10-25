'use client';

import Image from 'next/image';
import { Download, ExternalLink } from 'lucide-react';
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

interface PublicKitViewerProps {
  kit: KitData;
}

export default function PublicKitViewer({ kit }: PublicKitViewerProps) {
  const heroSection = kit.sections.find(s => s.type === 'hero');
  const otherSections = kit.sections
    .filter(s => s.type !== 'hero')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {heroSection && (
        <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {kit.logo_url && (
              <div className="mb-8">
                <Image
                  src={kit.logo_url}
                  alt={`${kit.name} logo`}
                  width={120}
                  height={120}
                  className="mx-auto rounded-2xl"
                />
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {kit.name}
            </h1>
            
            {kit.description && (
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {kit.description}
              </p>
            )}
            
            {kit.download_button_text && (
              <Button
                size="lg"
                className="rounded-xl px-8 py-3 text-lg font-medium"
                style={{ 
                  backgroundColor: kit.download_button_color || '#3b82f6',
                  color: 'white'
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                {kit.download_button_text}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Other Sections */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {otherSections.map((section) => (
          <section key={section.id} className="mb-16">
            {section.title && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-lg text-gray-600">
                    {section.description}
                  </p>
                )}
              </div>
            )}

            {/* Gallery/Logos Section */}
            {(section.type === 'gallery' || section.type === 'logos') && section.assets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.assets.map((asset) => (
                  <div key={asset.id} className="group">
                    <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.team_members.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl font-semibold text-gray-600">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    {member.title && (
                      <p className="text-gray-600">
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

      {/* Footer */}
      {!kit.hide_branding && (
        <footer className="bg-gray-50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-500">
              Made with{' '}
              <a 
                href="https://kittie.so" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Kittie <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
