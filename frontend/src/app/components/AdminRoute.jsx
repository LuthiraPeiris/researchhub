import { Navigate } from "react-router-dom";
import { getToken, getCurrentUser } from "../services/authService";

const AdminRoute = ({ children }) => {
  const token = getToken();
  const currentUser = getCurrentUser();

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default AdminRoute;