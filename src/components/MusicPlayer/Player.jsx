import React, { useRef, useEffect, useState } from 'react';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const getAudioUrl = (song) => {
    if (song?.audio_url) {
      return song.audio_url;
    } else if (song?.attributes?.previews?.[0]?.url) {
      return song.attributes.previews[0].url;
    } else if (song?.hub?.actions?.[1]?.uri) {
      return song.hub.actions[1].uri;
    }
    return '';
  };

  // Handle play/pause logic
  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

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

  return (
    <>
      <audio
        src={getAudioUrl(activeSong)}
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
          max={ref.current ? ref.current.duration : 0} 
          value={ref.current ? ref.current.currentTime : 0}
          onChange={(e) => handleSeek(e.target.value)}
        />
      </div>
    </>
  );
};

export default Player;
