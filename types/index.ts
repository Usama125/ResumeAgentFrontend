// Backend-compatible type definitions for AI Resume Builder
// These interfaces match the FastAPI backend schemas exactly

// =============================================================================
// USER TYPES (matching backend User schema)
// =============================================================================

export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
  id?: string; // Optional ID for drag and drop reordering
}

export interface ExperienceDetail {
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  duration?: string;
}

export interface WorkPreferences {
  current_employment_mode: string[];
  preferred_work_mode: string[];
  preferred_employment_type: string[];
  preferred_location: string;
  notice_period: string;
  availability: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  twitter?: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface Education {
  institution: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface Language {
  name: string;
  proficiency?: string;
}

export interface Award {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface Publication {
  title: string;
  publisher?: string;
  date?: string;
  url?: string;
  description?: string;
}

export interface VolunteerExperience {
  organization: string;
  role: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  designation: string | null;
  location: string | null;
  profile_picture: string | null;
  is_looking_for_job: boolean;
  expected_salary: string | null;
  current_salary: string | null;
  experience: string | null;
  summary: string | null;
  additional_info: string | null;
  skills: Skill[];
  experience_details: ExperienceDetail[];
  projects: Project[];
  certifications: string[];
  work_preferences: WorkPreferences | null;
  onboarding_completed: boolean;
  onboarding_progress: OnboardingProgress;
  created_at: string;
  updated_at?: string;
  // Enhanced fields
  contact_info?: ContactInfo;
  education: Education[];
  languages: Language[];
  awards: Award[];
  publications: Publication[];
  volunteer_experience: VolunteerExperience[];
  interests: string[];
  profession?: string;
  section_order?: string[];
}

// Public User (what other users see)
export interface PublicUser {
  id: string;
  name: string;
  username?: string;
  designation: string | null;
  location: string | null;
  profile_picture: string | null;
  is_looking_for_job: boolean;
  experience: string | null;
  summary: string | null;
  skills: Skill[];
  experience_details: ExperienceDetail[];
  projects: Project[];
  // Enhanced fields for public view
  contact_info?: ContactInfo;
  education: Education[];
  languages: Language[];
  awards: Award[];
  publications: Publication[];
  volunteer_experience: VolunteerExperience[];
  interests: string[];
  profession?: string;
  certifications: string[];
  // Additional fields that might be needed
  expected_salary?: string | null;
  email?: string;
}

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  token_type: "bearer";
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: "bearer";
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UsernameValidationRequest {
  username: string;
}

export interface UsernameValidationResponse {
  available: boolean;
  valid: boolean;
  message: string;
}

// =============================================================================
// ONBOARDING TYPES (matching backend endpoints)
// =============================================================================

// Onboarding step status
export type OnboardingStepStatus = "not_started" | "in_progress" | "completed";

// Onboarding progress tracking
export interface OnboardingProgress {
  step_1_pdf_upload: OnboardingStepStatus;
  step_2_profile_info: OnboardingStepStatus;
  step_3_work_preferences: OnboardingStepStatus;
  step_4_salary_availability: OnboardingStepStatus;
  current_step: number;
  completed: boolean;
}

// Step-by-step onboarding data
export interface OnboardingStepData {
  step: number;
  data: any;
}

// Individual step completion responses
export interface StepCompletionResponse {
  success: boolean;
  next_step?: number;
  message: string;
  onboarding_completed: boolean;
}

export interface PDFUploadResponse {
  success: boolean;
  extracted_data?: {
    name?: string;
    designation?: string;
    location?: string;
    summary?: string;
    skills?: Skill[];
    experience_details?: ExperienceDetail[];
    projects?: Project[];
    certifications?: string[];
  };
  error?: string;
}

export interface OnboardingCompleteRequest {
  profile_picture?: File;
  additional_info: string;
  is_looking_for_job: boolean;
  current_employment_mode: string[];
  preferred_work_mode: string[];
  preferred_employment_type: string[];
  preferred_location: string;
  current_salary: string;
  expected_salary: string;
  notice_period: string;
  availability: string;
  extracted_data: string; // JSON string
}

// =============================================================================
// SEARCH TYPES
// =============================================================================

export interface SearchParams {
  q?: string;
  skills?: string;
  location?: string;
  looking_for_job?: boolean;
  limit?: number;
  skip?: number;
}

export interface SearchResponse {
  users: PublicUser[];
  total: number;
}

// =============================================================================
// CHAT TYPES (for AI features)
// =============================================================================

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface SuggestionChip {
  text: string;
  type: "experience" | "skills" | "availability" | "projects" | "general";
}

export interface ChatSuggestionsResponse {
  suggestions: SuggestionChip[];
}

// =============================================================================
// JOB MATCHING TYPES (HMAC secured)
// =============================================================================

export interface JobMatchingRequest {
  skills: string[];
  experience_level: string;
  location: string;
  salary_range: string;
  work_mode: string[];
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  matching_score: number;
  matching_explanation: string;
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
}

export interface JobMatchingResponse {
  matches: JobMatch[];
  ai_analysis: string;
  search_metadata: {
    total_jobs_analyzed: number;
    top_matching_criteria: string[];
    improvement_suggestions: string[];
  };
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface RateLimitData {
  remaining: number;
  resetInSeconds: number;
  isAuthenticated: boolean;
  rateLimitType: 'job_matching' | 'chat' | 'unknown';
}

export interface APIError {
  type: 'RATE_LIMIT' | 'AUTH_ERROR' | 'VALIDATION_ERROR' | 'GENERIC_ERROR';
  message: string;
  detail?: string | any[];
  retryAfter?: number;
  action?: 'REDIRECT_TO_LOGIN' | 'RETRY' | 'CONTACT_SUPPORT';
  errors?: any[];
  rateLimitData?: RateLimitData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  validation_errors?: ValidationError[];
}

// =============================================================================
// COMPONENT STATE TYPES
// =============================================================================

export interface ComponentState<T> {
  loading: boolean;
  error: APIError | null;
  data: T | null;
}

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// =============================================================================
// FORM DATA TYPES (matching frontend forms to backend exactly)
// =============================================================================

export interface OnboardingFormData {
  // Step 1: Resume Upload (supports PDF, Word)
  resumeFile: File | null;
  
  // Step 2: Profile Info (backend field names)
  profile_picture: File | null;
  additional_info: string;
  is_looking_for_job: boolean;
  
  // Step 3: Work Preferences (backend field names)
  current_employment_mode: string[];
  preferred_work_mode: string[];
  preferred_employment_type: string[];
  preferred_location: string;
  
  // Step 4: Salary & Availability (backend field names)
  current_salary: string;
  expected_salary: string;
  notice_period: string;
  availability: string;
}

// Edit Profile Form Data (for the modal)
export interface EditProfileFormData {
  name: string;
  email: string;
  designation: string;
  location: string;
  summary: string;
  additional_info: string;
  experience: string;
  skills: Skill[];
  experience_details: ExperienceDetail[];
  projects: Project[];
  certifications: string[];
  expected_salary: string;
  current_salary: string;
  preferred_work_mode: string[];
  preferred_employment_type: string[];
  preferred_location: string;
  notice_period: string;
  availability: string;
  is_looking_for_job: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  designation?: string;
  location?: string;
  summary?: string;
  additional_info?: string;
  experience?: string;
  skills?: Skill[];
  experience_details?: ExperienceDetail[];
  projects?: Project[];
  certifications?: string[];
  work_preferences?: WorkPreferences;
  is_looking_for_job?: boolean;
  expected_salary?: string;
  current_salary?: string;
  profile_picture?: File;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const WORK_MODES = [
  { id: "remote", label: "Remote", description: "Work from anywhere" },
  { id: "onsite", label: "On-site", description: "Work from office" },
  { id: "hybrid", label: "Hybrid", description: "Mix of remote and office" },
] as const;

export const EMPLOYMENT_TYPES = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "freelance", label: "Freelance" },
] as const;

export const AVAILABILITY_OPTIONS = [
  "immediate",
  "1 week",
  "2 weeks", 
  "1 month",
  "2 months",
  "3+ months"
] as const;

export const NOTICE_PERIODS = [
  "Immediate",
  "1 week",
  "2 weeks",
  "1 month",
  "2 months",
  "3+ months"
] as const;