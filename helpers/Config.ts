/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

export const AuthToken = Cookies.get("authToken");
export const userId = Cookies.get("userId");

const API_BASE_URL = import.meta.env.VITE_DEVE_URL;

// Wrapper for non-component usage
export const fetchAuthToken = async () => {
  return Cookies.get("authToken") || null;
};

export const apiRequest = async (
  endpoint: string,
  method = "GET",
  body: any = null,
  redirectOnFail = true // Optional
) => {
  const token = await fetchAuthToken();

  if (!token && redirectOnFail) {
    alert("You need to be logged in to continue.");
    window.location.href = "/?auth=true";
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const parsedRes = await response.json();

  if (!response.ok) {
    console.log(parsedRes);
    throw new Error(parsedRes.message?.toString() || "Unknown error");
  }

  return parsedRes;
};
