import { supabase } from "./supabaseClient";

export const handleAddToLibrary = async (libraryId, song) => {
  try {
    if (!song) throw new Error("Song data is undefined");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const songData = {
      library_id: libraryId,
      song_key: song.key || song.id || `song-${Date.now()}`,
      title:
        song.title || (song.attributes && song.attributes.name) || "Untitled",
      artist:
        song.artist ||
        song.subtitle ||
        (song.attributes && song.attributes.artistName) ||
        "Unknown Artist",
      cover_art:
        song.cover_art ||
        (song.images && song.images.coverart) ||
        (song.attributes &&
          song.attributes.artwork &&
          song.attributes.artwork.url) ||
        "/path/to/default-cover.jpg",
      audio_url:
        song.audio_url ||
        (song.hub &&
          song.hub.actions &&
          song.hub.actions.find((action) => action.type === "uri")?.uri) ||
        (song.attributes &&
          song.attributes.previews &&
          song.attributes.previews[0]?.url) ||
        "/path/to/default-audio.mp3",
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("library_songs")
      .insert(songData)
      .select();

    if (error) throw error;
    return { success: true, addedSong: data[0] };
  } catch (error) {
    console.error("Error adding song to library:", error);
    return { success: false, error };
  }
};

export const handleCreateLibrary = async (song) => {
  try {
    if (!song) throw new Error("Song data is undefined");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const name = prompt("Enter a name for the new library:");
    if (!name) return { success: false, error: "Library name is required" };

    const { data, error } = await supabase
      .from("libraries")
      .insert({ name, user_id: user.id })
      .select();

    if (error) throw error;

    const newLibrary = data[0];

    // Add the song to the newly created library
    await handleAddToLibrary(newLibrary.id, song);

    return { success: true, library: newLibrary };
  } catch (error) {
    console.error("Error creating library:", error);
    return { success: false, error };
  }
};

export const fetchUserLibraries = async () => {
  try {
    const cachedLibraries = localStorage.getItem("userLibraries");
    if (cachedLibraries) {
      return { success: true, libraries: JSON.parse(cachedLibraries) };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("libraries")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    localStorage.setItem("userLibraries", JSON.stringify(data));
    return { success: true, libraries: data };
  } catch (error) {
    console.error("Error fetching user libraries:", error);
    return { success: false, error };
  }
};

export const fetchLibrarySongs = async (libraryId) => {
  try {
    const { data, error } = await supabase
      .from("library_songs")
      .select("*")
      .eq("library_id", libraryId);

    if (error) throw error;

    return { success: true, songs: data };
  } catch (error) {
    console.error("Error fetching library songs:", error);
    return { success: false, error };
  }
};
