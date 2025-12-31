# Recommended Penpot Design Format

**Created:** 2025-12-29
**Purpose:** Define a declarative file format for generating Penpot designs programmatically
**Context:** Solving challenges with Penpot MCP's imperative API limitations

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Format Comparison](#format-comparison)
3. [Detailed Format Examples](#detailed-format-examples)
4. [Final Recommendation](#final-recommendation)
5. [Handling Multi-Line Text](#handling-multi-line-text)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Problem Statement

### Current Challenges with Penpot MCP

| Issue | Impact |
|-------|--------|
| Silent font fallback | Fonts specified may not be used |
| Cannot move shapes between pages | Organization requires manual work |
| Imperative positioning | Must calculate x, y, width, height manually |
| Z-order complexity | Children array index determines layering |
| No validation | Errors discovered only after execution |
| Visual verification required | Must take screenshots to confirm |

### Desired Solution

A **declarative format** that:
- Describes **layout intent** (left, center, fill) not pixels
- Supports **hierarchy** through indentation
- Enables **component reuse**
- Provides **validation** before execution
- Outputs to **Penpot API calls**

---

## Format Comparison

### Formats Evaluated

| Format | Type | Origin | Strengths |
|--------|------|--------|-----------|
| **Observable MD** | Markdown + JS | Observable | Reactive, full JS power |
| **Markdoc** | Markdown + Tags | Stripe | Schema validation, partials |
| **Pug.js** | Indentation-based | Pug | Concise, mixins, familiar |
| **Layout YAML** | Pure YAML | Custom | Simple, readable, portable |
| **Symbol DSL** | Custom syntax | Custom | Ultra-concise |
| **DTCG Tokens** | JSON/YAML | W3C | Standard for design tokens |

### Comparison Matrix

| Criteria | Observable | Markdoc | Pug | YAML | Symbol |
|----------|------------|---------|-----|------|--------|
| **Readability** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Conciseness** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Hierarchy** | Code blocks | Tags | Indentation | Indentation | Indentation |
| **Validation** | None | Built-in | None | Custom | None |
| **Components** | Functions | Partials | Mixins | Refs | None |
| **Logic** | Full JS | Functions | Full JS | None | None |
| **Parser** | Build custom | Official | Official | Many | Build custom |
| **Learning curve** | Medium | Medium | Low-Medium | Low | Medium |
| **IDE support** | Medium | Good | Excellent | Excellent | None |

---

## Detailed Format Examples

The following examples all describe the same screen (Home Dashboard):

![Home Dashboard Screenshot](./home-dashboard-reference.png)

### Screen Structure Analysis

```
┌─────────────────────────────────────┐
│ Status Bar (system)                 │
│ Dynamic Island                      │
├─────────────────────────────────────┤
│ Header: "Home" + theme toggle       │
├─────────────────────────────────────┤
│ Title: "F&B Tycoon"                 │
│ Subtitle: "Project Management..."   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Daily Streak Card               │ │
│ │ 🔥 | Title + Subtitle | 5 days  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Continue Learning Card          │ │
│ │ Title                           │ │
│ │ Icon | Lesson info              │ │
│ │ Progress bar              65%   │ │
│ │                      Continue → │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Today's Goal Card               │ │
│ │ Title + Subtitle                │ │
│ │ ✓  2  3  4  5  (circles)        │ │
│ │ "1 of 5 completed"              │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Quick Actions (title)               │
│ ┌───────────┐ ┌───────────┐         │
│ │ Practice  │ │ Mock Exam │         │
│ └───────────┘ └───────────┘         │
├─────────────────────────────────────┤
│ Tab Bar: Home | Courses | ... | ... │
│ Home Indicator                      │
└─────────────────────────────────────┘
```

---

### Format 1: Observable-Inspired Markdown

```markdown
---
id: home-dashboard
name: "01-Home-Dashboard"
size: [393, 852]
page: screens
imports:
  - tokens: ./tokens.yaml
  - components: ./components.yaml
---

# Home Dashboard

Main landing screen after user login.

## Status Bar & Header

```js
const header = {
  type: 'row',
  padding: [0, 24],
  height: 44,
  children: [
    { type: 'spacer' },
    { type: 'text', content: 'Home', typography: tokens.typo.navTitle },
    { type: 'spacer' },
    { type: 'icon', name: 'moon', align: 'right' }
  ]
};
display(header);
```

## App Title

```js
display({
  type: 'column',
  align: 'center',
  gap: 4,
  children: [
    { type: 'text', content: 'F&B Tycoon', typography: tokens.typo.appTitle, color: tokens.color.accent },
    { type: 'text', content: 'Project Management Tycoon', typography: tokens.typo.subtitle, color: tokens.color.muted }
  ]
});
```

## Daily Streak Card

```js
display(components.card({
  children: [
    { type: 'row', gap: 12, alignY: 'center', children: [
      { type: 'icon', name: 'flame', size: 48, background: tokens.color.accentLight },
      { type: 'column', fill: true, children: [
        { type: 'text', content: 'Daily Streak', typography: tokens.typo.cardTitle },
        { type: 'text', content: 'Keep learning every day!', typography: tokens.typo.cardSubtitle }
      ]},
      { type: 'column', align: 'right', children: [
        { type: 'text', content: '5', typography: tokens.typo.statNumber, color: tokens.color.accent },
        { type: 'text', content: 'days', typography: tokens.typo.statLabel }
      ]}
    ]}
  ]
}));
```

## Continue Learning Card

```js
const lesson = {
  code: 'B1L5',
  title: 'Managing Difficult Stakeholders',
  domain: 'People Domain',
  progress: 65
};

display(components.card({
  children: [
    { type: 'text', content: 'Continue Learning', typography: tokens.typo.cardTitle },
    { type: 'row', gap: 12, marginTop: 12, children: [
      { type: 'icon', name: 'users', size: 44, background: tokens.color.accentLight },
      { type: 'column', fill: true, children: [
        { type: 'text', content: `${lesson.code}: ${lesson.title}`, typography: tokens.typo.lessonTitle },
        { type: 'text', content: lesson.domain, typography: tokens.typo.lessonSubtitle }
      ]}
    ]},
    { type: 'row', marginTop: 12, children: [
      { type: 'text', content: 'Progress', typography: tokens.typo.label },
      { type: 'spacer' },
      { type: 'text', content: `${lesson.progress}%`, typography: tokens.typo.label, color: tokens.color.accent }
    ]},
    { type: 'progress-bar', value: lesson.progress, color: tokens.color.accent },
    { type: 'row', marginTop: 8, children: [
      { type: 'spacer' },
      { type: 'button', variant: 'text', label: 'Continue', icon: 'arrow-right' }
    ]}
  ]
}));
```

## Quick Actions

```js
const actions = [
  { icon: 'play', label: 'Practice Quiz', color: tokens.color.success },
  { icon: 'target', label: 'Mock Exam', color: tokens.color.accent }
];

display({
  type: 'column',
  gap: 16,
  children: [
    { type: 'text', content: 'Quick Actions', typography: tokens.typo.sectionTitle },
    { type: 'row', gap: 12, children: actions.map(action =>
      components.actionCard(action)
    )}
  ]
});
```

## Tab Bar

```js
display(components.tabBar({
  tabs: ['Home', 'Courses', 'Practices', 'Settings'],
  active: 'Home',
  icons: ['home', 'book', 'edit', 'settings']
}));
```
```

**Pros:** Full JavaScript power, reactive, computable
**Cons:** Verbose, requires JS knowledge, no validation

---

### Format 2: Markdoc

```markdown
---
id: home-dashboard
name: "01-Home-Dashboard"
size: [393, 852]
---

# Home Dashboard

{% screen background=$color.background %}

{% status-bar /%}
{% dynamic-island /%}

{% #header %}
{% row padding=[0, 24] height=44 %}
  {% spacer /%}
  {% text typography=$typo.navTitle %}Home{% /text %}
  {% spacer /%}
  {% icon name="moon" align="right" /%}
{% /row %}
{% /header %}

{% #app-title %}
{% column align="center" gap=4 padding=[16, 0] %}
  {% text typography=$typo.appTitle color=$color.accent %}F&B Tycoon{% /text %}
  {% text typography=$typo.subtitle color=$color.muted %}Project Management Tycoon{% /text %}
{% /column %}
{% /app-title %}

{% #content %}
{% column padding=[0, 24] gap=16 %}

  {% #daily-streak %}
  {% card %}
    {% row gap=12 alignY="center" %}
      {% icon-badge name="flame" background=$color.accentLight /%}
      {% column fill=true %}
        {% text typography=$typo.cardTitle %}Daily Streak{% /text %}
        {% text typography=$typo.cardSubtitle %}Keep learning every day!{% /text %}
      {% /column %}
      {% column align="right" %}
        {% text typography=$typo.statNumber color=$color.accent %}5{% /text %}
        {% text typography=$typo.statLabel %}days{% /text %}
      {% /column %}
    {% /row %}
  {% /card %}
  {% /daily-streak %}

  {% #continue-learning %}
  {% card %}
    {% text typography=$typo.cardTitle %}Continue Learning{% /text %}

    {% row gap=12 marginTop=12 %}
      {% icon-badge name="users" background=$color.accentLight /%}
      {% column fill=true %}
        {% text typography=$typo.lessonTitle %}B1L5: Managing Difficult Stakeholders{% /text %}
        {% text typography=$typo.lessonSubtitle %}People Domain{% /text %}
      {% /column %}
    {% /row %}

    {% row marginTop=12 %}
      {% text typography=$typo.label %}Progress{% /text %}
      {% spacer /%}
      {% text typography=$typo.label color=$color.accent %}65%{% /text %}
    {% /row %}

    {% progress-bar value=65 color=$color.accent /%}

    {% row marginTop=8 %}
      {% spacer /%}
      {% button variant="text" %}Continue →{% /button %}
    {% /row %}
  {% /card %}
  {% /continue-learning %}

  {% #todays-goal %}
  {% card %}
    {% text typography=$typo.cardTitle %}Today's Goal{% /text %}
    {% text typography=$typo.cardSubtitle %}Complete 5 lessons to reach your daily target{% /text %}

    {% row gap=8 marginTop=16 align="center" %}
      {% goal-circle completed=true %}1{% /goal-circle %}
      {% goal-circle %}2{% /goal-circle %}
      {% goal-circle %}3{% /goal-circle %}
      {% goal-circle %}4{% /goal-circle %}
      {% goal-circle %}5{% /goal-circle %}
    {% /row %}

    {% text align="center" typography=$typo.caption marginTop=8 %}1 of 5 completed{% /text %}
  {% /card %}
  {% /todays-goal %}

  {% #quick-actions %}
  {% text typography=$typo.sectionTitle %}Quick Actions{% /text %}

  {% row gap=12 marginTop=12 %}
    {% action-card icon="play" color=$color.success %}Practice Quiz{% /action-card %}
    {% action-card icon="target" color=$color.accent %}Mock Exam{% /action-card %}
  {% /row %}
  {% /quick-actions %}

{% /column %}
{% /content %}

{% tab-bar active="Home" /%}
{% home-indicator /%}

{% /screen %}
```

**Pros:** Schema validation, clear structure, good error messages
**Cons:** Verbose closing tags, limited logic

---

### Format 3: Pug.js (Recommended)

```pug
//- home-dashboard.pug
//- Home Dashboard - Main landing screen

//- Import tokens and mixins
include ../tokens
include ../mixins/components

//- Screen definition
screen#home-dashboard(width=393 height=852 background=$.bg)

  //- System UI
  +status-bar
  +dynamic-island

  //- Header
  .header.row(padding="0,24" height=44)
    .spacer
    text.nav-title Home
    .spacer
    icon.right(name="moon")

  //- App branding
  .branding.column.center(gap=4 padding="16,0")
    text.app-title(color=$.accent) F&B Tycoon
    text.subtitle(color=$.muted) Project Management Tycoon

  //- Main content
  .content.column(padding="0,24" gap=16)

    //- Daily Streak Card
    +card#daily-streak
      .row(gap=12 align-y=center)
        +icon-badge("flame" $.accentLight)
        .column.fill
          text.card-title Daily Streak
          text.card-subtitle Keep learning every day!
        .column.right
          text.stat-number(color=$.accent) 5
          text.stat-label days

    //- Continue Learning Card
    +card#continue-learning
      text.card-title Continue Learning

      .row(gap=12 margin-top=12)
        +icon-badge("users" $.accentLight)
        .column.fill
          text.lesson-title B1L5: Managing Difficult Stakeholders
          text.lesson-subtitle People Domain

      .row(margin-top=12)
        text.label Progress
        .spacer
        text.label(color=$.accent) 65%

      +progress-bar(65 $.accent)

      .row(margin-top=8)
        .spacer
        +text-button("Continue →")

    //- Today's Goal Card
    +card#todays-goal
      text.card-title Today's Goal
      text.card-subtitle Complete 5 lessons to reach your daily target

      .row.center(gap=8 margin-top=16)
        +goal-circle(1 true)
        +goal-circle(2)
        +goal-circle(3)
        +goal-circle(4)
        +goal-circle(5)

      text.caption.center(margin-top=8) 1 of 5 completed

    //- Quick Actions
    .section#quick-actions
      text.section-title Quick Actions

      .row(gap=12 margin-top=12)
        +action-card("play" "Practice Quiz" $.success)
        +action-card("target" "Mock Exam" $.accent)

  //- Tab bar
  +tab-bar("Home")

  //- Home indicator
  +home-indicator


//- ============================================
//- MIXINS (in mixins/components.pug)
//- ============================================

mixin card
  .card(padding=16 radius=16 background=$.surface)
    block

mixin icon-badge(name, bgColor)
  .icon-badge(size=48 radius=12 background=bgColor)
    icon(name=name size=24)

mixin progress-bar(value, color)
  .progress-bar(height=8 radius=4 background=$.progressBg)
    .progress-fill(width=`${value}%` background=color radius=4)

mixin goal-circle(num, completed)
  if completed
    .goal-circle.completed(size=44 radius=22 background=$.success)
      icon(name="check" color=$.white)
  else
    .goal-circle(size=44 radius=22 border="2,$.border")
      text.goal-number= num

mixin action-card(icon, label, color)
  .action-card.column.center(padding=20 radius=16 background=$.surface fill)
    .icon-circle(size=56 radius=28 background=color+"Light")
      icon(name=icon color=color)
    text.action-label(margin-top=12)= label

mixin text-button(label)
  .text-button.row(gap=4)
    text.button-text(color=$.accent)= label

mixin tab-bar(active)
  .tab-bar.row.space-around(padding="12,0" background=$.surface)
    +tab-item("home" "Home" active === "Home")
    +tab-item("book" "Courses" active === "Courses")
    +tab-item("edit" "Practices" active === "Practices")
    +tab-item("settings" "Settings" active === "Settings")

mixin tab-item(icon, label, isActive)
  .tab-item.column.center(gap=4)
    icon(name=icon color=isActive ? $.accent : $.muted)
    text.tab-label(color=isActive ? $.accent : $.muted)= label
```

**Pros:** Concise, mixins for reuse, familiar syntax, good IDE support
**Cons:** No built-in validation, whitespace sensitive

---

### Format 4: Layout YAML

```yaml
# home-dashboard.yaml
# Home Dashboard - Main landing screen

meta:
  id: home-dashboard
  name: "01-Home-Dashboard"
  size: [393, 852]
  page: screens

tokens: ./tokens.yaml
components: ./components.yaml

screen:
  background: $color.background

  children:
    # System UI
    - status-bar:
    - dynamic-island:

    # Header
    - header:
        layout: row
        padding: [0, 24]
        height: 44
        children:
          - spacer:
          - text: "Home"
            typography: $typo.navTitle
          - spacer:
          - icon: moon
            align: right

    # App branding
    - branding:
        layout: column
        align: center
        gap: 4
        padding: [16, 0]
        children:
          - text: "F&B Tycoon"
            typography: $typo.appTitle
            color: $color.accent
          - text: "Project Management Tycoon"
            typography: $typo.subtitle
            color: $color.muted

    # Content
    - content:
        layout: column
        padding: [0, 24]
        gap: 16
        children:

          # Daily Streak
          - card:
              id: daily-streak
              children:
                - row:
                    gap: 12
                    align-y: center
                    children:
                      - icon-badge:
                          icon: flame
                          background: $color.accentLight
                      - column:
                          fill: true
                          children:
                            - text: "Daily Streak"
                              typography: $typo.cardTitle
                            - text: "Keep learning every day!"
                              typography: $typo.cardSubtitle
                      - column:
                          align: right
                          children:
                            - text: "5"
                              typography: $typo.statNumber
                              color: $color.accent
                            - text: "days"
                              typography: $typo.statLabel

          # Continue Learning
          - card:
              id: continue-learning
              children:
                - text: "Continue Learning"
                  typography: $typo.cardTitle

                - row:
                    gap: 12
                    margin-top: 12
                    children:
                      - icon-badge:
                          icon: users
                          background: $color.accentLight
                      - column:
                          fill: true
                          children:
                            - text: "B1L5: Managing Difficult Stakeholders"
                              typography: $typo.lessonTitle
                            - text: "People Domain"
                              typography: $typo.lessonSubtitle

                - row:
                    margin-top: 12
                    children:
                      - text: "Progress"
                        typography: $typo.label
                      - spacer:
                      - text: "65%"
                        typography: $typo.label
                        color: $color.accent

                - progress-bar:
                    value: 65
                    color: $color.accent

                - row:
                    margin-top: 8
                    children:
                      - spacer:
                      - button:
                          variant: text
                          label: "Continue →"

          # Today's Goal
          - card:
              id: todays-goal
              children:
                - text: "Today's Goal"
                  typography: $typo.cardTitle
                - text: "Complete 5 lessons to reach your daily target"
                  typography: $typo.cardSubtitle

                - row:
                    align: center
                    gap: 8
                    margin-top: 16
                    children:
                      - goal-circle: { number: 1, completed: true }
                      - goal-circle: { number: 2 }
                      - goal-circle: { number: 3 }
                      - goal-circle: { number: 4 }
                      - goal-circle: { number: 5 }

                - text: "1 of 5 completed"
                  typography: $typo.caption
                  align: center
                  margin-top: 8

          # Quick Actions
          - section:
              id: quick-actions
              children:
                - text: "Quick Actions"
                  typography: $typo.sectionTitle

                - row:
                    gap: 12
                    margin-top: 12
                    children:
                      - action-card:
                          icon: play
                          label: "Practice Quiz"
                          color: $color.success
                      - action-card:
                          icon: target
                          label: "Mock Exam"
                          color: $color.accent

    # Tab bar
    - tab-bar:
        active: Home

    # Home indicator
    - home-indicator:
```

**Pros:** Familiar YAML syntax, no new syntax to learn, portable
**Cons:** Verbose for complex UIs, deeply nested, no logic

---

### Format 5: Symbol DSL (Ultra-Concise)

```
# home-dashboard.ui
# Home Dashboard

screen home-dashboard [393x852]

+status-bar
+dynamic-island

- header [h:44 px:24]
  .spacer
  -- "Home" @navTitle
  .spacer
  -> moon

| branding [center gap:4 py:16]
  -- "F&B Tycoon" @appTitle $accent
  -- "Project Management Tycoon" @subtitle $muted

| content [px:24 gap:16]

  +card #daily-streak
    - [gap:12 ^center]
      <- +icon-badge flame $accentLight
      | [fill]
        <- "Daily Streak" @cardTitle
        <- "Keep learning every day!" @cardSubtitle
      | [right]
        -> "5" @statNumber $accent
        -> "days" @statLabel

  +card #continue-learning
    <- "Continue Learning" @cardTitle
    - [gap:12 mt:12]
      <- +icon-badge users $accentLight
      | [fill]
        <- "B1L5: Managing Difficult Stakeholders" @lessonTitle
        <- "People Domain" @lessonSubtitle
    - [mt:12]
      <- "Progress" @label
      .spacer
      -> "65%" @label $accent
    +progress-bar [65% $accent]
    - [mt:8]
      .spacer
      +text-button "Continue →"

  +card #todays-goal
    <- "Today's Goal" @cardTitle
    <- "Complete 5 lessons to reach your daily target" @cardSubtitle
    - [center gap:8 mt:16]
      +goal ✓
      +goal 2
      +goal 3
      +goal 4
      +goal 5
    -- "1 of 5 completed" @caption [mt:8]

  | #quick-actions
    <- "Quick Actions" @sectionTitle
    - [gap:12 mt:12]
      +action-card play "Practice Quiz" $success
      +action-card target "Mock Exam" $accent

+tab-bar Home
+home-indicator
```

**Legend:**
- `|` = column, `-` = row
- `<-` = left, `->` = right, `--` = center
- `@style` = typography reference
- `$color` = color reference
- `+component` = component usage
- `[props]` = attributes

**Pros:** Extremely concise, fast to write
**Cons:** New syntax to learn, no existing tooling, hard to read for complex UIs

---

## Final Recommendation

### Primary: Pug.js Syntax

After evaluating all formats, **Pug.js** is recommended as the primary format for the following reasons:

| Factor | Reasoning |
|--------|-----------|
| **Conciseness** | 40-50% less verbose than Markdoc/YAML |
| **Familiarity** | Similar to HTML, known by web developers |
| **Mixins** | Perfect for reusable components |
| **Hierarchy** | Indentation matches visual hierarchy |
| **Tooling** | Existing parser, VS Code highlighting |
| **Logic** | Full JavaScript when needed |
| **Adoption** | Lower learning curve than custom DSL |

### Secondary: Layout YAML

Use **Layout YAML** for:
- Design tokens (`tokens.yaml`)
- Component definitions (`components.yaml`)
- Data/content files
- Configuration

### Architecture

```
design/
├── tokens.yaml              # Design tokens (colors, typography, spacing)
├── components.yaml          # Component schemas
├── mixins/
│   ├── card.pug            # Card mixin
│   ├── button.pug          # Button mixin
│   └── layout.pug          # Layout helpers
├── layouts/
│   ├── base-screen.pug     # Base screen template
│   └── lesson-screen.pug   # Lesson screen template
├── screens/
│   ├── home.pug            # Home dashboard
│   ├── courses.pug         # Courses list
│   ├── quiz.pug            # Quiz screen
│   └── settings.pug        # Settings screen
└── data/
    ├── lessons.yaml        # Lesson content
    └── quiz-questions.yaml # Quiz data
```

### Compiler Pipeline

```
┌─────────────────────────────────────────────────────┐
│  screens/home.pug                                   │
│  + mixins/*.pug                                     │
│  + tokens.yaml                                      │
└────────────────┬────────────────────────────────────┘
                 │ pug-lexer + pug-parser
                 ▼
┌─────────────────────────────────────────────────────┐
│  Pug AST                                            │
│  Validate: required attrs, valid refs              │
└────────────────┬────────────────────────────────────┘
                 │ transform (custom)
                 ▼
┌─────────────────────────────────────────────────────┐
│  Layout Tree                                        │
│  { type: 'column', align: 'center', children: [] }  │
└────────────────┬────────────────────────────────────┘
                 │ yoga/taffy layout engine
                 ▼
┌─────────────────────────────────────────────────────┐
│  Positioned Elements                                │
│  { type: 'text', x: 25, y: 140, width: 343 }        │
└────────────────┬────────────────────────────────────┘
                 │ penpot renderer
                 ▼
┌─────────────────────────────────────────────────────┐
│  Penpot API / JSON Export                           │
└─────────────────────────────────────────────────────┘
```

---

## Handling Multi-Line Text

Pug.js has limitations with multi-line text content. Here are the recommended patterns:

### The Problem

```pug
//- ❌ Awkward: Long inline text
text Carlos Mendez, the General Manager, has given you three weeks to coordinate between the kitchen, front-of-house, and marketing teams.

//- ❌ Also awkward: Piped text on multiple lines
text
  | Carlos Mendez, the General Manager, has
  | given you three weeks to coordinate between
  | the kitchen, front-of-house, and marketing teams.
```

### Solution 1: Block Text (`.` suffix) - Short Content

Best for 1-3 lines of text within the layout file.

```pug
//- ✅ Built-in Pug feature - add period after tag/attributes
text.body.
  Carlos Mendez, the General Manager, has given you
  three weeks to coordinate between the kitchen,
  front-of-house, and marketing teams.

//- With attributes
text(typography=$.body color=$.muted).
  Carlos Mendez, the General Manager, has given you
  three weeks to coordinate between the kitchen,
  front-of-house, and marketing teams.

//- Card subtitle example
+card
  text.title Today's Goal
  text.subtitle.
    Complete 5 lessons to reach your daily target
```

**Pros:** Native Pug syntax, no extra files
**Cons:** Indentation sensitive, whitespace preserved literally

### Solution 2: Template Literals - Dynamic Content

Best for computed or interpolated text.

```pug
//- Using JavaScript template literals
- const questionContext = `Carlos Mendez, the General Manager, has given you three weeks to coordinate between the kitchen, front-of-house, and marketing teams.`

text(content=questionContext typography=$.body)

//- With interpolation
- const manager = "Carlos Mendez"
- const weeks = 3
text(typography=$.body content=`${manager}, the General Manager, has given you ${weeks} weeks to coordinate.`)

//- Conditional text
- const message = streak > 7 ? "Amazing streak! Keep it up!" : "Keep learning every day!"
text.subtitle= message
```

**Pros:** Full JavaScript power, dynamic content
**Cons:** Verbose for simple static text

### Solution 3: Data Separation (Recommended for Content-Heavy Screens)

Best for screens with substantial text content (quizzes, lessons, articles).

**content/quiz-questions.yaml:**
```yaml
stakeholder-question:
  id: q1
  title: "Who should be your FIRST priority stakeholder to engage?"
  context: |
    Carlos Mendez, the General Manager, has given you
    three weeks to coordinate between the kitchen,
    front-of-house, and marketing teams.
  options:
    - letter: A
      text: "The kitchen staff who will prepare the new dishes"
      correct: false
    - letter: B
      text: "The front-of-house team who will serve customers"
      correct: false
    - letter: C
      text: "The marketing team who will promote the new menu"
      correct: true
    - letter: D
      text: "The suppliers who will provide ingredients"
      correct: false
```

**screens/quiz.pug:**
```pug
//- Clean layout, content from YAML
- const q = data.question
- const selected = data.selected || null

screen#quiz-question

  +dynamic-island

  .content.column(padding="100,24,120,24" gap=24)

    //- Question - text comes from YAML
    .question.column(gap=16)
      text.heading= q.title
      text.body.muted= q.context

    //- Options - loop through YAML data
    .options.column(gap=12)
      each opt in q.options
        +answer-option(opt.letter, opt.text, opt.letter === selected)

  .bottom
    +button-primary("Check")

  +home-indicator
```

**Pros:**
- Clean separation of content and layout
- Content editable without touching layout code
- Easy to localize (swap YAML files per language)
- Content can be managed by non-developers
- YAML's `|` syntax handles multi-line naturally

**Cons:** Extra file, indirection

### Solution 4: Hybrid Front-matter (Self-Contained Screens)

Best for single screens that need embedded content.

```pug
//- quiz-screen.pug
//- Front-matter at top, layout below
---
content:
  title: "Who should be your FIRST priority stakeholder to engage?"
  context: |
    Carlos Mendez, the General Manager, has given you
    three weeks to coordinate between the kitchen,
    front-of-house, and marketing teams.
  options:
    - { letter: A, text: "The kitchen staff who will prepare the new dishes" }
    - { letter: B, text: "The front-of-house team who will serve customers" }
    - { letter: C, text: "The marketing team who will promote the new menu" }
    - { letter: D, text: "The suppliers who will provide ingredients" }
---

screen#quiz-question
  .question-section
    text.heading= content.title
    text.body= content.context

  .options
    each opt in content.options
      +answer-option(opt.letter, opt.text)

  +button-primary("Check")
```

**Pros:** Single file, content at top for easy editing
**Cons:** Requires custom parser to extract front-matter

### Recommended Pattern by Use Case

| Content Type | Recommended Solution | Example |
|--------------|---------------------|---------|
| **Short labels** | Inline | `text.label Progress` |
| **1-2 line descriptions** | Block text (`.`) | `text.subtitle.`<br>`  Keep learning every day!` |
| **Dynamic/computed** | Template literal | `text= \`${count} items\`` |
| **Quiz questions** | Data separation | YAML file + reference |
| **Lesson content** | Data separation | YAML/Markdown files |
| **UI microcopy** | Block text or data | Depends on localization needs |

### File Structure for Content-Heavy Apps

```
design/
├── screens/
│   ├── quiz.pug              # Layout only
│   ├── lesson.pug            # Layout only
│   └── home.pug              # Layout + short text
├── content/
│   ├── quiz-questions.yaml   # Quiz content
│   ├── lessons/
│   │   ├── B1L1.yaml         # Lesson 1 content
│   │   ├── B1L2.yaml         # Lesson 2 content
│   │   └── ...
│   └── ui-strings.yaml       # Shared UI text
├── tokens.yaml
└── mixins/
    └── components.pug
```

### Quick Reference

```pug
//- MULTI-LINE TEXT PATTERNS CHEATSHEET

//- Pattern 1: Short text (1-2 lines) - Block text
text.subtitle.
  Keep learning every day to maintain your streak!

//- Pattern 2: With attributes - Block text
text(typography=$.body color=$.muted).
  This is a longer description that spans
  multiple lines in the source file.

//- Pattern 3: Dynamic content - Template literal
- const progress = 65
text.label= `Progress: ${progress}%`

//- Pattern 4: Content from data file - Reference
text.body= data.question.context

//- Pattern 5: Conditional text - JavaScript
if user.isPremium
  text.badge Premium Member
else
  text.link Upgrade Now

//- Pattern 6: Loop with text - Each
each tip in tips
  .tip-card
    text.tip-title= tip.title
    text.tip-body= tip.description
```

---

## Implementation Roadmap

### Phase 1: Core Parser (Week 1-2)

- [ ] Fork pug-lexer/pug-parser for custom tags
- [ ] Define tag schema (screen, row, column, text, icon, etc.)
- [ ] Implement token/variable resolution (`$color.accent`)
- [ ] Basic validation (required attributes, valid refs)

### Phase 2: Layout Engine (Week 2-3)

- [ ] Integrate Yoga or Taffy for flexbox calculations
- [ ] Map Pug classes to layout properties (`.left` → `alignSelf: flex-start`)
- [ ] Support `fill`, `gap`, `padding`, `margin`
- [ ] Handle text measurement for auto-sizing

### Phase 3: Mixin System (Week 3-4)

- [ ] Parse mixin definitions
- [ ] Expand mixin calls with arguments
- [ ] Support block content in mixins
- [ ] Create standard component library

### Phase 4: Penpot Renderer (Week 4-5)

- [ ] Generate Penpot shape tree from positioned elements
- [ ] Handle text (fonts, wrapping, typography refs)
- [ ] Handle icons (SVG embedding or library refs)
- [ ] Handle images (URL refs, size constraints)
- [ ] Output to Penpot MCP API or JSON export

### Phase 5: Tooling (Week 5-6)

- [ ] VS Code extension for syntax highlighting
- [ ] Live preview (watch mode)
- [ ] Validation errors with line numbers
- [ ] Diff mode (compare .pug to current Penpot state)

---

## Appendix: Design Tokens Format

```yaml
# tokens.yaml
# F&B Tycoon Design Tokens

color:
  # Backgrounds
  background:
    $value: "oklch(0.965 0.012 75)"
    $description: "Warm cream background"
  surface:
    $value: "oklch(0.98 0.008 75)"
    $description: "Card surface"

  # Brand
  accent:
    $value: "oklch(0.68 0.145 55)"
    $description: "Copper amber accent"
  accentLight:
    $value: "oklch(0.92 0.04 55)"
    $description: "Light accent for backgrounds"

  # Semantic
  success:
    $value: "oklch(0.62 0.14 160)"
    $description: "Herb green for success"
  muted:
    $value: "oklch(0.55 0.02 75)"
    $description: "Muted text"

  # UI
  black:
    $value: "#000000"
  white:
    $value: "#FFFFFF"
  border:
    $value: "oklch(0.85 0.01 75)"

typography:
  appTitle:
    fontFamily: "Nunito"
    fontSize: 32
    fontWeight: 700
    lineHeight: 1.2

  navTitle:
    fontFamily: "Nunito"
    fontSize: 17
    fontWeight: 600
    lineHeight: 1.3

  cardTitle:
    fontFamily: "Nunito"
    fontSize: 18
    fontWeight: 700
    lineHeight: 1.3

  cardSubtitle:
    fontFamily: "Nunito"
    fontSize: 14
    fontWeight: 400
    lineHeight: 1.4

  statNumber:
    fontFamily: "Nunito"
    fontSize: 28
    fontWeight: 700
    lineHeight: 1.1

  label:
    fontFamily: "Nunito"
    fontSize: 14
    fontWeight: 500
    lineHeight: 1.3

spacing:
  xs: 4
  sm: 8
  md: 12
  lg: 16
  xl: 24
  xxl: 32

radius:
  sm: 8
  md: 12
  lg: 16
  full: 9999
```

---

## Appendix: Complete Pug Example with All Features

```pug
//- screens/home.pug
//- Complete Home Dashboard implementation

//- Configuration
- const $ = require('../tokens')
- const data = require('../data/home')

//- Include mixins
include ../mixins/system-ui
include ../mixins/components
include ../mixins/cards

//- Extend base layout
extends ../layouts/base-screen

//- Screen metadata
block meta
  - const screenId = 'home-dashboard'
  - const screenName = '01-Home-Dashboard'

//- Screen content
block content

  //- Header
  +header("Home")
    +theme-toggle

  //- App branding
  .branding.column.center(gap=$.spacing.xs padding-y=$.spacing.lg)
    text(typography=$.typo.appTitle color=$.color.accent) F&B Tycoon
    text(typography=$.typo.subtitle color=$.color.muted) Project Management Tycoon

  //- Main content
  .content.column(padding-x=$.spacing.xl gap=$.spacing.lg)

    //- Daily streak
    +streak-card(data.streak)

    //- Continue learning
    +continue-card(data.currentLesson)

    //- Today's goal
    +goal-card(data.dailyGoal)

    //- Quick actions
    section.quick-actions
      text(typography=$.typo.sectionTitle) Quick Actions
      .row(gap=$.spacing.md margin-top=$.spacing.md)
        each action in data.quickActions
          +action-card(action)

//- Tab bar slot
block footer
  +tab-bar("Home")
```

---

*Document created as part of Penpot DSL research for F&B Tycoon app.*
