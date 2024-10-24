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
    <div ref={signInRef} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="mb-[-15px] w-48">
        <Logo />
      </div>
      {/* Main container */}
      <div className="max-w-md w-full space-y-8 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-blue-200 border-opacity-20">
        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isSignedIn ? 'Signing you in...' : isSignUp ? 'Sign up ' : 'Sign in'}
          </h2>
        </div>
        {/* Error message display */}
        {errorMessage && (
          <div className="text-red-400 text-center">
            {errorMessage}
          </div>
        )}
        {/* Sign-in and Sign-up forms */}
        {!isSignedIn && (
          <>
            {!isSignUp ? (
              // Sign-in form
              <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                {/* Form inputs */}
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-blue-200 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-blue-200 text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sign-in button */}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            ) : (
              // Sign-up form
              <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                {/* Form inputs */}
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-blue-200 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-blue-200 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="displayName" className="sr-only">Full Name</label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-blue-300 placeholder-blue-200 text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                      placeholder="Full Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Sign-up button */}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            )}
            
            {/* Toggle between sign-in and sign-up */}
            <div>
              <button
                onClick={toggleSignUp}
                className="group relative w-full flex justify-center py-2 px-4 border border-blue-300 text-sm font-medium rounded-md text-blue-300 bg-transparent hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                {isSignUp ? 'Back to Sign in' : 'Sign up with Email'}
              </button>
            </div>
            
            {/* Google sign-in button */}
            <div>
              <button
                onClick={handleGoogleSignIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-blue-300 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;