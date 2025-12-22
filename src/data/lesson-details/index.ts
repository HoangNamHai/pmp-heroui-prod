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

// Lesson details map for quick lookup
export const lessonDetails: Record<string, any> = {
  'A1L1': A1L1,
  'A1L2': A1L2,
  'A1L3': A1L3,
  'A1L4': A1L4,
  'A1L5': A1L5,
  'A1L6': A1L6,
  'A1L7': A1L7,
  'A1L8': A1L8,
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
  A1L1,
  A1L2,
  A1L3,
  A1L4,
  A1L5,
  A1L6,
  A1L7,
  A1L8,
};
