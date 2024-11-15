import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./component/Header";
import Footer from "./component/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoute from "./component/PriverRoute";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminRoute from "./component/AdminRoute";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
const App = () => {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Container>
            <Routes>
              <Route index={true} path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
              <Route path="/page/:pageNumber" element={<HomeScreen />} />
              <Route
                path="/search/:keyword/page/:pageNumber"
                element={<HomeScreen />}
              />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />

              <Route path="" element={<PrivateRoute />}>
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>

              <Route path="" element={<AdminRoute />}>
                <Route path="/admin/orderlist" element={<OrderListScreen />} />
                <Route
                  path="/admin/productlist"
                  element={<ProductListScreen />}
                />
                <Route
                  path="/admin/productlist/:pageNumber"
                  element={<ProductListScreen />}
                />
                <Route
                  path="/admin/product/:id/edit"
                  element={<ProductEditScreen />}
                />
                <Route path="/admin/userlist" element={<UserListScreen />} />
                <Route
                  path="/admin/user/:id/edit"
                  element={<UserEditScreen />}
                />
              </Route>
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
