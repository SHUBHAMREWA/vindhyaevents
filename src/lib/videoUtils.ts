export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = clean.match(regExp);
  return match && match[1] && match[1].length === 11 ? match[1] : null;
}

export function getInstagramId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/i);
  return match ? match[1] : null;
}

export function detectVideoType(url: string): "youtube" | "instagram" | "custom" {
  if (!url) return "custom";
  const clean = url.trim().toLowerCase();
  if (clean.includes("youtube.com") || clean.includes("youtu.be")) return "youtube";
  if (clean.includes("instagram.com")) return "instagram";
  return "custom";
}

export function getVideoEmbedUrl(url: string, autoplay = true): {
  type: "youtube" | "instagram" | "custom";
  embedUrl: string;
} {
  const type = detectVideoType(url);

  if (type === "youtube") {
    const id = getYouTubeId(url);
    if (id) {
      // autoplay=1, mute=1 (browsers strictly require mute=1 for autoplay to start without blocking), loop=1, controls=1
      const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        mute: "1",
        loop: "1",
        playlist: id,
        controls: "1",
        modestbranding: "1",
        rel: "0",
        playsinline: "1",
        enablejsapi: "1",
      });
      return {
        type: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`,
      };
    }
  }

  if (type === "instagram") {
    const id = getInstagramId(url);
    if (id) {
      return {
        type: "instagram",
        embedUrl: `https://www.instagram.com/p/${id}/embed/captioned/`,
      };
    }
  }

  return {
    type: "custom",
    embedUrl: url,
  };
}

export const DEFAULT_WORK_VIDEOS: {
  title: string;
  category: string;
  videoUrl: string;
  videoType: "youtube" | "instagram" | "custom";
  thumbnailUrl: string;
  description: string;
  order: number;
  isActive: boolean;
}[] = [];
