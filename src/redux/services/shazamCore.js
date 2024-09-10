import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shazam-core.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        "fec4224f99mshbf530c7f64c4359p1a192bjsnb3fbf34b7aa1"
      );
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => "/v1/charts/world?country_code=DZ",
      transformResponse: (response) => response.slice(0, 50),
    }),
    getSongsByGenre: builder.query({
      query: (genre) =>
        `v1/charts/genre-world?genre_code=${genre}&country_code=DZ`,
    }),
    getSongDetails: builder.query({
      query: (songid) => `/v2/tracks/details?track_id=${songid}`,
    }),
    getSongRelated: builder.query({
      query: (songid) => `/v1/tracks/related?offset=0&track_id=${songid}`,
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `/v2/artists/details?artist_id=${artistId}`,
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => `/charts/country?country_code=${countryCode}`,
      transformResponse: (response) => response.slice(0, 50),
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) =>
        `/v1/search/multi?query=${searchTerm}&search_type=SONGS_ARTISTS&offset=0`,
    }),
    recognizeSong: builder.mutation({
      query: (audioData) => ({
        url: "/v1/tracks/recognize",
        method: "POST",
        body: audioData,
      }),
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useRecognizeSongMutation,
} = shazamCoreApi;
