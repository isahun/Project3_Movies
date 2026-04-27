export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  original_language: string;
  vote_average: number;
  vote_count: number;
}
