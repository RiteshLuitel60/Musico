import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const authListenerRef = useRef(null);
  const signInRef = useRef(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    authListenerRef.current = subscription;

    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
      }
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (user) {
      setIsSignedIn(true);
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

  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
    } catch (error) {
      console.error("Sign-in error:", error); // Log the error for more details
      setErrorMessage(error.message);
    }
  }, [email, password, supabase.auth]);

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

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setEmail(''); // Clear email field when toggling sign-up
    setPassword(''); // Clear password field when toggling sign-up
  };

  return (
    <div ref={signInRef} className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <h1 className="text-4xl font-playfair font-bold text-white italic tracking-wide shadow-lg">Musico</h1>
      </div>
      <div className="max-w-md w-full space-y-8 bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl relative">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isSignedIn ? 'Signing you in...' : isSignUp ? 'Sign up for an account' : 'Sign in to your account'}
          </h2>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-center">
            {errorMessage}
          </div>
        )}
        {!isSignedIn && (
          <>
            {!isSignUp ? (
              <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only text-white">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-gray-700"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only text-white">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-gray-700"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only text-white">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-gray-700"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only text-white">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-gray-700"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="displayName" className="sr-only text-white">Full Name</label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-gray-700"
                      placeholder="Full Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            )}
            
            <div>
              <button
                onClick={toggleSignUp}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-green-300 bg-transparent hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                {isSignUp ? 'Back to Sign in' : 'Sign up with Email'}
              </button>
            </div>
            
            <div>
              <button
                onClick={handleGoogleSignIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
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