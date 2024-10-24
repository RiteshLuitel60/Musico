import React from 'react';

import { ArtistCard, Error, Loader } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

// Component to display top artists
const TopArtists = () => {
  // Fetch top charts data
  const { data, isFetching, error } = useGetTopChartsQuery();

  // Show loader while fetching data
  if (isFetching) return <Loader title="Loading artists..." />;

  // Show error component if there's an error
  if (error) return <Error />;

  return (
    <div className="flex flex-col ml-10">
      {/* Page title */}
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top artists</h2>

      {/* Grid of artist cards */}
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((track) => <ArtistCard key={track.id} track={track} />)}
      </div>
    </div>
  );
};

export default TopArtists;