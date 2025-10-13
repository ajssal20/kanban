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
  let showFlowers = false;

  const borderFlowers = [
    'top:-10px; left:10%;',
    'top:-10px; left:45%;',
    'top:-10px; right:10%;',
    'right:-10px; top:25%;',
    'right:-10px; top:65%;',
    'bottom:-10px; right:10%;',
    'bottom:-10px; left:45%;',
    'bottom:-10px; left:10%;',
    'left:-10px; top:25%;',
    'left:-10px; top:65%;'
  ];

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

    triggerFlowerAnimation();
    reset();
    setTimeout(() => dispatch('close'), 2600);
  }

  function reset() {
    title = '';
    description = '';
    dueDate = '';
    storyPoints = 1;
    priority = 'medium';
    lane = 'do';
  }

  function triggerFlowerAnimation() {
    showFlowers = true;
    setTimeout(() => (showFlowers = false), 2000);
  }

  onMount(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  });
</script>

<!-- 🌸 MODAL -->
<div
  class="fixed inset-0 z-[9999] flex items-center justify-center bg-pink-200/50 backdrop-blur-sm"
>
  <div
    class="relative bg-gradient-to-b from-pink-50 to-white border-2 border-pink-300 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-8 w-[90%] max-w-md overflow-hidden animate-popup"
  >
    {#if showFlowers}
      <!-- Randblumen -->
      <div class="absolute inset-0 pointer-events-none">
        {#each borderFlowers as pos, i}
          <div class="absolute flower" style={`animation-delay:${i * 0.1}s; ${pos}`}></div>
        {/each}
      </div>

      <!-- Schwebende Blüten -->
      <div class="absolute inset-0 pointer-events-none">
        {#each Array(10) as _, i}
          <div
            class="absolute petal"
            style={`top:${Math.random() * 100}%; left:${Math.random() * 100}%; animation-delay:${Math.random()}s;`}
          ></div>
        {/each}
      </div>
    {/if}

    <h2 class="text-center text-pink-700 font-extrabold text-3xl mb-6 flex justify-center items-center gap-2">
      🌸 Neue Aufgabe
    </h2>

    <form on:submit={handleSubmit} class="space-y-5">
      <div>
        <label class="block text-pink-800 font-semibold mb-1">Titel *</label>
        <input
          bind:value={title}
          required
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        />
      </div>

      <div>
        <label class="block text-pink-800 font-semibold mb-1">Beschreibung</label>
        <textarea
          bind:value={description}
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block text-pink-800 font-semibold mb-1">Fällig am</label>
        <input
          type="date"
          bind:value={dueDate}
          class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-pink-800 font-semibold mb-1">Story Points</label>
          <select
            bind:value={storyPoints}
            class="w-full border border-pink-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
          >
            {#each [1, 2, 3, 5, 8, 13] as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-pink-800 font-semibold mb-1">Priorität</label>
          <select
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
        <label class="block text-pink-800 font-semibold mb-1">Spalte</label>
        <select
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

<style>
  /* 🌸 Animationen & Blumen */
  .flower {
    width: 26px;
    height: 26px;
    background-image: radial-gradient(circle at 6px 6px, pink 40%, transparent 40%),
                      radial-gradient(circle at 20px 6px, pink 40%, transparent 40%),
                      radial-gradient(circle at 6px 20px, pink 40%, transparent 40%),
                      radial-gradient(circle at 20px 20px, pink 40%, transparent 40%),
                      radial-gradient(circle at 13px 13px, yellow 35%, transparent 35%);
    background-size: 26px 26px;
    animation: bloom 2s ease-in-out forwards;
    opacity: 0.8;
  }

  .petal {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at center, #fbcfe8 0%, #f472b6 70%);
    border-radius: 50%;
    opacity: 0;
    animation: floatPetal 3s ease-in-out forwards;
  }

  @keyframes bloom {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  @keyframes floatPetal {
    0% {
      transform: translateY(0) scale(0.5);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    100% {
      transform: translateY(-50px) scale(1.2) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes popup {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-popup {
    animation: popup 0.3s ease-out;
  }
</style>
