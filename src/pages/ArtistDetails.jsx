import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import { useGetArtistDetailsQuery } from '../redux/services/shazamCore';

// Extract artist data from API response
const getArtistData = (data) => {
  if (data?.data && Array.isArray(data.data)) {
    return data.data[0];
  }
  return data;
};

// Get top songs from artist data
const getTopSongs = (artistData) => {
  if (artistData?.views?.['top-songs']?.data) {
    return artistData.views['top-songs'].data;
  }
  if (artistData?.songs) {
    return Object.values(artistData.songs);
  }
  return [];
};

const ArtistDetails = () => {
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: rawArtistData, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery(artistId);

  // Show loading state
  if (isFetchingArtistDetails) return <Loader title="Loading artist details..." />;

  // Show error state
  if (error) return <Error />;

  const artistData = getArtistData(rawArtistData);
  const topSongs = getTopSongs(artistData);

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={artistId}
        artistData={artistData}
      />

      <RelatedSongs
        data={topSongs}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetails;