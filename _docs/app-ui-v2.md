# F&B Tycoon Mobile App - Complete Screen & Component Inventory

**Version:** 2.0
**Last Updated:** 2025-12-27
**Status:** Design Ready

---

## Executive Summary

### Overview

| Metric                | Count |
| --------------------- | ----- |
| Total Screens         | 14    |
| Tab Screens           | 4     |
| Sub-Screens           | 6     |
| Lesson Player Screens | 6     |
| Bottom Sheet Modals   | 4     |
| Reusable Components   | 35+   |
| Question Types        | 10    |

### Key Patterns Identified

1. **Card-Based Layout** - All content wrapped in HeroUI Card components
2. **Animated Entrance** - FadeInDown with staggered delays (100ms increments)
3. **Bottom Sheet Navigation** - Used for lesson lists, settings modals
4. **Progress Indicators** - Consistent progress bars with accent color
5. **Emoji Avatars** - Character representation throughout lesson flow
6. **Section Headers** - Uppercase muted text with tracking-wider

### Navigation Architecture

```
Root (_layout.tsx)
└── Bottom Tab Navigator (4 tabs)
    ├── Home Tab (index)
    │   └── Dashboard Screen
    │
    ├── Courses Tab
    │   ├── Learning Paths Screen (index)
    │   ├── Lesson Detail Screen ([id].tsx)
    │   └── Lesson Player Screen (play.tsx)
    │       ├── Hook Screen
    │       ├── Challenge Screen
    │       ├── Reason Screen
    │       ├── Feedback Screen
    │       ├── Transfer Screen
    │       └── Wrap Screen
    │
    ├── Practices Tab
    │   ├── Practice List Screen (index)
    │   └── Results History Screen (results.tsx)
    │
    └── Settings Tab
        ├── Settings Main Screen (index)
        │   ├── DailyGoalSheet (modal)
        │   ├── ReminderTimeSheet (modal)
        │   └── LearningStatsSheet (modal)
        └── Profile Screen (profile.tsx)
```

---

## PART 1: SCREEN INVENTORY

---

### SCR-HOME-001: Home Dashboard Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│            F&B Tycoon               │
│      Project Management Tycoon      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔥  Daily Streak         ┌───┐ │ │
│ │     Keep learning         │ 5 │ │ │
│ │     every day!            │day│ │ │
│ │                           └───┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Continue Learning               │ │
│ │ ┌────┐ C1L1: Project Charter    │ │
│ │ │ 📋 │ Foundation Path          │ │
│ │ └────┘                          │ │
│ │ Progress            35%         │ │
│ │ ████████░░░░░░░░░░░░░░░         │ │
│ │                    Continue →   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Today's Goal                    │ │
│ │ Complete 5 lessons              │ │
│ │                                 │ │
│ │    ✓    ○    ○    ○    ○       │ │
│ │    1    2    3    4    5       │ │
│ │                                 │ │
│ │       1 of 5 completed          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Quick Actions                       │
│ ┌───────────────┐ ┌───────────────┐ │
│ │     ┌───┐     │ │     ┌───┐     │ │
│ │     │ ▶ │     │ │     │ ◎ │     │ │
│ │     └───┘     │ │     └───┘     │ │
│ │ Practice Quiz │ │  Mock Exam    │ │
│ └───────────────┘ └───────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  🏠      📚       ✏️       ⚙️      │
│ Home   Courses  Practice Settings   │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value           |
| ------------- | --------------- |
| Screen ID     | `SCR-HOME-001`  |
| Screen Name   | Home Dashboard  |
| Route/Path    | `/(tabs)/home`  |
| Parent Screen | None (Tab root) |
| Child Screens | None            |
| Tab Location  | Home (1st tab)  |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** View learning progress and quickly access current lesson
- **Secondary Goals:** Check streak, monitor daily goal progress, access quick actions
- **Entry Points:** App launch, tab bar tap
- **Exit Points:** Tab bar navigation, Continue Learning card tap, Quick Action taps
- **User Story:** "As a learner, I want to see my progress at a glance so that I stay motivated to continue learning."

#### 1.3 Screen Layout Zones

| Zone         | Position     | Content Type                            | Scroll Behavior |
| ------------ | ------------ | --------------------------------------- | --------------- |
| Header Zone  | Top          | App branding (F&B Tycoon title)         | Scrolls         |
| Content Zone | Middle       | Cards (Streak, Continue, Goal, Actions) | Scrolls         |
| Tab Bar      | Fixed bottom | Navigation tabs                         | Fixed           |

#### 1.4 Component Inventory

| Component ID | Component Name         | Zone    | Purpose                              | Interactive?             |
| ------------ | ---------------------- | ------- | ------------------------------------ | ------------------------ |
| CMP-HDR-001  | App Header             | Header  | Display app name and tagline         | No                       |
| CMP-CARD-001 | Daily Streak Card      | Content | Show current streak count            | No                       |
| CMP-CARD-002 | Continue Learning Card | Content | Show current lesson with progress    | Yes - Navigate to lesson |
| CMP-CARD-003 | Today's Goal Card      | Content | Show daily goal progress (5 circles) | No                       |
| CMP-CARD-004 | Quick Actions Grid     | Content | Practice Quiz & Mock Exam shortcuts  | Yes - Navigate           |

#### 1.5 Screen States

| State             | Trigger Condition     | Visual Changes                   | User Actions Available |
| ----------------- | --------------------- | -------------------------------- | ---------------------- |
| Default           | Data loaded           | All cards visible with data      | All actions            |
| Loading           | Initial load          | Skeleton cards                   | None                   |
| No Current Lesson | No lesson in progress | Hide Continue Learning card      | Start new lesson       |
| Streak at Risk    | Streak about to break | Warning indicator on streak card | Complete lesson        |

#### 1.6 Data Dependencies

| Data Type           | Source            | Required? | Fallback  |
| ------------------- | ----------------- | --------- | --------- |
| User streak         | Local storage     | No        | 0 days    |
| Current lesson      | getLessonDetail() | No        | Hide card |
| Daily goal progress | Local storage     | Yes       | 0/5       |

#### 1.7 Animations & Transitions

| Element       | Animation Type | Trigger | Duration | Delay | Easing   |
| ------------- | -------------- | ------- | -------- | ----- | -------- |
| Streak Card   | FadeInDown     | Mount   | 300ms    | 100ms | ease-out |
| Continue Card | FadeInDown     | Mount   | 300ms    | 200ms | ease-out |
| Goal Card     | FadeInDown     | Mount   | 300ms    | 300ms | ease-out |
| Quick Actions | FadeInDown     | Mount   | 300ms    | 400ms | ease-out |

---

### SCR-COURSES-001: Learning Paths Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│ Learning Paths                      │
│ Master PMP concepts through         │
│ interactive scenarios               │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │    3    │ │   15    │ │   20%   │ │
│ │Completed│ │ Total   │ │Progress │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│                                     │
│ All Paths                           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Foundation Path    ✓  > │ │
│ │ │ 📋 │ Core PM concepts        │ │
│ │ └────┘ ████████████████░░░ 80% │ │
│ │        3 of 4 lessons          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ People Domain       > │ │
│ │ │ 👥 │ Team & stakeholder      │ │
│ │ └────┘ ████░░░░░░░░░░░░░░ 25%  │ │
│ │        1 of 5 lessons          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Process Domain   🔒  > │ │
│ │ │ ⚙️ │ Planning & execution    │ │
│ │ └────┘ ░░░░░░░░░░░░░░░░░░ 0%   │ │
│ │        0 of 6 lessons          │ │
│ └─────────────────────────────────┘ │
│                                     │
│               ↓ scroll              │
├─────────────────────────────────────┤
│  🏠      📚       ✏️       ⚙️      │
│ Home   Courses  Practice Settings   │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│           BOTTOM SHEET              │
├─────────────────────────────────────┤
│         ══════════════              │ ← Handle
│ ┌────┐ Foundation Path              │
│ │ 📋 │ 3 of 4 completed             │
│ └────┘                              │
├─────────────────────────────────────┤
│ ┌───┐                               │
│ │ ✓ │ Project Charter         15min│
│ └───┘ ⏱ 15 min  +50 XP              │
├─────────────────────────────────────┤
│ ┌───┐                               │
│ │ ▶ │ Stakeholder Analysis    35%  │
│ └───┘ ⏱ 20 min  +75 XP              │
├─────────────────────────────────────┤
│ ┌───┐                               │
│ │ 3 │ Risk Management           >  │
│ └───┘ ⏱ 25 min  +100 XP             │
├─────────────────────────────────────┤
│ ┌───┐                               │
│ │🔒│ Advanced Planning          >  │
│ └───┘ ⏱ 30 min  +120 XP             │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                               |
| ------------- | ----------------------------------- |
| Screen ID     | `SCR-COURSES-001`                   |
| Screen Name   | Learning Paths                      |
| Route/Path    | `/(tabs)/courses`                   |
| Parent Screen | None (Tab root)                     |
| Child Screens | Lesson Detail, Lessons Bottom Sheet |
| Tab Location  | Courses (2nd tab)                   |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Browse and select learning paths to study
- **Secondary Goals:** View overall progress, see completed/remaining lessons
- **Entry Points:** Tab bar tap, Continue Learning card
- **Exit Points:** Path card tap (opens bottom sheet), Lesson tap (opens detail)
- **User Story:** "As a learner, I want to browse learning paths so that I can choose what to study next."

