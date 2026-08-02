import { createBrowserRouter } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthCallback } from "./pages/AuthCallback";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { PostProblem } from "./pages/PostProblem";
import { ProblemDetails } from "./pages/ProblemDetails";
import { UserProfile } from "./pages/UserProfile";
import { Leaderboard } from "./pages/Leaderboard";
import { KnowledgeArchive } from "./pages/KnowledgeArchive";
import { ReceivedSolutions } from "./pages/ReceivedSolutions";
import { MyProblems } from "./pages/MyProblems";
import { MySolutions } from "./pages/MySolutions";
import { SavedProblems } from "./pages/SavedProblems";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";

import { NotFound } from "./pages/NotFound";

// Admin imports
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminComments from "./pages/admin/AdminComments";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminArchive from "./pages/admin/AdminArchive";
import AdminFields from "./pages/admin/AdminFields";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/auth-callback",
    Component: AuthCallback,
  },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "post-problem", Component: PostProblem },
      { path: "problem/:id", Component: ProblemDetails },
      { path: "my-problems", Component: MyProblems },
      { path: "my-solutions", Component: MySolutions },
      { path: "received-solutions", Component: ReceivedSolutions },
      { path: "saved-problems", Component: SavedProblems },
      { path: "notifications", Component: NotificationsPage },
      { path: "settings", Component: SettingsPage },
      { path: "profile/:userId", Component: UserProfile },
      { path: "leaderboard", Component: Leaderboard },
      { path: "archive", Component: KnowledgeArchive },
    ],
  },

  // Admin route
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "posts", element: <AdminPosts /> },
      { path: "comments", element: <AdminComments /> },
      { path: "solutions", element: <AdminSolutions /> },
      { path: "archive", element: <AdminArchive /> },
      { path: "fields", element: <AdminFields /> },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);
