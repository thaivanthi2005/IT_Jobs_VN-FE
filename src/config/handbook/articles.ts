import { articleCv } from "./article-cv";
import { articleInterview } from "./article-interview";
import { articleCoverLetter } from "./article-cover-letter";
import { articleSalary } from "./article-salary";
import type { Article } from "./article-types";

export * from "./article-types";

export const articles: Article[] = [
  articleCv,
  articleInterview,
  articleCoverLetter,
  articleSalary,
];

export const getArticle = (slug: string) => articles.find((item) => item.slug === slug);

export const getRelatedArticles = (article: Article, limit = 3) =>
  articles.filter((item) => item.slug !== article.slug).slice(0, limit);

export const categoryTone = (category: Article["category"]) => {
  switch (category) {
    case "CV":
      return "badge-brand";
    case "Phỏng vấn":
      return "badge-success";
    case "Thư xin việc":
      return "badge-warning";
    default:
      return "badge-neutral";
  }
};
