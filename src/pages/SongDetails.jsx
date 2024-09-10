import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery, useGetSongRelatedQuery } from '../redux/services/shazamCore';
import RelatedSongsManual from '../components/RelatedSongManual';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [finalSongId, setFinalSongId] = useState(songid);
  const { data: songData, isFetching: isFetchingSongDetails, error } = useGetSongDetailsQuery(finalSongId);
  const { data: relatedSongs, isFetching: isFetchingRelatedSongs } = useGetSongRelatedQuery(finalSongId);

  useEffect(() => {
    if (relatedSongs && !relatedSongs.some(song => song.id === songid)) {
      setFinalSongId(498502624); // Fallback to default trackId if no match is found
    }
  }, [relatedSongs, songid]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedSongs, i }));
    dispatch(playPause(true));
  };

  if (isFetchingSongDetails && isFetchingRelatedSongs) return <Loader title="Searching song details" />;
  if (error) return <>
<p className='text-green-400 text-xl font-bold mt-5 mb-12 '>
  Song Details Not Found:(
  
  </p>  
<RelatedSongsManual
        data={relatedSongs}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
  </> ;

  const lyrics = songData?.sections?.[1]?.type === 'LYRICS'
    ? songData?.sections[1]?.text
    : songData?.resources?.lyrics?.[Object.keys(songData.resources.lyrics)[0]]?.attributes?.text;

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} songData={songData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          {isFetchingSongDetails ? (
            <Loader />
          ) : lyrics ? (
            lyrics.map((line, i) => (
              <p key={`lyrics-${line}-${i}`} className="text-gray-400 text-base my-1">
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">Sorry, No lyrics found!</p>
          )}
        </div>
      </div>

      <RelatedSongsManual
        data={relatedSongs}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
