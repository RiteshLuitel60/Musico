// Import necessary dependencies and components
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { motion, AnimatePresence } from 'framer-motion';

// SongCardForIdentify component
const SongCardForIdentify = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [size, setSize] = useState({ width: 250, height: 350 }); // Smaller size
  const nodeRef = useRef(null);

  // Destructure song properties
  const {
    title,
    subtitle,
    images,
    artists,
    hub,
  } = song || {};

  let key = song?.hub?.actions[0]?.id;

  const handlePauseClick = () => dispatch(playPause(false));
  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };
  
  const handleCloseClick = () => setIsVisible(false);

  // Format title to show only first 3 words
  const formatTitle = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    // Find index of first word containing special characters
    const specialCharIndex = words.findIndex(word => /[^a-zA-Z\s]/.test(word));
    // If special char found, slice up to that index, otherwise take first 3 words
    const wordLimit = specialCharIndex !== -1 ? specialCharIndex : 3;
    return words.slice(0, wordLimit).join(' ');
  };

  // Get first name of artist
  const getFirstName = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length > 3) {
      // Check if second word exists and is valid
      if (words[1] && /^[a-zA-Z]{2,}$/.test(words[1])) {
        return words[0] + " " + words[1];
      }
      return words[0];
    }
    return name;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <Draggable nodeRef={nodeRef}>
          <motion.div
            ref={nodeRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-60 -left-32 md:-left-40 -translate-x-1/2 bg-white/10 backdrop-blur-xl text-gray-700 rounded-2xl overflow-hidden cursor-move p-3"
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex justify-left mb-1 -mt-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseClick}
                className="p-1.5 rounded-full "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h12" />
                </svg>
              </motion.button>
            </div>

            {/* Cover Image - Top 70% */}
            <div 
              className="relative h-[70%] w-full rounded-xl overflow-hidden group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={images?.coverart}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200`}>
                <PlayPause
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  song={song}
                  handlePause={handlePauseClick}
                  handlePlay={handlePlayClick}
                />
              </div>
            </div>

            {/* Song Info - Bottom 30% */}
            <div className="p-4 space-y-2 flex flex-col items-center">
              <Link to={`/songs/${key}`}>
                <motion.h3
                  whileHover={{ x: 5 }}
                  className="font-bold text-base text-white/90 hover:text-white/80 whitespace-pre-line text-center"
                  style={{ fontSize: '100%' }}
                >
                  {formatTitle(title)}
                </motion.h3>
              </Link>
              <Link to={`/artists/${artists?.[0]?.adamid}`}>
                <motion.p
                  whileHover={{ x: 5 }}
                  className=" font-bold text-sm text-white hover:text-white/90 truncate text-center"
                  style={{ fontSize: '120%' }}
                >
                  {getFirstName(subtitle)}
                </motion.p>
              </Link>
            </div>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  );
};

export default SongCardForIdentify;
