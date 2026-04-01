# Coloryx — Analysis & Technical Design

## 1) Product Summary
**Coloryx** is a mobile game focused on color perception and short-term visual memory.

The app has 2 core game modes:

### 1.1) Odd One Out
The player sees a 3 x 3 grid of colored tiles. All tiles look nearly identical except one tile, which differs slightly.

The main mechanic is to make the odd tile different using **saturation** changes.

The grid is always fixed at **9 tiles (3 x 3)**.
Difficulty does **not** come from tile count.
Instead, difficulty increases from round to round by making the tiles more similar to each other.

### 1.2) Remember the Color
The app shows a target color to the player for 5 seconds.
After that, the target color is hidden.
The player must recreate the color by adjusting 3 sliders:
- Hue
- Saturation
- Brightness

The closer the recreated color is to the original, the higher the score.

---

## 2) Goals
### MVP Goals
- Deliver a simple, polished mobile game with fast sessions
- Make gameplay understandable in a few seconds
- Keep the interaction satisfying and visual
- Support replayability through increasing round difficulty and scoring
- Build a strong foundation for future modes, leaderboards, streaks, and monetization
- Keep the MVP fully offline

### Non-Goals for MVP
- Multiplayer
- Social features
- Online leaderboard backend
- Complex progression system
- Daily events
- Cosmetics marketplace

---

## 3) Target Platform
### MVP Recommendation
- Mobile first
- iOS + Android

This idea fits mobile very well because:
- sessions are short
- touch sliders feel natural
- visual puzzle games work well on phones
- the game can be played casually in short breaks

---

## 4) Core Gameplay Loops
### 4.1) Odd One Out Loop
1. Start run with 3 lives
2. Render a 3 x 3 grid with one slightly different tile
3. Player taps the odd tile
4. If correct:
   - award score
   - increase round difficulty by reducing the saturation gap
   - start next 3 x 3 round
5. If wrong:
   - remove 1 life
   - give feedback
   - continue or end run when lives reach 0

### 4.2) Remember the Color Loop
1. Start round
2. Show target color for 5 seconds
3. Hide target color
4. Show H/S/B sliders
5. Player adjusts sliders to recreate the color
6. Player submits answer
7. Calculate similarity score
8. Show comparison result
9. Start next round

---

## 5) UX Principles
- Very fast start
- Minimal UI clutter
- Strong visual feedback
- Large touch targets
- Smooth transitions between rounds
- Clear score feedback
- No confusing color terminology for casual players unless needed
- Support both beginners and skilled players with gradual difficulty scaling

---

## 6) Game Modes Detail
## 6.1) Odd One Out
### Core Rule
All 9 tiles share the same hue and brightness.
Only the odd tile differs in saturation.

This creates a clean perception challenge because the user must detect a subtle color intensity difference rather than an entirely different color.

### Difficulty Variables
Possible variables:
- saturation gap between normal tiles and odd tile
- round timer
- number of mistakes allowed
- speed of progression

### Locked MVP Behavior
- The grid is always fixed at **3 x 3 (9 tiles)**
- The run starts with **3 hearts / 3 lives**
- Difficulty increases by reducing the saturation gap after each correct round
- The player continues until all 3 lives are lost

### Grid Mapping
- Fixed layout: 3 x 3

### Scoring Recommendation
Score can be based on:
- correct answer
- remaining time if timer is added
- current round number
- current saturation-gap difficulty

Example formula:
- base round points + round-depth bonus + optional time bonus

---

## 6.2) Remember the Color
### Core Rule
The player memorizes one color shown for 5 seconds.
Then they try to reconstruct it using H/S/B controls.

### Input Model
The player adjusts:
- Hue: 0–360
- Saturation: 0–100
- Brightness: 0–100

### Recommended MVP UX
- Show a large target color card during memorization
- After 5 seconds, hide the original color
- Show a live preview card that updates as sliders move
- On submit, show:
  - original color
  - guessed color
  - score
  - difference breakdown if useful

### Scoring Recommendation
The score should be based on the distance between original and guessed color values.

Possible scoring dimensions:
- hue difference
- saturation difference
- brightness difference

Simple MVP approach:
- calculate normalized error
- convert error to 0–100 score

### Result Presentation
Show the user:
- original color preview
- guessed color preview
- total match percentage
- optional per-channel delta: H / S / B

---

## 7) Difficulty Design
## 7.1) Odd One Out Difficulty
Difficulty increases by:
- decreasing saturation difference between normal tiles and the odd tile
- optionally adding a timer later
- increasing pressure through longer runs

### Locked MVP Model
- There is no tile-count difficulty selection
- Every round uses a fixed 3 x 3 grid
- Difficulty scales inside the run by making the odd tile more similar to the other tiles after each correct answer
- The player has 3 lives

This creates a very clear game identity:
- same board structure every round
- challenge comes from visual subtlety, not layout complexity

