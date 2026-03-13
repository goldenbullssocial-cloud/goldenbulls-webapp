"use client";

import { useEffect, useRef, useCallback } from "react";
import { removeCookie, getCookie } from "../../../cookie";
import toast from "react-hot-toast";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const THROTTLE_DELAY = 1000; // 1 second throttle for activity events
const LAST_ACTIVITY_KEY = "lastActivityTimestamp";

export default function InactivityLogout() {
  const timerRef = useRef(null);
  const lastThrottleRef = useRef(Date.now());

  const handleLogout = useCallback(() => {
    // Clear cookies
    removeCookie("userToken");
    removeCookie("user");

    // Clear localStorage items related to auth
    localStorage.removeItem(LAST_ACTIVITY_KEY);

    // Show toast message
    toast.dismiss();
    toast.error("Session expired due to inactivity. Please login again.");

    // Redirect to login
    window.location.href = "/login";
  }, []);

  const resetTimer = useCallback(() => {
    // Update last activity timestamp in localStorage (for cross-tab sync)
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    // Clear existing timer and set a new one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Throttle: only reset timer if enough time has passed since last reset
    if (now - lastThrottleRef.current >= THROTTLE_DELAY) {
      lastThrottleRef.current = now;
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Only run if user is authenticated
    const token = getCookie("userToken");
    if (!token) return;

    // Set initial activity timestamp and start timer
    resetTimer();

    // Listen for user activity events
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        // Another tab had activity, reset this tab's timer too
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener("storage", handleStorageChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleActivity, handleLogout, resetTimer]);

  // This component renders nothing
  return null;
}
