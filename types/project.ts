export interface Project {
  id?: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  image_url: string;
  sort_order: number;
}