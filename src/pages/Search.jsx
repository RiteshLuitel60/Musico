import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery } from '../redux/services/shazamCore';

const Search = () => {
  // Get the search term from URL parameters
  const { searchTerm } = useParams();
  // Get the current playing state from Redux store
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  // Fetch search results using the custom hook
  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);

  // Extract songs from the API response
  const songs = data?.tracks?.hits?.map((hit) => hit.track) || []; 

  // Show loading state while fetching data
  if (isFetching) return <Loader title={`Searching ${searchTerm}...`} />;

  // Show error state if there's an error
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-[95%] md:max-w-[90%]">
        {songs.slice(0,24).map((song, i) => (
          <SongCard
            key={song?.key || i}  
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}  
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
