

# AniTube - YouTube-Style Anime & Manga Platform

## Overview
A dark-themed, YouTube-inspired anime streaming and manga reading platform powered by your self-hosted Consumet API. No user accounts needed — just browse, search, watch, and read.

---

## Pages & Navigation

### 1. **Home Page**
- Top navigation bar with logo, search bar, and provider selector dropdown
- Hero section featuring a highlighted anime
- Content sections: "Recently Updated", "Popular Anime", "Popular Manga"
- Grid/card layout similar to YouTube's video thumbnails showing anime/manga covers with titles, episode count, and type (sub/dub)

### 2. **Search Page**
- Full search with results displayed in a grid
- Filter tabs to switch between Anime and Manga results
- Each result card shows cover image, title, type, and status

### 3. **Anime Detail Page**
- Banner/cover image with anime info (title, synopsis, genres, status, total episodes)
- Sub/Dub toggle to switch audio type
- Episode list displayed in a clean grid/list with episode numbers
- Provider selector to switch between available anime sources

### 4. **Video Player Page**
- Embedded video player for streaming anime episodes
- Episode navigation (previous/next)
- Sub/Dub toggle accessible during playback
- Episode list sidebar for quick switching
- Server/source selector if multiple streaming sources are available

### 5. **Manga Detail Page**
- Cover and info section (title, synopsis, genres, status, chapters)
- Chapter list with chapter numbers and titles
- Provider selector to switch manga sources

### 6. **Manga Reader Page**
- Comfortable full-screen chapter reader
- Page-by-page or long-strip (scroll) reading modes
- Chapter navigation (previous/next)
- Page indicator showing current progress

---

## Core Features

### Provider Switching
- Global provider selector in the nav bar for quick switching
- Separate provider lists for anime and manga (fetched from Consumet API)
- Switching providers refreshes content from the selected source

### Sub/Dub Toggle
- Toggle available on anime detail and player pages
- Remembers preference in local storage across sessions

### API Configuration
- Settings page or modal where the user can input/update their Consumet API base URL
- API URL stored in local storage for persistence

---

## Design
- **Dark theme** inspired by YouTube's dark mode (dark grays, near-black backgrounds)
- Vibrant accent color for interactive elements
- Card-based content layout with hover effects
- Responsive design for desktop and mobile
- Smooth transitions and loading skeletons

