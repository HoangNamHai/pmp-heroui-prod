/**
 * Lesson Data Service
 * Provides access to learning paths and lessons data with computed progress
 */

import learningPathsData from '../data/learning-paths.json';
import lessonsData from '../data/lessons.json';
import type {
  LearningPath,
  Lesson,
  LearningPathWithProgress,
  LessonWithProgress,
  CourseWithProgress,
} from '../types/lesson';

// Mock user progress data - in production this would come from AsyncStorage or API
const mockCompletedLessons = new Set([
  'A1L1', 'A1L2', 'A1L3', 'A1L4', 'A1L5', 'A1L6', 'A1L7', 'A1L8',
  'B1L1', 'B1L2', 'B1L3', 'B1L4',
  'B2L1', 'B2L2',
  'C1L1', 'C1L2',
]);

const mockCurrentLesson = 'B1L5';
const mockLessonProgress: Record<string, number> = {
  'B1L5': 65,
};

/**
 * Get all learning paths with computed progress
 */
export function getLearningPaths(): LearningPathWithProgress[] {
  const paths = learningPathsData.paths as LearningPath[];

  return paths.map((path, index) => {
    const pathLessons = lessonsData.lessons.filter(
      (lesson) => lesson.pathId === path.id
    );

    const completedCount = pathLessons.filter(
      (lesson) => mockCompletedLessons.has(lesson.id)
    ).length;

    const totalLessons = pathLessons.length;
    const progress = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

    // Determine color based on progress
    let color = 'bg-default';
    if (progress === 100) {
      color = 'bg-success/20';
    } else if (progress > 0) {
      color = 'bg-accent/20';
    } else if (index === 0) {
      color = 'bg-accent/20';
    }

    return {
      ...path,
      progress,
      totalLessons,
      completedLessons: completedCount,
      color,
    };
  });
}

/**
 * Get a specific learning path by ID
 */
export function getLearningPath(pathId: string): LearningPathWithProgress | undefined {
  return getLearningPaths().find((path) => path.id === pathId);
}

/**
 * Get all lessons for a specific path
 */
export function getLessonsForPath(pathId: string): LessonWithProgress[] {
  const lessons = lessonsData.lessons.filter(
    (lesson) => lesson.pathId === pathId
  ) as Lesson[];

  return lessons
    .sort((a, b) => a.order - b.order)
    .map((lesson, index, arr) => {
      const isCompleted = mockCompletedLessons.has(lesson.id);
      const isInProgress = lesson.id === mockCurrentLesson;

      // A lesson is locked if no previous lessons are completed and it's not the first
      const previousLesson = arr[index - 1];
      const isLocked = index > 0 &&
        previousLesson &&
        !mockCompletedLessons.has(previousLesson.id) &&
        previousLesson.id !== mockCurrentLesson;

      const progressPercent = mockLessonProgress[lesson.id] || (isCompleted ? 100 : 0);

      return {
        ...lesson,
        isCompleted,
        isLocked,
        isInProgress,
        progressPercent,
      };
    });
}

/**
 * Get all lessons for a specific course
 */
export function getLessonsForCourse(courseId: string): LessonWithProgress[] {
  const lessons = lessonsData.lessons.filter(
    (lesson) => lesson.courseId === courseId
  ) as Lesson[];

  return lessons
    .sort((a, b) => a.order - b.order)
    .map((lesson, index, arr) => {
      const isCompleted = mockCompletedLessons.has(lesson.id);
      const isInProgress = lesson.id === mockCurrentLesson;

      const previousLesson = arr[index - 1];
      const isLocked = index > 0 &&
        previousLesson &&
        !mockCompletedLessons.has(previousLesson.id) &&
        previousLesson.id !== mockCurrentLesson;

      const progressPercent = mockLessonProgress[lesson.id] || (isCompleted ? 100 : 0);

      return {
        ...lesson,
        isCompleted,
        isLocked,
        isInProgress,
        progressPercent,
      };
    });
}

/**
 * Get courses with progress for a specific path
 */
export function getCoursesForPath(pathId: string): CourseWithProgress[] {
  const path = learningPathsData.paths.find((p) => p.id === pathId) as LearningPath | undefined;
  if (!path) return [];

  return path.courses.map((course) => {
    const lessons = getLessonsForCourse(course.id);
    const completedCount = lessons.filter((l) => l.isCompleted).length;
    const progress = lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

    return {
      ...course,
      pathId,
      lessons,
      progress,
      completedCount,
    };
  });
}

/**
 * Get the current/next lesson to continue
 */
export function getCurrentLesson(): LessonWithProgress | null {
  const lesson = lessonsData.lessons.find(
    (l) => l.id === mockCurrentLesson
  ) as Lesson | undefined;

  if (!lesson) return null;

  return {
    ...lesson,
    isCompleted: false,
    isLocked: false,
    isInProgress: true,
    progressPercent: mockLessonProgress[lesson.id] || 0,
  };
}

/**
 * Get the learning path for the current lesson
 */
export function getCurrentLessonPath(): LearningPathWithProgress | null {
  const currentLesson = getCurrentLesson();
  if (!currentLesson) return null;
  return getLearningPath(currentLesson.pathId) || null;
}

/**
 * Get overall progress stats
 */
export function getOverallStats() {
  const totalLessons = lessonsData.lessons.length;
  const completedLessons = mockCompletedLessons.size;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return {
    totalLessons,
    completedLessons,
    progress,
  };
}

/**
 * Get a specific lesson by ID
 */
export function getLesson(lessonId: string): LessonWithProgress | null {
  const lesson = lessonsData.lessons.find(
    (l) => l.id === lessonId
  ) as Lesson | undefined;

  if (!lesson) return null;

  const isCompleted = mockCompletedLessons.has(lesson.id);
  const isInProgress = lesson.id === mockCurrentLesson;

  return {
    ...lesson,
    isCompleted,
    isLocked: false,
    isInProgress,
    progressPercent: mockLessonProgress[lesson.id] || (isCompleted ? 100 : 0),
  };
}
