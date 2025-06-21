import React from "react";
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
  useTheme,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import bg from "./Static/bg.png";

// --- Sample Data (Unchanged) ---
const sampleUser = {
  display_name: "Sample User",
  images: [{ url: "https://randomuser.me/api/portraits/men/1.jpg" }],
};

const sampleTopTracks = [
  {
    id: "1",
    name: "Sample Song 1",
    artists: [{ name: "Artist 1" }],
    album: {
      id: "a1",
      name: "Album 1",
      images: [{ url: "https://via.placeholder.com/150" }],
    },
  },
  {
    id: "2",
    name: "Sample Song 2",
    artists: [{ name: "Artist 2" }],
    album: {
      id: "a2",
      name: "Album 2",
      images: [{ url: "https://via.placeholder.com/150" }],
    },
  },
  {
    id: "3",
    name: "Sample Song 3",
    artists: [{ name: "Artist 3" }],
    album: {
      id: "a3",
      name: "Album 3",
      images: [{ url: "https://via.placeholder.com/150" }],
    },
  },
  {
    id: "4",
    name: "Sample Song 4",
    artists: [{ name: "Artist 4" }],
    album: {
      id: "a4",
      name: "Album 4",
      images: [{ url: "https://via.placeholder.com/150" }],
    },
  },
  {
    id: "5",
    name: "Sample Song 5",
    artists: [{ name: "Artist 5" }],
    album: {
      id: "a5",
      name: "Album 5",
      images: [{ url: "https://via.placeholder.com/150" }],
    },
  },
];

const sampleTopArtists = [
  { id: "ar1", name: "Artist 1", genres: ["Pop"] },
  { id: "ar2", name: "Artist 2", genres: ["Rock"] },
  { id: "ar3", name: "Artist 3", genres: ["Jazz"] },
  { id: "ar4", name: "Artist 4", genres: ["Hip-Hop"] },
  { id: "ar5", name: "Artist 5", genres: ["Classical"] },
];

const sampleTopAlbums = [
  { id: "a1", name: "Album 1" },
  { id: "a2", name: "Album 2" },
  { id: "a3", name: "Album 3" },
  { id: "a4", name: "Album 4" },
  { id: "a5", name: "Album 5" },
];

const sampleTopGenres = ["Pop", "Rock", "Jazz", "Hip-Hop", "Classical"];

// --- Refactored Component ---
const DashboardSample: React.FC = () => {
  const theme = useTheme();

  const cardStyles = {
    background: "#fffbe6",
    border: "2px dashed #e0cfa9",
    borderRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
  };

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
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={sampleUser.images[0].url}
              alt={sampleUser.display_name}
            />
            <Typography
              sx={{
                color: "#fff",
                fontFamily: "Arial, sans-serif",
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {sampleUser.display_name}
            </Typography>
          </Box>
          <Button
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
          {sampleTopTracks.map((track, idx) => (
            <Grid item xs={4} key={track.id}>
              <Card
                sx={{
                  ...cardStyles,
                  position: "relative",
                  flexDirection: 'row',
                  alignItems: 'center',
                  p: { xs: 1, sm: 1.5 },
                  minHeight: { xs: 100, sm: 120 }
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    mr: { xs: 1, sm: 2 },
                    flexShrink: 0,
                  }}
                >
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
                   <Typography component="span" sx={{ position: 'absolute', top: -10, left: -10, fontSize: {xs: 16, sm: 20}, filter: 'drop-shadow(0 2px 4px #fffbe6)'}}>🎵</Typography>
                </Box>
                <CardContent sx={{ p: '0 !important', flex: 1, minWidth: 0 }}>
                  <Typography
                    noWrap
                    fontWeight="bold"
                    sx={{ color: "#6d4c1c", fontSize: { xs: 12, sm: 15 } }}
                  >
                    {track.name}
                  </Typography>
                  <Typography noWrap sx={{ color: "text.secondary", fontSize: { xs: 10, sm: 12 } }}>
                    Artist: {track.artists.map((a) => a.name).join(", ")}
                  </Typography>
                   <Typography noWrap sx={{ color: "text.secondary", fontSize: { xs: 10, sm: 12 } }}>
                    Album: {track.album.name}
                  </Typography>
                  <Typography noWrap sx={{ color: "text.secondary", fontSize: { xs: 10, sm: 12 } }}>
                    Genre: {sampleTopArtists.find(a => a.name === track.artists[0]?.name)?.genres[0] || "-"}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      background: "#ffe6a1",
                      color: "#6d4c1c",
                      fontWeight: 600,
                      fontSize: { xs: 9, sm: 11 },
                      borderRadius: '16px',
                      px: 1,
                      py: 0.2,
                      display: 'inline-block'
                    }}
                  >
                    #{idx + 1}
                  </Box>
                </CardContent>
                <Typography component="span" sx={{ position: 'absolute', bottom: 6, right: 12, fontSize: { xs: 12, sm: 16 }, opacity: 0.18 }}>⭐</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --- Artists, Albums, Genres Grid --- */}
        <Grid container spacing={2} justifyContent="center">
          {/* Top 5 Artists */}
          <Grid item xs={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#6d4c1c", mb: 2, fontSize: {xs: 16, sm: 20} }}>
                  TOP 5 ARTISTS
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {sampleTopArtists.map((artist) => (
                     <Box component="li" key={artist.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography component="span" sx={{ mr: 1.5, fontSize: {xs: 16, sm: 18} }}>🎤</Typography>
                        <Typography sx={{ color: "#7a5a2f", fontWeight: 500, fontSize: {xs: 12, sm: 14} }}>{artist.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Albums */}
          <Grid item xs={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#6d4c1c", mb: 2, fontSize: {xs: 16, sm: 20} }}>
                  TOP 5 ALBUMS
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {sampleTopAlbums.map((album) => (
                     <Box component="li" key={album.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography component="span" sx={{ mr: 1.5, fontSize: {xs: 16, sm: 18} }}>💿</Typography>
                        <Typography sx={{ color: "#7a5a2f", fontWeight: 500, fontSize: {xs: 12, sm: 14} }}>{album.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Genres */}
          <Grid item xs={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#6d4c1c", mb: 2, fontSize: {xs: 16, sm: 20} }}>
                  TOP 5 GENRES
                </Typography>
                 <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {sampleTopGenres.map((genre) => (
                    <Box component="li" key={genre} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <Typography component="span" sx={{ mr: 1.5, fontSize: {xs: 16, sm: 18} }}>🏷️</Typography>
                       <Typography sx={{ color: "#7a5a2f", fontWeight: 500, fontSize: {xs: 12, sm: 14} }}>{genre}</Typography>
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

export default DashboardSample;