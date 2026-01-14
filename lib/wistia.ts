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

interface WistiaCaption {
  language: string;
  english_name: string;
  native_name: string;
  is_draft: boolean;
}

interface WistiaCaptionDetails {
  language: string;
  text: string;
}

/**
 * Fetches the video transcript from Wistia captions API
 * Returns plain text transcript or null if not available
 */
export async function getWistiaTranscript(videoId: string): Promise<{ data: string | null; error: string | null }> {
  if (!env.WISTIA_API_TOKEN) {
    console.error("[Wistia] Missing WISTIA_API_TOKEN in environment");
    return { data: null, error: "Missing Wistia API token" };
  }

  console.log(`[Wistia Transcript] Fetching captions list for video: ${videoId}...`);
  
  try {
    // First, get list of available captions
    const captionsListResponse = await fetch(
      `https://api.wistia.com/v1/medias/${videoId}/captions.json`,
      {
        headers: {
          Authorization: `Bearer ${env.WISTIA_API_TOKEN}`,
        },
      }
    );

    if (!captionsListResponse.ok) {
      console.error(`[Wistia Transcript] Failed to fetch captions list: ${captionsListResponse.status}`);
      return { data: null, error: "Failed to fetch captions list from Wistia" };
    }

    const captionsList: WistiaCaption[] = await captionsListResponse.json();
    console.log(`[Wistia Transcript] Found ${captionsList.length} caption(s)`);

    if (captionsList.length === 0) {
      return { data: null, error: "No captions available for this video. Please add captions in Wistia first." };
    }

    // Prefer English captions, otherwise use first available
    const englishCaption = captionsList.find(c => c.language === "eng" || c.language === "en");
    const captionLanguage = englishCaption?.language || captionsList[0].language;
    
    console.log(`[Wistia Transcript] Fetching caption content for language: ${captionLanguage}...`);

    // Fetch the actual caption content
    const captionResponse = await fetch(
      `https://api.wistia.com/v1/medias/${videoId}/captions/${captionLanguage}.json`,
      {
        headers: {
          Authorization: `Bearer ${env.WISTIA_API_TOKEN}`,
        },
      }
    );

    if (!captionResponse.ok) {
      console.error(`[Wistia Transcript] Failed to fetch caption content: ${captionResponse.status}`);
      return { data: null, error: "Failed to fetch caption content from Wistia" };
    }

    const captionData: WistiaCaptionDetails = await captionResponse.json();
    
    if (!captionData.text) {
      return { data: null, error: "Caption content is empty" };
    }

    // Parse SRT format to plain text
    const plainText = parseSrtToPlainText(captionData.text);
    console.log(`[Wistia Transcript] Successfully extracted transcript (${plainText.length} chars)`);
    
    return { data: plainText, error: null };
  } catch (error) {
    console.error(`[Wistia Transcript] Error fetching transcript:`, error);
    return { data: null, error: "Failed to fetch transcript from Wistia" };
  }
}

/**
 * Parses SRT format text to plain text
 * Removes timestamps and sequence numbers, keeps only the text content
 */
function parseSrtToPlainText(srtContent: string): string {
  const lines = srtContent.split("\n");
  const textLines: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Skip sequence numbers (just digits)
    if (/^\d+$/.test(trimmedLine)) continue;
    
    // Skip timestamp lines (e.g., "00:00:01,000 --> 00:00:04,000")
    if (/^\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,\.]\d{3}$/.test(trimmedLine)) continue;
    
    // This is actual text content
    textLines.push(trimmedLine);
  }
  
  // Join with spaces and clean up multiple spaces
  return textLines.join(" ").replace(/\s+/g, " ").trim();
}
