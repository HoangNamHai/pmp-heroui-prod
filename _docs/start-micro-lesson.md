# Start Micro-Lesson Feature

## Overview

When the user taps on a lesson card (from the courses bottom sheet), the app navigates to the lesson screen where they can learn PMP concepts through an interactive, scenario-based micro-lesson.

## Navigation

- **Entry Point:** Tap on a lesson item in the learning path bottom sheet
- **Route:** `/(tabs)/courses/lesson/[id]` (dynamic route with lesson ID)
- **Back Navigation:** Header back button returns to courses screen

## Lesson Screen Structure

### Header Section
- Back button (chevron-left icon)
- Lesson title
- Progress indicator (e.g., "3 of 8" for current position in path)

### Hero Section
- F&B scenario illustration/icon
- Scenario title (restaurant context)
- Estimated duration badge (e.g., "8 min")
- XP reward badge (e.g., "+50 XP")

### Learning Objectives
- Card with checklist of 2-4 objectives
- Each objective is a bullet point
- Helps learner understand what they'll gain

### Lesson Content
Scrollable content area with:

1. **Scenario Introduction**
   - Engaging F&B restaurant story
   - Introduces the PMP concept in context
   - Uses character (Alex Chen at Savory & Co.)

2. **Core Content Sections**
   - Key concepts explained with restaurant examples
   - Visual aids (diagrams, charts if needed)
   - Bite-sized paragraphs (micro-learning approach)
   - Highlighted key terms

3. **Interactive Elements** (future)
   - Knowledge check questions
   - Scenario decision points
   - Drag-and-drop exercises

### Footer Section
- "Complete Lesson" button (primary action)
- Progress bar showing scroll position

## Lesson Data Model

```typescript
interface Lesson {
  id: string;           // e.g., "A1L1"
  title: string;        // e.g., "What is Project Management?"
  courseId: string;     // e.g., "A1"
  pathId: string;       // e.g., "A" (Foundation)
  order: number;        // Position in course
  duration: number;     // Minutes (typically 5-10)
  xpReward: number;     // XP earned on completion
  description: string;  // Brief summary
  objectives: string[]; // Learning objectives
  scenario: string;     // F&B context story
}
```

## Completion Flow

1. User reads through lesson content
2. Scrolls to bottom (or completes all sections)
3. Taps "Complete Lesson" button
4. App shows completion celebration (confetti/animation)
5. XP is awarded and progress is saved
6. User returns to courses screen (auto or manual)
7. Lesson card shows completed state (checkmark)

## UI Components

- `ScreenScrollView` - Main scrollable container
- `Card` - For objectives and content sections
- `Button` - Complete lesson action
- `AppText` - Typography
- `Chip` - Duration and XP badges
- Progress bar component

## Design Considerations

- **Warm color palette** - Use F&B Tycoon theme colors
- **Readable typography** - Comfortable line height for reading
- **Visual breaks** - Space between content sections
- **Sticky footer** - Complete button always accessible
- **Offline support** - Lesson content should be available offline
