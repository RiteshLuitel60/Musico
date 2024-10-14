import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../utils/supabaseClient';
import { Error, Loader, SongBar } from '../components';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery } from '../redux/services/shazamCore';
import { History } from 'lucide-react';
//976613650  test song key for atlantis

const RecognizedSongItem = ({ song, index, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  const { data: songDetails, isFetching, error } = useGetSongDetailsQuery(song.song_key);

  if (isFetching) return <Loader />;
  if (error) return <Error />;

  const detailedSong = { ...song, details: songDetails };

  return (
    <SongBar
      song={detailedSong.details || detailedSong}
      i={index}
      isPlaying={isPlaying}
      activeSong={activeSong}
      handlePauseClick={handlePauseClick}
      handlePlayClick={() => handlePlayClick(detailedSong.details || detailedSong, index)}
    />
  );
};

const RecognizedSongsHistory = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [recognizedSongs, setRecognizedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecognizedSongs();
  }, []);

  const fetchRecognizedSongs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('recognized_songs')
          .select('*')
          .eq('user_id', user.id)
          .order('recognized_at', { ascending: false });

        if (error) throw error;

        setRecognizedSongs(data);
      }
    } catch (error) {
      console.error('Error fetching recognized songs:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: recognizedSongs, i }));
    dispatch(playPause(true));
  };

  const handleClearHistory = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('recognized_songs')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        setRecognizedSongs([]);
      }
    } catch (error) {
      console.error('Error clearing recognized songs history:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader title="Loading recognized songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 mb-6 sm:mb-10">
        <h2 className="font-bold text-2xl sm:text-3xl text-white text-center sm:text-left mb-4 sm:mb-0">Recognized Songs History</h2>
        <span
          className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer text-sm sm:text-base sm:order-2 order-1"
          onClick={handleClearHistory}
        >
          <History className="w-4 h-4 mr-2" />
          Clear History
        </span>
      </div>
      {recognizedSongs.length === 0 ? (
        <p className="text-white text-center text-lg">No recognized songs in history.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {recognizedSongs.map((song, i) => (
            <RecognizedSongItem
              key={song.id}
              song={song}
              index={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={handlePlayClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecognizedSongsHistory;
