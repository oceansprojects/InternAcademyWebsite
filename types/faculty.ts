export interface Faculty {
  id?: string;
  user_id?: string | null;

  name: string;
  role: string;
  institution: string;
  bio: string;
  avatar_url: string;
  linkedin_url: string;
  experience_years?: number | null;

  created_at?: string;
  updated_at?: string;
}

export interface ProgramFaculty {
  id?: string;

  program_id: string;
  faculty_id: string;

  sort_order: number;

  created_at?: string;

  faculty?: Faculty;
}