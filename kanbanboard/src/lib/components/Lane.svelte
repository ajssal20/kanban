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

<div class="lane" on:drop={handleDrop} on:dragover={allowDrop}>
  <div class="lane-header">
    <h2>{lane.title}</h2>
    <span>{total} SP</span>
  </div>
  <div class="lane-content">
    {#each issues as issue (issue.id)}
      <Issue {issue} />
    {/each}
  </div>
</div>

<style>
  .lane {
    background: linear-gradient(180deg, #fff0f6, #fff);
    border: 2px solid #f9a8d4;
    border-radius: 20px;
    padding: 1rem;
  }
  .lane-header {
    display: flex;
    justify-content: space-between;
    background: #fbcfe8;
    padding: 0.5rem 0.8rem;
    border-radius: 12px;
    color: #9d174d;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  .lane-content {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
</style>
