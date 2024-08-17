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
      transformResponse: (response) => {
        // Shuffle the array
        const shuffled = response.sort(() => 0.5 - Math.random());
        // Return the first 50 items
        return shuffled.slice(0, 50);
      },
    }),

    getSongDetails: builder.query({
      query: (songid) => `/v2/tracks/details?track_id=${songid}`, // Correctly formatted URL
    }),

    getSongRelated: builder.query({
      query: (songid) => `/v1/tracks/related?offset=0&track_id=${songid}`, // Correctly formatted URL for related songs
    }),

    getArtistDetails: builder.query({
      query: (artistId) => `/v2/artists/details?artist_id=${artistId}`, // Correctly formatted URL for artist details
    }),

    getSongsByCountry: builder.query({
      query: (countryCode) => `/v1/charts/country?country_code=${countryCode}`, // Correctly formatted URL for songs by country
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
} = shazamCoreApi;
