import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Error, Loader, SongCard } from "../components";
import { selectGenreListId } from "../redux/features/playerSlice";
import {
  useGetSongsByGenreQuery,
  useGetTopChartsQuery,
} from "../redux/services/shazamCore";
import { genres } from "../assets/constants";
import { supabase } from "../utils/supabaseClient";

const Discover = () => {
  const dispatch = useDispatch();
  const { genreListId } = useSelector((state) => state.player);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 48;

  // Fetch songs by genre
  const { data, isFetching, error } = useGetSongsByGenreQuery(
    genreListId || "POP",
  );

  const [libraries, setLibraries] = useState([]);
  const [displayedSongs, setDisplayedSongs] = useState([]);

  // Fetch libraries on component mount
  useEffect(() => {
    fetchLibraries();
  }, []);

  // Update displayed songs when data or page changes
  useEffect(() => {
    if (data) {
      const startIndex = (currentPage - 1) * songsPerPage;
      const endIndex = startIndex + songsPerPage;
      setDisplayedSongs(data.slice(startIndex, endIndex));
    }
  }, [data, currentPage]);

  // Function to fetch user's libraries
  const fetchLibraries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching libraries:', error);
      } else {
        setLibraries(data);
      }
    }
  };

  // Handle infinite scroll
  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
    if (bottom && data?.length > currentPage * songsPerPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  // Show loading state
  if (isFetching && currentPage === 1) return <Loader title="Loading Songs...." />;
  // Show error state
  if (error) return <Error />;

  // Get the title of the selected genre
  const genreTitle =
    genres.find(({ value }) => value === genreListId)?.title || "Pop";

  return (
    <>
      <div className="flex flex-col ">
        <div className="w-full flex justify-between flex-row mt-4 mb-10">
          <h2 className="font-bold text-3xl text-white text-left">
            Discover {genreTitle}
          </h2>
          {/* Genre selection dropdown */}
          <select
            onChange={(e) => {
              dispatch(selectGenreListId(e.target.value));
              setCurrentPage(1);
            }}
            value={genreListId || "pop"}
            className="bg-slate-800 text-white px-4 py-2 text-sm font-medium rounded-md shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-colors duration-200 ease-in-out"
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.title}
              </option>
            ))}
          </select>
        </div>

        {/* Display song cards */}
        <div className="flex flex-wrap justify-center gap-9 mx-auto w-full max-w-[90%]">
          {displayedSongs?.map((song, i) => (
            <SongCard
              key={song.key || song.id || `song-${i}`}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data}
              i={i}
              libraries={libraries}
              setLibraries={setLibraries}
            />
          ))}
        </div>
        {isFetching && currentPage > 1 && (
          <div className="w-full flex justify-center mt-4">
            <Loader title="Loading more songs..." />
          </div>
        )}
      </div>
    </>
  );
};

export default Discover;
