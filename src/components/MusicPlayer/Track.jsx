// Import React library and Link component
import React from 'react';
import { Link } from 'react-router-dom';

// Track component definition
const Track = ({ isPlaying, isActive, activeSong }) => {
  // Get song info from Shazam data
  const songInfo = activeSong?.resources?.['shazam-songs'] && Object.values(activeSong.resources['shazam-songs'])[0]?.attributes;
  
  // Function to get artwork URL
  const getArtwork = () => {
    const coverArt = songInfo?.artwork?.url;

    // Check different sources for artwork
    if (activeSong?.attributes?.artwork?.url) {
      return activeSong.attributes.artwork.url;
    } else if (activeSong?.images?.coverart) {
      return activeSong.images.coverart;
    } else if (activeSong?.cover_image) {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/songs/${activeSong.cover_image}`;
    } else if (activeSong?.cover_art) {
      return activeSong.cover_art;
    } else {
      return coverArt;
    }
  };

  // Function to get song title
  const getTitle = () => {
    const songName = songInfo?.title;
    return activeSong?.attributes?.name || activeSong?.title || songName || 'No active Song';
  };

  // Function to get artist name
  const getArtist = () => {
    const artistName = songInfo?.primaryArtist;
    return activeSong?.attributes?.artistName || activeSong?.subtitle || activeSong?.artist || artistName || 'No Artist name';
  };

  // Function to get song ID
  const getSongId = () => {
    return activeSong?.key || activeSong?.id || Object.keys(activeSong?.resources?.['shazam-songs'] || {})[0] || '';
  };

  // Function to get artist ID
  const getArtistId = () => {
    return activeSong?.relationships?.artists?.data[0]?.id || activeSong?.artists?.[0]?.adamid || '';
  };

  return (
    <div className="flex-1 flex items-center justify-start">
      {/* Album artwork */}
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={getArtwork()} alt="cover art" className="rounded-full" />
      </div>
      {/* Song and artist info */}
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">
          <Link to={`/songs/${getSongId()}`} className="hover:text-white/90">
            {getTitle()}
          </Link>
        </p>
        <p className="truncate text-gray-300">
          {getArtistId() ? (
            <Link to={`/artists/${getArtistId()}`} className="hover:text-white/90">
              {getArtist()}
            </Link>
          ) : (
            <span>{getArtist()}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Track;