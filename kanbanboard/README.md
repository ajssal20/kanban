# 🧩 Kanban Board – SvelteKit PWA

Ein elegantes, modernes **Kanban-Board** zum Verwalten von Aufgaben – entwickelt mit **SvelteKit** als **PWA** (Progressive Web App). Unterstützt Drag & Drop, lokale Speicherung, Benachrichtigungen u. v. m.

---

## 🚀 Features

✅ 4 Lanes:
- **Do** / **Doing** / **Done** / **Archiv**

✅ Drag & Drop (ohne externe Library)  
✅ Neue Issues anlegen via `<dialog>`  
✅ Pflichtfelder: Titel, Beschreibung, Datum, Priorität, etc.  
✅ Lokale Speicherung mit `localStorage`  
✅ ICS-Export einzelner Aufgaben  
✅ Teilen per Web Share API  
✅ CSV-Export aller Items  
✅ Visuelle Anzeige bei Überfälligkeit  
✅ Benachrichtigung bei Status „Done“  
✅ Summe der Story Points pro Lane  
✅ Geo-API zeigt automatisiert das Land des Users  
✅ **PWA-fähig (installierbar & offline)**  
✅ Klare Komponentenstruktur  
✅ Modernes, elegantes TailwindCSS-Design

---

## 🧱 Projektstruktur

src/
├── lib/
│ ├── components/
│ │ ├── Card.svelte
│ │ ├── CreateDialog.svelte
│ │ ├── Lane.svelte
│ ├── store.js
│ └── intex.js
└── routes/
└── +page.svelte
└── +layout.svelte

---

## 📦 Technologien

- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)
- Web APIs: `localStorage`, `Notification`, `Web Share`, `Geo API`

---

## 🛠️ Installation

```bash
# 1. Projekt klonen
git clone https://github.com/dein-nutzername/kanban-board.git
cd kanban-board

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklung starten
npm run dev

# 4. Für PWA testen (offline & installierbar)
npm run build
npm run preview
