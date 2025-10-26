'use client';

import { useState, useEffect } from 'react';

export default function TestEmbedPage() {
  const [publicKits, setPublicKits] = useState<Array<{id: string; name: string; slug: string}>>([]);
  const [selectedKitId, setSelectedKitId] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Load KittieEmbed script
    const script = document.createElement('script');
    script.src = 'https://kittie.so/embed.js';
    script.async = true;
    document.head.appendChild(script);

    // Fetch public kits
    fetch('/api/public-kits')
      .then(res => res.json())
      .then(data => {
        setPublicKits(data.kits || []);
        if (data.kits && data.kits.length > 0) {
          setSelectedKitId(data.kits[0].id);
        }
      });

    return () => {
      const existingScript = document.querySelector('script[src="https://kittie.so/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const testEmbed = () => {
    if (selectedKitId && window.KittieEmbed) {
      window.KittieEmbed.open(selectedKitId);
    } else {
      alert('No kit selected or KittieEmbed not loaded');
    }
  };

  const debugKit = async () => {
    if (!selectedKitId) return;
    
    try {
      const response = await fetch(`/api/debug/embed?kitId=${selectedKitId}`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug failed:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Embed Debug Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Public Kits</h2>
          {publicKits.length === 0 ? (
            <p className="text-gray-500">No public kits found</p>
          ) : (
            <div className="space-y-2">
              {publicKits.map(kit => (
                <div key={kit.id} className="p-3 border rounded">
                  <div className="font-medium">{kit.name}</div>
                  <div className="text-sm text-gray-500">ID: {kit.id}</div>
                  <div className="text-sm text-gray-500">Slug: {kit.slug}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Embed</h2>
          <div className="space-y-4">
            <select 
              value={selectedKitId} 
              onChange={(e) => setSelectedKitId(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Select a kit</option>
              {publicKits.map(kit => (
                <option key={kit.id} value={kit.id}>{kit.name}</option>
              ))}
            </select>
            
            <div className="flex gap-4">
              <button 
                onClick={testEmbed}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Embed Modal
              </button>
              
              <button 
                onClick={debugKit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Debug Kit Data
              </button>
            </div>
          </div>
        </div>

        {debugInfo && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
