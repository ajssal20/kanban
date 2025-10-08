<script>
import { issues } from '$lib/stores/issues';
import Lane from './Lane.svelte';
import CreateIssueDialog from './CreateIssueDialog.svelte';
let showDialog = false;

const lanes = [
  { id: 'do', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
  { id: 'archive', title: 'Archiv' }
];

$: currentIssues = $issues;
</script>

<header class="p-4 bg-white shadow flex justify-between items-center">
  <h1 class="text-xl font-bold">Kanban Board</h1>
  <button on:click={() => showDialog = true} class="bg-blue-500 text-white px-4 py-2 rounded">+ Neue Aufgabe</button>
</header>

<main class="grid grid-cols-4 gap-4 p-4">
  {#each lanes as lane}
    <Lane lane={lane} issues={currentIssues.filter(i => i.lane === lane.id)} />
  {/each}
</main>

{#if showDialog}
  <CreateIssueDialog on:close={() => showDialog = false} />
{/if}