#### 1.3 Screen Layout Zones

| Zone         | Position     | Content Type     | Scroll Behavior |
| ------------ | ------------ | ---------------- | --------------- |
| Header Zone  | Top          | Title + subtitle | Scrolls         |
| Stats Row    | Below header | 3 stat cards     | Scrolls         |
| Paths List   | Main content | PathCard list    | Scrolls         |
| Bottom Sheet | Overlay      | Lessons list     | Sheet scrolls   |
| Tab Bar      | Fixed bottom | Navigation tabs  | Fixed           |

#### 1.4 Component Inventory

| Component ID   | Component Name       | Zone    | Purpose                          | Interactive?      |
| -------------- | -------------------- | ------- | -------------------------------- | ----------------- |
| CMP-HDR-002    | Section Header       | Header  | "Learning Paths" title           | No                |
| CMP-STAT-001   | Stats Row            | Stats   | Completed, Total, Progress cards | No                |
| CMP-PATH-001   | PathCard             | Paths   | Display path with progress bar   | Yes - Opens sheet |
| CMP-SHEET-001  | Lessons Bottom Sheet | Overlay | List lessons in selected path    | Yes               |
| CMP-LESSON-001 | LessonItem           | Sheet   | Individual lesson row            | Yes - Navigate    |

#### 1.5 Screen States

| State          | Trigger Condition        | Visual Changes                      | User Actions Available      |
| -------------- | ------------------------ | ----------------------------------- | --------------------------- |
| Default        | Paths loaded             | All paths displayed                 | Browse, select path         |
| Sheet Open     | Path tapped              | Bottom sheet expanded at 85%        | Browse lessons, close sheet |
| Path Locked    | Previous path incomplete | Path card at 50% opacity, lock icon | Cannot tap                  |
| Path Completed | All lessons done         | Green checkmark, success color      | Review lessons              |

#### 1.6 Data Dependencies

| Data Type      | Source              | Required? | Fallback    |
| -------------- | ------------------- | --------- | ----------- |
| Learning paths | getLearningPaths()  | Yes       | Empty state |
| Path progress  | Local calculation   | Yes       | 0%          |
| Lesson list    | getLessonsForPath() | Yes       | Empty sheet |
| Overall stats  | getOverallStats()   | Yes       | 0 values    |

#### 1.7 Animations & Transitions

| Element        | Animation Type | Trigger    | Duration | Delay          | Easing   |
| -------------- | -------------- | ---------- | -------- | -------------- | -------- |
| PathCard       | FadeInDown     | Mount      | 300ms    | index \* 100ms | ease-out |
| Bottom Sheet   | Spring         | Path tap   | 300ms    | 50ms           | spring   |
| Sheet backdrop | Fade           | Sheet open | 200ms    | 0ms            | linear   |

---

### SCR-COURSES-002: Lesson Detail Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│  ←                                  │
├─────────────────────────────────────┤
│                                     │
│            ┌────────┐               │
│            │   📋   │               │
│            └────────┘               │
│                                     │
│        ┌──────────────┐             │
│        │ Foundation   │             │
│        └──────────────┘             │
│                                     │
│        Project Charter              │
│    Learn how to create effective    │
│      project charter documents      │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │⏱ 15 min│ │⭐ +50 XP│ │🏆 75pts│ │
│  └─────────┘ └─────────┘ └────────┘ │
│                                     │
│    Featuring: 👨‍🍳 👔 👩‍💼            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🎯 Learning Objectives          │ │
│ │                                 │ │
│ │ ✓ Understand charter purpose    │ │
│ │ ✓ Identify key components       │ │
│ │ ✓ Create effective charters     │ │
│ │ ✓ Get stakeholder buy-in        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ▶ The Scenario                  │ │
│ │                                 │ │
│ │ "The Grand Opening Crisis"      │ │
│ │                                 │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ 👨‍🍳 ALEX                     │ │ │
│ │ │ "We need to document our    │ │ │
│ │ │  project scope clearly..."  │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ 💡 Learn how proper         │ │ │
│ │ │    documentation prevents   │ │ │
│ │ │    scope creep              │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 Lesson Structure (6 parts)  │ │
│ │                                 │ │
│ │ ⚡ Introduction           2m   │ │
│ │ ─────────────────────────────── │ │
│ │ 🎯 Challenge              5m   │ │
│ │ ─────────────────────────────── │ │
│ │ 📖 Learn                  3m   │ │
│ │ ─────────────────────────────── │ │
│ │ 📊 Results                2m   │ │
│ │ ─────────────────────────────── │ │
│ │ 🔄 Apply                  4m   │ │
│ │ ─────────────────────────────── │ │
│ │ 🏆 Summary                2m   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏆 Mastery Requirement          │ │
│ │ Score 70% or higher to complete │ │
│ │ You can retry if needed.        │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │      ▶  Start Lesson            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                             |
| ------------- | --------------------------------- |
| Screen ID     | `SCR-COURSES-002`                 |
| Screen Name   | Lesson Detail                     |
| Route/Path    | `/(tabs)/courses/lesson/[id]`     |
| Parent Screen | Learning Paths (via bottom sheet) |
| Child Screens | Lesson Player                     |
| Tab Location  | Courses (tab hidden when active)  |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Preview lesson content before starting
- **Secondary Goals:** Understand objectives, see duration/XP, meet characters
- **Entry Points:** Lesson item tap from bottom sheet
- **Exit Points:** Start Lesson button, back navigation
- **User Story:** "As a learner, I want to preview a lesson so that I know what to expect before committing time."

#### 1.3 Screen Layout Zones

| Zone            | Position     | Content Type               | Scroll Behavior |
| --------------- | ------------ | -------------------------- | --------------- |
| Hero Section    | Top          | Icon, badge, title, meta   | Scrolls         |
| Characters      | Below hero   | Character avatars          | Scrolls         |
| Objectives Card | Content      | Learning objectives list   | Scrolls         |
| Scenario Card   | Content      | Hook preview with dialogue | Scrolls         |
| Structure Card  | Content      | Screen type list           | Scrolls         |
| Mastery Info    | Content      | Threshold requirement      | Scrolls         |
| Footer          | Fixed bottom | Start Lesson button        | Fixed           |

#### 1.4 Component Inventory

| Component ID   | Component Name      | Zone       | Purpose                              | Interactive? |
| -------------- | ------------------- | ---------- | ------------------------------------ | ------------ |
| CMP-HERO-001   | Lesson Hero         | Hero       | Icon, title, description, badges     | No           |
| CMP-CHAR-001   | Character Row       | Characters | Avatar emojis of featured characters | No           |
| CMP-OBJ-001    | ObjectiveItem       | Objectives | Checkmark + objective text           | No           |
| CMP-DIALOG-001 | Dialogue Preview    | Scenario   | Character dialogue bubble            | No           |
| CMP-STRUCT-001 | ScreenOverviewItem  | Structure  | Screen type icon + label + duration  | No           |
| CMP-BTN-001    | Start Lesson Button | Footer     | Primary CTA to begin lesson          | Yes          |

#### 1.5 Screen States

| State       | Trigger Condition         | Visual Changes                      | User Actions Available |
| ----------- | ------------------------- | ----------------------------------- | ---------------------- |
| Default     | Lesson data loaded        | Full content displayed              | Start lesson, go back  |
| Not Found   | Invalid lesson ID         | "Lesson not found" message          | Go back                |
| In Progress | Lesson partially complete | Show "Continue" instead of "Start"  | Continue lesson        |
| Completed   | Lesson finished           | Show completion badge, "Review" CTA | Review lesson          |

#### 1.6 Data Dependencies

| Data Type        | Source              | Required? | Fallback           |
| ---------------- | ------------------- | --------- | ------------------ |
| Lesson detail    | getLessonDetail(id) | Yes       | Not found state    |
| Hook screen data | lesson.screens[0]   | No        | Hide scenario card |
| Characters       | lesson.characters   | No        | Hide section       |

#### 1.7 Animations & Transitions

| Element         | Animation Type | Trigger | Duration | Delay           | Easing   |
| --------------- | -------------- | ------- | -------- | --------------- | -------- |
| Hero Section    | FadeInDown     | Mount   | 400ms    | 0ms             | ease-out |
| Characters      | FadeInDown     | Mount   | 300ms    | 150ms           | ease-out |
| Objectives Card | FadeInDown     | Mount   | 300ms    | 200ms           | ease-out |
| ObjectiveItem   | FadeInDown     | Mount   | 300ms    | 300ms + i\*50ms | ease-out |
| Scenario Card   | FadeInDown     | Mount   | 300ms    | 400ms           | ease-out |
| Structure Card  | FadeInDown     | Mount   | 300ms    | 450ms           | ease-out |
| Mastery Info    | FadeInDown     | Mount   | 300ms    | 600ms           | ease-out |

---

### SCR-COURSES-003: Lesson Player Screen

#### Visual Preview - Main Container

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 25  │
│ │ ✕ │  Introduction    [2/6]       │
│ └───┘                               │
│ ████████████░░░░░░░░░░░░░░░░░ 33%  │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         [DYNAMIC CONTENT]           │
│                                     │
│      Hook / Challenge / Reason      │
│      Feedback / Transfer / Wrap     │
│                                     │
│         (see sub-screens)           │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ┌───────────────┐ ┌───────────────┐ │
│ │   ← Back      │ │   Continue →  │ │
│ └───────────────┘ └───────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### Lesson Player Sub-Screens

