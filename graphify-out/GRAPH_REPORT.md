# Graph Report - restaurant-menu  (2026-10-12)

## Corpus Check
- Large corpus: 24 files · ~1,221,966 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 71 nodes · 77 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Build And Lint Configuration
- React Menu Application
- Development Tool Dependencies
- Menu Food Photography
- Restaurant Identity And Contact
- Package Script Commands
- React Vite Starter Assets
- Runtime React Dependencies
- Graphify Repository Instructions
- Vite Favicon Asset
- Social Icon Sprite
- Starter Hero Graphic

## God Nodes (most connected - your core abstractions)
1. `Restaurant menu` - 8 edges
2. `scripts` - 5 edges
3. `App()` - 5 edges
4. `react` - 3 edges
5. `Pizzaria Beb Lhouma` - 3 edges
6. `react-dom` - 2 edges
7. `@eslint/js` - 2 edges
8. `@vitejs/plugin-react` - 2 edges
9. `eslint` - 2 edges
10. `eslint-plugin-react-hooks` - 2 edges

## Surprising Connections (you probably didn't know these)
- `React atom logo` --semantically_similar_to--> `React`  [INFERRED] [semantically similar]
  src/assets/react.svg → README.md
- `Vite lightning logo with decorative parentheses` --semantically_similar_to--> `Vite`  [INFERRED] [semantically similar]
  src/assets/vite.svg → README.md
- `Stuffed baguette with fries and dipping sauces` --conceptually_related_to--> `Restaurant menu`  [INFERRED]
  public/images/menu/baguette.png → index.html
- `Two chicken-filled flatbread wraps with vegetables and sauce` --conceptually_related_to--> `Restaurant menu`  [INFERRED]
  public/images/menu/libanais1.png → index.html
- `Large chicken-filled flatbread wrap with sauce and vegetables` --conceptually_related_to--> `Restaurant menu`  [INFERRED]
  public/images/menu/libanais.jpg → index.html

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 0 - "Build And Lint Configuration"
Cohesion: 0.17
Nodes (13): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+5 more)

### Community 1 - "React Menu Application"
Cohesion: 0.24
Nodes (8): react, react-dom, App(), icon(), Product(), SocialIcon(), menuCategories, restaurant

### Community 2 - "Development Tool Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

### Community 3 - "Menu Food Photography"
Cohesion: 0.22
Nodes (9): Restaurant menu, Stuffed baguette with fries and dipping sauces, Two chicken-filled flatbread wraps with vegetables and sauce, Large chicken-filled flatbread wrap with sauce and vegetables, Sliced mushroom and ham pizza, Whole mushroom and ham pizza on a wooden board, Close-up of pizza with olives and basil, Seeded-roll sandwiches with lettuce, tomato, and cheese (+1 more)

### Community 4 - "Restaurant Identity And Contact"
Cohesion: 0.50
Nodes (5): Pizzaria Beb Lhouma menu page entry, Pizzaria Beb Lhouma, Restaurant contact details and social links, Restaurant phone numbers and online profiles, Pizzaria Beb Lhouma logo with a flaming pizza oven, pizza, and phone numbers

### Community 5 - "Package Script Commands"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 6 - "React Vite Starter Assets"
Cohesion: 0.40
Nodes (5): React and Vite template README, React, Vite, React atom logo, Vite lightning logo with decorative parentheses

### Community 7 - "Runtime React Dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

## Knowledge Gaps
- **18 isolated node(s):** `@types/react`, `@types/react-dom`, `Graphify repository guidance`, `Graphify graph-generation rules`, `Restaurant phone numbers and online profiles` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 39 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Development Tool Dependencies` to `Build And Lint Configuration`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `Restaurant menu` (e.g. with `Stuffed baguette with fries and dipping sauces` and `Two chicken-filled flatbread wraps with vegetables and sauce`) actually correct?**
  _`Restaurant menu` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@types/react`, `@types/react-dom`, `Graphify repository guidance` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `react` connect `React Menu Application` to `Build And Lint Configuration`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `scripts` connect `Package Script Commands` to `Build And Lint Configuration`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._