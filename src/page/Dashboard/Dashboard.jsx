import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "../../components/Dashboard/Dashboard";

const DashboardPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoading && !auth.token) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [auth.isLoading, auth.token, navigate, location]);

  // Only render Dashboard if authenticated
  if (!auth.token && !auth.isLoading) return null;

  return <Dashboard />;
};

export default DashboardPage;