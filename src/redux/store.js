import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import playerReducer from "./features/playerSlice";
import { shazamCoreApi } from "./services/shazamCore"; // Ensure this path is correct

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    // Add ShazamCore API reducer
    [shazamCoreApi.reducerPath]: shazamCoreApi.reducer,
    // Add player reducer
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add ShazamCore API middleware to the default middleware
    getDefaultMiddleware().concat(shazamCoreApi.middleware),
});
