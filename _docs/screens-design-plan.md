# F&B Tycoon Mobile App - Complete Screen & Component Inventory

## Context

**App Name:** F&B Tycoon
**Purpose:** PMP exam preparation through gamified F&B restaurant management scenarios
**Platform:** iOS (iPhone, portrait only)
**Framework:** React Native + Expo
**Target Users:** Working professionals preparing for PMP certification (ages 28-45)

---

## Design System Reference

**Visual Identity:**

- Ghibli-inspired calm watercolor aesthetics
- Adult credibility (not childish, not corporate)
- Narrative world backgrounds + clean system UI

**Color Strategy:**

- Cool pastels (green #4e8f76, blue #4a6fa5) = thinking, learning, story
- Warm colors (yellow #f6c453, orange #f39c6b) = action, reward, urgency
- Muted red (#c84c4c) = errors that teach, not punish
- Text: Never pure black (#24332e primary)

**Typography:** Nunito (all weights), sentence case for buttons

**Dark Mode Philosophy:** Calm, low-energy workspace - not gaming UI. Deep green-charcoal backgrounds, no neon, soft matte surfaces.

---

## Current App Architecture

### Navigation Structure

Root
└── Bottom Tab Navigator (4 tabs)
├── Home Tab
│ └── Dashboard Screen
│
├── Courses Tab
│ ├── Learning Paths Screen
│ ├── Lesson Detail Screen (per lesson)
│ └── Lesson Player Screen (interactive lesson flow)
│ ├── Hook Screen
│ ├── Challenge Screen (8+ question types)
│ ├── Reason Screen
│ ├── Feedback Screen
│ ├── Transfer Screen
│ └── Wrap Screen
│
├── Practices Tab
│ ├── Practice List Screen
│ └── Results History Screen
│
└── Settings Tab
├── Settings Main Screen
│ ├── Daily Goal Sheet (modal)
│ ├── Reminder Time Sheet (modal)
│ └── Learning Stats Sheet (modal)
└── Profile Screen

### Interactive Question Types (Challenge & Transfer Screens)

1. Multiple Choice (single answer)
2. Multiple Select (multiple answers)
3. True/False
4. Matching (drag-and-drop pairs)
5. Ordering/Sequencing (arrange in order)
6. Fill in the Blank
7. Hotspot (tap on image regions)
8. Drag-to-Category (sort items into groups)
9. Slider/Scale questions
10. Short Text Input

---

## TASK: Generate Comprehensive Screen & Component Documentation

For each screen and component, provide the following structured information:

---

### PART 1: SCREEN INVENTORY

For **each screen**, document:

#### 1.1 Screen Metadata

| Field         | Description                              |
| ------------- | ---------------------------------------- |
| Screen ID     | Unique identifier (e.g., `SCR-HOME-001`) |
| Screen Name   | Display name                             |
| Route/Path    | Navigation route                         |
| Parent Screen | Where user navigates from                |
| Child Screens | Where user can navigate to               |
| Tab Location  | Which tab (if applicable)                |

#### 1.2 Screen Purpose & Context

- **Primary User Goal:** What is the user trying to accomplish?
- **Secondary Goals:** Additional objectives
- **Entry Points:** All ways to reach this screen
- **Exit Points:** All ways to leave this screen
- **User Story:** "As a [user], I want to [action] so that [outcome]"

#### 1.3 Screen Layout Zones

Map the screen into zones (top to bottom):
| Zone | Position | Content Type | Scroll Behavior |
|------|----------|--------------|-----------------|
| Header Zone | Fixed top | Navigation, title, actions | Fixed |
| Content Zone | Scrollable | Main content | Scrolls |
| Footer Zone | Fixed bottom | Primary CTA, navigation | Fixed |

#### 1.4 Component Inventory per Screen

List every UI element:
| Component ID | Component Name | Zone | Purpose | Interactive? |
|--------------|----------------|------|---------|--------------|

#### 1.5 Screen States

Document all possible states:
| State | Trigger Condition | Visual Changes | User Actions Available |
|-------|-------------------|----------------|------------------------|
| Default/Loaded | Data loaded successfully | Normal display | All actions |
| Loading | Fetching data | Skeleton/spinner | Limited |
| Empty | No data exists | Empty state illustration + CTA | Create first item |
| Error | API/network failure | Error message + retry | Retry, go back |
| First-time | New user, no history | Onboarding hints, guided tour | Dismiss, explore |
| Offline | No network | Cached data + offline badge | Limited to cached |
| Partial | Some data loaded | Mixed content + loading | Interact with loaded |

#### 1.6 Data Dependencies

| Data Type       | Source        | Required? | Fallback   |
| --------------- | ------------- | --------- | ---------- |
| User profile    | Local + API   | Yes       | Guest mode |
| Lesson progress | Local storage | Yes       | 0% default |

#### 1.7 Animations & Transitions

| Element           | Animation Type | Trigger    | Duration | Easing      |
| ----------------- | -------------- | ---------- | -------- | ----------- |
| Cards             | FadeInDown     | On mount   | 300ms    | ease-out    |
| Screen transition | SlideInRight   | Navigation | 250ms    | ease-in-out |

---

### PART 2: COMPONENT LIBRARY

For **each unique component**, document:

#### 2.1 Component Metadata

| Field          | Description                                 |
| -------------- | ------------------------------------------- |
| Component ID   | Unique identifier (e.g., `CMP-CARD-001`)    |
| Component Name | Display name                                |
| Component Type | Card, Button, List Item, Modal, Input, etc. |
| Atomic Level   | Atom, Molecule, Organism, Template          |

#### 2.2 Component Variants

| Variant Name | Use Case           | Visual Differences           |
| ------------ | ------------------ | ---------------------------- |
| Primary      | Main CTA           | Green background, white text |
| Secondary    | Alternative action | Blue background, white text  |
| Ghost        | Tertiary action    | Transparent, text only       |

#### 2.3 Component States

| State       | Visual Treatment             | Interaction        |
| ----------- | ---------------------------- | ------------------ |
| Default     | Normal appearance            | Tappable           |
| Hover/Focus | Slight highlight (web)       | -                  |
| Pressed     | Darker, scaled down slightly | Feedback           |
| Disabled    | 50% opacity, muted colors    | Not tappable       |
| Loading     | Spinner, disabled            | Not tappable       |
| Selected    | Accent border, checkmark     | Toggle off         |
| Error       | Red border, error icon       | Show error message |
| Success     | Green border, check icon     | Proceed            |

#### 2.4 Component Anatomy

Break down internal structure:
[Component Name]
├── Container (padding, background, border-radius)
│ ├── Leading Element (icon, avatar, checkbox)
│ ├── Content Area
│ │ ├── Title (primary text)
│ │ ├── Subtitle (secondary text)
│ │ └── Metadata (tertiary text, tags)
│ └── Trailing Element (chevron, action button, badge)

#### 2.5 Component Props/Customization

| Prop     | Type    | Default | Options                   |
| -------- | ------- | ------- | ------------------------- |
| size     | enum    | medium  | small, medium, large      |
| variant  | enum    | primary | primary, secondary, ghost |
| icon     | string  | null    | Any Feather icon          |
| disabled | boolean | false   | true, false               |

#### 2.6 Responsive Behavior

| Breakpoint                 | Behavior                     |
| -------------------------- | ---------------------------- |
| Small phone (< 375px)      | Reduce padding, smaller text |
| Standard phone (375-414px) | Default sizing               |
| Large phone (> 414px)      | Increase padding slightly    |

#### 2.7 Accessibility

| Requirement    | Implementation                  |
| -------------- | ------------------------------- |
| Touch target   | Minimum 44x44pt                 |
| Screen reader  | Accessible label, role, state   |
| Color contrast | WCAG AA (4.5:1 body, 3:1 large) |
| Reduced motion | Respect system preference       |

#### 2.8 Usage Examples

| Screen  | Context                | Variant Used           |
| ------- | ---------------------- | ---------------------- |
| Home    | Continue Learning card | Primary, large         |
| Courses | Lesson list item       | Default, with progress |

---

### PART 3: MODAL & OVERLAY INVENTORY

For each modal/sheet/overlay:

| Field      | Description                                    |
| ---------- | ---------------------------------------------- |
| Modal ID   | Unique identifier                              |
| Modal Type | Bottom sheet, center modal, full-screen, toast |
| Trigger    | What action opens it                           |
| Dismissal  | How to close (tap outside, swipe, button)      |
| Content    | What's displayed                               |
| Actions    | Available user actions                         |
| Backdrop   | Blur, dim, or transparent                      |

---

### PART 4: MICRO-INTERACTIONS

Document subtle interactions:

| Interaction     | Element          | Trigger    | Feedback                | Purpose                |
| --------------- | ---------------- | ---------- | ----------------------- | ---------------------- |
| Button press    | All buttons      | Touch down | Scale 0.97, darker      | Confirm tap registered |
| Toggle switch   | Settings toggles | Tap        | Slide animation, haptic | Confirm state change   |
| Pull to refresh | Scrollable lists | Pull down  | Spinner, content reload | Update data            |
| Swipe to reveal | List items       | Swipe left | Action buttons appear   | Quick actions          |
| Long press      | Cards            | Hold 500ms | Context menu            | Additional options     |
| Correct answer  | Quiz options     | Selection  | Green pulse, confetti   | Positive reinforcement |
| Wrong answer    | Quiz options     | Selection  | Red shake, subtle       | Learning moment        |

---

### PART 5: ICON INVENTORY

List all icons used:

| Icon Name    | Library | Usage Context     | Size | Color Token                               |
| ------------ | ------- | ----------------- | ---- | ----------------------------------------- |
| home         | Feather | Tab bar           | 24px | Active: brand-green, Inactive: text-muted |
| check-circle | Feather | Completion states | 20px | status-success                            |
| lock         | Feather | Locked content    | 16px | text-muted                                |

---

### PART 6: TYPOGRAPHY INSTANCES

Map where each text style is used:

| Text Style   | Font   | Weight   | Size    | Line Height | Usage Locations          |
| ------------ | ------ | -------- | ------- | ----------- | ------------------------ |
| Heading/L    | Nunito | SemiBold | 24-28px | 1.2         | Screen titles            |
| Body/Primary | Nunito | Regular  | 15-16px | 1.4-1.5     | Paragraphs, descriptions |
| Button       | Nunito | Medium   | 16px    | 1           | All button labels        |
| Caption      | Nunito | Regular  | 12-13px | 1.3         | Timestamps, metadata     |

---

### PART 7: COLOR USAGE MAP

Document where each color token appears:

| Color Token       | Hex (Light) | Hex (Dark) | Usage                                     |
| ----------------- | ----------- | ---------- | ----------------------------------------- |
| brand-green-500   | #4e8f76     | #6fb79a    | Primary buttons, success states, progress |
| accent-yellow-400 | #f6c453     | #e6c46a    | XP badges, rewards, celebrations          |
| status-error      | #c84c4c     | #d06a6a    | Error messages, wrong answers             |

---

### PART 8: USER FLOWS

Document key user journeys:

#### Flow: Complete a Lesson

[Courses Tab]
→ [Tap Learning Path]
→ [Bottom Sheet: Lesson List]
→ [Tap Lesson]
→ [Lesson Detail Screen]
→ [Tap "Start Lesson"]
→ [Lesson Player: Hook]
→ [Continue]
→ [Challenge Screen]
→ [Answer Questions]
→ [Reason Screen]
→ [Continue]
→ [Feedback Screen]
→ [Continue]
→ [Transfer Screen]
→ [Answer Questions]
→ [Wrap Screen]
→ [Complete]
→ [Return to Courses with updated progress]

---

### PART 9: EDGE CASES & ERROR STATES

Document how the app handles:

| Scenario              | Screen Affected  | Handling                    | User Message                             |
| --------------------- | ---------------- | --------------------------- | ---------------------------------------- |
| Network timeout       | All data screens | Show cached + retry         | "Couldn't connect. Showing saved data."  |
| Lesson not found      | Lesson Detail    | Redirect to courses         | "This lesson isn't available."           |
| Quiz abandoned        | Lesson Player    | Save progress, confirm exit | "Leave lesson? Progress will be saved."  |
| Streak about to break | Home             | Warning toast               | "Complete a lesson to keep your streak!" |

---

### PART 10: DESIGN TOKENS QUICK REFERENCE

Include a summary of the design system tokens from the style guide for easy reference during design.

---

## OUTPUT FORMAT

Please structure the output as:

1. **Executive Summary** - High-level screen count, component count, key patterns
2. **Screen-by-Screen Documentation** - Following Part 1 format
3. **Component Library** - Following Part 2 format
4. **Supporting Documentation** - Parts 3-10

Format for **Figma design handoff** with clear hierarchy, tables, and visual organization.

---

## ADDITIONAL NOTES

- Prioritize screens in the core learning flow (Lesson Player screens)
- Flag any inconsistencies or gaps in the current design
- Suggest improvements where patterns could be more consistent
- Consider both light and dark mode for every element
- Include placeholder text examples where helpful
