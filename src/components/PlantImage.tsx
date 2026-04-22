import React, { useState, useEffect } from 'react';

interface PlantImageProps {
  latinName: string;
  hungarianName: string;
}

const PlantImage: React.FC<PlantImageProps> = ({ latinName, hungarianName }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAuthenticImage = async () => {
      setLoading(true);
      setError(false);
      setImageUrl(null);
      
      const sources = [
        // 1. Angol Wikipedia (legnagyobb esély a pontos taxonómiai képre)
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(latinName)}&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`,
        // 2. Magyar Wikipedia (ha az angol nem adna eredményt)
        `https://hu.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(latinName)}&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`
      ];

      try {
        // Kipróbáljuk a Wikipedia forrásokat
        for (const url of sources) {
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

        // 3. Ha a Wikipedia nem adott direkt képet, keresünk a Wikimedia Commons tárhelyen
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

        // Ha semmi sem sikerült
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

    fetchAuthenticImage();

    return () => { isMounted = false; };
  }, [latinName]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center border border-slate-200">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
          <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-green-800 text-sm font-bold tracking-wide animate-pulse uppercase">Hiteles fotó keresése...</p>
        </div>
      )}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={hungarianName}
          className={`w-full h-full object-cover transition-all duration-1000 ${loading ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      ) : !loading && error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 text-green-900/30 p-8 text-center">
          <div className="text-6xl mb-4 opacity-20">🌿</div>
          <p className="text-lg font-black uppercase tracking-tighter opacity-40">{hungarianName}</p>
          <p className="text-xs italic mt-2 opacity-30">A fotó jelenleg nem elérhető a hiteles forrásokban.</p>
        </div>
      ) : null}

      {/* Forrás jelzése (Szuptilis, prémium érzetet ad) */}
      {!loading && imageUrl && (
        <div className="absolute bottom-3 right-3 bg-black/20 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-md opacity-50 hover:opacity-100 transition-opacity">
          Wikimedia Commons / Wikipedia
        </div>
      )}
    </div>
  );
};

export default PlantImage;
