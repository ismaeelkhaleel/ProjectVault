import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/Forgot-Password";
import UpdatePassword from "./pages/auth/Update-Password";
import VerifyOTP from "./pages/auth/Verification";
import Dashboard from "./layout/Dashboard";
import CommentProject from "./pages/My_Profile/Comment_Project";
import LikedProject from "./pages/My_Profile/Liked_Project";
import SavedProject from "./pages/My_Profile/Saved_Project";
import YourProject from "./pages/My_Profile/Your_Project";
import MyProfile from "./pages/My_Profile/Your_Profile";
import ProjectDetails from "./pages/Project/Project_Detail/index";
import Projects from "./pages/Project/See_All_Projects/index";
import UserPage from "./pages/My_Profile/See_All_Profiles";
import ProjectForm from "./pages/Project/Project_Add";
import NotificationListener from "./components/NotificationListener";
import Homepage from "./pages/Homepage/index";
import AdminDashboard from "./layout/Admin";
import ProfileDetail from "./layout/Admin/ProfileDetail";
import NavFooter from "./layout/NavAndFooter";

const ProtectedRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("token");
  const isAdmin = loggedInUser?.type === "admin";

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  const adminPaths = ["/admin", "/profile-verify/detail"];
  const isAdminPath = adminPaths.some((path) =>
    window.location.pathname.startsWith(path)
  );

  if (isAdminPath && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAdminPath && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return !token ? children : null;
};

const App = () => {
  const userId = localStorage.getItem("userId");
  return (
    <Router>
      <NavFooter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/auth/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/verify-otp"
            element={
              <AuthRoute>
                <VerifyOTP />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/update-password"
            element={
              <AuthRoute>
                <UpdatePassword />
              </AuthRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comment_project"
            element={
              <ProtectedRoute>
                <CommentProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/liked_project"
            element={
              <ProtectedRoute>
                <LikedProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved_project"
            element={
              <ProtectedRoute>
                <SavedProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/your_project"
            element={
              <ProtectedRoute>
                <YourProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my_profile/:id"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-details/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project_submit_form"
            element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <NotificationListener userId={userId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-verify/detail/:id"
            element={
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </NavFooter>
    </Router>
  );
};

export default App;
