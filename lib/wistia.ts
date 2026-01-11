import { env } from "@/env/server";

export async function getWistiaVideoDuration(videoId: string): Promise<number | null> {
  if (!env.WISTIA_API_TOKEN) {
    console.error("[Wistia] Missing WISTIA_API_TOKEN in environment");
    return null;
  }

  console.log(`[Wistia] Fetching duration for video: ${videoId}...`);
  try {
    const response = await fetch(`https://api.wistia.com/v1/medias/${videoId}.json`, {
      headers: {
        Authorization: `Bearer ${env.WISTIA_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`[Wistia] Failed to fetch video data: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const duration = data.duration;

    if (typeof duration !== "number") {
      console.error(`[Wistia] Duration not found in response for video: ${videoId}`);
      return null;
    }

    console.log(`[Wistia] Duration for video ${videoId}: ${duration}s`);
    return Math.round(duration);
  } catch (error) {
    console.error(`[Wistia] Error fetching video duration:`, error);
    return null;
  }
}
