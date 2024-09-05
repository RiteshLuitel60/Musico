import React, { useRef, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtxrwvpvxnqxmvnqxnqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eHJ3dnB2eG5xeG12bnF4bnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1NTg5NzAsImV4cCI6MjAwMTEzNDk3MH0.0FchXKNWNXxXXNZXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add this function after the imports and before the Player component
const fetchAudioUrlFromSupabase = async (songKey) => {
  console.log('Fetching audio URL from Supabase for song key:', songKey);
  try {
    const { data, error } = await supabase
      .from('library_songs')
      .select('audio_url')
      .eq('song_key', songKey)
      .single();

    if (error) throw error;
    console.log('Supabase response:', data);
    return data?.audio_url || null;
  } catch (error) {
    console.error('Error fetching audio URL from Supabase:', error);
    return null;
  }
};

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const getAudioUrl = async (song) => {
    console.log('getAudioUrl called with song:', song);

    if (song?.audio_url) {
      return song.audio_url;
    }

    try {
      const supabaseUrl = await fetchAudioUrlFromSupabase(song.key || song.id);
      if (supabaseUrl) {
        return supabaseUrl;
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }

    if (song?.attributes?.previews?.[0]?.url) {
      return song.attributes.previews[0].url;
    } else if (song?.hub?.actions?.[1]?.uri) {
      return song.hub.actions[1].uri;
    } else if (song?.url) {
      return song.url;
    }

    console.warn('No audio URL found for song:', song);
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

  useEffect(() => {
    const setAudioSrc = async () => {
      if (activeSong) {
        const audioUrl = await getAudioUrl(activeSong);
        if (ref.current) {
          ref.current.src = audioUrl;
        }
      }
    };

    setAudioSrc();
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
          max={ref.current ? ref.current.duration : 0} 
          value={ref.current ? ref.current.currentTime : 0}
          onChange={(e) => handleSeek(e.target.value)}
        />
      </div>
    </>
  );
};

export default Player;
