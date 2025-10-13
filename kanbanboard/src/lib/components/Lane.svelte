<script>
  import Issue from '$lib/components/Issue.svelte';
  import { issues as issuesStore } from '$lib/stores/issues';

  export let lane;
  export let issues = [];

  function handleDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    issuesStore.moveIssue(id, lane.id);
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  $: total = issues.reduce((s, i) => s + i.storyPoints, 0);
</script>

<div
  class="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-3xl p-4 shadow-md hover:shadow-lg transition"
  role="list"
  on:drop={handleDrop}
  on:dragover={allowDrop}
>
  <div class="flex justify-between items-center bg-pink-100/60 text-pink-800 font-semibold px-4 py-2 rounded-xl mb-4">
    <h2>{lane.title}</h2>
    <span class="text-sm">{total} SP</span>
  </div>

  <div class="flex flex-col gap-3 min-h-[80px]">
    {#each issues as issue (issue.id)}
      <Issue {issue} />
    {/each}
  </div>
</div>
