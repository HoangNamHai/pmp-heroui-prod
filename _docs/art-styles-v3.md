# F&B Tycoon Design System v1.0

**Production-ready design tokens and guidelines for F&B Tycoon / PMP learning app**

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
  - [Core Principle](#core-principle)
  - [Color Strategy](#color-strategy)
- [Color Tokens](#color-tokens)
  - [Light Mode](#light-mode)
    - [Backgrounds](#backgrounds)
    - [Surfaces](#surfaces)
    - [Brand Colors](#brand-colors)
    - [Accent Colors](#accent-colors)
    - [Status Colors](#status-colors)
    - [Text Colors](#text-colors)
    - [Borders](#borders)
  - [Dark Mode](#dark-mode)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Guidelines](#component-guidelines)
  - [Buttons](#buttons)
  - [Cards](#cards)
  - [Navigation](#navigation)
  - [Icons](#icons)
- [Background Art](#background-art)
- [Visual Hierarchy](#visual-hierarchy)
- [Design Rules](#design-rules-non-negotiable)
- [Figma Implementation](#figma-implementation)
- [Accessibility](#accessibility)
- [Scalability](#scalability)

---

## Design Philosophy

### Core Principle

> **Emotion creates safety. Clarity creates learning.**

**Visual Identity:**
- Ghibli-inspired calm watercolor aesthetics
- Adult credibility (not childish, not corporate)
- Clear decision & feedback signaling
- Narrative world + clean system UI

### Color Strategy

> **Cool pastels = thinking & story**
> **warm colors = action, reward, consequence**

**Key Rules:**
- World/story backgrounds use watercolor pastels
- System UI stays clean and readable
- Text always sits on surface, not raw background
- Accent colors signal specific meaning
- One font = trust (Nunito throughout)

---

## Color Tokens

### Light Mode

#### Backgrounds
```css
--bg-primary: #f3f6ef;      /* warm off-white paper */
--bg-secondary: #e8f1ec;    /* pastel green wash */
--bg-tertiary: #e6eef6;     /* pastel blue wash */
```

**Usage:** App background, story scenes, maps, reading screens

#### Surfaces
```css
--surface-primary: #ffffff;     /* main card */
--surface-secondary: #f7faf8;   /* nested card */
--surface-muted: #eef4f1;       /* disabled/inactive */
```

**Usage:** Lesson cards, decision panels, dialog boxes, modals

#### Brand Colors

**Green (Stability, Learning)**
```css
--brand-green-100: #ddece4;
--brand-green-300: #9bc7b0;
--brand-green-500: #4e8f76;     /* main */
```
**Usage:** Progress indicators, safe actions, confirmations

**Blue (Clarity, Reasoning)**
```css
--brand-blue-100: #e3ecf7;
--brand-blue-300: #9fb7d9;
--brand-blue-500: #4a6fa5;      /* main */
```
**Usage:** Info panels, explanations, secondary CTAs, maps

#### Accent Colors

**Yellow (Reward, Attention)**
```css
--accent-yellow-100: #fff2cc;
--accent-yellow-400: #f6c453;
--accent-yellow-600: #e0a800;
```
**Usage:** XP gain, highlights, celebration (icons/badges only, never large areas)

**Orange (Urgency, Trade-off)**
```css
--accent-orange-100: #ffe3d6;
--accent-orange-400: #f39c6b;
--accent-orange-600: #d97745;
```
**Usage:** Time pressure, warnings, risk decisions

#### Status Colors
```css
--status-success: #4e8f76;    /* reuse green-500 */
--status-warning: #f39c6b;    /* orange */
--status-error: #c84c4c;      /* muted red - teaches, not punishes */
```

#### Text Colors
```css
--text-primary: #24332e;      /* main text - never pure black */
--text-secondary: #5f6f68;    /* descriptions */
--text-muted: #8a9a92;        /* hints */
--text-inverse: #ffffff;
```

#### Borders
```css
--border-light: #e1e8e4;
--border-default: #cbd7d1;
--border-focus: #4a6fa5;      /* blue-500 */
```

---

### Dark Mode

> **Invert brightness, not emotion**
> Dark mode is a calm, low-energy workspace—not a gaming UI

**Principles:**
- Reduce eye strain
- Preserve emotional warmth
- Avoid neon/gamer aesthetics
- Soft, matte, atmospheric

#### Backgrounds
```css
--dm-bg-primary: #121916;       /* deep green-charcoal */
--dm-bg-secondary: #1a2320;     /* card canvas */
--dm-bg-tertiary: #1c2430;      /* blue-toned reasoning */
```

#### Surfaces
```css
--dm-surface-primary: #1f2a26;
--dm-surface-secondary: #25322e;
--dm-surface-muted: #2b3a35;
```

#### Brand Colors (Adjusted for Dark)
```css
--dm-brand-green-500: #6fb79a;  /* softened */
--dm-brand-blue-500: #7fa2d6;
```

#### Accents
```css
--dm-accent-yellow-400: #e6c46a;
--dm-accent-orange-400: #e59a6b;
```

#### Status
```css
--dm-status-success: #6fb79a;
--dm-status-warning: #e59a6b;
--dm-status-error: #d06a6a;
```

#### Text
```css
--dm-text-primary: #e6efea;     /* no pure white */
--dm-text-secondary: #b8c6bf;
--dm-text-muted: #8fa39a;
--dm-text-inverse: #121916;
```

**Dark Mode Rules:**
- No pure white text or pure black backgrounds
- WCAG AA contrast minimum
- Cards use slight elevation + lighter surface
- Dividers rare; use spacing instead
- Errors muted red, never flashing

---

## Typography

**System Font:** Nunito (all weights)

### Text Styles

| Style              | Font   | Weight   | Size     | Line Height | Usage          |
|--------------------|--------|----------|----------|-------------|----------------|
| Heading / L        | Nunito | SemiBold | 24-28px  | 1.2         | Screen titles  |
| Heading / M        | Nunito | SemiBold | 18-20px  | 1.3         | Section titles |
| Body / Primary     | Nunito | Regular  | 15-16px  | 1.4-1.5     | Main text      |
| Body / Secondary   | Nunito | Regular  | 14-15px  | 1.4         | Descriptions   |
| Button / Primary   | Nunito | Medium   | 16px     | 1           | CTAs           |
| Navigation         | Nunito | Regular  | 14px     | 1           | Tabs           |
| Metric             | Nunito | SemiBold | 20-24px  | 1.1         | Numbers/stats  |

**Button Text:** Sentence case only

**Typography Rules:**
- ❌ No Comic Sans
- ❌ No handwritten fonts in system UI
- ✅ Metrics use -1% tracking for tightness

---

## Spacing & Layout

**Base Unit:** 8px

| Token      | Size | Usage                    |
|------------|------|--------------------------|
| Space / XS | 4px  | Tight spacing            |
| Space / S  | 8px  | Default element spacing  |
| Space / M  | 16px | Card padding, gaps       |
| Space / L  | 24px | Section spacing          |
| Space / XL | 32px | Screen margins           |

### Corner Radius
```
Small    8px   - Small buttons, badges
Default  12px  - Cards, inputs, buttons
Large    16px  - Modal dialogs, major cards
```

### Elevation

**Light Mode:** Soft shadows
```css
elevation-1: 0 2px 8px rgba(36, 51, 46, 0.08);
elevation-2: 0 4px 16px rgba(36, 51, 46, 0.12);
```

**Dark Mode:** Surface contrast (no shadows)

---

## Component Guidelines

### Buttons

#### Variants

**Primary Action**
```css
background: var(--brand-green-500);
text: var(--text-inverse);
```

**Secondary Action**
```css
background: var(--brand-blue-500);
text: var(--text-inverse);
```

**Reward/High-Impact**
```css
background: var(--accent-yellow-400);
text: #3a2a00;
```

**Warning/Risk**
```css
background: var(--accent-orange-400);
text: #3a1f12;
```

**States Required:** Default, Hover, Pressed, Disabled (for both light & dark modes)

---

### Cards

- No texture
- Use Surface tokens for background
- Internal padding ≥ 16px
- Border radius: 12px (default)
- Light mode: soft elevation
- Dark mode: surface contrast

---

### Navigation

- Icons: monochrome, rounded line style
- Active state: brand-green
- Inactive state: text-muted
- No text labels in bottom tab bar

---

### Icons

**System Icons (Navigation, Settings)**
- Monochrome
- Rounded line style
- 24px default size

**Motivation Icons (Streaks, XP, Rewards)**
- Soft pastel colors
- Filled or outlined
- 20-32px size

**Story Icons (Characters, Locations)**
- Sketch/illustrated style
- Full color
- Variable sizes

**Rule:** Never mix icon styles on the same hierarchy level

---

## Background Art

### Global Backgrounds

**Light Mode:**
- Warm watercolor wash (pastel green/blue)
- Subtle texture only
- Low contrast

**Dark Mode:**
- Deep night sky blue-green
- Very subtle texture
- No bright elements

### Story Scene Backgrounds

**Usage:** Unique illustrations for narrative moments
- Cafe interior
- Kitchen scenes
- Restaurant exterior
- Office settings

**Rule:** Background art never holds text

---

## Visual Hierarchy

| Layer             | Color Family        |
|-------------------|---------------------|
| World / Story     | Green & Blue pastel |
| Thinking / Reason | Blue                |
| Progress / Safe   | Green               |
| Reward            | Yellow              |
| Risk / Pressure   | Orange              |
| Failure           | Muted Red           |

---

## Design Rules (Non-Negotiable)

### Do
- ✅ Use semantic tokens (never raw hex values)
- ✅ Text on Surface tokens, not background
- ✅ Accent colors signal specific meaning
- ✅ Dark mode stays calm and matte
- ✅ Cards stay clean
- ✅ White space = cognitive comfort

### Don't
- ❌ Yellow background screens
- ❌ Orange text paragraphs
- ❌ Red for minor mistakes
- ❌ More than 1 accent color per screen
- ❌ Pure black text or backgrounds
- ❌ Text embedded in background images
- ❌ Neon or high-contrast gaming aesthetics

---

## Figma Implementation

### File Structure
```
📁 F&B Tycoon Design System
 ├── 🎨 Foundations
 │   ├── Colors (Light & Dark variables)
 │   ├── Typography
 │   ├── Spacing
 │   └── Elevation
 │
 ├── 🧱 Components
 │   ├── Buttons
 │   ├── Cards
 │   ├── Navigation
 │   ├── Progress
 │   └── Feedback
 │
 ├── 🌿 Backgrounds
 │   ├── Light Mode
 │   └── Dark Mode
 │
 └── 📱 Templates
     ├── Home
     ├── Practice
     └── Story
```

### Color Style Naming Convention
```
Color / Light / BG / Primary
Color / Dark / Surface / Primary
Color / Light / Brand / Green 500
```

### Mode Switching
- Dark mode mirrors layout 1:1
- No reflow or font changes
- Only color & background swap
- Test both modes for every component

---

## Accessibility

### Contrast Requirements
- Body text: WCAG AA minimum (4.5:1)
- Large text: WCAG AA (3:1)
- Interactive elements: clearly distinguishable
- Status colors: instantly readable

### Dark Mode Considerations
- All text meets AA contrast
- No pure white (#ffffff) text
- Buttons slightly brighter than cards
- Error states clear but not alarming

---

## Scalability

This system supports:
- ✅ Mobile-first design
- ✅ Analytics overlays
- ✅ A/B testing (swap accent intensity)
- ✅ Light/Dark mode parity
- ✅ Seasonal theming extensions
- ✅ Enterprise white-labeling
- ✅ Investor presentations

---

**Version:** 1.0
**Last Updated:** 2025-12-25
**Status:** Production Ready
