"use client";

import Link from "next/link";
import { CardJobBody, cardShell } from "./CardJobItem";
import type { JobCard } from "@/types/api";

/**
 * A job card that opens the quick-view dialog on a plain left click.
 *
 * This is the client half of the card. `CardJobItem` renders the same markup on
 * the server; this wrapper exists only because a click handler cannot be passed
 * across the server/client boundary — the earlier version put `onClick` on the
 * server component and Next rejected it with "Event handlers cannot be passed to
 * Client Component props".
 *
 * The `href` is kept intact so middle-click, ctrl/cmd-click, crawlers and
 * JS-disabled browsers still navigate normally.
 */
export const JobCardLink = ({
  item,
  onOpen,
}: {
  item: JobCard;
  onOpen: (job: JobCard) => void;
}) => (
  <Link
    href={`/job/detail/${item.id}`}
    aria-haspopup="dialog"
    onClick={(event) => {
      /* only a plain left click is intercepted; every modifier keeps the browser
         default so "open in new tab" still works */
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;
      event.preventDefault();
      onOpen(item);
    }}
    className={cardShell}
  >
    <CardJobBody item={item} />
  </Link>
);
