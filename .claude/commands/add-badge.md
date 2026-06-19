# /add-badge

Add a new badge to the gamification system.

## Usage
`/add-badge name="Maths Wizard" description="..." condition="streak >= 5" rarity=rare icon=🔢`

## What to do
1. Read `src/services/gamification.js`
2. Add the new badge to the BADGES array with:
   - Unique `id` in kebab-case
   - `name`, `description`, `icon`, `rarity` (common/rare/epic/legendary), `type`
   - `condition` function that receives the badge state object
3. If a badge image exists in `src/assets/badges/`, reference it
4. Explain what state properties are available in `condition()`
