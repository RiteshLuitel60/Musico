import { supabase } from "./supabaseClient";

// Function to fetch audio URL from Supabase database
const fetchAudioUrlFromSupabase = async (songKey) => {
  console.log("Fetching audio URL from Supabase for song key:", songKey);
  try {
    const { data, error } = await supabase
      .from("library_songs")
      .select("audio_url")
      .eq("song_key", songKey)
      .single();

    if (error) throw error;
    console.log("Supabase response:", data);
    return data?.audio_url || null;
  } catch (error) {
    console.error("Error fetching audio URL from Supabase:", error);
    return null;
  }
};

// Main function to get audio URL from various sources
export const getAudioUrl = async (song) => {
  const audioUrl =
    song?.resources?.["shazam-songs"] &&
    Object.values(song.resources["shazam-songs"])[0]?.attributes?.streaming
      ?.preview;
  if (!song) {
    console.warn("No song provided to getAudioUrl");
    return "";
  }

  // Check different properties of the song object for audio URL
  if (song?.attributes?.previews?.[0]?.url) {
    return song.attributes.previews[0].url;
  } else if (song?.hub?.actions?.[1]?.uri) {
    return song.hub.actions[1].uri;
  } else if (song?.url) {
    return song.url;
  } else if (song?.audio_url) {
    return song.audio_url;
  } else if (audioUrl) {
    return audioUrl;
  }

  // If no URL found, try fetching from Supabase
  try {
    const songKey = song?.key || song?.id;
    if (songKey) {
      const supabaseUrl = await fetchAudioUrlFromSupabase(songKey);
      if (supabaseUrl) {
        return supabaseUrl;
      }
    }
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
  }

  // If no audio URL found, log a warning and return empty string
  console.warn("No audio URL found for song:", song);
  return "";
};
