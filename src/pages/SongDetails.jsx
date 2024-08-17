import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { useGetSongDetailsQuery, useGetSongRelatedQuery } from "../redux/services/shazamCore";
import TopPlayM from '../components/RelatedSongsM';
import RelatedSongsManual from '../components/RelatedSongManual';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
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

  if (error) return <Error />;

  const lyrics = songData?.resources?.lyrics?.[Object.keys(songData.resources.lyrics)[0]]?.attributes?.text;

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId="" songData={songData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics</h2>
        <div className="mt-5">
          {isFetchingSongDetails ? (
            <Loader />
          ) : lyrics ? (
            lyrics.map((line, i) => (
              <p className="text-gray-300 text-base my-1" key={i}>
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-300 text-base my-1">Sorry! No Lyrics Found</p>
          )}
        </div>
      </div>

      <RelatedSongsManual/>
    

    </div>
  );
};

export default SongDetails;
