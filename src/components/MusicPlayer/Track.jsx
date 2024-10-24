// Import React library
import React from 'react';

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
    // Get song info from Shazam data
    const songName = songInfo?.title;
    return activeSong?.attributes?.name || activeSong?.title || songName || 'No active Song';
  };

  // Function to get artist name
  const getArtist = () => {
    // Get song info from Shazam data
    const artistName = songInfo?.primaryArtist;

    return activeSong?.attributes?.artistName || activeSong?.subtitle ||activeSong?.artist || artistName ||  'No Artist name';
  };

  // Render the Track component
  return (
    <div className="flex-1 flex items-center justify-start">
      {/* Album artwork */}
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={getArtwork()} alt="cover art" className="rounded-full" />
      </div>
      {/* Song and artist info */}
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">
          {getTitle()}
        </p>
        <p className="truncate text-gray-300">
          {getArtist()}
        </p>
      </div>
    </div>
  );
};

// Export the Track component
export default Track;