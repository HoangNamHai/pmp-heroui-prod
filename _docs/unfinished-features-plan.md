# F&B Tycoon - Implementation Plan for Unfinished Features

**Created:** 2025-12-25
**Status:** Draft
**Target Completion:** TBD

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Implementation Philosophy](#implementation-philosophy)
3. [Database Design Reference](#database-design-reference)
4. [Phase 0: Foundation - SQLite Setup (Week 1-3)](#phase-0-foundation-week-1-3)
5. [Phase 1: Core Data & Persistence (Week 4-5)](#phase-1-core-data--persistence-week-4-5)
6. [Phase 2: Navigation & User Flow (Week 6)](#phase-2-navigation--user-flow-week-6)
7. [Phase 3: Practice & Quiz System (Week 7-8)](#phase-3-practice--quiz-system-week-7-8)
8. [Phase 4: User Experience Polish (Week 9-10)](#phase-4-user-experience-polish-week-9-10)
9. [Phase 5: Advanced Features (Week 11-12)](#phase-5-advanced-features-week-11-12)
10. [Phase 6: Testing & Launch Prep (Week 13)](#phase-6-testing--launch-prep-week-13)
11. [Dependency Graph](#dependency-graph)
12. [Risk Mitigation](#risk-mitigation)
13. [Testing Strategy](#testing-strategy)
14. [Rollout Plan](#rollout-plan)

---

## Executive Summary

This plan addresses **21 critical gaps** in the F&B Tycoon app, organized into **6 implementation phases** over an estimated **13-week period**. The approach prioritizes:

1. **SQLite database foundation** - Robust, scalable data persistence
2. **Core user flows** - Enable primary workflows
3. **Feature completeness** - Implement missing quiz/practice system
4. **Polish & refinement** - UX enhancements
5. **Advanced features** - Notifications, achievements
6. **Launch readiness** - Testing, optimization

**Technology Stack:**
- **Database:** SQLite with Drizzle ORM
- **State Management:** Zustand
- **UI Framework:** HeroUI Native + Expo

**Key Metrics for Success:**
- 100% user progress persistence in SQLite
- 0 "Coming Soon" placeholders
- All navigation paths functional
- Database queries <50ms
- Stats calculation <100ms
- <2s app load time
- >95% crash-free sessions

---

## Implementation Philosophy

### Why SQLite Over AsyncStorage?

This plan adopts **SQLite with Drizzle ORM** as the data persistence layer instead of AsyncStorage for several critical reasons:

**Performance Benefits:**
- ✅ **Efficient Queries:** SQL aggregations (COUNT, SUM, AVG) run in the database, not JavaScript
- ✅ **Indexed Searches:** Sub-50ms queries even with thousands of records
- ✅ **Prepared Statements:** Reusable queries with better performance

**Scalability:**
- ✅ **No Size Limits:** SQLite handles GBs of data, AsyncStorage caps at ~6MB
- ✅ **Complex Queries:** Joins, filters, and sorting without loading everything into memory
- ✅ **Relational Data:** Proper foreign keys and data integrity

**Developer Experience:**
- ✅ **Type Safety:** Drizzle ORM provides full TypeScript inference
- ✅ **Schema Migrations:** Automatic schema evolution with version control
- ✅ **Transactions:** Atomic operations guarantee data consistency

**Future-Proof:**
- ✅ **API Ready:** Schema designed for future backend sync
- ✅ **No Migration Pain:** Avoid costly AsyncStorage → SQLite migration later
- ✅ **Industry Standard:** SQLite is battle-tested in millions of mobile apps

**Cost:** One extra week in Phase 0 prevents months of migration work later.

### Core Principles

1. **Build Foundation First**
   - Data layer before UI
   - SQLite schema before features
   - State management before features
   - Core flows before enhancements

2. **Incremental Delivery**
   - Each phase delivers working features
   - No long-running branches
   - Testable at every stage

3. **User-Centric**
   - Fix blocking issues first
   - Enable core workflows early
   - Polish comes after functionality

4. **Technical Excellence**
   - Proper TypeScript types with Drizzle inference
   - Database indexes for performance
   - Error boundaries everywhere
   - Performance monitoring

5. **Future-Proof**
   - Design for backend integration
   - Scalable data structures
   - Migration-friendly architecture with Drizzle

---

## Database Design Reference

This section provides a complete reference for the SQLite database schema, indexes, views, and common queries used throughout the F&B Tycoon app.

### Database Overview

**Database File:** `fnb-tycoon.db`
**ORM:** Drizzle ORM
**Tables:** 11 tables (7 user/progress + 4 static content)
**Indexes:** 20 performance indexes
**Views:** 3 materialized query helpers

### Entity Relationship Diagram

```
USER TABLES & PROGRESS:
┌─────────────────┐
│  user_profiles  │ ─┐
└─────────────────┘  │
                     │
    ┌────────────────┼────────────────┬─────────────────┬──────────────────┐
    │                │                │                 │                  │
    ▼                ▼                ▼                 ▼                  ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│user_settings │ │lesson_      │ │quiz_results  │ │streak_data   │ │achievements  │
│              │ │progress     │ │              │ │              │ │              │
└──────────────┘ └─────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
                       │                                   │                │
                       │ (references                       │                │
                       │  lessons.id)                      │                │
                       │                                   ▼                │ (references
                       │                            ┌──────────────┐        │  definitions.id)
                       │                            │streak_history│        │
                       │                            └──────────────┘        │
                       │                                                    │
STATIC CONTENT:        │                                                    │
                       │                                                    │
                       ▼                                                    ▼
                 ┌──────────┐                                    ┌─────────────────┐
        ┌────────│ lessons  │                                    │achievement_     │
        │        └──────────┘                                    │definitions      │
        │              │                                         └─────────────────┘
        │              │ (courseId FK)
        │              ▼
        │        ┌──────────┐
        │        │ courses  │
        │        └──────────┘
        │
        │        ┌────────────────┐
        └────────│quiz_questions  │ (standalone)
                 └────────────────┘
```

---

### Complete Schema Definition

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// ============================================================================
// USER TABLES
// ============================================================================

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  theme: text('theme', { enum: ['light', 'dark', 'auto'] }).notNull().default('light'),
  haptics: integer('haptics', { mode: 'boolean' }).notNull().default(true),
  soundEffects: integer('sound_effects', { mode: 'boolean' }).notNull().default(true),
  dailyGoal: integer('daily_goal').notNull().default(5),
  reminderEnabled: integer('reminder_enabled', { mode: 'boolean' }).notNull().default(false),
  reminderTime: text('reminder_time'), // Format: "HH:MM"
});

// ============================================================================
// LEARNING PROGRESS TABLES
// ============================================================================

export const lessonProgress = sqliteTable('lesson_progress', {
  id: text('id').primaryKey(),
  lessonId: text('lesson_id').notNull(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  progressPercent: integer('progress_percent').notNull().default(0),
  score: integer('score').notNull().default(0),
  timeSpent: integer('time_spent').notNull().default(0), // milliseconds
  completedAt: text('completed_at'),
  answeredQuestions: text('answered_questions', { mode: 'json' }).notNull().$type<Record<string, any>>(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  lessonIdIdx: index('lesson_id_idx').on(table.lessonId),
  userIdIdx: index('user_id_idx').on(table.userId),
  completedIdx: index('completed_idx').on(table.completedAt),
  userLessonIdx: index('user_lesson_idx').on(table.userId, table.lessonId), // Composite index
}));

export const quizResults = sqliteTable('quiz_results', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  quizType: text('quiz_type', { enum: ['practice', 'mock', 'lesson'] }).notNull(),
  lessonId: text('lesson_id'),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  answers: text('answers', { mode: 'json' }).notNull().$type<any[]>(),
  timeSpent: integer('time_spent').notNull(), // seconds
}, (table) => ({
  userIdIdx: index('quiz_user_id_idx').on(table.userId),
  typeIdx: index('quiz_type_idx').on(table.quizType),
  completedIdx: index('quiz_completed_idx').on(table.completedAt),
  scoreIdx: index('quiz_score_idx').on(table.score), // For leaderboards
}));

// ============================================================================
// STREAK TABLES
// ============================================================================

export const streakData = sqliteTable('streak_data', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: text('last_activity_date'), // YYYY-MM-DD
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const streakHistory = sqliteTable('streak_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  completed: integer('completed', { mode: 'boolean' }).notNull(),
  activityCount: integer('activity_count').notNull().default(1), // Number of lessons completed that day
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date), // Composite unique index
  dateIdx: index('date_idx').on(table.date), // For date range queries
}));

// ============================================================================
// ACHIEVEMENT TABLES
// ============================================================================

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: text('unlocked_at'),
  progress: integer('progress').notNull().default(0),
  totalRequired: integer('total_required').notNull(),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  userAchievementIdx: index('user_achievement_idx').on(table.userId, table.achievementId),
  unlockedIdx: index('unlocked_idx').on(table.unlockedAt), // For sorting unlocked achievements
}));

// ============================================================================
// STATIC CONTENT TABLES
// ============================================================================

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(), // 'C1', 'B2', etc.
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  order: integer('order').notNull(),
  totalLessons: integer('total_lessons').notNull(),
  estimatedDuration: integer('estimated_duration'), // total hours
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(), // 'C1L1', 'B2L5', etc.
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  duration: integer('duration').notNull(), // estimated minutes
  xpReward: integer('xp_reward').notNull().default(50),
  order: integer('order').notNull(), // lesson sequence in course
  isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  prerequisiteLessonId: text('prerequisite_lesson_id'), // Can be null for first lesson
  content: text('content', { mode: 'json' }).notNull().$type<LessonContent>(), // Full lesson content as JSON
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  courseIdx: index('lesson_course_idx').on(table.courseId),
  difficultyIdx: index('lesson_difficulty_idx').on(table.difficulty),
  orderIdx: index('lesson_order_idx').on(table.order),
}));

export const quizQuestions = sqliteTable('quiz_questions', {
  id: text('id').primaryKey(),
  topic: text('topic').notNull(), // 'project_integration', 'scope', etc.
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  type: text('type', { enum: ['mcq', 'true_false', 'matching'] }).notNull(),
  question: text('question').notNull(),
  options: text('options', { mode: 'json' }).$type<string[]>(), // For MCQ
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  points: integer('points').notNull().default(10),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  topicIdx: index('quiz_topic_idx').on(table.topic),
  difficultyIdx: index('quiz_difficulty_idx').on(table.difficulty),
  typeIdx: index('quiz_type_question_idx').on(table.type),
}));

export const achievementDefinitions = sqliteTable('achievement_definitions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  category: text('category', { enum: ['learning', 'consistency', 'mastery', 'social'] }).notNull(),
  target: integer('target').notNull(), // Required progress
  tier: text('tier', { enum: ['bronze', 'silver', 'gold', 'platinum'] }).notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  categoryIdx: index('achievement_category_idx').on(table.category),
  tierIdx: index('achievement_tier_idx').on(table.tier),
}));

// ============================================================================
// CONTENT TYPE DEFINITIONS
// ============================================================================

// Lesson content structure (stored as JSON in lessons.content column)
interface LessonContent {
  sections: LessonSection[];
}

