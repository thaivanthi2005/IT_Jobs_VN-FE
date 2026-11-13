import { GalleryHeading } from "@/components/effects";

/**
 * The twelve-plate gallery ring as a full-bleed band.
 *
 * Deliberately text-free: this is the page's one piece of pure motion, so it is
 * left to do that job on its own. A heading, a caption and a call to action were
 * previously stacked above it, which turned the band into an explanation of
 * itself rather than something to look at.
 *
 * The ring orbits on its own (`autoHover`) and speeds up under the pointer. The
 * whole section is `aria-hidden`, and the effect's `label` is left empty, so a
 * screen reader is not read a decorative animation.
 */
export const ShowcaseSection = () => (
  <section className="bg-ink-950" aria-hidden="true">
    <div className="overflow-hidden">
      <GalleryHeading variant="falling-diagonal" ratio="16 / 6" mode="dark" autoHover label="" />
    </div>
  </section>
);