## 7.2) Remember the Color Difficulty
Difficulty can increase by:
- using more similar colors near gray or near dark values
- reducing preview time below 5 seconds later
- hiding numeric H/S/B values
- requiring exact recreation without aid

### Recommended MVP Model
- Keep preview time fixed at 5 seconds
- Randomize target colors within a controlled range
- Later add advanced difficulty presets

---

## 8) Scoring & Progression
### MVP Scoring
Keep scoring simple and readable.

#### Odd One Out
- +points for each correct tap
- optional round-depth bonus
- run continues until 3 lives are lost

#### Remember the Color
- score from 0 to 100 based on similarity
- optional star rating:
  - 90–100: excellent
  - 75–89: great
  - 50–74: good
  - below 50: try again

### MVP Progression Recommendation
- best score per mode
- current streak
- session stats only or device-local stats

### Post-MVP Progression Ideas
- unlockable themes
- endless run mode
- daily challenge
- achievements
- ranked mode

---

## 9) Visual & Interaction Design
### Style Direction
- clean, modern, minimal
- focus on color surfaces rather than decorative UI
- soft animations
- satisfying transitions when round changes

### Important UX Details
- avoid too much text during gameplay
- always keep preview area large
- use high contrast for non-color UI text/buttons
- ensure sliders are easy to control precisely
- make tapping tiles responsive with instant feedback

### Animation Opportunities
- reveal tiles with fade/scale
- pulse on correct answer
- shake on wrong answer
- smooth transition between shown color and hidden phase
- animate score count-up after submission

---

## 10) Accessibility & Design Risks
### Accessibility Concerns
This product is inherently color-based, so accessibility must be handled carefully.

Important considerations:
- some players may have color vision deficiencies
- very subtle saturation differences may become frustrating or impossible for some users
- low brightness values may be hard to judge on some screens
- different phone displays may affect perceived color accuracy

### MVP Recommendation
- include a warning that gameplay depends on color perception
- keep early levels more forgiving
- optionally provide alternate visual assistance later

### Design Risk
Color rendering varies by screen quality, brightness, display mode, and operating system settings.
This means the game should rely on relative visual challenge rather than strict professional color accuracy.

---

## 11) Technical Recommendation
### Mobile Stack Recommendation
- Bare React Native
- TypeScript
- React Navigation
- Zustand or Redux Toolkit for lightweight game state
- NativeWind for styling if desired
- React Native Reanimated for smooth UI transitions
- AsyncStorage or MMKV for local best scores and settings

### Locked MVP Choice
- Bare React Native
- TypeScript
- React Navigation
- Zustand
- NativeWind
- AsyncStorage

### Why No Backend for MVP
The core game loop is fully local:
- round generation is local
- score calculation is local
- stats can be stored locally

A backend becomes useful only for:
- global leaderboards
- accounts
- cloud sync
- analytics dashboards
- A/B testing
- live events

---

## 12) Core Technical Design
## 12.1) Color Representation
Use HSB/HSV as the main game logic model because:
- the game rules are based directly on hue, saturation, brightness
- slider inputs map naturally to these values
- difficulty tuning is easier than raw RGB tuning

Internally, colors can be generated in HSB/HSV and converted to display color strings for React Native rendering.

## 12.2) Odd One Out Generation Logic
For each round:
1. Choose a base hue
2. Choose a base brightness
3. Choose a base saturation
4. Create all normal tiles with that base color
5. Pick one random tile as the odd tile
6. Apply a saturation delta to the odd tile
7. Shuffle the grid
8. On each successful round, reduce the saturation delta for the next round

Important balancing rules:
- the board always stays 3 x 3
- round difficulty comes only from decreasing the saturation gap
- early rounds should be forgiving enough to teach the mechanic
- difficulty curve must be tuned carefully so it feels fair rather than random

## 12.3) Remember the Color Generation Logic
For each round:
1. Generate a target HSB color
2. Show target for 5 seconds
3. Hide target
4. Initialize player sliders
5. Track live guessed HSB values
6. On submit, compare guess to target
7. Produce normalized score

### Initial Slider Recommendation
Possible options:
- start sliders at random values
- start sliders at center values
- start sliders at the previous round values

Recommended MVP choice:
- start at neutral defaults for consistency
  - Hue: random or 180
  - Saturation: 50
  - Brightness: 50

## 12.4) Scoring Calculation
### Odd One Out
Simple:
- correct = success
- wrong = fail or penalty

### Remember the Color
Suggested formula idea:
- measure hue distance with circular logic
- measure saturation distance normally
- measure brightness distance normally
- combine them using weights

Example weighting concept:
- Hue: 40%
- Saturation: 30%
- Brightness: 30%

This weighting makes sense because hue changes often feel the most visually important.

---

## 13) State Model
### Example App State Areas
- selected mode
- current round
- current score
- best score per mode
- streak
- remaining lives
- timer state
- generated target color
- guessed color
- game status
  - idle
  - previewing
  - active
  - submitted
  - result
  - gameOver