interface LessonSection {
  id: string;
  type: 'explanation' | 'question' | 'practice' | 'summary';
  content: ExplanationContent | QuestionContent | PracticeContent;
}

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type StreakData = typeof streakData.$inferSelect;
export type InsertStreakData = typeof streakData.$inferInsert;
export type StreakHistory = typeof streakHistory.$inferSelect;
export type InsertStreakHistory = typeof streakHistory.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
export type AchievementDefinition = typeof achievementDefinitions.$inferSelect;
export type InsertAchievementDefinition = typeof achievementDefinitions.$inferInsert;
```

---

### Database Indexes

All indexes are designed for specific query patterns. Here's the complete list:

| Index Name | Table | Columns | Purpose |
|------------|-------|---------|---------|
| `lesson_id_idx` | lesson_progress | lessonId | Find progress for specific lesson |
| `user_id_idx` | lesson_progress | userId | Get all user's progress |
| `completed_idx` | lesson_progress | completedAt | Filter completed lessons |
| `user_lesson_idx` | lesson_progress | userId, lessonId | Composite for user+lesson queries |
| `quiz_user_id_idx` | quiz_results | userId | Get user's quiz history |
| `quiz_type_idx` | quiz_results | quizType | Filter by quiz type |
| `quiz_completed_idx` | quiz_results | completedAt | Sort by completion date |
| `quiz_score_idx` | quiz_results | score | Leaderboard queries |
| `user_date_idx` | streak_history | userId, date | Check specific date streak |
| `date_idx` | streak_history | date | Date range queries |
| `user_achievement_idx` | achievements | userId, achievementId | Check achievement progress |
| `unlocked_idx` | achievements | unlockedAt | Sort unlocked achievements |
| `lesson_course_idx` | lessons | courseId | Get all lessons for a course |
| `lesson_difficulty_idx` | lessons | difficulty | Filter lessons by difficulty |
| `lesson_order_idx` | lessons | order | Sort lessons in order |
| `quiz_topic_idx` | quiz_questions | topic | Get questions by topic |
| `quiz_difficulty_idx` | quiz_questions | difficulty | Filter questions by difficulty |
| `quiz_type_question_idx` | quiz_questions | type | Filter by question type |
| `achievement_category_idx` | achievement_definitions | category | Get achievements by category |
| `achievement_tier_idx` | achievement_definitions | tier | Filter by achievement tier |

**Index Performance Targets:**
- Simple lookups: <5ms
- Aggregations: <50ms
- Complex joins: <100ms

---

### Database Views

Views provide convenient access to commonly queried data:

```typescript
// src/db/views.ts
import { sql } from 'drizzle-orm';
import { db } from './index';

// ============================================================================
// VIEW 1: User Stats Summary
// ============================================================================

export const userStatsSummaryView = db.$with('user_stats_summary').as(
  db.select({
    userId: schema.userProfiles.id,
    name: schema.userProfiles.name,
    totalLessons: sql<number>`COUNT(DISTINCT CASE WHEN ${schema.lessonProgress.completedAt} IS NOT NULL THEN ${schema.lessonProgress.lessonId} END)`,
    totalXp: sql<number>`COALESCE(SUM(${schema.lessonProgress.score}), 0)`,
    totalQuizzes: sql<number>`COUNT(DISTINCT ${schema.quizResults.id})`,
    avgQuizScore: sql<number>`COALESCE(AVG(${schema.quizResults.score}), 0)`,
    currentStreak: schema.streakData.currentStreak,
    longestStreak: schema.streakData.longestStreak,
    totalStudyTime: sql<number>`COALESCE(SUM(${schema.lessonProgress.timeSpent}), 0)`,
  })
  .from(schema.userProfiles)
  .leftJoin(schema.lessonProgress, eq(schema.lessonProgress.userId, schema.userProfiles.id))
  .leftJoin(schema.quizResults, eq(schema.quizResults.userId, schema.userProfiles.id))
  .leftJoin(schema.streakData, eq(schema.streakData.userId, schema.userProfiles.id))
  .groupBy(schema.userProfiles.id)
);

// Usage:
// const stats = await db.with(userStatsSummaryView).select().from(userStatsSummaryView).where(eq(userStatsSummaryView.userId, 'user123'));

// ============================================================================
// VIEW 2: Recent Activity Feed
// ============================================================================

export const recentActivityView = db.$with('recent_activity').as(
  db.select({
    userId: schema.userProfiles.id,
    activityType: sql<'lesson' | 'quiz'>`'lesson'`,
    activityId: schema.lessonProgress.lessonId,
    completedAt: schema.lessonProgress.completedAt,
    score: schema.lessonProgress.score,
  })
  .from(schema.lessonProgress)
  .where(sql`${schema.lessonProgress.completedAt} IS NOT NULL`)
  .unionAll(
    db.select({
      userId: schema.quizResults.userId,
      activityType: sql<'lesson' | 'quiz'>`'quiz'`,
      activityId: schema.quizResults.id,
      completedAt: schema.quizResults.completedAt,
      score: schema.quizResults.score,
    })
    .from(schema.quizResults)
  )
);

// Usage:
// const recent = await db.with(recentActivityView).select().from(recentActivityView).where(eq(recentActivityView.userId, 'user123')).orderBy(desc(recentActivityView.completedAt)).limit(10);

// ============================================================================
// VIEW 3: Achievement Progress
// ============================================================================

export const achievementProgressView = db.$with('achievement_progress').as(
  db.select({
    userId: schema.achievements.userId,
    achievementId: schema.achievements.achievementId,
    progress: schema.achievements.progress,
    totalRequired: schema.achievements.totalRequired,
    percentComplete: sql<number>`CAST(${schema.achievements.progress} AS REAL) / ${schema.achievements.totalRequired} * 100`,
    isUnlocked: sql<boolean>`${schema.achievements.unlockedAt} IS NOT NULL`,
    unlockedAt: schema.achievements.unlockedAt,
  })
  .from(schema.achievements)
);

// Usage:
// const progress = await db.with(achievementProgressView).select().from(achievementProgressView).where(eq(achievementProgressView.userId, 'user123'));
```

---

### Common Queries

Here are the most frequently used queries with Drizzle ORM:

#### 1. Get User Stats (Fast Aggregation)

```typescript
async function getUserStats(userId: string) {
  const [lessons] = await db
    .select({ count: count() })
    .from(schema.lessonProgress)
    .where(and(
      eq(schema.lessonProgress.userId, userId),
      sql`${schema.lessonProgress.completedAt} IS NOT NULL`
    ));

  const [xp] = await db
    .select({
      total: sum(schema.lessonProgress.score),
      time: sum(schema.lessonProgress.timeSpent),
    })
    .from(schema.lessonProgress)
    .where(eq(schema.lessonProgress.userId, userId));

  const [quizStats] = await db
    .select({
      count: count(),
      avgScore: avg(schema.quizResults.score),
    })
    .from(schema.quizResults)
    .where(eq(schema.quizResults.userId, userId));

  const [streak] = await db
    .select()
    .from(schema.streakData)
    .where(eq(schema.streakData.userId, userId));

  return {
    lessonsCompleted: lessons.count,
    totalXp: xp.total ?? 0,
    studyTime: Math.round((xp.time ?? 0) / 60000),
    quizzesTaken: quizStats.count,
    avgScore: Math.round(quizStats.avgScore ?? 0),
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
}
```

#### 2. Get In-Progress Lessons

```typescript
async function getInProgressLessons(userId: string) {
  return db
    .select()
    .from(schema.lessonProgress)
    .where(and(
      eq(schema.lessonProgress.userId, userId),
      sql`${schema.lessonProgress.completedAt} IS NULL`,
      sql`${schema.lessonProgress.progressPercent} > 0`
    ))
    .orderBy(desc(schema.lessonProgress.updatedAt));
}
```

#### 3. Get Quiz History with Filters

```typescript
async function getQuizHistory(userId: string, filters?: { type?: string; limit?: number; minScore?: number }) {
  let query = db
    .select()
    .from(schema.quizResults)
    .where(eq(schema.quizResults.userId, userId))
    .$dynamic();

  if (filters?.type) {
    query = query.where(eq(schema.quizResults.quizType, filters.type));
  }

  if (filters?.minScore !== undefined) {
    query = query.where(gte(schema.quizResults.score, filters.minScore));
  }

  return query
    .orderBy(desc(schema.quizResults.completedAt))
    .limit(filters?.limit ?? 50);
}
```

#### 4. Check Daily Streak

```typescript
async function checkTodayStreak(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  const [result] = await db
    .select()
    .from(schema.streakHistory)
    .where(and(
      eq(schema.streakHistory.userId, userId),
      eq(schema.streakHistory.date, today)
    ))
    .limit(1);

  return result?.completed ?? false;
}
```

#### 5. Update Lesson Progress (Upsert)

```typescript
async function updateLessonProgress(progress: InsertLessonProgress) {
  await db.insert(schema.lessonProgress)
    .values({
      ...progress,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: schema.lessonProgress.id,
      set: {
        progressPercent: progress.progressPercent,
        score: progress.score,
        timeSpent: progress.timeSpent,
        answeredQuestions: progress.answeredQuestions,
        completedAt: progress.completedAt,
        updatedAt: new Date().toISOString(),
      },
    });
}
```

#### 6. Atomic Lesson Completion (Transaction)

```typescript
async function completeLesson(userId: string, lessonId: string, score: number) {
  await db.transaction(async (tx) => {
    // 1. Mark lesson as complete
    await tx.update(schema.lessonProgress)
      .set({
        completedAt: new Date().toISOString(),
        progressPercent: 100,
        score,
        updatedAt: new Date().toISOString(),
      })
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        eq(schema.lessonProgress.lessonId, lessonId)
      ));

    // 2. Update streak
    const today = new Date().toISOString().split('T')[0];

    await tx.insert(schema.streakHistory)
      .values({
        id: `${userId}_${today}`,
        userId,
        date: today,
        completed: true,
        activityCount: 1,
      })
      .onConflictDoUpdate({
        target: schema.streakHistory.id,
        set: {
          activityCount: sql`${schema.streakHistory.activityCount} + 1`,
        },
      });

    // 3. Update streak data
    const [streakData] = await tx
      .select()
      .from(schema.streakData)
      .where(eq(schema.streakData.userId, userId));

    if (streakData) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = streakData.lastActivityDate === yesterday || streakData.lastActivityDate === today;

      await tx.update(schema.streakData)
        .set({
          currentStreak: isConsecutive ? streakData.currentStreak + 1 : 1,
          longestStreak: Math.max(streakData.longestStreak, isConsecutive ? streakData.currentStreak + 1 : 1),
          lastActivityDate: today,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.streakData.userId, userId));
    }
  });
}
```

#### 7. Get Leaderboard (Top Scores)

```typescript
async function getLeaderboard(limit: number = 10) {
  return db
    .select({
      userId: schema.userProfiles.id,
      name: schema.userProfiles.name,
      avatar: schema.userProfiles.avatar,
      totalXp: sum(schema.lessonProgress.score),
      lessonsCompleted: count(schema.lessonProgress.id),
    })
    .from(schema.userProfiles)
    .leftJoin(schema.lessonProgress, eq(schema.lessonProgress.userId, schema.userProfiles.id))
    .groupBy(schema.userProfiles.id)
    .orderBy(desc(sum(schema.lessonProgress.score)))
    .limit(limit);
}
```

#### 8. Search Lessons by Keyword (Full-Text Search)

```typescript
async function searchLessons(userId: string, keyword: string) {
  // Note: For production, consider enabling FTS5 extension
  return db
    .select()
    .from(schema.lessonProgress)
    .where(and(
      eq(schema.lessonProgress.userId, userId),
      sql`${schema.lessonProgress.lessonId} LIKE ${'%' + keyword + '%'}`
    ))
    .limit(20);
}
```

---

### Performance Optimization Tips

1. **Always use indexes for WHERE clauses**
   ```typescript
   // ✅ Good - uses index
   .where(eq(schema.lessonProgress.userId, userId))

   // ❌ Bad - no index, slow
   .where(sql`LOWER(${schema.lessonProgress.lessonId}) = 'c1l1'`)
   ```

2. **Use prepared statements for repeated queries**
   ```typescript
   const getProgressStmt = db
     .select()
     .from(schema.lessonProgress)
     .where(eq(schema.lessonProgress.lessonId, sql.placeholder('lessonId')))
     .prepare();

   // Reuse
   const progress = await getProgressStmt.execute({ lessonId: 'C1L1' });
   ```

3. **Batch operations with transactions**
   ```typescript
   await db.transaction(async (tx) => {
     for (const item of items) {
       await tx.insert(schema.lessonProgress).values(item);
     }
   });
   ```

4. **Use EXPLAIN QUERY PLAN to optimize**
   ```typescript
   const plan = await db.run(sql`EXPLAIN QUERY PLAN SELECT * FROM lesson_progress WHERE user_id = 'user123'`);
   console.log(plan);
   ```

5. **Regular maintenance**
   ```typescript
   // Run weekly
   await db.run(sql`VACUUM`); // Reclaim space
   await db.run(sql`ANALYZE`); // Update statistics
   ```

---

### Migration Strategy

All schema changes must go through Drizzle migrations:

```bash
# Generate migration after schema changes
npx drizzle-kit generate:sqlite

# Apply migrations
npx drizzle-kit push:sqlite

