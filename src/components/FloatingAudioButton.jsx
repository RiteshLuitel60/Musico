import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shazamCoreApi } from '../redux/services/shazamCore'; // Ensure this path is correct
import SongCardForIdentify from './SongCardForIdentify';

const { useRecognizeSongMutation } = shazamCoreApi;

const FloatingAudioButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recognizeSong, { isLoading, isError, data, error }] = useRecognizeSongMutation();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        setIsActive(false);
        setSongInfo(null); // Reset song info after the timer
        setShowModal(false); // Hide modal after the timer
      }, 15000); // 15 seconds
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  useEffect(() => {
    if (data) {
      setSongInfo(data.track); // Assuming 'track' is the key containing the song data
      setShowModal(false); // Hide modal if data is successfully received
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
          className={`ml-4 mr-2 bg-gradient-to-r from-green-300 to-white rounded-full w-7 h-7 flex items-center justify-center text-white text-lg sm:w-10 sm:h-10 sm:text-xl md:w-12 md:h-12 md:text-2xl shadow-lg focus:outline-none transition-all duration-300 ease-in-out z-50 transform hover:shadow-xl hover:scale-150 hover:bg-green-400 ${isActive ? 'shadow-2xl' : ''}`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
          )}
          <span className="relative z-10 text-white">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6190/6190938.png"
              alt="headphones"
              className="w-4 h-4 md:w-6 md:h-6"
            />
          </span>
        </button>

        {showModal && isError && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-red-500">Sorry Error: {error.message}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 p-4 rounded-lg bg-mint-green">
        {songInfo ? (
          <SongCardForIdentify
            key={songInfo.key}
            song={songInfo}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songInfo}
          />
        ) : (
          isError && <p className="text-red-500">Error: {error.message}</p>
        )}
      </div>
    </>
  );
};

export default FloatingAudioButton;
