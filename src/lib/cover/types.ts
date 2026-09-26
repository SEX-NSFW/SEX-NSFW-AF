export type CoverSource = "porndiff" | "teamskeet" | "thenude" | "brattysis";

export type CoverResult = {
  coverUrl: string | null;
  title: string | null;
  studio: string | null;
  source: CoverSource | null;
  performers: string[];
  pageUrl: string | null;
  error?: "invalid_query" | "not_found" | "unverified";
};
