import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shazamCoreApi } from "../redux/services/shazamCore"; // Ensure this path is correct
import SongCardForIdentify from "./SongCardForIdentify";
import { Music3 } from "lucide-react";

const { useRecognizeSongMutation } = shazamCoreApi;

const FloatingAudioButton = () => {
  const [isActive, setIsActive] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noSongFound, setNoSongFound] = useState(false); // State to handle no song found message
  const [recognizeSong, { isLoading, isError, data, error }] =
    useRecognizeSongMutation();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        setIsActive(false);
        if (!data || (data.track === null && data.matches.length === 0)) {
          setNoSongFound(true); // Show no song found dialog if no valid data
        }
      }, 10000); // 10 seconds
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
    if (isError || (data && data.track === null && data.matches.length === 0)) {
      setNoSongFound(true); // Show no song found message
      setShowModal(true);
    }
    console.log("Data:", data);
    console.log("Error:", error);
  }, [data, isError]);

  const handleAudioData = async (audioBlob) => {
    try {
      console.log("Audio Blob:", audioBlob);
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      await recognizeSong(formData).unwrap();
    } catch (error) {
      console.error("Error recognizing song:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNoSongFound(false); // Reset no song found message when modal is closed
  };

  const handleClick = async () => {
    if (!isActive) {
      setIsActive(true);
      setSongInfo(null); // Reset song info when starting new recognition
      setShowModal(false); // Ensure modal is hidden
      setNoSongFound(false); // Reset no song found message

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          handleAudioData(audioBlob);
        };

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000); // Listen for 10 seconds
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className={`ml-4 mr-2  bg-slate-900 rounded-full w-7 h-7 flex items-center justify-center text-white text-lg sm:w-10 sm:h-10 sm:text-xl md:w-12 md:h-12 md:text-2xl shadow-lg focus:outline-none transition-all duration-300 ease-in-out z-50 transform hover:shadow-xl hover:scale-150 animate-pulse border border-white hover:bg-slate-800 ${isActive ? "shadow-2xl" : ""}`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-slate-600 opacity-75 animate-ping"></span>
          )}
          <span className="relative z-10 text-white">
            <Music3 />
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
              <p className="text-red-500">Sorry Error: {error.message}</p>
            </div>
          </div>
        )}

        {/* No Song Found Dialog */}
        {noSongFound && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="h-28 w-80 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-700 p-6 rounded-md shadow-2xl relative backdrop-blur-md border border-purple-800/50 flex items-center justify-center">
              <button
                className="absolute top-2 right-2 text-white hover:text-gray-200 transition duration-200"
                onClick={() => setNoSongFound(false)}
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
              <p className="text-white font-semibold">
                No song found! Try Again
              </p>
            </div>
          </div>
        )}

        {isActive && songInfo && (
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
      </div>
    </>
  );
};

export default FloatingAudioButton;
