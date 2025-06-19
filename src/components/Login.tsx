import React from "react";
import { spotifyApi } from "../services/spotifyApi";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Container,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSpotifyLogin = () => {
    const authUrl = spotifyApi.generateAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "linear-gradient(135deg, #1db954 0%, #191414 100%)" }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(25,20,20,0.95)",
          }}
        >
          <Box mb={4}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: "#1db954",
                letterSpacing: 1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MusicNoteIcon sx={{ mr: 1, fontSize: 40, color: "#1db954" }} />
              Gen Z Song Judge
            </Typography>
            <Typography color="#fff" variant="h6">
              Let's see what your music taste says about you fr fr 💅
            </Typography>
          </Box>
          <Box mb={4}>
            <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
              Connect with Spotify
            </Typography>
            <Typography color="#b2ffb2" mb={3}>
              We'll analyze your last 50 songs and give you the Gen Z verdict ✨
            </Typography>
            <Button
              onClick={handleSpotifyLogin}
              variant="contained"
              sx={{
                background: "#1db954",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 8,
                px: 4,
                py: 1.5,
                fontSize: 18,
                "&:hover": { background: "#1ed760" },
                mb: 2,
              }}
              startIcon={
                <Avatar
                  src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                  sx={{ width: 32, height: 32, bgcolor: "transparent" }}
                />
              }
            >
              Login with Spotify
            </Button>
          </Box>
          <Box mb={3}>
            <Typography color="#fff" fontSize={16}>
              ✨ We'll judge your music taste with Gen Z energy
            </Typography>
            <Typography color="#fff" fontSize={16}>
              🎵 Analyze your last 50 played songs
            </Typography>
            <Typography color="#fff" fontSize={16}>
              🔥 Get the ultimate vibe check
            </Typography>
          </Box>
          <Typography color="#b2b2b2" fontSize={13}>
            By logging in, you agree to let us access your recently played
            tracks for analysis. We don't store any personal data, just vibes!
            ✨
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
