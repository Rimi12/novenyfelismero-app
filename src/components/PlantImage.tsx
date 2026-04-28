import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PlantImageProps {
  latinName: string;
  hungarianName: string;
  source: 'wiki' | 'local';
}

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const PlantImage: React.FC<PlantImageProps> = ({ latinName, hungarianName, source }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setLoading(true);
      setError(false);
      setImageUrl(null);
      setIsLocal(false);
      
      // 1. Megpróbáljuk a helyi fotót, ha local módban vagyunk
      if (source === 'local') {
        const localUrl = `/plants/${normalizeName(hungarianName)}.jpg`;
        try {
          const response = await fetch(localUrl, { method: 'HEAD' });
          if (response.ok && isMounted) {
            setImageUrl(localUrl);
            setIsLocal(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Helyi kép nem található, fallback a Wikipédiára...");
        }
      }

      // 2. Wikipedia / Wikimedia források
      const wikiSources = [
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(latinName)}&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`,
        `https://hu.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(latinName)}&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`
      ];

      try {
        for (const url of wikiSources) {
          const response = await fetch(url);
          const data = await response.json();
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          const thumbnail = pages[pageId]?.thumbnail;

          if (thumbnail && thumbnail.source && isMounted) {
            setImageUrl(thumbnail.source);
            return;
          }
        }

        const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(latinName)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
        const commonsResponse = await fetch(commonsUrl);
        const commonsData = await commonsResponse.json();
        
        if (commonsData.query && commonsData.query.pages) {
          const pages = commonsData.query.pages;
          const firstPageId = Object.keys(pages)[0];
          const imageInfo = pages[firstPageId].imageinfo?.[0];
          
          if (imageInfo && imageInfo.url && isMounted) {
            setImageUrl(imageInfo.url);
            return;
          }
        }

        if (isMounted) {
          setLoading(false);
          setError(true);
        }
      } catch (err) {
        console.error("Image API error:", err);
        if (isMounted) {
          setLoading(false);
          setError(true);
        }
      }
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [latinName, hungarianName, source]);

  return (
    <>
      <div className="relative w-full h-full min-h-[150px] aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center border border-slate-200">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-green-800 text-sm font-bold tracking-wide animate-pulse uppercase">Kép betöltése...</p>
          </div>
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hungarianName}
            className={`w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-700 ${loading ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onClick={() => setIsZoomed(true)}
            title="Nagyításhoz kattints a képre"
          />
        ) : !loading && error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 text-green-900/30 p-8 text-center">
            <div className="text-6xl mb-4 opacity-20">🌿</div>
            <p className="text-lg font-black uppercase tracking-tighter opacity-40">{hungarianName}</p>
            <p className="text-xs italic mt-2 opacity-30">A fotó jelenleg nem elérhető.</p>
          </div>
        ) : null}

        {!loading && imageUrl && (
          <div className="absolute bottom-3 right-3 bg-black/20 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-md opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            {isLocal ? 'Saját fotó' : 'Wikipedia / Commons'}
          </div>
        )}
      </div>

      {/* Zoom Modal (React Portal segítségével, hogy mindig legfelül legyen) */}
      {isZoomed && imageUrl && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute top-6 right-6 bg-white/10 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors cursor-pointer backdrop-blur-md text-xl">
            ✕
          </div>
          
          <img 
            src={imageUrl} 
            alt={hungarianName} 
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
          
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <div className="inline-block bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl">
              <h3 className="text-white text-2xl font-black tracking-wide">{hungarianName}</h3>
              <p className="text-white/70 italic mt-1">{latinName}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PlantImage;

