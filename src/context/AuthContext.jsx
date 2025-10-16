/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";

import { apiFetch, configureApiFetch } from "../api/apiFetch";

const AuthContext = createContext(undefined);

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  }, []);

  const getNewUserDetails = useCallback(async () => {
    const fetchedUser = await fetchUserDetails();

    if (fetchedUser) {
      setUser(fetchedUser);
      localStorage.setItem("userName", fetchedUser.name);
    } else {
    }
  });

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await apiFetch("/auth/getuser");
      if (response && response.user) {
        return response.user;
      }
      return null;
    } catch (error) {
      console.error("AuthContext: Failed to fetch user details", error);
      return null;
    }
  }, []);

  const setTokenAndFetchUser = useCallback(
    async (newToken) => {
      setIsLoading(true);
      localStorage.setItem("token", newToken);
      setToken(newToken);

      const fetchedUser = await fetchUserDetails();

      if (fetchedUser) {
        setUser(fetchedUser);
        localStorage.setItem("userName", fetchedUser.name);
      } else {
        logout();
      }

      setIsLoading(false);
    },
    [logout, fetchUserDetails]
  );

  useEffect(() => {
    configureApiFetch(logout);
  }, [logout]);

  useEffect(() => {
    const verifyExistingToken = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        const fetchedUser = await fetchUserDetails();
        if (fetchedUser) {
          setUser(fetchedUser);
          setToken(storedToken);
        } else {
          logout();
        }
      } else {
        logout();
      }

      setIsLoading(false);
    };

    verifyExistingToken();
  }, [logout, fetchUserDetails]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setTokenAndFetchUser,
        logout,
        isLoading,
        getNewUserDetails,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
