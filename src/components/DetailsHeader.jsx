import React from 'react';
import { Link } from 'react-router-dom';

// DetailsHeader component for displaying artist or song information
const DetailsHeader = ({ artistId, artistData, songData }) => {
  // Get artist ID from song data
  const artistIdDynamic = songData?.resources?.['shazam-songs']?.[songData?.data?.[0]?.id]?.relationships?.artists?.data?.[0]?.id;

  // Get song details based on key
  const getSongDetails = (key) =>
    songData?.resources?.['shazam-songs']?.[songData?.data?.[0]?.id]?.attributes?.[key];

  // Get genre name based on artist or song data
  const getGenreName = () => {
    if (artistId) {
      return artistData?.attributes?.genreNames?.[0] || 'Unknown';
    } else {
      return (
        getSongDetails('genres')?.primary ||
        songData?.genres?.primary ||
        'Unknown'
      );
    }
  };

  // Get image URL for artist or song
  const getImageURL = () => {
    if (artistId) {
      return artistData?.attributes?.artwork?.url?.replace('{w}', '500').replace('{h}', '500');
    } else {
      return (
        getSongDetails('artwork')?.url ||
        songData?.images?.coverart ||
        '/fallback-image.jpg'
      );
    }
  };

  // Get title or artist name
  const getTitleOrName = () => {
    return (
      artistId
        ? artistData?.attributes?.name
        : getSongDetails('title') ||
          songData?.title ||
          'Unknown'
    );
  };

  // Get the artist link if artistId is not present
  const getArtistLink = () => {
    if (!artistId) {
      return (
        <Link to={`/artists/${artistIdDynamic || songData?.artists?.[0]?.adamid}`}>
          <p className="text-base text-white mt-2">
            {getSongDetails('artist') ||
            songData?.subtitle || 'Unknown Artist'}
          </p>
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />

      <div className="absolute inset-0 flex items-center">
        <img
          alt="profile"
          src={getImageURL()}
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />

        <div className="ml-5">
          <p className="font-bold sm:text-3xl text-xl text-white">
            {getTitleOrName()}
          </p>

          {getArtistLink() }
          <p className="text-base text-white mt-2">
            {getGenreName()}
          </p>
        </div>
      </div>

      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};

export default DetailsHeader;
