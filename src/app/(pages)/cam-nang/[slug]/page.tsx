import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaLightbulb } from "react-icons/fa6";
import { ArticleCard } from "@/components/handbook/ArticleCard";
import { ArticleSidebar } from "@/components/handbook/ArticleSidebar";
import {
  articles,
  categoryTone,
  getArticle,
  getRelatedArticles,
} from "@/config/handbook/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return { title: article.title, description: article.summary };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <div className="bg-ink-50/50 py-8 dark:bg-ink-950/40 sm:py-12">
      <div className="container-page">
        <Link
          href="/cam-nang"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
        >
          <FaArrowLeft className="text-[10px]" aria-hidden="true" />
          Cẩm nang IT
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row">
          <article className="min-w-0 flex-1">
            <div className="surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={categoryTone(article.category)}>{article.category}</span>
                <span className="text-[11.5px] font-medium text-ink-400">
                  {article.readingTime}
                </span>
                <span className="text-[11.5px] text-ink-400">· Cập nhật {article.updatedAt}</span>
              </div>

              <h1 className="mt-3 heading-lg">{article.title}</h1>
              <p className="text-body mt-2">{article.summary}</p>

              <p className="mt-5 border-l-2 border-brand-400 pl-4 text-[13.5px] italic leading-relaxed text-ink-600 dark:text-ink-300">
                {article.intro}
              </p>

              <div className="mt-8 space-y-8">
                {article.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-[16px] font-bold text-ink-900 dark:text-white sm:text-[17px]">
                      {section.heading}
                    </h2>

                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-2.5 text-[13.5px] leading-[1.75] text-ink-600 dark:text-ink-300"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {section.list && (
                      <ul className="mt-4 space-y-3">
                        {section.list.map((item) => (
                          <li
                            key={item.title}
                            className="rounded-md border border-ink-200 bg-white p-3.5 dark:border-ink-700 dark:bg-ink-900"
                          >
                            <p className="text-[13px] font-bold text-ink-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-400">
                              {item.desc}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.tip && (
                      <div className="mt-4 flex gap-3 rounded-md border border-warning-500/25 bg-warning-50 p-4 dark:bg-warning-600/10">
                        <FaLightbulb
                          className="mt-0.5 shrink-0 text-[12px] text-warning-600"
                          aria-hidden="true"
                        />
                        <p className="text-[12.5px] leading-relaxed text-ink-700 dark:text-ink-200">
                          <span className="font-bold text-warning-700 dark:text-warning-500">
                            {section.tip.label}:{" "}
                          </span>
                          {section.tip.text}
                        </p>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </article>

          <ArticleSidebar article={article} />
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 heading-md">Bài viết khác</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
