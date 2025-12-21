/**
 * Type definitions for lesson data structures
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  domain: string;
  order: number;
  courses: Course[];
}

export interface LearningPathsData {
  paths: LearningPath[];
}

export interface Lesson {
  id: string;
  title: string;
  courseId: string;
  pathId: string;
  order: number;
  duration: number;
  xpReward: number;
  description: string;
  objectives: string[];
  scenario: string;
}

export interface LessonsData {
  lessons: Lesson[];
}

/**
 * Extended types for UI display with computed properties
 */
export interface LearningPathWithProgress extends LearningPath {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
}

export interface LessonWithProgress extends Lesson {
  isCompleted: boolean;
  isLocked: boolean;
  isInProgress: boolean;
  progressPercent: number;
}

export interface CourseWithProgress extends Course {
  pathId: string;
  lessons: LessonWithProgress[];
  progress: number;
  completedCount: number;
}
