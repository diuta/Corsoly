import React from "react";
import { spotifyApi } from "../services/spotifyApi";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSpotifyLogin = () => {
    const authUrl = spotifyApi.generateAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f5f5dc" }}
    >
      <Card
        className="shadow-lg rounded-4 border-0 p-4"
        style={{
          maxWidth: 420,
          width: "100%",
          background: "#fffbe6",
          border: "2px dashed #e0cfa9",
        }}
      >
        <CardBody className="text-center">
          <div className="mb-4">
            <span
              style={{ fontSize: 40, color: "#bfa76a", marginBottom: 8 }}
              role="img"
              aria-label="music"
            >
              🎵
            </span>
            <h2
              className="fw-bold mb-2"
              style={{ color: "#6d4c1c", letterSpacing: 1 }}
            >
              Gen Z Song Judge
            </h2>
            <div className="mb-2" style={{ color: "#7a5a2f", fontSize: 16 }}>
              Let's see what your music taste says about you fr fr 💅
            </div>
          </div>
          <div className="mb-4">
            <h5 className="fw-bold mb-2" style={{ color: "#6d4c1c" }}>
              Connect with Spotify
            </h5>
            <div className="mb-3" style={{ color: "#bfa76a" }}>
              We'll analyze your last 50 songs and give you the Gen Z verdict ✨
            </div>
            <Button
              onClick={handleSpotifyLogin}
              color="success"
              className="fw-bold rounded-pill px-4 py-2 mb-2"
              style={{ background: "#1db954", border: "none", fontSize: 18 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                alt="Spotify"
                style={{
                  width: 28,
                  height: 28,
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
              />
              Login with Spotify
            </Button>
          </div>
          <div className="mb-3" style={{ color: "#7a5a2f", fontSize: 15 }}>
            ✨ We'll judge your music taste with Gen Z energy
            <br />
            🎵 Analyze your last 50 played songs
            <br />
            🔥 Get the ultimate vibe check
          </div>
          <div style={{ color: "#b2b2b2", fontSize: 13 }}>
            By logging in, you agree to let us access your recently played
            tracks for analysis. We don't store any personal data, just vibes!
            ✨
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
