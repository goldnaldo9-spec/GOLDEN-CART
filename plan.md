# Golden Cat Customer-Facing MVP Plan

## Scope

Build the first usable Golden Cat marketplace release around the customer journey: discover products, browse/search the catalog, inspect a product, select variants, add to cart, review totals, start guest or signed-in checkout, complete a demo-safe payment flow, receive an order confirmation, view order history/status, and reach support. Include realistic sample products and accessible responsive UI.

Defer seller onboarding and dashboards, marketplace payouts, loyalty and referral programs, abandoned-cart automation, push notifications, live chat implementation, advanced recommendations, and multi-provider payment wiring until the core customer flow is stable.

## Implementation approach

Use the initialized React/Vite/Express/tRPC/Drizzle starter. Keep public catalog and cart interactions functional with seeded sample data while wiring the durable database schema and tRPC API for categories, products, orders, and customer-owned records. Use Manus OAuth for accounts through the supplied authentication flow. Keep payment provider wiring behind a clear checkout boundary; Phase 1 should present a safe checkout review and an order-creation seam that can be connected to Stripe after the storefront is validated. Never claim payment success from a client redirect alone.

Use URL-driven routes with Wouter: `/`, `/shop`, `/category/:slug`, `/product/:slug`, `/cart`, `/checkout`, `/account`, `/orders`, `/support`, and `/404`. Keep private account and order pages behind real authentication checks, while public catalog pages remain accessible to guests.

## Design direction

Three candidate directions were considered:

- **Warm editorial commerce** — 0.07 probability: an inviting catalog with cream surfaces, deep ink, and warm gold accents.
- **Bright marketplace utility** — 0.04 probability: energetic orange, white, and compact data-dense cards.
- **Quiet premium essentials** — 0.06 probability: restrained sand, charcoal, and gallery-like product presentation.

Choose **Warm editorial commerce**. The product should feel trustworthy and welcoming rather than discount-chaotic.

- **Design movement:** editorial retail with a tactile, paper-and-ink sensibility.
- **Core principles:** confidence before urgency; calm hierarchy; generous readability; useful motion only.
- **Color philosophy:** warm parchment and white create approachability, charcoal gives readable contrast, and Golden Cat gold provides a distinctive owned accent for primary actions and highlights.
- **Layout paradigm:** a wide editorial canvas with a compact utility rail, asymmetrical hero composition, category chips, and product shelves rather than a dense dashboard grid.
- **Signature elements:** gold tabby-cat mark, soft cream promo panel, and small gold status pills for deals or verified trust.
- **Interaction philosophy:** every action confirms itself with a clear state change; controls remain generous and plain-English.
- **Animation:** subtle fade/slide for drawers, banners, and cart confirmation; no distracting auto-motion and respect reduced-motion preferences.
- **Typography system:** use a readable sans-serif interface hierarchy with strong weight contrast; pair a warm display serif only for hero headlines if the starter font setup permits it without blocking performance.
- **Brand essence:** a dependable everyday marketplace for finding useful goods without the noise. Personality: warm, clear, dependable.
- **Brand voice:** headlines should be direct and inviting; CTAs should describe the next action. Examples: “Good finds, clearly chosen.” and “See today’s picks.”
- **Wordmark and logo:** a compact golden cat-head mark paired with a confident Golden Cat wordmark; use a text fallback until a durable logo asset is added.
- **Signature brand color:** Golden Cat gold, used sparingly for primary actions, deal highlights, and the cat mark.

## Frontend structure

- `client/src/App.tsx`: route table and global providers.
- `client/src/pages/`: home, shop, category, product, cart, checkout, account, orders, support, and 404 pages.
- `client/src/components/marketplace/`: site header, footer, product cards, price breakdown, filter controls, promo banner, category shelf, trust strip, and cart drawer.
- `client/src/lib/catalog.ts`: typed sample catalog used for immediate UI and fallback development data.
- `client/src/index.css`: Golden Cat design tokens, responsive utilities, accessible focus and motion rules.
- `public/manus-routes.json`: complete public route manifest.

## Backend and data structure

- `drizzle/schema.ts`: categories, products, product variants, carts, cart items, orders, order items, addresses, wishlist items, and support tickets in addition to supplied users.
- `server/db.ts`: typed database accessors with safe no-database fallback for public catalog development.
- `server/routers.ts`: public catalog procedures, cart/order procedures, and protected customer procedures.
- `server/_core/index.ts`: preserve health, OAuth, tRPC, and Vite/static serving; add only narrowly scoped webhook or upload handlers when required.

Keep product and order snapshots immutable at purchase time. Validate price, stock, quantity, coupon, and ownership on the server. Use the database as the source of truth once a durable operation is available.

## Delivery sequence

1. Replace starter screen with the Golden Cat shell and responsive home page.
2. Add sample catalog, category and shop routes, search, filters, sorting, and product detail pages.
3. Add cart state, quantity updates, variant selection, and server-calculated price breakdown.
4. Add guest checkout review and signed-in account entry points.
5. Add order creation seam, confirmation page, order history/status, and support entry points.
6. Harden accessibility, SEO metadata, route manifest, error states, and production checks.
7. Checkpoint the finished customer-facing MVP before starting seller or advanced marketing work.

## Material constraints

Use sample product imagery only when it has a planned catalog placement. Prefer stable remote image URLs already available in the project or tasteful generated/product imagery if needed; do not leave generic placeholder blocks in the final storefront. Keep all public product content indexable where the current client architecture allows, and avoid emitting guessed canonical URLs until a real public origin is configured.
