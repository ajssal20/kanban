<script>
import { issues } from '$lib/stores/issues';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

let title=''; let description=''; let dueDate=''; let storyPoints=1; let priority='medium'; let lane='do';

function handleSubmit(){
  issues.addIssue({ title, description, dueDate: dueDate? new Date(dueDate): new Date(), storyPoints, priority, lane });
  dispatch('close');
}
</script>

<form on:submit|preventDefault={handleSubmit} class="p-4 bg-white rounded shadow">
  <input type="text" bind:value={title} required placeholder="Titel" class="w-full mb-2 p-2 border"/>
  <textarea bind:value={description} placeholder="Beschreibung" class="w-full mb-2 p-2 border"></textarea>
  <input type="date" bind:value={dueDate} class="mb-2 p-2 border"/>
  <select bind:value={storyPoints} class="mb-2 p-2 border"><option>1</option></select>
  <select bind:value={priority} class="mb-2 p-2 border"><option>medium</option></select>
  <select bind:value={lane} class="mb-2 p-2 border"><option>do</option></select>
  <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Erstellen</button>
</form>
