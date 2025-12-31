# F&B Tycoon Production App - Unfinished Features & Implementation Gaps

**Last Updated:** 2025-12-24

## Table of Contents

- [1. Navigation & Interaction Issues](#1-navigation--interaction-issues)
  - [A. Home Screen - Quick Actions Not Wired Up](#a-home-screen---quick-actions-not-wired-up)
  - [B. Continue Learning Card - No Navigation](#b-continue-learning-card---no-navigation)
  - [C. Home Screen - Hardcoded Mock Data](#c-home-screen---hardcoded-mock-data)
- [2. Practice/Quiz Features - Not Implemented](#2-practicequiz-features---not-implemented)
  - [A. Practice Quiz Flow Incomplete](#a-practice-quiz-flow-incomplete)
  - [B. Results Screen - Mock Data Only](#b-results-screen---mock-data-only)
- [3. Database & Data Persistence - Partially Implemented](#3-database--data-persistence---partially-implemented)
  - [A. Mock Progress Data - Not Connected to Real User Data](#a-mock-progress-data---not-connected-to-real-user-data)
  - [B. Settings Context - Hardcoded Learning Stats](#b-settings-context---hardcoded-learning-stats)
- [4. Profile Screen - Mock Data & Missing Edit Functionality](#4-profile-screen---mock-data--missing-edit-functionality)
- [5. UX Enhancements - Missing](#5-ux-enhancements---missing)
  - [A. No Haptic Feedback on Interactions](#a-no-haptic-feedback-on-interactions)
  - [B. Missing Loading States](#b-missing-loading-states)
  - [C. No Error Handling UI](#c-no-error-handling-ui)
- [6. Incomplete Features in Lesson Screens](#6-incomplete-features-in-lesson-screens)
  - [A. User Story Builder Not Fully Integrated](#a-user-story-builder-not-fully-integrated)
- [7. Lesson Player - Score & Answer Tracking](#7-lesson-player---score--answer-tracking)
- [8. Settings Sheets - Partially Implemented](#8-settings-sheets---partially-implemented)
- [9. Lesson Details - Verify Recent Changes](#9-lesson-details---verify-recent-changes)
- [10. Missing APIs & Integrations](#10-missing-apis--integrations)
  - [A. External Links Not Functional](#a-external-links-not-functional)
  - [B. No Backend API Integration](#b-no-backend-api-integration)
- [Summary Table of Unfinished Features](#summary-table-of-unfinished-features)
- [Recommended Implementation Order](#recommended-implementation-order)
  - [Priority 1 (Critical - Blocks App Launch)](#priority-1-critical---blocks-app-launch)
  - [Priority 2 (High - Core Features)](#priority-2-high---core-features)
  - [Priority 3 (Medium - Polish)](#priority-3-medium---polish)
  - [Priority 4 (Low - Nice to Have)](#priority-4-low---nice-to-have)
- [Technical Debt & Code Quality](#technical-debt--code-quality)
  - [A. Unused Variables](#a-unused-variables)
  - [B. TODO Comments](#b-todo-comments)
  - [C. Type Safety](#c-type-safety)

---

Based on a thorough exploration of the codebase, here are the identified unfinished features and areas needing implementation:

---

## 1. NAVIGATION & INTERACTION ISSUES

### A. Home Screen - Quick Actions Not Wired Up
**File:** `src/app/(tabs)/home/index.tsx:156-177`

**Issue:** The "Quick Actions" section has two Pressable cards ("Practice Quiz" and "Mock Exam") that have NO `onPress` handlers or navigation. These cards are purely visual/decorative.

```tsx
<Pressable className="flex-1">  {/* Line 157 - No onPress */}
  <Card className="items-center py-4">
    ...Practice Quiz...
  </Card>
</Pressable>
```

**What's needed:**
- Add `onPress` handlers to navigate to `/practices`
- Import `useRouter` from `expo-router`
- Add navigation logic to trigger quiz/exam screens

**Priority:** HIGH | **Impact:** Users can't access practice from home screen

---

### B. Continue Learning Card - No Navigation
**File:** `src/app/(tabs)/home/index.tsx:66`

**Issue:** The "Continue Learning" card has `<AnimatedPressable>` wrapper with NO `onPress` handler. This should navigate to the current lesson.

**What's needed:**
- Add `onPress={() => router.push(`/courses/lesson/${lessonId}/play`)}`
- Fetch actual current lesson ID from user progress

**Priority:** HIGH | **Impact:** Breaks primary user workflow

---

### C. Home Screen - Hardcoded Mock Data
**File:** `src/app/(tabs)/home/index.tsx:54, 143, 126-139`

**Issues:**
- Daily Streak is hardcoded to `5` (line 54)
- Today's Goal is hardcoded "1 of 5" (line 143)
- Progress bar uses hardcoded percentages

**What's needed:**
- Connect to AsyncStorage or state management for user progress tracking
- Calculate streak from user's lesson completion history with timestamps
- Fetch actual daily goal from settings context

**Priority:** MEDIUM | **Impact:** Dashboard doesn't reflect real progress

---

## 2. PRACTICE/QUIZ FEATURES - NOT IMPLEMENTED

### A. Practice Quiz Flow Incomplete
**File:** `src/app/(tabs)/practices/index.tsx:194-202`

**Critical Issue:** All practice quiz items show "Coming Soon" alert instead of launching actual quizzes:

```tsx
onPress={() => {
  Alert.alert(
    item.title,
    `Start ${item.questionCount} questions quiz (${item.duration})?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start Quiz', onPress: () => Alert.alert('Coming Soon', 'Practice quizzes will be available in the next update!') }
    ]
  );
}}
```

**What's needed:**
- Implement actual quiz flow (replace placeholder alerts)
- Create quiz player component/screen
- Connect to question bank data
- Implement quiz result tracking and storage
- Add quiz completion flow with results screen

**Priority:** CRITICAL | **Impact:** Core feature completely missing

---

### B. Results Screen - Mock Data Only
**File:** `src/app/(tabs)/practices/results.tsx:19-74`

**Issue:** All results are hardcoded mock data with no real data source:

```tsx
const allResults: ResultItem[] = [
  {
    id: '1',
    title: 'Quick Quiz',
    score: 85,  // Hardcoded
    totalQuestions: 10,  // Hardcoded
    correctAnswers: 8,  // Hardcoded
    date: '2024-01-15',  // Hardcoded
  },
  // ... more hardcoded results
];
```

**What's needed:**
- Replace with real quiz result data from AsyncStorage/database
- Implement result persistence after quiz completion
- Add result filtering (by date, topic, score)
- Add sorting options (date, score)
- Calculate statistics from real data

**Priority:** HIGH | **Impact:** No real quiz history available

---

## 3. DATABASE & DATA PERSISTENCE - PARTIALLY IMPLEMENTED

### A. Mock Progress Data - Not Connected to Real User Data
**File:** `src/services/lesson-data.ts:16-27`

**Issue:** Lesson progress uses mock data with no persistence layer:

```tsx
const mockCompletedLessons = new Set([
  'A1L1', 'A1L2', 'A1L3', 'A1L4', 'A1L5', 'A1L6', 'A1L7', 'A1L8',
  'B1L1', 'B1L2', 'B1L3', 'B1L4',
]);

const mockCurrentLesson = 'B1L5';
const mockLessonProgress: Record<string, number> = {
  'B1L5': 65,  // Hardcoded 65% progress
};
```

**Comment at line 16:** "TODO: in production this would come from AsyncStorage or API"

**What's needed:**
- Implement AsyncStorage for persisting:
  - Completed lesson IDs
  - Current lesson ID
  - Lesson progress percentages
  - Lesson completion timestamps
- Add database layer for quiz results (consider SQLite via `expo-sqlite`)
- Implement API integration for cloud sync
- Update lesson progress when users complete screens
- Add migration strategy for existing mock data

**Priority:** CRITICAL | **Impact:** User progress not saved between sessions

---

### B. Settings Context - Hardcoded Learning Stats
**File:** `src/contexts/settings-context.ts:32-48, 122`

**Issue:** Learning stats use hardcoded mock data with no real calculation:

```tsx
const defaultStats: LearningStats = {
  totalLessonsCompleted: 24,  // Mock
  totalXpEarned: 1250,        // Mock
  currentStreak: 5,           // Mock
  longestStreak: 12,          // Mock
  averageScore: 85,           // Mock
  totalStudyTime: 1440,       // Mock (minutes)
  totalQuizzesTaken: 48,      // Mock
};
```

**What's needed:**
- Calculate actual stats from lesson completion data
- Persist stats across sessions in AsyncStorage
- Update stats in real-time as user completes lessons/quizzes
- Calculate streak based on daily completion timestamps
- Track actual study time per session
- Store quiz scores and calculate averages

**Priority:** HIGH | **Impact:** Stats don't reflect reality, misleading users

---

## 4. PROFILE SCREEN - MOCK DATA & MISSING EDIT FUNCTIONALITY

**File:** `src/app/(tabs)/settings/profile.tsx:78-91`

### Issues:

1. **All User Data is Hardcoded** (line 78-91):
```tsx
const user = {
  name: 'Alex Chen',  // Hardcoded
  email: 'alex.chen@savoryco.com',  // Hardcoded
  level: 5,  // Hardcoded
  xp: 1250,  // Hardcoded
  memberSince: 'January 2024',  // Hardcoded
  completedLessons: 24,  // Hardcoded
  studyStreak: 5,  // Hardcoded
};
```

**Comment at line 78:** "TODO: in production this would come from a user context/store"

2. **No Edit Capability** - Profile information cannot be edited by users

3. **Achievement Badges are Hardcoded** (line 138-145):
```tsx
const achievements = [
  { id: '1', icon: '🔥', name: 'Week Warrior', description: '7 day streak' },
  { id: '2', icon: '⭐', name: 'Fast Learner', description: '10 lessons in a week' },
  { id: '3', icon: '🎯', name: 'Perfect Score', description: 'Aced 5 quizzes' },
];
```

### What's needed:
- Create user context/store for profile data
- Implement edit profile functionality:
  - Edit name
  - Edit email
  - Upload profile picture
- Calculate achievements based on real progress metrics
- Persist user data to AsyncStorage
- Add form validation for profile edits
- Add profile picture upload with image picker

**Priority:** HIGH | **Impact:** Can't support multiple users or personalization

---

## 5. UX ENHANCEMENTS - MISSING

### A. No Haptic Feedback on Interactions
**File:** `src/app/(tabs)/settings/index.tsx:85, 217`

**Issue:** Haptic feedback setting exists but is NOT implemented anywhere:

```tsx
const [haptics, setHaptics] = useState(true);
// Setting is toggled and saved, but haptics never triggered in app
```

**Note:** `expo-haptics` is imported in some component-presentation files but not used in main app screens.

**What's needed:**
Add `expo-haptics` feedback to:
- Button presses (light impact)
- Answer selections in challenge screens (selection feedback)
- Correct answers (success notification)
- Wrong answers (error notification)
- Quiz completion (success notification)
- Achievement unlocks (heavy impact)
- Card interactions (light impact)
- Daily streak updates (success notification)

**Implementation:**
- Import `* as Haptics from 'expo-haptics'`
- Check `settings.haptics` before triggering
- Use appropriate impact styles (light, medium, heavy)

**Priority:** LOW | **Impact:** Missing polish, but not blocking

---

### B. Missing Loading States
**Files:** Quiz/lesson navigation screens, practices screens

**Issue:** No loading indicators while:
- Fetching lesson data
- Loading quiz questions
- Saving progress
- Loading results

**What's needed:**
- Add loading spinners during async operations
- Add skeleton loaders for lesson lists
- Show loading states during quiz transitions
- Add shimmer effect for content loading
- Prevent interaction during loading

**Priority:** MEDIUM | **Impact:** Poor UX on slow networks/devices

---

### C. No Error Handling UI
**Files:** Multiple screens across the app

**Issues:**
- No error screens if lesson data fails to load
- No retry mechanism for failed operations
- No user feedback for AsyncStorage failures
- No fallback UI for missing data

**What's needed:**
- Error boundary components for each major screen
- User-friendly error messages with icons
- Retry buttons for failed operations
- Offline mode indicators
- Graceful degradation when data unavailable
- Toast notifications for non-critical errors

**Priority:** MEDIUM | **Impact:** Bad user experience on failures

---

## 6. INCOMPLETE FEATURES IN LESSON SCREENS

### A. User Story Builder Not Fully Integrated
**File:** `USER_STORY_BUILDER_IMPLEMENTATION.md`

**Issue:** Complete implementation guide exists for the User Story Builder question type, but the feature may not be fully integrated into challenge-screen or transfer-screen.

**Implementation requirements from the doc:**
1. Add `UserStoryBuilderQuestion` component import
2. Add state management for story parts (who/what/why)
3. Add handler functions for part selection
4. Add to render logic in challenge screen
5. Add to transfer screen

**Current Status:** Challenge screen has stub at line 2135, but handlers may not be complete.

**What's needed:**
- Verify full integration in challenge-screen.tsx
- Test all three parts (who/what/why) selection
- Add validation for complete user story
- Add visual feedback for correct combinations
- Ensure persistence of answers

**Priority:** MEDIUM | **Impact:** Missing one question type

---

## 7. LESSON PLAYER - SCORE & ANSWER TRACKING

**File:** `src/app/(tabs)/courses/lesson/[id]/play.tsx:43-47`

**Issue:** Score and answered questions are tracked in component state but NOT:
- Persisted to database
- Used to update lesson progress in lesson-data.ts
- Saved for later review
- Used to award XP points
- Used to trigger achievements

```tsx
const [score, setScore] = useState(0);
const [answeredQuestions, setAnsweredQuestions] = useState<...>({});
// Data only exists during lesson session, lost on exit
```

**What's needed:**
- Save lesson completion state to AsyncStorage when lesson ends
- Update user progress (mark lesson as complete at 100%)
- Award XP points based on score
- Trigger achievement checks
- Store detailed quiz results with:
  - Timestamp
  - Score breakdown
  - Time spent
  - Question-by-question results
- Sync completion status back to lesson-data service
- Update "Continue Learning" card on home screen

**Priority:** HIGH | **Impact:** Progress lost on exit, no persistence

---

## 8. SETTINGS SHEETS - PARTIALLY IMPLEMENTED

**Files:**
- `src/components/settings/daily-goal-sheet.tsx`
- `src/components/settings/reminder-time-sheet.tsx`

**Status:** ✅ These bottom sheets are properly implemented with AsyncStorage persistence

**Missing:**
- **Reminder scheduling/notifications** - Settings exist but no actual notification system
  - Need `expo-notifications` integration
  - Schedule notifications at selected times
  - Handle notification permissions
  - Update notifications when reminder time changes
  - Cancel notifications when reminders disabled

**What's needed:**
- Implement notification scheduling using `expo-notifications`
- Request notification permissions
- Schedule daily reminders at user-selected time
- Add notification content (motivational messages, streak reminders)
- Handle notification tap (open app to continue learning)
- Verify notifications fire correctly

**Priority:** MEDIUM | **Impact:** Setting exists but doesn't function

---

## 9. LESSON DETAILS - VERIFY RECENT CHANGES

**File:** `src/data/lesson-details/C1L1.json`

**Status:** File shows as modified in git status but changes are unclear

**Action needed:**
- Review recent modifications to C1L1.json
- Verify all question types are properly formatted
- Check for incomplete questions
- Ensure no placeholder content remains
- Test lesson playback with updated content

**Priority:** LOW | **Impact:** Unknown until reviewed

---

## 10. MISSING APIS & INTEGRATIONS

### A. External Links Not Functional
**File:** `src/app/(tabs)/settings/index.tsx:118-131`

```tsx
const handleOpenHelpCenter = useCallback(async () => {
  const url = 'https://fnbtycoon.com/help';  // May not exist
  await Linking.openURL(url);
});

const handleContactUs = useCallback(async () => {
  const url = 'https://fnbtycoon.com/contact';  // May not exist
  await Linking.openURL(url);
});
```

**Issues:**
- External URLs may not be live
- No error handling if links fail
- No fallback content

**What's needed:**
- Verify external URLs are correct and live
- Add error handling with try/catch
- Implement fallback in-app help screens if links fail
- Add in-app FAQ/help content
- Add email contact form as fallback

**Priority:** LOW | **Impact:** Help features may not work

---

### B. No Backend API Integration
**Current Status:** Entire app runs on local mock data

**Missing:**
- User authentication system
- Cloud sync for progress
- Multi-device support
- Backup/restore functionality
- Analytics tracking
- Content updates without app update

**Priority:** LOW (for MVP) | **Impact:** No cloud features

---

## SUMMARY TABLE OF UNFINISHED FEATURES

| Priority | Area | Location | Issue | Impact |
|----------|------|----------|-------|--------|
| CRITICAL | Practices | practices/index.tsx:194 | All quizzes show "Coming Soon" | Core feature missing |
| CRITICAL | Data Persistence | lesson-data.ts:16-27 | Mock progress, no AsyncStorage | Progress not saved |
| HIGH | Navigation | home/index.tsx:156-177 | Quick Actions no onPress | Users can't access features |
| HIGH | Navigation | home/index.tsx:66 | Continue Learning no handler | Breaks user workflow |
| HIGH | Results | practices/results.tsx:19-74 | Hardcoded mock data | No real quiz history |
| HIGH | Profile | settings/profile.tsx:78-91 | Hardcoded user data | Can't support users |
| HIGH | Stats | settings-context.ts:32-48 | Mock learning stats | Stats don't reflect reality |
| HIGH | Lesson Completion | play.tsx:43-47 | Score not persisted | Progress lost on exit |
| MEDIUM | User Story Builder | challenge-screen.tsx:2135 | May not be fully integrated | Missing question type |
| MEDIUM | Loading States | Multiple screens | No loading indicators | Poor UX on slow networks |
| MEDIUM | Error Handling | Multiple screens | No error UI/retry | Bad failure experience |
| MEDIUM | Notifications | settings/index.tsx | Reminders don't trigger | Setting doesn't work |
| LOW | Haptics | settings/index.tsx:85 | Setting exists, not used | Missing polish |
| LOW | External Links | settings/index.tsx:118-131 | May not work | Help features broken |

---

## RECOMMENDED IMPLEMENTATION ORDER

### Priority 1 (Critical - Blocks App Launch)
1. **Data Persistence Layer**
   - Implement AsyncStorage for lesson progress
   - Save completed lessons, current lesson, progress percentages
   - Persist quiz results and scores

2. **Home Screen Navigation**
   - Wire up "Continue Learning" card navigation
   - Wire up "Quick Actions" (Practice Quiz, Mock Exam)
   - Connect to real progress data

3. **Practice Quiz Implementation**
   - Remove "Coming Soon" alerts
   - Implement actual quiz flow
   - Create quiz player screen
   - Save and display real results

4. **User Data Management**
   - Create user context/store
   - Connect profile to real data
   - Calculate real learning stats

### Priority 2 (High - Core Features)
1. **Lesson Completion Flow**
   - Persist lesson results when complete
   - Update progress in real-time
   - Award XP and update stats
   - Mark lessons as complete

2. **Real Results & Stats**
   - Calculate stats from saved data
   - Display real quiz history
   - Show actual streaks and progress

3. **Achievement System**
   - Calculate achievements from real metrics
   - Trigger achievement unlocks
   - Persist achievement status

### Priority 3 (Medium - Polish)
1. **UX Enhancements**
   - Add haptic feedback throughout app
   - Add loading states for async operations
   - Implement error boundaries and retry logic

2. **Notifications**
   - Implement reminder scheduling
   - Request permissions
   - Test notification delivery

3. **User Story Builder**
   - Complete integration if needed
   - Test all question variations

### Priority 4 (Low - Nice to Have)
1. **Profile Features**
   - Add edit profile functionality
   - Add profile picture upload

2. **Help & Support**
   - Verify external links
   - Add in-app help content
   - Create FAQ section

3. **Backend Integration** (Future)
   - Cloud sync
   - Multi-device support
   - Analytics

---

## TECHNICAL DEBT & CODE QUALITY

### A. Unused Variables
- `isDark` removed from tab layout (recently cleaned up ✅)
- Check for other unused imports across codebase

### B. TODO Comments
Search codebase for:
- `TODO:` comments
- `FIXME:` comments
- `HACK:` comments
- `@ts-ignore` overrides

### C. Type Safety
- Ensure all components have proper TypeScript types
- Remove any `any` types
- Add interfaces for all data structures

---

**End of Report**

*This document should be updated as features are implemented and new issues are discovered.*
