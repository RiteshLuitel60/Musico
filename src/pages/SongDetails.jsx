import { useParams } from "react-router-dom"; // Import hook for route parameters
import { useSelector, useDispatch } from "react-redux"; // Import hooks for Redux state and dispatch
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components"; // Import components
import { setActiveSong, playPause } from "../redux/features/playerSlice"; // Import Redux actions
import { useGetSongDetailsQuery } from "../redux/services/shazamCore"; // Import query hook for song details

const SongDetails = () => {
  const dispatch = useDispatch(); // Initialize dispatch function
  const { songid } = useParams(); // Get song ID from URL parameters
  const { activeSong, isPlaying } = useSelector((state) => state.player); // Get player state from Redux

  const { data: songData, isFetching: isFetchingSongDetails } = useGetSongDetailsQuery(songid); // Fetch song details

  // Extract lyrics from the response dynamically
  const lyrics =
    songData?.resources?.lyrics?.[Object.keys(songData.resources.lyrics)[0]]?.attributes?.text;

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId="" songData={songData} /> {/* Display song details header */}

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics</h2> {/* Section title for lyrics */}

        <div className="mt-5">
          {isFetchingSongDetails ? (
            <p className="text-gray-300 text-base">Loading lyrics...</p> // Show loading text if fetching
          ) : lyrics ? (
            lyrics.map((line, i) => (
              <p className="text-gray-300 text-base my-1" key={i}>
                {line} {/* Display each line of lyrics */}
              </p>
            ))
          ) : (
            <p className="text-gray-300 text-base my-1">Sorry! No Lyrics Found</p> // Show message if no lyrics
          )}
        </div>
      </div>

      <RelatedSongs/> {/* Display related songs */}

    </div>
  );
};

export default SongDetails; // Export the component
