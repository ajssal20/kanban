<script>
  import { format } from 'date-fns';
  import { de } from 'date-fns/locale';
  export let issue;

  // Warum: Softer Hinweis bei Überfälligkeit (nicht schrill).
  const isOverdue = new Date(issue.dueDate) < new Date();

  function handleDragStart(e) {
    //  Drag-&-Drop ID weitergeben – Funktion unverändert.
    e.dataTransfer.setData('text/plain', issue.id);
  }

  function exportICS() {
    // ICS Export – Nutzen: Termin in Kalender ziehen; belassen.
    const start = new Date(issue.dueDate)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${issue.title}
DESCRIPTION:${issue.description}
DTSTART:${start}
DTEND:${start}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${issue.title}.ics`;
    a.click();
  }

  async function shareIssue() {
    // ✅Web Share – reduziert Reibung beim Teilen; belassen.
    if (navigator.share) {
      await navigator.share({
        title: issue.title,
        text: `${issue.title}\n${issue.description}\nFällig: ${format(new Date(issue.dueDate), 'PPP', { locale: de })}`
      });
    } else {
      alert('Web Share API wird nicht unterstützt.');
    }
  }
</script>

<!--  Visueller Stil:
     - klassische Karte mit klarem Rand
     - wenig Sättigung, Fokus auf Inhalt
     - weiches Hover für „lebendig aber ruhig“ -->
<div
  class="bg-white border border-rose-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-rose-200 transition relative cursor-grab active:cursor-grabbing"
  draggable="true"
  role="listitem"
  on:dragstart={handleDragStart}
>
  <h3 class="text-rose-700 font-semibold text-[1.05rem] mb-1 leading-tight">
    {issue.title}
  </h3>

  <p class="text-[#5e5560] text-[0.92rem] mb-2 leading-snug">{issue.description}</p>

  <p class="text-[#8a8190] text-xs">
    📅 Fällig: {format(new Date(issue.dueDate), 'PPP', { locale: de })}
  </p>

  {#if isOverdue}
    <!--  dezenter Warnchip statt heftiger rote Box -->
    <span class="absolute top-2 right-2 bg-rose-50 text-rose-700 text-[0.7rem] px-2 py-0.5 rounded-md border border-rose-200 font-medium">
      Überfällig
    </span>
  {/if}

  <!--  Buttons: Primär (rosa), Sekundär (outline) – klare Hierarchie -->
  <div class="flex justify-end gap-2 mt-3">
    <button
      on:click={exportICS}
      class="bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 text-xs font-semibold px-3 py-1 rounded-md transition"
    >
      ICS
    </button>
    <button
      on:click={shareIssue}
      class="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-md transition shadow-sm"
    >
      Teilen
    </button>
  </div>
</div>