**Hook Screen (Introduction)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 0   │
│ │ ✕ │  Introduction    [1/6]       │
│ └───┘                               │
│ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░ 16%  │
├─────────────────────────────────────┤
│                                     │
│      "The Grand Opening Crisis"     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✕  Project Alpha                │ │
│ │    Failed due to scope creep    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✕  Cafe Launch                  │ │
│ │    Budget overrun by 200%       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐                          │ │
│ │ │👨‍🍳│ ALEX                      │ │
│ │ └────┘                          │ │
│ │ "We can't let this happen to    │ │
│ │  our restaurant launch..."      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💡 Learn why project charters   │ │
│ │    are essential for success    │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│               ┌───────────────────┐ │
│               │    Continue →     │ │
│               └───────────────────┘ │
└─────────────────────────────────────┘
```

**Challenge Screen (Questions)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 25  │
│ │ ✕ │  Challenge       [2/6]       │
│ └───┘                               │
│ ████████░░░░░░░░░░░░░░░░░░░░░ 33%  │
├─────────────────────────────────────┤
│                                     │
│  Scenario: Kitchen Equipment        │
│                                     │
│  What should Alex prioritize        │
│  in the project charter?            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  A. List all equipment costs  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ●  B. Define project scope      │ │◄─ Selected
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  C. Schedule staff meetings   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  D. Order kitchen supplies    │ │
│ └─────────────────────────────────┘ │
│                                     │
│        Answer all to continue       │
│              (1/3)                  │
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ │
│ │   ← Back      │ │   Continue →  │ │ (disabled)
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

**Reason Screen (Explanation)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 50  │
│ │ ✕ │  Learn           [3/6]       │
│ └───┘                               │
│ ████████████████░░░░░░░░░░░░░ 50%  │
├─────────────────────────────────────┤
│                                     │
│  📖 Understanding Project Charters  │
│                                     │
│  A project charter is a formal      │
│  document that authorizes the       │
│  project and gives the PM           │
│  authority to apply resources.      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Key Components:                 ││
│  │                                 ││
│  │ • Project purpose               ││
│  │ • Measurable objectives         ││
│  │ • High-level requirements       ││
│  │ • Key stakeholders              ││
│  │ • Summary budget                ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 💡 Best Practice                ││
│  │                                 ││
│  │ Always get sponsor sign-off    ││
│  │ before proceeding.              ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ │
│ │   ← Back      │ │   Continue →  │ │
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

**Feedback Screen (Results)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 50  │
│ │ ✕ │  Results         [4/6]       │
│ └───┘                               │
│ ████████████████████░░░░░░░░░ 66%  │
├─────────────────────────────────────┤
│                                     │
│            Your Score               │
│                                     │
│           ┌─────────┐               │
│           │   75%   │               │
│           │  50/75  │               │
│           └─────────┘               │
│                                     │
│  Question Review                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Q1: Charter Components        │ │
│ │   Your answer: B (Correct)      │ │
│ │   +25 points                    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Q2: Stakeholder Role          │ │
│ │   Your answer: A (Correct)      │ │
│ │   +25 points                    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✕ Q3: Budget Estimation         │ │
│ │   Your answer: C (Wrong)        │ │
│ │   Correct: D                    │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ │
│ │   ← Back      │ │   Continue →  │ │
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

**Transfer Screen (Apply)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 50  │
│ │ ✕ │  Apply           [5/6]       │
│ └───┘                               │
│ ████████████████████████░░░░░ 83%  │
├─────────────────────────────────────┤
│                                     │
│  Apply Your Knowledge               │
│                                     │
│  Real-world scenario:               │
│  You're launching a new branch...   │
│                                     │
│  Based on what you learned,         │
│  which step comes FIRST?            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  Hire staff members           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  Order equipment              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ●  Create project charter       │ │◄─ Correct!
│ │     ✓ Correct! +25 pts          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  Design the menu              │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ │
│ │   ← Back      │ │   Continue →  │ │
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

**Wrap Screen (Summary)**

```
┌─────────────────────────────────────┐
│ ┌───┐                        ⭐ 75  │
│ │ ✕ │  Summary         [6/6]       │
│ └───┘                               │
│ ████████████████████████████ 100%  │
├─────────────────────────────────────┤
│                                     │
│           🎉 Lesson Complete!       │
│                                     │
│           ┌─────────────┐           │
│           │   🏆        │           │
│           │   75/100    │           │
│           │   75%       │           │
│           └─────────────┘           │
│                                     │
│           ⭐ +75 XP Earned          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Key Takeaways                   ││
│  │                                 ││
│  │ ✓ Project charters authorize   ││
│  │   the project officially       ││
│  │                                 ││
│  │ ✓ Key components include       ││
│  │   scope, objectives, budget    ││
│  │                                 ││
│  │ ✓ Sponsor approval is crucial  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🔓 Badge Unlocked:              ││
│  │    "Charter Champion"           ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│               ┌───────────────────┐ │
│               │    Complete ✓    │ │
│               └───────────────────┘ │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                              |
| ------------- | ---------------------------------- |
| Screen ID     | `SCR-COURSES-003`                  |
| Screen Name   | Lesson Player                      |
| Route/Path    | `/(tabs)/courses/lesson/[id]/play` |
| Parent Screen | Lesson Detail                      |
| Child Screens | None (contains 6 screen types)     |
| Tab Location  | Courses (tab hidden)               |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Complete interactive lesson with questions
- **Secondary Goals:** Earn points, learn concepts, apply knowledge
- **Entry Points:** Start Lesson button from Lesson Detail
- **Exit Points:** Complete button, Close (X) button
- **User Story:** "As a learner, I want to complete an interactive lesson so that I master the PMP concepts."

#### 1.3 Screen Layout Zones

| Zone         | Position     | Content Type                        | Scroll Behavior |
| ------------ | ------------ | ----------------------------------- | --------------- |
| Header       | Fixed top    | Close, screen type, progress, score | Fixed           |
| Progress Bar | Below header | Lesson progress indicator           | Fixed           |
| Content      | Main         | Dynamic screen content              | Scrolls         |
| Footer       | Fixed bottom | Back/Continue navigation            | Fixed           |

#### 1.4 Component Inventory

| Component ID | Component Name    | Zone    | Purpose                            | Interactive? |
| ------------ | ----------------- | ------- | ---------------------------------- | ------------ |
| CMP-PLY-HDR  | Player Header     | Header  | Close, type label, position, score | Yes - Close  |
| CMP-PROG-001 | Progress Bar      | Header  | Visual lesson progress             | No           |
| CMP-SCR-HOOK | HookScreen        | Content | Introduction screen                | No           |
| CMP-SCR-CHAL | ChallengeScreen   | Content | Question screens                   | Yes - Answer |
| CMP-SCR-REAS | ReasonScreen      | Content | Explanation screens                | No           |
| CMP-SCR-FEED | FeedbackScreen    | Content | Results review                     | No           |
| CMP-SCR-TRAN | TransferScreen    | Content | Application questions              | Yes - Answer |
| CMP-SCR-WRAP | WrapScreen        | Content | Summary and completion             | No           |
| CMP-NAV-001  | Footer Navigation | Footer  | Back and Continue buttons          | Yes          |

#### 1.5 Screen States

| State                | Trigger Condition          | Visual Changes                   | User Actions Available |
| -------------------- | -------------------------- | -------------------------------- | ---------------------- |
| Playing              | Active lesson screen       | Current screen displayed         | Navigate, answer       |
| Questions Incomplete | Not all questions answered | Continue disabled, hint shown    | Answer questions       |
| Questions Complete   | All questions answered     | Continue enabled                 | Proceed                |
| Last Screen          | On wrap screen             | "Complete" instead of "Continue" | Complete lesson        |
| Transitioning        | Screen change              | SlideIn/Out animation            | Wait                   |

#### 1.6 Data Dependencies

| Data Type            | Source         | Required? | Fallback  |
| -------------------- | -------------- | --------- | --------- |
| Lesson screens       | lesson.screens | Yes       | Not found |
| Current screen index | useState       | Yes       | 0         |
| Score                | useState       | Yes       | 0         |
| Answered questions   | useState       | Yes       | {}        |

#### 1.7 Animations & Transitions

| Element        | Animation Type   | Trigger       | Duration | Easing   |
| -------------- | ---------------- | ------------- | -------- | -------- |
| Screen Content | SlideInRight     | Next          | 300ms    | default  |
| Screen Content | SlideOutLeft     | Next          | 300ms    | default  |
| Progress Bar   | Width transition | Screen change | 200ms    | ease-out |

---

