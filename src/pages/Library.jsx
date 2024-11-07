// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { fetchUserLibraries, fetchLibrarySongs, handleAddToLibrary, handleCreateLibrary } from '../utils/libraryUtils';
import { Plus, Edit2, Trash2, MoreVertical, Heart, Pen } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Library = () => {
  // Set up state variables and Redux hooks
  const dispatch = useDispatch();
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [librarySongs, setLibrarySongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');

  // Fetch user libraries on component mount
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        setIsLoading(true);
        const result = await fetchUserLibraries();
        if (result.success) {
          // Ensure 'Liked Songs' is always first in the list
          const sortedLibraries = result.libraries.sort((a, b) => {
            if (a.name === 'Liked Songs') return -1;
            if (b.name === 'Liked Songs') return 1;
            return 0;
          });
          setLibraries(sortedLibraries);
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

  // Handle library selection and fetch its songs
  const handleSelectLibrary = async (library) => {
    try {
      setSelectedLibrary(library);
      if (library.name !== 'Liked Songs') {
        // Fetch library description for non-Liked Songs libraries
        const { data, error } = await supabase
          .from('libraries')
          .select('playlist_description')
          .eq('id', library.id)
          .single();
        
        if (error) throw error;
        setDescription(data.playlist_description || '');
      } else {
        setDescription('');
      }
      // Fetch songs for the selected library
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

  // Handle play button click
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: librarySongs, i }));
    dispatch(playPause(true));
  };

  // Handle pause button click
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  // Handle adding a new library
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

  // Handle renaming a library
  const handleRenameLibrary = async (libraryId) => {
    const newName = prompt("Enter a new name:");
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
      if (selectedLibrary?.id === libraryId) {
        setSelectedLibrary({ ...selectedLibrary, name: newName });
      }
    } catch (error) {
      console.error('Error renaming library:', error);
      setError(error.message);
    }
  };

  // Handle deleting a library
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

  // Handle removing a song from the library
  const handleRemoveFromLibrary = async (songId) => {
    try {
      const { error } = await supabase
        .from('library_songs')
        .delete()
        .eq('id', songId)
        .eq('library_id', selectedLibrary.id);

      if (error) throw error;

      setLibrarySongs(librarySongs.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Error removing song from library:', error);
      setError(error.message);
    }
  };

  // Toggle the library options menu
  const toggleMenu = (libraryId) => {
    setOpenMenuId(openMenuId === libraryId ? null : libraryId);
  };

  // Handle editing the library description
  const handleEditDescription = () => {
    setTempDescription(description);
    setIsEditingDescription(true);
  };

  // Handle saving the edited library description
  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from('libraries')
        .update({ playlist_description: tempDescription })
        .eq('id', selectedLibrary.id);

      if (error) throw error;

      setDescription(tempDescription);
      setIsEditingDescription(false);
      setSelectedLibrary({ ...selectedLibrary, playlist_description: tempDescription });
    } catch (error) {
      console.error('Error saving description:', error);
      setError(error.message);
    }
  };

  // Handle canceling the description edit
  const handleCancelEditDescription = () => {
    setIsEditingDescription(false);
    setTempDescription(description);
  };

  // Show loading or error states if necessary
  if (isLoading) return <Loader title="Loading libraries..." />;
  if (error) return <Error message={error} />;

  // Render the Library component
  return (
    <div className="flex flex-col">
      {/* Header with "Your Libraries" title and Add Library button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-3xl text-white">Your Libraries</h2>
        <button
          onClick={handleAddLibrary}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
        >
          <Plus size={24} />
        </button>
      </div>
      {/* List of libraries */}
      <div className="flex mb-4 flex-wrap">
        {libraries.map((library) => (
          <div key={library.id} className="mr-2 mb-2 relative">
            <div
              onClick={() => handleSelectLibrary(library)}
              className={`w-48 h-12 px-4 py-1 rounded flex items-center justify-between ${
                selectedLibrary?.id === library.id
                  ? 'bg-gray-900 text-white'
                  : library.name === 'Liked Songs'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-900 text-white'
              } hover:bg-gray-800 transition-colors duration-200 cursor-pointer`}
            >
              <span className="font-semibold text-sm truncate mr-2 ">
                {library.name === 'Liked Songs' && <Heart size={16} fill="white" strokeWidth={0} className="inline mr-2" />}
                {library.name}
              </span>
              {library.name !== 'Liked Songs' && (
                <div onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(library.id);
                }}>
                  <div
                    className="p-1 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <MoreVertical size={16} color="white" />
                  </div>
                  {openMenuId === library.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-gray-800 rounded shadow-lg z-50">
                      <div
                        onClick={() => handleRenameLibrary(library.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        Rename
                      </div>
                      <div
                        onClick={() => handleDeleteLibrary(library.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Selected library details */}
      {selectedLibrary && (
        <div className="mb-4">
          <h3 className="font-bold text-2xl text-white">{selectedLibrary.name}</h3>
          {selectedLibrary.name !== 'Liked Songs' && (
            isEditingDescription ? (
              <div className="mt-2">
                <textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded"
                  rows="3"
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEditDescription}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center">
                <p className="text-slate-200 mr-2 cursor-default">
                  {description || 'Add description'}
                </p>
                <button
                  onClick={handleEditDescription}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                  title="Edit description"
                >
                  <Pen size={16} />
                </button>
              </div>
            )
          )}
        </div>
      )}
      {/* List of songs in the selected library */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-[95%] md:max-w-[90%]">
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
            currentLibraryId={selectedLibrary?.id}
            onRemoveFromLibrary={handleRemoveFromLibrary}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;