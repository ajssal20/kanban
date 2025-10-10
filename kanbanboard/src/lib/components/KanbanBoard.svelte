<script>
  import { issues } from '$lib/stores/Issues';
  import { browser } from '$app/environment';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { get } from 'svelte/store';
  
  let showDialog = false;
  let userCountry = 'Unbekannt';
  
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
    { id: 'do', title: 'To Do', color: 'bg-pink-100', border: 'border-pink-300' },
    { id: 'doing', title: 'Doing', color: 'bg-yellow-100', border: 'border-yellow-300' },
    { id: 'done', title: 'Done', color: 'bg-green-100', border: 'border-green-300' },
    { id: 'archive', title: 'Archiv', color: 'bg-purple-100', border: 'border-purple-300' }
  ];

  $: currentIssues = browser && Array.isArray($issues) ? $issues : [];

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

<div class="min-h-screen bg-gradient-to-b from-green-50 via-pink-50 to-yellow-50 transition-all duration-700">
  <header class="bg-gradient-to-r from-green-200 via-pink-200 to-yellow-200 shadow border-b animate-fadeIn">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="animate-slideDown">
          <h1 class="text-3xl font-extrabold text-gray-800">🌸 Frühlings-Kanban 🌿</h1>
          <p class="text-sm text-gray-600">Land: {userCountry}</p>
        </div>
        <div class="flex gap-2">
          <button 
            on:click={() => showDialog = true}
            class="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full font-medium shadow-md transition transform hover:scale-105"
          >
            + Neue Aufgabe
          </button>
          <button 
            on:click={exportCSV}
            class="bg-green-200 hover:bg-green-300 text-gray-800 px-4 py-2 rounded-full font-medium shadow-md transition transform hover:scale-105"
          >
            CSV Export
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="main"
      aria-label="Kanban board with task lanes"
    >
      {#each lanes as lane}
        <Lane 
          {lane}
          issues={currentIssues.filter(issue => issue.lane === lane.id)}
        />
      {/each}
    </div>
  </main>

  {#if showDialog}
    <CreateIssueDialog on:close={() => showDialog = false} />
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slideDown {
    animation: slideDown 0.8s ease-out;
  }
</style>
