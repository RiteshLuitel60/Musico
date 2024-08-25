import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shazamCoreApi } from '../redux/services/shazamCore'; // Ensure this path is correct
import SongCardForIdentify from './SongCardForIdentify';
import { X, Music, Music2, Music3Icon, Music2Icon, Music3, Music4, Music4Icon, FileMusicIcon, LucideMusic } from 'lucide-react';

const { useRecognizeSongMutation } = shazamCoreApi;

const FloatingAudioButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noSongFound, setNoSongFound] = useState(false); // State to handle no song found message
  const [recognizeSong, { isLoading, isError, data, error }] = useRecognizeSongMutation();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        setIsActive(false);
        if (!data || (data.track === null && data.matches.length === 0)) {
          setNoSongFound(true); // Show no song found dialog if no valid data
        }
      }, 15000); // 15 seconds
    }
    return () => clearTimeout(timer);
  }, [isActive, data]);

  useEffect(() => {
    if (data) {
      if (data.track) {
        setSongInfo(data.track); // Set song info if track data is available
        setNoSongFound(false); // Reset no song found message
        setShowModal(false); // Hide modal if data is successfully received
      } else if (data.track === null && data.matches.length === 0) {
        setNoSongFound(true); // Show no song found dialog if track is null and no matches
      }
    }
    if (isError) {
      setShowModal(true);
    }
    console.log('Data:', data);
    console.log('Error:', error);
  }, [data, isError]);

  const handleAudioData = async (audioBlob) => {
    try {
      console.log('Audio Blob:', audioBlob);
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      await recognizeSong(formData).unwrap();
    } catch (error) {
      console.error('Error recognizing song:', error);
    }
  };

  const handleClick = async () => {
    if (!isActive) {
      setIsActive(true);
      setSongInfo(null); // Reset song info when starting new recognition
      setShowModal(false); // Ensure modal is hidden
      setNoSongFound(false); // Reset no song found message

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          handleAudioData(audioBlob);
        };

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000); // Listen for 10 seconds
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  return (
    <>
    <div className="relative">
      <button
        className={`ml-4 mr-2 bg-gradient-to-r from-white to-white rounded-full w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl shadow-lg focus:outline-none transition-all duration-300 ease-in-out z-50 transform hover:shadow-xl hover:scale-150 hover:bg-slate-900 ${
          isActive ? 'shadow-2xl' : ''
        }`}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isActive && (
          <span className="absolute inset-0 rounded-full bg-slate-900 opacity-75 animate-ping"></span>
        )}
        <span className="relative z-10 text-zinc-800">
          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl md:text-2xl font-bold"><Music3/></span>
          </div>
        </span>
      </button>
  
      {showModal && isError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p className="text-red-500">Sorry, Error: {error.message}</p>
          </div>
        </div>
      )}
  
      {noSongFound && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="w-80 bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl shadow-2xl relative backdrop-blur-sm border-solid border-white/10 border">
            <div className="absolute -top-4 -left-4 bg-white rounded-full p-2 shadow-lg">
              <Music className="w-6 h-6 text-indigo-600" />
            </div>
            <button
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors duration-200"
              onClick={() => setNoSongFound(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-4">
              <p className="text-white text-lg font-semibold mb-2">No Song Found</p>
              <p className="text-white/80 text-sm">
                We couldn't find the song you're looking for. Please try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  
    {songInfo && (
      <div className="fixed bottom-11 left-1/2 transform -translate-x-1/2 z-50">
        <div className="p-4 rounded-lg bg-mint-green">
          <SongCardForIdentify
            key={songInfo.key}
            song={songInfo}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songInfo}
          />
        </div>
      </div>
    )}
  </>
  
  );
};

export default FloatingAudioButton;