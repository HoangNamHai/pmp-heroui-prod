# Penpot MCP Plugin - Working Guidelines & Best Practices

**Last Updated:** 2025-12-28 (Added: Page Organization & API Limitations, Typography References, Comprehensive Verification)
**Context:** Lessons learned from creating F&B Tycoon mobile app mockups

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Typography & Font Verification (Critical!)](#typography--font-verification-critical)
3. [Z-Order Management (Critical!)](#z-order-management-critical)
4. [Board & Screen Layout](#board--screen-layout)
5. [Visual Verification Workflow](#visual-verification-workflow)
6. [Common Pitfalls & How to Avoid Them](#common-pitfalls--how-to-avoid-them)
7. [Code Patterns & Best Practices](#code-patterns--best-practices)
8. [Debugging Checklist](#debugging-checklist)
9. [Page Organization & API Limitations (Critical!)](#page-organization--api-limitations-critical) **← NEW**
10. [Typography References vs Hardcoded Values](#typography-references-vs-hardcoded-values-medium-priority) **← NEW**
11. [Comprehensive Verification Workflow (Critical!)](#comprehensive-verification-workflow-critical) **← NEW**

---

## Core Concepts

### Children Array & Rendering Order

**CRITICAL UNDERSTANDING:**
```javascript
// In Penpot's children array:
// - Index 0 = BACK layer (rendered first, appears behind)
// - Index n = FRONT layer (rendered last, appears on top)

const board = penpot.createBoard();
board.insertChild(0, backgroundRect);  // ← Renders first (back)
board.insertChild(1, contentCard);     // ← Renders second (middle)
board.insertChild(2, titleText);       // ← Renders last (front)
```

**Visual Result:**
```
┌─────────────────┐
│  titleText      │ ← Index 2 (front, visible)
│  ┌───────────┐  │
│  │contentCard│  │ ← Index 1 (middle)
│  └───────────┘  │
│ backgroundRect  │ ← Index 0 (back)
└─────────────────┘
```

### Board Properties

```javascript
const board = penpot.createBoard();

// Essential properties:
board.x = 600;              // Absolute X position on canvas
board.y = 100;              // Absolute Y position on canvas
board.width = 393;          // Board width (iPhone 14 Pro)
board.height = 852;         // Board height (iPhone 14 Pro)
board.name = "01-Home-Dashboard";
board.clipContent = false;  // IMPORTANT: Set to false to prevent clipping

// For modal overlays:
board.fills = [{ fillColor: '#000000', fillOpacity: 0.5 }];  // Semi-transparent
```

---

## Typography & Font Verification (Critical!)

### ⚠️ CRITICAL: Always Verify Font Availability

**LESSON LEARNED:** Setting `fontFamily: "Nunito"` in code does NOT guarantee the font will be used!

**What happened in this project:**
1. Initially set typography assets to `fontFamily: "Nunito"`
2. Code executed successfully (no errors) ✅
3. Checked `penpot.fonts.all` - **Nunito was NOT available!** ❌
4. Penpot silently fell back to "Source Sans Pro"
5. User loaded Nunito font into Penpot
6. Now Nunito IS available ✅

**The critical mistake:** Not checking font availability BEFORE setting fontFamily.

```javascript
// ❌ WRONG: Assuming a font is available
const text = penpot.createText("Hello");
text.fontFamily = "Nunito";  // ← Font might not exist!
// Result: Penpot falls back to default font (Source Sans Pro) ❌

// ✅ RIGHT: Check font availability first
const fonts = penpot.fonts.all;
const nunitoAvailable = fonts.some(f => f.name === 'Nunito');

if (!nunitoAvailable) {
  console.log("Nunito not available, using alternative");
  text.fontFamily = "Plus Jakarta Sans";  // Available alternative
} else {
  text.fontFamily = "Nunito";  // Font is available ✅
}
```

### Checking Available Fonts

```javascript
// Get all available fonts
const fonts = penpot.fonts.all;

// Check if specific font exists
const hasInter = fonts.some(f => f.name === 'Inter');
const hasNunito = fonts.some(f => f.name === 'Nunito');

// Search for fonts by pattern
const sansFonts = fonts.filter(f =>
  f.name && f.name.includes('Sans')
);

// Get font with variants
const interFont = fonts.find(f => f.name === 'Inter');
if (interFont) {
  console.log('Inter variants:', interFont.variants.map(v => v.name));
  // Output: ['100', '200', '300', '400', '500', '600', '700', '800', '900', ...]
}
```

### Good Font Alternatives Available in Penpot

If your desired font is not available, use these professional alternatives:

| Desired Font | Alternative in Penpot | Characteristics |
|-------------|----------------------|-----------------|
| Nunito | **Plus Jakarta Sans** | Rounded, friendly, modern |
| Nunito | **Inter** | Clean, highly legible, versatile |
| Nunito | **DM Sans** | Geometric, modern, professional |
| Roboto | **Work Sans** | Neutral, professional |
| Helvetica | **Public Sans** | Government-approved, clean |
| Montserrat | **Manrope** | Geometric, rounded |

```javascript
// Recommended: Plus Jakarta Sans (most similar to Nunito)
const recommendedFont = "Plus Jakarta Sans";
// Available weights: 200, 300, 400, 500, 600, 700, 800
```

### Updating Typography Assets

```javascript
// Update all typography assets to use available font
const lib = penpot.library.local;
const typographies = lib.typographies;

typographies.forEach(typo => {
  typo.fontFamily = "Plus Jakarta Sans";  // Must be available!
  // Verify the change worked:
  console.log(`${typo.name}: ${typo.fontFamily}`);
});

// ⚠️ IMPORTANT: Also update all text elements in screens!
const allScreens = penpotUtils.findShapes(
  shape => shape.type === 'board',
  penpot.root
);

allScreens.forEach(screen => {
  const textElements = penpotUtils.findShapes(
    shape => shape.type === 'text',
    screen
  );

  textElements.forEach(text => {
    if (text.fontFamily === 'Nunito') {  // Old font
      text.fontFamily = 'Plus Jakarta Sans';  // New font
    }
  });
});
```

### Typography Asset Verification Checklist

**ALWAYS verify typography assets after creation:**

1. **Check the API:**
   ```javascript
   const lib = penpot.library.local;
   lib.typographies.forEach(t => {
     console.log(`${t.name}: ${t.fontFamily} ${t.fontWeight} ${t.fontSize}`);
   });
   ```

2. **Check in Penpot UI:**
   - Open the Assets panel
   - Click on Typography tab
   - Visually confirm font family displays correctly
   - If it shows "Source Sans Pro" but API shows "Nunito", the font doesn't exist!

3. **Export and verify:**
   - Create a test text element using the typography
   - Export as PNG
   - Visually confirm the font looks correct

4. **Update all usages:**
   - Typography assets are just definitions
   - Text elements have their own `fontFamily` property
   - Must update BOTH typography assets AND text elements!

### Complete Font Change Workflow

```javascript
// Step 1: Check font availability
const fonts = penpot.fonts.all;
const targetFont = "Plus Jakarta Sans";
const fontExists = fonts.some(f => f.name === targetFont);

if (!fontExists) {
  return { error: `Font ${targetFont} not available!` };
}

// Step 2: Update typography assets
const lib = penpot.library.local;
lib.typographies.forEach(typo => {
  typo.fontFamily = targetFont;
});

// Step 3: Update all text elements
const allScreens = penpotUtils.findShapes(
  shape => shape.type === 'board',
  penpot.root
);

let updatedCount = 0;
allScreens.forEach(screen => {
  const texts = penpotUtils.findShapes(shape => shape.type === 'text', screen);
  texts.forEach(text => {
    text.fontFamily = targetFont;
    updatedCount++;
  });
});

// Step 4: Verify
return {
  fontUsed: targetFont,
  typographiesUpdated: lib.typographies.length,
  textElementsUpdated: updatedCount,
  nextStep: "Export a screen and verify visually!"
};
```

### Common Font Issues

**Issue 1: Typography shows wrong font in UI**
- **Cause:** Font specified doesn't exist in Penpot
- **Solution:** Check `penpot.fonts.all` and use an available font

**Issue 2: Some text elements still use old font**
- **Cause:** Text elements have independent `fontFamily` property
- **Solution:** Update both typography assets AND all text elements

**Issue 3: Font exists but looks different**
- **Cause:** Font weight/variant not available
- **Solution:** Check available variants with `font.variants`

### Text Wrapping (Critical!)

**LESSON LEARNED:** Text with `growType: "auto-width"` doesn't wrap and gets cut off!

```javascript
// ❌ WRONG: Auto-width text (no wrapping)
const text = penpot.createText("What leadership style works best here?");
text.growType = "auto-width";  // ← Text grows horizontally, gets clipped!
// Result: "What leadership style works best he" ❌

// ✅ RIGHT: Fixed width with auto-height (wraps)
const text = penpot.createText("What leadership style works best here?");
text.growType = "auto-height";  // ← Text wraps within fixed width
text.resize(343, text.height);  // Set width, height adjusts automatically
// Result: Text wraps to multiple lines ✅
```

### Text GrowType Options

```javascript
// Three text wrapping modes:

// 1. AUTO-WIDTH: Text grows horizontally (no wrapping)
text.growType = "auto-width";
// Use for: Short labels, single-line text, buttons
// Problem: Long text gets cut off!

// 2. AUTO-HEIGHT: Fixed width, text wraps vertically
text.growType = "auto-height";
text.resize(343, text.height);  // Set width
// Use for: Paragraphs, questions, multi-line content
// Best for: Most text in mobile UIs

// 3. FIXED: Fixed both width and height
text.growType = "fixed";
text.resize(343, 100);  // Set both dimensions
// Use for: Text boxes with specific dimensions
// Warning: Text may overflow if too long
```

### Fixing Text Wrapping Across Screens

```javascript
// Fix all long text to use proper wrapping
const allScreens = penpotUtils.findShapes(
  shape => shape.type === 'board',
  penpot.root
);

let fixedCount = 0;

allScreens.forEach(screen => {
  const texts = penpotUtils.findShapes(shape => shape.type === 'text', screen);

  texts.forEach(text => {
    const shouldWrap = text.characters.length > 30 || text.width > 350;

    if (shouldWrap && text.growType === 'auto-width') {
      // Calculate appropriate width
      const targetWidth = text.width > 350 ? 343 : 303;

      // Enable wrapping
      text.growType = 'auto-height';
      text.resize(targetWidth, text.height);

      fixedCount++;
    }
  });
});

console.log(`Fixed ${fixedCount} text elements`);
```

### Text Width Guidelines

For mobile screens (393px wide):

```javascript
// Full-width text (with screen padding)
const fullWidthText = 343;  // 393 - 50px padding

// Text in cards (with card + internal padding)
const cardText = 303;  // 343 card - 40px internal padding

// Button text
const buttonText = 200;  // Centered in button

// Examples:
questionText.growType = 'auto-height';
questionText.resize(343, questionText.height);  // Full width

answerText.growType = 'auto-height';
answerText.resize(303, answerText.height);  // Card width
```

### Text Wrapping Verification

**ALWAYS verify text wrapping after creating text elements:**

1. **Check growType:**
   ```javascript
   const texts = penpotUtils.findShapes(shape => shape.type === 'text', screen);
   texts.forEach(t => {
     console.log(`${t.characters.substring(0, 30)}: ${t.growType} (${t.width}px)`);
   });
   ```

2. **Export and verify visually:**
   - Look for text that appears cut off
   - Check if question text displays completely
   - Verify multi-line text wraps correctly

3. **Common issues:**
   - Text appears cut off → Check `growType: "auto-width"`
   - Text is too wide → Set fixed width with `resize()`
   - Text doesn't wrap → Change to `growType: "auto-height"`

### Element Centering & Alignment (Critical!)

**LESSON LEARNED:** Icons/elements placed on circular backgrounds must be mathematically centered!

```javascript
// ❌ WRONG: Manual positioning (often off-center)
const circle = penpot.createRectangle();
circle.x = 696;
circle.y = 1120;
circle.resize(200, 200);

const icon = penpot.createText("👤");
icon.x = 780;  // ← Guessed position, not centered!
icon.y = 1200; // ← Off by several pixels
// Result: Icon visibly off-center ❌

// ✅ RIGHT: Calculate center position
const circle = penpot.createRectangle();
circle.x = 696;
circle.y = 1120;
circle.resize(200, 200);

const icon = penpot.createText("👤");
// Center the icon in the circle
icon.x = circle.x + (circle.width - icon.width) / 2;   // 696 + 75.5 = 771.5
icon.y = circle.y + (circle.height - icon.height) / 2; // 1120 + 71 = 1191
// Result: Icon perfectly centered ✅
```

### Centering Formula

```javascript
// General centering formula for any element in a container

function centerElement(child, parent) {
  child.x = parent.x + (parent.width - child.width) / 2;
  child.y = parent.y + (parent.height - child.height) / 2;
}

// Usage:
const container = penpot.createRectangle();
container.x = 100;
container.y = 100;
container.resize(200, 200);

const content = penpot.createText("Icon");
centerElement(content, container);

// Verify centering:
const centerX = container.x + container.width / 2;
const centerY = container.y + container.height / 2;
const contentCenterX = content.x + content.width / 2;
const contentCenterY = content.y + content.height / 2;

console.log(`Container center: (${centerX}, ${centerY})`);
console.log(`Content center: (${contentCenterX}, ${contentCenterY})`);
// Should match!
```

### Common Centering Scenarios

```javascript
// 1. Center icon in circular avatar
const avatar = penpot.createRectangle();
avatar.resize(200, 200);
avatar.borderRadius = 100; // Makes it circular

const icon = penpot.createText("👤");
icon.x = avatar.x + (avatar.width - icon.width) / 2;
icon.y = avatar.y + (avatar.height - icon.height) / 2;

// 2. Center text in button
const button = penpot.createRectangle();
button.resize(343, 56);
button.borderRadius = 28;

const buttonText = penpot.createText("Continue");
buttonText.x = button.x + (button.width - buttonText.width) / 2;
buttonText.y = button.y + (button.height - buttonText.height) / 2;

// 3. Center card on screen
const screen = penpot.createBoard();
screen.resize(393, 852);

const card = penpot.createRectangle();
card.resize(329, 300);
card.x = screen.x + (screen.width - card.width) / 2;
card.y = screen.y + (screen.height - card.height) / 2;

// 4. Center multi-line text block in modal
const modal = penpot.createRectangle();
modal.resize(329, 300);

const description = penpot.createText("This quiz has 10 questions\nand takes about 5 minutes.");
description.growType = 'auto-height';
description.resize(281, description.height); // Fixed width for wrapping
description.align = 'center'; // Center text alignment within block
description.x = modal.x + (modal.width - description.width) / 2;
// Result: Text block centered AND text aligned center within block ✅

// 5. Center all modal content vertically and horizontally
const modalCard = penpot.createRectangle();
modalCard.x = 2432;
modalCard.y = 2176;
modalCard.resize(329, 300);

const modalCenterX = modalCard.x + modalCard.width / 2;

// Icon at top
const icon = penpot.createText("🎯");
icon.x = modalCenterX - icon.width / 2;
icon.y = modalCard.y + 28; // 28px from top

// Title below icon
const title = penpot.createText("Ready to start?");
title.x = modalCenterX - title.width / 2;
title.y = icon.y + icon.height + 10; // 10px below icon

// Description (centered text block)
const desc = penpot.createText("Multi-line description\ntext here.");
desc.growType = 'auto-height';
desc.resize(281, desc.height);
desc.align = 'center';
desc.x = modalCenterX - desc.width / 2;
desc.y = title.y + title.height + 12;

// Button at bottom
const button = penpot.createRectangle();
button.resize(281, 56);
button.x = modalCenterX - button.width / 2;
button.y = desc.y + desc.height + 28;

const buttonText = penpot.createText("Start");
buttonText.x = modalCenterX - buttonText.width / 2;
buttonText.y = button.y + (button.height - buttonText.height) / 2;
```

### Alignment Verification Checklist

**ALWAYS verify element positioning:**

1. **Check visual alignment:**
   - Export the screen
   - Look for elements that appear off-center
   - Check icons in circles, text in buttons, cards on screens

2. **Calculate expected vs actual:**
   ```javascript
   const expectedX = parent.x + (parent.width - child.width) / 2;
   const actualX = child.x;
   const offsetX = actualX - expectedX;

   if (Math.abs(offsetX) > 1) {
     console.warn(`Element is ${offsetX}px off-center horizontally!`);
   }
   ```

3. **Common centering issues:**
   - Icon appears off-center in circle
   - Text appears off-center in button
   - Text block appears off-center in modal
   - Modal appears off-center on screen
   - **Solution:** Use centering formula, don't guess positions!

4. **Text blocks require TWO centering steps:**
   ```javascript
   // Step 1: Set text block width and position (centers the block)
   textBlock.growType = 'auto-height';
   textBlock.resize(281, textBlock.height);
   textBlock.x = parent.x + (parent.width - textBlock.width) / 2;

   // Step 2: Set text alignment within block (centers text in block)
   textBlock.align = 'center';

   // Common mistake: Only doing Step 2 (align) without Step 1 (position)
   // Result: Text is centered within the block, but block itself is off-center!
   ```

---

### Padding & Margin Consistency (Critical!)

**LESSON LEARNED:** Left and right padding/margins should ALWAYS be equal for centered content!

**What happened in this project:**
1. Created cards and text elements manually positioned on screen
2. Left margin = 24px, right margin = 26px (off by 2px)
3. User noticed asymmetry: "left and right padding should be the same"
4. Fixed 40+ elements across 12 screens to have equal margins

**The critical mistake:** Manual positioning without calculating equal margins.

```javascript
// ❌ WRONG: Manual positioning without margin calculation
const screen = penpot.createBoard();
screen.resize(393, 852);

const card = penpot.createRectangle();
card.resize(343, 200);
card.x = screen.x + 24;  // ← Hardcoded left margin!
// Left margin: 24px
// Right margin: 393 - 343 - 24 = 26px (UNEQUAL!) ❌

// ✅ RIGHT: Calculate equal margins
const SCREEN_WIDTH = 393;
const CARD_WIDTH = 343;
const EQUAL_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2; // 25px

card.x = screen.x + EQUAL_MARGIN;
// Left margin: 25px
// Right margin: 25px (EQUAL!) ✅
```

### Padding Consistency Formula

```javascript
// General formula for centering with equal margins

function positionWithEqualMargins(element, containerX, containerWidth) {
  element.x = containerX + (containerWidth - element.width) / 2;
}

// For iPhone 14 Pro mockups:
const SCREEN_WIDTH = 393;

// Standard card width with 25px margins
const STANDARD_CARD_WIDTH = 343; // 393 - 25*2 = 343

// Progress bar width with 45px margins
const PROGRESS_BAR_WIDTH = 303; // 393 - 45*2 = 303

// Usage:
const screen = penpot.createBoard();
screen.resize(SCREEN_WIDTH, 852);

const card = penpot.createRectangle();
card.resize(STANDARD_CARD_WIDTH, 200);
positionWithEqualMargins(card, screen.x, SCREEN_WIDTH);

// Verify margins:
const leftMargin = card.x - screen.x;
const rightMargin = (screen.x + SCREEN_WIDTH) - (card.x + card.width);
console.log(`Left: ${leftMargin}px, Right: ${rightMargin}px`);
// Output: Left: 25px, Right: 25px ✅
```

### Fixing Unequal Margins

```javascript
// Bulk fix for all screens with unequal margins

const SCREEN_WIDTH = 393;
const TOLERANCE = 1; // Allow 1px difference for rounding

const allScreens = penpotUtils.findShapes(
  shape => shape.type === 'board' && shape.name.match(/^\d{2}-/),
  penpot.root
);

let fixedCount = 0;
const fixes = [];

allScreens.forEach(screen => {
  // Find major elements (cards, text blocks) but skip full-width elements
  const elements = screen.children.filter(el => {
    if (el.width === SCREEN_WIDTH || el.width < 200) return false;
    return (el.type === 'rectangle' && el.width >= 300) ||
           (el.type === 'text' && el.width >= 300);
  });

  elements.forEach(el => {
    const leftMargin = el.x - screen.x;
    const rightMargin = (screen.x + SCREEN_WIDTH) - (el.x + el.width);
    const imbalance = Math.abs(leftMargin - rightMargin);

    if (imbalance > TOLERANCE) {
      const oldX = el.x;
      const correctX = screen.x + (SCREEN_WIDTH - el.width) / 2;
      el.x = correctX;

      fixedCount++;
      fixes.push({
        screen: screen.name,
        element: el.name,
        oldLeftMargin: Math.round(leftMargin),
        oldRightMargin: Math.round(rightMargin),
        newLeftMargin: Math.round(correctX - screen.x),
        newRightMargin: Math.round((screen.x + SCREEN_WIDTH) - (correctX + el.width)),
        movedBy: Math.round(correctX - oldX)
      });
    }
  });
});

return {
  fixed: fixedCount,
  details: fixes
};
```

### Margin Verification Checklist

**ALWAYS verify padding consistency:**

1. **Visual check:**
   - Export the screen
   - Look at cards, text blocks, buttons
   - Check if left/right spacing appears equal
   - Zoom in to check edges align with other elements

2. **Mathematical verification:**
   ```javascript
   const leftMargin = element.x - screen.x;
   const rightMargin = (screen.x + SCREEN_WIDTH) - (element.x + element.width);
   const balanced = Math.abs(leftMargin - rightMargin) <= 1;

   console.log(`Left: ${leftMargin}px, Right: ${rightMargin}px, Balanced: ${balanced}`);
   ```

3. **Bulk verification for all screens:**
   ```javascript
   const allScreens = penpotUtils.findShapes(
     shape => shape.type === 'board',
     penpot.root
   );

   const issues = [];

   allScreens.forEach(screen => {
     screen.children.forEach(el => {
       if (el.width === 393 || el.width < 200) return;

       const leftMargin = el.x - screen.x;
       const rightMargin = (screen.x + 393) - (el.x + el.width);
       const imbalance = Math.abs(leftMargin - rightMargin);

       if (imbalance > 1) {
         issues.push({
           screen: screen.name,
           element: el.name,
           left: Math.round(leftMargin),
           right: Math.round(rightMargin),
           difference: Math.round(imbalance)
         });
       }
     });
   });

   if (issues.length === 0) {
     return "✅ All elements have balanced margins!";
   } else {
     return { unbalancedElements: issues.length, details: issues };
   }
   ```

4. **Common margin patterns:**
   - **343px width** → 25px margins (standard cards)
   - **303px width** → 45px margins (progress bars)
   - **281px width** → 56px margins (modal content)
   - **329px width** → 32px margins (modal cards)

### Real-World Fix Example

**Problem:** Home Dashboard cards have unequal margins

```javascript
// Before fix:
// Card width: 343px
// Position: x = 624 (screen.x = 600)
// Left margin: 624 - 600 = 24px
// Right margin: (600 + 393) - (624 + 343) = 26px
// Imbalance: 2px ❌

// After fix:
const correctX = screen.x + (393 - 343) / 2;  // 600 + 25 = 625
card.x = correctX;
// Left margin: 625 - 600 = 25px
// Right margin: (600 + 393) - (625 + 343) = 25px
// Imbalance: 0px ✅
```

**Result:** Fixed 40 elements across 12 screens, achieving 100% margin balance.

**Design Consistency Note:** Unless explicitly specified, always maintain consistent values across the design:
- Padding left = Padding right
- Margin left = Margin right
- Border radius values (e.g., all cards use 12px, all buttons use 28px)

---

### Vertical Padding Consistency (Top/Bottom)

**LESSON LEARNED:** Just like left/right margins, top and bottom padding should also be equal unless explicitly designed otherwise!

**What happened in this project:**
1. Initially positioned text elements manually within cards
2. Answer option cards had 30px top padding, 11px bottom padding (imbalance: 19px)
3. Learning path cards had 20px top padding, 58px bottom padding (imbalance: 38px)
4. Applied vertical centering blindly, which caused text overlapping in multi-element cards
5. Fixed by understanding card layouts: some cards have stacked elements (title + value), not just centered text

**The critical mistake:** Not considering whether elements should be vertically centered or stacked.

```javascript
// ❌ WRONG: Centering all text in multi-element cards
const card = penpot.createRectangle();
card.resize(343, 100);
card.y = 268;

const title = penpot.createText("Daily Streak");
const value = penpot.createText("5 days");

// Both centered at same position - they overlap! ❌
title.y = card.y + (card.height - title.height) / 2;  // y = 318
value.y = card.y + (card.height - value.height) / 2;  // y = 318

// ✅ RIGHT: Stack elements vertically with consistent spacing
const card = penpot.createRectangle();
card.resize(343, 100);
card.y = 268;

const TOP_PADDING = 20;
const SPACING = 30; // Space between elements

const title = penpot.createText("Daily Streak");
title.y = card.y + TOP_PADDING;  // 20px from top

const value = penpot.createText("5 days");
value.y = card.y + TOP_PADDING + SPACING;  // 50px from top

// Bottom padding: 100 - 50 - value.height ≈ 20px (balanced!) ✅
```

### When to Center vs Stack

**⚠️ CRITICAL RULE: Always check how many child elements exist in a container!**

```javascript
// Before applying vertical centering, count children:
const container = penpot.createRectangle();
const childrenInside = screen.children.filter(el =>
  el.y >= container.y &&
  el.y < container.y + container.height &&
  el.x >= container.x
);

if (childrenInside.length === 1) {
  // Safe to vertically center
  childrenInside[0].y = container.y + (container.height - childrenInside[0].height) / 2;
} else {
  // Multiple children - use stacking layout!
  // DO NOT center all to same Y position
}
```

**Vertically center (equal top/bottom padding):**
- ✅ Single text element in button
- ✅ Single text element in small container (height < 100px)
- ✅ Icon in circular background
- ✅ Single-line text in answer option cards

**Vertically stack (different Y positions):**
- ✅ Title + subtitle in card
- ✅ Title + value in info card (e.g., "Daily Streak" + "5 days")
- ✅ Title + description in "What you'll learn" card
- ✅ Title + multiple list items in "Topics covered" card
- ✅ Quiz card with title + metadata (questions count + time)
- ✅ Title + description + button in modal
- ✅ Multiple related elements that flow top to bottom

### Fixing Vertical Padding Issues

```javascript
// ❌ WRONG: Blindly centering all text in containers
const containers = screen.children.filter(el => el.type === 'rectangle');

containers.forEach(container => {
  const texts = screen.children.filter(el =>
    el.type === 'text' &&
    el.y >= container.y &&
    el.y < container.y + container.height
  );

  // DANGER: This centers ALL texts to same Y position!
  texts.forEach(text => {
    text.y = container.y + (container.height - text.height) / 2; // ❌ Overlaps!
  });
});
// Result: Cards with title + description now have overlapping text! ❌

// ✅ RIGHT: Check child count before centering
const containers = screen.children.filter(el => el.type === 'rectangle');

containers.forEach(container => {
  const texts = screen.children.filter(el =>
    el.type === 'text' &&
    el.y >= container.y &&
    el.y < container.y + container.height
  );

  if (texts.length === 1) {
    // Single element - safe to center vertically
    const text = texts[0];
    text.y = container.y + (container.height - text.height) / 2; // ✅
  } else if (texts.length > 1) {
    // Multiple elements - use stacking layout
    const TOP_PADDING = 20;
    const SPACING = 30;

    texts.forEach((text, index) => {
      text.y = container.y + TOP_PADDING + (index * SPACING); // ✅ Stacked
    });
  }
});
```

### Safe Single-Element Centering

```javascript
// Only apply to containers with ONE child
const container = penpot.createRectangle();
container.resize(343, 80);

const text = penpot.createText("Click here");

// Check current padding
const topPadding = text.y - container.y;
const bottomPadding = (container.y + container.height) - (text.y + text.height);
const imbalance = Math.abs(topPadding - bottomPadding);

if (imbalance > 5) {
  // Center vertically (ONLY if this is the only child!)
  text.y = container.y + (container.height - text.height) / 2;

  // Verify
  const newTop = text.y - container.y;
  const newBottom = (container.y + container.height) - (text.y + text.height);
  console.log(`Padding: ${Math.round(newTop)}px top, ${Math.round(newBottom)}px bottom`);
  // Output: Padding: 21px top, 21px bottom ✅
}
```

### Complex Card Layout Example

```javascript
// Card with multiple stacked elements
const card = penpot.createRectangle();
card.x = screen.x + 25;
card.y = 384;
card.resize(343, 140);

// Define consistent spacing
const TOP_PADDING = 20;
const ELEMENT_SPACING = 26;

let currentY = card.y + TOP_PADDING;

// Title
const title = penpot.createText("Continue Learning");
title.y = currentY;
currentY += title.height + ELEMENT_SPACING;

// Subtitle
const subtitle = penpot.createText("Leadership Styles");
subtitle.y = currentY;
currentY += subtitle.height + ELEMENT_SPACING;

// Progress text
const progress = penpot.createText("3 of 8 complete");
progress.y = currentY;
currentY += progress.height + ELEMENT_SPACING;

// Progress bar
const progressBar = penpot.createRectangle();
progressBar.resize(303, 8);
progressBar.y = currentY;

// Verify bottom padding
const bottomPadding = (card.y + card.height) - (progressBar.y + progressBar.height);
console.log(`Bottom padding: ${Math.round(bottomPadding)}px`);
// Should be close to TOP_PADDING for balance
```

### Vertical Padding Verification

```javascript
// Check vertical padding for all text in containers
const container = penpot.createBoard();
const texts = container.children.filter(el => el.type === 'text');

texts.forEach(text => {
  // Find the immediate parent rectangle (if any)
  const parent = container.children.find(el =>
    el.type === 'rectangle' &&
    text.x >= el.x &&
    text.x + text.width <= el.x + el.width &&
    text.y >= el.y &&
    text.y + text.height <= el.y + el.height
  );

  if (parent) {
    const topPadding = text.y - parent.y;
    const bottomPadding = (parent.y + parent.height) - (text.y + text.height);
    const imbalance = Math.abs(topPadding - bottomPadding);

    if (imbalance > 5) {
      console.log(`⚠️ Vertical imbalance: ${text.characters?.substring(0, 30)}`);
      console.log(`   Top: ${Math.round(topPadding)}px, Bottom: ${Math.round(bottomPadding)}px`);
    }
  }
});
```

### Design Consistency Principle

**⚠️ IMPORTANT: Unless explicitly specified, maintain consistency across the entire design:**

1. **Padding Left = Padding Right** (within a container)
2. **Margin Left = Margin Right** (for centered elements)
3. **Border Radius** - Use consistent values throughout
   - Example: If cards use 12px radius, ALL cards should use 12px
   - Common patterns: 8px, 12px, 16px, or height/2 for pills

```javascript
// ✅ GOOD: Consistent design tokens
const DESIGN_TOKENS = {
  padding: {
    card: 25,           // Standard card horizontal padding
    cardInternal: 20,   // Padding inside cards
    button: 20          // Button padding
  },
  borderRadius: {
    card: 12,           // All cards
    button: 28,         // All buttons (pill shape: height/2)
    small: 8            // Small elements
  }
};

// Use tokens consistently
card.borderRadius = DESIGN_TOKENS.borderRadius.card;  // ✅ Always 12px
button.borderRadius = DESIGN_TOKENS.borderRadius.button;  // ✅ Always 28px

// ❌ WRONG: Inconsistent values
card1.borderRadius = 12;
card2.borderRadius = 15;  // ❌ Different from card1!
card3.borderRadius = 10;  // ❌ Yet another value
```

**Why consistency matters:**
- Creates visual harmony
- Easier to maintain
- Professional appearance
- Users notice inconsistencies (even subconsciously)

### Best Practices

1. **Single-element containers**: Center vertically (equal top/bottom padding)
2. **Multi-element containers**: Use consistent TOP_PADDING and ELEMENT_SPACING
3. **Buttons**: Always center text vertically (20px top/bottom is common)
4. **Cards with title + value**: Use 20px top, 30px spacing between, auto bottom
5. **Modals**: Use 28-32px top padding, stack elements with 12-16px spacing
6. **Design tokens**: Define and reuse standard values (padding, margins, radii)

---

## Naming & Grouping Strategy (Critical!)

**LESSON LEARNED:** Generic names like "Rectangle" and "Text" make designs impossible to maintain. Logical naming and grouping are essential!

**What happened in this project:**
1. Initially created all elements with generic auto-generated names
2. Had 100% generic names across all screens ("Rectangle", "Text")
3. Impossible to identify elements in the layers panel
4. Hard to debug, modify, or understand the design structure

**The critical mistake:** Not naming elements and grouping related components from the start.

### Naming Convention

**Use descriptive, hierarchical names with format: `ComponentName/ElementType`**

```javascript
// ❌ WRONG: Generic auto-generated names
const card = penpot.createRectangle();  // Name: "Rectangle"
const title = penpot.createText("Daily Streak");  // Name: "Text"
const value = penpot.createText("5 days");  // Name: "Text"
// Result: 3 elements named "Rectangle", "Text", "Text" ❌

// ✅ RIGHT: Descriptive hierarchical names
const card = penpot.createRectangle();
card.name = "DailyStreakCard/Background";

const title = penpot.createText("Daily Streak");
title.name = "DailyStreakCard/Label";

const value = penpot.createText("5 days");
value.name = "DailyStreakCard/Value";
// Result: Clear, searchable, maintainable names ✅
```

### Naming Patterns

**General format:** `[ComponentName]/[ElementType]`

**Common patterns:**
- Headers: `Header/Title`, `Header/Subtitle`
- Cards: `DailyStreakCard/Background`, `DailyStreakCard/Label`, `DailyStreakCard/Value`
- Buttons: `PracticeButton/Background`, `PracticeButton/Icon`, `PracticeButton/Label`
- Progress bars: `ProgressBar/Background`, `ProgressBar/Fill`
- Answer options: `AnswerOptionA/Background`, `AnswerOptionA/Text`

**Element type suffixes:**
- `/Background` - Background rectangle/shape
- `/Title` or `/Label` - Primary text
- `/Subtitle` or `/Description` - Secondary text
- `/Value` - Numeric or data value text
- `/Icon` - Icon or emoji
- `/Button` - Clickable element
- `/ProgressBar_Background` and `/ProgressBar_Fill` - Progress indicators

### Grouping Related Elements

**Use `penpot.group()` to group related elements into logical components**

```javascript
// Create a card with multiple elements
const cardBg = penpot.createRectangle();
cardBg.name = "DailyStreakCard/Background";
cardBg.resize(343, 100);

const label = penpot.createText("🔥 Daily Streak");
label.name = "DailyStreakCard/Label";

const value = penpot.createText("5 days");
value.name = "DailyStreakCard/Value";

// Group them together
const cardGroup = penpot.group([cardBg, label, value]);
cardGroup.name = "DailyStreakCard";

// Now the card can be moved, copied, or modified as one unit!
```

### Benefits of Grouping

1. **Easier to select and move entire components**
2. **Clear hierarchy in layers panel**
3. **Safer to modify** - less chance of accidentally selecting wrong element
4. **Reusable** - can duplicate entire groups
5. **Organized** - related elements stay together

### Real-World Examples

**Home Dashboard - 7 Groups:**
```javascript
// Header elements (not grouped - always visible)
"Header/Title"
"Header/Subtitle"

// Card components (grouped)
"DailyStreakCard" {
  "DailyStreakCard/Background"
  "DailyStreakCard/Label"
  "DailyStreakCard/Value"
}

"ContinueLearningCard" {
  "ContinueLearningCard/Background"
  "ContinueLearningCard/Title"
  "ContinueLearningCard/Subtitle"
  "ContinueLearningCard/Progress"
  "ContinueLearningCard/ProgressBar_Background"
  "ContinueLearningCard/ProgressBar_Fill"
}

"TodaysGoalCard" {
  "TodaysGoalCard/Background"
  "TodaysGoalCard/Label"
  "TodaysGoalCard/Value"
}

// Quick action buttons (grouped)
"PracticeButton" { ... }
"LeaderboardButton" { ... }
"ResourcesButton" { ... }
"SettingsButton" { ... }
```

**Learning Paths - 3 Groups:**
```javascript
"FoundationPathCard" {
  "FoundationPathCard/Background"
  "FoundationPathCard/Title"
  "FoundationPathCard/LessonCount"
  "FoundationPathCard/ProgressBar_Background"
  "FoundationPathCard/ProgressBar_Fill"
}

"PeopleDomainCard" { ... }
"ProcessDomainCard" { ... }
```

**Lesson Player Challenge - 4 Groups:**
```javascript
// Progress bar (not grouped - UI chrome)
"ProgressBar/Background"
"ProgressBar/StepIndicator"

// Question (standalone)
"Question/Text"

// Answer options (grouped)
"AnswerOptionA" {
  "AnswerOptionA/Background"
  "AnswerOptionA/Text"
}

"AnswerOptionB" { ... }
"AnswerOptionC" { ... }
"AnswerOptionD" { ... }
```

### When to Group vs Not Group

**Group these:**
- ✅ Cards with background + multiple text elements
- ✅ Buttons with background + icon + label
- ✅ List items with consistent structure
- ✅ Answer options in quizzes
- ✅ Progress bars with background + fill

**Don't group these:**
- ❌ Page headers (title + subtitle) - often need independent positioning
- ❌ UI chrome elements (top nav, tab bar) - usually modify separately
- ❌ Elements that animate independently
- ❌ Elements with very different z-order requirements

### Naming & Grouping Workflow

```javascript
// 1. Create elements with descriptive names immediately
const card = penpot.createRectangle();
card.name = "QuizCard/Background";  // ← Name it right away!

// 2. Collect related elements
const elements = [cardBg, titleText, valueText];

// 3. Name each element
elements.forEach((el, index) => {
  el.name = `QuizCard/${['Background', 'Title', 'Value'][index]}`;
});

// 4. Group them
const group = penpot.group(elements);
group.name = "QuizCard";

// 5. Add to screen
screen.appendChild(group);
```

### Verification

```javascript
// Check naming and grouping structure
const screen = penpotUtils.findShape(s => s.name === '01-Home-Dashboard');

const groups = screen.children.filter(el => el.type === 'group');
console.log(`Total groups: ${groups.length}`);

groups.forEach(group => {
  console.log(`\n${group.name}:`);
  group.children.forEach(child => {
    console.log(`  - ${child.name}`);
  });
});

// Output:
// Total groups: 7
//
// DailyStreakCard:
//   - DailyStreakCard/Background
//   - DailyStreakCard/Label
//   - DailyStreakCard/Value
// ...
```

### Renaming Existing Elements

```javascript
// If you forgot to name elements during creation, rename them:
const screen = penpotUtils.findShape(s => s.name === 'MyScreen');

screen.children.forEach(el => {
  if (el.name === 'Rectangle' || el.name === 'Text') {
    console.warn(`⚠️ Generic name found: ${el.name} at y=${el.y}`);
    // Rename based on position, content, or purpose
    if (el.type === 'rectangle' && el.height === 100) {
      el.name = "SomeCard/Background";
    }
  }
});
```

### Best Practices

1. **Name immediately** - Don't create elements without naming them
2. **Use consistent patterns** - Same naming scheme across all screens
3. **Be descriptive** - `DailyStreakCard/Label` not `Card1/Text1`
4. **Group logically** - Group elements that move together
5. **Document groups** - List your groups in design documentation
6. **Verify regularly** - Check for generic names periodically

---

## Z-Order Management (Critical!)

### ❌ WRONG: Using appendChild()

```javascript
// PROBLEM: appendChild() adds to END of array (top layer)
// If you add elements in wrong order, they stack incorrectly

const card = penpot.createRectangle();
const text = penpot.createText("Hello");

screen.appendChild(text);  // ← Added first → Index 0 → BACK (hidden!)
screen.appendChild(card);  // ← Added later → Index 1 → FRONT (covers text!)

// Result: White card covers the text! ❌
```

### ✅ RIGHT: Using insertChild() with Explicit Indices

```javascript
// SOLUTION: Use insertChild(index, element) for explicit control

const card = penpot.createRectangle();
card.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];

const text = penpot.createText("Hello");
text.fills = [{ fillColor: '#000000', fillOpacity: 1 }];

// Explicit index control:
screen.insertChild(0, card);  // Index 0 → BACK → Background card
screen.insertChild(1, text);  // Index 1 → FRONT → Text on top

// Result: Text appears on top of white card! ✅
```

### Pattern for Cards with Multiple Text Elements

```javascript
let index = 0;

// 1. Create all elements first (don't append yet)
const cardBg = penpot.createRectangle();
cardBg.resize(343, 120);
cardBg.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
cardBg.borderRadius = 12;

const titleText = penpot.createText("Daily Streak");
const valueText = penpot.createText("5 days");

// 2. Insert in correct z-order (background first, text last)
screen.insertChild(index++, cardBg);     // Index 0 (back)
screen.insertChild(index++, titleText);  // Index 1 (middle)
screen.insertChild(index++, valueText);  // Index 2 (front)
```

### ⚠️ NEVER Use remove() for Reordering

```javascript
// ❌ WRONG: This DELETES the element permanently!
const child = screen.children[0];
child.remove();  // ← Element is GONE forever, not just detached!

// ✅ RIGHT: If you need to reorder, rebuild from scratch
// Or use insertChild() from the start to avoid reordering
```

---

## Board & Screen Layout

### Screen Positioning Strategy

**CRITICAL: Avoid overlapping boards!**

```javascript
// Good layout: Grid pattern with spacing
const SCREEN_WIDTH = 393;   // iPhone 14 Pro width
const SCREEN_HEIGHT = 852;  // iPhone 14 Pro height
const COLUMN_SPACING = 450; // 393 + 57px gap
const ROW_SPACING = 900;    // 852 + 48px gap

// Column 1: Main screens
{ name: "01-Home-Dashboard",    x: 600,  y: 100 }
{ name: "04-LessonPlayer-Hook", x: 600,  y: 1000 }
{ name: "14-Modal-BottomSheet", x: 600,  y: 1900 }

// Column 2: Secondary screens
{ name: "02-Learning-Paths",    x: 1050, y: 100 }
{ name: "05-Player-Challenge",  x: 1050, y: 1000 }
{ name: "15-Modal-DailyGoal",   x: 1050, y: 1900 }

// Column 3: Detail screens
{ name: "03-Lesson-Detail",     x: 1500, y: 100 }
{ name: "10-Practice-List",     x: 1500, y: 1000 }
{ name: "16-Modal-ReminderTime",x: 1500, y: 1900 }
```

### Scrollable Content (Expanding Board Height)

**IMPORTANT: When content exceeds viewport height, expand the board to show full scrollable content**

```javascript
// ❌ WRONG: Limiting board to viewport height when content is longer
const screen = penpot.createBoard();
screen.resize(393, 852);  // Fixed height - content gets cut off!

const content = [
  { text: "Item 1", y: 200 },
  { text: "Item 2", y: 300 },
  { text: "Item 3", y: 400 },
  // ... 20 more items extending beyond 852px
];
// Result: Items below 852px are hidden! ❌

// ✅ RIGHT: Expand board height to include all scrollable content
const screen = penpot.createBoard();
const VIEWPORT_HEIGHT = 852;  // iPhone 14 Pro viewport
const CONTENT_HEIGHT = 2000;  // Actual content height (scrollable)

screen.resize(393, CONTENT_HEIGHT);  // Expanded to show full scroll area ✅

// Or calculate dynamically:
const lastItemY = 1850;
const lastItemHeight = 100;
const bottomPadding = 50;
const totalHeight = lastItemY + lastItemHeight + bottomPadding;  // 2000px

screen.resize(393, totalHeight);  // Board shows entire scrollable area ✅
```

**Why expand the board:**
- Shows the complete user experience (all content they can scroll to)
- Easier to design and review full flow
- Developers can see exact spacing and layout of off-screen content
- Represents the actual ScrollView content area in React Native

**Design workflow:**
1. Start with viewport height (852px for iPhone 14 Pro)
2. Add all content (cards, lists, etc.)
3. Calculate total content height
4. Expand board height to fit all content
5. The board now represents the full scrollable area

**Example: Practice List with many quiz cards**
```javascript
const screen = penpot.createBoard();
screen.name = "10-Practice-List";
screen.x = 1500;
screen.y = 1000;

// Viewport dimensions
const SCREEN_WIDTH = 393;
const VIEWPORT_HEIGHT = 852;

// Content layout
const HEADER_HEIGHT = 100;
const CARD_HEIGHT = 120;
const CARD_SPACING = 20;
const BOTTOM_PADDING = 50;
const NUM_CARDS = 10;

// Calculate total scrollable height
const contentHeight = HEADER_HEIGHT +
                      (NUM_CARDS * CARD_HEIGHT) +
                      ((NUM_CARDS - 1) * CARD_SPACING) +
                      BOTTOM_PADDING;
// = 100 + 1200 + 180 + 50 = 1530px

// Expand board to show all content
screen.resize(SCREEN_WIDTH, contentHeight);  // 393 × 1530px ✅

// Now the board shows the entire scrollable area!
```

**Note on grid spacing:**
When boards have varying heights due to scrollable content:
- Use the **tallest board** in the row to calculate vertical spacing
- Or use a standard spacing (e.g., 900px) and allow taller boards to extend beyond

```javascript
// Row with mixed heights
const shortScreen = penpot.createBoard();
shortScreen.resize(393, 852);   // Standard viewport
shortScreen.x = 600;
shortScreen.y = 100;

const tallScreen = penpot.createBoard();
tallScreen.resize(393, 2000);   // Expanded for scrollable content
tallScreen.x = 1050;
tallScreen.y = 100;  // Same Y as shortScreen

// Next row starts below the tallest screen
const nextRowY = 100 + 2000 + 100;  // y + tallest height + gap = 2200
```

### Calculating Non-Overlapping Positions

```javascript
function getNextBoardPosition(column, row) {
  const SCREEN_WIDTH = 393;
  const SCREEN_HEIGHT = 852;
  const H_SPACING = 450;  // Horizontal spacing between columns
  const V_SPACING = 900;  // Vertical spacing between rows
  const START_X = 600;    // Starting X position
  const START_Y = 100;    // Starting Y position

  return {
    x: START_X + (column * H_SPACING),
    y: START_Y + (row * V_SPACING)
  };
}

// Usage:
const pos = getNextBoardPosition(0, 0);  // Column 0, Row 0
const newBoard = penpot.createBoard();
newBoard.x = pos.x;
newBoard.y = pos.y;
newBoard.resize(393, 852);
```

### Component Layout Area

```javascript
// Reserve a separate area for components (not screens)
const COMPONENT_AREA = {
  startX: 100,
  startY: 100,
  spacing: 50
};

// Place components vertically with spacing
const button1 = penpot.createBoard();
button1.x = COMPONENT_AREA.startX;
button1.y = COMPONENT_AREA.startY;  // y: 100

const button2 = penpot.createBoard();
button2.x = COMPONENT_AREA.startX;
button2.y = COMPONENT_AREA.startY + 200;  // y: 300 (100 + spacing + height)
```

---

## Visual Verification Workflow

### ⚠️ MANDATORY: Test-Driven Visual Development

**NEVER batch create without visual verification!**

```javascript
// ❌ WRONG WORKFLOW:
// 1. Create all 13 screens
// 2. Verify at the end
// 3. Discover everything is broken
// 4. Rebuild everything from scratch

// ✅ RIGHT WORKFLOW:
// FOR EACH screen:
//   1. Create the screen
//   2. Export and VIEW it immediately
//   3. Verify it looks correct
//   4. ONLY THEN proceed to next screen
```

### Export and Verify Pattern

```javascript
// Step 1: Create one screen
const screen = penpot.createBoard();
screen.name = "01-Home-Dashboard";
screen.x = 600;
screen.y = 100;
screen.resize(393, 852);

// ... add elements ...

// Step 2: Get the screen ID
const screenId = screen.id;

// Step 3: IMMEDIATELY export and verify
// (Use export_shape tool with screenId)

// Step 4: Visual confirmation required before proceeding
// - Check text is visible on cards
// - Check z-order is correct
// - Check colors and spacing
// - Check nothing is clipped

// Step 5: ONLY after visual confirmation, create next screen
```

### Using export_shape Tool

```javascript
// After creating elements, ALWAYS verify:
return {
  message: "Screen created",
  screenId: screen.id,  // ← Use this ID to export
  elementCount: screen.children.length
};

// Then use MCP tool: export_shape
// - shapeId: screen.id
// - format: "png"
// - LOOK AT THE OUTPUT before proceeding!
```

---

## Common Pitfalls & How to Avoid Them

### Pitfall 1: Text Behind Cards

**Problem:**
```javascript
// Text added first → lower index → back layer
screen.appendChild(text);  // Index 0
screen.appendChild(card);  // Index 1
// Result: Card covers text ❌
```

**Solution:**
```javascript
// Use insertChild with explicit indices
screen.insertChild(0, card);  // Background first
screen.insertChild(1, text);  // Text on top
```

### Pitfall 2: Content Clipping

**Problem:**
```javascript
const board = penpot.createBoard();
// board.clipContent defaults to true
// Elements outside board bounds are hidden!
```

**Solution:**
```javascript
const board = penpot.createBoard();
board.clipContent = false;  // ← Always set this!
```

### Pitfall 3: Overlapping Boards

**Problem:**
```javascript
// Creating multiple screens at same position
const screen1 = penpot.createBoard();
screen1.x = 600;
screen1.y = 100;

const screen2 = penpot.createBoard();
screen2.x = 600;  // ← Same X!
screen2.y = 100;  // ← Same Y! They overlap!
```

**Solution:**
```javascript
// Use grid layout with spacing
const screen1 = penpot.createBoard();
screen1.x = 600;
screen1.y = 100;

const screen2 = penpot.createBoard();
screen2.x = 600 + 450;  // Next column (393 + 57px gap)
screen2.y = 100;        // Same row
```

### Pitfall 4: Assuming Code Success = Visual Correctness

**Problem:**
```javascript
// Code runs without errors
screen.insertChild(0, card);
screen.insertChild(1, text);

return "Screen created successfully!";  // ❌ Not verified!
```

**Solution:**
```javascript
// Code runs without errors
screen.insertChild(0, card);
screen.insertChild(1, text);

// THEN export and verify visually
return {
  message: "Screen created - VERIFY VISUALLY",
  screenId: screen.id,
  nextStep: "Use export_shape to confirm visual output"
};
```

### Pitfall 5: Using remove() to Reorder

**Problem:**
```javascript
// Trying to move element to front
const element = screen.children[0];
element.remove();  // ← DELETES element permanently!
screen.appendChild(element);  // ← Element is already gone!
```

**Solution:**
```javascript
// Don't try to reorder - rebuild from scratch
// Or use insertChild() from the beginning to avoid reordering
```

---

## Code Patterns & Best Practices

### Pattern 1: Creating a Card with Text (Correct Z-Order)

```javascript
function createCardWithText(parent, x, y, title, value) {
  let index = 0;

  // 1. Create background card
  const card = penpot.createRectangle();
  card.x = x;
  card.y = y;
  card.resize(343, 100);
  card.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];
  card.borderRadius = 12;

  // 2. Create text elements
  const titleText = penpot.createText(title);
  titleText.x = x + 16;
  titleText.y = y + 20;
  titleText.fontFamily = "Nunito";
  titleText.fontWeight = "600";
  titleText.fontSize = "18";

  const valueText = penpot.createText(value);
  valueText.x = x + 16;
  valueText.y = y + 50;
  valueText.fontFamily = "Nunito";
  valueText.fontWeight = "700";
  valueText.fontSize = "24";

  // 3. Insert in correct z-order
  parent.insertChild(index++, card);       // Index 0 (back)
  parent.insertChild(index++, titleText);  // Index 1 (middle)
  parent.insertChild(index++, valueText);  // Index 2 (front)

  return index;  // Return next available index
}

// Usage:
let currentIndex = 0;
currentIndex = createCardWithText(screen, 24, 168, "Daily Streak", "5 days");
// Next element starts at currentIndex
```

### Pattern 2: Creating a Screen from Scratch

```javascript
function createScreen(name, column, row) {
  // 1. Calculate position to avoid overlaps
  const x = 600 + (column * 450);
  const y = 100 + (row * 900);

  // 2. Create board
  const screen = penpot.createBoard();
  screen.name = name;
  screen.x = x;
  screen.y = y;
  screen.resize(393, 852);
  screen.clipContent = false;  // IMPORTANT!

  // 3. Return for further manipulation
  return screen;
}

// Usage:
const homeScreen = createScreen("01-Home-Dashboard", 0, 0);
const pathsScreen = createScreen("02-Learning-Paths", 1, 0);
// Column 0, Row 0 and Column 1, Row 0 - no overlap!
```

### Pattern 3: Using Library Colors (Asset-First Design)

```javascript
// Get library references once at the start
const lib = penpot.library.local;
const colors = {
  surface: lib.colors.find(c => c.name === 'surface-primary'),
  text: lib.colors.find(c => c.name === 'text-foreground'),
  muted: lib.colors.find(c => c.name === 'text-muted'),
  green: lib.colors.find(c => c.name === 'brand-green-500'),
  blue: lib.colors.find(c => c.name === 'brand-blue-500')
};

// Use throughout the screen
const card = penpot.createRectangle();
card.fills = [{ fillColor: colors.surface.color, fillOpacity: 1 }];

const text = penpot.createText("Hello");
text.fills = [{ fillColor: colors.text.color, fillOpacity: 1 }];
```

### Pattern 4: Building Complex Screens (Multi-Section)

```javascript
function buildComplexScreen(screen) {
  // Clear existing content
  while (screen.children.length > 0) {
    screen.children[0].remove();
  }

  screen.clipContent = false;

  // Track current index for z-order
  let index = 0;

  // Section 1: Header (no background)
  const header = penpot.createText("Welcome");
  header.x = screen.x + 24;
  header.y = screen.y + 100;
  screen.insertChild(index++, header);

  // Section 2: Card with text (background + text)
  const cardBg = penpot.createRectangle();
  cardBg.x = screen.x + 24;
  cardBg.y = screen.y + 168;

  const cardText = penpot.createText("Content");
  cardText.x = screen.x + 40;
  cardText.y = screen.y + 188;

  screen.insertChild(index++, cardBg);    // Background first
  screen.insertChild(index++, cardText);  // Text on top

  // Section 3: Another card (background + text)
  const card2Bg = penpot.createRectangle();
  card2Bg.x = screen.x + 24;
  card2Bg.y = screen.y + 308;

  const card2Text = penpot.createText("More content");
  card2Text.x = screen.x + 40;
  card2Text.y = screen.y + 328;

  screen.insertChild(index++, card2Bg);    // Background first
  screen.insertChild(index++, card2Text);  // Text on top

  return index;  // Total elements added
}
```

---

## Debugging Checklist

### When Text is Not Visible

- [ ] Check z-order: Is text at higher index than background?
- [ ] Check `clipContent`: Is it set to `false`?
- [ ] Check text color: Is it contrasting with background?
- [ ] Check text position: Is it within board bounds?
- [ ] Export and view: Visual verification required!

### When Screens Overlap

- [ ] Check X positions: Are they at least 450px apart (for 393px wide screens)?
- [ ] Check Y positions: Are they at least 900px apart (for 852px tall screens)?
- [ ] List all board positions: Use `penpotUtils.findShapes()` to audit
- [ ] Create position grid: Document expected positions

### When Elements Are Clipped

- [ ] Check `board.clipContent`: Should be `false` for most cases
- [ ] Check element positions: Are they inside board bounds?
- [ ] Check parent bounds: Is parent board large enough?

### When Code Succeeds But Output is Wrong

- [ ] **Export immediately**: Use `export_shape` tool
- [ ] **Visual verification**: Look at the actual output
- [ ] **Compare expected vs actual**: Screenshot comparison
- [ ] **Don't trust code execution**: No errors ≠ correct output

---

## Quick Reference

### Essential Code Snippets

```javascript
// Get library colors
const lib = penpot.library.local;
const color = lib.colors.find(c => c.name === 'surface-primary');

// Create board with correct settings
const board = penpot.createBoard();
board.name = "Screen Name";
board.x = 600;
board.y = 100;
board.resize(393, 852);
board.clipContent = false;

// Z-order: Background first, text last
let index = 0;
screen.insertChild(index++, backgroundRect);
screen.insertChild(index++, text);

// Find shapes
const screen = penpotUtils.findShape(
  shape => shape.name === 'ScreenName' && shape.type === 'board'
);

// Clear board
while (board.children.length > 0) {
  board.children[0].remove();
}

// Export for verification
return { screenId: screen.id };  // Then use export_shape tool
```

### Common Dimensions

- **iPhone 14 Pro:** 393 × 852 px
- **Column spacing:** 450 px (393 + 57 gap)
- **Row spacing:** 900 px (852 + 48 gap)
- **Card padding:** 16-24 px
- **Border radius:** 12 px (cards), 28 px (buttons)

---

## Page Organization & API Limitations (Critical!)

### ⚠️ CRITICAL: Cannot Move Shapes Between Pages via API

**LESSON LEARNED:** The Penpot MCP API does NOT support moving shapes between page roots programmatically!

**What happened in this session:**
1. Created all 18 screens successfully
2. All screens ended up on wrong page ("00-DesignSystem" instead of "02-Screens")
3. Attempted to move screens using `removeChild()` and `appendChild()`
4. **API Error:** `removeChild is not a function` on page root shapes
5. Confirmed: Moving shapes between pages requires manual action in Penpot UI

**The critical limitation:** Page organization must be done manually or screens must be created on the correct page from the start.

```javascript
// ❌ WRONG: This does NOT work for moving between pages
const designPage = penpotUtils.getPageByName("00-DesignSystem");
const screensPage = penpotUtils.getPageByName("02-Screens");
const board = penpotUtils.findShape(s => s.name === '01-Home-Dashboard', designPage.root);

// These methods don't exist or don't work for page roots:
designPage.root.removeChild(board);  // ❌ Error: removeChild is not a function
screensPage.root.appendChild(board);  // ❌ Won't work even if removeChild worked

// ✅ RIGHT: Create boards on the correct page from the start
const screensPage = penpotUtils.getPageByName("02-Screens");
const board = penpot.createBoard();
board.name = "01-Home-Dashboard";
// Board is automatically added to the current page (penpot.currentPage)
// To ensure it's on the right page, switch to that page first or accept manual organization
```

### Working with Multiple Pages

**Best practices for multi-page organization:**

1. **Option 1: Accept post-creation organization (Recommended for complex projects)**
   ```javascript
   // Create all screens first (they go to current page)
   // Document which screens should be on which pages
   // User manually moves screens in Penpot UI (5-10 minutes)

   return {
     note: "Screens created on current page",
     manualSteps: [
       "1. Open Penpot file in UI",
       "2. Select all 18 screen boards",
       "3. Drag from '00-DesignSystem' to '02-Screens' page",
       "4. Verify organization matches spec"
     ]
   };
   ```

2. **Option 2: Switch pages before creating (Works for simple cases)**
   ```javascript
   // Not directly supported in MCP API
   // Current page is controlled by what's active in Penpot UI
   // Cannot programmatically switch pages via API
   ```

3. **Option 3: Create everything on one page (Simple projects)**
   ```javascript
   // Just create all boards on the same page
   // Use naming to indicate logical grouping
   // Organize with clear visual separation (rows/columns)
   ```

### Page Organization Verification

**Always verify page organization after bulk creation:**

```javascript
// Check which boards are on which pages
const pages = penpotUtils.getPages();

const pageReport = pages.map(p => {
  const page = penpotUtils.getPageById(p.id);
  const boards = penpotUtils.findShapes(s => s.type === 'board', page.root);

  return {
    pageName: p.name,
    boardCount: boards.length,
    boards: boards.map(b => b.name).sort()
  };
});

console.log(JSON.stringify(pageReport, null, 2));

// If boards are on wrong page, document the issue:
return {
  issue: "Boards on wrong page - manual reorganization required",
  currentOrganization: pageReport,
  expectedOrganization: {
    "00-DesignSystem": ["Color reference", "Typography reference", "Spacing reference"],
    "01-Components": ["Component library boards"],
    "02-Screens": ["All 18 screen mockups"]
  },
  manualFix: "Select and drag boards to correct pages in Penpot UI"
};
```

### Duplicate Page Detection

**Check for duplicate pages with same name:**

```javascript
const pages = penpotUtils.getPages();
const pageNames = pages.map(p => p.name);
const duplicates = pageNames.filter((name, index) => pageNames.indexOf(name) !== index);

if (duplicates.length > 0) {
  console.warn(`⚠️ Duplicate pages found: ${duplicates.join(', ')}`);

  // List all duplicate page IDs
  const duplicateInfo = duplicates.map(dupName => {
    const instances = pages.filter(p => p.name === dupName);
    return {
      name: dupName,
      count: instances.length,
      ids: instances.map(p => p.id)
    };
  });

  return {
    warning: "Duplicate pages detected",
    duplicates: duplicateInfo,
    solution: "Delete duplicate pages in Penpot UI"
  };
}
```

### API Limitations Summary

**What CANNOT be done via Penpot MCP API:**

1. ❌ Move shapes between pages (no `removeChild`/`appendChild` on page roots)
2. ❌ Switch current page programmatically
3. ❌ Delete pages programmatically
4. ❌ Rename pages programmatically
5. ❌ Reorder pages programmatically

**What CAN be done:**

1. ✅ Create boards (they go to current page)
2. ✅ Query all pages with `penpotUtils.getPages()`
3. ✅ Find shapes within a specific page
4. ✅ Detect organizational issues and report them
5. ✅ Document expected vs actual organization

### Workaround Strategy

**For complex projects with strict page organization:**

```javascript
// Phase 1: Create all content (ignore page organization)
const allScreensCreated = createAllScreens();  // Creates on current page

// Phase 2: Verify content completeness
const verification = verifyAllAssets();  // Check colors, typography, components, screens

// Phase 3: Document organizational issues
const organizationReport = {
  contentComplete: true,
  assetsComplete: true,
  organizationIssues: [
    {
      issue: "Screens on wrong page",
      severity: "MEDIUM",
      impact: "Organizational only - all content is correct",
      manualFix: "Drag screens from '00-DesignSystem' to '02-Screens' page (5 min)"
    }
  ]
};

// Phase 4: User performs manual cleanup in UI
return {
  status: "READY WITH MANUAL CLEANUP",
  contentStatus: "100% complete",
  organizationStatus: "95% - requires 5min manual cleanup",
  report: organizationReport
};
```

---

## Typography References vs Hardcoded Values (Medium Priority)

### Understanding Library Typography Usage

**LESSON LEARNED:** Setting text properties (fontSize, fontWeight, etc.) does NOT automatically link the text to library typography styles!

**What happened in this session:**
1. Created 7 typography styles in shared library ✅
2. Created text elements with matching fontSize, fontWeight, lineHeight ✅
3. Checked `typographyRefId` on text elements → **null** ❌
4. Text elements use hardcoded values, not library references

**The distinction:**
- **Library asset values**: The correct fontSize, fontWeight, etc. are used (✅ values match)
- **Library asset references**: Text element references the library style via `typographyRefId` (❌ not set)

```javascript
// When you create typography in library:
const lib = penpot.library.local;
const headingStyle = lib.typographies.find(t => t.path === 'Heading' && t.name === 'L');
// headingStyle has: fontSize='24', fontWeight='600', lineHeight='1.2'

// When you create text with same properties:
const text = penpot.createText("Hello");
text.fontSize = '24';
text.fontWeight = '600';
text.lineHeight = '1.2';

// Result:
console.log(text.typographyRefId);  // null ❌
// The text LOOKS correct (values match library)
// But it's NOT referencing the library style

// To reference library style (if API supports it):
// text.typographyRefId = headingStyle.id;  // May not be available in current API
```

### When This Matters

**Impact of hardcoded vs referenced:**

1. **Low impact in most cases:**
   - If values match library definitions exactly, visual output is correct
   - Mockups look professional and accurate
   - Developers can still extract values for implementation

2. **Medium impact for design systems:**
   - Future library updates don't propagate to text elements
   - Can't batch-update all "Heading/L" texts by changing library
   - Harder to maintain consistency across large projects

3. **Verification strategy:**
   ```javascript
   // Check if text uses library reference or hardcoded values
   const textElements = penpotUtils.findShapes(s => s.type === 'text', screen);

   const analysisResults = textElements.map(text => ({
     content: text.characters.substring(0, 30),
     usesLibraryRef: text.typographyRefId !== null && text.typographyRefId !== undefined,
     fontSize: text.fontSize,
     fontWeight: text.fontWeight
   }));

   const withRefs = analysisResults.filter(t => t.usesLibraryRef).length;
   const withoutRefs = analysisResults.filter(t => !t.usesLibraryRef).length;

   return {
     totalTexts: textElements.length,
     usingLibraryRefs: withRefs,
     usingHardcodedValues: withoutRefs,
     note: withoutRefs > 0 ? "Text uses hardcoded values - verify they match library" : "All texts reference library"
   };
   ```

### Best Practice

**For current Penpot MCP API:**

Accept that text elements use hardcoded values, but ensure they match library definitions:

```javascript
// 1. Define typography values matching library
const typography = {
  'Heading/L': { fontSize: '24', fontWeight: '600', lineHeight: '1.2' },
  'Heading/M': { fontSize: '18', fontWeight: '600', lineHeight: '1.3' },
  'Body/Primary': { fontSize: '16', fontWeight: '400', lineHeight: '1.4' }
};

// 2. Apply consistently using helper function
function applyTypography(text, styleName) {
  const style = typography[styleName];
  if (!style) {
    console.warn(`Typography style ${styleName} not found`);
    return;
  }

  text.fontSize = style.fontSize;
  text.fontWeight = style.fontWeight;
  text.lineHeight = style.lineHeight;
  text.fontFamily = 'Nunito';  // Or whatever font is available
}

// 3. Use helper for all text creation
const heading = penpot.createText("Welcome");
applyTypography(heading, 'Heading/L');

const body = penpot.createText("This is body text");
applyTypography(body, 'Body/Primary');

// 4. Verify values match library after creation
const lib = penpot.library.local;
const headingStyle = lib.typographies.find(t => t.path === 'Heading' && t.name === 'L');

if (heading.fontSize !== headingStyle.fontSize) {
  console.error(`Mismatch: text=${heading.fontSize}, library=${headingStyle.fontSize}`);
}
```

---

## Comprehensive Verification Workflow (Critical!)

### ⚠️ CRITICAL: Always Verify Against Requirements

**LESSON LEARNED:** Creating assets is not enough - must systematically verify against specifications!

**Comprehensive verification checklist:**

### Phase 1: Design System Assets Verification

```javascript
const lib = penpot.library.local;

// 1. Verify color count and values
const expectedColors = {
  'bg-background': '#f3f6ef',
  'surface-primary': '#ffffff',
  'text-foreground': '#24332e',
  // ... all 16 colors
};

const colorVerification = Object.entries(expectedColors).map(([name, expectedHex]) => {
  const color = lib.colors.find(c => c.name === name);
  return {
    name: name,
    expected: expectedHex,
    actual: color?.color,
    status: color && color.color.toLowerCase() === expectedHex.toLowerCase() ? '✅' : '❌'
  };
});

const allColorsCorrect = colorVerification.every(c => c.status === '✅');
```

```javascript
// 2. Verify typography count and properties
const expectedTypographies = {
  'Heading/L': { fontSize: '24', lineHeight: '1.2', fontWeight: '600' },
  'Heading/M': { fontSize: '18', lineHeight: '1.3', fontWeight: '600' },
  // ... all 7 typography styles
};

const typoVerification = Object.entries(expectedTypographies).map(([name, expected]) => {
  const typo = lib.typographies.find(t => {
    const fullName = t.path ? `${t.path}/${t.name}` : t.name;
    return fullName === name;
  });

  const isCorrect = typo &&
    typo.fontSize === expected.fontSize &&
    typo.lineHeight === expected.lineHeight &&
    typo.fontWeight === expected.fontWeight;

  return {
    name: name,
    expected: expected,
    actual: typo ? {
      fontSize: typo.fontSize,
      lineHeight: typo.lineHeight,
      fontWeight: typo.fontWeight
    } : null,
    status: isCorrect ? '✅' : '❌'
  };
});
```

```javascript
// 3. Verify component library
const expectedComponents = ['Base', 'Primary', 'Secondary', 'Danger', 'ProgressBar', 'TabBar', 'SectionHeader', 'SettingItem'];

const actualComponents = lib.components.map(c => c.name);
const missingComponents = expectedComponents.filter(c => !actualComponents.includes(c));
const componentStatus = missingComponents.length === 0 ? '✅' : '❌';
```

### Phase 2: Screen Completeness Verification

```javascript
// Verify all screens created
const expectedScreens = [
  '01-Home-Dashboard',
  '02-Learning-Paths',
  // ... all 18 screens
];

const allPages = penpotUtils.getPages();
let actualScreens = [];

allPages.forEach(pageInfo => {
  const page = penpotUtils.getPageById(pageInfo.id);
  const boards = penpotUtils.findShapes(s => s.type === 'board', page.root);
  const screenBoards = boards.filter(b => b.name.match(/^\d{2}-/));
  actualScreens = actualScreens.concat(screenBoards.map(b => b.name));
});

const missingScreens = expectedScreens.filter(s => !actualScreens.includes(s));
const screenStatus = missingScreens.length === 0 && actualScreens.length === expectedScreens.length ? '✅' : '❌';
```

### Phase 3: Page Organization Verification

```javascript
// Verify correct page structure
const expectedPageOrganization = {
  '00-DesignSystem': {
    shouldContain: ['Design System Overview', 'Color reference', 'Typography reference'],
    shouldNotContain: /^\d{2}-/  // No numbered screens
  },
  '01-Components': {
    shouldContain: ['Component Library'],
    maxBoards: 10
  },
  '02-Screens': {
    shouldContain: expectedScreens,  // All 18 screens
    minBoards: 18
  }
};

const organizationIssues = [];

allPages.forEach(pageInfo => {
  const page = penpotUtils.getPageById(pageInfo.id);
  const boards = penpotUtils.findShapes(s => s.type === 'board', page.root);
  const expected = expectedPageOrganization[pageInfo.name];

  if (expected) {
    if (expected.shouldNotContain) {
      const wrongBoards = boards.filter(b => b.name.match(expected.shouldNotContain));
      if (wrongBoards.length > 0) {
        organizationIssues.push({
          page: pageInfo.name,
          issue: `Contains ${wrongBoards.length} boards that shouldn't be here`,
          boards: wrongBoards.map(b => b.name)
        });
      }
    }
  }
});
```

### Phase 4: Quality Metrics Verification

```javascript
// Final verification report
const verificationReport = {
  phase1_assets: {
    colors: { status: allColorsCorrect ? '✅ PASS' : '❌ FAIL', details: colorVerification },
    typography: { status: allTyposCorrect ? '✅ PASS' : '❌ FAIL', details: typoVerification },
    components: { status: componentStatus, missing: missingComponents }
  },
  phase2_screens: {
    status: screenStatus,
    expected: expectedScreens.length,
    actual: actualScreens.length,
    missing: missingScreens
  },
  phase3_organization: {
    status: organizationIssues.length === 0 ? '✅ PASS' : '⚠️ ISSUES',
    issues: organizationIssues
  },
  overall: {
    contentComplete: screenStatus === '✅' && componentStatus === '✅',
    assetsCorrect: allColorsCorrect && allTyposCorrect,
    readyForHandoff: organizationIssues.length === 0
  }
};

return verificationReport;
```

### Export Verification

```javascript
// Get shape ID for export
const screen = penpotUtils.findShape(s => s.name === '01-Home-Dashboard');

if (!screen) {
  return { error: "Screen not found" };
}

// Return ID for export tool
return {
  screenId: screen.id,  // ← Use this ID with export_shape tool
  screenName: screen.name,
  nextStep: "Use export_shape tool with this ID to verify visual output"
};

// Then manually call export_shape tool:
// export_shape(shapeId: screen.id, format: 'png')
```

---

## Design Tokens (MUST CREATE FIRST!)

### ⚠️ CRITICAL: Design Tokens Must Exist Before Creating Components

**RULE:** Before creating ANY screen or component, verify that design tokens exist. If not, CREATE THEM FIRST!

**Design tokens include:**
- Colors (background, surface, text, brand colors, etc.)
- Typography styles (Heading/L, Heading/M, Body/Primary, etc.)
- Spacing values (padding, margins, gaps)
- Border radius values (cards, buttons, small elements)

### Pre-Creation Check

```javascript
// ALWAYS run this check before creating components
function verifyDesignTokens() {
  const lib = penpot.library.local;

  const hasColors = lib.colors.length > 0;
  const hasTypography = lib.typographies.length > 0;

  if (!hasColors || !hasTypography) {
    return {
      error: "DESIGN TOKENS MISSING - CREATE THEM FIRST!",
      hasColors: hasColors,
      hasTypography: hasTypography,
      action: "Run createDesignTokens() before proceeding"
    };
  }

  return { ready: true, colors: lib.colors.length, typographies: lib.typographies.length };
}

// Check before any component creation
const tokenCheck = verifyDesignTokens();
if (tokenCheck.error) {
  return tokenCheck;  // STOP - create tokens first!
}
```

### Required Design Tokens

```javascript
// Minimum required tokens before creating components
const REQUIRED_TOKENS = {
  colors: [
    'bg-background',      // Page background
    'surface-primary',    // Card/container backgrounds
    'text-foreground',    // Primary text
    'text-muted',         // Secondary text
    'brand-accent'        // Primary brand color
  ],
  typography: [
    'Heading/L',          // Screen titles
    'Heading/M',          // Section titles
    'Body/Primary',       // Main content text
    'Body/Secondary'      // Supporting text
  ],
  spacing: {
    screenPadding: 25,    // Screen edge padding
    cardPadding: 20,      // Internal card padding
    elementGap: 16,       // Gap between elements
    sectionGap: 24        // Gap between sections
  },
  borderRadius: {
    card: 12,
    button: 28,
    small: 8,
    pill: 9999
  }
};
```

### Using Design Tokens (NOT Hardcoded Values!)

```javascript
// ❌ WRONG: Hardcoded values
const card = penpot.createRectangle();
card.fills = [{ fillColor: '#ffffff', fillOpacity: 1 }];  // ❌ Hardcoded!
card.borderRadius = 12;  // ❌ Magic number!

const text = penpot.createText("Hello");
text.fontSize = '16';     // ❌ Hardcoded!
text.fontWeight = '400';  // ❌ Hardcoded!

// ✅ RIGHT: Reference design tokens
const lib = penpot.library.local;
const TOKENS = {
  colors: {
    surface: lib.colors.find(c => c.name === 'surface-primary'),
    text: lib.colors.find(c => c.name === 'text-foreground'),
    muted: lib.colors.find(c => c.name === 'text-muted')
  },
  typography: {
    headingL: lib.typographies.find(t => t.path === 'Heading' && t.name === 'L'),
    bodyPrimary: lib.typographies.find(t => t.path === 'Body' && t.name === 'Primary')
  },
  spacing: { screenPadding: 25, cardPadding: 20, elementGap: 16 },
  borderRadius: { card: 12, button: 28, small: 8 }
};

const card = penpot.createRectangle();
card.fills = [{ fillColor: TOKENS.colors.surface.color, fillOpacity: 1 }];  // ✅ From token!
card.borderRadius = TOKENS.borderRadius.card;  // ✅ From token!

const text = penpot.createText("Hello");
text.fontSize = TOKENS.typography.bodyPrimary.fontSize;      // ✅ From token!
text.fontWeight = TOKENS.typography.bodyPrimary.fontWeight;  // ✅ From token!
text.fills = [{ fillColor: TOKENS.colors.text.color, fillOpacity: 1 }];  // ✅ From token!
```

### Exception: Explicitly Defined Values

**Only use hardcoded values when explicitly specified:**

```javascript
// ✅ OK: Device-specific dimensions (explicitly defined)
const SCREEN_WIDTH = 393;   // iPhone 14 Pro - explicit device spec
const SCREEN_HEIGHT = 852;  // iPhone 14 Pro - explicit device spec

// ✅ OK: Layout grid positions (explicitly calculated)
const BOARD_GAP = 57;       // Explicit layout decision
const START_X = 600;        // Explicit canvas position

// ✅ OK: User explicitly requested specific value
// User: "Make the button 200px wide"
button.resize(200, 56);  // ✅ Explicit user requirement

// ❌ NOT OK: Styling values without tokens
card.fills = [{ fillColor: '#f0f0f0' }];  // ❌ Should use token!
text.fontSize = '14';  // ❌ Should use typography token!
```

### Design Token Creation Workflow

```javascript
// Step 1: Create color tokens
function createColorTokens() {
  const lib = penpot.library.local;

  const colors = [
    { name: 'bg-background', color: '#f3f6ef' },
    { name: 'surface-primary', color: '#ffffff' },
    { name: 'text-foreground', color: '#24332e' },
    { name: 'text-muted', color: '#6b7c72' },
    { name: 'brand-accent', color: '#4a7c59' }
    // ... more colors
  ];

  colors.forEach(({ name, color }) => {
    const libColor = lib.createColor();
    libColor.name = name;
    libColor.color = color;
  });

  return { created: colors.length };
}

// Step 2: Create typography tokens
function createTypographyTokens() {
  const lib = penpot.library.local;

  const typographies = [
    { path: 'Heading', name: 'L', fontSize: '26', fontWeight: '600', lineHeight: '1.2' },
    { path: 'Heading', name: 'M', fontSize: '19', fontWeight: '600', lineHeight: '1.2' },
    { path: 'Body', name: 'Primary', fontSize: '16', fontWeight: '400', lineHeight: '1.2' },
    { path: 'Body', name: 'Secondary', fontSize: '14', fontWeight: '400', lineHeight: '1.2' }
    // ... more typography
  ];

  typographies.forEach(({ path, name, fontSize, fontWeight, lineHeight }) => {
    const typo = lib.createTypography();
    typo.path = path;
    typo.name = name;
    typo.fontSize = fontSize;
    typo.fontWeight = fontWeight;
    typo.lineHeight = lineHeight;
    typo.fontFamily = 'Nunito';  // Verify font exists first!
  });

  return { created: typographies.length };
}

// Step 3: Store spacing/radius tokens in code (not Penpot library)
const DESIGN_TOKENS = {
  spacing: {
    screenPadding: 25,
    cardPadding: 20,
    elementGap: 16,
    sectionGap: 24
  },
  borderRadius: {
    card: 12,
    button: 28,
    small: 8,
    pill: 9999
  }
};

// Use storage to persist across code executions
storage.DESIGN_TOKENS = DESIGN_TOKENS;
```

### Complete Workflow

```javascript
// 1. CHECK if tokens exist
const lib = penpot.library.local;
const tokensExist = lib.colors.length > 0 && lib.typographies.length > 0;

if (!tokensExist) {
  // 2. CREATE tokens first
  createColorTokens();
  createTypographyTokens();
  storage.DESIGN_TOKENS = { /* spacing, borderRadius */ };

  return {
    status: "Design tokens created",
    nextStep: "Now you can create components"
  };
}

// 3. LOAD tokens for use
const TOKENS = {
  colors: {
    background: lib.colors.find(c => c.name === 'bg-background'),
    surface: lib.colors.find(c => c.name === 'surface-primary'),
    // ...
  },
  typography: {
    headingL: lib.typographies.find(t => t.path === 'Heading' && t.name === 'L'),
    // ...
  },
  ...storage.DESIGN_TOKENS
};

// 4. CREATE components using tokens
const card = penpot.createRectangle();
card.fills = [{ fillColor: TOKENS.colors.surface.color, fillOpacity: 1 }];
card.borderRadius = TOKENS.borderRadius.card;
// ...
```

---

## Summary: The Golden Rules

1. **Design Tokens First:** ALWAYS verify design tokens exist before creating components. If missing, CREATE THEM FIRST! Never use hardcoded styling values - always reference tokens (except for explicitly defined device/layout values).
2. **Font Verification:** ALWAYS check `penpot.fonts.all` before setting fontFamily - fonts must exist in Penpot!
3. **Typography Updates:** Update BOTH typography assets AND all text elements when changing fonts
4. **Text Wrapping:** Set `growType: "auto-height"` for long text - default "auto-width" causes clipping!
5. **Element Centering:** Use math to center elements - don't guess positions! Formula: `x = parent.x + (parent.width - child.width) / 2`
6. **Padding Consistency:** Left/right AND top/bottom padding must be equal (unless stacking elements) - calculate positions to ensure symmetry! Use consistent values for padding, margins, and border radius throughout the design.
7. **Z-Order:** Always use `insertChild(index, element)` for explicit control
8. **Verification:** Export and VIEW after creating each screen (check fonts, wrapping, centering, z-order, margins!)
9. **Positioning:** Use grid layout to avoid overlapping boards. Expand board height to show full scrollable content (not just viewport)
10. **ClipContent:** Set to `false` unless specifically needed
11. **Visual Work:** Code success ≠ visual correctness - always verify visually
12. **Test Early:** Create one, verify one, then proceed
13. **Naming & Grouping:** Always use descriptive names (ComponentName/ElementType) and group related elements with `penpot.group()`
14. **Platform Knowledge:** Understand how Penpot works before implementing at scale
15. **Page Organization:** Cannot move shapes between pages via API - accept manual cleanup or create on correct page from start
16. **Comprehensive Verification:** Always verify against requirements (colors, typography, components, screens, organization) - don't assume correctness
17. **Export Verification:** Use actual shape.id (not name) with export_shape tool for visual verification

---

**Remember:** In visual design work, the only source of truth is what you see with your eyes. Code execution proves nothing. Always export and verify visually!