# Inspect current schema
npx drizzle-kit introspect:sqlite
```

**Migration Guidelines:**
- Never edit generated migration files directly
- Test migrations on sample data first
- Always create backup before production migrations
- Use transactions for complex migrations
- Document breaking changes in migration comments

---

## Phase 0: Foundation (Week 1-3)

**Goal:** Establish robust SQLite database architecture and development infrastructure

### 0.0 Dependencies Installation

**Tasks:**
- [ ] Install expo-sqlite
- [ ] Install drizzle-orm and drizzle-kit
- [ ] Install expo-file-system and expo-asset
- [ ] Configure Drizzle for React Native
- [ ] Set up database bundling in build process

**Installation:**

```bash
# Install core dependencies
npm install expo-sqlite@next drizzle-orm

# Install file system dependencies for database copying
npm install expo-file-system expo-asset

# Install dev dependencies for migrations and seeding
npm install -D drizzle-kit
```

**Configuration:**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'expo',
  out: './src/db/migrations',
});
```

**Deliverables:**
- All dependencies installed
- Drizzle configured
- Package.json updated
- Expo config updated to include database asset

**Acceptance Criteria:**
- Dependencies install without errors
- Drizzle config valid
- Can run Drizzle commands
- Expo recognizes .db files as assets

---

### 0.1 Database Schema Design

**Tasks:**
- [ ] Design SQLite database schema for all data types
- [ ] Create Drizzle ORM schema definitions
- [ ] Design migration strategy for future schema changes
- [ ] Document database architecture
- [ ] Set up indexes for performance

**Database Schema:**

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull(),
});

export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  theme: text('theme').notNull().default('light'),
  haptics: integer('haptics', { mode: 'boolean' }).notNull().default(true),
  soundEffects: integer('sound_effects', { mode: 'boolean' }).notNull().default(true),
  dailyGoal: integer('daily_goal').notNull().default(5),
  reminderEnabled: integer('reminder_enabled', { mode: 'boolean' }).notNull().default(false),
  reminderTime: text('reminder_time'),
});

export const lessonProgress = sqliteTable('lesson_progress', {
  id: text('id').primaryKey(),
  lessonId: text('lesson_id').notNull(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  progressPercent: integer('progress_percent').notNull().default(0),
  score: integer('score').notNull().default(0),
  timeSpent: integer('time_spent').notNull().default(0), // milliseconds
  completedAt: text('completed_at'),
  answeredQuestions: text('answered_questions', { mode: 'json' }).notNull(), // JSON
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => ({
  lessonIdIdx: index('lesson_id_idx').on(table.lessonId),
  userIdIdx: index('user_id_idx').on(table.userId),
  completedIdx: index('completed_idx').on(table.completedAt),
}));

export const quizResults = sqliteTable('quiz_results', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  quizType: text('quiz_type').notNull(), // 'practice' | 'mock' | 'lesson'
  lessonId: text('lesson_id'),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  answers: text('answers', { mode: 'json' }).notNull(), // JSON
  timeSpent: integer('time_spent').notNull(), // seconds
}, (table) => ({
  userIdIdx: index('quiz_user_id_idx').on(table.userId),
  typeIdx: index('quiz_type_idx').on(table.quizType),
  completedIdx: index('quiz_completed_idx').on(table.completedAt),
}));

export const streakHistory = sqliteTable('streak_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  date: text('date').notNull(), // YYYY-MM-DD
  completed: integer('completed', { mode: 'boolean' }).notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date),
}));

export const streakData = sqliteTable('streak_data', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: text('last_activity_date'),
  updatedAt: text('updated_at').notNull(),
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userProfiles.id),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: text('unlocked_at'),
  progress: integer('progress').notNull().default(0),
  totalRequired: integer('total_required').notNull(),
}, (table) => ({
  userAchievementIdx: index('user_achievement_idx').on(table.userId, table.achievementId),
}));

// TypeScript types inferred from schema
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
```

**Deliverables:**
- `src/db/schema.ts` - Complete Drizzle schema
- `src/types/data-models.ts` - TypeScript interfaces
- `src/db/migrations/` - Migration files
- `ARCHITECTURE.md` - Database architecture documentation

**Acceptance Criteria:**
- All tables properly defined with indexes
- Foreign keys established
- Schema supports future API integration
- Migration strategy documented

---

### 0.2 Seed Database Creation & Bundling

**Tasks:**
- [ ] Create seed database with schema, indexes, and views
- [ ] Populate seed data (lessons, quiz questions, achievements)
- [ ] Create database seeding script
- [ ] Bundle database as app asset
- [ ] Implement database copy on first launch

**Implementation:**

#### Step 1: Create Seed Database

```typescript
// scripts/create-seed-db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/db/schema';
import { sql } from 'drizzle-orm';

// Create seed database
const sqlite = new Database('assets/fnb-tycoon.seed.db');
const db = drizzle(sqlite, { schema });

async function createSeedDatabase() {
  console.log('🌱 Creating seed database...');

  // 1. Run migrations to create schema
  await migrate(db, { migrationsFolder: './src/db/migrations' });

  // 2. Create indexes (already in schema, but verify)
  console.log('📊 Creating indexes...');

  // 3. Create views
  console.log('👁️  Creating views...');
  await db.run(sql`
    CREATE VIEW IF NOT EXISTS user_stats_view AS
    SELECT
      up.id as user_id,
      up.name,
      COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) as total_lessons,
      COALESCE(SUM(lp.score), 0) as total_xp,
      sd.current_streak,
      sd.longest_streak
    FROM user_profiles up
    LEFT JOIN lesson_progress lp ON lp.user_id = up.id
    LEFT JOIN streak_data sd ON sd.user_id = up.id
    GROUP BY up.id;
  `);

  // 4. Seed initial data
  console.log('📦 Seeding initial data...');

  // Achievement definitions
  await db.insert(schema.achievementDefinitions).values([
    { id: 'week_warrior', name: 'Week Warrior', description: '7 day streak', icon: '🔥', target: 7 },
    { id: 'first_lesson', name: 'First Steps', description: 'Complete first lesson', icon: '🎯', target: 1 },
    { id: 'quiz_master', name: 'Quiz Master', description: '10 perfect quiz scores', icon: '🏆', target: 10 },
    // ... more achievements
  ]);

  // Default settings template
  // (User-specific data will be created on first app launch)

  // 5. Optimize database
  console.log('⚡ Optimizing database...');
  await db.run(sql`VACUUM`);
  await db.run(sql`ANALYZE`);

  console.log('✅ Seed database created successfully!');
  console.log(`📁 Location: assets/fnb-tycoon.seed.db`);

  // Check size
  const stats = sqlite.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get();
  console.log(`💾 Database size: ${(stats.size / 1024).toFixed(2)} KB`);

  sqlite.close();
}

createSeedDatabase().catch(console.error);
```

#### Step 2: Bundle Database with App

```typescript
// app.json - Register database as asset
{
  "expo": {
    "assetBundlePatterns": [
      "assets/**/*",
      "assets/fnb-tycoon.seed.db"
    ]
  }
}
```

#### Step 3: Database Initialization on First Launch

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as schema from './schema';

const DB_NAME = 'fnb-tycoon.db';
const DB_VERSION = 1; // Increment this when seed database changes

// Database will be stored in DocumentDirectory
const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

let db: ReturnType<typeof drizzle> | null = null;

export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database...');

    // Check if database exists
    const dbDir = `${FileSystem.documentDirectory}SQLite`;
    const dirInfo = await FileSystem.getInfoAsync(dbDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    const versionPath = `${FileSystem.documentDirectory}SQLite/db_version.txt`;
    const versionInfo = await FileSystem.getInfoAsync(versionPath);

    let needsCopy = false;

    if (!dbInfo.exists) {
      console.log('📂 Database not found, will copy seed database');
      needsCopy = true;
    } else if (!versionInfo.exists) {
      console.log('⚠️  No version file, will recopy database');
      needsCopy = true;
    } else {
      const currentVersion = await FileSystem.readAsStringAsync(versionPath);
      if (parseInt(currentVersion) < DB_VERSION) {
        console.log(`📈 Database version outdated (${currentVersion} → ${DB_VERSION}), will update`);
        needsCopy = true;
      }
    }

    if (needsCopy) {
      console.log('📋 Copying seed database to app directory...');

      // Load bundled database asset
      const asset = Asset.fromModule(require('../../assets/fnb-tycoon.seed.db'));
      await asset.downloadAsync();

      // Copy to app directory
      await FileSystem.copyAsync({
        from: asset.localUri!,
        to: dbPath,
      });

      // Write version file
      await FileSystem.writeAsStringAsync(versionPath, DB_VERSION.toString());

      console.log('✅ Seed database copied successfully');
    } else {
      console.log('✅ Database already exists and is up to date');
    }

    // Open database
    const expoDb = openDatabaseSync(DB_NAME);
    db = drizzle(expoDb, { schema });

    console.log('✅ Database initialized successfully');

    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

// Export for convenience
export { db };
```

#### Step 4: App Initialization

```typescript
// src/app/_layout.tsx
import { useEffect, useState } from 'react';
import { initializeDatabase } from '@/db';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        console.log('Database ready');
        setDbReady(true);
      })
      .catch(console.error);
  }, []);

  if (!dbReady) {
    return <LoadingScreen message="Initializing app..." />;
  }

  return <App />;
}
```

```typescript
// src/services/storage.service.ts
import { eq, desc, and, sql, count, sum, avg } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';

export class StorageService {
  // User Profile
  static async getUserProfile(userId: string): Promise<schema.UserProfile | null> {
    const [user] = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.id, userId))
      .limit(1);
    return user ?? null;
  }

  static async saveUserProfile(profile: schema.InsertUserProfile): Promise<void> {
    await db.insert(schema.userProfiles).values(profile)
      .onConflictDoUpdate({
        target: schema.userProfiles.id,
        set: {
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        },
      });
  }

  // Lesson Progress
  static async getLessonProgress(lessonId: string, userId: string): Promise<schema.LessonProgress | null> {
    const [progress] = await db
      .select()
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.lessonId, lessonId),
        eq(schema.lessonProgress.userId, userId)
      ))
      .limit(1);
    return progress ?? null;
  }

  static async saveLessonProgress(progress: schema.InsertLessonProgress): Promise<void> {
    await db.insert(schema.lessonProgress).values(progress)
      .onConflictDoUpdate({
        target: schema.lessonProgress.id,
        set: {
          progressPercent: progress.progressPercent,
          score: progress.score,
          timeSpent: progress.timeSpent,
          answeredQuestions: progress.answeredQuestions,
          completedAt: progress.completedAt,
          updatedAt: new Date().toISOString(),
        },
      });
  }

  static async getAllCompletedLessons(userId: string): Promise<string[]> {
    const results = await db
      .select({ lessonId: schema.lessonProgress.lessonId })
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        sql`${schema.lessonProgress.completedAt} IS NOT NULL`
      ));
    return results.map(r => r.lessonId);
  }

  static async getCurrentLesson(userId: string): Promise<string | null> {
    const [result] = await db
      .select({ lessonId: schema.lessonProgress.lessonId })
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        sql`${schema.lessonProgress.completedAt} IS NULL`
      ))
      .orderBy(desc(schema.lessonProgress.updatedAt))
      .limit(1);
    return result?.lessonId ?? null;
  }

  // Quiz Results
  static async getQuizResults(userId: string, filters?: { type?: string; limit?: number }): Promise<schema.QuizResult[]> {
    let query = db
      .select()
      .from(schema.quizResults)
      .where(eq(schema.quizResults.userId, userId))
      .$dynamic();

    if (filters?.type) {
      query = query.where(eq(schema.quizResults.quizType, filters.type));
    }

    return query
      .orderBy(desc(schema.quizResults.completedAt))
      .limit(filters?.limit ?? 100);
  }

  static async saveQuizResult(result: schema.InsertQuizResult): Promise<void> {
    await db.insert(schema.quizResults).values(result);
  }

  static async getQuizResultById(id: string): Promise<schema.QuizResult | null> {
    const [result] = await db
      .select()
      .from(schema.quizResults)
      .where(eq(schema.quizResults.id, id))
      .limit(1);
    return result ?? null;
  }

  // Streak Data
  static async getStreakData(userId: string): Promise<schema.StreakData | null> {
    const [streak] = await db
      .select()
      .from(schema.streakData)
      .where(eq(schema.streakData.userId, userId))
      .limit(1);
    return streak ?? null;
  }

  static async saveStreakData(streak: schema.InsertStreakData): Promise<void> {
    await db.insert(schema.streakData).values(streak)
      .onConflictDoUpdate({
        target: schema.streakData.id,
        set: {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActivityDate: streak.lastActivityDate,
          updatedAt: new Date().toISOString(),
        },
      });
  }

  // Achievements
  static async getAchievements(userId: string): Promise<schema.Achievement[]> {
    return db
      .select()
      .from(schema.achievements)
      .where(eq(schema.achievements.userId, userId));
  }

  static async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await db.insert(schema.achievements).values({
      id: `${userId}_${achievementId}`,
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
      progress: 100,
      totalRequired: 100,
    }).onConflictDoUpdate({
      target: schema.achievements.id,
      set: { unlockedAt: new Date().toISOString() },
    });
  }

  // Stats - Efficient SQL aggregation
  static async calculateStats(userId: string): Promise<LearningStats> {
    // Count completed lessons
    const [lessonsResult] = await db
      .select({ count: count() })
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        sql`${schema.lessonProgress.completedAt} IS NOT NULL`
      ));

    // Calculate total XP and study time
    const [xpResult] = await db
      .select({
        totalXp: sum(schema.lessonProgress.score),
        totalTime: sum(schema.lessonProgress.timeSpent),
      })
      .from(schema.lessonProgress)
      .where(eq(schema.lessonProgress.userId, userId));

    // Calculate average quiz score
    const [quizResult] = await db
      .select({
        avgScore: avg(schema.quizResults.score),
        quizCount: count(),
      })
      .from(schema.quizResults)
      .where(eq(schema.quizResults.userId, userId));

    // Get streak data
    const streak = await this.getStreakData(userId);

    return {
      totalLessonsCompleted: lessonsResult.count,
      totalXpEarned: xpResult.totalXp ?? 0,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      averageScore: Math.round(quizResult.avgScore ?? 0),
      totalStudyTime: Math.round((xpResult.totalTime ?? 0) / 60000), // Convert to minutes
      totalQuizzesTaken: quizResult.quizCount,
    };
  }

  // Clear all user data (for testing/logout)
  static async clearAllData(userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(schema.lessonProgress).where(eq(schema.lessonProgress.userId, userId));
      await tx.delete(schema.quizResults).where(eq(schema.quizResults.userId, userId));
      await tx.delete(schema.streakData).where(eq(schema.streakData.userId, userId));
      await tx.delete(schema.streakHistory).where(eq(schema.streakHistory.userId, userId));
      await tx.delete(schema.achievements).where(eq(schema.achievements.userId, userId));
      await tx.delete(schema.userSettings).where(eq(schema.userSettings.userId, userId));
      await tx.delete(schema.userProfiles).where(eq(schema.userProfiles.id, userId));
    });
  }
}
```

