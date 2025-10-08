<script>
  import { issues } from '$lib/stores/issues'; // 👈 bitte auf die exakte Groß-/Kleinschreibung achten!
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let title = '';
  let description = '';
  let dueDate = '';
  let storyPoints = 1;
  let priority = 'medium';
  let lane = 'do';
  let showFlowers = false;

  function handleSubmit() {
    if (!title.trim()) return;

    // ✅ hier ist der Fehler behoben – wir rufen direkt issues.addIssue auf
    issues.addIssue({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      storyPoints: parseInt(storyPoints),
      priority,
      lane,
      isNew: true
    });

    triggerFlowerAnimation();

    // Reset Felder
    title = '';
    description = '';
    dueDate = '';
    storyPoints = 1;
    priority = 'medium';
    lane = 'do';

    // Schließt das Fenster nach der Animation
    setTimeout(() => dispatch('close'), 1500);
  }

  function handleClose() {
    dispatch('close');
  }

  function triggerFlowerAnimation() {
    showFlowers = true;
    setTimeout(() => (showFlowers = false), 2000);
  }

  onMount(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  });
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
    {#if showFlowers}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        {#each Array(10) as _, i}
          <div
            class="flower"
            style="
              top: {Math.random() * 80}%;
              left: {Math.random() < 0.5 ? '-30px' : '100%'};
              animation-delay: {Math.random() * 0.5}s;
              animation-duration: {2 + Math.random()}s;
              transform: scale({0.6 + Math.random() * 0.5});
              --direction: {Math.random() < 0.5 ? '1' : '-1'};
            "
          ></div>
        {/each}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="p-6 relative z-10">
      <h2 class="text-2xl font-bold text-green-800 mb-6 text-center">🌸 Neue Aufgabe 🌸</h2>
      
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
          <input id="title" type="text" bind:value={title} class="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-300 outline-none" required />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea id="description" bind:value={description} rows="3" class="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-300 outline-none"></textarea>
        </div>

        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Fällig am</label>
          <input id="dueDate" type="date" bind:value={dueDate} class="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-300 outline-none" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="storyPoints" class="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
            <select id="storyPoints" bind:value={storyPoints} class="w-full px-3 py-2 border border-green-200 rounded-md">
              {#each [1,2,3,5,8,13] as points}
                <option value={points}>{points}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priorität</label>
            <select id="priority" bind:value={priority} class="w-full px-3 py-2 border border-green-200 rounded-md">
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>
        </div>

        <div>
          <label for="lane" class="block text-sm font-medium text-gray-700 mb-1">Spalte</label>
          <select id="lane" bind:value={lane} class="w-full px-3 py-2 border border-green-200 rounded-md">
            <option value="do">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
            <option value="archive">Archiv</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button type="button" on:click={handleClose} class="flex-1 px-4 py-2 text-gray-700 bg-green-100 rounded-md hover:bg-green-200 transition">
          Abbrechen
        </button>
        <button type="submit" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition transform hover:scale-[1.02]">
          Erstellen
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  /* 🌸 Blumen fliegen von den Seiten */
  .flower {
    position: absolute;
    width: 26px;
    height: 26px;
    background-image: radial-gradient(circle at 6px 6px, pink 40%, transparent 40%),
                      radial-gradient(circle at 20px 6px, pink 40%, transparent 40%),
                      radial-gradient(circle at 6px 20px, pink 40%, transparent 40%),
                      radial-gradient(circle at 20px 20px, pink 40%, transparent 40%),
                      radial-gradient(circle at 13px 13px, yellow 35%, transparent 35%);
    background-size: 26px 26px;
    animation: sideFlowers linear forwards;
    opacity: 0.9;
  }

  @keyframes sideFlowers {
    0% {
      transform: translateX(calc(var(--direction) * 100px)) translateY(0) rotate(0deg);
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(calc(var(--direction) * -120vw)) translateY(100px) rotate(360deg);
      opacity: 0;
    }
  }
</style>

