import { SpotifyTrack, GenZJudgment } from "../types/spotify";

export class GenZJudgeService {
  private genZPhrases = {
    positive: [
      "This is giving main character energy fr fr 🔥",
      "No cap, this song is actually fire 🔥",
      "This is the vibe we needed rn 💅",
      "Periodt! This song is everything ✨",
      "This is giving serotonin boost fr 💖",
      "Literally obsessed with this song rn 😍",
      "This is the song of the summer fr fr 🌞",
      "No thoughts, just vibes with this one 🎵",
      "This is giving main character soundtrack energy 🎭",
      "Actually iconic behavior with this song choice 👑",
    ],
    neutral: [
      "It's giving... meh 🤷‍♀️",
      "Not bad, not great, just vibing 🎵",
      "This is giving background music energy 📻",
      "It's aight, could be worse 💁‍♀️",
      "This song exists and that's fine ✨",
      "Giving neutral vibes fr fr 😐",
      "Not my fave but I respect it 🤝",
      "This is giving elevator music but make it cute 🛗",
      "It's giving... something 🎵",
      "This song is just there, vibing 💫",
    ],
    negative: [
      "This is giving flop era fr 💀",
      "No offense but this is giving skip energy ⏭️",
      "This is the song that plays in my nightmares 😭",
      "Giving secondhand embarrassment fr fr 😬",
      "This is giving 'I need to change the song immediately' vibes 🚫",
      "Literally who asked for this song 💀",
      "This is giving 'mom's playlist' energy 👩‍🦳",
      "No cap, this is giving cringe 😅",
      "This song is giving 'I'm too old for this' vibes 👴",
      "This is giving 'please make it stop' energy 🙏",
    ],
  };

  private vibes = [
    "main character energy",
    "vibing",
    "chill",
    "hype",
    "nostalgic",
    "romantic",
    "sad girl hours",
    "party mode",
    "study sesh",
    "workout motivation",
    "road trip vibes",
    "late night feels",
    "morning motivation",
    "sunset vibes",
    "rainy day mood",
    "summer anthem",
    "winter cozy",
    "spring awakening",
  ];

  private emojis = {
    positive: ["🔥", "✨", "💅", "😍", "💖", "👑", "🎭", "🌞", "💫", "🎵"],
    neutral: ["🤷‍♀️", "🎵", "📻", "💁‍♀️", "✨", "😐", "🤝", "🛗", "🎵", "💫"],
    negative: ["💀", "⏭️", "😭", "😬", "🚫", "💀", "👩‍🦳", "😅", "👴", "🙏"],
  };

  // Analyze a single track
  judgeTrack(track: SpotifyTrack): GenZJudgment {
    const score = this.calculateScore(track);
    const category = this.getCategory(score);
    const judgment = this.generateJudgment(category, track);
    const emoji = this.getRandomEmoji(category);
    const vibe = this.getRandomVibe();

    return {
      track,
      judgment,
      score,
      emoji,
      vibe,
    };
  }

  // Calculate a score based on track characteristics
  private calculateScore(track: SpotifyTrack): number {
    let score = 50; // Base score

    // Analyze track name for Gen Z appeal
    const trackName = track.name.toLowerCase();
    const artistName = track.artists[0]?.name.toLowerCase() || "";

    // Positive indicators
    if (trackName.includes("vibe") || trackName.includes("mood")) score += 10;
    if (trackName.includes("fire") || trackName.includes("lit")) score += 15;
    if (trackName.includes("bop") || trackName.includes("slap")) score += 12;
    if (trackName.includes("queen") || trackName.includes("king")) score += 8;
    if (trackName.includes("main character")) score += 20;

    // Artist name analysis
    if (artistName.includes("taylor") || artistName.includes("swift"))
      score += 15;
    if (artistName.includes("beyoncé") || artistName.includes("beyonce"))
      score += 15;
    if (artistName.includes("drake")) score += 10;
    if (artistName.includes("bts")) score += 20;
    if (artistName.includes("blackpink")) score += 18;

    // Negative indicators
    if (trackName.includes("country") && !trackName.includes("pop"))
      score -= 10;
    if (trackName.includes("classical")) score -= 15;
    if (trackName.includes("jazz")) score -= 8;

    // Random factor for variety
    score += Math.random() * 20 - 10;

    return Math.max(0, Math.min(100, score));
  }

  private getCategory(score: number): "positive" | "neutral" | "negative" {
    if (score >= 70) return "positive";
    if (score >= 40) return "neutral";
    return "negative";
  }

  private generateJudgment(
    category: "positive" | "neutral" | "negative",
    track: SpotifyTrack
  ): string {
    const phrases = this.genZPhrases[category];
    const basePhrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Add some personalization based on track info
    const trackName = track.name.toLowerCase();
    const artistName = track.artists[0]?.name || "Unknown Artist";

    if (trackName.includes("love") || trackName.includes("heart")) {
      return `${basePhrase} Love songs are always a mood 💕`;
    }

    if (trackName.includes("dance") || trackName.includes("party")) {
      return `${basePhrase} Perfect for the club fr fr 🕺`;
    }

    if (artistName.toLowerCase().includes("taylor")) {
      return `${basePhrase} Swifties unite! 🐍`;
    }

    return basePhrase;
  }

  private getRandomEmoji(
    category: "positive" | "neutral" | "negative"
  ): string {
    const emojiList = this.emojis[category];
    return emojiList[Math.floor(Math.random() * emojiList.length)];
  }

  private getRandomVibe(): string {
    return this.vibes[Math.floor(Math.random() * this.vibes.length)];
  }

  // Analyze multiple tracks and provide summary
  analyzePlaylist(tracks: SpotifyTrack[]): {
    judgments: GenZJudgment[];
    summary: {
      averageScore: number;
      vibeBreakdown: { [key: string]: number };
      topJudgments: string[];
      overallVibe: string;
    };
  } {
    const judgments = tracks.map((track) => this.judgeTrack(track));
    const scores = judgments.map((j) => j.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Count vibes
    const vibeBreakdown: { [key: string]: number } = {};
    judgments.forEach((j) => {
      vibeBreakdown[j.vibe] = (vibeBreakdown[j.vibe] || 0) + 1;
    });

    // Get top 3 judgments
    const topJudgments = judgments
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((j) => j.judgment);

    // Determine overall vibe
    const overallVibe = this.getOverallVibe(averageScore, vibeBreakdown);

    return {
      judgments,
      summary: {
        averageScore,
        vibeBreakdown,
        topJudgments,
        overallVibe,
      },
    };
  }

  private getOverallVibe(
    averageScore: number,
    vibeBreakdown: { [key: string]: number }
  ): string {
    if (averageScore >= 70) {
      return "Your music taste is giving main character energy fr fr! 🔥";
    } else if (averageScore >= 50) {
      return "Your vibes are pretty solid, keep it up! ✨";
    } else {
      return "Your playlist is giving... interesting choices 💀";
    }
  }
}

export const genZJudge = new GenZJudgeService();
