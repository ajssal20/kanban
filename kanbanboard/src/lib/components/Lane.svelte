<script>
  import Issue from '$lib/components/Issue.svelte';
  import { issues as issuesStore } from '$lib/stores/Issues';

  export let lane;
  export let issues = [];

  let dragOver = false;

  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    dragOver = false;
    const issueId = event.dataTransfer.getData('text/plain');
    if (issueId) {
      issuesStore.moveIssue(issueId, lane.id);
    }
  }

  $: totalPoints = issues.reduce((sum, issue) => sum + issue.storyPoints, 0);
</script>

<div
  class="flex flex-col h-full min-h-[500px] rounded-2xl p-3 transition-all duration-300 backdrop-blur-sm"
  class:ring-4={dragOver}
  class:ring-offset-2={dragOver}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  style="background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5));"
>
  <div class="flex justify-between items-center mb-4 p-4 rounded-xl border-2 {lane.border} bg-gradient-to-r from-pink-100 to-green-100 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800 tracking-wide">{lane.title}</h2>
    <span class="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
      {totalPoints} SP
    </span>
  </div>

  <div class="flex-1 space-y-3 p-2 min-h-[200px] transition-all duration-300">
    {#each issues as issue (issue.id)}
      <Issue {issue} />
    {/each}
  </div>
</div>
