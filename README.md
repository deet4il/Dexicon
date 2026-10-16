# 🔴 DEXICON // Trainer's Log & World Codex
> *Created by DCA*

**Dexicon** is an offline-first daily reflection journal and global wisdom archive designed with a retro Pokédex hardware aesthetic. Built as an installable Progressive Web App (PWA) with Android APK compatibility, Dexicon pairs one permanently locked daily quote with a unique Pokémon companion from the National Dex (`#0001` to `#1025`), providing a distraction-free space for daily mindfulness and habit tracking.

---

## ✨ Key Features

- **Unique Pokémon Companions:** Every daily quote is paired with a distinct Pokémon companion and live sprite. Built with an exemption engine ensuring zero repeated Pokémon until the entire National Dex (`1,025` species) is registered.
- **National Dex Habit Meter:** Hardware-inspired header tracking registered species in real time (`REGISTERED: X / 1025`).
- **Deterministic Quote Lock:** Daily entries permanently freeze quote, prompt, and Pokémon data into atomic storage upon first encounter, ensuring past logs never shift or recalculate.
- **Contemplative Prompt Sparks:** Built-in reflection sparks beneath each quote, complete with a one-tap shortcut to inject the prompt directly into your Trainer's Log.
- **Swipeable World Codex Deck:** An infinite card carousel with touch gestures, navigation buttons, and keyboard controls that dynamically reshuffles fresh quotes and Pokémon on every open.
- **Instant Search & Filter in Past Logs:** Real-time query filtering across dates, authors, quote text, Pokémon names/numbers, or personal reflection notes.
- **Multi-Format Export Suite:**
  - **JSON Archive (`.json`):** Full machine-readable state export.
  - **Word Document (`.doc`):** Styled document ready for Microsoft Word, Google Docs, or LibreOffice.
  - **Printable PDF (`.pdf`):** Clean, print-ready A4/Letter stylesheet for physical archiving.
- **Strict JSON Data Restoration:** Restore and merge past entries across devices, phone migrations, or app reinstalls.
- **Backup Milestone Reminders:** Subtle notification banner alert after every 15 unexported journal entries.
- **100% Offline Core:** Operates completely offline with zero latency, while fetching from global databases whenever connected.

---

## 🛠️ Project Structure

```text
dexicon/
├── index.html          # Core application (UI, Pokémon engine, and storage logic)
├── manifest.json       # Web App Manifest for mobile installation
├── sw.js               # Service Worker for offline caching and sprite caching
├── icon-192.png        # 192x192 PNG launcher & bezel icon
├── icon-512.png        # 512x512 PNG splash & adaptive icon
└── favicon.png         # Browser tab icon
