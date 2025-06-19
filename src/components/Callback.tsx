import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

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
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ background: "linear-gradient(135deg, #1db954 0%, #191414 100%)" }}
      >
        <Paper
          elevation={6}
          sx={{ p: 6, borderRadius: 4, textAlign: "center", maxWidth: 400 }}
        >
          <CircularProgress color="success" sx={{ mb: 3 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Connecting to Spotify...
          </Typography>
          <Typography color="text.secondary">
            Getting your vibes ready! ✨
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ background: "linear-gradient(135deg, #1db954 0%, #191414 100%)" }}
      >
        <Paper
          elevation={6}
          sx={{ p: 6, borderRadius: 4, textAlign: "center", maxWidth: 400 }}
        >
          <Typography variant="h2" color="error" gutterBottom>
            💀
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Oops! Something went wrong
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {error}
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 8, fontWeight: 700 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default Callback;
