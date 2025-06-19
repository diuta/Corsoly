import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
import { genZJudge } from "../services/genZJudge";
import {
  SpotifyUser,
  SpotifyTrack,
  GenZJudgment,
  SpotifyArtist,
  SpotifyAlbum,
} from "../types/spotify";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Paper,
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
import { styled } from "@mui/material/styles";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// @ts-ignore
import confetti from "canvas-confetti";

const TypingSummary = ({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
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
        setDone(true);
        onDone();
      }
    }, 180);
    return () => clearInterval(interval);
    // eslint-disable-next-line
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

const BouncyEmoji = styled("span")<any>(({ bounce }: { bounce: boolean }) => ({
  display: "inline-block",
  fontSize: 36,
  marginLeft: 8,
  animation: bounce
    ? "bounce-emoji 0.7s cubic-bezier(.36,.07,.19,.97) both"
    : "none",
  "@keyframes bounce-emoji": {
    "0%": { transform: "translateY(0)" },
    "30%": { transform: "translateY(-20px)" },
    "50%": { transform: "translateY(0)" },
    "70%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0)" },
  },
}));

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<SpotifyAlbum[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [emojiBounce, setEmojiBounce] = useState(false);
  const confettiFired = useRef(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("spotify_access_token");
        if (!token) {
          navigate("/");
          return;
        }
        spotifyApi.setAccessToken(token);
        const userData = await spotifyApi.getCurrentUser();
        setUser(userData);
        // Fetch top tracks and artists
        const tracksData = await spotifyApi.getTopTracks(5);
        setTopTracks(tracksData);
        const artistsData = await spotifyApi.getTopArtists(5);
        setTopArtists(artistsData);
        // Aggregate albums from top tracks
        const albumMap: { [id: string]: SpotifyAlbum } = {};
        tracksData.forEach((track) => {
          if (!albumMap[track.album.id]) {
            albumMap[track.album.id] = {
              id: track.album.id,
              name: track.album.name,
              images: track.album.images,
              artists: track.artists,
              external_urls: track.external_urls,
            };
          }
        });
        setTopAlbums(Object.values(albumMap).slice(0, 5));
        // Aggregate genres from top artists
        const genreCount: { [genre: string]: number } = {};
        artistsData.forEach((artist) => {
          artist.genres.forEach((genre: string) => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        });
        const sortedGenres = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .map(([genre]) => genre)
          .slice(0, 5);
        setTopGenres(sortedGenres);
        setLoading(false);
      } catch (err) {
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

  const handleSummaryDone = () => {
    if (!confettiFired.current) {
      setShowConfetti(true);
      setEmojiBounce(true);
      confettiFired.current = true;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1db954", "#191414", "#fff", "#f1c40f", "#e84393"],
      });
      setTimeout(() => setEmojiBounce(false), 900);
    }
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
            Loading your top music...
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h2"
          fontWeight={800}
          align="center"
          sx={{ mb: 6, color: "#191414", letterSpacing: 1 }}
        >
          top 5 songs
        </Typography>
        {/* Top 5 songs row */}
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}
          mb={6}
        >
          {topTracks.map((track, idx) => (
            <Box
              key={track.id}
              width={{ xs: "100%", sm: "45%", md: "18%" }}
              minWidth={220}
            >
              <Card
                sx={{ borderRadius: 4, boxShadow: 4, p: 2, minHeight: 320 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 120,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5dc",
                    borderRadius: 2,
                  }}
                >
                  {track.album.images?.[0]?.url ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #bbb",
                        borderRadius: 8,
                        color: "#888",
                        fontWeight: 600,
                        fontSize: 14,
                        background: "#fff",
                      }}
                    >
                      Submit Photo
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {track.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Artist: {track.artists.map((a) => a.name).join(", ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Album: {track.album.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genre:{" "}
                    {topArtists.find((a) => a.name === track.artists[0]?.name)
                      ?.genres[0] || "-"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        {/* 3 columns for artists, albums, genres */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          justifyContent="center"
        >
          <Box flex={1} minWidth={220}>
            <Paper sx={{ p: 3, borderRadius: 4, minHeight: 220 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                top 5 artists
              </Typography>
              <List>
                {topArtists.map((artist, idx) => (
                  <ListItem key={artist.id}>
                    <ListItemText primary={artist.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          <Box flex={1} minWidth={220}>
            <Paper sx={{ p: 3, borderRadius: 4, minHeight: 220 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                top 5 albums
              </Typography>
              <List>
                {topAlbums.map((album, idx) => (
                  <ListItem key={album.id}>
                    <ListItemText primary={album.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          <Box flex={1} minWidth={220}>
            <Paper sx={{ p: 3, borderRadius: 4, minHeight: 220 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                top 5 genres
              </Typography>
              <List>
                {topGenres.map((genre: string, idx: number) => (
                  <ListItem key={genre}>
                    <ListItemText primary={genre} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
