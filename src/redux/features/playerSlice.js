import { createSlice } from "@reduxjs/toolkit";

// Initial state for the player
const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: "",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Set the active song and update current songs list
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;

      if (action.payload?.data?.tracks?.hits) {
        state.currentSongs = action.payload.data.tracks.hits.map(
          (hit) => hit.track
        );
      } else if (action.payload?.data?.properties) {
        state.currentSongs = action.payload?.data?.tracks;
      } else {
        state.currentSongs = action.payload.data;
      }

      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    // Move to the next song in the playlist
    nextSong: (state, action) => {
      if (state.currentSongs[action.payload]) {
        state.activeSong = state.currentSongs[action.payload];
      } else {
        state.activeSong = state.currentSongs[0];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    // Move to the previous song in the playlist
    prevSong: (state, action) => {
      if (state.currentSongs[action.payload]) {
        state.activeSong = state.currentSongs[action.payload];
      } else {
        state.activeSong = state.currentSongs[state.currentSongs.length - 1];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    // Toggle play/pause state
    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    // Set the selected genre list ID
    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },
  },
});

// Export actions
export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
} = playerSlice.actions;

// Export reducer
export default playerSlice.reducer;
