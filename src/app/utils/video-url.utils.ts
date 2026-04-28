const VIDEO_BASE_URLS: Record<string, string> = {
  YouTube: 'https://www.youtube.com/embed',
  Vimeo: 'https://player.vimeo.com/video',
};

export function buildVideoEmbedUrl(key: string, site: string): string | null {
  const base = VIDEO_BASE_URLS[site];
  return base ? `${base}/${key}` : null;
}
