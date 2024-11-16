export const roundDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //items price
  state.itemsPrice = Number(
    roundDecimal(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  );
  //shipping price
  state.shippingPrice = Number(roundDecimal(state.itemsPrice > 0 ? 100 : 0));
  //tax price
  state.taxPrice = Number(roundDecimal(state.itemsPrice * 0.15));
  //total price
  state.totalPrice = state.itemsPrice + state.shippingPrice + state.taxPrice;

  localStorage.setItem("cart", JSON.stringify(state));
};
