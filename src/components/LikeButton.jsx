import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Heart } from 'lucide-react';
import { useGetSongDetailsQuery } from '../redux/services/shazamCore';

const LikeButton = ({ song }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUserId();
  }, [supabase.auth]);

  useEffect(() => {
    if (userId) {
      fetchLikedSongsPlaylistId();
      checkIfLiked();
    }
  }, [userId, song]);

  const fetchLikedSongsPlaylistId = async () => {
    const { data, error } = await supabase
      .from('libraries')
      .select('id')
      .eq('user_id', userId)
      .eq('name', 'Liked Songs')
      .single();

    if (error) {
      console.error('Error getting Liked Songs playlist:', error);
    } else if (data) {
      setLikedSongsPlaylistId(data.id);
    } else {
      const newPlaylistId = await createLikedSongsPlaylist();
      setLikedSongsPlaylistId(newPlaylistId);
    }
  };

  const createLikedSongsPlaylist = async () => {
    const { data, error } = await supabase
      .from('libraries')
      .insert({ name: 'Liked Songs', user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('Error creating Liked Songs playlist:', error);
      return null;
    }

    return data.id;
  };

  const checkIfLiked = async () => {
    if (!userId || !likedSongsPlaylistId) {
      console.log('User ID or Liked Songs playlist ID is not set');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('library_songs')
        .select()
        .eq('library_id', likedSongsPlaylistId)
        .eq('song_key', song.key)
        .single();

      if (error) {
        console.error('Error checking if song is liked:', error);
      } else {
        setIsLiked(!!data);
      }
    } catch (error) {
      console.error('Unexpected error in checkIfLiked:', error);
    }
  };

  const handleLike = async () => {
    if (!userId || !likedSongsPlaylistId) {
      console.error('User ID or Liked Songs playlist ID is missing');
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('library_songs')
          .delete()
          .eq('library_id', likedSongsPlaylistId)
          .eq('song_key', song.key);

        if (error) throw error;
        console.log('Song removed from likes');
        setIsLiked(false);
      } else {
        const audioUrl = song.hub?.actions?.find(action => action.type === "uri")?.uri 
          || song.attributes?.previews?.[0]?.url 
          || song.audio_url 
          || '';

        const songDetails = {
          song_key: song.key,
          title: song.title,
          artist: song.subtitle,
          cover_art: song.images?.coverart,
          audio_url: audioUrl,
          lyrics: song.sections?.find(section => section.type === 'LYRICS')?.text || [],
        };

        const { error } = await supabase
          .from('library_songs')
          .insert({ 
            library_id: likedSongsPlaylistId, 
            ...songDetails
          });

        if (error) throw error;
        console.log('Song added to likes');
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <button onClick={handleLike} className="focus:outline-none">
      <Heart
        size={20}
        fill={isLiked ? 'red' : 'none'}
        stroke={isLiked ? 'red' : 'currentColor'}
      />
    </button>
  );
};

export default LikeButton;