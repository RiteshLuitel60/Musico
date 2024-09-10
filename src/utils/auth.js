import { supabase } from "./supabaseClient";

// Function to handle user logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

// Function to check if a user is currently logged in
export const isLoggedIn = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return !!user;
  } catch (error) {
    console.error("Error checking login status:", error.message);
    return false;
  }
};

// Function to get the current user's data
export const getCurrentUser = async () => {
  try {
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
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

// Function to handle user sign up
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};
