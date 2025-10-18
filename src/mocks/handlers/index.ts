import { jobHandlers } from './jobs';
import { candidateHandlers } from './candidates';
import { assessmentHandlers } from './assessments';

export const handlers = [
  ...jobHandlers,
  ...candidateHandlers,
  ...assessmentHandlers,
];