### Suggested Separation
- game logic state
- UI/transitions state
- persisted local stats/settings

---

## 14) Screens
### MVP Screens
1. Home
2. Mode Select
3. Odd One Out Game
4. Remember the Color Game
5. Result / Game Over
6. Settings

### Home
- title
- play button
- best scores summary

### Mode Select
- choose game mode
- choose difficulty where relevant

### Odd One Out Game Screen
- score
- timer or lives if enabled
- tile grid
- feedback state

### Remember the Color Screen
- preview phase
- live guessed color preview
- H/S/B sliders
- submit button

### Result Screen
- final score
- best score
- retry
- back to menu

### Settings Screen
Possible items:
- sound on/off
- haptics on/off
- dark/light theme if supported
- reset local progress

---

## 15) Monetization Options
### MVP Recommendation
Start without aggressive monetization.

Possible options:
- free app with ads
- premium one-time purchase
- free with optional ad removal

### Best Early Recommendation
- free download
- minimal ads after sessions or optional reward ads later
- optional premium remove ads purchase post-MVP

Because this is a simple casual game, user retention and polish are more important first than complex monetization.

---

## 16) Analytics Ideas
### Useful MVP Analytics
If analytics is added later, useful events include:
- mode selected
- difficulty selected
- round started
- round completed
- round failed
- average score by mode
- session length
- retry rate
- slider interaction completion rate

This will help identify:
- whether one mode is much more fun
- where users quit
- whether difficulty is too harsh

---

## 17) Roadmap Suggestion
### Phase 1 — MVP
- local-only app
- both core modes
- difficulty selection
- scoring
- best scores saved locally
- polished basic animations
- sound/haptic toggles

### Phase 2
- streak system
- endless mode
- daily challenge
- achievements
- theme packs

### Phase 3
- account system
- cloud sync
- online leaderboards
- events / seasons

---

## 18) Decisions Locked
### Locked Decisions
- Odd One Out uses **3 lives / 3 hearts**
- Remember the Color is **visual-only** during guessing; numeric H/S/B values are hidden
- Best scores and progression are **separate per mode**
- Tech stack is **Bare React Native + React Navigation + Zustand + NativeWind**
- MVP is **fully offline**
- Odd One Out board is always **3 x 3 (9 tiles)**
- Odd One Out difficulty increases by making tiles more similar each round (decreasing saturation gap)

---

## 19) Updated Product Direction
The current MVP direction is now very clear:
- fully offline app
- separate scores per mode
- fixed 3 x 3 board for Odd One Out
- 3-heart life system for Odd One Out
- difficulty scaling through color similarity, not board size
- visual-only guessing experience for Remember the Color
- no backend yet

This is a strong MVP direction because it keeps both modes clean and easy to understand.
The biggest success factors will be:
- fair difficulty curve
- satisfying feedback
- strong round transitions
- polished color preview and slider UX

## 20) Implementation Directives (Authoritative)
This document is authoritative for implementation. Follow these directives strictly when coding.

### Gameplay
- Odd One Out:
  - Fixed 3x3 grid
  - 3 lives per run
  - On correct: increment round, reduce saturation delta
  - On wrong: decrement life; end run at 0 lives
- Remember the Color:
  - Show target color for exactly 5 seconds
  - Hide target; do not show numeric H/S/B
  - Provide sliders for Hue (0–360), Saturation (0–100), Brightness (0–100)
  - Compute score on submit and show comparison

### Difficulty Curve (Odd One Out)
- Initialize saturation delta (ΔS) at a forgiving value (e.g., 25)
- Each successful round reduces ΔS by a fixed step (e.g., 1–2)
- Clamp ΔS to a minimum floor (e.g., 3–5) to avoid impossibility
- Use same hue and brightness across all tiles per round

### Scoring
- Odd One Out:
  - Base points per correct round (e.g., 10)
  - Add round-depth bonus (e.g., +roundIndex)
- Remember the Color:
  - Compute normalized error across H/S/B
  - Convert to 0–100 score
  - Weighting: Hue 40%, Saturation 30%, Brightness 30%

### State
- Use Zustand store with slices:
  - game (mode, round, score, lives, status)
  - color (targetHSB, guessHSB)
  - stats (bestScores per mode)
- Persist stats via AsyncStorage

### Tech Stack (Locked)
- Bare React Native
- TypeScript
- React Navigation
- Zustand
- NativeWind
- AsyncStorage

### UI/UX
- Large color previews and tiles
- Immediate tap feedback (scale/pulse)
- Smooth transitions between phases (Reanimated)
- No unnecessary text during gameplay

### Non-Goals (Enforced)
- No backend
- No multiplayer
- No online leaderboards

### Acceptance Criteria
- Both modes playable offline
- Stable 60fps interactions on mid-range devices
- Accurate HSB handling and consistent color rendering
- Deterministic scoring and difficulty progression

End of document.

