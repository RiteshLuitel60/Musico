import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery, useGetSongRelatedQuery } from '../redux/services/shazamCore';
import RelatedSongsManual from '../components/RelatedSongManual';
import PlayPause from '../components/PlayPause';
import { MdPlayCircleFilled } from "react-icons/md";
import { MdPauseCircleOutline } from "react-icons/md";
import LikeButton from '../components/LikeButton'; // Ensure the correct path
import SongOptions from '../components/SongOptions';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [finalSongId, setFinalSongId] = useState(songid);
  const { data: songData, isFetching: isFetchingSongDetails, error } = useGetSongDetailsQuery(finalSongId);
  const { data: relatedSongs, isFetching: isFetchingRelatedSongs } = useGetSongRelatedQuery(finalSongId);

    const audioUrl = songData?.resources?.['shazam-songs'] && Object.values(songData.resources['shazam-songs'])[0]?.attributes?.streaming?.preview;

    const songInfo = songData?.resources?.['shazam-songs'] && Object.values(songData.resources['shazam-songs'])[0]?.attributes;



    const coverArt = songInfo?.artwork?.url;
    const artistName = songInfo?.primaryArtist;
    const songName = songInfo?.title;

  
console.log(songData)




  useEffect(() => {
    if (relatedSongs && !relatedSongs.some(song => song?.id || song?.key ||song?.hub?.actions[0]?.id === songid)) {
      setFinalSongId(498502624); // Fallback to default trackId if no match is found
    }
  }, [relatedSongs, songid]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song: songData, data: [songData], i: 0 }));
    dispatch(playPause(true));
    console.log(songName + "played");
  };

  if (isFetchingSongDetails && isFetchingRelatedSongs) return <Loader title="Searching song details" />;
  if (error) return <Error />;

  const lyrics = songData?.sections?.find((section) => section.type === 'LYRICS')?.text
    ? songData?.sections[1]?.text
    : songData?.resources?.lyrics?.[Object.keys(songData.resources.lyrics)[0]]?.attributes?.text;

  return (
    <div className="flex flex-col  ">
      <DetailsHeader artistId={artistId} songData={songData} />
      <div className="flex items-center mb-10  ">
        <div>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={songData}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
            audioUrl={audioUrl}
            coverArt={coverArt}
            artistName={artistName}
            songId={songInfo}
            size={75}
            color="text-black"
            playIcon={MdPlayCircleFilled}
            pauseIcon={MdPauseCircleOutline}
          />
        </div>


        {/* <div className='ml-10'>

          <LikeButton song={songData} /> Pass the song data to LikeButton
        </div> */}

        {/* <div className='ml-5'>
          <SongOptions song={songData} />
        </div> */}
        
      </div>

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          {isFetchingSongDetails ? (
            <Loader />
          ) : lyrics ? (
            lyrics.map((line, i) => (
              <p key={`lyrics-${line}-${i}`} className="text-gray-200 text-base my-1">
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
