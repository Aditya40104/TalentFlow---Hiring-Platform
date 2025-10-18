// Core types for TalentFlow

export type JobStatus = 'active' | 'archived';

export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: JobStatus;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CandidateStage = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  jobId: string;
  stage: CandidateStage;
  appliedAt: Date;
  updatedAt: Date;
}

export interface StageChange {
  id: string;
  candidateId: string;
  fromStage: CandidateStage | null;
  toStage: CandidateStage;
  changedAt: Date;
  note?: string;
}

export interface Note {
  id: string;
  candidateId: string;
  content: string;
  mentions: string[]; // candidate IDs mentioned
  createdAt: Date;
  createdBy: string; // user name/id
}

export type QuestionType = 
  | 'single-choice'
  | 'multi-choice'
  | 'short-text'
  | 'long-text'
  | 'numeric'
  | 'file-upload';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ConditionalLogic {
  questionId: string;
  operator: 'equals' | 'not-equals' | 'contains';
  value: string | string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[]; // for choice questions
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditionalLogic?: ConditionalLogic; // show this question only if condition is met
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  answers: Record<string, any>; // questionId -> answer
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface JobFilters {
  search?: string;
  status?: JobStatus;
  tags?: string[];
}

export interface CandidateFilters {
  search?: string;
  stage?: CandidateStage;
  jobId?: string;
}
