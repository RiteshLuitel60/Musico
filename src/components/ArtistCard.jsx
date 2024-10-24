import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ track }) => {
  const navigate = useNavigate();

  // Get artist ID
  const artistId = track?.relationships?.artists?.data[0]?.id;

  // Get cover art URL
  const coverArt = track?.attributes?.artwork?.url;

  // Format cover art URL with specific dimensions
  const formattedCoverArt = coverArt?.replace('{w}', '200').replace('{h}', '200');

  // Get artist name
  const artistName = track?.attributes?.artistName?.split(' ')[0] || '';

  return (
    <div
      className="flex flex-col w-full sm:w-[66px] p-3 bg-opacity-80 backdrop-blur-sm rounded-lg cursor-pointer"
      style={{ width: '26%' }}
      onClick={() => navigate(`/artists/${artistId}`)}
    >
      <img 
        alt="song_img" 
        src={formattedCoverArt} 
        className="w-full h-45 rounded-full transform transition-transform duration-200 hover:scale-105" 
      />
      <p className="mt-3 font-semibold text-white text-center text-[8px] xs:text-[10px] sm:text-xs md:text-sm leading-tight truncate overflow-hidden">
      {track?.attributes?.artistName}
      </p>
    </div>
  );
};

export default ArtistCard;