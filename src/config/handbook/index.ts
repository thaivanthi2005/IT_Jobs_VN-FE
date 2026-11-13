import { frontendRoadmap } from "./roadmap-frontend";
import { backendRoadmap } from "./roadmap-backend";
import { fullstackRoadmap } from "./roadmap-fullstack";
import { devopsRoadmap } from "./roadmap-devops";
import type { Roadmap } from "./types";

export * from "./types";

export const roadmaps: Roadmap[] = [
  frontendRoadmap,
  backendRoadmap,
  fullstackRoadmap,
  devopsRoadmap,
];

export const getRoadmap = (slug: string) => roadmaps.find((item) => item.slug === slug);

export const getRelatedRoadmaps = (roadmap: Roadmap) =>
  roadmap.related
    .map((slug) => getRoadmap(slug))
    .filter((item): item is Roadmap => Boolean(item));

export const totalNodeCount = (roadmap: Roadmap) =>
  roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0);
