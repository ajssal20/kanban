<script>
  import { issues } from '$lib/stores/issues';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';

  let showDialog = false;
  let userCountry = 'Unbekannt';

  const lanes = [
    { id: 'do', title: 'To Do', color: 'bg-pink-100', border: 'border-pink-300' },
    { id: 'doing', title: 'Doing', color: 'bg-yellow-100', border: 'border-yellow-300' },
    { id: 'done', title: 'Done', color: 'bg-green-100', border: 'border-green-300' },
    { id: 'archive', title: 'Archiv', color: 'bg-purple-100', border: 'border-purple-300' }
  ];

  async function getCountry() {
    if (!browser) return;
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      userCountry = data.country_name || 'Unbekannt';
    } catch {
      userCountry = 'Unbekannt';
    }
  }

  if (browser) getCountry();

  function exportCSV() {
    const allIssues = get(issues);
    const csv = [
      ['Title', 'Description', 'Creation Date', 'Due Date', 'Story Points', 'Priority', 'Lane'],
      ...allIssues.map(i => [
        i.title, i.description, i.creationDate, i.dueDate, i.storyPoints, i.priority, i.lane
      ])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<!-- 🌸 Header -->
<header class="bg-gradient-to-r from-pink-200 via-pink-100 to-yellow-100 shadow">
  <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-extrabold text-pink-700">🌸 Frühlings-Kanban 🌿</h1>
      <p class="text-sm text-pink-600">Land: {userCountry}</p>
    </div>

    <div class="flex gap-3">
      <button
        on:click={() => (showDialog = true)}
        class="bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600 transition"
      >
        + Neue Aufgabe
      </button>
      <button
        on:click={exportCSV}
        class="bg-green-300 text-green-900 px-4 py-2 rounded-full shadow hover:bg-green-400 transition"
      >
        CSV Export
      </button>
    </div>
  </div>
</header>

<!-- 🌸 Board -->
<main class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {#each lanes as lane}
    <Lane {lane} issues={$issues.filter(i => i.lane === lane.id)} />
  {/each}
</main>

<!-- 🌸 Dialog anzeigen -->
{#if showDialog}
  <CreateIssueDialog on:close={() => (showDialog = false)} />
{/if}
