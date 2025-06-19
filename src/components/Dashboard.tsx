import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/spotifyApi";
import { genZJudge } from "../services/genZJudge";
import { SpotifyUser, SpotifyTrack, GenZJudgment } from "../types/spotify";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [judgments, setJudgments] = useState<GenZJudgment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        const tracksData = await spotifyApi.getRecentlyPlayed(100);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analyzing your vibes...
          </h2>
          <p className="text-gray-600">Getting the Gen Z verdict ready! ✨</p>
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
            onClick={handleLogout}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition-colors duration-200"
          >
            Logout & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                Gen Z Song Judge
              </h1>
              {user && (
                <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-2">
                  {user.images?.[0] && (
                    <img
                      src={user.images[0].url}
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-white font-medium">
                    {user.display_name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Section */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Vibe Summary ✨
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round(summary.averageScore)}/100
                </div>
                <p className="text-gray-600">Average Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {tracks.length}
                </div>
                <p className="text-gray-600">Songs Analyzed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Object.keys(summary.vibeBreakdown).length}
                </div>
                <p className="text-gray-600">Different Vibes</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <p className="text-lg font-semibold text-gray-800">
                {summary.overallVibe}
              </p>
            </div>
          </div>
        )}

        {/* Top Judgments */}
        {summary?.topJudgments && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🔥 Top Judgments
            </h3>
            <div className="space-y-3">
              {summary.topJudgments.map((judgment: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                >
                  <span className="text-2xl">#{index + 1}</span>
                  <p className="text-gray-800 font-medium">{judgment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Songs List */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Your Songs & Gen Z Verdicts 💅
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {judgments.map((judgment, index) => (
              <div
                key={judgment.track.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <img
                    src={
                      judgment.track.album.images[0]?.url ||
                      "/placeholder-album.png"
                    }
                    alt={judgment.track.album.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {judgment.track.name}
                  </h4>
                  <p className="text-gray-600 text-sm truncate">
                    {judgment.track.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {judgment.track.album.name}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl mb-1">{judgment.emoji}</div>
                  <div className="text-sm font-medium text-gray-600">
                    {judgment.vibe}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(judgment.score)}/100
                  </div>
                </div>
                <div className="flex-shrink-0 max-w-xs">
                  <p className="text-sm text-gray-700 italic">
                    "{judgment.judgment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
