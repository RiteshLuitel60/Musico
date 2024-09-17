import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus, MoreHorizontal } from 'lucide-react';
import { fetchUserLibraries, handleAddToLibrary, handleCreateLibrary } from '../utils/libraryUtils';

const SongOptions = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLibraries, setShowLibraries] = useState(false);
  const [libraries, setLibraries] = useState([]);
  const [addedToLibraries, setAddedToLibraries] = useState({});
  const [isLoadingLibraries, setIsLoadingLibraries] = useState(false);

  useEffect(() => {
    const cachedLibraries = localStorage.getItem('userLibraries');
    if (cachedLibraries) {
      setLibraries(JSON.parse(cachedLibraries));
    } else {
      loadLibraries();
    }
  }, []);

  const loadLibraries = async () => {
    setIsLoadingLibraries(true);
    const result = await fetchUserLibraries();
    if (result.success) {
      setLibraries(result.libraries);
      localStorage.setItem('userLibraries', JSON.stringify(result.libraries));
    }
    setIsLoadingLibraries(false);
  };

  const handleAddToLibraryClick = async (libraryId) => {
    setAddedToLibraries(prev => ({ ...prev, [libraryId]: true })); // Set state immediately
    const result = await handleAddToLibrary(libraryId, song);
    if (result.success) {
      // Optionally show a success message
    } else {
      // Show an error message
      alert(result.error.message || 'Failed to add song to library.');
      setAddedToLibraries(prev => ({ ...prev, [libraryId]: false })); // Revert state on error
    }
  };

  const handleCreateLibraryClick = async () => {
    const result = await handleCreateLibrary(song);
    if (result.success) {
      setLibraries([...libraries, result.library]);
      setIsOpen(false);
      // Optionally show a success message
    } else {
      // Show an error message
      alert(result.error.message || 'Failed to create library.');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 ease-in-out"
      >
        <MoreHorizontal size={20} color="white" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-200 rounded-md shadow-lg z-20">
          <button onClick={handleCreateLibraryClick} className="w-full text-left px-4 py-2 hover:bg-gray-400 flex items-center">
            <Plus size={12} className="mr-1" /> <span className="text-sm">Create New Library</span>
          </button>
          <button 
            onClick={() => setShowLibraries(!showLibraries)} 
            className="w-full text-left px-4 py-2 hover:bg-gray-300 flex items-center"
          >
            <FolderPlus size={12} className="mr-0.5" /> 
            <span className="text-sm">
              {isLoadingLibraries ? 'Loading...' : 'Add to Existing Library'}
            </span>
          </button>
          {showLibraries && libraries.length > 0 && (
            <div className="ml-4 border-l border-gray-200">
              {libraries.map((library) => (
                <button 
                  key={library.id} 
                  onClick={() => handleAddToLibraryClick(library.id)} 
                  className={`w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors duration-300 library-button ${addedToLibraries[library.id] ? 'bg-green-500 text-white' : ''}`}
                >
                  {library.name}
                  {addedToLibraries[library.id] && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongOptions;