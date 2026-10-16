# 🔴 DEXICON // Trainer's Log & World Codex
> *Created by DCA*

**Dexicon** is a minimalist, distraction-free daily reflection journal and global wisdom database designed with a retro-modern Pokédex aesthetic. Built as an offline-first Progressive Web App (PWA) with installable Android APK support, Dexicon assigns one unique, permanent quote each day drawn from world philosophy, literature, and cultural traditions, paired with an auto-saving reflection canvas.

---

## ✨ Key Features

- **Daily Resonance Engine:** Each day delivers a unique, randomized quote that permanently locks to that calendar date upon first view, ensuring past thoughts and quotes always stay aligned.
- **Trainer's Log:** A distraction-free daily workspace with instant, automatic local saving as you type.
- **World Codex (Card Deck):** An interactive, swipeable card carousel that shuffles fresh quotes on every visit, bridging core offline canons with global online archives.
- **Reflect on Any Quote:** Stumble upon a thought-provoking entry in the Codex? Route it into your daily log with a single tap.
- **Archived Logs Viewer:** A collapsible chronological feed to review previous dates, assigned quotes, and your personal thoughts.
- **Document & Data Export:** Export your logs anytime as a **JSON** data backup, a formatted **Word document (`.doc`)**, or a print-ready **PDF**.
- **Data Restoration:** Restore and merge past logs on any device using clean JSON backups.
- **100% Local & Private:** All journal entries remain saved strictly on your device storage. No personal data is ever tracked or sent to external servers.

---

## 🛠️ Project Structure

```text
dexicon/
├── index.html          # Core single-page app (UI, styles, and logic)
├── manifest.json       # Web App Manifest for mobile installation
├── sw.js               # Service Worker for offline caching and silent updates
├── icon-192.png        # 192x192 PNG launcher icon
├── icon-512.png        # 512x512 PNG splash icon
└── favicon.png         # Browser tab icon
