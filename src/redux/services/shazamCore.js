import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Import necessary functions from Redux Toolkit

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Function to wait for a specified time

// Custom fetch function with retry logic
const customFetch = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options); // Fetch the URL with options
    if (response.status === 429 && retries > 0) {
      // Check for rate limit
      await wait(delay); // Wait before retrying
      return customFetch(url, options, retries - 1, delay * 2); // Retry with exponential backoff
    }
    return response; // Return the response if successful
  } catch (error) {
    if (retries > 0) {
      // Check if retries are available
      await wait(delay); // Wait before retrying
      return customFetch(url, options, retries - 1, delay * 2); // Retry with exponential backoff
    }
    throw error; // Throw error if no retries left
  }
};

const queue = []; // Initialize a queue for requests
let isProcessing = false; // Flag to check if processing is ongoing

// Function to process the request queue
const processQueue = async () => {
  if (isProcessing || queue.length === 0) return; // Exit if already processing or queue is empty
  isProcessing = true; // Set processing flag
  const { resolve, reject, args } = queue.shift(); // Get the next request from the queue
  try {
    const result = await customFetch(...args); // Fetch the result
    resolve(result); // Resolve the promise with the result
  } catch (error) {
    reject(error); // Reject the promise if there's an error
  }
  isProcessing = false; // Reset processing flag
  setTimeout(processQueue, 200); // Ensure at least 200ms between requests
};

// Function to queue fetch requests
const queuedFetch = (...args) => {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, args }); // Add request to the queue
    processQueue(); // Start processing the queue
  });
};

// Create the Shazam Core API
export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi", // Set the reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shazam-core.p.rapidapi.com", // Base URL for the API
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        "fec4224f99mshbf530c7f64c4359p1a192bjsnb3fbf34b7aa1" // Set the API key in headers
      );
      return headers; // Return modified headers
    },
    fetchFn: queuedFetch, // Use the queued fetch function
  }),

  // Define API endpoints
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => "/v1/charts/world?country_code=DZ", // Query for top charts
      transformResponse: (response) => response.slice(0, 50), // Transform response to return top 50
    }),
    getSongsByGenre: builder.query({
      query: (genre) =>
        `/v1/charts/genre-world?genre_code=${genre}&country_code=DZ`, // Query for songs by genre
    }),
    getSongDetails: builder.query({
      query: (songid) => `/v2/tracks/details?track_id=${songid}`, // Query for song details
    }),
    getSongRelated: builder.query({
      query: (songid) => `/v1/tracks/related?offset=0&track_id=${songid}`, // Query for related songs
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `/v2/artists/details?artist_id=${artistId}`, // Query for artist details
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) =>
        `/v1/charts/country?country_code=${countryCode || "DZ"}`, // Query for songs by country
      transformResponse: (response) => response.slice(0, 50), // Transform response to return top 50
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) =>
        `/v1/search/multi?query=${searchTerm}&search_type=SONGS_ARTISTS&offset=0`, // Query for songs by search term
    }),
    recognizeSong: builder.mutation({
      query: (audioData) => ({
        url: "/v1/tracks/recognize", // URL for recognizing a song
        method: "POST", // HTTP method
        body: audioData, // Body of the request
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useRecognizeSongMutation,
} = shazamCoreApi; // Export the generated hooks
