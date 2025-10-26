'use client';

import { useState, useEffect } from 'react';

export default function TestEmbedPage() {
  const [publicKits, setPublicKits] = useState<Array<{id: string; name: string; slug: string}>>([]);
  const [selectedKitId, setSelectedKitId] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load KittieEmbed script
    const script = document.createElement('script');
    script.src = '/embed.js'; // Use local embed script
    script.async = true;
    script.onload = () => {
      console.log('KittieEmbed script loaded successfully');
      console.log('window.KittieEmbed:', window.KittieEmbed);
      setIsScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load KittieEmbed script:', error);
    };
    document.head.appendChild(script);

    // Fetch public kits
    fetch('/api/public-kits')
      .then(res => res.json())
      .then(data => {
        console.log('Public kits data:', data);
        setPublicKits(data.kits || []);
        if (data.kits && data.kits.length > 0) {
          setSelectedKitId(data.kits[0].id);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch public kits:', error);
        setIsLoading(false);
      });

    return () => {
      const existingScript = document.querySelector('script[src="/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const testEmbed = () => {
    console.log('testEmbed called');
    console.log('selectedKitId:', selectedKitId);
    console.log('window.KittieEmbed:', window.KittieEmbed);
    
    if (!selectedKitId) {
      alert('Please select a kit first');
      return;
    }
    
    if (!window.KittieEmbed) {
      alert('KittieEmbed not loaded yet. Please wait a moment and try again.');
      return;
    }
    
    try {
      window.KittieEmbed.open(selectedKitId);
      console.log('KittieEmbed.open called successfully');
    } catch (error) {
      console.error('Error calling KittieEmbed.open:', error);
      alert('Error opening embed: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  const debugDatabase = async () => {
    try {
      const response = await fetch('/api/debug/database');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Database debug failed:', error);
    }
  };

  const debugClientSide = async () => {
    try {
      // First, let's test if we can access the dashboard
      console.log('Testing dashboard access...');
      try {
        const dashboardResponse = await fetch('/dashboard');
        console.log('Dashboard response status:', dashboardResponse.status);
      } catch (error) {
        console.log('Dashboard access error:', error);
      }

      // Use client-side Supabase to check authentication and data
      const { sbBrowser } = await import('@/lib/supabase/browser');
      const supabase = sbBrowser();
      
      // Check session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session debug:', { session, sessionError });
      
      // Check auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('User debug:', { user, authError });
      
      // Check kits table
      const { data: kits, error: kitsError } = await supabase
        .from('kits')
        .select('id, name, is_public, slug, brand_slug, status, created_at, updated_at, owner_id')
        .order('updated_at', { ascending: false })
        .limit(10);
      
      // Check media_kits table
      const { data: mediaKits, error: mediaKitsError } = await supabase
        .from('media_kits')
        .select('id, name, is_public, public_id, created_at, updated_at, owner_id')
        .order('updated_at', { ascending: false })
        .limit(10);

      setDebugInfo({
        auth: {
          user: user ? { id: user.id, email: user.email } : null,
          error: authError?.message,
          session: session ? { 
            access_token: session.access_token ? 'present' : 'missing',
            refresh_token: session.refresh_token ? 'present' : 'missing',
            expires_at: session.expires_at
          } : null,
          sessionError: sessionError?.message
        },
        kits: {
          data: kits,
          error: kitsError?.message
        },
        mediaKits: {
          data: mediaKits,
          error: mediaKitsError?.message
        },
        publicKitsCount: kits?.filter(k => k.is_public).length || 0,
        publicMediaKitsCount: mediaKits?.filter(k => k.is_public).length || 0,
        totalKitsCount: kits?.length || 0,
        totalMediaKitsCount: mediaKits?.length || 0,
        source: 'client-side'
      });
    } catch (error) {
      console.error('Client-side debug failed:', error);
      setDebugInfo({
        error: 'Client-side debug failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Embed Debug Page</h1>
      
      {/* Status indicators */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <div className="space-y-1 text-sm">
          <div>Script Loaded: {isScriptLoaded ? '✅ Yes' : '❌ No'}</div>
          <div>Data Loaded: {isLoading ? '⏳ Loading...' : '✅ Yes'}</div>
          <div>Public Kits: {publicKits.length}</div>
          <div>Selected Kit: {selectedKitId || 'None'}</div>
        </div>
      </div>
      
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
                disabled={isLoading || !isScriptLoaded || !selectedKitId}
                className={`px-4 py-2 rounded ${
                  isLoading || !isScriptLoaded || !selectedKitId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Loading...' : 
                 !isScriptLoaded ? 'Script Loading...' :
                 !selectedKitId ? 'Select Kit First' :
                 'Test Embed Modal'}
              </button>
              
              <button 
                onClick={debugKit}
                disabled={!selectedKitId}
                className={`px-4 py-2 rounded ${
                  !selectedKitId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Debug Kit Data
              </button>
              
              <button 
                onClick={debugDatabase}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Debug Database (Server)
              </button>
              
              <button 
                onClick={debugClientSide}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Debug Database (Client)
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
