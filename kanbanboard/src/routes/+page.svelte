<script>
  import { issues } from '$lib/stores/issues';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { get } from 'svelte/store';

  let showDialog = false;
  let country = 'Unbekannt';

  const lanes = [
    { id: 'do', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' },
    { id: 'archive', title: 'Archiv' }
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

<div class="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 font-poppins">
  <!-- 🌸 Header -->
  <header class="sticky top-0 bg-white/70 backdrop-blur-md border-b border-pink-200 shadow-sm px-6 py-4 flex justify-between items-center z-10">
    <div>
      <h1 class="text-3xl font-extrabold text-pink-700 flex items-center gap-2">
        💖 Pink Kanban Board
      </h1>
      <p class="text-sm text-pink-600 mt-1">🌍 Land: {country}</p>
    </div>

    <div class="flex gap-3">
      <button
        on:click={() => showDialog = true}
        class="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-lg transition"
      >
        + Neue Aufgabe
      </button>
      <button
        on:click={exportCSV}
        class="bg-green-400 hover:bg-green-500 text-green-900 font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-lg transition"
      >
        📤 CSV Export
      </button>
    </div>
  </header>

  <!-- 🌸 Lanes -->
  <main class="max-w-7xl mx-auto px-4 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each lanes as lane}
      <Lane {lane} issues={current.filter(i => i.lane === lane.id)} />
    {/each}
  </main>

  {#if showDialog}
    <CreateIssueDialog on:close={() => showDialog = false} />
  {/if}
</div>
