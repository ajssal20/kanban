<script>
import Issue from './Issue.svelte';
import { issues } from '$lib/stores/issues';
export let lane;
export let issues = [];

let dragOver = false;

function handleDragOver(e){ e.preventDefault(); dragOver = true; }
function handleDragLeave(){ dragOver = false; }
function handleDrop(e){
  e.preventDefault();
  dragOver = false;
  const id = e.dataTransfer.getData('text/plain');
  issues.moveIssue(id, lane.id);
}

$: totalPoints = issues.reduce((sum,i)=>sum+i.storyPoints,0);
</script>

<div on:dragover={handleDragOver} on:dragleave={handleDragLeave} on:drop={handleDrop} class="p-2 border rounded">
  <h2>{lane.title} ({totalPoints} SP)</h2>
  {#each issues as issue (issue.id)}
    <Issue {issue} />
  {/each}
</div>
