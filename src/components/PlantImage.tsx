import React, { useState } from 'react';

interface PlantImageProps {
  latinName: string;
  hungarianName: string;
}

const PlantImage: React.FC<PlantImageProps> = ({ latinName, hungarianName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // A kulcsszavakat a latin névből képezzük, vesszővel elválasztva a loremflickr számára
  const keywords = `${latinName.replace(/ /g, ',')},plant,flower`;
  const imageUrl = `https://loremflickr.com/800/600/${keywords}/all`;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-green-100 shadow-inner flex items-center justify-center">
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 z-10">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-green-700 font-medium animate-pulse">Kép betöltése...</p>
        </div>
      )}

      <img
        src={imageUrl}
        alt={hungarianName}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 text-center">
          <svg className="w-16 h-16 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Sajnos nem sikerült betölteni a képet: {hungarianName}</p>
        </div>
      )}
    </div>
  );
};

export default PlantImage;
