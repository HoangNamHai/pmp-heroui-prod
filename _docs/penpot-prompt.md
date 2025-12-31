## Instructions for AI

You are working with Penpot MCP to create mobile app mockups. Follow these critical rules to avoid common mistakes.

### Device Specifications

- **Device**: iPhone 14 Pro
- **Screen Size**: 393 × 852 px
- **Safe Area Top**: 59px (notch)
- **Safe Area Bottom**: 34px (home indicator)

---

## CRITICAL RULES (MUST FOLLOW)

### 1. Font Verification

**ALWAYS check font availability before using any font:**

```javascript
const fonts = penpot.fonts.all;
const hasNunito = fonts.some((f) => f.name === "Nunito");

// If font not available, use alternatives:
// - "Plus Jakarta Sans" (most similar to Nunito)
// - "Inter" (clean, versatile)
// - "DM Sans" (geometric, modern)
```

Penpot silently falls back to "Source Sans Pro" if font doesn't exist!

### 2. Z-Order (Layer Stacking)

**Use `insertChild(index)` NOT `appendChild()`:**

```javascript
let index = 0;
screen.insertChild(index++, cardBackground); // Index 0 = BACK (bottom)
screen.insertChild(index++, cardText); // Index 1 = FRONT (top)
```

- Children array: **Index 0 = back layer, Index N = front layer**
- NEVER use `remove()` to reorder - it permanently deletes elements

### 3. Text Wrapping

**Long text MUST use `auto-height`:**

```javascript
text.growType = "auto-height"; // Enables wrapping
text.resize(343, text.height); // Fixed width, auto height
```

- `auto-width` (default) = NO wrapping, text gets cut off!
- Width guidelines: **343px** (full-width), **303px** (in cards)

### 4. Element Centering

**ALWAYS calculate positions mathematically:**

```javascript
// Center element in container
element.x = container.x + (container.width - element.width) / 2;
element.y = container.y + (container.height - element.height) / 2;
```

Never guess positions for icons, text in buttons, etc.

### 5. Padding/Margin Consistency

**Left margin MUST equal right margin:**

```javascript
const SCREEN_WIDTH = 393;
const CARD_WIDTH = 343;
const EQUAL_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2; // = 25px each side
card.x = screen.x + EQUAL_MARGIN;
```

### 6. Board Settings

```javascript
const board = penpot.createBoard();
board.name = "01-Home-Dashboard";
board.x = 600; // Grid position
board.y = 100;
board.resize(393, 852);
board.clipContent = false; // ALWAYS set to false!
```

### 7. Visual Verification

**After EVERY screen creation, export and verify:**

```javascript
return { screenId: screen.id };
// Then use: export_shape(shapeId: screen.id, format: 'png')
```

Create one -> Verify one -> Proceed

---

## Board Layout

All screens must be created as **boards on the same page** (API limitation).

**Single Row Layout** - Place all boards in a horizontal row for simplicity:

```javascript
const BOARD_GAP = 57; // Gap between boards
const START_X = 600;
const START_Y = 100;

// Position formula (single row)
x = START_X + boardIndex * (393 + BOARD_GAP); // 393px width + 57px gap = 450px spacing
y = START_Y;
```

**Board Reference:**
| Board | x Position | Notes |
|-------|------------|-------|
| 01 | 600 | First board |
| 02 | 1050 | 600 + 450 |
| 03 | 1500 | 600 + 900 |
| 04 | 1950 | 600 + 1350 |
| ... | +450 each | Continue horizontally |

**Board Height:** Boards can be extended vertically to contain all children objects (not limited to 852px screen height).

---

## Standard Dimensions

| Element            | Width | Notes                    |
| ------------------ | ----- | ------------------------ |
| Screen             | 393px | iPhone 14 Pro            |
| Full-width card    | 343px | 25px margins each side   |
| Card internal text | 303px | 20px padding inside card |
| Progress bar       | 303px | 45px margins each side   |
| Modal card         | 329px | 32px margins each side   |

| Element        | Radius | Notes                 |
| -------------- | ------ | --------------------- |
| Cards          | 12px   | Standard              |
| Buttons        | 28px   | Pill shape (height/2) |
| Small elements | 8px    | Badges, small buttons |
| Pills/Circles  | 9999px | Full round            |

---

## Code Patterns

### Create Card with Text

```javascript
let index = 0;

// 1. Background card (FIRST = back layer)
const card = penpot.createRectangle();
card.name = "DailyStreakCard/Background";
card.x = screen.x + 25; // Centered with equal margins
card.y = screen.y + 168;
card.resize(343, 100);
card.fills = [{ fillColor: "#ffffff", fillOpacity: 1 }];
card.borderRadius = 12;

// 2. Title text (SECOND = middle layer)
const title = penpot.createText("Daily Streak");
title.name = "DailyStreakCard/Title";
title.x = card.x + 20;
title.y = card.y + 20;
title.fontFamily = "Nunito"; // Verify availability first!
title.fontSize = "18";
title.fontWeight = "600";

// 3. Value text (THIRD = top layer)
const value = penpot.createText("5 days");
value.name = "DailyStreakCard/Value";
value.x = card.x + 20;
value.y = card.y + 50;

// Insert in correct z-order
screen.insertChild(index++, card); // 0 = back
screen.insertChild(index++, title); // 1 = middle
screen.insertChild(index++, value); // 2 = front

// Group them
const group = penpot.group([card, title, value]);
group.name = "DailyStreakCard";
```

### Vertically Centered (Single Element)

```javascript
// For buttons, single-line cards
text.y = container.y + (container.height - text.height) / 2;
```

### Vertically Stacked (Multiple Elements)