### SCR-PRAC-001: Practice List Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│ Practice                            │
│ Test your knowledge with            │
│ quizzes and mock exams              │
├─────────────────────────────────────┤
│                                     │
│ Recent Results            See All > │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │   85%   │ │   72%   │ │   90%   │ │
│ │Quick Qz │ │ People  │ │Quick Qz │ │
│ │  Today  │ │Yesterdy │ │ 2d ago  │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│                                     │
│ Available Practices                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Quick Quiz       [NEW]   │ │
│ │ │ ⚡  │ 10 random questions      │ │
│ │ └────┘ from all domains         │ │
│ │ ─────────────────────────────── │ │
│ │ ❓ 10 questions  ⏱ 5 min  Easy  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ People Domain Quiz       │ │
│ │ │ 👥 │ Focus on team and        │ │
│ │ └────┘ stakeholder management   │ │
│ │ ─────────────────────────────── │ │
│ │ ❓ 20 questions ⏱ 15min Medium  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Process Domain Quiz      │ │
│ │ │ ⚙️ │ Planning, execution,     │ │
│ │ └────┘ and monitoring           │ │
│ │ ─────────────────────────────── │ │
│ │ ❓ 25 questions ⏱ 20min Medium  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Full Mock Exam           │ │
│ │ │ 📝 │ Simulate the real        │ │
│ │ └────┘ PMP exam experience      │ │
│ │ ─────────────────────────────── │ │
│ │ ❓ 180 questions ⏱230min  Hard  │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  🏠      📚       ✏️       ⚙️        │
│ Home   Courses  Practice Settings   │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value               |
| ------------- | ------------------- |
| Screen ID     | `SCR-PRAC-001`      |
| Screen Name   | Practice List       |
| Route/Path    | `/(tabs)/practices` |
| Parent Screen | None (Tab root)     |
| Child Screens | Results History     |
| Tab Location  | Practices (3rd tab) |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Select a practice quiz or mock exam
- **Secondary Goals:** View recent scores, track quiz history
- **Entry Points:** Tab bar tap, Quick Actions from Home
- **Exit Points:** Start quiz (alert), See All results
- **User Story:** "As a learner, I want to practice with quizzes so that I can test my knowledge."

#### 1.3 Screen Layout Zones

| Zone           | Position     | Content Type       | Scroll Behavior |
| -------------- | ------------ | ------------------ | --------------- |
| Header         | Top          | Title + subtitle   | Scrolls         |
| Recent Results | Below header | 3 mini score cards | Scrolls         |
| Practice List  | Main content | PracticeCard list  | Scrolls         |
| Tab Bar        | Fixed bottom | Navigation tabs    | Fixed           |

#### 1.4 Component Inventory

| Component ID    | Component Name     | Zone    | Purpose                  | Interactive?     |
| --------------- | ------------------ | ------- | ------------------------ | ---------------- |
| CMP-HDR-003     | Section Header     | Header  | "Practice" title         | No               |
| CMP-RESULT-MINI | Recent Result Card | Results | Mini score display       | No               |
| CMP-PRAC-001    | PracticeCard       | List    | Quiz option with details | Yes - Start quiz |

#### 1.5 Screen States

| State       | Trigger Condition     | Visual Changes              | User Actions Available |
| ----------- | --------------------- | --------------------------- | ---------------------- |
| Default     | Data loaded           | All practices shown         | Select practice        |
| No Results  | No quiz history       | Hide Recent Results section | Take first quiz        |
| Quiz Locked | Prerequisites not met | Locked card appearance      | Cannot start           |

#### 1.6 Data Dependencies

| Data Type      | Source              | Required? | Fallback     |
| -------------- | ------------------- | --------- | ------------ |
| Practice items | Static array        | Yes       | N/A          |
| Recent results | Static array (demo) | No        | Hide section |

#### 1.7 Animations & Transitions

| Element      | Animation Type | Trigger | Duration | Delay          | Easing   |
| ------------ | -------------- | ------- | -------- | -------------- | -------- |
| PracticeCard | FadeInDown     | Mount   | 300ms    | index \* 100ms | ease-out |

---

### SCR-PRAC-002: Results History Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│  ←  Results                         │
├─────────────────────────────────────┤
│ Track your progress and review      │
│ past quiz results                   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Quick Quiz                 85%  │ │
│ │ Today • 4 min           8/10 ✓ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ People Domain              72%  │ │
│ │ Yesterday • 12 min      14/20 ✓│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Quick Quiz                 90%  │ │
│ │ 2 days ago • 5 min       9/10 ✓│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Process Domain             68%  │ │
│ │ 3 days ago • 18 min     17/25 ✓│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Quick Quiz                 80%  │ │
│ │ 5 days ago • 6 min       8/10 ✓│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ People Domain              95%  │ │
│ │ 1 week ago • 14 min     19/20 ✓│ │
│ └─────────────────────────────────┘ │
│                                     │
│               ↓ scroll              │
├─────────────────────────────────────┤
│  🏠      📚       ✏️       ⚙️      │
│ Home   Courses  Practice Settings   │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                       |
| ------------- | --------------------------- |
| Screen ID     | `SCR-PRAC-002`              |
| Screen Name   | Results History             |
| Route/Path    | `/(tabs)/practices/results` |
| Parent Screen | Practice List               |
| Child Screens | None                        |
| Tab Location  | Practices                   |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Review all past quiz results
- **Secondary Goals:** Track improvement over time, identify weak areas
- **Entry Points:** "See All" link from Practice List
- **Exit Points:** Back navigation
- **User Story:** "As a learner, I want to see my quiz history so that I can track my improvement."

#### 1.3 Component Inventory

| Component ID   | Component Name | Zone   | Purpose                        | Interactive? |
| -------------- | -------------- | ------ | ------------------------------ | ------------ |
| CMP-HDR-004    | Subtitle       | Header | Description text               | No           |
| CMP-RESULT-001 | ResultCard     | List   | Full result display with score | No           |

#### 1.4 Screen States

| State   | Trigger Condition | Visual Changes        | User Actions Available |
| ------- | ----------------- | --------------------- | ---------------------- |
| Default | Results loaded    | All results displayed | Scroll, go back        |
| Empty   | No quiz history   | Empty state message   | Go back                |

---

### SCR-SET-001: Settings Main Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│ Settings                            │
│ Customize your learning experience  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ Alex Chen              > │ │
│ │ │👨‍🍳│ alex.chen@savoryco.com   │ │
│ │ └────┘ Level 5 • 1,250 XP       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ APPEARANCE                          │
│ ┌─────────────────────────────────┐ │
│ │ Theme                           │ │
│ │ ┌─────────┬─────────┬─────────┐ │ │
│ │ │ ☀ Light│ 🌙 Dark │ ⚙ Auto  │ │ │
│ │ └─────────┴─────────┴─────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ NOTIFICATIONS                       │
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Push Notifications      ◉── │ │
│ │    Daily reminders              │ │
│ ├─────────────────────────────────┤ │
│ │ 🔊 Sounds                  ◉── │ │
│ │    Feedback sounds              │ │
│ ├─────────────────────────────────┤ │
│ │ 📳 Haptic Feedback         ◉── │ │
│ │    Vibration on interactions    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ LEARNING                            │
│ ┌─────────────────────────────────┐ │
│ │ 🎯 Daily Goal                 > │ │
│ │    5 lessons per day            │ │
│ ├─────────────────────────────────┤ │
│ │ ⏰ Reminder Time              > │ │
│ │    9:00 AM                      │ │
│ ├─────────────────────────────────┤ │
│ │ 📊 Learning Stats             > │ │
│ └─────────────────────────────────┘ │
│                                     │
│ SUPPORT                             │
│ ┌─────────────────────────────────┐ │
│ │ ❓ Help Center                > │ │
│ ├─────────────────────────────────┤ │
│ │ 💬 Contact Us                 > │ │
│ └─────────────────────────────────┘ │
│                                     │
│         F&B Tycoon v1.0.0          │
│                                     │
├─────────────────────────────────────┤
│  🏠      📚       ✏️       ⚙️      │
│ Home   Courses  Practice Settings   │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Screen ID     | `SCR-SET-001`                                          |
| Screen Name   | Settings                                               |
| Route/Path    | `/(tabs)/settings`                                     |
| Parent Screen | None (Tab root)                                        |
| Child Screens | Profile, Daily Goal Sheet, Reminder Sheet, Stats Sheet |
| Tab Location  | Settings (4th tab)                                     |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** Customize app preferences and settings
- **Secondary Goals:** View profile, adjust notifications, set learning goals
- **Entry Points:** Tab bar tap
- **Exit Points:** Profile tap, bottom sheets, external links
- **User Story:** "As a user, I want to customize my learning experience so that the app fits my preferences."

#### 1.3 Screen Layout Zones

| Zone                  | Position     | Content Type           | Scroll Behavior |
| --------------------- | ------------ | ---------------------- | --------------- |
| Header                | Top          | Title + subtitle       | Scrolls         |
| Profile Card          | Below header | User info card         | Scrolls         |
| Appearance Section    | Content      | Theme selector         | Scrolls         |
| Notifications Section | Content      | Toggle settings        | Scrolls         |
| Learning Section      | Content      | Goal/reminder settings | Scrolls         |
| Support Section       | Content      | Help links             | Scrolls         |
| Version               | Bottom       | App version            | Scrolls         |
| Tab Bar               | Fixed bottom | Navigation tabs        | Fixed           |

#### 1.4 Component Inventory

| Component ID   | Component Name   | Zone          | Purpose                      | Interactive?   |
| -------------- | ---------------- | ------------- | ---------------------------- | -------------- |
| CMP-PROF-CARD  | Profile Card     | Profile       | User avatar, name, level, XP | Yes - Navigate |
| CMP-THEME-001  | ThemeSelectorBar | Appearance    | Light/Dark/Auto selector     | Yes            |
| CMP-SET-ITEM   | SettingItem      | All sections  | Individual setting row       | Yes/No         |
| CMP-SET-SECT   | SettingSection   | All sections  | Section container with title | No             |
| CMP-TOGGLE-001 | FormField Toggle | Notifications | On/off switch                | Yes            |

#### 1.5 Screen States

