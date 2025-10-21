<script>
  import { issues } from '$lib/stores/issues';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { get } from 'svelte/store';

  let showDialog = false;
  let country = 'Unbekannt';

  const lanes = [
    { id: 'do', title: '💡 To Do' },
    { id: 'doing', title: '⚙️ Doing' },
    { id: 'done', title: '✅ Done' },
    { id: 'archive', title: '🗂️ Archiv' }
  ];

  $: current = $issues || [];

  async function fetchCountry() {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    country = data.country_name || 'Unbekannt';
  }
  fetchCountry();

  function exportCSV() {
    const all = get(issues);
    const rows = [
      ['Title','Description','Creation Date','Due Date','Story Points','Priority','Lane'],
      ...all.map(i => [i.title, i.description, i.creationDate, i.dueDate, i.storyPoints, i.priority, i.lane])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'issues.csv';
    a.click();
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-pink-300 via-pink-100 to-fuchsia-200 font-poppins">

  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl shadow-md border-b border-pink-200 px-6 py-4 rounded-b-3xl">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
      <div class="text-center sm:text-left">
        <h1 class="text-4xl font-extrabold text-pink-700 tracking-tight flex items-center gap-2">
          Kanban Board
        </h1>
        <p class="text-sm text-rose-500 mt-1">🌍 Aktuelles Land: <strong>{country}</strong></p>
      </div>

      <div class="flex flex-wrap gap-3 justify-center sm:justify-end mt-2 sm:mt-0">
        <button
          on:click={() => showDialog = true}
          class="bg-gradient-to-tr from-pink-500 to-fuchsia-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all">
          ➕ Neue Aufgabe
        </button>
        <button
          on:click={exportCSV}
          class="bg-white text-pink-600 border border-pink-400 hover:bg-pink-100 font-medium px-6 py-2 rounded-full shadow-sm hover:shadow transition-all">
          📤 CSV Export
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {#each lanes as lane}
      <Lane {lane} issues={current.filter(i => i.lane === lane.id)} />
    {/each}
  </main>


  {#if showDialog}
    <CreateIssueDialog on:close={() => showDialog = false} />
  {/if}
</div>
