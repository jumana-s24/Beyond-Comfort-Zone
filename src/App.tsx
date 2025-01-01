import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";

// Lazy-loaded components
const Home = React.lazy(() => import("./components/home-page/Home"));
const AuthForm = React.lazy(() => import("./components/auth/AuthForm"));
const VerifyEmailPage = React.lazy(
  () => import("./components/auth/VerifyEmailPage")
);
const Settings = React.lazy(() => import("./components/settings/Settings"));
const Challenges = React.lazy(
  () => import("./components/challenges/Challenges")
);
const Dashboard = React.lazy(() => import("./components/dashboard/Dashboard"));
const MotivationalWall = React.lazy(
  () => import("./components/motivational-wall/MotivationalWall")
);
const NotFound = React.lazy(() => import("./components/not-found/NotFound"));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/register" element={<AuthForm />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route
                  path="/settings/*"
                  element={<PrivateRoute component={Settings} />}
                />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute component={Dashboard} />}
                />
                <Route path="/challenges/*" element={<Challenges />} />
                <Route
                  path="/motivational-wall"
                  element={<MotivationalWall />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </div>
  );
};

export default App;