| State      | Trigger Condition | Visual Changes         | User Actions Available |
| ---------- | ----------------- | ---------------------- | ---------------------- |
| Default    | Settings loaded   | All sections displayed | Modify settings        |
| Sheet Open | Setting tapped    | Bottom sheet expanded  | Modify in sheet        |

#### 1.6 Bottom Sheet Modals

| Modal ID           | Trigger            | Content                      | Actions            |
| ------------------ | ------------------ | ---------------------------- | ------------------ |
| DailyGoalSheet     | Daily Goal tap     | Goal selector (1-10 lessons) | Select, close      |
| ReminderTimeSheet  | Reminder Time tap  | Time picker                  | Select time, close |
| LearningStatsSheet | Learning Stats tap | Statistics display           | View, close        |

---

### SCR-SET-002: Profile Screen

#### Visual Preview

```
┌─────────────────────────────────────┐
│  ←  Profile                         │
├─────────────────────────────────────┤
│                                     │
│            ┌────────┐               │
│            │  👨‍🍳   │               │
│            └────────┘               │
│           Alex Chen                 │
│      alex.chen@savoryco.com         │
│                                     │
│        Level 5 • 1,250 XP           │
│                                     │
│    Progress to Level 6              │
│    ████████████░░░░░░░░ 1250/1500   │
│                                     │
│ STATISTICS                          │
│ ┌───────────────┐ ┌───────────────┐ │
│ │    ┌───┐      │ │    ┌───┐      │ │
│ │    │ ⚡│      │ │    │ 📖│      │ │
│ │    └───┘      │ │    └───┘      │ │
│ │      7        │ │      16       │ │
│ │  Day Streak   │ │   Lessons     │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │    ┌───┐      │ │    ┌───┐      │ │
│ │    │ ✓ │      │ │    │ ⏱ │      │ │
│ │    └───┘      │ │    └───┘      │ │
│ │      12       │ │    8h 30m     │ │
│ │Quizzes Passed │ │  Study Time   │ │
│ └───────────────┘ └───────────────┘ │
│                                     │
│ ACHIEVEMENTS                        │
│ ┌─────────────────────────────────┐ │
│ │ ┌────┐ First Steps          ✓  │ │
│ │ │ 🔥 │ Complete your first      │ │
│ │ └────┘ lesson                   │ │
│ ├─────────────────────────────────┤ │
│ │ ┌────┐ Bookworm             ✓  │ │
│ │ │ 📚 │ Complete 10 lessons      │ │
│ │ └────┘                          │ │
│ ├─────────────────────────────────┤ │
│ │ ┌────┐ Sharpshooter         ✓  │ │
│ │ │ 🎯 │ Get 100% on 5 quizzes    │ │
│ │ └────┘                          │ │
│ ├─────────────────────────────────┤ │
│ │ ┌────┐ Speed Learner        ✓  │ │
│ │ │ ⚡ │ Complete 3 lessons       │ │
│ │ └────┘ in one day               │ │
│ ├─────────────────────────────────┤ │
│ │ ┌────┐ Champion            🔒  │ │
│ │ │ 🏆 │ Complete all Foundation  │ │
│ │ └────┘ lessons (locked)         │ │
│ ├─────────────────────────────────┤ │
│ │ ┌────┐ PMP Ready           🔒  │ │
│ │ │ 🌟 │ Complete all paths       │ │
│ │ └────┘ (locked)                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ACCOUNT                             │
│ ┌─────────────────────────────────┐ │
│ │ Member since      December 2024 │ │
│ ├─────────────────────────────────┤ │
│ │ Account type           Premium  │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### 1.1 Screen Metadata

| Field         | Value                      |
| ------------- | -------------------------- |
| Screen ID     | `SCR-SET-002`              |
| Screen Name   | Profile                    |
| Route/Path    | `/(tabs)/settings/profile` |
| Parent Screen | Settings Main              |
| Child Screens | None                       |
| Tab Location  | Settings                   |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** View detailed profile and achievements
- **Secondary Goals:** Track XP progress, see unlocked achievements
- **Entry Points:** Profile card tap from Settings
- **Exit Points:** Back navigation
- **User Story:** "As a user, I want to see my achievements so that I feel rewarded for my progress."

#### 1.3 Component Inventory

| Component ID | Component Name   | Zone         | Purpose                            | Interactive? |
| ------------ | ---------------- | ------------ | ---------------------------------- | ------------ |
| CMP-PROF-HDR | Profile Header   | Header       | Avatar, name, email, level, XP bar | No           |
| CMP-STAT-002 | StatCard         | Stats        | Individual stat display            | No           |
| CMP-ACH-001  | AchievementBadge | Achievements | Unlocked/locked achievement        | No           |
| CMP-ACCT-001 | Account Info     | Account      | Member since, account type         | No           |

#### 1.4 Data Dependencies

| Data Type    | Source       | Required? | Fallback       |
| ------------ | ------------ | --------- | -------------- |
| User profile | Demo data    | Yes       | Default values |
| Achievements | Static array | Yes       | All locked     |
| XP progress  | Calculated   | Yes       | 0%             |

---

## PART 2: COMPONENT LIBRARY

---

### CMP-CARD-BASE: Base Card Component

#### 2.1 Component Metadata

| Field          | Value           |
| -------------- | --------------- |
| Component ID   | `CMP-CARD-BASE` |
| Component Name | Card            |
| Component Type | Container       |
| Atomic Level   | Organism        |
| Source         | HeroUI Native   |

#### 2.2 Component Variants

| Variant     | Use Case          | Visual Differences              |
| ----------- | ----------------- | ------------------------------- |
| Default     | Content container | White/dark surface, 12px radius |
| Pressable   | Tappable card     | Same + press feedback           |
| Highlighted | Active/selected   | Accent border                   |

#### 2.3 Component States

| State    | Visual Treatment                          | Interaction    |
| -------- | ----------------------------------------- | -------------- |
| Default  | Surface background, subtle shadow (light) | Viewable       |
| Pressed  | Scale 0.98, slightly darker               | Press feedback |
| Disabled | 50% opacity                               | Not tappable   |

#### 2.4 Component Anatomy

```
Card
├── Card.Header (optional)
│   ├── Card.Title
│   └── Card.Description
├── Card.Body
│   └── [Content]
└── Card.Footer (optional)
    └── [Actions/Links]
```

#### 2.5 Component Props

| Prop      | Type      | Default  | Options            |
| --------- | --------- | -------- | ------------------ |
| className | string    | ""       | Tailwind classes   |
| children  | ReactNode | required | Card subcomponents |

#### 2.6 Usage Examples

| Screen   | Context        | Configuration                       |
| -------- | -------------- | ----------------------------------- |
| Home     | Streak Card    | Card > Card.Body with icon + text   |
| Courses  | PathCard       | Card > Card.Body with progress bar  |
| Settings | SettingSection | Card > Card.Body with p-0, divide-y |

---

### CMP-BTN-PRIMARY: Primary Button

#### 2.1 Component Metadata

| Field          | Value             |
| -------------- | ----------------- |
| Component ID   | `CMP-BTN-PRIMARY` |
| Component Name | Primary Button    |
| Component Type | Button            |
| Atomic Level   | Atom              |
| Source         | Custom Pressable  |

#### 2.2 Component Variants

| Variant   | Use Case           | Visual Differences             |
| --------- | ------------------ | ------------------------------ |
| Primary   | Main CTA           | bg-accent, text-white          |
| Secondary | Alternative action | bg-default/50, text-foreground |
| Success   | Positive action    | bg-success, text-white         |
| Warning   | Caution action     | bg-warning, text-dark          |
| Danger    | Destructive action | bg-danger, text-white          |

#### 2.3 Component States

| State    | Visual Treatment          | Interaction    |
| -------- | ------------------------- | -------------- |
| Default  | Full color background     | Tappable       |
| Pressed  | active:opacity-80         | Press feedback |
| Disabled | bg-default/30, text-muted | Not tappable   |

#### 2.4 Component Anatomy

```
Pressable
├── Container (rounded-xl, py-4, flex-row, items-center, justify-center, gap-2)
│   ├── Icon (optional, StyledFeather)
│   └── Label (AppText, font-semibold)
```

#### 2.5 Styling

```tsx
// Primary
className =
  "bg-accent rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-80";

// Secondary
className =
  "bg-default/50 rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-80";

// Disabled
className =
  "bg-default/30 rounded-xl py-4 flex-row items-center justify-center gap-2";
```

---

### CMP-PROGRESS-001: Progress Bar

#### 2.1 Component Metadata

| Field          | Value              |
| -------------- | ------------------ |
| Component ID   | `CMP-PROGRESS-001` |
| Component Name | Progress Bar       |
| Component Type | Indicator          |
| Atomic Level   | Atom               |
| Source         | Custom View        |

#### 2.2 Component Anatomy

```
Container (View)
├── Track (h-2/h-1.5 rounded-full bg-default overflow-hidden)
└── Fill (h-full rounded-full bg-accent, width: percentage)
```

#### 2.3 Variants

| Variant | Height | Color      | Use Case            |
| ------- | ------ | ---------- | ------------------- |
| Default | h-2    | bg-accent  | Lesson progress, XP |
| Small   | h-1.5  | bg-accent  | Path progress       |
| Success | h-2    | bg-success | Completed paths     |

#### 2.4 Usage Examples

```tsx
<View className="h-2 rounded-full bg-default overflow-hidden">
  <View
    className="h-full rounded-full bg-accent"
    style={{ width: `${progress}%` }}
  />
