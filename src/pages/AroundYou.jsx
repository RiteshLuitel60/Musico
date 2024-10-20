import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';
import { fetchUserLibraries, handleAddToLibrary, handleCreateLibrary } from '../utils/libraryUtils';

const CountryTracks = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);

  useEffect(() => {
    axios
      .get(`https://geo.ipify.org/api/v2/country?apiKey=at_LEgxHner0pvrET6vpgwsNXoJwsHh5`)
      .then((res) => setCountry(res?.data?.location.country))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [country]);

  useEffect(() => {
    const loadLibraries = async () => {
      const result = await fetchUserLibraries();
      if (result.success) {
        setLibraries(result.libraries);
      }
    };
    loadLibraries();
  }, []);

  const handleAddToLibraryClick = async (libraryId, song) => {
    const result = await handleAddToLibrary(libraryId, song);
    if (result.success) {
      const updatedLibraries = await fetchUserLibraries();
      if (updatedLibraries.success) {
        setLibraries(updatedLibraries.libraries);
      }
    }
  };

  const handleCreateLibraryClick = async (song) => {
    const result = await handleCreateLibrary(song);
    if (result.success) {
      setLibraries([...libraries, result.library]);
    }
  };

  if (isFetching || loading) return <Loader title="Loading Songs around you..." />;

  if (error && country !== '') return <Error />;

  return (  
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Around You </h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song, i) => (
          <SongCard
            key={song.key || song.id || `song-${i}`}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
            libraries={libraries}
            setLibraries={setLibraries}
            onAddToLibrary={handleAddToLibraryClick}
            onCreateLibrary={handleCreateLibraryClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CountryTracks;