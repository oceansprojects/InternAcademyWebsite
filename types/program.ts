export interface Program {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  duration_weeks: number;
  batch_mode: string;
  schedule: string | null;
  location: string | null;
  base_price: number;
  discounted_price: number;
  syllabus_url: string | null;
  demo_video_url: string | null;
  demo_video_duration_mins: number | null;
  demo_video_description: string | null;
    card_image_url?: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  is_popular: boolean;
  cohort_start: string | null;
}

