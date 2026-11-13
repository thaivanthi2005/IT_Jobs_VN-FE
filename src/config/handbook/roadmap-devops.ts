import type { Roadmap } from "./types";

export const devopsRoadmap: Roadmap = {
  slug: "devops",
  title: "Lộ trình DevOps Engineer",
  shortTitle: "DevOps",
  summary:
    "Linux, container, CI/CD, cloud và observability. Lộ trình dành cho người đã có nền backend hoặc quản trị hệ thống.",
  level: "Nâng cao",
  duration: "9 – 12 tháng",
  outcomes: [
    "Viết Dockerfile/compose và pipeline CI/CD hoàn chỉnh",
    "Triển khai hạ tầng bằng Terraform và quản lý secret an toàn",
    "Giám sát hệ thống với metric, log và alert",
    "Đủ nền để thi các chứng chỉ cloud cơ bản",
  ],
  stages: [
    {
      id: "linux",
      title: "Linux & Networking",
      subtitle: "Nền móng không thể thiếu",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "linux-admin",
          title: "Linux Administration",
          desc: "Process, systemd, permission, disk, package manager, log.",
          tags: ["Linux"],
        },
        {
          id: "shell",
          title: "Shell scripting",
          desc: "Bash script, biến, điều kiện, cron job, tự động hoá thao tác lặp.",
          tags: ["Bash"],
        },
        {
          id: "network",
          title: "Networking",
          desc: "DNS, TCP/IP, HTTP/HTTPS, firewall, reverse proxy, load balancer.",
          tags: ["Network"],
        },
      ],
    },
    {
      id: "container",
      title: "Container & Orchestration",
      subtitle: "Trọng tâm của DevOps hiện đại",
      duration: "7 – 9 tuần",
      nodes: [
        {
          id: "docker",
          title: "Docker",
          desc: "Image, layer cache, multi-stage build, compose, volume, network.",
          tags: ["Docker"],
        },
        {
          id: "registry",
          title: "Container Registry",
          desc: "Đẩy image lên registry, tag theo version, scan lỗ hổng.",
          tags: ["Registry"],
        },
        {
          id: "k8s",
          title: "Kubernetes",
          desc: "Pod, deployment, service, ingress, configmap, secret, HPA.",
          tags: ["Kubernetes"],
        },
        {
          id: "helm",
          title: "Helm",
          desc: "Đóng gói manifest thành chart, quản lý môi trường bằng values.",
          tags: ["Helm"],
          optional: true,
        },
      ],
    },
    {
      id: "pipeline",
      title: "CI/CD",
      subtitle: "Tự động hoá từ commit đến production",
      duration: "5 – 6 tuần",
      nodes: [
        {
          id: "gha",
          title: "GitHub Actions",
          desc: "Workflow, matrix build, cache, secret, reusable workflow.",
          tags: ["CI/CD"],
        },
        {
          id: "strategy",
          title: "Chiến lược deploy",
          desc: "Blue-green, canary, rolling update, rollback an toàn.",
          tags: ["Deploy"],
        },
        {
          id: "terraform",
          title: "Terraform",
          desc: "Infrastructure as Code, state, module, plan/apply.",
          tags: ["Terraform"],
        },
      ],
    },
    {
      id: "cloud",
      title: "Cloud & Observability",
      subtitle: "Vận hành hệ thống thật",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "cloud-basics",
          title: "Cloud cơ bản (AWS/GCP)",
          desc: "VPC, EC2/Compute, S3, IAM, RDS, security group.",
          tags: ["AWS"],
        },
        {
          id: "monitoring",
          title: "Monitoring",
          desc: "Prometheus + Grafana, định nghĩa SLI/SLO, alert rule.",
          tags: ["Prometheus"],
        },
        {
          id: "logging",
          title: "Centralized logging",
          desc: "Loki/ELK, trace id xuyên service, truy vết lỗi production.",
          tags: ["Logging"],
        },
        {
          id: "secret",
          title: "Secret management",
          desc: "Vault/Sealed Secrets, không commit secret vào repo.",
          tags: ["Security"],
        },
      ],
    },
  ],
  resources: [
    {
      title: "roadmap.sh — DevOps Roadmap",
      href: "https://roadmap.sh/devops",
    },
    {
      title: "roadmap.sh — Kubernetes",
      href: "https://roadmap.sh/kubernetes",
    },
    {
      title: "Docker Docs",
      href: "https://docs.docker.com/",
    },
    {
      title: "Kubernetes Docs",
      href: "https://kubernetes.io/docs/home/",
    },
  ],
  related: ["backend", "fullstack", "frontend"],
};
