/**
 * Lesson Details Index
 *
 * This file provides access to detailed lesson content for the lesson player.
 * Each lesson JSON contains:
 * - Full screen-by-screen content (hook, challenge, reason, feedback, transfer, wrap)
 * - Interactive questions with correct answers
 * - Character dialogues and reactions
 * - Learning objectives and takeaways
 * - PMI concept alignment
 */

// Path A: Foundation - Project Management Fundamentals
import A1L1 from './A1L1.json';
import A1L2 from './A1L2.json';
import A1L3 from './A1L3.json';
import A1L4 from './A1L4.json';
import A1L5 from './A1L5.json';
import A1L6 from './A1L6.json';
import A1L7 from './A1L7.json';
import A1L8 from './A1L8.json';

// Path B: People - Stakeholder & Team Management
import B1L1 from './B1L1.json';
import B1L2 from './B1L2.json';
import B1L3 from './B1L3.json';
import B1L4 from './B1L4.json';
import B1L5 from './B1L5.json';
import B1L6 from './B1L6.json';
import B2L1 from './B2L1.json';
import B2L2 from './B2L2.json';
import B2L3 from './B2L3.json';
import B2L4 from './B2L4.json';
import B2L5 from './B2L5.json';

// Path C: Process - Integration, Cost, Schedule & Risk
import C1L1 from './C1L1.json';
import C1L2 from './C1L2.json';
import C1L3 from './C1L3.json';
import C1L4 from './C1L4.json';
import C1L5 from './C1L5.json';
import C1L6 from './C1L6.json';
import C1L7 from './C1L7.json';
import C1L8 from './C1L8.json';
import C2L1 from './C2L1.json';
import C2L2 from './C2L2.json';
import C2L3 from './C2L3.json';
import C2L4 from './C2L4.json';
import C3L1 from './C3L1.json';
import C3L2 from './C3L2.json';
import C3L3 from './C3L3.json';
import C3L4 from './C3L4.json';
import C3L5 from './C3L5.json';
import C3L6 from './C3L6.json';

// Path D: Agile - Scrum & Advanced Agile Practices
import D1L1 from './D1L1.json';
import D1L2 from './D1L2.json';
import D1L3 from './D1L3.json';
import D1L4 from './D1L4.json';
import D1L5 from './D1L5.json';
import D1L6 from './D1L6.json';
import D1L7 from './D1L7.json';
import D1L8 from './D1L8.json';
import D2L1 from './D2L1.json';
import D2L2 from './D2L2.json';
import D2L3 from './D2L3.json';
import D2L4 from './D2L4.json';
import D2L5 from './D2L5.json';
import D2L6 from './D2L6.json';

// Lesson details map for quick lookup
export const lessonDetails: Record<string, any> = {
  // Path A: Foundation
  'A1L1': A1L1,
  'A1L2': A1L2,
  'A1L3': A1L3,
  'A1L4': A1L4,
  'A1L5': A1L5,
  'A1L6': A1L6,
  'A1L7': A1L7,
  'A1L8': A1L8,
  // Path B: People
  'B1L1': B1L1,
  'B1L2': B1L2,
  'B1L3': B1L3,
  'B1L4': B1L4,
  'B1L5': B1L5,
  'B1L6': B1L6,
  'B2L1': B2L1,
  'B2L2': B2L2,
  'B2L3': B2L3,
  'B2L4': B2L4,
  'B2L5': B2L5,
  // Path C: Process
  'C1L1': C1L1,
  'C1L2': C1L2,
  'C1L3': C1L3,
  'C1L4': C1L4,
  'C1L5': C1L5,
  'C1L6': C1L6,
  'C1L7': C1L7,
  'C1L8': C1L8,
  'C2L1': C2L1,
  'C2L2': C2L2,
  'C2L3': C2L3,
  'C2L4': C2L4,
  'C3L1': C3L1,
  'C3L2': C3L2,
  'C3L3': C3L3,
  'C3L4': C3L4,
  'C3L5': C3L5,
  'C3L6': C3L6,
  // Path D: Agile
  'D1L1': D1L1,
  'D1L2': D1L2,
  'D1L3': D1L3,
  'D1L4': D1L4,
  'D1L5': D1L5,
  'D1L6': D1L6,
  'D1L7': D1L7,
  'D1L8': D1L8,
  'D2L1': D2L1,
  'D2L2': D2L2,
  'D2L3': D2L3,
  'D2L4': D2L4,
  'D2L5': D2L5,
  'D2L6': D2L6,
};

/**
 * Get detailed lesson content by ID
 */
export function getLessonDetail(lessonId: string) {
  return lessonDetails[lessonId] || null;
}

/**
 * Get all lessons for a specific path
 */
export function getLessonDetailsByPath(pathId: string) {
  return Object.values(lessonDetails).filter(
    (lesson: any) => lesson.pathId === pathId
  );
}

/**
 * Get all lessons for a specific course
 */
export function getLessonDetailsByCourse(courseId: string) {
  return Object.values(lessonDetails).filter(
    (lesson: any) => lesson.courseId === courseId
  );
}

// Export individual lessons for direct import
export {
  // Path A: Foundation
  A1L1,
  A1L2,
  A1L3,
  A1L4,
  A1L5,
  A1L6,
  A1L7,
  A1L8,
  // Path B: People
  B1L1,
  B1L2,
  B1L3,
  B1L4,
  B1L5,
  B1L6,
  B2L1,
  B2L2,
  B2L3,
  B2L4,
  B2L5,
  // Path C: Process
  C1L1,
  C1L2,
  C1L3,
  C1L4,
  C1L5,
  C1L6,
  C1L7,
  C1L8,
  C2L1,
  C2L2,
  C2L3,
  C2L4,
  C3L1,
  C3L2,
  C3L3,
  C3L4,
  C3L5,
  C3L6,
  // Path D: Agile
  D1L1,
  D1L2,
  D1L3,
  D1L4,
  D1L5,
  D1L6,
  D1L7,
  D1L8,
  D2L1,
  D2L2,
  D2L3,
  D2L4,
  D2L5,
  D2L6,
};
