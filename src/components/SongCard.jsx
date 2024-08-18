import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // Determine the data source
  const isWorldChartsData = song.attributes && song.attributes.name;
  const isTrackDetailssData = song.type === 'shazam-songs';
  const isSearchResultsData = song.title && song.subtitle; // Add this check for search results

  let title, artist, coverArt;

  if (isWorldChartsData) {
    title = song.attributes.name;
    artist = song.attributes.artistName;
    coverArt = song.attributes.artwork?.url;
  } else if (isTrackDetailsData) {
    title = song.attributes.title;
    artist = song.attributes.artist;
    coverArt = song.attributes.images?.coverArt;
  } else if (isSearchResultsData) { // Handle search results data
    title = song.title;
    artist = song.subtitle;
    coverArt = song.images?.coverart;
  }

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img alt="song_img" src={coverArt || ''} className="w-full h-full rounded-lg" />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${song.id}`}>
            {title}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={isSearchResultsData ? `/artists/${song.artists[0]?.id}` : '/top-artists'}>
            {artist}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;

{/*

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // Determine the data source
  const isWorldChartsData = song.attributes && song.attributes.name;
  const isTrackDetailsData = song.type === 'shazam-songs';
  const isSearchResultsData = song.title && song.subtitle; // Add this check for search results

  let title, artist, coverArt;

  if (isWorldChartsData) {
    title = song.attributes.name;
    artist = song.attributes.artistName;
    coverArt = song.attributes.artwork?.url;
  } else if (isTrackDetailsData) {
    title = song.attributes.title;
    artist = song.attributes.artist;
    coverArt = song.attributes.images?.coverArt;
  } else if (isSearchResultsData) { // Handle search results data
    title = song.title;
    artist = song.subtitle;
    coverArt = song.images?.coverart;
  }

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img alt="song_img" src={coverArt || ''} className="w-full h-full rounded-lg" />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${song.id}`}>
            {title}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={isSearchResultsData ? `/artists/${song.artists[0]?.id}` : '/top-artists'}>
            {artist}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;

*/}