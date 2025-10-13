<script>
  import { format } from 'date-fns';
  import { de } from 'date-fns/locale';
  export let issue;

  const isOverdue = new Date(issue.dueDate) < new Date();

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', issue.id);
  }

  function exportICS() {
    const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
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

<div class="issue-card" draggable="true" on:dragstart={handleDragStart}>
  <h3>🌸 {issue.title}</h3>
  <p>{issue.description}</p>
  <p class="due">📅 Fällig: {format(new Date(issue.dueDate), 'PPP', { locale: de })}</p>
  {#if isOverdue}
    <span class="overdue">Überfällig!</span>
  {/if}
  <div class="btns">
    <button on:click={exportICS}>ICS</button>
    <button on:click={shareIssue}>Teilen</button>
  </div>
</div>

<style>
  .issue-card {
    background: linear-gradient(135deg, #fff, #ffe4f2);
    border: 1px solid #f9a8d4;
    border-radius: 16px;
    padding: 1rem;
    position: relative;
    box-shadow: 0 3px 6px rgba(236, 72, 153, 0.3);
  }
  h3 {
    color: #be185d;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }
  p {
    font-size: 0.9rem;
    color: #4b5563;
  }
  .due {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    color: #6b7280;
  }
  .overdue {
    position: absolute;
    top: 6px;
    right: 10px;
    background: #fecaca;
    color: #991b1b;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 6px;
  }
  .btns {
    margin-top: 0.5rem;
    display: flex;
    justify-content: end;
    gap: 0.6rem;
  }
  button {
    background: #f9a8d4;
    border: none;
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    color: #6b021f;
    font-size: 0.8rem;
  }
  button:hover {
    background: #ec4899;
    color: white;
  }
</style>
