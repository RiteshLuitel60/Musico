import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Searchbar, Sidebar, MusicPlayer, TopPlay } from "./components";
import {
  ArtistDetails,
  TopArtists,
  AroundYou,
  Discover,
  Search,
  SongDetails,
  TopCharts,
  LoginPage,
} from "./pages";
import FloatingAudioButton from "./components/FloatingAudioButton";
import GoToTop from "./components/GoToTop";

const App = () => {
  const { activeSong } = useSelector((state) => state.player);
  const [showTopPlay, setShowTopPlay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTopPlay(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Helper function to check if a song is active
  const isSongActive = (song) => {
    return song?.key || song?.id || song?.data?.[0]?.id || song?.track?.key;
  };

  return (
    <>
      <GoToTop />
      <div className="relative flex">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800 backdrop-blur-lg">
          <div className="flex items-center space-x-1">
            <FloatingAudioButton />
            <Searchbar />
          </div>

          <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
            <div className="flex-1 h-fit pb-40">
              <Routes>
                <Route path="/" element={<Discover />} />
                <Route path="/top-artists" element={<TopArtists />} />
                <Route path="/top-charts" element={<TopCharts />} />
                <Route path="/around-you" element={<AroundYou />} />
                <Route path="/artists/:id" element={<ArtistDetails />} />
                <Route path="/songs/:songid" element={<SongDetails />} />
                <Route path="/search/:searchTerm" element={<Search />} />
              </Routes>
            </div>
            {showTopPlay && (
              <div className="xl:sticky relative top-0 h-fit">
                <TopPlay />
              </div>
            )}
          </div>
        </div>
        {isSongActive(activeSong) && (
          <div className="fixed h-24 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-tl from-slate-700 via-slate-800 to-slate-900 backdrop-blur-lg z-50 shadow-lg">
            <MusicPlayer />
          </div>
        )}
      </div>

      <div className="fixed bottom-10 right-20 bg-black "></div>
    </>
  );
};

export default App;
