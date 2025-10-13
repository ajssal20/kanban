<script>
  import { issues } from '$lib/stores/issues';
  import { createEventDispatcher, onMount } from 'svelte';
  import { browser } from '$app/environment';

  export let open = false;
  const dispatch = createEventDispatcher();

  let dialogEl;
  let title = '';
  let description = '';
  let dueDate = '';
  let storyPoints = 1;
  let priority = 'medium';
  let lane = 'do';

  function reset() {
    title = '';
    description = '';
    dueDate = '';
    storyPoints = 1;
    priority = 'medium';
    lane = 'do';
  }

  function closeDialog() {
    if (dialogEl?.open) dialogEl.close();
    dispatch('close');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    issues.addIssue({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      storyPoints: parseInt(storyPoints),
      priority,
      lane
    });

    reset();
    closeDialog();
  }

  // Open/close reactively
  $: if (open && dialogEl && !dialogEl.open) dialogEl.showModal();
  $: if (!open && dialogEl && dialogEl.open) dialogEl.close();

  onMount(() => {
    if (browser && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  });
</script>

<dialog bind:this={dialogEl} class="rounded-2xl w-full max-w-md p-0 backdrop:bg-black/40">
  <form method="dialog" class="p-6" on:submit|preventDefault={handleSubmit}>
    <h2 class="text-xl font-semibold mb-4">Neue Aufgabe</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm mb-1" for="title">Titel *</label>
        <input id="title" class="w-full border rounded-md px-3 py-2" bind:value={title} required />
      </div>

      <div>
        <label class="block text-sm mb-1" for="description">Beschreibung</label>
        <textarea id="description" class="w-full border rounded-md px-3 py-2" rows="3" bind:value={description}></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1" for="dueDate">Fällig am</label>
          <input id="dueDate" type="date" class="w-full border rounded-md px-3 py-2" bind:value={dueDate} />
        </div>
        <div>
          <label class="block text-sm mb-1" for="storyPoints">Story Points</label>
          <select id="storyPoints" class="w-full border rounded-md px-3 py-2" bind:value={storyPoints}>
            {#each [1,2,3,5,8,13,21] as p}<option value={p}>{p}</option>{/each}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1" for="priority">Priorität</label>
          <select id="priority" class="w-full border rounded-md px-3 py-2" bind:value={priority}>
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1" for="lane">Spalte</label>
          <select id="lane" class="w-full border rounded-md px-3 py-2" bind:value={lane}>
            <option value="do">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
            <option value="archive">Archiv</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mt-6">
      <button type="button" class="px-4 py-2 rounded-md border" on:click={closeDialog}>Abbrechen</button>
      <button type="submit" class="px-4 py-2 rounded-md bg-black text-white">Erstellen</button>
    </div>
  </form>
</dialog>

<style>
  dialog::backdrop { transition: opacity .2s ease; }
</style>
