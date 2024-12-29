import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home-page/Home";
import { AuthProvider } from "./contexts/AuthProvider";
import AuthForm from "./components/auth/AuthForm";
import Header from "./components/layout/Header";
import VerifyEmailPage from "./components/auth/VerifyEmailPage";
import Settings from "./components/settings/Settings";
import Challenges from "./components/challenges/Challenges";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import MotivationalWall from "./components/motivational-wall/MotivationalWall";
import "./App.css";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import NotFound from "./components/not-found/NotFound";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Header />
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
              <Route path="/motivational-wall" element={<MotivationalWall />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </div>
  );
};

export default App;
