// Import necessary stuff
import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';


// Function to get audio URL from Supabase
const fetchAudioUrlFromSupabase = async (songKey) => {
  console.log('Fetching audio URL from Supabase for song key:', songKey);
  try {
    // Query Supabase for the audio URL
    const { data, error } = await supabase
      .from('library_songs')
      .select('audio_url')
      .eq('song_key', songKey);

    if (error) throw error;
    console.log('Supabase response:', data);
    return data.length > 0 ? data[0].audio_url : null;
  } catch (error) {
    console.error('Error fetching audio URL from Supabase:', error);
    return null;
  }
};

// Main Player component
const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {

  // Set up refs and state
  const ref = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

   // Function to get the audio URL
   const getAudioUrl = async (song) => {
    const audioUrl = song?.resources?.['shazam-songs'] && Object.values(song.resources['shazam-songs'])[0]?.attributes?.streaming?.preview;
    if (!song) {
      return '';
    }

    // Check different places for the audio URL
    if (song?.attributes?.previews?.[0]?.url) {
      return song.attributes.previews[0].url;
    } else if (song?.hub?.actions?.[1]?.uri) {
      return song.hub.actions[1].uri;
    } else if (song?.url) {
      return song.url;
    } else if (song?.audio_url) {
      return song.audio_url;
    } else if (audioUrl) {
      return audioUrl;
    }

    // If not found, try Supabase
    try {
      const supabaseUrl = await fetchAudioUrlFromSupabase(song?.key || song?.id);
      if (supabaseUrl) {
        return supabaseUrl;
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }

    console.warn('No audio URL found for song:', song);
    return '';
  };

  // Play or pause the song
  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  // Change the volume
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Change the current time of the song
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Change the playback speed
  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Function to change playback speed
  const handlePlaybackRateChange = (newRate) => {
    setPlaybackRate(newRate);
  };

  // Function to mute/unmute
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

  // Function to change current time of song
  const handleSeek = (time) => {
    if (ref.current) {
      ref.current.currentTime = time;
    }
  };

  // Set the audio source when the active song changes
  useEffect(() => {
    const setAudioSrc = async () => {
      if (activeSong && Object.keys(activeSong).length > 0) {
        try {
          const audioUrl = await getAudioUrl(activeSong);
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
      {/* Audio element */}
      <audio
        ref={ref}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
      />
      {/* Controls for playback speed, mute, and seeking */}
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