</View>
```

---

### CMP-LESSON-ITEM: Lesson List Item

#### 2.1 Component Metadata

| Field          | Value             |
| -------------- | ----------------- |
| Component ID   | `CMP-LESSON-ITEM` |
| Component Name | LessonItem        |
| Component Type | List Item         |
| Atomic Level   | Molecule          |
| Source         | Custom component  |

#### 2.2 Component States

| State       | Icon          | Text Color      | Opacity | Interactive |
| ----------- | ------------- | --------------- | ------- | ----------- |
| Completed   | check (white) | text-success    | 100%    | Yes         |
| In Progress | play (white)  | text-foreground | 100%    | Yes         |
| Available   | Number        | text-muted      | 100%    | Yes         |
| Locked      | lock          | text-muted      | 50%     | No          |

#### 2.3 Component Anatomy

```
Pressable (flex-row items-center gap-3 py-3)
├── Status Icon (w-8 h-8 rounded-full)
│   └── Icon or Number
├── Content Area (flex-1)
│   ├── Title (font-medium)
│   └── Meta Row (flex-row items-center gap-2)
│       ├── Duration (clock icon + "X min")
│       └── XP Reward ("+X XP")
└── Trailing (progress % or chevron)
```

---

### CMP-PATH-CARD: Learning Path Card

#### 2.1 Component Metadata

| Field          | Value           |
| -------------- | --------------- |
| Component ID   | `CMP-PATH-CARD` |
| Component Name | PathCard        |
| Component Type | Card            |
| Atomic Level   | Molecule        |

#### 2.2 Component Anatomy

```
AnimatedView (FadeInDown)
└── Pressable
    └── Card (mb-3, opacity-50 if locked)
        └── Card.Body (flex-row items-center gap-4 py-4)
            ├── Icon Container (w-14 h-14 rounded-2xl bg-[color])
            │   └── Emoji (text-2xl)
            ├── Content (flex-1 gap-1)
            │   ├── Title Row (flex-row items-center gap-2)
            │   │   ├── Title (text-foreground font-semibold)
            │   │   ├── Check Badge (if completed)
            │   │   └── Lock Icon (if locked)
            │   ├── Subtitle (text-muted text-sm)
            │   └── Progress Section
            │       ├── Progress Bar (h-1.5)
            │       └── Completion Count (text-muted text-xs)
            └── Chevron Right Icon
```

---

### CMP-PRACTICE-CARD: Practice Card

#### 2.1 Component Metadata

| Field          | Value               |
| -------------- | ------------------- |
| Component ID   | `CMP-PRACTICE-CARD` |
| Component Name | PracticeCard        |
| Component Type | Card                |
| Atomic Level   | Molecule            |

#### 2.2 Component Anatomy

```
AnimatedPressable (FadeInDown)
└── Card (mb-3)
    └── Card.Body (gap-3 py-4)
        ├── Header Row (flex-row items-start gap-3)
        │   ├── Icon (w-12 h-12 rounded-xl bg-accent/20)
        │   │   └── Emoji (text-2xl)
        │   └── Content (flex-1)
        │       ├── Title Row (flex-row items-center gap-2)
        │       │   ├── Title (font-semibold)
        │       │   └── NEW Badge (optional)
        │       └── Description (text-muted text-sm)
        └── Meta Row (flex-row justify-between border-t border-divider pt-2)
            ├── Left Stats (flex-row gap-4)
            │   ├── Question Count (help-circle icon)
            │   └── Duration (clock icon)
            └── Difficulty Badge (Easy/Medium/Hard)
```

#### 2.3 Difficulty Colors

| Difficulty | Color Class  |
| ---------- | ------------ |
| Easy       | text-success |
| Medium     | text-warning |
| Hard       | text-danger  |

---

### CMP-RESULT-CARD: Result Card

#### 2.1 Component Anatomy

```
AnimatedView (FadeInDown, delay: index * 80ms)
└── Card (mb-3)
    └── Card.Body (py-4)
        └── Row (flex-row items-center justify-between)
            ├── Left Content (flex-1)
            │   ├── Title (font-semibold)
            │   └── Meta (date + duration)
            └── Right Content (items-end)
                ├── Score (text-2xl font-bold, color by score)
                └── Correct Count (text-muted text-xs)
```

#### 2.2 Score Colors

| Score Range | Color Class  |
| ----------- | ------------ |
| >= 80%      | text-success |
| >= 60%      | text-warning |
| < 60%       | text-danger  |

---

### CMP-SETTING-ITEM: Setting Row Item

#### 2.1 Component Metadata

| Field          | Value              |
| -------------- | ------------------ |
| Component ID   | `CMP-SETTING-ITEM` |
| Component Name | SettingItem        |
| Component Type | List Item          |
| Atomic Level   | Molecule           |

#### 2.2 Component Anatomy

```
Pressable (disabled if no onPress and no rightElement)
└── View (flex-row items-center py-4 px-4 gap-4)
    ├── Icon Container (w-10 h-10 rounded-xl bg-accent/15)
    │   └── StyledFeather Icon (text-accent)
    ├── Content (flex-1)
    │   ├── Title (text-foreground font-medium)
    │   └── Subtitle (text-muted text-sm, optional)
    └── Right Element
        └── FormField Toggle | Chevron Right | Custom
```

---

### CMP-SETTING-SECTION: Setting Section Container

#### 2.1 Component Anatomy

```
AnimatedView (FadeInDown, delay prop)
└── Container (mb-6)
    ├── Section Title (text-muted text-xs uppercase tracking-wider mb-2 px-4)
    └── Card
        └── Card.Body (p-0 divide-y divide-divider)
            └── [SettingItem children]
```

---

### CMP-STAT-CARD: Statistics Card

#### 2.1 Component Anatomy

```
Card (flex-1)
└── Card.Body (items-center py-3 or py-4)
    ├── Icon Container (optional, w-10 h-10 rounded-full bg-accent/15)
    │   └── StyledFeather Icon
    ├── Value (text-xl/2xl font-bold text-foreground/accent/success)
    └── Label (text-muted text-xs)
```

---

### CMP-ACHIEVEMENT-BADGE: Achievement Badge

#### 2.1 Component States

| State    | Background    | Icon Opacity | Check Icon         |
| -------- | ------------- | ------------ | ------------------ |
| Unlocked | bg-accent/10  | 100%         | Yes (text-success) |
| Locked   | bg-default/50 | 30%          | No                 |

#### 2.2 Component Anatomy

```
View (flex-row items-center gap-3 p-3 rounded-xl bg-[state])
├── Icon Container (w-12 h-12 rounded-full bg-[state])
│   └── Emoji (text-2xl, opacity-30 if locked)
├── Content (flex-1)
│   ├── Title (font-medium, text-foreground or text-muted)
│   └── Description (text-muted text-xs)
└── Check Icon (if unlocked)
```

---

### CMP-THEME-SELECTOR: Theme Selector Bar

#### 2.1 Component Anatomy

```
View (flex-row rounded-xl overflow-hidden)
├── Option: Light (flex-1, bg-[selected])
│   ├── Icon (sun)
│   └── Label "Light"
├── Option: Dark (flex-1, bg-[selected])
│   ├── Icon (moon)
│   └── Label "Dark"
└── Option: Auto (flex-1, bg-[selected])
    ├── Icon (settings)
    └── Label "Auto"
```

---

## PART 3: MODAL & OVERLAY INVENTORY

---

### MOD-001: Lessons Bottom Sheet

#### Visual Preview

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← Dimmed backdrop
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│         ══════════════              │ ← Handle (swipe down)
│                                     │
│ ┌────┐ Foundation Path              │
│ │ 📋 │ 3 of 4 completed             │
│ └────┘                              │
├─────────────────────────────────────┤
│                                     │
│ ┌───┐                               │
│ │ ✓ │ Project Charter               │
│ └───┘ ⏱ 15 min  +50 XP       Done  │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ ┌───┐                               │
│ │ ▶ │ Stakeholder Analysis          │
│ └───┘ ⏱ 20 min  +75 XP        35%  │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ ┌───┐                               │
│ │ 3 │ Risk Management               │
│ └───┘ ⏱ 25 min  +100 XP         >  │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ ┌───┐                               │
│ │🔒│ Advanced Planning              │
│ └───┘ ⏱ 30 min  +120 XP     Locked │
│                                     │
│               ↓ scroll              │
└─────────────────────────────────────┘
```

| Field       | Value                    |
| ----------- | ------------------------ |
| Modal ID    | `MOD-001`                |
| Modal Type  | Bottom Sheet             |
| Trigger     | PathCard tap             |
| Snap Points | 85%                      |
| Dismissal   | Swipe down, tap backdrop |
| Backdrop    | 50% opacity dim          |

**Content Structure:**

```
BottomSheet
├── Handle Indicator
├── Header (path icon, title, completion count)
└── BottomSheetScrollView
    └── LessonItem list
```

---

### MOD-002: Daily Goal Sheet

#### Visual Preview

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│         ══════════════              │
│                                     │
│     🎯 Set Your Daily Goal          │
│                                     │
│  How many lessons do you want to    │
│  complete each day?                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ○  1 lesson    - Light          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ○  3 lessons   - Regular        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ●  5 lessons   - Committed      │ │◄─ Selected
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ○  10 lessons  - Intensive      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │           Save Goal             │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

