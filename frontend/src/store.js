import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlices.js";
import cartRducer from "./slices/cartSlice.js";
import userInfoReducer from "./slices/userInfoSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartRducer,
    userInfo: userInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
