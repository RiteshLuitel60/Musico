import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => {
  const getArtwork = () => {
    const songInfo = activeSong?.resources?.['shazam-songs'] && Object.values(activeSong.resources['shazam-songs'])[0]?.attributes;
    const coverArt = songInfo?.artwork?.url;


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

  const getTitle = () => {

    const songInfo = activeSong?.resources?.['shazam-songs'] && Object.values(activeSong.resources['shazam-songs'])[0]?.attributes;
    const songName = songInfo?.title;
    return activeSong?.attributes?.name || activeSong?.title || songName || 'No active Song';
  };

  const getArtist = () => {
    const songInfo = activeSong?.resources?.['shazam-songs'] && Object.values(activeSong.resources['shazam-songs'])[0]?.attributes;
    const artistName = songInfo?.primaryArtist;

    return activeSong?.attributes?.artistName || activeSong?.subtitle ||activeSong?.artist || artistName ||  'No Artist name';
  };

  return (
    <div className="flex-1 flex items-center justify-start">
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={getArtwork()} alt="cover art" className="rounded-full" />
      </div>
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

export default Track;