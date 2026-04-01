# React Native Code Rules

A living document for project conventions, architecture boundaries, and consistency rules.

## 1) Components

- Functional components only (no class components)
- Named exports only
- One component per file for shared or reusable components
- Props must use explicit TypeScript interfaces named `ComponentNameProps`
- Destructure props in the function signature
- Keep components focused and small
- Move non-trivial view logic into hooks or utility functions
- Use `React.memo()` only for components that benefit from it, especially list items or frequently re-rendered pure components
- Do not wrap every component in `React.memo()` by default
- Prefer controlled composition over deeply nested prop drilling
- Avoid anonymous inline render functions in heavily rendered lists unless justified

---

## 2) Styling

- Use NativeWind with `className` for the default styling approach
- Do not use `StyleSheet.create()` for normal app UI
- Avoid inline style objects for standard layout and visual styling
- All design tokens such as colors, spacing, typography, radius, and shadows must live in `tailwind.config.js`
- Use dark mode with NativeWind `class` strategy
- Use platform modifiers like `ios:` and `android:` when the difference is small and purely presentational
- Use an 8px spacing system
- Use `rounded-xl` as the default radius unless the component design requires something else
- Interactive elements should respect minimum touch targets of 44x44

### Allowed exceptions

Use `style` only when NativeWind is not a good fit, such as:

- animated styles
- runtime-calculated dimensions
- third-party libraries that require style objects
- absolute pixel values computed from device measurements

In those cases:

- keep the exception local
- document why it is needed if not obvious
- do not mix large style objects into otherwise simple components

---

## 3) State Management

- Use Redux Toolkit for global app state
- Do not use vanilla Redux
- Do not use Context API for global business state
- Context is allowed for narrow cross-cutting concerns such as theme bridge, feature providers, or dependency injection where Redux would be excessive
- Each domain should own its slice under `src/store/slices` or a feature-local store structure
- Async business flows should use `createAsyncThunk` or RTK Query depending on the use case
- Server state and API caching should use RTK Query
- API calls should go through RTK Query `createApi` by default
- Typed hooks must always be used

```ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
```

- Local ephemeral UI state such as modal visibility, input drafts, and temporary toggles should stay in component state
- Do not put obviously local state into Redux unless multiple screens truly need it

---

## 4) Navigation

- Use `@react-navigation/native` as the navigation standard
- Use explicit navigator configuration, not file-based routing
- Keep navigator definitions centralized under `src/navigation/`
- Recommended navigator split:
  - `RootNavigator` for app bootstrap and auth branching
  - `AuthNavigator` for unauthenticated flows
  - `AppNavigator` for authenticated flows
  - feature-level nested stack/tab navigators only when needed
- Keep route names in typed param lists
- Always type navigation params
- Use navigation helper types for screens instead of `any`
- Deep linking should be configured explicitly via React Navigation linking config
- Protected navigation should be handled at the root navigator level based on auth state
- Avoid navigating directly from low-level utility modules
- Prefer screen-level navigation actions and dedicated navigation helpers where needed
- Avoid over-nesting navigators without a clear UX reason

### Recommended structure

```txt
src/
  navigation/
    index.ts
    linking.ts
    RootNavigator.tsx
    AuthNavigator.tsx
    AppNavigator.tsx
    types.ts
```

### Navigation typing example

```ts
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  TaskDetails: { taskId: string };
};
```

### Rules for screen files

- One screen per file
- Screen components should not contain navigator definitions
- Route param parsing should happen near the screen boundary
- Validate critical params before using them
- Keep deep link parsing centralized where possible

---

## 5) Imports

- Use path alias `@/` for `src/`
- Import order should be:
  1. React and React Native
  2. third-party libraries
  3. internal `@/` imports
  4. relative imports
- Use barrel exports carefully
- Barrel exports are good for feature public APIs
- Do not create barrels that accidentally expose private internals or cause circular imports

---

## 6) Error Handling

- Every top-level screen should be protected by a practical error boundary strategy
- Global fatal errors and rendering errors should be captured centrally
- API errors should be normalized at the RTK Query layer when possible
- User-facing errors should be shown via toast, snackbar, or inline error UI
- Avoid blocking alerts for normal errors
- Never leave empty `catch {}` blocks
- Either handle, transform, report, or rethrow errors intentionally
- Log unexpected errors in development and send them to monitoring in production

---

## 7) Testing

- Test files should be colocated with the unit under test
- Use `Component.test.tsx` naming
- Test behavior, not implementation details
- Prefer React Native Testing Library patterns
- Mock network boundaries, not every internal function
- Redux-related tests should use real slices/store setup where reasonable
- Minimum baseline:
  - one test per screen
  - one test per shared component
  - one test per critical custom hook
  - one test for each important reducer or API behavior

---

## 8) Folder Structure

Suggested baseline:

```txt
src/
  app/
  components/
  features/[feature-name]/
    components/
    hooks/
    screens/
    types/
    utils/
  hooks/
  navigation/
  services/
  store/
  types/
  utils/
```

