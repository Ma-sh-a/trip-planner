// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import ProtectedRoute from "./components/protected-route";
import Home from "./pages/home";
import Auth from "./pages/auth";
import TripList from "./pages/trip-list";
import TripDetail from "./pages/trip-detail";
import Layout from "./components/layout";
import "./styles/index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            {/* Защищенные маршруты */}
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <TripList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trip/:tripId"
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
