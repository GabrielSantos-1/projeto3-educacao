import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentStudent } from "../../features/auth/lib/student";

export default function RequireStudent({ children }: { children: ReactNode }) {
  const student = getCurrentStudent();

  // ✅ se não tiver aluno válido, vai pro login
  if (!student || student.trim().length < 2) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
