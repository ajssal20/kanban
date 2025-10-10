<script>
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';


  export let issue;

  const isOverdue = new Date(issue.dueDate) < new Date();

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', issue.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  function exportICS() {
    const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${issue.title}`,
      `DESCRIPTION:${issue.description}`,
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `${issue.title}\n${issue.description}\nFällig am: ${format(new Date(issue.dueDate), 'PPP', { locale: de })}`
        });
      } catch (e) {
        console.log('Teilen abgebrochen');
      }
    } else {
      alert('Web Share API wird nicht unterstützt.');
    }
  }
</script>

<div
  class="p-4 bg-gradient-to-br from-white via-pink-50 to-green-50 rounded-xl shadow-md border border-green-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-grab relative animate-fadeIn"
  draggable="true"
  on:dragstart={handleDragStart}
>
  <h3 class="font-semibold text-gray-800 mb-1">{issue.title}</h3>
  <p class="text-sm text-gray-600 mb-2 line-clamp-2">{issue.description}</p>
  <p class="text-xs text-gray-400 mb-1">
    Fällig: {format(new Date(issue.dueDate), 'PPP', { locale: de })}
  </p>

  {#if isOverdue}
    <span class="absolute top-2 right-2 text-xs text-red-600 font-medium animate-pulse">Überfällig!</span>
  {/if}

  <div class="flex justify-between mt-3 text-sm">
    <button on:click={exportICS} class="text-pink-600 hover:underline hover:rotate-2 transition">ICS</button>
    <button on:click={shareIssue} class="text-green-600 hover:underline hover:-rotate-2 transition">Teilen</button>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-in;
  }
</style>
