# CLAUDE.md - F&B Tycoon Production App

## Project Overview

**F&B Tycoon** is a mobile learning app that transforms PMP exam preparation into an interactive, game-based experience through F&B restaurant management scenarios.

**Framework:** HeroUI Native (React Native + Expo 54)
**Target Platform:** iPhone (portrait only)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios
```

## Project Structure

```
pmp-prod-v2/
├── src/
│   ├── app/                     # Expo Router pages
│   │   ├── (tabs)/              # Main tab navigation
│   │   │   ├── home/            # Home tab screens
│   │   │   ├── courses/         # Courses tab screens
│   │   │   ├── practices/       # Practice quiz screens
│   │   │   └── settings/        # Settings tab screens
│   │   ├── _layout.tsx          # Root layout with providers
│   │   └── index.tsx            # Root redirect to tabs
│   ├── components/              # Shared components
│   ├── contexts/                # React contexts
│   └── helpers/                 # Utility functions
├── themes/
│   └── fnb-tycoon.css           # F&B Tycoon color theme
├── assets/                      # Static assets
├── global.css                   # Tailwind + HeroUI imports
└── app.json                     # Expo configuration
```

## Navigation Structure

The app uses a bottom tab navigation with 4 tabs:

| Tab       | Icon        | Purpose                          |
|-----------|-------------|----------------------------------|
| Home      | 🏠 home     | Dashboard, streaks, continue     |
| Courses   | 📚 book-open| Browse learning paths            |
| Practices | 📝 edit-3   | Quizzes and mock exams           |
| Settings  | ⚙️ settings | Profile and preferences          |

## Theming

The app uses the F&B Tycoon theme (warm restaurant palette):

**Primary Colors:**
- Background: Warm cream `oklch(0.965 0.012 75)`
- Accent: Copper amber `oklch(0.68 0.145 55)`
- Success: Herb green `oklch(0.62 0.14 160)`
- Warning: Warm honey `oklch(0.75 0.13 70)`
- Danger: Spicy red `oklch(0.58 0.18 25)`

**Dark Mode:**
- Background: Deep warm black `oklch(0.155 0.012 55)`
- Accent: Brighter copper `oklch(0.72 0.14 55)`

## Component Usage

HeroUI Native provides 23+ components. Key ones used:
- `Card` - Content containers
- `Button` - Actions
- `Switch` - Toggle settings
- `Tabs` - Segmented controls
- `Toast` - Notifications

Import pattern:
```tsx
import { Card, Button, Switch } from 'heroui-native';
```

## Styling

Uses Uniwind (Tailwind for React Native):
```tsx
<View className="flex-1 bg-background p-4 gap-3">
  <AppText className="text-foreground font-semibold">Title</AppText>
</View>
```

## Key Dependencies

- `heroui-native` - UI component library
- `expo-router` - File-based navigation
- `react-native-reanimated` - Animations
- `zustand` - State management
- `react-native-markdown-display` - Lesson content rendering

## Development Guidelines

1. **Component Patterns**
   - Use HeroUI components for consistency
   - Wrap Feather icons with `withUniwind` for styling
   - Use `AppText` instead of RN `Text` for theming

2. **Animation**
   - Use `FadeInDown` for list items
   - Stagger animations with `delay(index * 100)`
   - Respect reduced motion preferences

3. **Theme Colors**
   - Use semantic colors: `text-foreground`, `bg-background`, `text-accent`
   - Use `cn()` from heroui-native for conditional classes

## Related Documentation

- [HeroUI Native Docs](https://www.heroui.com)
- [Expo Router Docs](https://docs.expo.dev/router)
- [Production App Plan](/Users/hoangnamhai/Documents/PMP course/docs/planning/app-prod-v2.md)
