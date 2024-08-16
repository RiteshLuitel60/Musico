import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { useGetSongDetailsQuery } from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: songData, isFetching: isFetchingSongDetails } = useGetSongDetailsQuery(songid);
  console.log(songid);

  // Extract lyrics from the response dynamically
  const lyrics =
    songData?.resources?.lyrics?.[Object.keys(songData.resources.lyrics)[0]]?.attributes?.text;

  return (
    <div className="flex flex-col">
      {/* <DetailsHeader artistId={artistId} songData={songData} /> */}

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics</h2>

        <div className="mt-5">
          {isFetchingSongDetails ? (
            <p className="text-gray-300 text-base">Loading lyrics...</p>
          ) : lyrics ? (
            lyrics.map((line, i) => (
              <p className="text-gray-300 text-base my-1" key={i}>
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-300 text-base">Sorry! No Lyrics Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