**Benefits of Bundled Database Approach:**
- ✅ **Instant startup** - No migration execution on first launch
- ✅ **Pre-populated data** - Lessons, quizzes, achievements already included
- ✅ **Smaller bundle size** - SQLite is highly compressed
- ✅ **Consistent state** - All users start with identical database
- ✅ **Easy testing** - Test the exact database that ships
- ✅ **Version control** - Database versioning built-in

**Deliverables:**
- `scripts/create-seed-db.ts` - Seed database creation script
- `assets/fnb-tycoon.seed.db` - Pre-configured SQLite database (~50-100KB)
- `src/db/index.ts` - Database initialization with copy logic
- `src/services/storage.service.ts` - Complete storage service with Drizzle
- `package.json` - Build script to generate seed database
- Updated `app.json` with asset bundle patterns

**Build Process:**
```bash
# Add to package.json scripts
"db:seed": "tsx scripts/create-seed-db.ts",
"db:regenerate": "rm -f assets/fnb-tycoon.seed.db && npm run db:seed"
```

**Acceptance Criteria:**
- ✅ Seed database created with all schema, indexes, and views
- ✅ Database bundles with app (check build output)
- ✅ First launch copies database correctly (<500ms)
- ✅ Subsequent launches skip copy (version check works)
- ✅ All CRUD operations work correctly
- ✅ Database version tracking works
- ✅ Handles SQLite errors gracefully
- ✅ Transactions used for data integrity
- ✅ Efficient queries with proper indexes

---

### 0.3 Database Versioning & Update Strategy

**Tasks:**
- [ ] Implement database version checking
- [ ] Create migration system for database updates
- [ ] Handle schema changes in app updates
- [ ] Preserve user data during updates

**Update Scenarios:**

#### Scenario 1: Schema Changes (New Columns, Tables)

When you need to add new features that require schema changes:

```typescript
// Approach: Use migrations after database copy

export async function initializeDatabase() {
  // ... copy seed database logic ...

  // After database is copied/opened, run migrations
  const currentSchemaVersion = await getSchemaVersion(db);

  if (currentSchemaVersion < TARGET_SCHEMA_VERSION) {
    console.log(`📈 Running migrations: v${currentSchemaVersion} → v${TARGET_SCHEMA_VERSION}`);
    await runMigrations(db, currentSchemaVersion);
  }
}

async function runMigrations(db: Database, fromVersion: number) {
  // Migration v1 → v2: Add new achievement table
  if (fromVersion < 2) {
    await db.run(sql`
      ALTER TABLE achievements ADD COLUMN category TEXT DEFAULT 'general'
    `);
    await setSchemaVersion(db, 2);
  }

  // Migration v2 → v3: Add quiz difficulty
  if (fromVersion < 3) {
    await db.run(sql`
      ALTER TABLE quiz_results ADD COLUMN difficulty TEXT DEFAULT 'medium'
    `);
    await setSchemaVersion(db, 3);
  }
}
```

#### Scenario 2: Content Updates (New Lessons, Quizzes)

When you just need to update static content:

```typescript
// Approach: Increment DB_VERSION and regenerate seed database

// 1. Update lesson data in seed script
// 2. Increment DB_VERSION in src/db/index.ts
const DB_VERSION = 2; // Was 1

// 3. Regenerate seed database
npm run db:seed

// 4. On app update, old database is replaced with new seed
// User data is preserved by:
// - Exporting user data before copy
// - Importing after copy
```

#### Scenario 3: Hybrid Approach (Best for this app)

```typescript
export async function initializeDatabase() {
  const versionPath = `${FileSystem.documentDirectory}SQLite/db_version.txt`;
  let currentDbVersion = 0;

  // Check current version
  const versionInfo = await FileSystem.getInfoAsync(versionPath);
  if (versionInfo.exists) {
    currentDbVersion = parseInt(await FileSystem.readAsStringAsync(versionPath));
  }

  // Strategy 1: Full database replacement for major versions
  if (currentDbVersion < DB_VERSION && shouldReplaceDatabase(currentDbVersion, DB_VERSION)) {
    console.log('🔄 Major version change, preserving user data...');

    // 1. Export user data
    const userData = await exportUserData(db);

    // 2. Replace database
    await copyBundledDatabase();

    // 3. Restore user data
    await importUserData(db, userData);

    await FileSystem.writeAsStringAsync(versionPath, DB_VERSION.toString());
  }
  // Strategy 2: Migrations for minor updates
  else if (needsMigration(currentDbVersion)) {
    console.log('⚡ Running incremental migrations...');
    await runMigrations(db, currentDbVersion);
  }
}

// Helper: Export user-specific data
async function exportUserData(db: Database) {
  const [profile] = await db.select().from(schema.userProfiles).limit(1);

  if (!profile) return null;

  return {
    profile,
    settings: await db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, profile.id)),
    progress: await db.select().from(schema.lessonProgress).where(eq(schema.lessonProgress.userId, profile.id)),
    quizzes: await db.select().from(schema.quizResults).where(eq(schema.quizResults.userId, profile.id)),
    streak: await db.select().from(schema.streakData).where(eq(schema.streakData.userId, profile.id)),
    achievements: await db.select().from(schema.achievements).where(eq(schema.achievements.userId, profile.id)),
  };
}

// Helper: Restore user data after database replacement
async function importUserData(db: Database, userData: any) {
  if (!userData) return;

  await db.transaction(async (tx) => {
    await tx.insert(schema.userProfiles).values(userData.profile);
    if (userData.settings.length) await tx.insert(schema.userSettings).values(userData.settings);
    if (userData.progress.length) await tx.insert(schema.lessonProgress).values(userData.progress);
    if (userData.quizzes.length) await tx.insert(schema.quizResults).values(userData.quizzes);
    if (userData.streak.length) await tx.insert(schema.streakData).values(userData.streak);
    if (userData.achievements.length) await tx.insert(schema.achievements).values(userData.achievements);
  });
}
```

**Version Numbering Strategy:**

```typescript
// Use semantic versioning for database
// MAJOR.MINOR format encoded as integer
// Example: v2.3 = 203

const DB_VERSION_MAJOR = 1; // Breaking changes, requires data migration
const DB_VERSION_MINOR = 0; // Additive changes, can use ALTER TABLE
const DB_VERSION = DB_VERSION_MAJOR * 100 + DB_VERSION_MINOR; // 100

// Major version change: 1.0 → 2.0 (100 → 200)
// - New seed database with user data preservation

// Minor version change: 1.0 → 1.1 (100 → 101)
// - Run migrations only
```

**Deliverables:**
- Database versioning system
- User data export/import utilities
- Migration runner
- Update strategy documentation

**Acceptance Criteria:**
- ✅ App updates preserve user data
- ✅ Schema migrations run correctly
- ✅ Content updates apply seamlessly
- ✅ Version checking is reliable
- ✅ Rollback possible if update fails

---

### 0.4 State Management Setup

**Tasks:**
- [ ] Create Zustand store for global app state
- [ ] Define state slices for different domains
- [ ] Connect Zustand to SQLite backend
- [ ] Add DevTools for debugging

**Implementation:**

```typescript
// src/store/app.store.ts
interface AppStore {
  // User slice
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;

  // Progress slice
  completedLessons: Set<string>;
  currentLesson: string | null;
  lessonProgress: Record<string, LessonProgress>;
  markLessonComplete: (lessonId: string) => void;
  updateLessonProgress: (lessonId: string, progress: number) => void;

  // Stats slice
  stats: LearningStats;
  refreshStats: () => Promise<void>;

  // Streak slice
  streak: StreakData;
  checkAndUpdateStreak: () => Promise<void>;

  // Settings slice
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Init
  isInitialized: boolean;
  initializeApp: () => Promise<void>;
}
```

**Deliverables:**
- `src/store/app.store.ts` - Main Zustand store
- `src/store/slices/` - Individual state slices
- `src/hooks/useAppStore.ts` - Custom hooks

**Acceptance Criteria:**
- State persists across app restarts
- Updates trigger React re-renders
- DevTools work in development mode

---

### 0.5 Seed Static Content & Remove Mock Data

**Tasks:**
- [ ] Create lesson data seeding for seed database
- [ ] Create quiz question bank for seed database
- [ ] Create achievement definitions for seed database
- [ ] Update `lesson-data.ts` to load from SQLite
- [ ] Remove all hardcoded mock data
- [ ] Verify all content loads from database

**Implementation:**

```typescript
// scripts/seed-static-content.ts
import { db } from './create-seed-db';
import * as schema from '../src/db/schema';

export async function seedStaticContent() {
  console.log('📦 Seeding static content...');

  // 1. Seed Achievement Definitions
  await db.insert(schema.achievementDefinitions).values([
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      category: 'learning',
      target: 1,
      tier: 'bronze',
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'consistency',
      target: 7,
      tier: 'silver',
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      description: 'Score 100% on 10 quizzes',
      icon: '🏆',
      category: 'mastery',
      target: 10,
      tier: 'gold',
    },
    // ... 20+ more achievements
  ]);

  // 2. Seed Lesson Metadata (if not in JSON files)
  // This is optional - you can keep lesson content in JSON files
  // and just reference them from the database

  // 3. Seed Quiz Question Bank
  await db.insert(schema.quizQuestions).values([
    {
      id: 'q001',
      topic: 'project_integration',
      difficulty: 'beginner',
      type: 'mcq',
      question: 'What is the primary goal of project integration management?',
      options: JSON.stringify([
        'To ensure project elements are coordinated',
        'To manage project costs',
        'To schedule project activities',
        'To manage project risks',
      ]),
      correctAnswer: '0',
      explanation: 'Project integration management focuses on coordinating all aspects of the project.',
      points: 10,
    },
    // ... 500+ more questions
  ]);

  console.log('✅ Static content seeded');
}
```

**Recommended Approach: Store Everything in SQLite**

