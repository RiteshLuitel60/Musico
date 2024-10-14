import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Searchbar, Sidebar, MusicPlayer, TopPlay } from "./components";
import {
  ArtistDetails,
  TopArtists,
  AroundYou,
  Discover,
  Search,
  SongDetails,
  TopCharts,
  RecognizedSongsHistory,
} from "./pages";
import FloatingAudioButton from "./components/FloatingAudioButton";
import GoToTop from "./components/GoToTop";
import Library from './pages/Library'; // Added import for Library component

// Import Supabase related dependencies
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import SignIn from './components/Logins/SignIn'
import UserNameDisplay from './components/UserNameDisplay'
import { supabase } from './utils/supabaseClient';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

// TODO: Move these to environment variables for better security


const App = () => {
  // Get the active song from Redux store
  const { activeSong } = useSelector((state) => state.player);
  // State to control the visibility of TopPlay component
  const [showTopPlay, setShowTopPlay] = useState(false);
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Move useLocation hook here, at the top level of the component
  const location = useLocation();

  // Use useMemo to create a memoized key for Routes
  const routesKey = useMemo(() => location.pathname, [location]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show TopPlay component after 2 seconds
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

  // Render SignIn component if user is not logged in
  if (!isLoggedIn) {
    return (
      <SessionContextProvider supabaseClient={supabase} initialSession={null}>
        <SignIn />
      </SessionContextProvider>
    );
  }

  // Render main app if user is logged in
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
      <ErrorBoundary> {/* Wrap with ErrorBoundary */}
        <div className="relative flex h-screen overflow-hidden">
          <GoToTop />
          <Sidebar />
          <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800 backdrop-blur-lg">
            <div className="flex items-center space-x-1 px-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <FloatingAudioButton />
                  <Searchbar />
                </div>
                <div className="hidden lg:block">
                  <UserNameDisplay className="text-white mr-6 transition-transform duration-300 ease-in-out transform hover:scale-105 select-none cursor-default" />
                </div>
              </div>
            </div>

            <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
              <div className="flex-1 h-fit pb-40">
                <Routes key={routesKey}>
                  <Route path="/" element={<Discover />} />
                  <Route path="/top-artists" element={<TopArtists />} />
                  <Route path="/top-charts" element={<TopCharts />} />
                  <Route path="/around-you" element={<AroundYou />} />
                  <Route path="/artists/:id" element={<ArtistDetails />} />
                  <Route path="/songs/:songid" element={<SongDetails />} />
                  <Route path="/search/:searchTerm" element={<Search />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/recognized-songs-history" element={<RecognizedSongsHistory />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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
      </ErrorBoundary>
    </SessionContextProvider>
  );
};

export default App;
