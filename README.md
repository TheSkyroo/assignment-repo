# Food Product Explorer

A fully-featured food product discovery web app built with React and the [OpenFoodFacts](https://world.openfoodfacts.org) open database. Search by name or barcode, filter by category, sort by nutrition grade, and manage a persistent shopping cart — all powered by a free, community-maintained API with over 3 million products.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Component Reference](#component-reference)
- [State Management](#state-management)
- [Custom Hooks](#custom-hooks)
- [Known Limitations & Workarounds](#known-limitations--workarounds)

---

## Features

### Product Search
- **Name Search** — type any food product name; results update automatically with a 400ms debounce to avoid hammering the API on every keystroke
- **Barcode Search** — enter any EAN/UPC barcode (e.g. `737628064502`) to look up a specific product instantly
- Both search modes sit in a tabbed panel on the homepage — one input is always visible, zero layout shift

### Category Browsing
- **Category Filter** — a dropdown listing 50 real food categories (Beverages, Dairies, Snacks, Chocolates, etc.)
- Categories are fetched live from the OpenFoodFacts taxonomy API on app load and parsed from the taxonomy format (`en:beverages` → `Beverages`)
- A curated fallback list renders immediately so the dropdown is never empty while the API fetch is in flight

### Sorting (client-side, instant)
- Name A → Z
- Name Z → A
- Nutrition Grade: Best first (A → E)
- Nutrition Grade: Worst first (E → A)
- Sorts the already-loaded product array with no re-fetch — zero latency

### Product Cards
Each card in the responsive grid shows:
- Product image with graceful fallback placeholder
- Product name
- Category tag
- Ingredients snippet (truncated to 80 characters)
- Colour-coded nutrition grade badge (A = green → E = red)
- Add to Cart button (turns to "In Cart" once added)

### Load More Pagination
- Clicking **Load More** appends the next page of 24 results to the existing list
- The list is never replaced — scroll position is preserved
- Button hides when all pages have been loaded

### Product Detail Page (`/product/:barcode`)
Full product view accessible by clicking any card or navigating directly:
- Large product image
- Product name and brand
- Full ingredients text
- Nutrition facts table: energy (kcal), fat, saturated fat, carbohydrates, sugars, fibre, proteins, salt — all per 100g
- Large colour-coded nutrition grade badge
- Labels/tags as pill badges (e.g. vegan, gluten-free, organic, fair-trade)
- Additional info: quantity, packaging, countries of sale, stores
- Add to Cart button
- Back to Products link

### Shopping Cart
- **Add to Cart** on every product card and the detail page
- **Navbar badge** showing live item count
- **Slide-in drawer** from the right with:
  - Product image and name
  - Quantity `−` / `+` controls (removing last item removes the entry)
  - Individual remove button per item
  - Total item count at the bottom
  - Checkout button
- Cart state **persists across page refreshes** via `localStorage`
- Backdrop click closes the drawer

### Responsive Design
- Mobile-first TailwindCSS throughout
- Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Filter sidebar collapses to a toggle panel on small screens (tap "Filters & Sort" to expand)
- Sticky navbar at all breakpoints

### Loading & Error States
- **Skeleton cards** — 6 animated placeholder cards shown while fetching; no layout jump when results arrive
- **Error banner** — shown on every API failure with a human-readable message and a **Retry** button
- Aborted requests (from switching category/search mid-flight) are silently ignored — no false errors

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 8 |
| Routing | React Router v6 |
| Styling | TailwindCSS v3 |
| HTTP client | Axios |
| State management | React Context API + useReducer |
| Persistence | localStorage (cart only) |
| Prop validation | PropTypes |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TheSkyroo/assignment-repo

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Other commands

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

---

## Project Structure

```
food-explorer/
├── public/
├── src/
│   ├── components/             # All reusable UI components
│   │   ├── BarcodeSearch.jsx   # Barcode input + single-result display
│   │   ├── CartDrawer.jsx      # Slide-in cart panel with quantity controls
│   │   ├── CategoryFilter.jsx  # Category <select> dropdown
│   │   ├── ErrorBanner.jsx     # Full-page error state with Retry button
│   │   ├── GradeBadge.jsx      # Colour-coded nutrition grade circle
│   │   ├── Navbar.jsx          # Sticky top bar + cart icon with badge
│   │   ├── NutritionTable.jsx  # Per-100g nutrition facts table
│   │   ├── ProductCard.jsx     # Grid card: image, name, grade, add-to-cart
│   │   ├── SearchBar.jsx       # Name search input with clear button
│   │   ├── SkeletonCard.jsx    # Animated loading placeholder card
│   │   └── SortDropdown.jsx    # Client-side sort selector
│   ├── context/
│   │   └── AppContext.jsx      # Global state (useReducer) + localStorage sync
│   ├── hooks/
│   │   ├── useCart.js          # Cart actions: add, remove, updateQty, clear
│   │   ├── useCategories.js    # Fetch + parse taxonomy categories with fallback
│   │   ├── useDebounce.js      # Generic debounce hook (400ms default)
│   │   └── useProducts.js      # Fetch products with AbortController race-fix
│   ├── pages/
│   │   ├── HomePage.jsx        # Search + filters + product grid + pagination
│   │   └── ProductDetailPage.jsx  # Full product view by barcode URL param
│   ├── services/
│   │   └── api.js              # All Axios calls — single source of truth
│   ├── utils/
│   │   └── helpers.js          # getGradeColor, truncate, formatNumber, field getters
│   ├── App.jsx                 # Router + AppProvider wrapper
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Tailwind directives only
├── tailwind.config.js
├── vite.config.js              # Dev proxy for OpenFoodFacts (avoids CORS)
└── package.json
```

---

## API Reference

**Base URL:** `https://world.openfoodfacts.org`

All requests are proxied through Vite's dev server in development (`/off-proxy/*`) to avoid CORS restrictions. In production builds the direct URL is used.

### Endpoints in use

| Feature | Method | Endpoint | Notes |
|---|---|---|---|
| Search by name | GET | `/cgi/search.pl?search_terms={q}&json=true&page={p}&page_size=24` | Paginated |
| Products by category | GET | `/cgi/search.pl?action=process&tagtype_0=categories&tag_0={cat}&json=1&page={p}&page_size=24` | Original `/category/{name}.json` returns 503 |
| Product by barcode | GET | `/api/v0/product/{barcode}.json` | Returns `status: 0` if not found |
| All categories | GET | `/data/taxonomies/categories.json` | Original `/categories.json` returns 503 |

### Example requests

```
# Search
GET /cgi/search.pl?search_terms=chocolate&json=true&page=1&page_size=24

# Category
GET /cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=beverages&json=1&page=1&page_size=24

# Barcode lookup
GET /api/v0/product/737628064502.json

# Categories taxonomy
GET /data/taxonomies/categories.json
```

### Response shapes

**Search / Category response:**
```json
{
  "count": 12453,
  "page": 1,
  "page_size": 24,
  "products": [
    {
      "code": "737628064502",
      "product_name": "Thai peanut noodle kit",
      "categories": "Meals,Noodles",
      "ingredients_text": "Rice noodles, peanut sauce...",
      "nutrition_grades": "c",
      "nutriments": {
        "energy-kcal_100g": 385,
        "fat_100g": 12.5,
        "proteins_100g": 9.2
      },
      "image_url": "https://..."
    }
  ]
}
```

**Barcode response:**
```json
{
  "status": 1,
  "product": { ... }
}
```
`status: 0` means the barcode was not found in the database.

---

## Architecture & Design Decisions

### Vite Dev Proxy (CORS fix)
Browsers block direct cross-origin requests to `world.openfoodfacts.org` from `localhost`. Rather than a backend proxy server, Vite's built-in `server.proxy` forwards `/off-proxy/*` → `https://world.openfoodfacts.org/*` at the Node level, which has no CORS restriction. The `BASE_URL` in `api.js` switches automatically:

```js
const BASE_URL = import.meta.env.DEV
  ? "/off-proxy"       // goes through Vite proxy
  : "https://world.openfoodfacts.org";  // direct in production
```

### AbortController — Race Condition Fix
The API is slow (~6–10 seconds per request). Without cancellation, switching from a search to a category while the search is still in-flight causes the search to eventually fail and overwrite the category results with an error. The fix:

```
t=0s  starts search("chocolate")       ← stores AbortController in ref
t=1s  user clicks "Beverages"          ← ref.abort() kills search request instantly
                                        ← starts category fetch with new controller
t=7s  category fetch completes         ← shows results, nothing can overwrite them
```

Every call to `fetchProducts` aborts the previous request before starting. Aborted requests throw `CanceledError` (Axios name for `AbortError`) — these are caught and silently ignored, so no error UI is shown.

### Client-Side Sorting
Sorting never triggers an API call. The fetched `products` array is passed through a `useMemo` sort on every render when `sortOption` changes. This keeps the interaction instant regardless of network conditions.

### Cart Persistence
Cart state lives in `AppContext` (React's `useReducer`). An effect syncs `state.cart` to `localStorage` on every change. On app startup, the initial reducer state is hydrated from `localStorage`:

```js
const saved = JSON.parse(localStorage.getItem("food-cart") || "[]");
const [state, dispatch] = useReducer(reducer, { ...initialState, cart: saved });
```

### Defensive Null Handling
OpenFoodFacts product objects are highly inconsistent — many fields are missing on most products. All field access goes through helper functions in `utils/helpers.js`:

```js
export function getProductName(p) {
  return p?.product_name || p?.product_name_en || "Unknown Product";
}
export function getProductImage(p) {
  return p?.image_url || p?.image_front_url || p?.image_small_url || null;
}
```

Image `<img>` tags use `onError` to fall back to a placeholder URL. The app never crashes on a missing field.

---

## Component Reference

| Component | Props | Description |
|---|---|---|
| `ProductCard` | `product` | Grid card with image, name, grade badge, add-to-cart |
| `SearchBar` | `value`, `onChange`, `placeholder?` | Text input with search icon and clear button |
| `BarcodeSearch` | — | Self-contained barcode input + result display |
| `CategoryFilter` | — | Reads/writes `selectedCategory` from context |
| `SortDropdown` | — | Reads/writes `sortOption` from context |
| `GradeBadge` | `grade`, `size?` | Coloured circle — `sm` (28px) or `lg` (48px) |
| `NutritionTable` | `nutriments` | Per-100g table for 8 standard nutrients |
| `CartDrawer` | `open`, `onClose` | Slide-in panel with quantity controls |
| `SkeletonCard` | — | Animated grey placeholder card |
| `ErrorBanner` | `message`, `onRetry?` | Centred error state with optional retry button |
| `Navbar` | — | Sticky bar with logo and cart icon badge |

---

## State Management

All global state is in a single `useReducer` inside `AppContext`:

```js
{
  searchQuery:      "",        // current name search input
  barcodeQuery:     "",        // current barcode input
  selectedCategory: "",        // active category filter ("" = all)
  sortOption:       "name-asc",// active sort key
  products:         [],        // currently displayed products
  page:             1,         // current pagination page
  hasMore:          true,      // whether more pages exist
  isLoading:        false,     // global fetch in-flight flag
  error:            null,      // error message string or null
  cart:             []         // [{ product, quantity }, ...]
}
```

**Key reducer actions:**

| Action | Effect |
|---|---|
| `SET_SEARCH_QUERY` | Sets query, resets page/products/category |
| `SET_CATEGORY` | Sets category, resets page/products/searchQuery |
| `SET_SORT` | Updates sort key only (no re-fetch) |
| `APPEND_PRODUCTS` | Pushes next page onto existing array (Load More) |
| `CART_ADD` | Adds product or increments quantity if already present |
| `CART_UPDATE_QTY` | Updates quantity; removes if qty < 1 |

---

## Custom Hooks

### `useProducts()`
Returns `{ products, fetchProducts, loadMore }`. Manages the in-flight `AbortController` ref so that only one request is active at any time. Reads current state through a `useRef` mirror to avoid stale closures without adding state values to the `useCallback` dependency array.

### `useCategories()`
Returns `{ categories, loading, error, retry }`. Renders the fallback static list immediately (so the dropdown is never empty), then replaces it with API data once the taxonomy fetch completes. Silently ignores fetch errors — the fallback list stays in place.

### `useCart()`
Returns `{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, isInCart }`. Thin wrapper around the cart slice of `AppContext`.

### `useDebounce(value, delay)`
Standard debounce — returns the value only after `delay` ms of inactivity. Used in `HomePage` to gate name search API calls.

---

## Known Limitations & Workarounds

### OpenFoodFacts Server Speed
The API is maintained by a French non-profit on limited infrastructure. Search responses typically take 6–10 seconds. This is normal and expected. The app handles it with:
- 25-second Axios timeout on all calls
- Skeleton loading cards so the UI never looks broken
- Friendly error messages with Retry buttons
- AbortController to cancel stale requests immediately

### Broken Official Endpoints
Two endpoints documented in the OpenFoodFacts API are currently returning **503** server-side:

| Documented endpoint | Status | Workaround used |
|---|---|---|
| `/categories.json` | 503 (redirects to dead facets URL) | `/data/taxonomies/categories.json` |
| `/category/{name}.json` | 503 (redirects to dead facets URL) | `cgi/search.pl` with `tagtype_0=categories` filter |

These are server-side issues with no fix on our end. The workarounds produce identical data.

### Product Data Inconsistency
OpenFoodFacts is a crowd-sourced database. Many products are missing images, ingredient lists, nutrition data, or have incomplete names. All fields are guarded with `?.` optional chaining and fallback values — the app never crashes on missing data.

### Cart Has No Price
OpenFoodFacts does not provide pricing data. The cart tracks item count only. The "Checkout" button is a UI placeholder.
