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

/**
 * Detailed lesson content types for the lesson player
 */

export interface LessonScreen {
  id: string;
  type: 'hook' | 'challenge' | 'reason' | 'feedback' | 'transfer' | 'wrap';
  duration: number;
  title?: string;
  headline?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: 'single_choice' | 'multi_select' | 'matching' | 'ranking' | 'free_text';
  question: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  correctAnswers?: string[];
  points: number;
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

export interface ChallengeScenario {
  id: string;
  title: string;
  description: string[];
  questions: Question[];
}

export interface ReasonBlock {
  id: string;
  title: string;
  duration: number;
  content: Record<string, any>;
}

export interface CharacterDialogue {
  character: string;
  text: string;
}

export interface LessonArtifact {
  type: 'pdf' | 'image';
  title: string;
  description: string;
}

export interface NextLessonInfo {
  id: string;
  title: string;
  teaser: string;
}

export interface LessonDetail {
  id: string;
  title: string;
  courseId: string;
  pathId: string;
  order: number;
  duration: number;
  xpReward: number;
  domain: string;
  description: string;
  objectives: string[];
  characters: string[];
  screens: LessonScreen[];
  totalPoints: number;
  masteryThreshold: number;
  retryAllowed: boolean;
}
