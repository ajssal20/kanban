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

<div class="app">
  <header>
    <div>
      <h1>💖 Pink Kanban Board</h1>
      <p>Land: {country}</p>
    </div>
    <div class="actions">
      <button on:click={() => showDialog = true}>+ Neue Aufgabe</button>
      <button on:click={exportCSV}>📤 CSV Export</button>
    </div>
  </header>

  <main>
    {#each lanes as lane}
      <Lane {lane} issues={current.filter(i => i.lane === lane.id)} />
    {/each}
  </main>

  {#if showDialog}
    <CreateIssueDialog on:close={() => showDialog = false} />
  {/if}
</div>

<style>
  .app {
    background: linear-gradient(180deg, #fdf2f8 0%, #fff 100%);
    min-height: 100vh;
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
  }
  header {
    background: linear-gradient(to right, #fbcfe8, #f9a8d4, #fce7f3);
    border-radius: 20px;
    padding: 1rem 2rem;
    box-shadow: 0 3px 8px rgba(236, 72, 153, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  h1 {
    color: #9d174d;
    margin: 0;
  }
  .actions button {
    margin-left: 0.5rem;
    background: #ec4899;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
  }
  .actions button:hover {
    background: #db2777;
  }
  main {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
</style>
