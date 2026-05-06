// Mapa de plataformes de vídeo suportades i les seves URLs base d'embedding (per a iframes).
// Record<string, string> és un tipus TypeScript equivalent a { [key: string]: string }.
const VIDEO_BASE_URLS: Record<string, string> = {
  YouTube: 'https://www.youtube.com/embed',
  Vimeo: 'https://player.vimeo.com/video',
};

// Construeix l'URL completa per incrustar un vídeo en un <iframe>.
// Retorna null si la plataforma no és suportada (evita iframes amb URLs incorrectes).
// Exemple: buildVideoEmbedUrl('dQw4w9WgXcQ', 'YouTube') → 'https://www.youtube.com/embed/dQw4w9WgXcQ'
export function buildVideoEmbedUrl(key: string, site: string): string | null {
  const base = VIDEO_BASE_URLS[site];
  return base ? `${base}/${key}` : null;
}
