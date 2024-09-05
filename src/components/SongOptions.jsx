import React, { useState } from 'react';
import { MoreHorizontal, Plus, FolderPlus } from 'lucide-react';

const SongOptions = ({ song, libraries = [], onAddToLibrary, onCreateLibrary, isPlaylist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLibraries, setShowLibraries] = useState(false);

  const handleCreateLibrary = () => {
    onCreateLibrary(song);
    setIsOpen(false);
  };

  const handleAddToLibrary = (libraryId) => {
    onAddToLibrary(libraryId, song);
    setIsOpen(false);
    setShowLibraries(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 ease-in-out"
      >
        <MoreHorizontal size={20} color="white" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
          {!isPlaylist && (
            <>
              <button onClick={handleCreateLibrary} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center">
                <Plus size={16} className="mr-2" /> Create New Library
              </button>
              <button 
                onClick={() => setShowLibraries(!showLibraries)} 
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center"
              >
                <FolderPlus size={16} className="mr-2" /> Add to Existing Library
              </button>
              {showLibraries && libraries.length > 0 && (
                <div className="ml-4 border-l border-gray-700">
                  {libraries.map((library) => (
                    <button 
                      key={library.id} 
                      onClick={() => handleAddToLibrary(library.id)} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      {library.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SongOptions;