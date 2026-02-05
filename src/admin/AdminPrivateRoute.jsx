import { Navigate } from "react-router-dom";

export function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
