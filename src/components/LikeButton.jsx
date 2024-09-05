import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Heart } from 'lucide-react';

const LikeButton = ({ songId, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    checkIfLiked();
    getLikedSongsPlaylistId();
  }, [songId, userId]);

  const getLikedSongsPlaylistId = async () => {
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

  const checkIfLiked = async () => {
    if (!userId || !likedSongsPlaylistId) return;

    const { data, error } = await supabase
      .from('library_songs')
      .select()
      .eq('user_id', userId)
      .eq('song_key', songId)
      .eq('library_id', likedSongsPlaylistId)
      .single();

    if (error) {
      console.error('Error checking if song is liked:', error);
    } else {
      setIsLiked(!!data);
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
          .eq('user_id', userId)
          .eq('song_key', songId)
          .eq('library_id', likedSongsPlaylistId);

        if (error) throw error;
        console.log('Song removed from likes');
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from('library_songs')
          .insert({ 
            user_id: userId, 
            song_key: songId, 
            library_id: likedSongsPlaylistId 
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