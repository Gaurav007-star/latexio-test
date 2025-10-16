export class ApiError extends Error {
  constructor(message, status, body = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

let globalLogoutCallback = () => {
  console.error("Logout callback is not set.");
};

export const configureApiFetch = (logoutCallback) => {
  globalLogoutCallback = logoutCallback;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api-iit-kgp-latex.demome.in/api";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem("token");

  // ✅ Only set JSON header if not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("auth-token", token);
  }

  let body = options.body;
  if (headers.get("Content-Type") === "application/json" && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
    });
  } catch (err) {
    throw new ApiError("Network error. Please try again.", 0);
  }

  if (response.status === 401 || response.status === 403) {
    globalLogoutCallback();
    throw new ApiError("Authentication failed.", response.status);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`Request failed with status ${response.status}`, response.status, errorText);
  }

  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("Failed to parse server response.", response.status);
  }
};
