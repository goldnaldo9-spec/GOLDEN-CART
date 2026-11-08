# Golden Cat Customer-Facing MVP Outcomes

## Delivered customer experience

- [x] Provide a responsive storefront shell with Golden Cat branding, search, account, cart, mobile navigation, footer links, contact email `goldnado9@gmail.com`, and phone/WhatsApp `+421 952 635 086`.
- [x] Provide an accessible home page with a hero/search area, category grid, featured product shelves, best sellers, new arrivals, trust/support strip, visible focus states, readable contrast, alt text, and reduced-motion behavior.
- [x] Provide public shop and category routes with realistic sample products, product cards, search by product/brand/category/tag, price/category/rating filters, sorting, empty states, wishlist toggles, and responsive layouts.
- [x] Provide product detail routes with multiple gallery images, price/discount, required variant selection, stock limits, delivery copy, specifications, customer-review summary, wishlist, add-to-cart, buy-now, and clear success/error feedback.
- [x] Provide guest and signed-in cart behavior with quantity changes, variant-aware lines, item removal, subtotal, shipping, tax, coupon code `GOLDEN10`, discount presentation, empty-cart state, and clear server-validation messaging.
- [x] Provide three-step checkout for guest shoppers with contact, delivery address, delivery option, review, terms acknowledgement, validation errors, duplicate-submit protection, and a server-validated order-creation seam.
- [x] Save customer orders in the managed database with immutable item snapshots, server-calculated subtotal/shipping/tax/discount/total, order number, and fulfillment status. Do not persist card numbers, security codes, or expiry dates.
- [x] Connect customer account entry points to the supplied Manus OAuth flow and protect signed-in order history with server ownership checks.
- [x] Provide a wishlist route and customer-facing wishlist behavior. Wishlist state is currently local to the browser; cross-device sync is a post-MVP enhancement.
- [x] Provide support/help routes with complaint fields for order number, issue type, description, and optional photo filename, and save support tickets with durable ticket numbers and Open status in the managed database.
- [x] Provide About, Contact, Privacy, Terms, Shipping, and Returns routes with clearly marked launch-copy placeholders where final business/legal text is still required.

## Technical readiness delivered

- [x] Add additive Drizzle schema and migration for customer orders, order items, and support tickets.
- [x] Add tRPC procedures for server-validated guest/signed-in order creation, authenticated order history, and durable support ticket creation.
- [x] Serve `client/public/manus-routes.json` with the complete current route set, including `/wishlist`.
- [x] Keep authentication, database, and server capability declarations compatible with the initialized Webdev starter.
- [x] Pass `pnpm check`, `pnpm build`, health checks, route checks, and focused invalid-order API validation.
- [x] Verify desktop and mobile layouts with Preview screenshots.

## Explicit post-MVP launch work

- [ ] Enable and connect Stripe or PayPal handoff, webhook verification, payment state, receipts, refunds, and live-provider testing. The current checkout deliberately saves a server-validated order but does not claim card/PayPal payment success.
- [ ] Replace legal-page placeholder copy with reviewed Privacy, Terms, Shipping, and Return/Refund policies.
- [ ] Add authenticated saved-address CRUD, server-backed wishlist sync, notification preferences, password/account recovery details, and two-step verification messaging as required by the final account policy.
- [ ] Connect photo uploads to managed object storage, persist ownership metadata, and expose ticket attachment authorization.
- [ ] Add server-backed catalog/category/product management and replace the small static catalog price map with database-backed product availability and stock.
- [ ] Add seller onboarding, seller dashboard, product/stock management, seller orders, earnings, approvals, marketplace payouts, and admin moderation.
- [ ] Add advanced marketing features: loyalty points, referrals, spin-the-wheel/daily check-in rewards, abandoned-cart reminders, push notifications, live chat, advanced recommendations, and analytics pixels.
- [ ] Add focused automated tests for catalog filters, variant-aware cart behavior, server totals/coupon validation, order ownership, support ticket authorization, accessibility, and payment webhook idempotency.
