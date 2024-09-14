import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Heart } from 'lucide-react';

const LikeButton = ({ song, isLikedSongs = false }) => {
  const [isLiked, setIsLiked] = useState(isLikedSongs);
  const [userId, setUserId] = useState(null);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const initializeButton = async () => {
      const fetchedUserId = await fetchUserId();
      if (fetchedUserId) {
        setUserId(fetchedUserId);
        const fetchedPlaylistId = await fetchLikedSongsPlaylistId(fetchedUserId);
        if (fetchedPlaylistId) {
          setLikedSongsPlaylistId(fetchedPlaylistId);
          checkIfLiked(fetchedPlaylistId); // check if the song is liked without delay
        }
      }
    };
    initializeButton();
  }, [song]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? user.id : null;
  };

  const fetchLikedSongsPlaylistId = async (userId) => {
    const cachedPlaylistId = localStorage.getItem('likedSongsPlaylistId');
    if (cachedPlaylistId) return cachedPlaylistId;

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

    const playlistId = data ? data.id : await createLikedSongsPlaylist(userId);
    localStorage.setItem('likedSongsPlaylistId', playlistId); // Cache it locally
    return playlistId;
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

  const checkIfLiked = async (playlistId) => {
    const cachedLikes = JSON.parse(localStorage.getItem('likedSongs')) || {};
    if (cachedLikes[song.key]) {
      setIsLiked(true); // Instantly mark it as liked from cache
      return;
    }

    const { data, error } = await supabase
      .from('library_songs')
      .select('*')
      .eq('library_id', playlistId)
      .eq('song_key', song.key);

    if (error) throw error;
    
    const liked = data.length > 0;
    setIsLiked(liked);

    if (liked) {
      localStorage.setItem(
        'likedSongs',
        JSON.stringify({ ...cachedLikes, [song.key]: true })
      ); // Cache liked status
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsLiked(prev => !prev); // Optimistic update

    try {
      const cachedLikes = JSON.parse(localStorage.getItem('likedSongs')) || {};

      if (isLiked) {
        await supabase
          .from('library_songs')
          .delete()
          .eq('library_id', likedSongsPlaylistId)
          .eq('song_key', song.key);

        // Update cache
        delete cachedLikes[song.key];
        localStorage.setItem('likedSongs', JSON.stringify(cachedLikes));
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

        await supabase
          .from('library_songs')
          .insert({ 
            library_id: likedSongsPlaylistId, 
            ...songDetails
          });

        // Update cache
        localStorage.setItem('likedSongs', JSON.stringify({ ...cachedLikes, [song.key]: true }));
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      setIsLiked(prev => !prev); // Revert optimistic update on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLike} className="focus:outline-none" disabled={isLoading}>
      <Heart
        size={20}
        fill={isLiked ? 'lime' : 'none'}
        stroke={isLiked ? 'lime' : 'currentColor'}
      />
    </button>
  );
};

export default LikeButton;
