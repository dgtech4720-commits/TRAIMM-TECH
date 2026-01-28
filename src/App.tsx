import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashboardPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import CreateProjectPage from "./pages/CreateProjectPage"; // New Import
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import "./App.css";
import { Layout } from "./components/layout/Index";
import { SignIn } from "./pages/auth/SignIn";
import { SignUp } from "./pages/auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnBoardingPage />
                </ProtectedRoute>
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
            {/* New Protected Route for CreateProjectPage */}
            <Route
              path="/create-project"
              element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              }
            />
            <Route path="/loading" element={<Loading />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
