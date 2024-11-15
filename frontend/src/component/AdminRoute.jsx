import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.userInfo);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
