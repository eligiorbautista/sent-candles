## Sent. Candles – Backend, Database, and Image Storage Plan

### Goals
- High uptime, low ops, scalable reads during spikes
- Keep Express API control; use managed DB; robust image delivery

### Recommended Architecture
- Backend: Express (deployed on Fly.io/Railway) with Prisma ORM
- Database: Supabase Postgres (metadata only: products, events, site copy)
- Images: Dedicated image host/CDN; store only URLs in DB
  - Option A: Cloudinary or ImageKit (recommended for simplicity)
  - Option B: Supabase Storage with CDN and Cache-Control, optionally fronted by Cloudflare

### Supabase Free Tier (reference)
- DB storage ~500 MB
- Storage ~1 GB; max upload ~50 MB/file
- Bandwidth/egress ~10 GB/mo (split cached/uncached)
- Auth up to ~50k MAUs; Functions ~500k invocations/mo
- ~200 concurrent DB connections; projects can pause after ~1 week inactivity

Implication: Do NOT serve heavy image traffic directly from the DB/API. Use CDN for images.

### Data Model (simplified)
- products: id, name, description, category, featured, price/variants JSON, size, burnTime, imageUrls[]
- events: id, title, description, date, category, imageUrls[]
- site content: hero/about/contact tables or a single key-value table

### Image Strategy
- Store multiple sizes for each image
  - thumb (grid), card (listing), full (modal)
- Save only URLs in DB: imageUrls = [thumb, full] or array of objects

Option A: Cloudinary/ImageKit
- Pros: global CDN, on-the-fly transforms, great free tier, simple admin upload
- Flow: upload -> get public URL (with transformations) -> store in DB

Option B: Supabase Storage (+ CDN/Cloudflare)
- Public bucket; upload via signed route in admin; set long Cache-Control
- Pre-generate sizes (avoid dynamic resizing on free tier)
- Consider Cloudflare in front for edge caching

### API/Cache
- Use ETag/Cache-Control headers on read endpoints
- For static content (products/events), enable CDN caching (stale-while-revalidate)
- Incremental revalidation on updates (purge CDN keys for changed records)

### Frontend Guidelines
- Use thumbs in grids, full-size in modals
- Lazy-load off-screen images; prefer WebP/AVIF when available
- Keep current `imageUrls` shape; consider objects: {thumb, full, alt}

### Security
- Public read-only content; admin routes for create/update with Supabase Auth/JWT
- Validate MIME and size on uploads; strip EXIF if needed

### Migration Plan (from static data)
1) Create Supabase project; set tables and seed with current JSON
2) Move images to chosen host; map old URLs -> new CDN URLs
3) Update frontend to read from API (fallback to local data until rollout)
4) Add admin upload UI (optional) and secure it
5) Add cache headers and monitor egress

### Cost/Scaling Notes
- Start free: Supabase + Cloudinary/ImageKit
- Upgrade triggers: storage/egress nearing limits, need SLA, or heavy write volume

### Nice-to-haves (later)
- Add photos-count pill in modals (consistent meta badge style)
- Add captions/alt text fields
- Background jobs to pre-generate sizes and purge CDN on updates