| Field      | Value                    |
| ---------- | ------------------------ |
| Modal ID   | `MOD-002`                |
| Modal Type | Bottom Sheet             |
| Trigger    | Daily Goal setting tap   |
| Dismissal  | Close button, swipe down |
| Backdrop   | Blur/dim                 |

---

### MOD-003: Reminder Time Sheet

#### Visual Preview

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│         ══════════════              │
│                                     │
│     ⏰ Set Reminder Time            │
│                                     │
│  When would you like to be          │
│  reminded to learn?                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │    ┌─────┐   ┌─────┐   ┌─────┐ │ │
│ │    │  8  │   │ :00 │   │ AM  │ │ │
│ │    │──9──│   │──00─│   │──AM─│ │ │
│ │    │ 10  │   │ :30 │   │ PM  │ │ │
│ │    └─────┘   └─────┘   └─────┘ │ │
│ │         Time Picker             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │          Save Time              │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

| Field      | Value                     |
| ---------- | ------------------------- |
| Modal ID   | `MOD-003`                 |
| Modal Type | Bottom Sheet              |
| Trigger    | Reminder Time setting tap |
| Dismissal  | Close button, swipe down  |
| Backdrop   | Blur/dim                  |

---

### MOD-004: Learning Stats Sheet

#### Visual Preview

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│         ══════════════              │
│                                     │
│     📊 Your Learning Stats          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ This Week                       │ │
│ │                                 │ │
│ │ Lessons Completed        8      │ │
│ │ Time Spent           2h 45m     │ │
│ │ XP Earned              450      │ │
│ │ Quizzes Passed           3      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ All Time                        │ │
│ │                                 │ │
│ │ Total Lessons           16      │ │
│ │ Total Time          8h 30m      │ │
│ │ Total XP             1,250      │ │
│ │ Current Streak       7 days     │ │
│ │ Longest Streak      14 days     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │            Close                │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

| Field      | Value                      |
| ---------- | -------------------------- |
| Modal ID   | `MOD-004`                  |
| Modal Type | Bottom Sheet               |
| Trigger    | Learning Stats setting tap |
| Dismissal  | Close button, swipe down   |
| Backdrop   | Blur/dim                   |

---

### MOD-005: Quiz Start Alert

#### Visual Preview

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░┌───────────────────────────┐░░░░│
│░░░░│                           │░░░░│
│░░░░│       Quick Quiz          │░░░░│
│░░░░│                           │░░░░│
│░░░░│ Start 10 questions quiz   │░░░░│
│░░░░│ (5 min)?                  │░░░░│
│░░░░│                           │░░░░│
│░░░░│ ┌─────────┐ ┌───────────┐ │░░░░│
│░░░░│ │ Cancel  │ │Start Quiz │ │░░░░│
│░░░░│ └─────────┘ └───────────┘ │░░░░│
│░░░░│                           │░░░░│
│░░░░└───────────────────────────┘░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────┘
```

| Field      | Value                  |
| ---------- | ---------------------- |
| Modal ID   | `MOD-005`              |
| Modal Type | System Alert           |
| Trigger    | PracticeCard tap       |
| Dismissal  | Cancel or Start button |
| Backdrop   | System dim             |

---

## PART 4: MICRO-INTERACTIONS

---

| Interaction        | Element                   | Trigger      | Feedback                          | Duration         | Purpose                |
| ------------------ | ------------------------- | ------------ | --------------------------------- | ---------------- | ---------------------- |
| Card Press         | All Pressable cards       | Touch down   | Scale 0.98, opacity-80            | Instant          | Confirm tap registered |
| Button Press       | Primary/Secondary buttons | Touch down   | active:opacity-80                 | Instant          | Confirm tap            |
| Toggle Switch      | FormField toggles         | Tap          | Slide animation, haptic           | 200ms            | Confirm state change   |
| Bottom Sheet Open  | Path cards                | Tap          | Sheet slides up, backdrop fades   | 300ms            | Reveal content         |
| Bottom Sheet Close | Swipe down/backdrop       | Gesture      | Sheet slides down, backdrop fades | 200ms            | Dismiss                |
| Screen Transition  | Lesson player             | Next/Back    | SlideInRight/SlideOutLeft         | 300ms            | Show progression       |
| Card Entrance      | All cards                 | Mount        | FadeInDown                        | 300ms            | Smooth appearance      |
| Staggered List     | Card lists                | Mount        | FadeInDown with delay             | 300ms + i\*100ms | Sequential reveal      |
| Progress Update    | Progress bars             | Value change | Width transition                  | 200ms            | Show progress          |
| Correct Answer     | Quiz options              | Selection    | Green highlight, checkmark        | Instant          | Positive feedback      |
| Wrong Answer       | Quiz options              | Selection    | Red highlight, X mark             | Instant          | Learning feedback      |

---

## PART 5: ICON INVENTORY

---

### Navigation Icons

| Icon Name | Library | Size | Usage         | Active Color | Inactive Color |
| --------- | ------- | ---- | ------------- | ------------ | -------------- |
| home      | Feather | 24px | Home tab      | text-accent  | text-muted     |
| book-open | Feather | 24px | Courses tab   | text-accent  | text-muted     |
| edit-3    | Feather | 24px | Practices tab | text-accent  | text-muted     |
| settings  | Feather | 24px | Settings tab  | text-accent  | text-muted     |

### Action Icons

| Icon Name     | Library | Size    | Usage                 | Color                 |
| ------------- | ------- | ------- | --------------------- | --------------------- |
| chevron-right | Feather | 18-20px | Navigation indicator  | text-muted/foreground |
| chevron-left  | Feather | 18px    | Back button           | text-foreground       |
| x             | Feather | 20px    | Close button          | text-foreground       |
| play          | Feather | 14-24px | Start/continue action | text-white/success    |
| arrow-right   | Feather | 16px    | Continue link         | text-accent           |

### Status Icons

| Icon Name    | Library | Size    | Usage                | Color                      |
| ------------ | ------- | ------- | -------------------- | -------------------------- |
| check        | Feather | 12-20px | Completed state      | text-white (on success bg) |
| check-circle | Feather | 20px    | Achievement unlocked | text-success               |
| lock         | Feather | 14-16px | Locked content       | text-muted                 |
| star         | Feather | 14-16px | XP/reward indicator  | text-warning               |
| clock        | Feather | 12-14px | Duration indicator   | text-muted                 |
| zap          | Feather | 18px    | Streak/energy        | text-accent                |
| target       | Feather | 18-24px | Goals/objectives     | text-accent                |
| award        | Feather | 14-18px | Achievements/points  | text-success               |

### Settings Icons

| Icon Name      | Library | Size    | Usage           | Color             |
| -------------- | ------- | ------- | --------------- | ----------------- |
| bell           | Feather | 20px    | Notifications   | text-accent       |
| volume-2       | Feather | 20px    | Sounds          | text-accent       |
| smartphone     | Feather | 20px    | Haptic feedback | text-accent       |
| bar-chart-2    | Feather | 20px    | Statistics      | text-accent       |
| help-circle    | Feather | 14-20px | Help/questions  | text-muted/accent |
| message-circle | Feather | 20px    | Contact         | text-accent       |

### Lesson Screen Icons

| Icon Name   | Library | Size | Usage            | Color       |
| ----------- | ------- | ---- | ---------------- | ----------- |
| zap         | Feather | 18px | Hook screen      | text-accent |
| target      | Feather | 18px | Challenge screen | text-accent |
| book-open   | Feather | 18px | Reason screen    | text-accent |
| bar-chart-2 | Feather | 18px | Feedback screen  | text-accent |
| refresh-cw  | Feather | 18px | Transfer screen  | text-accent |
| award       | Feather | 18px | Wrap screen      | text-accent |
| play-circle | Feather | 18px | Scenario intro   | text-accent |
| list        | Feather | 18px | Lesson structure | text-accent |

---

## PART 6: TYPOGRAPHY INSTANCES

---

| Text Style     | Font   | Weight   | Size                  | Line Height | Tracking | Usage Locations                     |
| -------------- | ------ | -------- | --------------------- | ----------- | -------- | ----------------------------------- |
| App Title      | Nunito | Bold     | 24px (text-2xl)       | 1.2         | Normal   | Home header "F&B Tycoon"            |
| Screen Title   | Nunito | Bold     | 24px (text-2xl)       | 1.2         | Normal   | All screen headers                  |
| Section Title  | Nunito | SemiBold | 18px (text-lg)        | 1.3         | Normal   | "Quick Actions", "All Paths"        |
| Card Title     | Nunito | SemiBold | 18px (text-lg)        | 1.3         | Normal   | Card headers                        |
| Body Primary   | Nunito | Medium   | 16px (text-base)      | 1.4         | Normal   | Lesson titles, setting titles       |
| Body Secondary | Nunito | Regular  | 14px (text-sm)        | 1.4         | Normal   | Descriptions, subtitles             |
| Caption        | Nunito | Regular  | 12px (text-xs)        | 1.3         | Normal   | Meta info, dates, durations         |
| Section Label  | Nunito | Regular  | 12px (text-xs)        | 1           | Wider    | Setting section headers (uppercase) |
| Button         | Nunito | SemiBold | 16px (text-base)      | 1           | Normal   | All button labels                   |
| Badge          | Nunito | Medium   | 12px (text-xs)        | 1           | Normal   | NEW badges, level badges            |
| Metric Large   | Nunito | Bold     | 24-32px               | 1.1         | Normal   | Stats, scores, streak count         |
| Metric Medium  | Nunito | Bold     | 20-24px (text-xl/2xl) | 1.1         | Normal   | Score percentages                   |

---

## PART 7: COLOR USAGE MAP

---

### Light Mode

| Token           | Hex                   | Usage                                  |
| --------------- | --------------------- | -------------------------------------- |
| bg-background   | #f3f6ef               | App background                         |
| bg-surface      | #ffffff               | Cards, modals                          |
| text-foreground | #24332e               | Primary text                           |
| text-muted      | #8a9a92               | Secondary text, icons                  |
| text-accent     | #4e8f76               | Brand color, links, active states      |
| text-success    | #4e8f76               | Completed, correct answers             |
| text-warning    | #f39c6b               | Caution, medium difficulty, XP         |
| text-danger     | #c84c4c               | Errors, hard difficulty, wrong answers |
| bg-accent       | #4e8f76               | Primary buttons                        |
| bg-accent/15    | rgba(78,143,118,0.15) | Icon backgrounds                       |
| bg-accent/20    | rgba(78,143,118,0.20) | Avatar backgrounds                     |
| bg-default      | #eef4f1               | Progress bar tracks, inactive circles  |
| bg-default/50   | rgba(238,244,241,0.5) | Secondary buttons                      |
| border-divider  | #e1e8e4               | Card borders, section dividers         |

### Dark Mode

| Token              | Hex     | Usage                                  |
| ------------------ | ------- | -------------------------------------- |
| dm-bg-background   | #121916 | App background                         |
| dm-bg-surface      | #1f2a26 | Cards, modals                          |
| dm-text-foreground | #e6efea | Primary text                           |
| dm-text-muted      | #8fa39a | Secondary text, icons                  |
| dm-text-accent     | #6fb79a | Brand color, links, active states      |
| dm-text-success    | #6fb79a | Completed, correct answers             |
| dm-text-warning    | #e59a6b | Caution, medium difficulty, XP         |
| dm-text-danger     | #d06a6a | Errors, hard difficulty, wrong answers |

---

## PART 8: USER FLOWS

---

### Flow 1: Complete a Lesson

```
[App Launch]
    ↓
