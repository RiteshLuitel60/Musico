// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { Searchbar, Sidebar, MusicPlayer, TopPlay } from "./components";
import {
  ArtistDetails,
  TopArtists,
  AroundYou,
  Discover,
  Search,
  SongDetails,
  TopCharts,
} from "./pages";
import FloatingAudioButton from "./components/FloatingAudioButton";
import GoToTop from "./components/GoToTop";

// Import Supabase related dependencies
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import SignIn from './components/Logins/SignIn'
import PrivateRoute from './components/PrivateRoute'

// TODO: Move these to environment variables for better security
const supabaseUrl = 'https://uapxxdffkjmhmvfjaidi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcHh4ZGZma2ptaG12ZmphaWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MjQ3ODUsImV4cCI6MjA0MDUwMDc4NX0.TpTCJs86RUrn3Rf52rAQ6g26GIle3B2Xz-T5QUpHSPg'

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const App = () => {
  // Get the active song from Redux store
  const { activeSong } = useSelector((state) => state.player);
  // State to control the visibility of TopPlay component
  const [showTopPlay, setShowTopPlay] = useState(false);
  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      </>
    </SessionContextProvider>
  );
};

export default App;

/* 
Changes made:
1. Added a new state variable 'isLoggedIn' to track user's login status.
2. Implemented useEffect to check and update login status when the component mounts and when auth state changes.
3. Conditionally render either the SignIn component or the main app based on 'isLoggedIn' state.
4. Removed the PrivateRoute component as it's no longer needed with this approach.

Next steps:
1. Modify the SignIn.jsx component to handle both sign-up and sign-in functionality.
2. Update the SignIn component to redirect to the main app after successful login.
3. Consider adding a logout functionality in the Sidebar or user profile area.
4. Review and update the Redux store to handle user authentication state if necessary.

Files to be modified next:
1. src/components/Logins/SignIn.jsx - Update to include both sign-up and sign-in forms
2. src/components/Sidebar.jsx - Add logout functionality
3. src/redux/features/authSlice.js (if exists) - Update to handle authentication state
*/
