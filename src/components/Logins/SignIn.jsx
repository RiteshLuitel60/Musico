// Import necessary dependencies
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../Logo';

// Define the SignIn component
const SignIn = () => {
  // State variables for form inputs and user status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hook for navigation
  const navigate = useNavigate();
  // Refs for auth listener and sign-in animation
  const authListenerRef = useRef(null);
  const signInRef = useRef(null);

  // Effect to handle authentication state changes
  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    authListenerRef.current = subscription;

    // Cleanup function to unsubscribe
    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
      }
    };
  }, [supabase.auth]);

  // Effect to handle successful sign-in
  useEffect(() => {
    if (user) {
      setIsSignedIn(true);
      // Animate sign-in and navigate to home page
      setTimeout(() => {
        if (signInRef.current) {
          signInRef.current.style.transition = 'transform 0.5s ease-out';
          signInRef.current.style.transform = 'translateY(-100%)';
        }
        setTimeout(() => {
          navigate('/');
        }, 500);
      }, 1000);
    }
  }, [user, navigate]);

  // Function to handle sign-in
  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrorMessage(error.message);
    }
  }, [email, password, supabase.auth]);

  // Function to handle sign-up
  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      });
      if (error) throw error;

      // Create a 'Liked Songs' library for new users
      if (user) {
        const { error: libraryError } = await supabase
          .from('libraries')
          .insert({ name: 'Liked Songs', user_id: user.id })
          .select();

        if (libraryError) {
          console.error('Error creating Liked Songs library:', libraryError);
        }
      }

      alert('Sign up successful! Please check your email for the login link.');
      setIsSignUp(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [email, password, displayName, supabase.auth]);

  // Function to handle Google sign-in
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [supabase.auth]);

  // Function to toggle between sign-in and sign-up forms
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
  };

  // Render the component
  return (
    <div ref={signInRef} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      {/* Logo with enhanced styling */}
      <div className="mb-4 w-48 transform hover:scale-105 transition-transform duration-300">
        <Logo />
      </div>

      {/* Main container with glass morphism effect */}
      <div className="max-w-md w-full space-y-6 p-8 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/10">
        {/* Title with modern typography */}
        <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
          {isSignedIn ? 'Signing you in...' : isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {/* Error message with improved styling */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
            {errorMessage}
          </div>
        )}

        {!isSignedIn && (
          <div className="space-y-4">
            {!isSignUp ? (
              // Sign-in form
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign in
                </button>
              </form>
            ) : (
              // Sign-up form with similar styling
              <form className="space-y-4" onSubmit={handleSignUp}>
                <div className="space-y-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign up
                </button>
              </form>
            )}

            {/* Toggle and Google sign-in buttons */}
            <div className="space-y-3 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                </div>
              </div>

              <button
                onClick={toggleSignUp}
                className="w-full py-3 px-4 bg-transparent border border-white/10 text-slate-300 rounded-lg font-medium hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {isSignUp ? 'Back to Sign in' : 'Sign up with Email'}
              </button>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;