[Home Tab - Dashboard]
    ↓ Tap "Continue Learning" card
[Courses Tab - Learning Paths]
    ↓ (or tap path card)
[Bottom Sheet - Lesson List]
    ↓ Tap lesson item
[Lesson Detail Screen]
    ↓ Tap "Start Lesson" button
[Lesson Player - Hook Screen]
    ↓ Tap "Continue"
[Lesson Player - Challenge Screen]
    ↓ Answer all questions
[Lesson Player - Reason Screen]
    ↓ Tap "Continue"
[Lesson Player - Feedback Screen]
    ↓ Review answers, tap "Continue"
[Lesson Player - Transfer Screen]
    ↓ Answer all questions
[Lesson Player - Wrap Screen]
    ↓ Tap "Complete"
[Return to Courses with updated progress]
```

### Flow 2: Take a Practice Quiz

```
[App Launch]
    ↓
[Practices Tab]
    ↓ Tap practice card (e.g., Quick Quiz)
[Alert: Start Quiz?]
    ↓ Tap "Start Quiz"
[Quiz Player - Coming Soon]
    ↓ Complete quiz
[Results Screen]
    ↓ Review results
[Back to Practices]
```

### Flow 3: Adjust Settings

```
[App Launch]
    ↓
[Settings Tab]
    ↓ Tap "Daily Goal"
[Daily Goal Bottom Sheet]
    ↓ Select goal (e.g., 5 lessons)
[Sheet closes, setting saved]
    ↓ Tap "Reminder Time"
[Reminder Time Bottom Sheet]
    ↓ Select time
[Sheet closes, setting saved]
```

### Flow 4: View Profile & Achievements

```
[Settings Tab]
    ↓ Tap profile card
[Profile Screen]
    ↓ Scroll to view stats
[See achievements grid]
    ↓ Back navigation
[Return to Settings]
```

---

## PART 9: EDGE CASES & ERROR STATES

---

| Scenario           | Screen Affected | Handling                 | User Message                            | Recovery Action          |
| ------------------ | --------------- | ------------------------ | --------------------------------------- | ------------------------ |
| Lesson not found   | Lesson Detail   | Show error state         | "Lesson not found"                      | Back navigation          |
| No current lesson  | Home            | Hide Continue card       | N/A                                     | Show other cards         |
| Path locked        | Courses         | 50% opacity, disable tap | Lock icon visible                       | Complete previous path   |
| Lesson locked      | Bottom Sheet    | 50% opacity, disable tap | Lock icon visible                       | Complete previous lesson |
| Network timeout    | All screens     | Show cached data         | "Showing saved data"                    | Retry on refresh         |
| Quiz abandoned     | Lesson Player   | Confirm dialog           | "Leave lesson? Progress will be saved." | Cancel or leave          |
| Streak at risk     | Home            | Warning indicator        | "Complete a lesson today!"              | Start lesson             |
| No quiz history    | Practices       | Hide Recent Results      | N/A                                     | Take first quiz          |
| No achievements    | Profile         | Show all locked          | Locked state for all                    | Earn achievements        |
| External link fail | Settings        | Error handling           | "Couldn't open link"                    | Show URL to copy         |

### Empty States

| Screen              | Trigger              | Content            | CTA                    |
| ------------------- | -------------------- | ------------------ | ---------------------- |
| Practices - Results | No quiz history      | Empty illustration | "Take your first quiz" |
| Courses             | No paths (unlikely)  | Empty illustration | "Check back soon"      |
| Home - Goal         | No lessons completed | All circles empty  | "Start a lesson"       |

### Loading States

| Screen        | Trigger            | Display                           |
| ------------- | ------------------ | --------------------------------- |
| All screens   | Initial data fetch | Skeleton cards                    |
| Bottom Sheet  | Path tap           | Brief delay, then content         |
| Lesson Player | Screen transition  | Slide animation serves as loading |

---

## PART 10: DESIGN TOKENS QUICK REFERENCE

---

### Colors

```css
/* Light Mode */
--bg-primary: #f3f6ef;
--bg-secondary: #e8f1ec;
--surface-primary: #ffffff;
--surface-secondary: #f7faf8;
--brand-green-500: #4e8f76;
--brand-blue-500: #4a6fa5;
--accent-yellow-400: #f6c453;
--accent-orange-400: #f39c6b;
--status-success: #4e8f76;
--status-warning: #f39c6b;
--status-error: #c84c4c;
--text-primary: #24332e;
--text-secondary: #5f6f68;
--text-muted: #8a9a92;
--border-light: #e1e8e4;

/* Dark Mode */
--dm-bg-primary: #121916;
--dm-surface-primary: #1f2a26;
--dm-brand-green-500: #6fb79a;
--dm-text-primary: #e6efea;
--dm-text-muted: #8fa39a;
```

### Spacing

| Token | Size | Usage                   |
| ----- | ---- | ----------------------- |
| xs    | 4px  | Tight spacing           |
| sm    | 8px  | Default element spacing |
| md    | 16px | Card padding, gaps      |
| lg    | 24px | Section spacing         |
| xl    | 32px | Screen margins          |

### Border Radius

| Token   | Size   | Usage                      |
| ------- | ------ | -------------------------- |
| small   | 8px    | Badges, small buttons      |
| default | 12px   | Cards, buttons, inputs     |
| large   | 16px   | Modals, major cards        |
| full    | 9999px | Avatars, circular elements |

### Elevation (Light Mode Only)

```css
elevation-1: 0 2px 8px rgba(36, 51, 46, 0.08);
elevation-2: 0 4px 16px rgba(36, 51, 46, 0.12);
```

### Animation Defaults

| Property          | Value          |
| ----------------- | -------------- |
| Duration (Fast)   | 200ms          |
| Duration (Normal) | 300ms          |
| Duration (Slow)   | 400ms          |
| Easing (Entrance) | ease-out       |
| Easing (Exit)     | ease-in        |
| Easing (Move)     | ease-in-out    |
| Stagger Delay     | 100ms per item |

---

## Interactive Question Types Reference

---

| Type ID | Type Name        | Description                  | Points Range |
| ------- | ---------------- | ---------------------------- | ------------ |
| 1       | Multiple Choice  | Single answer from 4 options | 10-20        |
| 2       | Multiple Select  | Multiple correct answers     | 15-25        |
| 3       | True/False       | Binary choice                | 5-10         |
| 4       | Matching         | Drag items to match pairs    | 20-30        |
| 5       | Ordering         | Arrange items in sequence    | 15-25        |
| 6       | Fill in Blank    | Type missing word/phrase     | 10-20        |
| 7       | Hotspot          | Tap correct region on image  | 15-25        |
| 8       | Drag-to-Category | Sort items into groups       | 20-30        |
| 9       | Slider/Scale     | Select value on scale        | 10-15        |
| 10      | Short Text       | Free text input              | 15-25        |

---

## Character Emoji Mapping

---

| Character ID | Emoji | Role             |
| ------------ | ----- | ---------------- |
| alex         | 👨‍🍳    | Chef/Protagonist |
| carlos       | 👔    | Business Manager |
| morgan       | 👩‍💼    | Executive/Mentor |
| maya         | 👩‍🔬    | Quality Expert   |

---

**End of Document**

_This document is designed for Figma design handoff and developer reference._
