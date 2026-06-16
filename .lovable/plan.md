

# Fr_cam — Wildlife Photography Website for Fr. Jose Poyyaniyil

## Overview
A professional wildlife photography portfolio website with a rich **dark forest green theme**, admin panel for content management, and sections for gallery, blog, books, events, and framed prints.

---

## Pages & Structure

### 1. Home Page (Single-page with sections)
- **Hero Banner** — Full-screen wildlife photo with "Fr_cam" branding and Fr. Jose Poyyaniyil name, tagline
- **About Me** — Photo + bio section about your wildlife photography journey
- **Books** — Two categories: English & Malayalam books with cover images, descriptions, and purchase/contact links
- **Gallery Preview** — Featured journey cards linking to full gallery page
- **Upcoming Events** — List of upcoming workshops, exhibitions, or trips
- **Frames for Sale Preview** — Featured framed prints with WhatsApp contact button
- **Fr_cam Section** — Dedicated brand showcase section
- **Footer** — WhatsApp contact, social media links

### 2. Gallery Page (Dynamic)
- Grid of **Journey/Destination cards** (e.g., "Western Ghats", "African Safari")
- Click a journey → opens a sub-gallery with all photos from that trip
- Each journey has: title, cover image, description, date, and photo collection
- **Managed via admin panel**

### 3. Blog Page
- Blog post listing with featured images, titles, dates
- Individual blog post pages with rich text content
- **Managed via admin panel**

### 4. Frames for Sale Page
- Grid of framed wildlife prints with images, titles, sizes, and prices
- Each frame has a **"Buy via WhatsApp"** button that opens WhatsApp with a pre-filled message
- **Managed via admin panel**

### 5. Events Page
- List of upcoming and past events
- Event details: title, date, location, description, registration link
- **Managed via admin panel**

---

## Admin Panel (Login-protected)
- **Dashboard** with quick stats
- **Manage Gallery** — Add/edit/delete journeys and photos within them
- **Manage Blog** — Create/edit/delete blog posts with rich text
- **Manage Books** — Add/edit book listings
- **Manage Frames** — Add/edit framed prints for sale
- **Manage Events** — Add/edit upcoming events
- Email + password login for admin access

---

## Design & Theme
- **Dark forest green** color palette (deep greens, dark backgrounds, earthy tones)
- Nature-inspired typography and subtle leaf/wildlife motifs
- Full-width photo sections to showcase wildlife imagery
- Responsive design for mobile and desktop
- Logo upload placeholder (you can share your logo after implementation)

---

## Tech Stack
- **Frontend**: React + Tailwind CSS with green wildlife theme
- **Backend**: Lovable Cloud (Supabase) for database, auth, and image storage
- **Image Storage**: Supabase Storage for gallery photos, blog images, and frame photos
- **Contact**: WhatsApp deep links for frame purchases and inquiries

