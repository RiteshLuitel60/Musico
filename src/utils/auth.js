// Import Supabase client from the supabaseClient file
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Function to handle user logout
export const logout = async () => {
  const supabase = useSupabaseClient();
  try {
    // Attempt to sign out the user
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Redirect to login page after successful logout
    window.location.href = "/login";
  } catch (error) {
    // Log any errors that occur during logout
    console.error("Error logging out:", error.message);
  }
};

// Function to check if a user is currently logged in
export const isLoggedIn = async () => {
  const supabase = useSupabaseClient();
  try {
    // Get the current user's data
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    // Return true if user exists, false otherwise
    return !!user;
  } catch (error) {
    console.error("Error checking login status:", error.message);
    return false;
  }
};

// Function to get the current user's data
export const getCurrentUser = async () => {
  const supabase = useSupabaseClient();
  try {
    // Get and return the current user's data
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error getting current user:", error.message);
    return null;
  }
};

// Function to handle user login
export const login = async (email, password) => {
  const supabase = useSupabaseClient();
  try {
    // Attempt to sign in the user with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    // Log and rethrow any errors that occur during login
    console.error("Error logging in:", error.message);
    throw error;
  }
};

// Function to handle user sign up
export const signUp = async (email, password) => {
  const supabase = useSupabaseClient();
  try {
    // Attempt to sign up a new user with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    // Log and rethrow any errors that occur during sign up
    console.error("Error signing up:", error.message);
    throw error;
  }
};
