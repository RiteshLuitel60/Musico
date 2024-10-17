import React, { useState, useEffect, useRef } from 'react';
import { Plus, FolderPlus, MoreHorizontal } from 'lucide-react';
import { fetchUserLibraries, handleAddToLibrary, handleCreateLibrary } from '../utils/libraryUtils';
import { Trash2 } from 'lucide-react';
import Notification from './Notification';

const SongOptions = ({ song, currentLibraryId, onRemoveFromLibrary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLibraries, setShowLibraries] = useState(false);
  const [libraries, setLibraries] = useState([]);
  const [addedToLibraries, setAddedToLibraries] = useState({});
  const [isLoadingLibraries, setIsLoadingLibraries] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const menuRef = useRef(null);

  useEffect(() => {
    loadLibraries();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadLibraries = async () => {
    setIsLoadingLibraries(true);
    const result = await fetchUserLibraries();
    if (result.success) {
      setLibraries(result.libraries);
    }
    setIsLoadingLibraries(false);
  };

  const handleAddToLibraryClick = async (libraryId) => {
    setAddedToLibraries(prev => ({ ...prev, [libraryId]: true }));
    const result = await handleAddToLibrary(libraryId, song);
    if (!result.success) {
      setAddedToLibraries(prev => ({ ...prev, [libraryId]: false }));
      if (result.error.code === '23505') {
        setNotificationMessage('Song already exists in the library');
      } else {
        setNotificationMessage(result.error.message || 'Failed to add song to library.');
      }
      setShowNotification(true);
    }
  };

  const handleCreateLibraryClick = async () => {
    const result = await handleCreateLibrary(song);
    if (result.success) {
      await loadLibraries();
      setIsOpen(false);
    } else {
      alert(result.error.message || 'Failed to create library.');
    }
  };

  const handleShowLibraries = async () => {
    setShowLibraries(!showLibraries);
    if (!showLibraries) {
      await loadLibraries();
    }
  };

  const handleRemoveFromLibrary = () => {
    onRemoveFromLibrary(song.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full hover:text-white/80 transition-all duration-200 ease-in-out "
      >
        <MoreHorizontal size={16} color="#FFFFFF" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-[-20px] mb-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-lg z-50">
          {currentLibraryId && (
            <button 
              onClick={handleRemoveFromLibrary} 
              className="w-full text-left px-4 py-2 flex items-center text-gray-400 font-bold hover:text-red-400 transition-colors duration-200"
            >
              <Trash2 size={12} className="mr-1" color="#FFFFFF" />
              <span className="text-xs ">Remove From Playlist</span>
            </button>
          )}
          <button onClick={handleCreateLibraryClick} className="w-full text-left px-4 py-2 flex items-center transition-colors duration-200">
            <Plus size={12} className="mr-1" color="#FFFFFF" /> <span className="text-sm text-gray-400 hover:text-white">Create Playlist</span>
          </button>
          <button 
            onClick={handleShowLibraries} 
            className="w-full text-left px-4 py-2 flex items-center transition-colors duration-200"
          >
            <FolderPlus size={12} className="mr-0.5" color="#FFFFFF" /> 
            <span className="text-sm pl-1 text-gray-400 hover:text-white">
              {isLoadingLibraries ? 'Loading...' : 'Add To Playlist'}
            </span>
          </button>
          {showLibraries && libraries.length > 0 && (
            <div className="ml-4">
              {libraries.map((library) => (
                <button 
                  key={library.id} 
                  onClick={() => handleAddToLibraryClick(library.id)} 
                  className={`w-full text-left px-4 py-2 transition-colors duration-300 library-button ${addedToLibraries[library.id] ? 'text-green-400' : 'text-gray-400'} hover:text-white transition-transform duration-200`}
                >
                  <span className="font-bold text-xs">{library.name}</span>
                  {addedToLibraries[library.id] && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <Notification
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default SongOptions;
