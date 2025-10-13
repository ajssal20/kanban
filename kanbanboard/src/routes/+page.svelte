<script>
  import { issues } from '$lib/stores/issues';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';

  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';

  let showDialog = false;
  let userCountry = 'Unbekannt';

  const lanes = [
    { id: 'do',    title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done',  title: 'Done' },
    { id: 'archive', title: 'Archiv' }
  ];

  $: currentIssues = browser && Array.isArray($issues) ? $issues : [];

  async function getCountry() {
    if (!browser) return;
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      userCountry = data?.country_name || 'Unbekannt';
    } catch {
      userCountry = 'Unbekannt';
    }
  }
  if (browser) getCountry();

  function csvEscape(value = '') {
    const s = String(value ?? '');
    const needsQuote = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needsQuote ? `"${q}"` : q;
  }

  function exportCSV() {
    const all = get(issues);
    const rows = [
      ['Title','Description','Creation Date','Due Date','Story Points','Priority','Lane'],
      ...all.map(i => [
        i.title, i.description, i.creationDate, i.dueDate, i.storyPoints, i.priority, i.lane
      ])
    ];
    const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
  <header class="border-b bg-white/70 backdrop-blur">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div>
        <h1 class="text-lg sm:text-xl font-semibold">Kanban</h1>
        <p class="text-xs text-gray-500">Land: {userCountry}</p>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-2 rounded-md bg-black text-white" on:click={() => showDialog = true}>+ Neue Aufgabe</button>
        <button class="px-3 py-2 rounded-md border" on:click={exportCSV}>CSV Export</button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each lanes as lane}
        <Lane {lane} issues={currentIssues.filter(i => i.lane === lane.id)} />
      {/each}
    </div>
  </main>

  <footer class="py-6 text-center text-xs text-gray-500">
    Installierbar als PWA • Offlinefähig
  </footer>

  <CreateIssueDialog bind:open={showDialog} on:close={() => (showDialog = false)} />
</div>
