<script>
  import Issue from '$lib/components/Issue.svelte';
  import { issues as issuesStore } from '$lib/stores/issues';

  export let lane;
  export let issues = [];

  let dragOver = false;

  function handleDrop(e) {
    e.preventDefault();
    dragOver = false;
    const id = e.dataTransfer.getData('text/plain');
    issuesStore.moveIssue(id, lane.id);
    //Done-Animation/Notification passiert im Store bzw. in Issue.svelte.
  }

  function allowDrop(e) {
    e.preventDefault();
    dragOver = true;
  }
  function handleDragLeave() {
    dragOver = false;
  }

  // Summe der Story Points – schnelle visuelle Orientierung
  $: total = issues.reduce((s, i) => s + i.storyPoints, 0);
</script>

<!-- Innere Lane-Karte:
     - weiß, dezente Umrandung, weiche Schatten
     - Grund: guter Kontrast zum farbigen Panel-Block aus der Page -->
<div
  class="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden"
  role="list"
  on:drop={handleDrop}
  on:dragover={allowDrop}
  on:dragleave={handleDragLeave}
  class:ring-4={dragOver}
  class:ring-rose-200={dragOver}
>

  <!-- Lane-Header:
       - Ton in Ton (rosa-neutral), dezente Innenschatten-Anmutung
       - Grund: klare Hierarchie ohne harte Balken -->
  <div class="flex justify-between items-center bg-rose-50/70 text-rose-800 font-semibold px-4 py-2 rounded-xl mb-4">
    <h2 class="text-[1.05rem]">{lane.title}</h2>
    <span class="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
      {total} SP
    </span>
  </div>

  <!-- Inhalt: vertikale Rhythmik, Mindesthöhe für Drop-Ziel -->
  <div class="flex flex-col gap-3 min-h-[100px]">
    {#each issues as issue (issue.id)}
      <!-- data-id bleibt für mögliche Trigger (Animation etc.) -->
      <div data-id={issue.id}>
        <Issue {issue} />
      </div>
    {/each}
  </div>

  <!-- Drop-Feedback:
       – weicher, gestrichelter Rahmen nur während DragOver
       – Grund: Klarheit ohne visuelle Unruhe im Normalzustand -->
  {#if dragOver}
    <div class="absolute inset-0 rounded-2xl border-4 border-dashed border-rose-200 animate-pulse pointer-events-none"></div>
  {/if}
</div>
