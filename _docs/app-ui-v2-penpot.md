# F&B Tycoon - Penpot Mockup Creation Plan

**Source Document:** `_docs/app-ui-v2.md`
**Target Tool:** Penpot (MCP)
**Device:** iPhone 14 Pro (393 x 852 px)

---

## ⚠️ CRITICAL: Penpot MCP API Limitations

> **READ THIS FIRST**: The Penpot MCP API has significant limitations that affect how we organize the design file:
>
> ### API Limitations
> | What | Limitation |
> |------|------------|
> | **Page Access** | ❌ Cannot access or switch between pages programmatically |
> | **Move Shapes** | ❌ Cannot move shapes between pages (no `removeChild` on page roots) |
> | **Page Management** | ❌ Cannot create, delete, rename, or reorder pages |
> | **Current Page** | API only operates on the currently active page in Penpot UI |
>
> ### Workaround: Board-Based Organization
> **All screens and dialogs MUST be created as separate BOARDS on the SAME PAGE**, not as separate pages.
>
> ```
> Single Page Structure (e.g., "02-Screens"):
> ┌─────────────────────────────────────────────────────────────────┐
> │ Page: "02-Screens"                                               │
> │                                                                   │
> │  [Board: 01-Home]  [Board: 02-Paths]  [Board: 03-Detail]        │
> │       x=600            x=1050             x=1500                  │
> │       y=100            y=100              y=100                   │
> │                                                                   │
> │  [Board: 04-Hook]  [Board: 05-Challenge] [Board: 06-Reason]     │
> │       x=600            x=1050             x=1500                  │
> │       y=1000           y=1000             y=1000                  │
> │                                                                   │
> │  ... (boards arranged in grid to avoid overlap)                  │
> │                                                                   │
> └─────────────────────────────────────────────────────────────────┘
> ```
>
> ### Board Positioning Rules
> - **Column spacing**: 450px (393px width + 57px gap)
> - **Row spacing**: 900px (852px height + 48px gap)
> - **Starting position**: x=600, y=100
> - **NEVER overlap boards** - use grid layout
> - **Scrollable content**: Expand board height beyond 852px as needed
>
> See `_docs/penpot-notes.md` for detailed guidelines and code patterns.

---

## Table of Contents

**🤖 IMPORTANT: All screen and dialog creation MUST be delegated to subagents using the Task tool. See Section 1 for details.**

