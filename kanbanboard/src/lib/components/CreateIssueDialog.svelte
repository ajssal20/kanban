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

<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-pink-200/50 backdrop-blur-sm">
  <div class="relative bg-gradient-to-b from-pink-50 to-white border-2 border-pink-300 rounded-3xl shadow-xl p-8 w-[90%] max-w-md">
    <h2 class="text-center text-pink-700 font-extrabold text-3xl mb-6">
      🌸 Neue Aufgabe
    </h2>

    <form on:submit={handleSubmit} class="space-y-5">
      <div>
        <label for="title" class="block text-pink-800 font-semibold mb-1">Titel *</label>
        <input
          id="title"
          bind:value={title}
          required
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        />
      </div>

      <div>
        <label for="description" class="block text-pink-800 font-semibold mb-1">Beschreibung</label>
        <textarea
          id="description"
          bind:value={description}
          rows="3"
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        ></textarea>
      </div>

      <div>
        <label for="dueDate" class="block text-pink-800 font-semibold mb-1">Fällig am</label>
        <input
          id="dueDate"
          type="date"
          bind:value={dueDate}
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="storyPoints" class="block text-pink-800 font-semibold mb-1">Story Points</label>
          <select
            id="storyPoints"
            bind:value={storyPoints}
            class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
          >
            {#each [1, 2, 3, 5, 8, 13] as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="priority" class="block text-pink-800 font-semibold mb-1">Priorität</label>
          <select
            id="priority"
            bind:value={priority}
            class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
          >
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
        </div>
      </div>

      <div>
        <label for="lane" class="block text-pink-800 font-semibold mb-1">Spalte</label>
        <select
          id="lane"
          bind:value={lane}
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        >
          <option value="do">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
          <option value="archive">Archiv</option>
        </select>
      </div>

      <div class="flex justify-between mt-8">
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="bg-pink-100 text-pink-800 px-5 py-2 rounded-xl font-semibold hover:bg-pink-200 transition"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          class="bg-pink-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-600 transition transform hover:scale-105"
        >
          Erstellen
        </button>
      </div>
    </form>
  </div>
</div>
