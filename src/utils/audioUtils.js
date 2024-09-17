import { supabase } from "./supabaseClient";

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

export const getAudioUrl = async (song) => {
  if (!song) {
    console.warn("No song provided to getAudioUrl");
    return "";
  }

  if (song?.attributes?.previews?.[0]?.url) {
    return song.attributes.previews[0].url;
  } else if (song?.hub?.actions?.[1]?.uri) {
    return song.hub.actions[1].uri;
  } else if (song?.url) {
    return song.url;
  } else if (song?.audio_url) {
    return song.audio_url;
  }

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

  console.warn("No audio URL found for song:", song);
  return "";
};
