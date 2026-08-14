export interface StudentProfile {
  id: string;
  user_id: string;
  mobile_number: string;
  college_name: string;
  degree: string;
  branch: string;
  current_year: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProfilePayload {
  mobileNumber: string;
  collegeName: string;
  degree: string;
  branch: string;
  currentYear: number;
}