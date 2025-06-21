import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
import {
  SpotifyUser,
  SpotifyTrack,
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
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import bg from "./Static/bg.png";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<SpotifyAlbum[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        const tracksData = await spotifyApi.getTopTracks(5, "short_term");
        setTopTracks(tracksData);
        const artistsData = await spotifyApi.getTopArtists(5, "short_term");
        setTopArtists(artistsData);

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

  const cardStyles = {
    background: "#fffbe6",
    border: "2px dashed #e0cfa9",
    borderRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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
        sx={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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
      sx={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
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
            <MusicNoteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Corsoly
          </Typography>
          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              {user.images?.[0] && (
                <Avatar src={user.images[0].url} alt={user.display_name} />
              )}
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Arial, sans-serif",
                  fontSize: { xs: 12, sm: 14 },
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
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
              background: "#1db954",
              color: "#fff",
              "&:hover": { background: "#1ed760" },
              fontFamily: "Arial, sans-serif",
              fontSize: { xs: 11, sm: 12 },
              fontWeight: 700,
              letterSpacing: 1,
              paddingX: { xs: 2, sm: 3 },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 5 }}>
        <Typography
          align="center"
          sx={{ color: "#7a5a2f", fontSize: { xs: 14, sm: 16 }, mb: 1 }}
        >
          Based on 1 month of your music listening history....
        </Typography>
        <Typography
          align="center"
          fontWeight="bold"
          sx={{
            color: "#6d4c1c",
            letterSpacing: 1,
            mb: 5,
            typography: { xs: "h4", sm: "h2" },
          }}
        >
          TOP 5 SONGS
        </Typography>

        {/* --- Top 5 Songs Grid --- */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
          {topTracks.map((track, idx) => (
            <Grid item xs={12} sm={6} md={4} key={track.id}>
              <Card
                sx={{
                  ...cardStyles,
                  position: "relative",
                  flexDirection: "row",
                  alignItems: "center",
                  p: { xs: 1, sm: 1.5 },
                  minHeight: { xs: 100, sm: 120 },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    mr: { xs: 1, sm: 2 },
                    flexShrink: 0,
                  }}
                >
                  {track.album.images?.[0]?.url ? (
                    <CardMedia
                      component="img"
                      image={track.album.images[0].url}
                      alt={track.name}
                      sx={{
                        width: { xs: 50, sm: 70 },
                        height: { xs: 50, sm: 70 },
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "2px solid #e0cfa9",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                      }}
                    />
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: { xs: 50, sm: 70 },
                        height: { xs: 50, sm: 70 },
                        background: "#f5f5f5",
                        border: "2px solid #e0cfa9",
                        borderRadius: 2,
                        color: "#bfa76a",
                        fontWeight: 600,
                        fontSize: { xs: 10, sm: 12 },
                      }}
                    >
                      No Photo
                    </Box>
                  )}
                  <Typography
                    component="span"
                    sx={{
                      position: "absolute",
                      top: -10,
                      left: -10,
                      fontSize: { xs: 16, sm: 20 },
                      filter: "drop-shadow(0 2px 4px #fffbe6)",
                    }}
                  >
                    🎵
                  </Typography>
                </Box>
                <CardContent sx={{ p: "0 !important", flex: 1, minWidth: 0 }}>
                  <Typography
                    noWrap
                    fontWeight="bold"
                    sx={{ color: "#6d4c1c", fontSize: { xs: 12, sm: 15 } }}
                  >
                    {track.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 10, sm: 12 },
                    }}
                  >
                    Artist: {track.artists.map((a) => a.name).join(", ")}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 10, sm: 12 },
                    }}
                  >
                    Album: {track.album.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 10, sm: 12 },
                    }}
                  >
                    Genre:{" "}
                    {topArtists.find((a) => a.name === track.artists[0]?.name)
                      ?.genres[0] || "-"}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      background: "#ffe6a1",
                      color: "#6d4c1c",
                      fontWeight: 600,
                      fontSize: { xs: 9, sm: 11 },
                      borderRadius: "16px",
                      px: 1,
                      py: 0.2,
                      display: "inline-block",
                    }}
                  >
                    #{idx + 1}
                  </Box>
                </CardContent>
                <Typography
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 6,
                    right: 12,
                    fontSize: { xs: 12, sm: 16 },
                    opacity: 0.18,
                  }}
                >
                  ⭐
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --- Artists, Albums, Genres Grid --- */}
        <Grid container spacing={2} justifyContent="center">
          {/* Top 5 Artists */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#6d4c1c", mb: 2, fontSize: { xs: 16, sm: 20 } }}
                >
                  TOP 5 ARTISTS
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                  {topArtists.map((artist) => (
                    <Box
                      component="li"
                      key={artist.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography
                        component="span"
                        sx={{ mr: 1.5, fontSize: { xs: 16, sm: 18 } }}
                      >
                        🎤
                      </Typography>
                      <Typography
                        sx={{
                          color: "#7a5a2f",
                          fontWeight: 500,
                          fontSize: { xs: 12, sm: 14 },
                        }}
                      >
                        {artist.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Albums */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#6d4c1c", mb: 2, fontSize: { xs: 16, sm: 20 } }}
                >
                  TOP 5 ALBUMS
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                  {topAlbums.map((album) => (
                    <Box
                      component="li"
                      key={album.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography
                        component="span"
                        sx={{ mr: 1.5, fontSize: { xs: 16, sm: 18 } }}
                      >
                        💿
                      </Typography>
                      <Typography
                        sx={{
                          color: "#7a5a2f",
                          fontWeight: 500,
                          fontSize: { xs: 12, sm: 14 },
                        }}
                      >
                        {album.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Genres */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#6d4c1c", mb: 2, fontSize: { xs: 16, sm: 20 } }}
                >
                  TOP 5 GENRES
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                  {topGenres.map((genre) => (
                    <Box
                      component="li"
                      key={genre}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography
                        component="span"
                        sx={{ mr: 1.5, fontSize: { xs: 16, sm: 18 } }}
                      >
                        🏷️
                      </Typography>
                      <Typography
                        sx={{
                          color: "#7a5a2f",
                          fontWeight: 500,
                          fontSize: { xs: 12, sm: 14 },
                        }}
                      >
                        {genre}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