Store lesson content in SQLite for these key benefits:

1. ✅ **Single source of truth** - All content in one database
2. ✅ **Queryable** - Filter by difficulty, search, recommendations
3. ✅ **Relational** - Link lessons to prerequisites, courses, progress
4. ✅ **Scalable** - Handle 100s of lessons efficiently
5. ✅ **Performance** - Faster than loading many JSON files
6. ✅ **Flexible** - Easy to add metadata, tags, relationships

**Lesson Content Schema:**

```typescript
// Add to src/db/schema.ts

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(), // 'C1L1', 'B2L5', etc.
  courseId: text('course_id').notNull(), // 'C1', 'B2', etc.
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  duration: integer('duration').notNull(), // estimated minutes
  xpReward: integer('xp_reward').notNull().default(50),
  order: integer('order').notNull(), // lesson sequence in course
  isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  prerequisiteLessonId: text('prerequisite_lesson_id'), // Can be null for first lesson
  content: text('content', { mode: 'json' }).notNull().$type<LessonContent>(), // Full lesson content as JSON
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  courseIdx: index('lesson_course_idx').on(table.courseId),
  difficultyIdx: index('lesson_difficulty_idx').on(table.difficulty),
  orderIdx: index('lesson_order_idx').on(table.order),
}));

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(), // 'C1', 'B2', etc.
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  order: integer('order').notNull(),
  totalLessons: integer('total_lessons').notNull(),
  estimatedDuration: integer('estimated_duration'), // total hours
});

// Lesson content structure (stored as JSON in content column)
interface LessonContent {
  sections: LessonSection[];
}

interface LessonSection {
  id: string;
  type: 'explanation' | 'question' | 'practice' | 'summary';
  content: ExplanationContent | QuestionContent | PracticeContent;
}
```

**Content Organization (JSON source files):**

```
src/data/
├── lessons/           # Source JSON files (edit these)
│   ├── C1L1.json
│   ├── C1L2.json
│   └── ...
├── quiz-questions/    # Source JSON files
│   ├── integration.json
│   ├── scope.json
│   └── ...
└── achievements/      # Source JSON files
    └── definitions.json

# Build process: JSON files → SQLite seed database
```

**Seeding Process (JSON → SQLite):**

```typescript
// scripts/seed-lessons.ts
import * as fs from 'fs';
import * as path from 'path';
import { db } from './create-seed-db';
import * as schema from '../src/db/schema';

export async function seedLessons() {
  console.log('📚 Seeding lessons...');

  const lessonsDir = path.join(__dirname, '../src/data/lessons');
  const lessonFiles = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));

  const lessons = [];

  for (const file of lessonFiles) {
    const filePath = path.join(lessonsDir, file);
    const lessonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Extract metadata and content
    lessons.push({
      id: lessonData.id,
      courseId: lessonData.courseId,
      title: lessonData.title,
      description: lessonData.description,
      difficulty: lessonData.difficulty,
      duration: lessonData.duration,
      xpReward: lessonData.xpReward || 50,
      order: lessonData.order,
      prerequisiteLessonId: lessonData.prerequisite || null,
      content: lessonData.content, // Full content as JSON
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Batch insert
  await db.insert(schema.lessons).values(lessons);

  console.log(`✅ Seeded ${lessons.length} lessons`);
}

export async function seedCourses() {
  console.log('📖 Seeding courses...');

  await db.insert(schema.courses).values([
    {
      id: 'C1',
      title: 'Project Integration Management',
      description: 'Learn to coordinate all project elements',
      icon: '🎯',
      color: '#FF6B6B',
      order: 1,
      totalLessons: 10,
      estimatedDuration: 5,
    },
    {
      id: 'B1',
      title: 'Project Scope Management',
      description: 'Master project scope definition',
      icon: '📐',
      color: '#4ECDC4',
      order: 2,
      totalLessons: 8,
      estimatedDuration: 4,
    },
    // ... more courses
  ]);

  console.log('✅ Courses seeded');
}
```

**Loading Content from Database:**

```typescript
// src/services/content-loader.ts
import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';

export class ContentLoader {
  // Load single lesson with full content
  static async getLesson(lessonId: string) {
    const [lesson] = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    return lesson;
  }

  // Load lessons for a course
  static async getCourseLessons(courseId: string) {
    return db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.courseId, courseId))
      .orderBy(schema.lessons.order);
  }

  // Load next lesson (for "Next Lesson" button)
  static async getNextLesson(currentLessonId: string) {
    const [current] = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, currentLessonId))
      .limit(1);

    if (!current) return null;

    const [next] = await db
      .select()
      .from(schema.lessons)
      .where(and(
        eq(schema.lessons.courseId, current.courseId),
        sql`${schema.lessons.order} > ${current.order}`
      ))
      .orderBy(schema.lessons.order)
      .limit(1);

    return next || null;
  }

  // Check if lesson is unlocked
  static async isLessonUnlocked(lessonId: string, userId: string) {
    const [lesson] = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, lessonId))
      .limit(1);

    if (!lesson) return false;
    if (!lesson.prerequisiteLessonId) return true; // First lesson is always unlocked

    // Check if prerequisite is completed
    const [prerequisiteProgress] = await db
      .select()
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        eq(schema.lessonProgress.lessonId, lesson.prerequisiteLessonId),
        sql`${schema.lessonProgress.completedAt} IS NOT NULL`
      ))
      .limit(1);

    return !!prerequisiteProgress;
  }

  // Search lessons
  static async searchLessons(query: string, limit: number = 10) {
    return db
      .select()
      .from(schema.lessons)
      .where(sql`
        ${schema.lessons.title} LIKE ${'%' + query + '%'}
        OR ${schema.lessons.description} LIKE ${'%' + query + '%'}
      `)
      .limit(limit);
  }

  // Get recommended lessons based on user progress
  static async getRecommendedLessons(userId: string, limit: number = 5) {
    // Get user's completed lessons
    const completed = await db
      .select({ lessonId: schema.lessonProgress.lessonId })
      .from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        sql`${schema.lessonProgress.completedAt} IS NOT NULL`
      ));

    const completedIds = completed.map(c => c.lessonId);

    // Get next available lessons (not completed, prerequisites met)
    return db
      .select()
      .from(schema.lessons)
      .where(sql`
        ${schema.lessons.id} NOT IN (${completedIds.length ? completedIds.join(',') : "''"})
        AND (
          ${schema.lessons.prerequisiteLessonId} IS NULL
          OR ${schema.lessons.prerequisiteLessonId} IN (${completedIds.length ? completedIds.join(',') : "''"})
        )
      `)
      .orderBy(schema.lessons.order)
      .limit(limit);
  }

  // Load quiz questions from database (random selection)
  static async getQuizQuestions(topic: string, count: number, difficulty: string) {
    return db
      .select()
      .from(schema.quizQuestions)
      .where(and(
        eq(schema.quizQuestions.topic, topic),
        eq(schema.quizQuestions.difficulty, difficulty)
      ))
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  // Load achievement definitions
  static async getAchievementDefinitions() {
    return db.select().from(schema.achievementDefinitions);
  }

  // Load all courses
  static async getCourses() {
    return db
      .select()
      .from(schema.courses)
      .orderBy(schema.courses.order);
  }
}
```

**Benefits of This Approach:**

1. **For Developers:**
   - ✅ Edit lessons in JSON (familiar, version controlled)
   - ✅ Run `npm run db:seed` to update database
   - ✅ Test with exact production database
   - ✅ Easy to bulk update content

2. **For Users:**
   - ✅ Instant lesson loading (indexed DB queries)
   - ✅ Offline search and filtering
   - ✅ Smart recommendations
   - ✅ Prerequisite checking built-in

3. **For the App:**
   - ✅ Single data source (no JSON + DB split)
   - ✅ Relational integrity (foreign keys)
   - ✅ Efficient queries (indexed)
   - ✅ Easy to add features (tags, ratings, etc.)
