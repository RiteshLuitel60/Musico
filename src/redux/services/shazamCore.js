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
      transformResponse: (response) => response.slice(0, 51), // Limit the data to 50 items
    }),

    getSongDetails: builder.query({
      query: (songid) => `/v2/tracks/details?track_id=${songid}`, // Correctly formatted URL
    }),

    getSongRelated: builder.query({
      query: (songid) => `/v1/tracks/related?offset=0&track_id=${songid}`, // Correctly formatted URL for related songs
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} = shazamCoreApi;
