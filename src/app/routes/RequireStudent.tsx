import { Navigate } from "react-router-dom";
import { getCurrentStudent } from "../../features/auth/lib/student";

export default function RequireStudent({ children }: { children: React.ReactNode }) {
  const student = getCurrentStudent();
  if (!student) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