### Feature module preference

For medium or large apps, prefer grouping by feature:

```txt
src/features/tasks/
  components/
  hooks/
  screens/
  types/
  utils/
```

Rules:

- shared reusable UI goes into `components/`
- feature-specific UI stays inside the feature
- avoid dumping everything into `utils/`
- avoid cross-feature imports when a shared layer should exist instead

---

## 9) Screen Architecture

- Separate screens into **Container** and **Presentational** components when complexity justifies it

### Container Components

- Responsible for:
  - data fetching
  - state management (Redux, hooks)
  - API calls
  - business logic and calculations
- Can use side effects (`useEffect`, RTK Query, etc.)
- Should not contain heavy JSX markup

### Presentational Components

- Responsible only for rendering UI
- Receive all data via props
- No data fetching or business logic
- Minimal to no side effects
- Focused on JSX and layout

Benefits:

- Easier testing (pure UI components)
- Better separation of concerns
- Reusability of UI components

---

## 10) Hooks

- Custom hooks must start with `use`
- Hooks should encapsulate reusable stateful logic, not hide unrelated side effects
- Do not create hooks that merely rename one or two values unless they improve clarity materially
- Keep hooks focused on a single concern
- Separate UI hooks from data hooks when possible

---

## 11) Forms

- Use `react-hook-form` for form state management
- Use `zod` for validation schemas
- No third-party UI/UX form libraries are allowed
- Validation schemas should live close to the feature
- Avoid hand-written validation logic spread across components
- Show field errors inline and consistently

---

## 12) API and Data Layer

- RTK Query is the standard API layer
- Define one or more API services by domain, not one giant file
- Transform API responses at the API boundary when needed
- Keep DTO types separate from app/domain models when the backend contract is unstable or noisy
- Do not leak raw backend response shapes deep into UI components

---

## 13) Performance

- Optimize only after identifying a real issue or a high-risk render path
- Use `React.memo`, `useMemo`, and `useCallback` intentionally, not mechanically
- Lists should use stable keys
- Use `FlatList` or `SectionList` correctly for large data sets
- Avoid unnecessary derived state
- Avoid expensive calculations in render paths

---

## 14) Native and Platform-Specific Code

- Keep native module wrappers isolated behind clear interfaces
- Platform-specific files such as `.ios.ts` and `.android.ts` are preferred when logic materially differs
- Do not scatter `Platform.OS === ...` checks across the codebase without reason
- Permission handling should be centralized per capability

---

## 15) Linting and Formatting

- Enforce rules with ESLint and Prettier
- Prefer automated enforcement over team memory
- Add import sorting and unused import cleanup rules where safe
- CI should fail on lint and type errors

---

## 16) UI & Design Quality

### Package Installation Policy

- Do NOT ask before installing UI/styling packages — install what the design requires
- When a screen needs animations → install `react-native-reanimated`
- When a screen needs micro-interactions → install `lottie-react-native`
- When a screen needs icons → install the required icon set
- When a screen needs gestures → install `react-native-gesture-handler`
- When a component needs a specific library (charts, maps, camera, etc.) → install it
- Always use package manager (`npm` or `yarn`) compatible with the project setup
- Always run `npx tsc --noEmit` after installing new packages

### Design Principles

- Maximum 2 font families (one heading, one body)
- Use shadows sparingly — only for elevated elements (cards, modals, FABs)
- Provide loading states for every async operation (skeleton or spinner)
- Provide empty states with illustration + action for every list screen
- Consistent icon sizing: 20px in-text, 24px buttons, 28px tab bar
- Use a single primary icon set consistently
- Animations under 300ms for UI transitions
- Every interactive element must have visual feedback (press state, haptics)

### Component Quality

- Components must be production-ready
- Include proper press states and visual feedback
- Add accessibility labels to all interactive elements
- Provide skeleton/loading variants for data-dependent components
- Handle error and empty states in list components
- Use keyboard-aware layouts for screens with inputs

---

## 17) Commands

```bash
npm run start
npm run start:clear
npm run ios
npm run android
npm test
npm run lint
npx tsc --noEmit
```

---

## 18) Workflow

- Always run `npx tsc --noEmit` after completing code changes
- Create feature branches before changes — never commit directly to main
- Prefer running single test files over full suite
- When adding a new feature, scaffold the full `features/[name]/` structure first
- When a component is used in 2+ features, extract it to `components/`

---

## 19) Don’ts

- NEVER use `any` — use `unknown` and narrow or define proper types
- NEVER use `StyleSheet.create()` or inline style objects — use NativeWind `className`
- NEVER create API calls outside of RTK Query
- NEVER put business logic inside components — extract to hooks or thunks
- NEVER duplicate a component across features — extract to shared
- NEVER use `require()` — always ES module imports
- NEVER skip Error Boundaries on screens
- NEVER ask permission to install a required package — just install it

