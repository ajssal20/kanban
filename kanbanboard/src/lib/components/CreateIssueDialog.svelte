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
  let showSuccess = false;

  // Rand-Blumen – Feature gewünscht; behalten, aber optisch zarter durch Reststil
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

    // Datenfluss bleibt identisch – Stil getrennt von Logik
    issues.addIssue({ title, description, dueDate, storyPoints, priority, lane });

    triggerFlowerAnimation();
    triggerSuccessAnimation();
    reset();
    setTimeout(() => dispatch('close'), 2200);
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
    setTimeout(() => (showFlowers = false), 1600);
  }
  function triggerSuccessAnimation() {
    showSuccess = true;
    setTimeout(() => (showSuccess = false), 1200);
  }

  onMount(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  });
</script>

<!--  Overlay: sehr zartes Rosa + Blur → modern & ruhig -->
<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-rose-200/40 backdrop-blur-sm">
  <!--  Modal: klassisch (weiß), feiner Rosé-Rand, sanfter Schatten -->
  <div class="relative bg-white border border-rose-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-7 w-[92%] max-w-md overflow-hidden modal-popup">

    <!--  dein gewünschter Effekt bleibt – nur eingebettet in ruhigeres UI -->
    {#if showFlowers}
      <div class="absolute inset-0 pointer-events-none">
        {#each borderFlowers as pos, i}
          <div class="absolute flower" style={`animation-delay:${i * 0.08}s; ${pos}`}></div>
        {/each}
      </div>
      <div class="absolute inset-0 pointer-events-none">
        {#each Array(8) as _, i}
          <div
            class="absolute petal"
            style={`top:${Math.random() * 100}%; left:${Math.random() * 100}%; animation-delay:${Math.random()}s;`}
          ></div>
        {/each}
      </div>
    {/if}

    {#if showSuccess}
      <div class="absolute inset-0 pointer-events-none">
        <div class="success-burst"></div>
      </div>
    {/if}

    <h2 class="text-center text-rose-700 font-extrabold text-2xl mb-5">
      Neue Aufgabe
    </h2>

    <!-- Form: klassische Inputs, klare Labels, sehr guter Kontrast -->
    <form on:submit={handleSubmit} class="space-y-4">
      <div>
        <label for="title" class="block text-rose-800 font-semibold mb-1">Titel *</label>
        <input
          id="title"
          bind:value={title}
          required
          class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
        />
      </div>

      <div>
        <label for="description" class="block text-rose-800 font-semibold mb-1">Beschreibung</label>
        <textarea
          id="description"
          bind:value={description}
          rows="3"
          class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
        ></textarea>
      </div>

      <div>
        <label for="dueDate" class="block text-rose-800 font-semibold mb-1">Fällig am</label>
        <input
          id="dueDate"
          type="date"
          bind:value={dueDate}
          class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="storyPoints" class="block text-rose-800 font-semibold mb-1">Story Points</label>
          <select
            id="storyPoints"
            bind:value={storyPoints}
            class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
          >
            {#each [1,2,3,5,8,13] as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="priority" class="block text-rose-800 font-semibold mb-1">Priorität</label>
          <select
            id="priority"
            bind:value={priority}
            class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
          >
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
        </div>
      </div>

      <div>
        <label for="lane" class="block text-rose-800 font-semibold mb-1">Spalte</label>
        <select
          id="lane"
          bind:value={lane}
          class="w-full border border-rose-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-300 outline-none"
        >
          <option value="do">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
          <option value="archive">Archiv</option>
        </select>
      </div>

      <div class="flex justify-between pt-2">
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-lg font-medium transition"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          class="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
        >
          Erstellen
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  /* Animationen bleiben, aber wirken durch das ruhigere UI edler */
  .flower {
    width: 24px;
    height: 24px;
    background-image:
      radial-gradient(circle at 6px 6px, pink 40%, transparent 40%),
      radial-gradient(circle at 18px 6px, pink 40%, transparent 40%),
      radial-gradient(circle at 6px 18px, pink 40%, transparent 40%),
      radial-gradient(circle at 18px 18px, pink 40%, transparent 40%),
      radial-gradient(circle at 12px 12px, #ffd166 35%, transparent 35%);
    background-size: 24px 24px;
    animation: bloom 1.6s ease-in-out forwards;
    opacity: 0.9;
  }
  .petal {
    position: absolute;
    width: 18px;
    height: 18px;
    background: radial-gradient(circle at center, #fce7f3 0%, #f9a8d4 70%);
    border-radius: 50%;
    opacity: 0;
    animation: floatPetal 2.2s ease-in-out forwards;
  }
  @keyframes bloom {
    0% { transform: scale(0); opacity: 0; }
    40% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes floatPetal {
    0% { transform: translateY(0) scale(0.6); opacity: 0; }
    25% { opacity: 1; }
    100% { transform: translateY(-40px) scale(1.15) rotate(360deg); opacity: 0; }
  }
  .modal-popup {
    animation: fadeInModal 0.35s ease-out;
  }
  @keyframes fadeInModal {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  /*  sanfter Erfolgs-Glow bei Submit */
  .success-burst {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 65%);
    animation: burst 1.2s ease-out forwards;
  }
  @keyframes burst {
    0%   { transform: scale(0);   opacity: 1; }
    60%  { transform: scale(2.2); opacity: 0.6; }
    100% { transform: scale(3);   opacity: 0; }
  }
</style>
