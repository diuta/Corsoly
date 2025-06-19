import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
import { genZJudge } from "../services/genZJudge";
import { SpotifyUser, SpotifyTrack, GenZJudgment } from "../types/spotify";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { styled } from "@mui/material/styles";

const TypingSummary = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    let current = "";
    const words = text.split(" ");
    const interval = setInterval(() => {
      if (i < words.length) {
        current += (i === 0 ? "" : " ") + words[i];
        setDisplayed(current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: "text.primary", minHeight: 48 }}
    >
      {displayed}
    </Typography>
  );
};

const SpotifyPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #1db954 0%, #191414 100%)",
  color: "#fff",
  borderRadius: 20,
  boxShadow: theme.shadows[4],
}));

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [judgments, setJudgments] = useState<GenZJudgment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem("spotify_access_token");
        if (!token) {
          navigate("/");
          return;
        }

        spotifyApi.setAccessToken(token);

        // Load user profile
        const userData = await spotifyApi.getCurrentUser();
        setUser(userData);

        // Load recently played tracks
        const tracksData = await spotifyApi.getRecentlyPlayed(50);
        setTracks(tracksData);

        // Analyze tracks with Gen Z judgment
        const analysis = genZJudge.analyzePlaylist(tracksData);
        setJudgments(analysis.judgments);
        setSummary(analysis.summary);

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          "Failed to load your music data. Please try logging in again."
        );
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    spotifyApi.logout();
    navigate("/");
  };

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
            Analyzing your vibes...
          </Typography>
          <Typography color="text.secondary">
            Getting the Gen Z verdict ready! ✨
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
            onClick={handleLogout}
            variant="contained"
            color="success"
            sx={{ mt: 2, borderRadius: 8, fontWeight: 700 }}
          >
            Logout & Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      sx={{ background: "linear-gradient(135deg, #1db954 0%, #191414 100%)" }}
    >
      <AppBar
        position="static"
        sx={{ background: "#191414", boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ flexGrow: 1, color: "#fff", letterSpacing: 1 }}
          >
            <MusicNoteIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Spotify
            Gen Z Judge
          </Typography>
          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              {user.images?.[0] && (
                <Avatar src={user.images[0].url} alt={user.display_name} />
              )}
              <Typography color="#fff" fontWeight={600}>
                {user.display_name}
              </Typography>
            </Box>
          )}
          <Button
            onClick={handleLogout}
            color="inherit"
            sx={{
              ml: 3,
              borderRadius: 8,
              fontWeight: 700,
              background: "#1db954",
              color: "#fff",
              "&:hover": { background: "#1ed760" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {summary && (
          <SpotifyPaper sx={{ mb: 6, p: 4 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ mb: 2, color: "#1db954", letterSpacing: 1 }}
            >
              Your Vibe Summary ✨
            </Typography>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} md={4} textAlign="center">
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: "#1db954" }}
                >
                  {Math.round(summary.averageScore)}/100
                </Typography>
                <Typography color="#fff">Average Score</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: "#fff" }}
                >
                  {tracks.length}
                </Typography>
                <Typography color="#fff">Songs Analyzed</Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign="center">
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: "#fff" }}
                >
                  {Object.keys(summary.vibeBreakdown).length}
                </Typography>
                <Typography color="#fff">Different Vibes</Typography>
              </Grid>
            </Grid>
            <Box mt={4} mb={2}>
              <TypingSummary text={summary.overallVibe} />
            </Box>
            <Divider sx={{ my: 3, background: "rgba(255,255,255,0.2)" }} />
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "#fff", mb: 2 }}
              >
                <EmojiEventsIcon sx={{ mr: 1, color: "#f1c40f" }} /> Top
                Judgments
              </Typography>
              <List>
                {summary.topJudgments.map((judgment: string, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      background: "rgba(25,20,20,0.7)",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "#1db954",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography color="#fff" fontWeight={600}>
                          {judgment}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </SpotifyPaper>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
