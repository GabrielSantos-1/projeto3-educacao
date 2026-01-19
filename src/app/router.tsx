import { createBrowserRouter } from "react-router-dom";

import RequireStudent from "./routes/RequireStudent";
import LoginRoute from "./routes/LoginRoute";

import AppLayout from "./layout/AppLayout";
import HomeRoute from "./routes/HomeRoute";
import TutorialRoute from "./routes/TutorialRoute";
import TutorialDetailRoute from "./routes/TutorialDetailRoute";
import TypingRoute from "./routes/TypingRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginRoute /> },
   {
    path: "/",
    element: (
      <RequireStudent>
        <AppLayout />
      </RequireStudent>
    ),
    children: [
      { index: true, element: <HomeRoute /> },

      { path: "tutoriais", element: <TutorialRoute /> },
      { path: "tutoriais/:tutorialId", element: <TutorialDetailRoute /> },

      { path: "jogo", element: <TypingRoute /> },
    ],
  },
]);







