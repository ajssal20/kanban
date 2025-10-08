<script>
export let issue;

function handleDragStart(e){
  e.dataTransfer.setData('text/plain', issue.id);
  e.dataTransfer.effectAllowed = 'move';
}
</script>

<div class="p-2 border rounded shadow cursor-move" draggable="true" on:dragstart={handleDragStart}>
  <h3>{issue.title}</h3>
  <p>{issue.description}</p>
</div>
