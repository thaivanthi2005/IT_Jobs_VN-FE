export type RoadmapNode = {
  id: string;
  title: string;
  desc: string;
  tags?: string[];
  optional?: boolean;
};

export type RoadmapStage = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  nodes: RoadmapNode[];
};

export type Roadmap = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  duration: string;
  outcomes: string[];
  stages: RoadmapStage[];
  resources: { title: string; href: string; note?: string }[];
  related: string[];
};

export type { Roadmap as RoadmapType };
