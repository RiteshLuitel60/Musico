import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Error, Loader, SongCard } from '../components';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useGetSongDetailsQuery } from '../redux/services/shazamCore';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const Library = () => {
  const dispatch = useDispatch();
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [librarySongs, setLibrarySongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
      } else {
        // Ensure "Liked Songs" is always first
        const likedSongs = data.find(lib => lib.name === 'Liked Songs');
        const otherLibraries = data.filter(lib => lib.name !== 'Liked Songs');
        setLibraries([likedSongs, ...otherLibraries].filter(Boolean));
        if (data.length > 0) {
          setSelectedLibrary(likedSongs || data[0]);
          fetchLibrarySongs(likedSongs?.id || data[0].id);
        }
      }
    }
    setIsLoading(false);
  };

  const fetchLibrarySongs = async (libraryId) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('library_songs')
      .select('song_key')  // Change 'song_id' to 'song_key' if that's the correct column name
      .eq('library_id', libraryId);

    if (error) {
      setError(error.message);
    } else {
      const songDetails = await Promise.all(data.map(song => fetchSongDetails(song.song_key)));
      setLibrarySongs(songDetails.filter(Boolean));
    }
    setIsLoading(false);
  };

  const fetchSongDetails = async (songId) => {
    const url = `https://shazam-core.p.rapidapi.com/v1/tracks/details?track_id=${songId}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'fec4224f99mshbf530c7f64c4359p1a192bjsnb3fbf34b7aa1',
        'x-rapidapi-host': 'shazam-core.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error fetching song details for id ${songId}:`, error);
      return null;
    }
  };

  const handleAddLibrary = async () => {
    const name = prompt("Enter a name for the new library:");
    if (name) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('libraries')
        .insert({ name, user_id: user.id })
        .select();

      if (error) {
        setError(error.message);
      } else {
        setLibraries([...libraries, data[0]]);
      }
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (window.confirm("Are you sure you want to delete this library?")) {
      const { error } = await supabase
        .from('libraries')
        .delete()
        .eq('id', libraryId);

      if (error) {
        setError(error.message);
      } else {
        setLibraries(libraries.filter(lib => lib.id !== libraryId));
        if (selectedLibrary?.id === libraryId) {
          setSelectedLibrary(null);
          setLibrarySongs([]);
        }
      }
    }
  };

  const handleRenameLibrary = async (libraryId) => {
    const newName = prompt("Enter a new name for the library:");
    if (newName) {
      const { data, error } = await supabase
        .from('libraries')
        .update({ name: newName })
        .eq('id', libraryId)
        .select();

      if (error) {
        setError(error.message);
      } else {
        setLibraries(libraries.map(lib => lib.id === libraryId ? data[0] : lib));
        if (selectedLibrary?.id === libraryId) {
          setSelectedLibrary(data[0]);
        }
      }
    }
  };

  const handleRemoveSong = async (songKey) => {
    if (window.confirm("Are you sure you want to remove this song from the library?")) {
      const { error } = await supabase
        .from('library_songs')
        .delete()
        .eq('library_id', selectedLibrary.id)
        .eq('song_key', songKey);

      if (error) {
        setError(error.message);
      } else {
        setLibrarySongs(librarySongs.filter(song => song.key !== songKey));
      }
    }
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: librarySongs, i }));
    dispatch(playPause(true));
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handleAddToLibrary = async (libraryId, song) => {
    try {
      const { error } = await supabase
        .from('library_songs')
        .insert({ 
          library_id: libraryId, 
          song_key: song.key,  // Make sure this matches your database column name
          user_id: (await supabase.auth.getUser()).data.user.id  // Add user_id if required
        });

      if (error) throw error;

      // Refresh the library songs if the current library is the one we just added to
      if (selectedLibrary?.id === libraryId) {
        fetchLibrarySongs(libraryId);
      }
    } catch (error) {
      setError(`Failed to add song to library: ${error.message}`);
    }
  };

  const handleCreateLibrary = async (song) => {
    try {
      const name = prompt("Enter a name for the new library:");
      if (!name) return;

      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('libraries')
        .insert({ name, user_id: user.id })
        .select();

      if (error) throw error;

      const newLibrary = data[0];
      setLibraries([...libraries, newLibrary]);

      // Add the song to the newly created library
      await handleAddToLibrary(newLibrary.id, song);
    } catch (error) {
      setError(`Failed to create library: ${error.message}`);
    }
  };

  if (isLoading) return <Loader title="Loading libraries..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-3xl text-white">Your Libraries</h2>
        <button
          onClick={handleAddLibrary}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
        >
          <Plus size={24} />
        </button>
      </div>
      <div className="flex mb-4 flex-wrap">
        {libraries.map((library) => (
          <div key={library.id} className="mr-2 mb-2">
            <button
              onClick={() => {
                setSelectedLibrary(library);
                fetchLibrarySongs(library.id);
              }}
              className={`px-4 py-2 rounded ${
                selectedLibrary?.id === library.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {library.name}
            </button>
            {library.name !== 'Liked Songs' && (
              <div className="mt-1 flex justify-center">
                <button
                  onClick={() => handleRenameLibrary(library.id)}
                  className="mr-1 p-1 bg-blue-500 rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeleteLibrary(library.id)}
                  className="p-1 bg-red-500 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedLibrary && (
        <>
          <h3 className="font-bold text-2xl text-white mb-4">{selectedLibrary.name}</h3>
          <div className="flex flex-wrap sm:justify-start justify-center gap-8">
            {librarySongs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={librarySongs}
                i={i}
                libraries={libraries}
                onAddToLibrary={handleAddToLibrary}
                onCreateLibrary={handleCreateLibrary}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Library;