import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
    console.log(song)
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };


  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-30 group-hover:bg-opacity-70 ${
            activeSong?.id === song.id ? 'bg-opacity-70' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
<img alt="Song_img" src={song.attributes.artwork.url} className="object-cover w-full h-full" />
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${song.id}`}>
            {song.attributes.name}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
        <Link to={`/artists/${song.relationships.artists.data[0]?.id}`}>
            {song.attributes.artistName}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
