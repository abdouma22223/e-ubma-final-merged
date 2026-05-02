import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const redirectPath = role === "admin"
      ? "/admin"
      : role === "professor"
        ? "/teacher-space"
        : "/student-space";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
