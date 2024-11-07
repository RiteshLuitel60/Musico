import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

// Component to display top charts
const TopCharts = () => {
  // Fetch top charts data
  const { data, isFetching, error } = useGetTopChartsQuery();
  // Get current playing state from Redux store
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Show loader while fetching data
  if (isFetching) return <Loader title="Loading Top Charts" />;

  // Show error component if there's an error
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      {/* Page title */}
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Discover Top Charts</h2>

      {/* Grid of song cards */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-[95%] md:max-w-[90%]">
        {data.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCharts;