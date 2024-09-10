import React, { useRef, useEffect, useState } from 'react';
import { getAudioUrl } from '../../utils/audioUtils';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {

  const ref = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  // Update volume
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update seek time
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Update playback rate
  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // New function to handle playback rate change
  const handlePlaybackRateChange = (newRate) => {
    setPlaybackRate(newRate);
  };

  // New function to handle mute/unmute
  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      if (ref.current) {
        ref.current.volume = previousVolume;
      }
    } else {
      setIsMuted(true);
      setPreviousVolume(ref.current ? ref.current.volume : volume);
      if (ref.current) {
        ref.current.volume = 0;
      }
    }
  };

  // New function to handle seeking
  const handleSeek = (time) => {
    if (ref.current) {
      ref.current.currentTime = time;
    }
  };

  useEffect(() => {
    console.log('Player effect running for activeSong', activeSong);
    const setAudioSrc = async () => {
      if (activeSong && Object.keys(activeSong).length > 0) {
        try {
          const audioUrl = await getAudioUrl(activeSong);
          console.log('Audio URL fetched:', audioUrl);
          if (ref.current && audioUrl) {
            ref.current.src = audioUrl;
          }
        } catch (error) {
          console.error('Error setting audio source:', error);
        }
      }
    };

    if (activeSong && Object.keys(activeSong).length > 0) {
      setAudioSrc();
    }
  }, [activeSong]);

  return (
    <>
      <audio
        ref={ref}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
      />
      {/* New UI elements for additional features */}
      <div className="player-controls" style={{ display: 'none' }}>
        <button onClick={() => handlePlaybackRateChange(0.5)}>0.5x</button>
        <button onClick={() => handlePlaybackRateChange(1)}>1x</button>
        <button onClick={() => handlePlaybackRateChange(1.5)}>1.5x</button>
        <button onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</button>
        <input 
          type="range" 
          min="0" 
          max={ref.current && !isNaN(ref.current.duration) ? ref.current.duration : 0} 
          value={ref.current ? ref.current.currentTime : 0}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
        />
      </div>
    </>
  );
};

export default Player;
