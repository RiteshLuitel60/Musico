import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCardForIdentify = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const [lyricsOn, setLyricsOn] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 400 });
  const cardRef = useRef(null);

  const {
    title,
    subtitle,
    images,
    key,
    artists,
    hub,
  } = song || {};

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        setSize(prevSize => ({
          width: Math.min(prevSize.width, maxWidth),
          height: Math.min(prevSize.height, maxHeight),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const handleCloseClick = () => {
    setIsVisible(false);
  };

  const handleLyricsToggle = () => {
    setLyricsOn(!lyricsOn);
  };

  const handleResize = (e, direction, ref, delta) => {
    const { width, height } = ref.style;
    setSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  if (!isVisible) return null;

  return (
    <Draggable handle=".handle">
      <div
        ref={cardRef}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white rounded-lg overflow-hidden shadow-lg cursor-move"
        style={{ width: `${size.width}px`, height: `${size.height}px`, maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <div className="handle absolute top-0 left-0 right-0 h-8 bg-gray-800 cursor-move"></div>
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleCloseClick}
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 mt-8 overflow-y-auto" style={{ height: 'calc(100% - 32px)' }}>
          <div className="flex items-center">
            <img src={images?.coverart} alt={title} className="w-16 h-16 object-cover rounded-lg mr-4" />
            <div>
              <Link to={`/songs/${key}`}>
                <h3 className="text-xl font-bold text-white hover:underline">{title}</h3>
              </Link>
              <Link to={`/artists/${artists?.[0]?.adamid}`}>
                <p className="text-gray-300 hover:underline">{subtitle}</p>
              </Link>
            </div>
          </div>
          
          <div className="mt-4">
            <a
              href={hub?.actions?.find(action => action.type === "applemusicplay")?.uri || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-black text-center py-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              Listen on Apple Music
            </a>
          </div>

          <button 
            onClick={handleLyricsToggle}
            className="mt-4 w-full border border-white text-white py-2 rounded-full hover:bg-white hover:text-black transition-colors duration-200"
          >
            {lyricsOn ? 'TURN LYRICS OFF' : 'TURN LYRICS ON'}
          </button>

          {lyricsOn && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-300">
                Lyrics will be displayed here when available.
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900">
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default SongCardForIdentify;