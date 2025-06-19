import axios from "axios";
import {
  SpotifyTrack,
  SpotifyUser,
  SpotifyRecentlyPlayedResponse,
  SpotifyAuthResponse,
} from "../types/spotify";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export class SpotifyApiService {
  private accessToken: string | null = null;

  // Generate Spotify authorization URL
  generateAuthUrl(): string {
    const scopes = [
      "user-read-recently-played",
      "user-read-private",
      "user-read-email",
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID!,
      response_type: "code",
      redirect_uri: REDIRECT_URI!,
      scope: scopes.join(" "),
      show_dialog: "true",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<SpotifyAuthResponse> {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  }

  // Set access token
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  // Get recently played tracks
  async getRecentlyPlayed(limit: number = 100): Promise<SpotifyTrack[]> {
    const response = await axios.get<SpotifyRecentlyPlayedResponse>(
      `${SPOTIFY_API_BASE}/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.data.items.map((item) => ({
      ...item.track,
      played_at: item.played_at,
    }));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Clear authentication
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
  }
}

export const spotifyApi = new SpotifyApiService();