```

**Deliverables:**
- `scripts/seed-static-content.ts` - Complete content seeding script
- `scripts/seed-lessons.ts` - Lesson seeding from JSON files
- `src/data/lessons/*.json` - Source lesson JSON files
- `src/data/achievements/definitions.json` - Achievement definitions
- `src/data/quiz-questions/*.json` - Quiz question bank
- `src/services/content-loader.ts` - ContentLoader service
- Updated seed database with ALL static content
- `courses` table with course metadata
- `lessons` table with full lesson content

**Seed Database Contents:**
- ✅ Schema, indexes, views
- ✅ Courses (~5-10 courses)
- ✅ Lessons (~50-100 lessons with full content)
- ✅ Quiz questions (500+ questions)
- ✅ Achievement definitions (20+ achievements)
- ✅ Pre-optimized with VACUUM and ANALYZE

**Expected Database Size:**
- Empty database: ~50KB (schema only)
- With all content: ~500KB-1MB (compressed)
- Still smaller than equivalent JSON files!

**Acceptance Criteria:**
- ✅ All courses seeded in database
- ✅ All lessons seeded with full content
- ✅ All achievements seeded in database
- ✅ Quiz question bank seeded (500+ questions)
- ✅ Lesson prerequisites working
- ✅ ContentLoader service works correctly
- ✅ Search and filtering work
- ✅ Recommendations engine functional
- ✅ No hardcoded progress data in codebase
- ✅ Seed database size reasonable (<1MB)
- ✅ Content editing workflow smooth (JSON → DB)

---

**Phase 0 Exit Criteria:**
- ✅ SQLite seed database created with Drizzle ORM
- ✅ All database tables, indexes, and views in seed database
- ✅ Static content seeded (achievements, quiz questions)
- ✅ Database bundled as app asset (<500KB)
- ✅ Database copy mechanism working (<500ms first launch)
- ✅ Database versioning system implemented
- ✅ User data preservation working for updates
- ✅ StorageService fully tested with real database
- ✅ Zustand store integrated with SQLite backend
- ✅ Mock data completely removed
- ✅ App loads with real persistent data from bundled database
- ✅ Build process generates seed database automatically

**Estimated Duration:** 3 weeks
**Complexity:** High (Foundation is critical)
**Dependencies:** None (this enables everything else)

---

### Phase 0 Complete Workflow Summary

**Development Workflow:**

```bash
# 1. Design schema
# Edit src/db/schema.ts

# 2. Generate migration
npx drizzle-kit generate:sqlite

# 3. Create seed database with static content
npm run db:seed

# 4. Test database
npm run db:inspect

# 5. Build app with bundled database
npm run build

# 6. On first app launch:
# - Database copied from assets to app directory (~500ms)
# - User creates profile
# - Ready to use!

# 7. For app updates with new content:
# - Increment DB_VERSION
# - Regenerate seed database: npm run db:seed
# - Build new version
# - On update: user data preserved, new content available
```

**Key Benefits Achieved:**

1. **⚡ Performance**
   - First launch: <500ms database setup (just a file copy)
   - No migration execution on first launch
   - All content pre-indexed and optimized

2. **📦 Bundle Size**
   - SQLite database: ~100-500KB (highly compressed)
   - Includes all achievements, quiz questions, views
   - Smaller than equivalent JSON files

3. **🔄 Easy Updates**
   - Content updates: Just replace seed database
   - Schema changes: Migrations after copy
   - User data: Always preserved

4. **✅ Reliability**
   - All users start with identical database
   - No runtime migration failures
   - Tested exact database ships to production

5. **🧪 Testing**
   - Can test production database locally
   - Seed database version controlled
   - Easy to replicate user environments

---

## Phase 1: Core Data & Persistence (Week 4-5)

**Goal:** Implement data persistence for all core features using SQLite

### 1.1 User Profile & Settings Persistence

**Tasks:**
- [ ] Create user context using Zustand store
- [ ] Update `settings-context.ts` to use StorageService
- [ ] Replace hardcoded user data in profile screen
- [ ] Implement profile edit functionality
- [ ] Add profile picture upload (using expo-image-picker)

**Files to Modify:**
- `src/contexts/settings-context.ts`
- `src/app/(tabs)/settings/profile.tsx`
- `src/app/(tabs)/settings/index.tsx`

**Implementation Steps:**

1. **Update SettingsContext**
```typescript
// Remove mock data
- const defaultStats: LearningStats = { ... }; // Hardcoded
+ const [stats, setStats] = useState<LearningStats | null>(null);
+ useEffect(() => {
+   StorageService.calculateStats().then(setStats);
+ }, []);
```

2. **Profile Screen**
```typescript
// Replace mock user
- const user = { name: 'Alex Chen', ... };
+ const { user } = useAppStore();
+ if (!user) return <LoadingScreen />;
```

3. **Add Edit Profile Sheet**
```typescript
// New component: src/components/settings/edit-profile-sheet.tsx
function EditProfileSheet({ user, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    await StorageService.saveUserProfile({ ...user, name, email });
    await useAppStore.getState().refreshUser();
    onSave();
  };
}
```

**Deliverables:**
- Real user profile management
- Edit profile functionality
- Profile picture upload
- Settings persist correctly

**Acceptance Criteria:**
- User can edit name and email
- Changes persist across app restarts
- Profile picture uploads and displays
- Settings save immediately

---

### 1.2 Lesson Progress Persistence

**Tasks:**
- [ ] Update lesson player to save progress on answer
- [ ] Save completed lessons to storage
- [ ] Update lesson list to show real progress
- [ ] Persist score and XP earned
- [ ] Update "Continue Learning" with real data

**Files to Modify:**
- `src/app/(tabs)/courses/lesson/[id]/play.tsx`
- `src/app/(tabs)/home/index.tsx`
- `src/services/lesson-data.ts`

**Implementation Steps:**

1. **Lesson Player - Save on Answer**
```typescript
const handleAnswer = useCallback(async (questionId: string, answer: any, isCorrect: boolean, points: number) => {
  setAnsweredQuestions(prev => ({
    ...prev,
    [questionId]: { answer, isCorrect, points }
  }));

  setScore(prev => prev + points);

  // NEW: Save progress after each answer
  const progress: LessonProgress = {
    lessonId: id,
    progressPercent: calculateProgress(),
    score: score + points,
    timeSpent: Date.now() - sessionStartTime,
    answeredQuestions: { ...answeredQuestions, [questionId]: { answer, isCorrect, points } }
  };

  await StorageService.saveLessonProgress(progress);

  // If lesson complete
  if (isLessonComplete) {
    await StorageService.markLessonComplete(id);
    await useAppStore.getState().checkAndUpdateStreak();
    await useAppStore.getState().refreshStats();
  }
}, [id, score, answeredQuestions]);
```

2. **Home Screen - Real Continue Learning**
```typescript
- const continueLesson = { id: 'B1L5', progress: 65 }; // Mock
+ const { currentLesson, lessonProgress } = useAppStore();
+ const continueLesson = currentLesson
+   ? { id: currentLesson, progress: lessonProgress[currentLesson]?.progressPercent ?? 0 }
+   : null;
```

3. **Calculate Real Progress**
```typescript
function calculateProgress(answeredQuestions: Record<string, any>, totalQuestions: number): number {
  return Math.round((Object.keys(answeredQuestions).length / totalQuestions) * 100);
}
```

**Deliverables:**
- Lesson progress saves after each answer
- Completed lessons persist
- Continue Learning shows real data
- Progress survives app restart

**Acceptance Criteria:**
- User can exit mid-lesson and resume
- Progress percentage accurately reflects completion
- Completed lessons marked correctly
- XP and score saved

---

### 1.3 Stats Calculation Engine

**Tasks:**
- [ ] Implement real-time stats calculation
- [ ] Calculate total lessons completed
- [ ] Calculate total XP earned
- [ ] Calculate current and longest streak
- [ ] Calculate average score
- [ ] Calculate total study time
- [ ] Calculate total quizzes taken

**Implementation:**

```typescript
// src/services/stats-calculator.ts
export class StatsCalculator {
  static async calculateStats(): Promise<LearningStats> {
    const completedLessons = await StorageService.getAllCompletedLessons();
    const quizResults = await StorageService.getQuizResults();
    const streakData = await StorageService.getStreakData();
    const allProgress = await StorageService.getAllLessonProgress();

    // Calculate XP
    const totalXpEarned = allProgress.reduce((sum, p) => sum + p.score, 0);

    // Calculate average score
    const averageScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
      : 0;

    // Calculate study time
    const totalStudyTime = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    return {
      totalLessonsCompleted: completedLessons.length,
      totalXpEarned,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      averageScore,
      totalStudyTime: Math.round(totalStudyTime / 60000), // Convert to minutes
      totalQuizzesTaken: quizResults.length,
    };
  }

  static async updateStatsAfterLesson(lessonId: string): Promise<void> {
    const stats = await this.calculateStats();
    await useAppStore.getState().setStats(stats);
  }
}
```

**Deliverables:**
- `src/services/stats-calculator.ts`
- Real-time stats everywhere
- Stats update after each lesson/quiz

**Acceptance Criteria:**
- All stats calculated from real data
- Stats update immediately after completion
- Historical stats preserved
- Performance: calculations <100ms

---

### 1.4 Streak System Implementation

**Tasks:**
- [ ] Implement streak calculation logic
- [ ] Check and update streak daily
- [ ] Track streak history
- [ ] Show streak on home screen
- [ ] Add streak freeze/save feature (future)

**Implementation:**

```typescript
// src/services/streak-calculator.ts
export class StreakCalculator {
  static async checkAndUpdateStreak(): Promise<StreakData> {
    const streakData = await StorageService.getStreakData();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastActivity = streakData.lastActivityDate;

    // If already updated today, return current
    if (lastActivity === today) {
      return streakData;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if streak continues
    if (lastActivity === yesterday) {
      // Streak continues
      const newStreak = streakData.currentStreak + 1;
      const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streakData.longestStreak),
        lastActivityDate: today,
        streakHistory: [...streakData.streakHistory, { date: today, completed: true }]
      };
      await StorageService.saveStreakData(updated);
      return updated;
    } else {
      // Streak broken
      const updated: StreakData = {
        currentStreak: 1,
        longestStreak: streakData.longestStreak,
        lastActivityDate: today,
        streakHistory: [...streakData.streakHistory, { date: today, completed: true }]
      };
      await StorageService.saveStreakData(updated);
      return updated;
    }
  }
}
```

**Deliverables:**
- Accurate streak tracking
- Streak history for analytics
- Daily streak updates

**Acceptance Criteria:**
- Streak updates when lesson completed
- Streak breaks if missed a day
- Longest streak preserved
- Streak survives timezone changes

---

**Phase 1 Exit Criteria:**
- ✅ All user data persists correctly
- ✅ Lesson progress saves and resumes
- ✅ Stats calculated from real data
- ✅ Streaks track accurately
- ✅ No mock data in settings or profile

**Estimated Duration:** 2 weeks
**Complexity:** High
**Dependencies:** Phase 0 complete
**Blockers:** None

---

## Phase 2: Navigation & User Flow (Week 6)

**Goal:** Fix all navigation issues and complete user workflows

### 2.1 Home Screen Navigation

**Tasks:**
- [ ] Wire up "Continue Learning" card
- [ ] Wire up "Practice Quiz" button
- [ ] Wire up "Mock Exam" button
- [ ] Connect daily streak to real data
- [ ] Connect daily goal to real data

**Files to Modify:**
- `src/app/(tabs)/home/index.tsx`

**Implementation:**

```typescript
// Continue Learning
<AnimatedPressable
  onPress={() => {
    if (currentLesson) {
      router.push(`/courses/lesson/${currentLesson}/play`);
    } else {
      router.push('/courses');
    }
  }}
>
  {/* Existing card content */}
</AnimatedPressable>

// Quick Actions
<Pressable
  className="flex-1"
  onPress={() => router.push('/practices?filter=quick')}
>
  {/* Practice Quiz card */}
</Pressable>

<Pressable
  className="flex-1"
  onPress={() => router.push('/practices?filter=mock')}
>
  {/* Mock Exam card */}
</Pressable>

// Real streak
- const currentStreak = 5; // Mock
+ const { streak } = useAppStore();
+ const currentStreak = streak.currentStreak;

// Real daily goal
- <AppText>1 of 5</AppText> // Mock
+ <AppText>{completedToday} of {settings.dailyGoal}</AppText>
```

**Deliverables:**
- All home screen buttons navigate correctly
- Real data displayed everywhere
- Smooth transitions

**Acceptance Criteria:**
- Continue Learning opens correct lesson
- Quick actions navigate to practices tab
- All data reflects reality
- No navigation errors

---

### 2.2 Course Navigation Flow

**Tasks:**
- [ ] Verify lesson navigation works
- [ ] Add "Next Lesson" button after completion
- [ ] Update course list to show real progress
- [ ] Add course completion state

**Files to Modify:**
- `src/app/(tabs)/courses/index.tsx`
- `src/app/(tabs)/courses/lesson/[id]/play.tsx`

**Implementation:**

```typescript
// After lesson completion
function LessonCompletionCard({ lessonId, score, onNext, onReview }) {
  const nextLesson = getNextLesson(lessonId);

  return (
    <Card>
      <Card.Body className="p-6 items-center gap-4">
        <StyledFeather name="check-circle" size={64} className="text-success" />
        <AppText className="text-2xl font-bold">Lesson Complete!</AppText>
        <AppText className="text-muted">You earned {score} XP</AppText>

        {nextLesson && (
          <Button
            color="primary"
            onPress={() => router.replace(`/courses/lesson/${nextLesson}/play`)}
          >
            Next Lesson
          </Button>
        )}

        <Button
          variant="bordered"
          onPress={() => router.push('/courses')}
        >
          Back to Courses
        </Button>
      </Card.Body>
    </Card>
  );
}
```

**Deliverables:**
- Smooth lesson-to-lesson navigation
- Course progress accurate
- Completion states working

**Acceptance Criteria:**
- Users can navigate between lessons
- Progress updates in real-time
- No dead ends in navigation

---

**Phase 2 Exit Criteria:**
- ✅ All navigation paths functional
- ✅ No buttons without handlers
- ✅ User can complete full learning flow
- ✅ Real data displayed throughout

**Estimated Duration:** 1 week
**Complexity:** Medium
**Dependencies:** Phase 1 complete
**Blockers:** None

---

## Phase 3: Practice & Quiz System (Week 7-8)

**Goal:** Implement complete practice quiz functionality

### 3.1 Quiz Data Structure

**Tasks:**
- [ ] Design quiz question bank structure
- [ ] Create quiz configuration system
- [ ] Implement quiz builder service
- [ ] Seed initial quiz questions

**Data Structure:**

```typescript
interface QuizConfig {
  id: string;
  type: 'practice' | 'mock';
  title: string;
  description: string;
  questionCount: number;
  duration: number; // minutes
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'multi_select';
  question: string;
  options: QuizOption[];
  correctAnswer: string | string[];
  explanation: string;
  topic: string;
  difficulty: string;
  points: number;
}