```javascript
// For cards with title + subtitle + etc.
const TOP_PADDING = 20;
const SPACING = 26;

let currentY = card.y + TOP_PADDING;
title.y = currentY;
currentY += title.height + SPACING;
subtitle.y = currentY;
```

### Long Text with Wrapping

```javascript
const questionText = penpot.createText(
  "What leadership style works best here?"
);
questionText.growType = "auto-height";
questionText.resize(343, questionText.height);
questionText.align = "center"; // Optional: center text within block
```

---

## Naming Convention

**Format:** `ComponentName/ElementType`

```javascript
// Examples
card.name = "DailyStreakCard/Background";
title.name = "DailyStreakCard/Title";
value.name = "DailyStreakCard/Value";

// Then group
const group = penpot.group([card, title, value]);
group.name = "DailyStreakCard";
```

**Element Type Suffixes:**

- `/Background` - Background shape
- `/Title` or `/Label` - Primary text
- `/Subtitle` or `/Description` - Secondary text
- `/Value` - Data/metric text
- `/Icon` - Icon or emoji
- `/ProgressBar_Background` and `/ProgressBar_Fill`

---

## Verification Checklist

Before proceeding to next screen:

- [ ] Font renders correctly (not fallback)?
- [ ] Text wraps properly (not cut off)?
- [ ] Z-order correct (text visible on cards)?
- [ ] Elements centered properly?
- [ ] Left/right margins equal?
- [ ] `clipContent = false` set?
- [ ] Board not overlapping others?
- [ ] Elements named descriptively?
- [ ] Related elements grouped?
- [ ] **Text uses component instances (not raw `createText`)?**

---

## API Limitations

**Cannot do via Penpot MCP:**

- Cannot move shapes between pages
- Cannot switch current page programmatically
- Cannot create/delete/rename pages
- Cannot reorder pages

**Workaround:** Create all boards on the same page using grid layout.

---

## Using Library Assets

```javascript
// Get library colors
const lib = penpot.library.local;
const bgColor = lib.colors.find((c) => c.name === "bg-background");
element.fills = [{ fillColor: bgColor.color, fillOpacity: 1 }];

// Get typography
const headingStyle = lib.typographies.find(
  (t) => t.name === "L" && t.path === "Heading"
);
```

---

## Text Components (IMPORTANT!)

**ALWAYS create text as reusable components** for the mobile app prototype. When you change the component's style, ALL instances update automatically.

### Why Text Components?

- **Consistency:** All instances share the same style
- **Easy updates:** Change once, update everywhere
- **Prototype-ready:** Matches how real apps handle text styles
- **Design system alignment:** Components mirror code typography tokens

### Creating Text Components

```javascript
// 1. Create text element with proper styling
const headingText = penpot.createText("Heading Text");
headingText.fontFamily = "Nunito";
headingText.fontSize = "26";
headingText.fontWeight = "600";
headingText.lineHeight = "1.2";

// 2. Convert to component in library
const lib = penpot.library.local;
const headingComponent = lib.createComponent([headingText]);
headingComponent.name = "Text/Heading/L";

// 3. Use instances throughout the prototype
const titleInstance = headingComponent.instance();
titleInstance.x = screen.x + 25;
titleInstance.y = screen.y + 100;
```

### Required Text Components

Create these text components BEFORE building screens:

| Component Name | Font Size | Weight | Usage |
|----------------|-----------|--------|-------|
| `Text/Heading/L` | 26px | 600 | Screen titles |
| `Text/Heading/M` | 19px | 600 | Section titles |
| `Text/Body/Primary` | 16px | 400 | Main content |
| `Text/Body/Secondary` | 14px | 400 | Supporting text |
| `Text/Button` | 16px | 500 | Button labels |
| `Text/Caption` | 12px | 400 | Small labels |

### Using Text Component Instances

```javascript
// Find existing text component
const lib = penpot.library.local;
const headingComp = lib.components.find(c => c.name === "Text/Heading/L");

// Create instance (NOT penpot.createText!)
const screenTitle = headingComp.instance();
screenTitle.x = screen.x + 25;
screenTitle.y = screen.y + 80;

// Update text content (keeps component styling)
// Access the text shape inside the instance
const textShape = screenTitle.children[0];
textShape.characters = "Dashboard";
```

### Updating All Instances

```javascript
// When you update the main component, ALL instances update automatically!
const lib = penpot.library.local;
const headingComp = lib.components.find(c => c.name === "Text/Heading/L");
const mainInstance = headingComp.mainInstance();

// Change style on main component
mainInstance.fontSize = "28";  // All instances now use 28px!
mainInstance.fontWeight = "700";  // All instances now bold!
```

### Text Component Checklist

- [ ] Created all required text components in library?
- [ ] Using `component.instance()` instead of `penpot.createText()`?
- [ ] Text components named with `Text/` prefix?
- [ ] Component styles match design tokens?

---

## Quick Reference

| Rule      | Do                                          | Don't                       |
| --------- | ------------------------------------------- | --------------------------- |
| Z-order   | `insertChild(0, bg); insertChild(1, text);` | `appendChild()`             |
| Text wrap | `growType = 'auto-height'`                  | `growType = 'auto-width'`   |
| Centering | Calculate: `(parent - child) / 2`           | Guess positions             |
| Margins   | `(393 - 343) / 2 = 25px` each side          | Hardcode unequal values     |
| Fonts     | Check `penpot.fonts.all` first              | Assume font exists          |
| Naming    | `ComponentName/ElementType`                 | Generic "Rectangle", "Text" |
| Clipping  | `board.clipContent = false`                 | Leave as default (true)     |
| **Text**  | **Use `component.instance()` for text**     | **`penpot.createText()` directly** |

---

**Remember:** Code success does not equal visual correctness. Always export and verify visually!
