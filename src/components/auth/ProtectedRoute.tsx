import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type RequiredRole = "ADMIN" | "SUPERADMIN";

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: RequiredRole;
}) {
  const { isAuthenticated, claims } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !claims) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole === "SUPERADMIN" && claims.globalRole !== "SUPERADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Superadmin can also enter admin routes.
  if (requiredRole === "ADMIN") {
    const canAccessAsAdmin = claims.globalRole === "SUPERADMIN" || Boolean(claims.activeTenantId);
    if (!canAccessAsAdmin) {
      // Not a superadmin and not bound to any org — send to login rather than
      // bouncing to /superadmin, which would ping-pong back here forever.
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