// src/services/quiz-builder.ts
class QuizBuilder {
  async buildQuiz(config: QuizConfig): Promise<QuizQuestion[]> {
    // Load questions from JSON files
    // Filter by topics and difficulty
    // Randomize selection
    // Return N questions
  }
}
```

**Deliverables:**
- `src/types/quiz.types.ts`
- `src/services/quiz-builder.ts`
- `src/data/quiz-questions/` - Question bank

**Acceptance Criteria:**
- Quiz builder generates random quizzes
- Questions properly categorized
- Difficulty balancing works

---

### 3.2 Quiz Player Screen

**Tasks:**
- [ ] Create quiz player component
- [ ] Implement question navigation
- [ ] Add timer functionality
- [ ] Add progress indicator
- [ ] Implement answer submission
- [ ] Add review mode

**Implementation:**

```typescript
// src/app/(tabs)/practices/quiz/[id]/play.tsx
export default function QuizPlayerScreen() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Calculate score
    const score = calculateScore(questions, answers);

    // Save result
    const result: QuizResult = {
      id: generateId(),
      quizType: 'practice',
      startedAt: startTime,
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      correctAnswers: countCorrect(questions, answers),
      answers: buildAnswerArray(questions, answers),
      timeSpent: config.duration * 60 - timeRemaining,
    };

    await StorageService.saveQuizResult(result);

    // Navigate to results
    router.push(`/practices/quiz/${id}/results?resultId=${result.id}`);
  };

  return (
    <QuizPlayerLayout
      question={questions[currentIndex]}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      timeRemaining={timeRemaining}
      answer={answers[questions[currentIndex]?.id]}
      onAnswer={handleAnswer}
      onNext={() => setCurrentIndex(i => i + 1)}
      onPrevious={() => setCurrentIndex(i => i - 1)}
      onSubmit={handleSubmit}
    />
  );
}
```

**Deliverables:**
- Full quiz player screen
- Timer and progress tracking
- Answer validation
- Submit functionality

**Acceptance Criteria:**
- Users can answer all questions
- Timer counts down correctly
- Can navigate between questions
- Submit saves results

---

### 3.3 Quiz Results & History

**Tasks:**
- [ ] Create quiz results screen
- [ ] Show detailed breakdown
- [ ] Add review wrong answers
- [ ] Update results history list
- [ ] Add filtering and sorting

**Implementation:**

```typescript
// src/app/(tabs)/practices/quiz/[id]/results.tsx
export default function QuizResultsScreen() {
  const { resultId } = useLocalSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    StorageService.getQuizResultById(resultId as string).then(setResult);
  }, [resultId]);

  if (!result) return <LoadingScreen />;

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Score Card */}
      <Card>
        <Card.Body className="p-6 items-center gap-4">
          <CircularProgress value={percentage} size={120} />
          <AppText className="text-3xl font-bold">{percentage}%</AppText>
          <AppText className="text-lg">
            {result.correctAnswers} / {result.totalQuestions} Correct
          </AppText>
        </Card.Body>
      </Card>

      {/* Question Breakdown */}
      {result.answers.map((answer, index) => (
        <QuestionReviewCard
          key={index}
          question={answer.question}
          userAnswer={answer.userAnswer}
          correctAnswer={answer.correctAnswer}
          isCorrect={answer.isCorrect}
          explanation={answer.explanation}
        />
      ))}

      {/* Actions */}
      <Button onPress={() => router.push('/practices')}>
        Back to Practices
      </Button>
      <Button variant="bordered" onPress={handleRetakeQuiz}>
        Retake Quiz
      </Button>
    </ScrollView>
  );
}
```

**Deliverables:**
- Beautiful results screen
- Detailed answer review
- Retake quiz functionality
- Results history with real data

**Acceptance Criteria:**
- Results display correctly
- Can review all answers
- History shows all past quizzes
- Can filter/sort results

---

### 3.4 Remove "Coming Soon" Placeholders

**Tasks:**
- [ ] Replace all Alert.alert with real navigation
- [ ] Test all practice quiz types
- [ ] Test mock exam flow
- [ ] Verify quiz completion flow

**Files to Modify:**
- `src/app/(tabs)/practices/index.tsx:194-202`

**Implementation:**

```typescript
// BEFORE
onPress={() => {
  Alert.alert(
    item.title,
    `Start ${item.questionCount} questions quiz (${item.duration})?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start Quiz', onPress: () => Alert.alert('Coming Soon', '...') }
    ]
  );
}}

// AFTER
onPress={() => {
  Alert.alert(
    item.title,
    `Start ${item.questionCount} questions quiz (${item.duration})?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start Quiz',
        onPress: () => router.push(`/practices/quiz/${item.id}/play`)
      }
    ]
  );
}}
```

**Deliverables:**
- Zero "Coming Soon" alerts
- All quiz types functional
- End-to-end quiz flow working

**Acceptance Criteria:**
- All practice items launch quizzes
- Mock exams work correctly
- No placeholder screens

---

**Phase 3 Exit Criteria:**
- ✅ Practice quiz system fully functional
- ✅ Quiz results save and display
- ✅ No "Coming Soon" placeholders
- ✅ Quiz history tracks correctly
- ✅ Can complete full quiz workflow

**Estimated Duration:** 2 weeks
**Complexity:** High
**Dependencies:** Phase 1, Phase 2
**Blockers:** Need quiz question content

---

## Phase 4: User Experience Polish (Week 9-10)

**Goal:** Add polish, feedback, and error handling

### 4.1 Haptic Feedback Integration

**Tasks:**
- [ ] Add haptic feedback to all interactions
- [ ] Respect haptics setting
- [ ] Test on real device

**Implementation:**

```typescript
// src/utils/haptics.ts
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/app.store';

export const haptic = {
  light: async () => {
    const { settings } = useAppStore.getState();
    if (settings.haptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  medium: async () => {
    const { settings } = useAppStore.getState();
    if (settings.haptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  success: async () => {
    const { settings } = useAppStore.getState();
    if (settings.haptics) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  error: async () => {
    const { settings } = useAppStore.getState();
    if (settings.haptics) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },

  selection: async () => {
    const { settings } = useAppStore.getState();
    if (settings.haptics) {
      await Haptics.selectionAsync();
    }
  },
};

// Usage throughout app
<Button onPress={() => {
  haptic.light();
  // action
}}>
```

**Add haptics to:**
- Button presses (light)
- Answer selection (selection)
- Correct answer (success)
- Wrong answer (error)
- Lesson complete (success)
- Achievement unlock (medium)
- Tab switches (light)

**Deliverables:**
- Haptics throughout app
- Controlled by settings
- Appropriate feedback types

**Acceptance Criteria:**
- All interactions have haptic feedback
- Setting toggles haptics
- Feels polished on device

---

### 4.2 Loading States

**Tasks:**
- [ ] Add loading spinners
- [ ] Add skeleton screens
- [ ] Add shimmer effects
- [ ] Add optimistic updates

**Implementation:**

```typescript
// src/components/common/loading-screen.tsx
export function LoadingScreen({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.accent} />
      {message && (
        <AppText className="text-muted mt-4">{message}</AppText>
      )}
    </View>
  );
}

// src/components/common/skeleton-card.tsx
export function SkeletonCard() {
  return (
    <Animated.View
      entering={FadeIn}
      className="bg-content1 rounded-2xl p-4 gap-2"
    >
      <View className="h-4 w-3/4 bg-divider rounded" />
      <View className="h-4 w-1/2 bg-divider rounded" />
    </Animated.View>
  );
}

// Usage
function LessonList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View className="gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return <>{/* Real content */}</>;
}
```

**Add loading states to:**
- App initialization
- Lesson loading
- Quiz generation
- Results calculation
- Stats refresh
- Image uploads

**Deliverables:**
- Loading indicators everywhere
- Skeleton screens for lists
- No blank screens while loading

**Acceptance Criteria:**
- User never sees blank screen
- Loading states are smooth
- Performance not impacted

---

### 4.3 Error Handling & Boundaries

**Tasks:**
- [ ] Create error boundary component
- [ ] Add try/catch to async operations
- [ ] Show user-friendly error messages
- [ ] Add retry mechanism
- [ ] Log errors for debugging

**Implementation:**

```typescript
// src/components/common/error-boundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
    // In production: send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

// src/components/common/error-screen.tsx
export function ErrorScreen({ error, onRetry }) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <StyledFeather name="alert-circle" size={64} className="text-danger" />
      <AppText className="text-xl font-bold mt-4">Something went wrong</AppText>
      <AppText className="text-muted text-center mt-2">
        {error?.message || 'An unexpected error occurred'}
      </AppText>
      <Button onPress={onRetry} className="mt-6">
        Try Again
      </Button>
      <Button
        variant="light"
        onPress={() => router.push('/home')}
        className="mt-2"
      >
        Go Home
      </Button>
    </View>
  );
}

// Wrap screens
export default function SomeScreen() {
  return (
    <ErrorBoundary>
      <ScreenContent />
    </ErrorBoundary>
  );
}
```

**Add error handling to:**
- SQLite database operations
- Database locked errors (concurrent access)
- Schema migration failures
- Lesson data loading
- Quiz generation
- File uploads
- External links
- Navigation

**Deliverables:**
- Error boundaries on all screens
- User-friendly error messages
- Retry functionality
- Error logging

**Acceptance Criteria:**
- App never crashes
- Errors show helpful messages
- Users can retry failed operations
- Errors logged for debugging

---

### 4.4 Toast Notifications

**Tasks:**
- [ ] Implement toast system
- [ ] Add success toasts
- [ ] Add error toasts
- [ ] Add info toasts

**Implementation:**

```typescript
// Use HeroUI Toast component
import { Toast } from 'heroui-native';

// Success toast
Toast.success('Lesson completed! +50 XP');

// Error toast
Toast.error('Failed to save progress');

// Info toast
Toast.info('Streak updated: 6 days!');

// Achievement unlock
Toast.success('Achievement unlocked: Week Warrior 🔥', {
  duration: 3000,
  position: 'top'
});
```

**Add toasts for:**
- Lesson completion
- Quiz submission
- Achievement unlocks
- Streak updates
- Settings saved
- Errors
- Network issues

**Deliverables:**
- Toast notifications throughout app
- Consistent styling
- Appropriate duration

**Acceptance Criteria:**
- Toasts appear for important events
- Don't interrupt user flow
- Styled consistently

---

**Phase 4 Exit Criteria:**
- ✅ Haptic feedback implemented
- ✅ Loading states everywhere
- ✅ Error boundaries working
- ✅ Toast notifications functional
- ✅ App feels polished

**Estimated Duration:** 2 weeks
**Complexity:** Medium
**Dependencies:** All previous phases
**Blockers:** None

---

## Phase 5: Advanced Features (Week 11-12)

**Goal:** Implement notifications, achievements, and profile features

### 5.1 Push Notifications

**Tasks:**
- [ ] Install expo-notifications
- [ ] Request notification permissions
- [ ] Schedule daily reminders
- [ ] Handle notification taps
- [ ] Update when settings change
- [ ] Add notification content variations

**Implementation:**

```typescript
// src/services/notification.service.ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  async scheduleDailyReminder(hour: number, minute: number): Promise<void> {
    // Cancel existing
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    // Schedule new
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to learn! 📚",
        body: "Keep your streak alive! Complete today's lesson.",
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  }

  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}
```

**Deliverables:**
- Notification system working
- Daily reminders scheduled
- Notification tap handling
- Permission management

**Acceptance Criteria:**
- Notifications fire at correct time
- Tapping opens app to lesson
- Can disable notifications
- Works after app restart

---

### 5.2 Achievement System

**Tasks:**
- [ ] Define all achievements
- [ ] Implement achievement checker
- [ ] Add unlock notifications
- [ ] Show achievements in profile
- [ ] Add achievement progress tracking

**Implementation:**

```typescript
// src/services/achievement.service.ts
interface AchievementDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
  check: (data: UserData) => boolean;
  progress?: (data: UserData) => { current: number; total: number };
}

const achievements: AchievementDefinition[] = [
  {
    id: 'week_warrior',
    icon: '🔥',
    name: 'Week Warrior',
    description: 'Maintain a 7 day streak',
    check: (data) => data.streak.currentStreak >= 7,
    progress: (data) => ({ current: data.streak.currentStreak, total: 7 }),
  },
  {
    id: 'fast_learner',
    icon: '⭐',
    name: 'Fast Learner',
    description: 'Complete 10 lessons in a week',
    check: (data) => data.stats.lessonsThisWeek >= 10,
    progress: (data) => ({ current: data.stats.lessonsThisWeek, total: 10 }),
  },
  {
    id: 'perfect_score',
    icon: '🎯',
    name: 'Perfect Score',
    description: 'Get 100% on 5 quizzes',
    check: (data) => data.perfectQuizCount >= 5,
    progress: (data) => ({ current: data.perfectQuizCount, total: 5 }),
  },
  // ... more achievements
];

class AchievementService {
  async checkAchievements(): Promise<string[]> {
    const userData = await this.getUserData();
    const currentAchievements = await StorageService.getAchievements();
    const newUnlocks: string[] = [];

    for (const achievement of achievements) {
      const alreadyUnlocked = currentAchievements[achievement.id]?.unlockedAt;

      if (!alreadyUnlocked && achievement.check(userData)) {
        await StorageService.unlockAchievement(achievement.id);
        newUnlocks.push(achievement.id);

        // Show notification
        Toast.success(`Achievement unlocked: ${achievement.name} ${achievement.icon}`, {
          duration: 3000,
        });

        // Haptic
        await haptic.medium();
      }
    }

    return newUnlocks;
  }
}
```

**Deliverables:**
- Achievement system working
- Achievements unlock automatically
- Progress tracking
- Beautiful achievement display

**Acceptance Criteria:**
- Achievements unlock at right time
- Progress shows accurately
- Unlocks feel rewarding
- All achievements testable

---

### 5.3 Profile Edit & Picture Upload

**Tasks:**
- [ ] Add edit profile screen
- [ ] Implement image picker
- [ ] Add image cropping
- [ ] Save profile updates
- [ ] Validate inputs

**Implementation:**

```typescript
// src/components/settings/edit-profile-sheet.tsx
import * as ImagePicker from 'expo-image-picker';