1. [CRITICAL: AI Instructions for Asset-First Design](#critical-ai-instructions-for-asset-first-design)
   - [Subagent Workflow Requirement](#critical-workflow-requirement)
   - [Asset Creation Order](#asset-creation-order-must-follow)
   - [Enforcement Rules](#enforcement-rules)
   - [Asset Naming Convention](#asset-naming-convention)

2. [Project Overview](#project-overview)
   - [Summary](#summary)
   - [Page List](#page-list)

3. [Phase 1: Project Setup & Reusable Assets](#phase-1-project-setup--reusable-assets)
   - [Step 1.1: Create Penpot Project](#step-11-create-penpot-project)
   - [Step 1.2: Create Design Tokens Page](#step-12-create-design-tokens-page)
   - [Step 1.3: Create Color Assets (MANDATORY)](#step-13-create-color-assets-mandatory)
   - [Step 1.4: Create Typography Styles (MANDATORY)](#step-14-create-typography-styles-mandatory)
   - [Step 1.5: Document Spacing & Radius Values](#step-15-document-spacing--radius-values-mandatory)
   - [Step 1.6: Verification Checklist](#step-16-verification-checklist)

4. [Phase 2: Component Library](#phase-2-component-library)
   - [Step 2.1: Create Component Library Page](#step-21-create-component-library-page)
   - [Step 2.2: Create Base Components](#step-22-create-base-components-using-library-assets)
   - [Step 2.3: Component Verification Checklist](#step-23-component-verification-checklist)

5. [Phase 3: Screen Boards](#phase-3-screen-boards)
   - [Board 01: Home Dashboard](#board-01-home-dashboard-scr-home-001)
   - [Board 02: Learning Paths](#board-02-learning-paths-scr-courses-001)
   - [Board 03: Lesson Detail](#board-03-lesson-detail-scr-courses-002)
   - [Boards 04-09: Lesson Player Screens](#boards-04-09-lesson-player-screens)
   - [Board 10: Practice List](#board-10-practice-list-scr-prac-001)
   - [Board 11: Results History](#board-11-results-history-scr-prac-002)
   - [Board 12: Settings Main](#board-12-settings-main-scr-set-001)
   - [Board 13: Profile](#board-13-profile-scr-set-002)

6. [Phase 4: Modal Boards](#phase-4-modal-boards)
   - [Board 14: Lessons Bottom Sheet](#board-14-lessons-bottom-sheet-mod-001)
   - [Board 15: Daily Goal Sheet](#board-15-daily-goal-sheet-mod-002)
   - [Board 16: Reminder Time Sheet](#board-16-reminder-time-sheet-mod-003)
   - [Board 17: Learning Stats Sheet](#board-17-learning-stats-sheet-mod-004)
   - [Board 18: Quiz Start Alert](#board-18-quiz-start-alert-mod-005)

7. [Phase 5: Execution Order](#phase-5-execution-order)
   - [Mandatory Execution Sequence](#mandatory-execution-sequence)
   - [Asset Dependencies](#quick-reference-asset-dependencies)

8. [Penpot MCP Commands Reference](#penpot-mcp-commands-reference)
   - [Project Operations](#project-operations)
   - [Shape Operations](#shape-operations)
   - [Component Operations](#component-operations)

9. [Notes](#notes)
   - [Design Considerations](#design-considerations)
   - [File Organization](#file-organization)
   - [Export Settings](#export-settings)

---

## CRITICAL: AI Instructions for Asset-First Design

> **MANDATORY REQUIREMENT**: Before creating ANY screen or component, you MUST first create all reusable design assets. All UI elements MUST reference these predefined assets - NEVER use hardcoded values.

> **⚠️ CRITICAL WORKFLOW REQUIREMENT**: When creating screens and dialogs in Penpot, you MUST ALWAYS use the Task tool with subagent_type='general-purpose' to handle the creation. DO NOT attempt to create screens directly using individual Penpot MCP commands in the main conversation. Subagents are designed to handle complex, multi-step Penpot operations autonomously and will ensure consistency, proper asset usage, and error handling.
>
> **Why use subagents:**
> - **Autonomy**: Subagents can handle the entire screen creation process (20-50+ MCP calls) without interruption
> - **Asset Consistency**: Subagents will ensure all elements reference library assets correctly
> - **Error Handling**: Subagents can detect and fix issues during creation
> - **Efficiency**: Parallel processing of multiple elements
> - **Complexity Management**: Screens have many nested elements; subagents manage this better
>
> **Example Usage:**
> ```
> Use Task tool:
>   subagent_type: "general-purpose"
>   prompt: "Create the Home Dashboard screen (Board 01) in Penpot following the specifications in _docs/app-ui-v2-penpot.md.
>
>   CRITICAL BOARD SETTINGS:
>   - Create as a BOARD (not page) at position x=600, y=100
>   - Board size: 393 x 852 px
>   - Set board.clipContent = false
>   - Use all library assets (colors, typography, components)
>
>   Reference _docs/penpot-notes.md for z-order, text wrapping, and centering guidelines."
> ```

### Asset Creation Order (MUST Follow)

```
STEP 1: Create Color Assets (REQUIRED FIRST)
   ├── Create ALL color swatches as named library colors
   ├── Light mode colors (10 colors)
   └── Dark mode colors (6 colors)

STEP 2: Create Typography Styles (REQUIRED SECOND)
   ├── Create ALL text styles as named library styles
   └── 7 typography presets

STEP 3: Create Spacing/Layout Assets (REQUIRED THIRD)
   ├── Document spacing values
   └── Document border radius values

STEP 4: Create Base Components (REQUIRED FOURTH)
   ├── Each component MUST use color assets (not hex codes)
   ├── Each component MUST use typography styles (not inline fonts)
   └── Each component MUST use spacing tokens (not arbitrary values)

STEP 5: Create Screens (ONLY AFTER Steps 1-4)
   ├── Each screen MUST use components from library
   ├── Each element MUST reference color assets
   └── Each text MUST use typography styles
```

### Enforcement Rules

| Rule | Description | Example |
|------|-------------|---------|
| **NO hardcoded colors** | Always use color asset reference | ✅ `fill: @brand-green-500` ❌ `fill: #4e8f76` |
| **NO inline fonts** | Always use typography style | ✅ `style: Heading/L` ❌ `font-size: 24px` |
| **NO magic numbers** | Always use spacing token | ✅ `padding: @Space/M` ❌ `padding: 16px` |
| **Component-first** | Reuse components, don't recreate | ✅ Instance `Card/Base` ❌ Create new rectangle |

### Asset Naming Convention

```
Colors:      {category}-{name}-{shade}     → brand-green-500, text-muted
Typography:  {category}/{size}             → Heading/L, Body/Primary
Spacing:     Space/{size}                  → Space/M, Space/XL
Radius:      Radius/{size}                 → Radius/Default, Radius/Large
Components:  {type}/{variant}              → Card/Base, Button/Primary
```

---

## Project Overview

### Summary

| Metric | Count |
|--------|-------|
| **Penpot Pages** | 1-3 (due to API limitations) |
| Screen Boards | 13 |
| Modal/Dialog Boards | 5 |
| **Total Boards** | 18 |

> **Note**: Due to Penpot MCP API limitations, all screens are created as **boards on the same page**, not separate pages.

### File Structure

```
F&B Tycoon Mobile App (Penpot Project)
│
├── Page: "00-DesignSystem" (optional, for reference)
│   └── Design tokens, color swatches, typography samples
│
├── Page: "01-Components" (optional, for component library)
│   └── Reusable component definitions
│
└── Page: "02-Screens" (MAIN PAGE - all boards created here)
    │
    │  ══════════════════════════════════════════════════════
    │  BOARD GRID LAYOUT (arranged to avoid overlap)
    │  ══════════════════════════════════════════════════════
    │
    │  Row 1 (y=100):
    ├── [Board] 01-Home-Dashboard         (x=600)
    ├── [Board] 02-Courses-LearningPaths  (x=1050)
    ├── [Board] 03-Courses-LessonDetail   (x=1500)
    │
    │  Row 2 (y=1000):
    ├── [Board] 04-LessonPlayer-Hook      (x=600)
    ├── [Board] 05-LessonPlayer-Challenge (x=1050)
    ├── [Board] 06-LessonPlayer-Reason    (x=1500)
    │
    │  Row 3 (y=1900):
    ├── [Board] 07-LessonPlayer-Feedback  (x=600)
    ├── [Board] 08-LessonPlayer-Transfer  (x=1050)
    ├── [Board] 09-LessonPlayer-Wrap      (x=1500)
    │
    │  Row 4 (y=2800):
    ├── [Board] 10-Practices-List         (x=600)
    ├── [Board] 11-Practices-Results      (x=1050)
    ├── [Board] 12-Settings-Main          (x=1500)
    │
    │  Row 5 (y=3700):
    ├── [Board] 13-Settings-Profile       (x=600)
    │
    │  Row 6 (y=4600) - Modals:
    ├── [Board] 14-Modal-LessonsBottomSheet (x=600)
    ├── [Board] 15-Modal-DailyGoal          (x=1050)
    ├── [Board] 16-Modal-ReminderTime       (x=1500)
    │
    │  Row 7 (y=5500) - More Modals:
    ├── [Board] 17-Modal-LearningStats    (x=600)
    └── [Board] 18-Modal-QuizStartAlert   (x=1050)
```

### Board Position Reference

| Board | Name | X | Y | Column | Row |
|-------|------|---|---|--------|-----|
| 01 | Home-Dashboard | 600 | 100 | 0 | 0 |
| 02 | Courses-LearningPaths | 1050 | 100 | 1 | 0 |
| 03 | Courses-LessonDetail | 1500 | 100 | 2 | 0 |
| 04 | LessonPlayer-Hook | 600 | 1000 | 0 | 1 |
| 05 | LessonPlayer-Challenge | 1050 | 1000 | 1 | 1 |
| 06 | LessonPlayer-Reason | 1500 | 1000 | 2 | 1 |
| 07 | LessonPlayer-Feedback | 600 | 1900 | 0 | 2 |
| 08 | LessonPlayer-Transfer | 1050 | 1900 | 1 | 2 |
| 09 | LessonPlayer-Wrap | 1500 | 1900 | 2 | 2 |
| 10 | Practices-List | 600 | 2800 | 0 | 3 |
| 11 | Practices-Results | 1050 | 2800 | 1 | 3 |
| 12 | Settings-Main | 1500 | 2800 | 2 | 3 |
| 13 | Settings-Profile | 600 | 3700 | 0 | 4 |
| 14 | Modal-LessonsBottomSheet | 600 | 4600 | 0 | 5 |
| 15 | Modal-DailyGoal | 1050 | 4600 | 1 | 5 |
| 16 | Modal-ReminderTime | 1500 | 4600 | 2 | 5 |
| 17 | Modal-LearningStats | 600 | 5500 | 0 | 6 |
| 18 | Modal-QuizStartAlert | 1050 | 5500 | 1 | 6 |

**Position Formula:**
```javascript
x = 600 + (column * 450)   // 450 = 393px width + 57px gap
y = 100 + (row * 900)      // 900 = 852px height + 48px gap
```

---

## Phase 1: Project Setup & Reusable Assets

> **⚠️ CRITICAL**: This phase MUST be completed before creating ANY screens. All assets created here will be referenced throughout the entire project.

### Step 1.1: Create Penpot Project

```
Action: Create new project
Name: "F&B Tycoon Mobile App"
```

### Step 1.2: Create Design Tokens Page

```
Action: Create dedicated page for design system assets
Page Name: "00-DesignSystem"
Purpose: Central location for all reusable assets
```

---

### Step 1.3: Create Color Assets (MANDATORY)

> **INSTRUCTION**: Create each color as a named, reusable color in Penpot's shared library. These colors MUST be used by reference in all subsequent designs.

#### Light Mode Colors (Create ALL 10)

| Asset Name | Hex Value | Create As |
|------------|-----------|-----------|
| `bg-background` | #f3f6ef | Shared Library Color |
| `surface-primary` | #ffffff | Shared Library Color |
| `text-foreground` | #24332e | Shared Library Color |
| `text-muted` | #8a9a92 | Shared Library Color |
| `brand-green-500` | #4e8f76 | Shared Library Color |
| `brand-blue-500` | #4a6fa5 | Shared Library Color |
| `accent-yellow-400` | #f6c453 | Shared Library Color |
| `accent-orange-400` | #f39c6b | Shared Library Color |
| `status-error` | #c84c4c | Shared Library Color |
| `border-divider` | #e1e8e4 | Shared Library Color |

**Penpot Command:**
```
For each color:
penpot_create_library_color(
  name: "brand-green-500",
  color: "#4e8f76"
)
```

#### Dark Mode Colors (Create ALL 6)

| Asset Name | Hex Value | Create As |
|------------|-----------|-----------|
| `dm-bg-background` | #121916 | Shared Library Color |
| `dm-surface-primary` | #1f2a26 | Shared Library Color |
| `dm-text-foreground` | #e6efea | Shared Library Color |
| `dm-text-muted` | #8fa39a | Shared Library Color |
| `dm-brand-green-500` | #6fb79a | Shared Library Color |
| `dm-brand-blue-500` | #7fa2d6 | Shared Library Color |

---

### Step 1.4: Create Typography Styles (MANDATORY)

> **INSTRUCTION**: Create each typography style as a named text style in Penpot's shared library. All text elements MUST use these styles by reference.

| Style Asset Name | Font | Weight | Size | Line Height | Create As |
|------------------|------|--------|------|-------------|-----------|
| `Heading/L` | Nunito | SemiBold (600) | 24px | 1.2 | Shared Text Style |
| `Heading/M` | Nunito | SemiBold (600) | 18px | 1.3 | Shared Text Style |
| `Body/Primary` | Nunito | Regular (400) | 16px | 1.4 | Shared Text Style |
| `Body/Secondary` | Nunito | Regular (400) | 14px | 1.4 | Shared Text Style |
| `Button` | Nunito | SemiBold (600) | 16px | 1.0 | Shared Text Style |
| `Caption` | Nunito | Regular (400) | 12px | 1.3 | Shared Text Style |
| `Metric/Large` | Nunito | Bold (700) | 24px | 1.1 | Shared Text Style |

**Penpot Command:**
```
For each style:
penpot_create_text_style(
  name: "Heading/L",
  font_family: "Nunito",
  font_weight: 600,
  font_size: 24,
  line_height: 1.2
)
```

---

### Step 1.5: Document Spacing & Radius Values (MANDATORY)

> **INSTRUCTION**: Create a visual reference frame showing all spacing and radius values. Use these exact values when building components.

#### Spacing Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `Space/XS` | 4px | Tight gaps, inline spacing |
| `Space/S` | 8px | Small gaps, icon spacing |
| `Space/M` | 16px | Card padding, standard gaps |
| `Space/L` | 24px | Section spacing |
| `Space/XL` | 32px | Screen margins, large gaps |

#### Border Radius Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `Radius/Small` | 8px | Small buttons, badges |
| `Radius/Default` | 12px | Cards, buttons, inputs |
| `Radius/Large` | 16px | Modals, large cards |
| `Radius/Full` | 9999px | Circles, pills |

**Visual Reference Frame:**
```
Create a frame on "00-DesignSystem" page showing:
┌─────────────────────────────────────────────┐
│ SPACING REFERENCE                           │
│                                             │
│ ┌──┐ 4px (XS)                               │
│ ┌────┐ 8px (S)                              │
│ ┌────────┐ 16px (M)                         │
│ ┌────────────┐ 24px (L)                     │
│ ┌────────────────┐ 32px (XL)                │
│                                             │
│ RADIUS REFERENCE                            │
│                                             │
│ ┌──────┐ 8px  ┌──────┐ 12px                 │
│ └──────┘      └──────┘                      │
│ ┌──────┐ 16px  (●) 9999px                   │
│ └──────┘                                    │
└─────────────────────────────────────────────┘
```

---

### Step 1.6: Verification Checklist

Before proceeding to Phase 2, verify ALL assets are created:

```
□ 10 Light mode colors created in shared library
□ 6 Dark mode colors created in shared library
□ 7 Typography styles created in shared library
□ Spacing reference frame created
□ Radius reference frame created
□ All assets use correct naming convention
```

**⚠️ DO NOT PROCEED to Phase 2 until ALL items are checked.**

---

## Phase 2: Component Library

> **⚠️ PREREQUISITE**: Phase 1 MUST be completed. All components MUST use assets from the shared library - NO hardcoded values allowed.

### Step 2.1: Create Component Library Page

```
Action: Create dedicated page for components
Page Name: "01-Components"
Purpose: All reusable UI components
```

---

### Step 2.2: Create Base Components (Using Library Assets)

> **INSTRUCTION**: When creating each component, you MUST:
> 1. Use color assets by reference (e.g., `@surface-primary` not `#ffffff`)
> 2. Apply typography styles (e.g., `@Button` not inline font settings)
> 3. Use spacing tokens (e.g., `@Space/M` = 16px)
> 4. Use radius tokens (e.g., `@Radius/Default` = 12px)

---

#### CMP-001: Card

```
Structure:
├── Container
│   ├── Fill: @surface-primary (NOT #ffffff)
│   ├── Radius: @Radius/Default (12px)
│   ├── Shadow: elevation-1 (subtle)
│   └── Padding: @Space/M (16px)
└── Content Area (slot for children)

Variants:
- Default (as above)
- Pressable (add hover: opacity 0.95)
- Highlighted (stroke: @brand-green-500, 2px)
```

**Penpot Command:**
```
penpot_create_component(
  name: "Card/Base",
  fill: "@surface-primary",      // ← Use asset reference
  radius: 12,                    // @Radius/Default
  shadow: "0 2px 8px rgba(36,51,46,0.08)"
)
```

---

#### CMP-002: Button

```
Structure:
├── Container
│   ├── Fill: @brand-green-500 (Primary)
│   ├── Radius: @Radius/Default (12px)
│   ├── Height: 52px
│   ├── Padding-X: @Space/L (24px)
│   └── Padding-Y: @Space/M (16px)
└── Label
    ├── Text Style: @Button (NOT inline font)
    └── Color: white

Variants (Create ALL):
┌──────────────┬────────────────────┬─────────────────────┐
│ Variant      │ Fill               │ Text Color          │
├──────────────┼────────────────────┼─────────────────────┤
│ Primary      │ @brand-green-500   │ white               │
│ Secondary    │ @surface-primary   │ @text-foreground    │
│ Danger       │ @status-error      │ white               │
│ Disabled     │ @surface-primary   │ @text-muted (50%)   │
└──────────────┴────────────────────┴─────────────────────┘
```

---

#### CMP-003: Progress Bar

```
Structure:
├── Track
│   ├── Fill: #eef4f1 (or create as @bg-track)
│   ├── Radius: @Radius/Full (9999px)
│   └── Height: 8px
└── Fill
    ├── Fill: @brand-green-500
    ├── Radius: @Radius/Full
    └── Width: {percentage}%

Variants:
- Default (8px height)
- Small (4px height)
- Success (@brand-green-500)
- Warning (@accent-orange-400)
```

---

#### CMP-004: Tab Bar

```
Structure:
├── Container
│   ├── Fill: @surface-primary
│   ├── Height: 83px (includes safe area)
│   ├── Border-Top: 1px @border-divider
│   └── Padding-Bottom: 34px (home indicator)
└── Tab Items (4x, equally spaced)
    ├── Icon (24x24)
    │   ├── Active: @brand-green-500
    │   └── Inactive: @text-muted
    └── Label (optional)
        ├── Text Style: @Caption
        ├── Active: @brand-green-500
        └── Inactive: @text-muted

Tab Icons:
- Home: home icon
- Courses: book-open icon
- Practice: edit-3 icon
- Settings: settings icon
```

---

#### CMP-005: Section Header

```
Structure:
├── Label
    ├── Text Style: @Caption (12px)
    ├── Color: @text-muted
    ├── Transform: UPPERCASE
    └── Letter-Spacing: 1.5px (wider)

Margin-Bottom: @Space/S (8px)
```

---

#### CMP-006: Setting Item

```
Structure:
├── Container
│   ├── Padding: @Space/M (16px)
│   └── Flex: row, center-aligned
├── Leading Icon
│   ├── Size: 24x24
│   ├── Color: @brand-green-500
│   └── Margin-Right: @Space/M
├── Content (flex: 1)
│   ├── Title
│   │   ├── Text Style: @Body/Primary
│   │   └── Color: @text-foreground
│   └── Subtitle
│       ├── Text Style: @Body/Secondary
│       └── Color: @text-muted
└── Trailing
    ├── Chevron Icon (color: @text-muted)
    └── OR Toggle Switch

Variants:
- With Chevron (navigation)
- With Toggle (settings)
- With Value (display current value)
```

---

### Step 2.3: Component Verification Checklist

Before proceeding to Phase 3, verify:

```
□ All components use @color assets (not hex codes)
□ All text uses @typography styles (not inline fonts)
□ All spacing uses token values (not arbitrary numbers)
□ All radii use token values
□ Components are saved to shared library
□ Component variants are created
```

**⚠️ DO NOT PROCEED to Phase 3 until ALL items are checked.**

---

## Phase 3: Screen Boards

> **⚠️ PREREQUISITE**: Phases 1 and 2 MUST be completed. All screens MUST:
> 1. Use component instances from the library (not recreate components)
> 2. Reference color assets (not hardcode hex values)
> 3. Apply typography styles (not set fonts inline)
> 4. Follow spacing tokens (not use arbitrary values)

> **🤖 SUBAGENT REQUIREMENT**: Each screen creation MUST be delegated to a subagent using the Task tool. Do NOT create screens manually in the main conversation. Launch a separate subagent for each screen or group of related screens.

> **📍 BOARD POSITIONING**: All screens are created as boards on the same page. Use the [Board Position Reference](#board-position-reference) table above to ensure correct X/Y positions and avoid overlapping boards.

### Screen Creation Rules

| Element Type | MUST Use | NOT Allowed |
|--------------|----------|-------------|
| Cards | Instance `@Card/Base` | New rectangles with fill #ffffff |
| Buttons | Instance `@Button/{variant}` | New shapes with inline styling |
| Text | Apply `@Heading/L`, `@Body/Primary`, etc. | Inline font-size: 24px |
| Colors | `@brand-green-500` | #4e8f76 |
| Spacing | @Space/M (16px) | margin: 16px (magic number) |
| Radius | @Radius/Default (12px) | border-radius: 12px |

---

### Board 01: Home Dashboard (SCR-HOME-001)

**Board Size:** 393 x 852 px (iPhone 14 Pro)
**Position:** x=600, y=100 (Row 0, Column 0)

**Layout Zones:**
```
┌─────────────────────────────────────┐
│ Safe Area Top (59px)                │
├─────────────────────────────────────┤
│ Header                              │
│ - App Title: "F&B Tycoon"           │
│ - Tagline: "Project Management..."  │
├─────────────────────────────────────┤
│ Content (Scrollable)                │
│                                     │
│ [Daily Streak Card]                 │
│ - Fire emoji + "Daily Streak"       │
│ - Streak count badge (5 days)       │
│                                     │
│ [Continue Learning Card]            │
│ - Lesson icon + title               │
│ - Path name                         │
│ - Progress bar (35%)                │
│ - "Continue →" link                 │
│                                     │
│ [Today's Goal Card]                 │
│ - Title + lesson count              │
│ - 5 progress circles                │
│ - "X of 5 completed"                │
│                                     │
│ [Quick Actions Grid] (2 columns)    │
│ - Practice Quiz card                │
│ - Mock Exam card                    │
│                                     │
├─────────────────────────────────────┤
│ Tab Bar (83px)                      │
│ [Home] [Courses] [Practice] [Set]   │
└─────────────────────────────────────┘
```

**Key Elements to Create:**
1. App header with branding
2. Daily Streak Card with fire emoji and badge
3. Continue Learning Card with progress bar
4. Today's Goal Card with 5 circular indicators
5. Quick Actions 2-column grid
6. Tab bar with 4 tabs (Home active)

---

### Board 02: Learning Paths (SCR-COURSES-001)

**Board Size:** 393 x 852 px
**Position:** x=1050, y=100 (Row 0, Column 1)

**Layout Zones:**
```
┌─────────────────────────────────────┐
│ Safe Area Top                       │
├─────────────────────────────────────┤
│ Header                              │
│ - "Learning Paths"                  │
│ - Subtitle description              │
├─────────────────────────────────────┤
│ Stats Row (3 cards)                 │
│ [Completed] [Total] [Progress]      │
├─────────────────────────────────────┤
│ Section: "All Paths"                │
│                                     │
│ [PathCard: Foundation]              │
│ - Icon + Title + Check/Lock         │
│ - Subtitle                          │
│ - Progress bar + count              │
│ - Chevron                           │
│                                     │
│ [PathCard: People Domain]           │
│ [PathCard: Process Domain]          │
│ [PathCard: Business Domain]         │
│                                     │
├─────────────────────────────────────┤
│ Tab Bar                             │
│ [Home] [Courses*] [Practice] [Set]  │
└─────────────────────────────────────┘
```

**Key Elements to Create:**
1. Page header with title and subtitle
2. Stats row with 3 mini cards
3. Path cards with icons, progress, and states
4. Tab bar with Courses active

---

### Board 03: Lesson Detail (SCR-COURSES-002)

**Board Size:** 393 x 852 px
**Position:** x=1500, y=100 (Row 0, Column 2)

**Layout Zones:**
```
┌─────────────────────────────────────┐
│ Safe Area + Back Button             │
├─────────────────────────────────────┤
│ Hero Section                        │
│ - Large lesson icon (centered)      │
│ - Path badge                        │
│ - Lesson title                      │
│ - Description                       │
│ - Meta badges (duration, XP, pts)   │
│ - Character avatars                 │
├─────────────────────────────────────┤
│ [Learning Objectives Card]          │
│ - Target icon + title               │
│ - Checklist of 4 objectives         │
├─────────────────────────────────────┤
│ [Scenario Preview Card]             │
│ - Play icon + "The Scenario"        │
│ - Scenario title                    │
│ - Character dialogue bubble         │
│ - Learning hook callout             │
├─────────────────────────────────────┤
│ [Lesson Structure Card]             │
│ - List icon + "Lesson Structure"    │
│ - 6 screen types with durations     │
├─────────────────────────────────────┤
│ [Mastery Info Card]                 │
│ - Trophy icon + "70% to pass"       │
├─────────────────────────────────────┤
│ Fixed Footer                        │
│ [▶ Start Lesson] button             │
└─────────────────────────────────────┘
```

**Key Elements to Create:**
1. Back button in header
2. Hero section with icon, badges, and meta
3. Learning objectives checklist
4. Scenario preview with dialogue
5. Lesson structure list
6. Mastery requirement info
7. Fixed footer with Start button

---

### Boards 04-09: Lesson Player Screens

Each lesson player screen shares a common header and footer.

**Board Positions:**
| Board | Name | X | Y |
|-------|------|---|---|
| 04 | LessonPlayer-Hook | 600 | 1000 |
| 05 | LessonPlayer-Challenge | 1050 | 1000 |
| 06 | LessonPlayer-Reason | 1500 | 1000 |
| 07 | LessonPlayer-Feedback | 600 | 1900 |
| 08 | LessonPlayer-Transfer | 1050 | 1900 |
| 09 | LessonPlayer-Wrap | 1500 | 1900 |

**Common Header:**
```
┌─────────────────────────────────────┐
│ [X Close]  Screen Type    [2/6] ⭐25│
│ ████████████░░░░░░░░░░░░░░░░ 33%    │
└─────────────────────────────────────┘
```

**Common Footer:**
```
┌─────────────────────────────────────┐
│ [← Back]           [Continue →]     │
└─────────────────────────────────────┘
```

---

### Board 04: Hook Screen

**Content Area:**
```
- Headline (large, centered)
- Failed project cards (2x with X icons)
- Character dialogue card
  - Avatar + name
  - Quoted dialogue text
- Learning hook callout (lightbulb icon)
```

---

### Board 05: Challenge Screen

**Content Area:**
```
- Scenario context text
- Question text
- Answer options (4x radio buttons)
  - Unselected state (○)
  - Selected state (●)
- Progress hint: "Answer all to continue (1/3)"
- Continue button: DISABLED state
```

---

### Board 06: Reason Screen

**Content Area:**
```
- Section title with book icon
- Educational paragraph text
- Key Components card (bullet list)
- Best Practice callout (lightbulb)
```

---

### Board 07: Feedback Screen

**Content Area:**
```
- "Your Score" header
- Large score display (75%, 50/75)
- "Question Review" section
- Question result cards (3x)
  - Correct: green check, +points
  - Wrong: red X, show correct answer
```

---

### Board 08: Transfer Screen

**Content Area:**
```
- "Apply Your Knowledge" header
- Real-world scenario text
- Question text
- Answer options (4x)
  - Selected correct: green highlight + check
- Continue button: ENABLED
```

---

### Board 09: Wrap Screen

**Content Area:**
```
- "Lesson Complete!" header with celebration
- Trophy icon with score
- XP earned display
- Key Takeaways card (3 bullet points)
- Badge Unlocked card (optional)
- Footer: [Complete ✓] button
```

---

### Board 10: Practice List (SCR-PRAC-001)

**Board Size:** 393 x 852 px
**Position:** x=600, y=2800 (Row 3, Column 0)

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Practice"                  │
│ Subtitle description                │
├─────────────────────────────────────┤
│ Recent Results (3 mini cards)       │
│ [85% Today] [72% Yest] [90% 2d]    │
├─────────────────────────────────────┤
│ Section: "Available Practices"      │
│                                     │
│ [PracticeCard: Quick Quiz - NEW]    │
│ [PracticeCard: People Domain]       │
│ [PracticeCard: Process Domain]      │
│ [PracticeCard: Full Mock Exam]      │
│                                     │
├─────────────────────────────────────┤
│ Tab Bar (Practice active)           │
└─────────────────────────────────────┘
```

---

### Board 11: Results History (SCR-PRAC-002)

**Board Size:** 393 x 852 px
**Position:** x=1050, y=2800 (Row 3, Column 1)

**Layout:**
```
┌─────────────────────────────────────┐
│ [← Back] Results                    │
├─────────────────────────────────────┤
│ Subtitle                            │
│                                     │
│ [ResultCard] 85% - Quick Quiz       │
│ [ResultCard] 72% - People Domain    │
│ [ResultCard] 90% - Quick Quiz       │
│ [ResultCard] 68% - Process Domain   │
│ ... more results                    │
│                                     │
├─────────────────────────────────────┤
│ Tab Bar                             │
└─────────────────────────────────────┘
```

---

### Board 12: Settings Main (SCR-SET-001)

**Board Size:** 393 x 852 px
**Position:** x=1500, y=2800 (Row 3, Column 2)

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Settings"                  │
├─────────────────────────────────────┤
│ [Profile Card]                      │
│ Avatar + Name + Email + Level       │
├─────────────────────────────────────┤
│ APPEARANCE                          │
│ [Theme Selector: Light|Dark|Auto]   │
├─────────────────────────────────────┤
│ NOTIFICATIONS                       │
│ [Push Notifications - Toggle ON]    │
│ [Sounds - Toggle ON]                │
│ [Haptic Feedback - Toggle ON]       │
├─────────────────────────────────────┤
│ LEARNING                            │
│ [Daily Goal - 5 lessons →]          │
│ [Reminder Time - 9:00 AM →]         │
│ [Learning Stats →]                  │
├─────────────────────────────────────┤
│ SUPPORT                             │
│ [Help Center →]                     │
│ [Contact Us →]                      │
├─────────────────────────────────────┤
│ Version: F&B Tycoon v1.0.0          │
├─────────────────────────────────────┤
│ Tab Bar (Settings active)           │
└─────────────────────────────────────┘
```

---

### Board 13: Profile (SCR-SET-002)

**Board Size:** 393 x 852 px
**Position:** x=600, y=3700 (Row 4, Column 0)

**Layout:**
```
┌─────────────────────────────────────┐
│ [← Back] Profile                    │
├─────────────────────────────────────┤
│ Profile Header                      │
│ - Large avatar                      │
│ - Name + Email                      │
│ - Level + XP                        │
│ - XP progress bar                   │
├─────────────────────────────────────┤
│ STATISTICS (2x2 grid)               │
│ [7 Day Streak] [16 Lessons]         │
│ [12 Quizzes]   [8h 30m Time]        │
├─────────────────────────────────────┤
│ ACHIEVEMENTS                        │
│ [First Steps ✓]                     │
│ [Bookworm ✓]                        │
│ [Sharpshooter ✓]                    │
│ [Speed Learner ✓]                   │
│ [Champion 🔒]                       │
│ [PMP Ready 🔒]                      │
├─────────────────────────────────────┤
│ ACCOUNT                             │
│ [Member since: December 2024]       │
│ [Account type: Premium]             │
└─────────────────────────────────────┘
```

---

## Phase 4: Modal Boards

> **🤖 SUBAGENT REQUIREMENT**: Modal creation MUST also be delegated to subagents. Each modal involves complex layering (backdrop + sheet/dialog) and should be handled by a dedicated subagent.

> **📍 BOARD POSITIONING**: Modal boards are placed in Rows 5-6. Use the [Board Position Reference](#board-position-reference) table above.

**Modal Board Positions:**
| Board | Name | X | Y |
|-------|------|---|---|
| 14 | Modal-LessonsBottomSheet | 600 | 4600 |
| 15 | Modal-DailyGoal | 1050 | 4600 |
| 16 | Modal-ReminderTime | 1500 | 4600 |
| 17 | Modal-LearningStats | 600 | 5500 |
| 18 | Modal-QuizStartAlert | 1050 | 5500 |

### Board 14: Lessons Bottom Sheet (MOD-001)

**Board Size:** 393 x 852 px with overlay
**Position:** x=600, y=4600 (Row 5, Column 0)

**Layout:**
```
┌─────────────────────────────────────┐
│ ░░░ Dimmed Background (50%) ░░░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│ Bottom Sheet (85% height)           │
│ ══════════ Handle ══════════        │
│                                     │
│ [Path Icon] Foundation Path         │
│             3 of 4 completed        │
│ ─────────────────────────────────── │
│ [✓] Project Charter       15min    │
│ [▶] Stakeholder Analysis  35%      │
│ [3] Risk Management       →        │
│ [🔒] Advanced Planning    Locked   │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
1. Dimmed backdrop (50% opacity black)
2. Bottom sheet container (rounded top corners)
3. Handle indicator bar
4. Path header with icon
5. Lesson items with various states

---

### Board 15: Daily Goal Sheet (MOD-002)

**Board Size:** 393 x 852 px
**Position:** x=1050, y=4600 (Row 5, Column 1)

**Layout:**
```
┌─────────────────────────────────────┐
│ ░░░ Dimmed Background ░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│ Bottom Sheet                        │
│ ══════════ Handle ══════════        │
│                                     │
│ 🎯 Set Your Daily Goal              │
│ How many lessons per day?           │
│                                     │
│ ○ 1 lesson   - Light                │
│ ○ 3 lessons  - Regular              │
│ ● 5 lessons  - Committed (selected) │
│ ○ 10 lessons - Intensive            │
│                                     │
│ [━━━━━ Save Goal ━━━━━]             │
│                                     │
└─────────────────────────────────────┘
```

---

### Board 16: Reminder Time Sheet (MOD-003)

**Board Size:** 393 x 852 px
**Position:** x=1500, y=4600 (Row 5, Column 2)

**Layout:**
```
┌─────────────────────────────────────┐
│ ░░░ Dimmed Background ░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│ Bottom Sheet                        │
│ ══════════ Handle ══════════        │
│                                     │
│ ⏰ Set Reminder Time                │
│ When to be reminded?                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  [Hour]  [Minutes]  [AM/PM]    │ │
│ │    9   :    00    :   AM       │ │
│ │   iOS-style time picker        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [━━━━━ Save Time ━━━━━]             │
│                                     │
└─────────────────────────────────────┘
```

---

### Board 17: Learning Stats Sheet (MOD-004)

**Board Size:** 393 x 852 px
**Position:** x=600, y=5500 (Row 6, Column 0)

**Layout:**
```
┌─────────────────────────────────────┐
│ ░░░ Dimmed Background ░░░░░░░░░░░░░│
├─────────────────────────────────────┤
│ Bottom Sheet                        │
│ ══════════ Handle ══════════        │
│                                     │
│ 📊 Your Learning Stats              │
│                                     │
│ ┌─ This Week ─────────────────────┐ │
│ │ Lessons Completed         8     │ │
│ │ Time Spent            2h 45m    │ │
│ │ XP Earned               450     │ │
│ │ Quizzes Passed            3     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ All Time ──────────────────────┐ │
│ │ Total Lessons            16     │ │
│ │ Total Time           8h 30m     │ │
│ │ Total XP             1,250      │ │
│ │ Current Streak       7 days     │ │
│ │ Longest Streak      14 days     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [━━━━━━ Close ━━━━━━]               │
│                                     │
└─────────────────────────────────────┘
```

---

### Board 18: Quiz Start Alert (MOD-005)

**Board Size:** 393 x 852 px
**Position:** x=1050, y=5500 (Row 6, Column 1)

**Layout:**
```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ ░░░░┌───────────────────────┐░░░░░│
│ ░░░░│                       │░░░░░│
│ ░░░░│      Quick Quiz       │░░░░░│
│ ░░░░│                       │░░░░░│
│ ░░░░│ Start 10 questions    │░░░░░│
│ ░░░░│ quiz (5 min)?         │░░░░░│
│ ░░░░│                       │░░░░░│
│ ░░░░│ [Cancel] [Start Quiz] │░░░░░│
│ ░░░░│                       │░░░░░│
│ ░░░░└───────────────────────┘░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────┘
```

**Key Elements:**
1. Full-screen dimmed backdrop
2. Centered dialog card
3. Title, description, and 2 action buttons

---

## Phase 5: Execution Order

> **CRITICAL WORKFLOW**: Follow this EXACT order. NEVER skip steps. Assets MUST be created before components, and components before screens.

### Mandatory Execution Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: FOUNDATION (MUST COMPLETE FIRST)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Step 1.1: Create Project                                        │
│           └── "F&B Tycoon Mobile App"                           │
│                                                                 │
│ Step 1.2: Create "00-DesignSystem" Page                         │
│                                                                 │
│ Step 1.3: CREATE ALL COLOR ASSETS ← BLOCKING                    │
│           ├── 10 Light mode colors → Shared Library             │
│           └── 6 Dark mode colors → Shared Library               │
│           ⚠️ STOP: Verify all 16 colors exist before continuing │
│                                                                 │
│ Step 1.4: CREATE ALL TYPOGRAPHY STYLES ← BLOCKING               │
│           └── 7 Text styles → Shared Library                    │
│           ⚠️ STOP: Verify all 7 styles exist before continuing  │
│                                                                 │
│ Step 1.5: Document Spacing & Radius                             │
│           └── Create visual reference frame                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ CHECKPOINT: All assets created? → Proceed to Phase 2          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: COMPONENTS (MUST USE PHASE 1 ASSETS)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Step 2.1: Create "01-Components" Page                           │
│                                                                 │
│ Step 2.2: Create Base Components (using @assets)                │
│           ├── Card/Base        (uses @surface-primary, etc.)    │
│           ├── Button/Primary   (uses @brand-green-500, @Button) │
│           ├── Button/Secondary                                  │
│           ├── Progress Bar     (uses @brand-green-500)          │
│           ├── Tab Bar          (uses @surface-primary)          │
│           ├── Section Header   (uses @Caption, @text-muted)     │
│           └── Setting Item     (uses @Body/Primary, etc.)       │
│                                                                 │
│           ⚠️ EACH component MUST reference library assets       │
│           ⚠️ NO hardcoded hex colors allowed                    │
│           ⚠️ NO inline font settings allowed                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ CHECKPOINT: All components use assets? → Proceed to Phase 3   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: SCREEN BOARDS (MUST USE PHASE 2 COMPONENTS)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🤖 CRITICAL: Use Task tool with subagent for EACH screen        │
│ 📍 NOTE: All boards go on SAME PAGE (API limitation)            │
│                                                                 │
│ For EACH screen (delegated to subagent):                        │
│ 1. Create BOARD (not page) at correct X/Y position              │
│ 2. Use grid positions from Board Position Reference table       │
│ 3. Instance components from library (NOT copy/recreate)         │
│ 4. Apply typography styles to all text                          │
│ 5. Use color assets for all fills/strokes                       │
│ 6. Follow spacing tokens for all margins/padding                │
│ 7. Set board.clipContent = false                                │
│                                                                 │
│ Screen Board Order (with positions):                            │
│ ├── 01-Home-Dashboard      (x=600, y=100)                       │
│ ├── 02-Courses-LearningPaths (x=1050, y=100)                    │
│ ├── 03-Courses-LessonDetail  (x=1500, y=100)                    │
│ ├── 04-09 Lesson Player boards (Row 1-2)                        │
│ ├── 10-Practices-List      (x=600, y=2800)                      │
│ ├── 11-Practices-Results   (x=1050, y=2800)                     │
│ ├── 12-Settings-Main       (x=1500, y=2800)                     │
│ └── 13-Settings-Profile    (x=600, y=3700)                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ✓ CHECKPOINT: All boards positioned correctly? → Phase 4        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: MODAL BOARDS (MUST USE EXISTING ASSETS & COMPONENTS)   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🤖 CRITICAL: Use Task tool with subagent for EACH modal         │
│ 📍 NOTE: Modal boards also on SAME PAGE as screens              │
│                                                                 │
│ Modal Boards (with positions):                                  │
│ ├── 14-Modal-LessonsBottomSheet (x=600, y=4600)                 │
│ ├── 15-Modal-DailyGoal          (x=1050, y=4600)                │
│ ├── 16-Modal-ReminderTime       (x=1500, y=4600)                │
│ ├── 17-Modal-LearningStats      (x=600, y=5500)                 │
│ └── 18-Modal-QuizStartAlert     (x=1050, y=5500)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: REVIEW & VALIDATION                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Final Checklist:                                                │
│ □ All colors reference shared library (no hex codes in designs) │
│ □ All text uses typography styles (no inline fonts)             │
│ □ All components are library instances (no duplicates)          │
│ □ Spacing is consistent (uses token values)                     │
│ □ Dark mode variants use dm-* color assets                      │
│ □ All boards have correct naming convention                     │
│ □ All boards positioned correctly (no overlaps)                 │
│ □ All boards have clipContent = false                           │
│ □ Visual verification: export and check each board              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Reference: Asset Dependencies

```
BOARDS depend on → COMPONENTS depend on → ASSETS

Example chain:
  Home Dashboard Board (x=600, y=100)
    └── uses Card/Base component
          └── which uses @surface-primary color
                └── defined in shared library as #ffffff

If you change @surface-primary → all Cards update → all Boards update
This is WHY assets must be created FIRST!
```

### Quick Reference: Board Creation

```javascript
// Standard board creation pattern
const board = penpot.createBoard();
board.name = "01-Home-Dashboard";
board.x = 600;   // From position table
board.y = 100;   // From position table
board.resize(393, 852);  // iPhone 14 Pro
board.clipContent = false;  // CRITICAL!

// Position formula
x = 600 + (column * 450);  // 450 = 393 + 57px gap
y = 100 + (row * 900);     // 900 = 852 + 48px gap
```

---

## Penpot MCP Commands Reference

### Project Operations

```
# Create new project
penpot_create_project(name: "F&B Tycoon Mobile App")

# Create new page
penpot_create_page(project_id, name: "01-Home-Dashboard")
```

### Shape Operations

```
# Create rectangle (for cards, buttons)
penpot_create_rectangle(
  page_id,
  x, y, width, height,
  fill: "#ffffff",
  stroke: "#e1e8e4",
  radius: 12
)

# Create text
penpot_create_text(
  page_id,
  x, y,
  content: "F&B Tycoon",
  font_family: "Nunito",
  font_size: 24,
  fill: "#24332e"
)

# Create frame (for grouping)
penpot_create_frame(
  page_id,
  x, y, width, height,
  name: "Card-DailyStreak"
)
```

### Component Operations

```
# Create component from frame
penpot_create_component(frame_id, name: "Card/Base")

# Instance component
penpot_instance_component(component_id, page_id, x, y)
```

---

## Notes

### Design Considerations

1. **Mobile First**: All designs at 393x852px (iPhone 14 Pro)
2. **Safe Areas**: Account for notch (59px top) and home indicator (34px bottom)
3. **Tab Bar Height**: 83px including home indicator
4. **Touch Targets**: Minimum 44x44px for interactive elements
5. **Contrast**: WCAG AA minimum (4.5:1 for body text)

### File Organization

- **Board Naming**: Use `XX-SectionName` for boards (e.g., `01-Home-Dashboard`)
- **Board Grid**: Position boards using column/row grid to avoid overlaps
- **Element Naming**: Use `ComponentName/ElementType` pattern (e.g., `DailyStreakCard/Background`)
- **Grouping**: Group related elements with `penpot.group()`
- Use layers panel for organization
- Add notes/annotations for handoff

### Export Settings

- 1x, 2x, 3x for iOS assets
- PNG for icons and images
- SVG for vector graphics
- Use `export_shape` tool with board ID for visual verification

---

**Document Version:** 1.1
**Created:** 2025-12-27
**Updated:** 2025-12-28
**Status:** Ready for Implementation

**Changelog:**
- v1.1 (2025-12-28): Updated to board-based organization due to Penpot MCP API limitations (cannot access multiple pages). All screens now created as boards on single page with grid positioning.
