'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Kit, KitSection, KitAsset, KitTeamMember } from '@/app/kits/[id]/actions';

interface CanvasProps {
  kit: Kit;
  sections: KitSection[];
  assets: Record<string, KitAsset[]>;
  team: KitTeamMember[];
}

export default function Canvas({ kit, sections, assets, team }: CanvasProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {sections.map((section) => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={section.id} kit={kit} section={section} />;
            case 'logos':
              return (
                <LogoSection
                  key={section.id}
                  section={section}
                  assets={assets[section.id] || []}
                />
              );
            case 'gallery':
              return (
                <GallerySection
                  key={section.id}
                  section={section}
                  assets={assets[section.id] || []}
                />
              );
            case 'team':
              return <TeamSection key={section.id} section={section} team={team} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function HeroSection({ kit, section }: { kit: Kit; section: KitSection }) {
  return (
    <section className="text-center">
      {kit.logo_url && (
        <div className="mb-6 flex justify-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image src={kit.logo_url} alt={kit.name} fill className="object-contain p-2" />
          </div>
        </div>
      )}

      <h1 className="mb-3 text-4xl font-bold text-gray-900">{kit.name}</h1>

      {kit.description && (
        <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">{kit.description}</p>
      )}

      <Button 
        size="lg" 
        className="rounded-2xl hover:opacity-90"
        style={{ backgroundColor: kit.button_color || '#FF6B6B' }}
      >
        {kit.button_label || 'Download Brand Kit'}
      </Button>
    </section>
  );
}

function LogoSection({
  section,
  assets,
}: {
  section: KitSection;
  assets: KitAsset[];
}) {
  return (
    <section>
      {section.title && (
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{section.title}</h2>
      )}

      {section.description && (
        <p className="mb-6 text-gray-600">{section.description}</p>
      )}

      {assets.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <Image
                src={asset.url}
                alt={asset.alt || 'Asset'}
                width={300}
                height={300}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200"
            />
          ))}
        </div>
      )}
    </section>
  );
}

function GallerySection({
  section,
  assets,
}: {
  section: KitSection;
  assets: KitAsset[];
}) {
  return (
    <section>
      {section.title && (
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{section.title}</h2>
      )}

      {section.description && (
        <p className="mb-6 text-gray-600">{section.description}</p>
      )}

      {assets.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="space-y-2">
              <Image
                src={asset.url}
                alt={asset.alt || 'Asset'}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              {asset.alt && asset.alt.trim() !== '' && (
                <p className="text-sm text-gray-600 text-left leading-tight">
                  {asset.alt}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TeamSection({
  section,
  team,
}: {
  section: KitSection;
  team: KitTeamMember[];
}) {
  return (
    <section>
      {section.title && (
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{section.title}</h2>
      )}

      {section.description && (
        <p className="mb-6 text-gray-600">{section.description}</p>
      )}

      {team.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.id} className="text-center">
              {member.avatar_url && (
                <div className="mb-3 flex justify-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                    <Image
                      src={member.avatar_url}
                      alt={member.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
              {member.title && (
                <p className="text-xs text-muted-foreground">{member.title}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
              </div>
              <div className="h-4 w-20 mx-auto rounded bg-gray-200" />
              <div className="mt-2 h-3 w-16 mx-auto rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

