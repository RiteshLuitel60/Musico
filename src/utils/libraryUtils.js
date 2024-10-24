import { supabase } from "./supabaseClient";

// Add a song to a specific library
export const handleAddToLibrary = async (libraryId, song) => {
  // Helper function to get artist ID from various song object structures
  const getArtistId = () =>
    song?.artist_id ||
    song?.artists?.[0]?.adamid ||
    song?.relationships?.artists?.data[0]?.id ||
    artist_id ||
    "";

  // Helper function to get song ID from various song object structures
  const getSongId = () =>
    song?.song_key || song?.hub?.actions[0]?.id || song?.key || song?.id || "";

  try {
    if (!song) throw new Error("Song data is undefined");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Prepare song data for insertion
    const songData = {
      library_id: libraryId,
      song_key: getSongId(),
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
      artist_id: getArtistId(),
    };

    // Insert song data into the library_songs table
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

// Create a new library and add a song to it
export const handleCreateLibrary = async (song) => {
  try {
    if (!song) throw new Error("Song data is undefined");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Prompt user for library name
    const name = prompt("Enter a name for the new library:");
    if (!name) return { success: false, error: "Library name is required" };

    // Create new library
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

// Fetch all libraries for the current user
export const fetchUserLibraries = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("User not authenticated");

    // Fetch libraries for the current user
    const { data, error } = await supabase
      .from("libraries")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    return { success: true, libraries: data };
  } catch (error) {
    console.error("Error fetching user libraries:", error);
    return { success: false, error };
  }
};

// Fetch all songs in a specific library
export const fetchLibrarySongs = async (libraryId) => {
  try {
    // Fetch songs for the specified library
    const { data, error } = await supabase
      .from("library_songs")
      .select("*")
      .eq("library_id", libraryId);

    if (error) throw error;

    // Transform the fetched data
    return {
      success: true,
      songs: data.map((song) => ({
        ...song,
        key: song.song_key,
        title: song.title,
        isLikedSongs: true,
      })),
    };
  } catch (error) {
    console.error("Error fetching library songs:", error);
    return { success: false, error };
  }
};
