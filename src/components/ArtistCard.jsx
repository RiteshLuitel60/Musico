import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ track }) => {
  const navigate = useNavigate();

  // Extract the artist ID from the relationships
  const artistId = track?.relationships?.artists?.data[0]?.id;

  // Extract the cover art URL
  const coverArt = track?.attributes?.artwork?.url;

  // Replace width and height in the URL with desired dimensions
  const formattedCoverArt = coverArt?.replace('{w}', '250').replace('{h}', '250');

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() => navigate(`/artists/${artistId}`)}
    >
      {/* phse */}
      <img 
        alt="song_img" 
        src={formattedCoverArt} 
        className="w-full h-56 rounded-lg" 
      />
      <p className="mt-4 font-semibold text-lg text-white truncate">
        {track?.attributes?.artistName}
      </p>
    </div>
  );
};

export default ArtistCard;