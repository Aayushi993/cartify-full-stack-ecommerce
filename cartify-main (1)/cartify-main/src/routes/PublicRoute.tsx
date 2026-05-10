import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAuthChecked, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthChecked) return null;

  if (isLoggedIn) {
    // 🔥 role based redirect
    if (user?.role === "SUPER_ADMIN") return <Navigate to="/super-admin" />;
    if (user?.role === "ADMIN") return <Navigate to="/admin" />;

    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PublicRoute;