# F&B Tycoon - PMP Learning App

A mobile learning platform that transforms PMP exam preparation into an interactive, game-based experience through F&B restaurant management scenarios.

Built with [HeroUI Native](https://github.com/heroui-inc/heroui-native) + Expo 54.

## Features

- **Interactive Lessons** - Scenario-based micro-lessons with F&B restaurant narratives
- **Learning Paths** - Structured curriculum covering People, Process, and Business domains
- **Practice Quizzes** - Quick quizzes and full mock exams
- **Gamification** - Streaks, XP, achievements, and progress tracking
- **Dark Mode** - Full light/dark theme support

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

3. Run on iOS simulator

   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── app/                     # Expo Router pages
│   ├── (tabs)/              # Main tab navigation
│   │   ├── home/            # Dashboard & continue learning
│   │   ├── courses/         # Learning paths
│   │   ├── practices/       # Quizzes & mock exams
│   │   └── settings/        # Profile & preferences
│   └── _layout.tsx          # Root layout with providers
├── components/              # Shared components
├── contexts/                # React contexts (theme, etc.)
└── helpers/                 # Utility functions
```

## Navigation

| Tab       | Purpose                              |
|-----------|--------------------------------------|
| Home      | Dashboard, streaks, continue learning|
| Courses   | Browse all learning paths            |
| Practices | Quizzes, mock exams, challenges      |
| Settings  | Profile, preferences, notifications  |

## Theme

Uses the **F&B Tycoon** warm restaurant palette:
- Copper amber primary color
- Warm cream backgrounds
- Fresh herb greens for success
- Spicy reds for errors

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

## Related

- [HeroUI Native](https://github.com/heroui-inc/heroui-native)
- [Expo Router](https://docs.expo.dev/router)
- [Production App Plan](../../../"PMP course"/docs/planning/app-prod-v2.md)
