import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
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
import { Row, Col, Card, CardBody, CardImg } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import bg from "./static/bg.png";

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
  background: "#f5f5dc",
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
        const tracksData = await spotifyApi.getTopTracks(5, "short_term");
        setTopTracks(tracksData);
        const artistsData = await spotifyApi.getTopArtists(5, "short_term");
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
      <div className="container py-5">
        <div
          className="text-center mb-2"
          style={{ color: "#7a5a2f", fontSize: 16 }}
        >
          Based on 1 month of your music listening history....
        </div>
        <h2
          className="text-center mb-5 display-4 fw-bold"
          style={{ color: "#6d4c1c", letterSpacing: 1 }}
        >
          TOP 5 SONGS
        </h2>
        {/* Top 5 songs row */}
        <Row className="justify-content-center g-4 mb-5">
          {topTracks.map((track, idx) => (
            <Col
              key={track.id}
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className="d-flex align-items-stretch mb-4"
              style={{ maxWidth: "33.3333%" }}
            >
              <Card
                className="shadow rounded-4 border-0 w-100 position-relative"
                style={{
                  background: "#fffbe6",
                  minHeight: 120,
                  maxHeight: 160,
                  border: "2px dashed #e0cfa9",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div
                  className="d-flex flex-row align-items-center p-2"
                  style={{ width: "100%" }}
                >
                  <div
                    className="me-3 flex-shrink-0"
                    style={{ position: "relative" }}
                  >
                    {track.album.images?.[0]?.url ? (
                      <CardImg
                        src={track.album.images[0].url}
                        alt={track.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 10,
                          border: "2px solid #e0cfa9",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light border border-2 border-secondary rounded"
                        style={{
                          width: 70,
                          height: 70,
                          color: "#bfa76a",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Submit Photo
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: -10,
                        left: -10,
                        fontSize: 20,
                        filter: "drop-shadow(0 2px 4px #fffbe6)",
                      }}
                      role="img"
                      aria-label="music"
                    >
                      🎵
                    </span>
                  </div>
                  <CardBody className="p-0 ps-2" style={{ fontSize: 13 }}>
                    <h6
                      className="fw-bold mb-1"
                      style={{ color: "#6d4c1c", fontSize: 15 }}
                    >
                      {track.name}
                    </h6>
                    <div className="mb-1 text-muted" style={{ fontSize: 12 }}>
                      Artist: {track.artists.map((a) => a.name).join(", ")}
                    </div>
                    <div className="mb-1 text-muted" style={{ fontSize: 12 }}>
                      Album: {track.album.name}
                    </div>
                    <div className="mb-1 text-muted" style={{ fontSize: 12 }}>
                      Genre:{" "}
                      {topArtists.find((a) => a.name === track.artists[0]?.name)
                        ?.genres[0] || "-"}
                    </div>
                    <div className="mt-1">
                      <span
                        className="badge rounded-pill"
                        style={{
                          background: "#ffe6a1",
                          color: "#6d4c1c",
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </div>
                  </CardBody>
                </div>
                <span
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 12,
                    fontSize: 16,
                    opacity: 0.18,
                  }}
                  role="img"
                  aria-label="star"
                >
                  ⭐
                </span>
              </Card>
            </Col>
          ))}
        </Row>
        <style>{`
          @media (min-width: 768px) {
            .row.justify-content-center.g-4.mb-5 > .col-md-4:nth-child(4),
            .row.justify-content-center.g-4.mb-5 > .col-md-4:nth-child(5) {
              max-width: 50%;
              flex: 0 0 50%;
            }
          }
        `}</style>
        {/* 3 columns for artists, albums, genres */}
        <Row className="justify-content-center g-4">
          <Col xs={12} md={4} className="d-flex align-items-stretch">
            <Card
              className="shadow rounded-4 border-0 w-100"
              style={{
                background: "#fffbe6",
                minHeight: 220,
                border: "2px dashed #e0cfa9",
              }}
            >
              <CardBody>
                <h4 className="fw-bold mb-3" style={{ color: "#6d4c1c" }}>
                  TOP 5 ARTISTS
                </h4>
                <ul className="list-unstyled mb-0">
                  {topArtists.map((artist, idx) => (
                    <li
                      key={artist.id}
                      className="mb-2 d-flex align-items-center"
                    >
                      <span
                        className="me-2"
                        style={{ fontSize: 18 }}
                        role="img"
                        aria-label="artist"
                      >
                        🎤
                      </span>
                      <span style={{ color: "#7a5a2f", fontWeight: 500 }}>
                        {artist.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-stretch">
            <Card
              className="shadow rounded-4 border-0 w-100"
              style={{
                background: "#fffbe6",
                minHeight: 220,
                border: "2px dashed #e0cfa9",
              }}
            >
              <CardBody>
                <h4 className="fw-bold mb-3" style={{ color: "#6d4c1c" }}>
                  TOP 5 ALBUMS
                </h4>
                <ul className="list-unstyled mb-0">
                  {topAlbums.map((album, idx) => (
                    <li
                      key={album.id}
                      className="mb-2 d-flex align-items-center"
                    >
                      <span
                        className="me-2"
                        style={{ fontSize: 18 }}
                        role="img"
                        aria-label="album"
                      >
                        💿
                      </span>
                      <span style={{ color: "#7a5a2f", fontWeight: 500 }}>
                        {album.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-stretch">
            <Card
              className="shadow rounded-4 border-0 w-100"
              style={{
                background: "#fffbe6",
                minHeight: 220,
                border: "2px dashed #e0cfa9",
              }}
            >
              <CardBody>
                <h4 className="fw-bold mb-3" style={{ color: "#6d4c1c" }}>
                  TOP 5 GENRES
                </h4>
                <ul className="list-unstyled mb-0">
                  {topGenres.map((genre, idx) => (
                    <li key={genre} className="mb-2 d-flex align-items-center">
                      <span
                        className="me-2"
                        style={{ fontSize: 18 }}
                        role="img"
                        aria-label="genre"
                      >
                        🏷️
                      </span>
                      <span style={{ color: "#7a5a2f", fontWeight: 500 }}>
                        {genre}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Box>
  );
};

export default Dashboard;
