import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { fetchUserLibraries, fetchLibrarySongs, handleAddToLibrary, handleCreateLibrary } from '../utils/libraryUtils';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Library = () => {
  const dispatch = useDispatch();
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [librarySongs, setLibrarySongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        setIsLoading(true);
        const result = await fetchUserLibraries();
        if (result.success) {
          setLibraries(result.libraries);
        } else {
          throw new Error(result.error || 'Failed to fetch libraries');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadLibraries();
  }, []);

  const handleSelectLibrary = async (library) => {
    try {
      setSelectedLibrary(library);
      const result = await fetchLibrarySongs(library.id);
      if (result.success) {
        setLibrarySongs(result.songs);
      } else {
        throw new Error(result.error || 'Failed to fetch library songs');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: librarySongs, i }));
    dispatch(playPause(true));
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handleAddLibrary = async () => {
    const name = prompt("Enter a name for the new library:");
    if (!name) return;

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('libraries')
        .insert({ name, user_id: user.id })
        .select();

      if (error) throw error;

      const newLibrary = data[0];
      setLibraries([...libraries, newLibrary]);
    } catch (error) {
      console.error('Error creating library:', error);
      setError(error.message);
    }
  };

  const handleRenameLibrary = async (libraryId) => {
    const newName = prompt("Enter a new name for the library:");
    if (!newName) return;

    try {
      const { error } = await supabase
        .from('libraries')
        .update({ name: newName })
        .eq('id', libraryId);

      if (error) throw error;

      setLibraries(libraries.map(lib => 
        lib.id === libraryId ? { ...lib, name: newName } : lib
      ));
    } catch (error) {
      console.error('Error renaming library:', error);
      setError(error.message);
    }
  };

  const handleDeleteLibrary = async (libraryId) => {
    if (window.confirm("Are you sure you want to delete this library?")) {
      try {
        const { error } = await supabase
          .from('libraries')
          .delete()
          .eq('id', libraryId);

        if (error) throw error;

        setLibraries(libraries.filter(lib => lib.id !== libraryId));
        if (selectedLibrary?.id === libraryId) {
          setSelectedLibrary(null);
          setLibrarySongs([]);
        }
      } catch (error) {
        console.error('Error deleting library:', error);
        setError(error.message);
      }
    }
  };

  if (isLoading) return <Loader title="Loading libraries..." />;
  if (error) return <Error message={error} />;

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
              onClick={() => handleSelectLibrary(library)}
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
            setLibraries={setLibraries}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;