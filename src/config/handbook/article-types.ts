export type ArticleSection = {
  heading: string;
  /** Plain paragraphs, rendered before the list. */
  paragraphs?: string[];
  list?: { title: string; desc: string }[];
  /** Optional callout at the end of the section. */
  tip?: { label: string; text: string };
};

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: "CV" | "Phỏng vấn" | "Thư xin việc" | "Lương";
  readingTime: string;
  updatedAt: string;
  intro: string;
  sections: ArticleSection[];
  checklist: string[];
  relatedJobsQuery: string;
};

export type { Article as ArticleType };
