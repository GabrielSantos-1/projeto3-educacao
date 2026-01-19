import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentStudent } from "../../features/auth/lib/student";

export default function RequireStudent({ children }: { children: ReactNode }) {
  const student = getCurrentStudent();

  // ✅ só bloqueia se realmente não tiver aluno salvo
  if (!student) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
