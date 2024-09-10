import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Heart } from 'lucide-react';

const LikeButton = ({ song, isLikedSongs = false }) => {
  const [isLiked, setIsLiked] = useState(isLikedSongs);
  const [userId, setUserId] = useState(null);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const initializeButton = async () => {
      if (!isLikedSongs) {
        const fetchedUserId = await fetchUserId();
        if (fetchedUserId) {
          const fetchedPlaylistId = await fetchLikedSongsPlaylistId(fetchedUserId);
          if (fetchedPlaylistId) {
            await checkIfLiked();
          }
        }
      }
      setIsInitialized(true);
    };

    initializeButton();
  }, [song, isLikedSongs]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      return user.id;
    }
    return null;
  };

  const fetchLikedSongsPlaylistId = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('libraries')
      .select('id')
      .eq('user_id', userId)
      .eq('name', 'Liked Songs')
      .single();

    if (error) {
      console.error('Error getting Liked Songs playlist:', error);
      return null;
    }

    if (data) {
      setLikedSongsPlaylistId(data.id);
      return data.id;
    }

    const newPlaylistId = await createLikedSongsPlaylist(userId);
    setLikedSongsPlaylistId(newPlaylistId);
    return newPlaylistId;
  };

  const createLikedSongsPlaylist = async (userId) => {
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
    if (!userId || !likedSongsPlaylistId) return;

    try {
      const { data, error } = await supabase
        .from('library_songs')
        .select('*')
        .eq('library_id', likedSongsPlaylistId)
        .eq('song_key', song.key);

      if (error) throw error;
      setIsLiked(data.length > 0);
    } catch (error) {
      console.error('Error checking if song is liked:', error);
    }
  };

  const handleLike = async () => {
    if (!isInitialized || isLoading) {
      console.log('Like button is not yet initialized or is loading');
      return;
    }

    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    if (!likedSongsPlaylistId) {
      console.error('Liked Songs playlist ID is missing');
      const fetchedPlaylistId = await fetchLikedSongsPlaylistId(userId);
      if (!fetchedPlaylistId) {
        console.error('Failed to fetch or create Liked Songs playlist');
        return;
      }
    }

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLike} className="focus:outline-none" disabled={!isInitialized || isLoading}>
      <Heart
        size={20}
        fill={isLiked ? 'lime' : 'none'}
        stroke={isLiked ? 'lime' : 'currentColor'}
      />
    </button>
  );
};

export default LikeButton;