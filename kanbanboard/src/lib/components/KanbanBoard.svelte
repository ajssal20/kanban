<script>
  import { issues } from '$lib/stores/Issues';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { browser } from '$app/environment';

  let showDialog = false;
  let userCountry = 'Unbekannt';

  // Länder-API nur im Browser
  async function getCountry() {
    if (!browser) return;
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      userCountry = data.country_name || 'Unbekannt';
    } catch {
      userCountry = 'Unbekannt';
    }
  }

  if (browser) getCountry();

  const lanes = [
    { id: 'do', title: 'To Do', color: 'bg-blue-100', border: 'border-blue-300' },
    { id: 'doing', title: 'Doing', color: 'bg-yellow-100', border: 'border-yellow-300' },
    { id: 'done', title: 'Done', color: 'bg-green-100', border: 'border-green-300' },
    { id: 'archive', title: 'Archiv', color: 'bg-gray-100', border: 'border-gray-300' }
  ];

  $: currentIssues = browser && Array.isArray($issues) ? $issues : [];
</script>

<header class="bg-white shadow p-4 flex justify-between items-center">
  <div>
    <h1 class="text-2xl font-bold">Kanban Board</h1>
    <p class="text-sm text-pink-500">Land: {userCountry}</p>
  </div>
  <button on:click={() => showDialog = true} class="bg-blue-500 text-white px-4 py-2 rounded">+ Neue Aufgabe</button>
</header>

<main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
  {#each lanes as lane}
    <!-- Hier gehört der Code hin -->
    <Lane 
      {lane} 
      laneIssues={currentIssues.filter(issue => issue.lane === lane.id)} 
    />
  {/each}
</main>

{#if showDialog}
  <CreateIssueDialog on:close={() => showDialog = false} />
{/if}
