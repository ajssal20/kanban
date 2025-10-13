# Kanban (SvelteKit)

Elegantes, installierbares Kanban-Board mit 4 Lanes (Do, Doing, Done, Archiv).  
Features:
- Issues anlegen via **HTML `<dialog>`**
- Drag & Drop (ohne Lib)
- **LocalStorage**-Persistenz
- **date-fns** für Datumsanzeige (de)
- **Overdue**-Warnung
- **Story Points**-Summen pro Lane
- **Notification**, wenn ein Item auf *Done* gezogen wird
- **ICS-Export** je Item
- **Web Share API** je Item
- **CSV-Export** aller Items
- **Geo-IP**: Land im Header
- **PWA** (Service Worker, Manifest)

## Setup

```bash
pnpm i
# tailwind optional; Styles hier sind neutral (ohne Tailwind). Wenn du Tailwind willst:
# pnpm i -D tailwindcss postcss autoprefixer
# npx tailwindcss init -p
pnpm dev
