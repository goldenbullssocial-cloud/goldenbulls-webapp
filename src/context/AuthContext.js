"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import client from "@/graphql/graphqlClient";
import { ApolloProvider } from "@apollo/client/react"; 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { getProfile } from "@/services/dashboard";
import { getCookie } from "../../cookie";
import { calculateProfileCompletion } from "@/utils/profileUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const refreshProfile = useCallback(async (userId) => {
    if (!userId) {
      const userCookie = getCookie("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          userId = parsedUser._id;
        } catch (e) {
          console.error("Error parsing user cookie", e);
        }
      }
    }

    if (userId) {
      try {
        const response = await getProfile(userId);
        if (response.success) {
          const data = response.payload.data[0];
          console.log("DEBUG AuthContext profile data:", data);
          setProfile(data);
          const percentage = calculateProfileCompletion(data);
          console.log("DEBUG AuthContext completionPercentage:", percentage);
          setCompletionPercentage(percentage);
        }
      } catch (error) {
        console.error("Error fetching profile in AuthContext:", error);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        refreshProfile();
      } else {
        setProfile(null);
        setCompletionPercentage(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [refreshProfile]);

  useEffect(() => {
    // Also check if we have a user cookie even if Firebase isn't synced yet
    const userCookie = getCookie("user");
    if (userCookie && !profile && !loading) {
      console.log("DEBUG AuthContext: cookie found but no profile, refreshing...");
      refreshProfile();
    }
  }, [profile, loading, refreshProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, completionPercentage, refreshProfile }}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
