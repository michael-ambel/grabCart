import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const productsApiSlice = apiSlice.injectEndpoints({
  //function is used to add new endpoints to the existing apiSlice
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        //defines the endpoint's URL for fetching the list of products
        //url: `${PRODUCTS_URL}?keyword=${keyword}&pageNumber=${pageNumber}`,
        providesTags: ["Products"],

        //or
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
        },
        credentials: "include",
      }),
      keepUnusedDataFor: 5, //data should be kept in the cache for 5 seconds after it is no longer used
    }),

    getProduct: builder.query({
      query: (id) => ({
        //endpoint fetches data for a specific product
        url: `${PRODUCTS_URL}/${id}`,
        providesTags: ["Product"],
        credentials: "include",
      }),
      keepUnusedDataFor: 100,
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: PRODUCTS_URL,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}/reviews`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    getTopProduct: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductQuery,
} = productsApiSlice;
