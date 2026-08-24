/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function useUpdateUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token] = useState<string | null | any>(Cookies.get("authToken"));

  const updateUserProfile = async (updates: Record<string, any>) => {
    if (!token) {
      alert("Session Expired, Kindly Login again");
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}/user/update-profile`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Error updating profile:", err.message);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserProfile, isLoading, error, success };
}

export default useUpdateUserProfile;
