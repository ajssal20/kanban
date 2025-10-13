<script>
  import { format, formatDistanceToNow } from 'date-fns';
  import { de } from 'date-fns/locale';
  export let issue;

  const now = new Date();
  const due = new Date(issue.dueDate);
  const isOverdue = isFinite(due) && due < now;

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', issue.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  function toICSDate(d) {
    const iso = new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return iso;
  }

  function exportICS() {
    const start = toICSDate(issue.dueDate);
    const uid = `${issue.id}@svelte-kanban`;
    const dtstamp = toICSDate(Date.now());
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Svelte Kanban//DE',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `SUMMARY:${issue.title}`,
      `DESCRIPTION:${issue.description?.replace(/\n/g, '\\n') || ''}`,
      `DTSTART:${start}`,
      `DTEND:${start}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${issue.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareIssue() {
    const text =
      `${issue.title}\n` +
      (issue.description ? `${issue.description}\n` : '') +
      `Fällig: ${format(due, 'PPP', { locale: de })}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text,
          url: location.href
        });
      } catch { /* noop */ }
    } else {
      alert('Web Share API wird nicht unterstützt.');
    }
  }
</script>

<div
  class="p-4 rounded-xl border bg-white/80 shadow-sm hover:shadow-md transition cursor-grab relative"
  draggable="true"
  on:dragstart={handleDragStart}
  aria-grabbed="true"
>
  <h3 class="font-semibold text-gray-900 mb-1">{issue.title}</h3>
  {#if issue.description}<p class="text-sm text-gray-700 mb-2 line-clamp-3">{issue.description}</p>{/if}

  <div class="flex flex-wrap gap-2 text-xs text-gray-600">
    <span class="px-2 py-1 rounded-full bg-gray-100">SP: {issue.storyPoints}</span>
    <span class="px-2 py-1 rounded-full bg-gray-100">Prio: {issue.priority}</span>
  </div>

  <div class="mt-2 text-xs text-gray-500">
    <div>Erstellt: {format(new Date(issue.creationDate), 'Pp', { locale: de })}</div>
    <div>Fällig: {format(new Date(issue.dueDate), 'P', { locale: de })} 
      <span class="ml-1">({formatDistanceToNow(new Date(issue.dueDate), { addSuffix: true, locale: de })})</span>
    </div>
  </div>

  {#if isOverdue}
    <span class="absolute top-2 right-2 text-[10px] uppercase font-bold text-red-700 bg-red-100 px-2 py-1 rounded">Überfällig</span>
  {/if}

  <div class="flex justify-end gap-3 mt-3 text-sm">
    <button on:click={exportICS} class="underline underline-offset-4">ICS</button>
    <button on:click={shareIssue} class="underline underline-offset-4">Teilen</button>
  </div>
</div>