export function EditProfileSheet({ isOpen, onClose }) {
  const { user } = useAppStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const updated: UserProfile = {
      ...user,
      name,
      email,
      avatar,
    };

    await StorageService.saveUserProfile(updated);
    await useAppStore.getState().setUser(updated);

    Toast.success('Profile updated!');
    haptic.success();
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Content>
        <AppText className="text-xl font-bold mb-4">Edit Profile</AppText>

        <Pressable onPress={handlePickImage}>
          <View className="w-24 h-24 rounded-full bg-content1 items-center justify-center">
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full" />
            ) : (
              <StyledFeather name="camera" size={32} className="text-muted" />
            )}
          </View>
        </Pressable>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Button onPress={handleSave} color="primary">
          Save Changes
        </Button>
      </Sheet.Content>
    </Sheet>
  );
}
```

**Deliverables:**
- Profile editing works
- Image upload functional
- Validation in place
- Changes persist

**Acceptance Criteria:**
- Can edit name and email
- Can upload profile picture
- Invalid inputs rejected
- Changes save correctly

---

**Phase 5 Exit Criteria:**
- ✅ Notifications working
- ✅ Achievement system complete
- ✅ Profile editing functional
- ✅ All advanced features done

**Estimated Duration:** 2 weeks
**Complexity:** Medium
**Dependencies:** Phase 1-4
**Blockers:** Need notification copy/content

---

## Phase 6: Testing & Launch Prep (Week 13)

**Goal:** Comprehensive testing, optimization, and launch readiness

### 6.1 Testing

**Tasks:**
- [ ] Manual testing of all flows
- [ ] Test on real devices
- [ ] Test edge cases
- [ ] Test error scenarios
- [ ] Performance testing
- [ ] Memory leak detection

**Test Cases:**

1. **User Onboarding**
   - [ ] First app launch
   - [ ] Initial data seeding
   - [ ] Default settings applied

2. **Lesson Flow**
   - [ ] Start lesson
   - [ ] Answer questions
   - [ ] Exit mid-lesson
   - [ ] Resume lesson
   - [ ] Complete lesson
   - [ ] Progress saves

3. **Quiz Flow**
   - [ ] Start quiz
   - [ ] Answer all questions
   - [ ] Submit quiz
   - [ ] View results
   - [ ] Retake quiz
   - [ ] Results save

4. **Data Persistence**
   - [ ] Close app mid-lesson
   - [ ] Reopen app
   - [ ] Progress restored
   - [ ] Stats accurate

5. **Streak System**
   - [ ] Complete lesson today
   - [ ] Streak increments
   - [ ] Skip a day
   - [ ] Streak resets

6. **Achievements**
   - [ ] Unlock achievement
   - [ ] Notification shows
   - [ ] Progress tracks

7. **Settings**
   - [ ] Change theme
   - [ ] Toggle haptics
   - [ ] Set reminder
   - [ ] Edit profile

8. **Error Scenarios**
   - [ ] SQLite database failure
   - [ ] Invalid data / schema violations
   - [ ] Database locked errors
   - [ ] Network timeout
   - [ ] Memory pressure
   - [ ] Migration failures

**Deliverables:**
- Test plan document
- Bug list and fixes
- Performance report

**Acceptance Criteria:**
- All critical flows tested
- Zero critical bugs
- Performance acceptable

---

### 6.2 Optimization

**Tasks:**
- [ ] Optimize SQLite queries with EXPLAIN QUERY PLAN
- [ ] Add database indexes for frequently queried columns
- [ ] Use transactions for batch operations
- [ ] Reduce re-renders with React optimizations
- [ ] Optimize images
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] Database vacuum for cleanup

**Optimizations:**

```typescript
// 1. Use database aggregations instead of in-memory calculations
// ❌ BAD - Loads all data into memory
const lessons = await db.select().from(schema.lessonProgress);
const total = lessons.reduce((sum, l) => sum + l.score, 0);

// ✅ GOOD - Calculate in database
const [result] = await db
  .select({ total: sum(schema.lessonProgress.score) })
  .from(schema.lessonProgress);

// 2. Use transactions for batch operations
await db.transaction(async (tx) => {
  await tx.insert(schema.lessonProgress).values(progress1);
  await tx.insert(schema.lessonProgress).values(progress2);
  await tx.insert(schema.streakHistory).values(streak);
  // All or nothing - atomic operations
});

// 3. Index frequently queried columns (already in schema)
// See Phase 0.1 for index definitions

// 4. Memoize React components and values
const stats = useMemo(() =>
  calculateStatsDisplay(dbStats),
  [dbStats]
);

const MemoizedLessonCard = memo(LessonCard);

// 5. Virtualize long lists
<FlatList
  data={lessons}
  renderItem={({ item }) => <MemoizedLessonCard lesson={item} />}
  windowSize={5}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// 6. Optimize images
<Image
  source={{ uri: avatar }}
  cachePolicy="memory-disk"
  placeholder={{ blurhash }}
/>

// 7. Regular database maintenance
const optimizeDatabase = async () => {
  // Vacuum to reclaim space
  await db.run(sql`VACUUM`);

  // Analyze to update query planner statistics
  await db.run(sql`ANALYZE`);
};

// 8. Use prepared statements for repeated queries
const getLessonProgressStmt = db
  .select()
  .from(schema.lessonProgress)
  .where(eq(schema.lessonProgress.lessonId, sql.placeholder('lessonId')))
  .prepare();

// Reuse prepared statement
const progress = await getLessonProgressStmt.execute({ lessonId: 'C1L1' });
```

**Deliverables:**
- Optimized database queries
- Efficient React rendering
- Reduced bundle size
- Database maintenance routines

**Acceptance Criteria:**
- App loads in <2s
- Smooth 60fps animations
- Bundle size <10MB
- Database queries <50ms for common operations
- Stats calculation <100ms even with 1000+ records

---

### 6.3 Documentation

**Tasks:**
- [ ] Update CLAUDE.md
- [ ] Document data schema
- [ ] Create migration guides
- [ ] Add inline code comments
- [ ] Create troubleshooting guide

**Deliverables:**
- Updated documentation
- Clear code comments
- Migration guides

**Acceptance Criteria:**
- Docs accurate and complete
- New devs can onboard
- Clear troubleshooting steps

---

### 6.4 Launch Checklist

**Pre-Launch Checklist:**
- [ ] All features implemented
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Error tracking setup
- [ ] Analytics integrated
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] App Store assets ready
- [ ] Screenshots prepared
- [ ] App description written
- [ ] Keywords optimized
- [ ] Beta testing complete
- [ ] Final build created
- [ ] Submitted to App Store

**Deliverables:**
- Production-ready app
- App Store submission
- Launch plan

**Acceptance Criteria:**
- All checklist items complete
- App submitted
- Ready for review

---

**Phase 6 Exit Criteria:**
- ✅ All tests passing
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ App submitted to store

**Estimated Duration:** 1 week
**Complexity:** Medium
**Dependencies:** All phases
**Blockers:** None

---

## Dependency Graph

```
Phase 0 (Foundation)
    ↓
Phase 1 (Data & Persistence)
    ↓
Phase 2 (Navigation) ←──┐
    ↓                   │
Phase 3 (Quiz System) ──┘
    ↓
Phase 4 (UX Polish)
    ↓
Phase 5 (Advanced)
    ↓
Phase 6 (Testing)
    ↓
Launch 🚀
```

**Critical Path:**
Phase 0 → Phase 1 → Phase 3 (longest path, determines minimum timeline)

**Parallelizable Work:**
- Phase 2 can start when Phase 1 is 50% done
- Phase 4 can start when Phase 3 is 75% done
- Phase 5 can run parallel to Phase 4

**Optimized Timeline:**
With parallel work, total time can be reduced from 13 weeks to approximately 11 weeks.

---

## Risk Mitigation

### High Risk Areas

1. **Data Migration**
   - **Risk:** Lose user data during migration from mock to SQLite
   - **Mitigation:**
     - Test migration thoroughly
     - Create backup before migration
     - Implement rollback mechanism
     - Use SQLite transactions for atomic migrations
     - Beta test with small group first

2. **Database Schema Evolution**
   - **Risk:** Breaking schema changes in future updates
   - **Mitigation:**
     - Use Drizzle migrations for all schema changes
     - Version the database schema
     - Test migrations on sample data
     - Implement backward compatibility when possible
     - Document migration path for each version

3. **Performance Degradation**
   - **Risk:** App becomes slow with lots of data
   - **Mitigation:**
     - Proper database indexes already in place
     - Use SQL aggregations instead of in-memory calculations
     - Profile query performance regularly
     - Implement pagination for large lists
     - Use EXPLAIN QUERY PLAN for optimization
     - Monitor database size and vacuum when needed

4. **Notification Delivery**
   - **Risk:** Notifications don't fire reliably
   - **Mitigation:**
     - Test on real devices extensively
     - Handle permission edge cases
     - Provide in-app reminders as fallback
     - Clear documentation for users

### Medium Risk Areas

1. **Achievement System Complexity**
   - **Mitigation:** Start simple, add complexity incrementally

2. **Quiz Question Quality**
   - **Mitigation:** Content review process, beta tester feedback

3. **Cross-Device Sync** (future)
   - **Mitigation:** Design data schema with sync in mind

---

## Testing Strategy

### Unit Testing
- StorageService methods
- Stats calculation functions
- Streak calculation logic
- Achievement checkers

### Integration Testing
- Lesson completion flow
- Quiz submission flow
- Settings persistence
- Navigation flows

### E2E Testing
- Complete user journey
- Onboarding to first lesson completion
- Quiz flow from start to results
- Settings changes and persistence

### Device Testing
- iPhone 12 Mini (small screen)
- iPhone 14 Pro (standard)
- iPhone 15 Pro Max (large screen)
- iOS 16, 17, 18

### Performance Testing
- App launch time
- Lesson load time
- Quiz generation time
- Stats calculation time
- Memory usage
- Battery impact

---

## Rollout Plan

### Phase 1: Internal Testing (Week 13)
- Dev team testing
- All features verified
- SQLite database performance validation
- Bug fixes

### Phase 2: Alpha Testing (Week 14)
- 5-10 internal users
- Real-world usage
- Database migration testing
- Feedback collection

### Phase 3: Beta Testing (Week 15-16)
- 50-100 external users
- TestFlight distribution
- Bug reports and feedback
- Performance monitoring
- Database size and performance tracking

### Phase 4: Soft Launch (Week 17)
- App Store submission
- Limited marketing
- Monitor analytics
- Quick bug fixes
- Database optimization based on real usage

### Phase 5: Full Launch (Week 18+)
- Full marketing campaign
- Social media announcement
- Press release
- User acquisition campaigns

---

## Success Metrics

### Technical Metrics
- App load time: <2s
- Lesson load time: <1s
- Crash-free rate: >99%
- ANR rate: <0.1%
- Battery drain: <5% per hour of use

### User Engagement Metrics
- Daily active users (DAU)
- Lesson completion rate
- Quiz completion rate
- Average session duration
- Retention (D1, D7, D30)
- Streak maintenance rate

### Quality Metrics
- User satisfaction (CSAT): >4.5/5
- App Store rating: >4.5 stars
- Support ticket volume: <5% of users
- Critical bug count: 0

---

## Next Steps

1. **Review this plan** with team
2. **Adjust timeline** based on resources
3. **Assign owners** to each phase
4. **Set up project tracking** (Jira, Linear, etc.)
5. **Schedule kickoff meeting** for Phase 0
6. **Begin Phase 0** implementation

---

**Document Version:** 2.0 (SQLite Edition)
**Last Updated:** 2025-12-25
**Owner:** Development Team
**Status:** Ready for Review

---

## Changelog

### Version 2.0 (2025-12-25)
- **Major Change:** Migrated from AsyncStorage to SQLite with Drizzle ORM
- Updated Phase 0 to include database setup (3 weeks instead of 2)
- Added comprehensive database schema with indexes and foreign keys
- Updated all code examples to use Drizzle ORM
- Enhanced risk mitigation for database schema evolution
- Improved optimization strategies with SQL aggregations and transactions
- Updated timeline: 13 weeks total (11 weeks optimized)
- Added database maintenance and performance monitoring tasks

### Version 1.0 (2025-12-25)
- Initial plan with AsyncStorage approach
