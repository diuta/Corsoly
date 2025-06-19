import axios from "axios";
import {
  SpotifyTrack,
  SpotifyUser,
  SpotifyRecentlyPlayedResponse,
  SpotifyAuthResponse,
} from "../types/spotify";

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api/...";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

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

    // Corrected the authorization URL
    return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<SpotifyAuthResponse> {
    const response = await axios.post(
      // Corrected the token exchange URL
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI!,
        client_id: CLIENT_ID!,
        // Note: For production apps, the client_secret should be handled on a secure backend,
        // not exposed in the frontend. This example assumes a setup where this is acceptable.
      }),
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
    if (!this.accessToken) {
      throw new Error("Access token not set.");
    }
    const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  // Get recently played tracks
  async getRecentlyPlayed(limit: number = 100): Promise<SpotifyTrack[]> {
    if (!this.accessToken) {
      throw new Error("Access token not set.");
    }
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