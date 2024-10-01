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
  const { data, isFetching, error } = useGetSongsByGenreQuery(
    genreListId || "POP",
  );

  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    fetchLibraries();
  }, []);

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

  if (isFetching) return <Loader title="Loading Songs...." />;
  if (error) return <Error />;

  const genreTitle =
    genres.find(({ value }) => value === genreListId)?.title || "Pop";

  return (
    <>
      <div className="flex flex-col ">
        <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
          <h2 className="font-bold text-3xl text-white text-left">
            Discover {genreTitle}
          </h2>
          <select
            onChange={(e) => dispatch(selectGenreListId(e.target.value))}
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

        <div className="flex flex-wrap justify-start gap-8 w-full">
          {data?.map((song, i) => (
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
        <div></div>
      </div>

      {/* seperates it from discover pages other component */}
    </>
  );
};

export default Discover;
