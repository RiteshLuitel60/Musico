import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shazamCoreApi } from "../redux/services/shazamCore"; 
import SongCardForIdentify from "./SongCardForIdentify";
import { supabase } from '../utils/supabaseClient';
import animatedIdentifyButton from '../assets/AnimatedIdentifyButton.webm';

const { useRecognizeSongMutation } = shazamCoreApi;

const FloatingAudioButton = () => {
  // State variables
  const [isActive, setIsActive] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noSongFound, setNoSongFound] = useState(false);
  const [recognizeSong, { isLoading, isError, data, error }] =
    useRecognizeSongMutation();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Handle song recognition results
  useEffect(() => {
    if (data) {
      if (data.track) {
        setSongInfo(data.track);
        setNoSongFound(false);
        setShowModal(false);
        saveSongToHistory(data.track);
      } else if (data.track === null && (!data.matches || data.matches.length === 0)) {
        setNoSongFound(true);
      }
    }
    if (isError) {
      setNoSongFound(true);
      setShowModal(true);
      console.error("Error in song recognition:", error);
    }
  }, [data, isError, error]);

  // Process audio data for recognition
  const handleAudioData = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      await recognizeSong(formData).unwrap();
    } catch (error) {
      console.error("Error recognizing song:", error);
    }
  };

  // Start audio recording on button click
  const handleClick = async () => {
    if (!isActive) {
      setIsActive(true);
      setSongInfo(null);
      setShowModal(false);
      setNoSongFound(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
          setIsActive(false);
        }, 10000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setIsActive(false);
      }
    }
  };

  // Save recognized song to history
  const saveSongToHistory = async (song) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const songData = {
          user_id: user.id,
          song_key: song.hub?.actions[0]?.id || song.key || song.id,
          title: song.title,
          artist: song.subtitle,
          artist_id: song.artists?.[0]?.adamid,
          recognized_at: new Date().toISOString(),
          cover_art: song.images?.coverart || song.share?.image,
          audio_url: song.hub?.actions?.find(action => action.type === "uri")?.uri || null
        };
        const { error } = await supabase.from('recognized_songs').insert(songData);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving song to history:", error);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Floating audio button */}
        <button
          className={`ml-4 mr-2 ${isActive ? "shadow-2xl" : ""}`}
          onClick={handleClick}
          disabled={isLoading}
        >
          <video
            src={animatedIdentifyButton}
            autoPlay
            loop
            muted
            playsInline
            className="w-10 h-10 object-cover hover:animate-spin animate-pulse mt-3"
          />
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-slate-600 opacity-75 animate-ping"></span>
          )}
        </button>

        {/* Error modal */}
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

        {/* No song found modal */}
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
      </div>
      {/* Recognized song card */}
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
