import axios from "axios";
import {
  SpotifyTrack,
  SpotifyUser,
  SpotifyRecentlyPlayedResponse,
  SpotifyAuthResponse,
} from "../types/spotify";

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

function checkEnvVars() {
  if (!CLIENT_ID) throw new Error("Missing Spotify CLIENT_ID env variable");
  if (!REDIRECT_URI)
    throw new Error("Missing Spotify REDIRECT_URI env variable");
  if (!CLIENT_SECRET)
    throw new Error("Missing Spotify CLIENT_SECRET env variable");
}

export class SpotifyApiService {
  private accessToken: string | null = null;

  generateAuthUrl(): string {
    checkEnvVars();
    const scopes = [
      "user-read-recently-played",
      "user-read-private",
      "user-read-email",
      "user-top-read",
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID!,
      response_type: "code",
      redirect_uri: REDIRECT_URI!,
      scope: scopes.join(" "),
      show_dialog: "true",
    });

    return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<SpotifyAuthResponse> {
    checkEnvVars();
    const response = await axios.post(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI!,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

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

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
  }

  async getTopTracks(
    limit: number = 5,
    time_range: string = "medium_term"
  ): Promise<SpotifyTrack[]> {
    if (!this.accessToken) {
      throw new Error("Access token not set.");
    }
    const safeLimit = Math.min(limit, 50);
    const response = await axios.get(
      `${SPOTIFY_API_BASE}/me/top/tracks?limit=${safeLimit}&time_range=${time_range}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.data.items;
  }

  async getTopArtists(
    limit: number = 5,
    time_range: string = "medium_term"
  ): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error("Access token not set.");
    }
    const safeLimit = Math.min(limit, 50);
    const response = await axios.get(
      `${SPOTIFY_API_BASE}/me/top/artists?limit=${safeLimit}&time_range=${time_range}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return response.data.items;
  }
}

export const spotifyApi = new SpotifyApiService();
