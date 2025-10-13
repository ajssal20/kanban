<script>
  import Issue from '$lib/components/Issue.svelte';
  import { issues as issuesStore } from '$lib/stores/issues';

  export let lane;         // { id, title }
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
    if (issueId) issuesStore.moveIssue(issueId, lane.id);
  }

  $: totalPoints = issues.reduce((sum, it) => sum + (Number(it.storyPoints) || 0), 0);
</script>

<section
  class="flex flex-col h-full min-h-[460px] rounded-2xl p-3 transition-all border bg-white/60 backdrop-blur-sm"
  class:ring-4={dragOver}
  class:ring-offset-2={dragOver}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  aria-label={`Lane ${lane.title}`}
>
  <div class="flex items-center justify-between mb-3">
    <h2 class="text-base font-semibold tracking-wide">{lane.title}</h2>
    <span class="text-xs px-2 py-1 rounded-full bg-gray-100">Summe: {totalPoints} SP</span>
  </div>

  <div class="flex-1 space-y-3">
    {#each issues as issue (issue.id)}
      <Issue {issue} />
    {/each}
  </div>
</section>
