export interface Testimonial {
  id?: string;
  author_name: string;
  company: string;
  batch: string;
  content: string;
  rating: number;
  avatar_url: string;
  is_published: boolean;
}