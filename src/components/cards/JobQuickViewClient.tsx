"use client";

import { useState } from "react";
import { JobCardLink } from "./JobCardLink";
import { JobQuickView } from "./JobQuickView";
import { RevealGroup } from "@/components/ui/RevealGroup";
import type { JobCard } from "@/types/api";

/**
 * A grid of job cards plus the quick-view dialog.
 *
 * This is the only client part of the featured section: the jobs themselves are
 * fetched and rendered on the server, and arrive here as plain data. Only the
 * click-to-preview behaviour needs the client, so that is all this component
 * adds — the section's markup is still in the server HTML.
 */
export const JobQuickViewClient = ({
  jobs,
  layout = "grid-3",
}: {
  jobs: JobCard[];
  /** `grid-3` for the home page, `list` for a single column. */
  layout?: "grid-3" | "list";
}) => {
  const [preview, setPreview] = useState<JobCard | null>(null);

  const className =
    layout === "grid-3"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 gap-5";

  return (
    <>
      <RevealGroup step={70} effect="reveal-lift" className={className}>
        {jobs.map((job) => (
          <JobCardLink key={job.id} item={job} onOpen={setPreview} />
        ))}
      </RevealGroup>

      <JobQuickView job={preview} onClose={() => setPreview(null)} />
    </>
  );
};
