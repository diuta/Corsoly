import React from "react";
import { spotifyApi } from "../services/spotifyApi";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSpotifyLogin = () => {
    const authUrl = spotifyApi.generateAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Gen Z Song Judge
          </h1>
          <p className="text-gray-600 text-lg">
            Let's see what your music taste says about you fr fr 💅
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Connect with Spotify</h2>
              <p className="text-green-100 mb-4">
                We'll analyze your last 100 songs and give you the Gen Z verdict
                ✨
              </p>
              <button
                onClick={handleSpotifyLogin}
                className="bg-white text-green-600 font-bold py-3 px-6 rounded-full hover:bg-green-50 transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span>Login with Spotify</span>
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <p>✨ We'll judge your music taste with Gen Z energy</p>
            <p>🎵 Analyze your last 100 played songs</p>
            <p>🔥 Get the ultimate vibe check</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            By logging in, you agree to let us access your recently played
            tracks for analysis. We don't store any personal data, just vibes!
            ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
