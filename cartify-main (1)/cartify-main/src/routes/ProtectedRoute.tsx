import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: ("ADMIN" | "USER" | "SUPER_ADMIN")[];
}) => {
  const { isLoggedIn, isAuthChecked, user } = useSelector(
    (state: RootState) => state.auth
  );

  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;