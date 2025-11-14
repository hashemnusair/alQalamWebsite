# Al Qalam Motors - Design Guidelines

## Design Approach

**Reference-Based: Premium Automotive E-commerce**

Drawing inspiration from Tesla, Porsche, Carvana, and premium automotive brands that emphasize visual storytelling, trust, and elegant restraint. This approach balances showroom sophistication with digital accessibility.

**Core Principles:**
- Automotive elegance through generous whitespace and high-quality imagery
- Trust-building through professional presentation and clear information hierarchy
- Frictionless browsing with intuitive filtering and prominent contact actions

---

## Typography System

**Primary Font:** Inter or DM Sans (via Google Fonts)
**Accent Font:** Sora or Space Grotesk for headings

**Hierarchy:**
- Hero Headlines: 4xl to 6xl (56-72px desktop), bold weight, tight tracking
- Page Titles: 3xl to 4xl (36-48px), semibold
- Section Headers: 2xl (24-30px), semibold
- Car Titles: xl to 2xl (20-24px), medium weight
- Body Text: base to lg (16-18px), regular weight, increased line height (1.7)
- Specs/Metadata: sm (14px), medium weight, slightly muted
- Buttons/CTAs: base (16px), semibold, uppercase for primary actions

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 (standardized throughout)

**Grid System:**
- Container: max-w-7xl with px-6 on mobile, px-8 on desktop
- Car Grid: 1 column mobile → 2 columns tablet → 3 columns desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Section Padding: py-16 mobile → py-24 desktop

**Vertical Rhythm:** Consistent 16-24 unit spacing between major sections

---

## Component Library

### Navigation
- Fixed header with dealership logo left, nav links center, WhatsApp CTA button right
- Transparent on hero scroll, solid background after 100px scroll
- Mobile: Hamburger menu with slide-in drawer

### Hero Section (Home)
- Full-width hero image (luxury car in showroom or on road, professional photography)
- Height: 85vh on desktop, 70vh on mobile
- Centered overlay content with blurred background card (backdrop-blur-md)
- Headline + subheading + dual CTAs (Browse Inventory + WhatsApp Contact)

### Car Cards
- Large image (aspect-ratio 4/3), hover zoom effect
- Title, year, mileage, price prominently displayed
- Specs grid (4 icons: gearbox, fuel, drive, engine) with minimal labels
- "View Details" button + WhatsApp quick contact icon
- Subtle border, gentle shadow on hover

### Car Details Page
- Image gallery: Large main image with thumbnail strip below (6-8 images)
- Two-column layout: Left = images, Right = title, price, specs table, description, sticky WhatsApp inquiry button
- Specs organized in clean table/grid format with icons

### Filters (Inventory Page)
- Horizontal filter bar with dropdowns: Make/Brand, Price Range (slider), Year Range, Body Type
- Active filters displayed as removable pills
- Results count displayed prominently

### Contact Section
- Two-column: Left = Google Maps embed, Right = contact form (name, phone, message) + direct contact buttons (WhatsApp, Phone)
- Business hours, address, social media icons

### Footer
- Three-column grid: Company info, Quick Links, Contact details
- Minimal, clean, includes Arabic language toggle placeholder

---

## Images

**Hero Image (Home Page):**
- Premium car (Land Cruiser or luxury sedan) in dramatic lighting, showroom or outdoor setting
- Professional automotive photography style, wide angle, high resolution
- Placement: Full-width background, subtle gradient overlay for text readability

**Car Inventory Images:**
- Multiple high-quality photos per car: Exterior front 3/4 view, side profile, interior dashboard, rear view
- Consistent white/neutral backgrounds or natural outdoor settings
- Minimum 1200x900px resolution

**About/Contact Page:**
- Showroom exterior or team photo (optional but recommended)
- Location: Embedded Google Maps centered on Amman dealership

**Placeholder Strategy:** Use professional automotive stock photography initially with clear aspect ratios for easy replacement

---

## Key Interactions

**Animations:** Minimal and purposeful
- Smooth fade-in on scroll for car cards (stagger effect)
- Image gallery transitions (slide/fade)
- Filter dropdown animations
- No autoplay carousels, no parallax effects

**WhatsApp Integration:**
- Pre-filled message format: "Hello, I'm interested in [Car Title - Year]. Is it still available?"
- Prominent green WhatsApp buttons with icon, blurred background when on images
- Sticky contact bar on mobile (appears after scroll)

**Hover States:**
- Car cards: Subtle lift + shadow increase
- Images: Gentle zoom (scale-105)
- Buttons: Standard state changes (no special treatment on image overlays)

---

**Mobile Optimization:**
- Stack all multi-column layouts to single column
- Sticky WhatsApp button bottom-right
- Touch-friendly filter controls (larger touch targets)
- Swipeable image galleries on car details

This design creates a premium, trustworthy automotive browsing experience optimized for the Jordanian market while maintaining modern web standards and performance.