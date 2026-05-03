---
name: Clean render logic
description: Avoid inline logic/variables inside .map() callbacks - extract to helper functions or components for maintainability
type: feedback
---

Don't put computed variables (like `const aired = ...`) inside `.map()` render callbacks. Extract logic to helper functions or separate components instead.

**Why:** The user considers it bad practice and hard to maintain.

**How to apply:** When rendering lists, keep `.map()` callbacks thin. Move any non-trivial logic to named helper functions or extract the item into its own component.
