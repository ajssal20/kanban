<script>
  import Issue from './Issue.svelte';
  import { issues as issuesStore } from '$lib/stores/Issues'; // Store mit anderem Namen importieren

  export let lane;
  export let laneIssues = []; // Prop für die Issues dieser Lane

  let dragOver = false;

  function handleDragOver(e){ 
    e.preventDefault(); 
    dragOver = true; 
  }

  function handleDragLeave(){ 
    dragOver = false; 
  }

  function handleDrop(e){
    e.preventDefault();
    dragOver = false;
    const id = e.dataTransfer.getData('text/plain');
    if (id) issuesStore.moveIssue(id, lane.id); // Store benutzen
  }

  $: totalPoints = laneIssues.reduce((sum, i) => sum + i.storyPoints, 0);
</script>

<div 
  on:dragover={handleDragOver} 
  on:dragleave={handleDragLeave} 
  on:drop={handleDrop}
  class="flex flex-col p-2 border rounded min-h-[200px]"
>
  <div class="flex justify-between items-center p-2 bg-gray-100 rounded">
    <h2>{lane.title}</h2>
    <span>{totalPoints} SP</span>
  </div>

  <div class="flex-1 mt-2 space-y-2">
    {#each laneIssues as issue (issue.id)}
      <Issue {issue} />
    {/each}
  </div>
</div>

