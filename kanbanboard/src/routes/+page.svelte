<script>
  // Wir behalten deine Logik, fokussieren uns aber auf das visuelle System:
  import { issues } from '$lib/stores/issues';
  import Lane from '$lib/components/Lane.svelte';
  import CreateIssueDialog from '$lib/components/CreateIssueDialog.svelte';
  import { get } from 'svelte/store';

  let showDialog = false;
  let country = 'Unbekannt';

  //  Ich definiere je Lane eine dezente Panel-Farbe.
  //    Grund: „Rahmen um die Lane“ ohne zu schreien – besser lesbar & optisch gruppiert.
  const lanes = [
    { id: 'do',     title: 'To Do',  panel: 'bg-[#fef5f6]' }, // zartes Rosé
    { id: 'doing',  title: 'Doing', panel: 'bg-[#fff8f0]' }, // zartes Apricot
    { id: 'done',   title: 'Done',  panel: 'bg-[#f3fbf4]' }, // zartes Mint (Erfolg)
    { id: 'archive',title: 'Archiv', panel: 'bg-[#f6f4fb]' } // zartes Flieder
  ];

  $: current = $issues || [];

  //  Land laden – wird im Header angezeigt (Kontext/Vertrauen).
  async function fetchCountry() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      country = data.country_name || 'Unbekannt';
    } catch {
      country = 'Unbekannt';
    }
  }
  fetchCountry();

  // Export
  function exportCSV() {
    const all = get(issues);
    const rows = [
      ['Title','Description','Creation Date','Due Date','Story Points','Priority','Lane'],
      ...all.map(i => [i.title, i.description, i.creationDate, i.dueDate, i.storyPoints, i.priority, i.lane])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'issues.csv';
    a.click();
  }
</script>

<!--  Ruhiger, klassischer Hintergrund:
     - viel Weiß/Creme mit leichtem Rosa-Verlauf
     - Ziel: „calm“ und nicht kitschig -->
<div class="min-h-screen bg-gradient-to-br from-[#faf5f7] via-[#fffafc] to-[#fefaf8] text-[#4a3f4b] font-[Poppins]">

  <!--  Zurückhaltender Header:
       - halbtransparenter weißer Balken mit Blur für moderne Ruhe
       - sehr dezente Linie + kleiner Schatten -->
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-rose-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
      <div>
        <!-- Titel: kräftiger, aber nicht grell -->
        <h1 class="text-3xl font-extrabold text-rose-600 tracking-tight">Kanban-Board</h1>
        <p class="text-sm text-rose-400">🌍 Land: {country}</p>
      </div>

      <div class="flex gap-3">
        <!-- Primärbutton: satter Rosé-Ton, leichtes Hover-Lift
             Grund: Fokusaktion „Neue Aufgabe“ soll auffallen -->
        <button
          on:click={() => (showDialog = true)}
          class="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:shadow transition"
        >
          ➕ Neue Aufgabe
        </button>

        <!-- Sekundärbutton: outlined/neutral – geringe visuelle Priorität -->
        <button
          on:click={exportCSV}
          class="border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 font-medium px-5 py-2 rounded-lg shadow-sm transition"
        >
          📤 CSV Export
        </button>
      </div>
    </div>
  </header>

  <!-- ✅ Board: Lanes in klassischem Grid, großzügiger Abstand
       Grund: Luft/Lesbarkeit, Panels kommen so besser zur Geltung -->
  <main class="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {#each lanes as lane}
      <!-- 👇 Jede Lane bekommt jetzt einen eigenen „Panel-Block“ (andere Farbpalette) -->
      <div
        class={`rounded-3xl border border-rose-100 shadow-sm ${lane.panel} p-3`}
        aria-label={`Panel für ${lane.title}`}
      >
        <!-- Innen liegt die eigentliche Lane-Komponente, die Drag&Drop, Summe etc. übernimmt -->
        <Lane {lane} issues={current.filter(i => i.lane === lane.id)} />
      </div>
    {/each}
  </main>

  {#if showDialog}
    <!-- CreateIssueDialog: deine bestehende Variante (mit Blumen-Animation) bleibt.
         Grund: Feature ist gewünscht und passt zum „Soft“-Theme. -->
    <CreateIssueDialog on:close={() => (showDialog = false)} />
  {/if}
</div>
