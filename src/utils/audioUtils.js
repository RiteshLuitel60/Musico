import supabase from "../utils/supabaseClient";

const fetchAudioUrlFromSupabase = async (songKey) => {
  console.log("Fetching audio URL from Supabase for song key:", songKey);
  try {
    const { data, error } = await supabase
      .from("library_songs")
      .select("audio_url")
      .eq("song_key", songKey);

    if (error) throw error;
    console.log("Supabase response:", data);
    return data.length > 0 ? data[0].audio_url : null;
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

  console.log("getAudioUrl called with song:", song);

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
    const supabaseUrl = await fetchAudioUrlFromSupabase(song?.key || song?.id);
    if (supabaseUrl) {
      return supabaseUrl;
    }
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
  }

  console.warn("No audio URL found for song:", song);
  return "";
};
