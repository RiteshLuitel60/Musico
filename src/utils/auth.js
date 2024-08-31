// Import Supabase client from the supabaseClient file
import { supabase } from "../supabaseClient"; // Adjust the import path as needed

// Function to handle user logout
export const logout = async () => {
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
  // Get the current user's data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Return true if user exists, false otherwise
  return !!user;
};

// Function to get the current user's data
export const getCurrentUser = async () => {
  // Get and return the current user's data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Function to handle user login
export const login = async (email, password) => {
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
