// next/image loader. The site doesn't resize images on its own server
// (that would load the EC2 box), so each <Image> asks the image host for a copy
// at the width the screen needs:
//  - Cloudinary: f_auto (WebP/AVIF), q_auto, and a width limit.
//  - Unsplash: w, q and auto=format query params.
//  - Anything else (site files in /public, YouTube thumbnails) is used as is.

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    const q = quality ? `q_${quality}` : "q_auto";
    return src.replace("/image/upload/", `/image/upload/f_auto,${q},c_limit,w_${width}/`);
  }

  if (src.includes("images.unsplash.com") || src.includes("plus.unsplash.com")) {
    try {
      const url = new URL(src);
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", String(quality || 70));
      url.searchParams.set("auto", "format");
      return url.toString();
    } catch {
      return src;
    }
  }

  // Site files: the width query is ignored by the server; it only keeps
  // next/image's srcset entries distinct.
  if (src.startsWith("/")) return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;

  return src;
}
