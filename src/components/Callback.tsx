import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";

const Callback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setError("Authorization failed. Please try again.");
          setLoading(false);
          return;
        }

        if (!code) {
          setError("No authorization code received.");
          setLoading(false);
          return;
        }

        // Exchange code for token
        const tokenResponse = await spotifyApi.exchangeCodeForToken(code);

        // Store tokens
        localStorage.setItem(
          "spotify_access_token",
          tokenResponse.access_token
        );
        if (tokenResponse.refresh_token) {
          localStorage.setItem(
            "spotify_refresh_token",
            tokenResponse.refresh_token
          );
        }

        // Set token in API service
        spotifyApi.setAccessToken(tokenResponse.access_token);

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Error during callback:", err);
        setError("Failed to authenticate with Spotify. Please try again.");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connecting to Spotify...
          </h2>
          <p className="text-gray-600">Getting your vibes ready! ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Callback;
