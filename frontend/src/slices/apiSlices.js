import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants.js";

//Base setup for API calls but does not define specific endpoints yet.
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), //defines the base url
  tagTypes: ["Product", "Order", "User"], //tags used for caching and invalidation purposes
  endpoints: (builder) => ({}), //endpoints object is currently empty other slices to extend and inject their own endpoints into this base configuration
});
