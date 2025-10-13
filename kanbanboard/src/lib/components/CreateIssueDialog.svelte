<script>
  import { issues } from '$lib/stores/issues';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let title = '';
  let description = '';
  let dueDate = '';
  let storyPoints = 1;
  let priority = 'medium';
  let lane = 'do';

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    issues.addIssue({
      title,
      description,
      dueDate,
      storyPoints,
      priority,
      lane
    });

    reset();
    dispatch('close');
  }

  function reset() {
    title = '';
    description = '';
    dueDate = '';
    storyPoints = 1;
    priority = 'medium';
    lane = 'do';
  }

  onMount(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  });
</script>

<div class="dialog-backdrop">
  <div class="dialog-card">
    <h2>🌸 Neue Aufgabe</h2>
    <form on:submit={handleSubmit}>
      <label>Titel *</label>
      <input bind:value={title} required />

      <label>Beschreibung</label>
      <textarea bind:value={description}></textarea>

      <label>Fällig am</label>
      <input type="date" bind:value={dueDate} />

      <label>Story Points</label>
      <select bind:value={storyPoints}>
        {#each [1,2,3,5,8,13] as p}
          <option value={p}>{p}</option>
        {/each}
      </select>

      <label>Priorität</label>
      <select bind:value={priority}>
        <option value="low">Niedrig</option>
        <option value="medium">Mittel</option>
        <option value="high">Hoch</option>
      </select>

      <label>Spalte</label>
      <select bind:value={lane}>
        <option value="do">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
        <option value="archive">Archiv</option>
      </select>

      <div class="btns">
        <button type="button" on:click={() => dispatch('close')} class="cancel">Abbrechen</button>
        <button type="submit" class="create">Erstellen</button>
      </div>
    </form>
  </div>
</div>

<style>
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(255, 192, 203, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .dialog-card {
    background: linear-gradient(180deg, #fff0f6, #fff);
    border: 2px solid #f9a8d4;
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
  }
  h2 {
    text-align: center;
    color: #be185d;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  label {
    display: block;
    font-size: 0.9rem;
    margin-top: 0.6rem;
    color: #a21caf;
  }
  input, textarea, select {
    width: 100%;
    border: 1px solid #f9a8d4;
    border-radius: 10px;
    padding: 0.5rem;
    background-color: #fff;
  }
  textarea { resize: none; }
  .btns {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .cancel {
    background: #fde2e9;
    border: none;
    border-radius: 10px;
    padding: 0.6rem 1.2rem;
    color: #881337;
  }
  .create {
    background: #ec4899;
    border: none;
    color: white;
    border-radius: 10px;
    padding: 0.6rem 1.2rem;
  }
  .create:hover {
    background: #db2777;
  }
</style>
