import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'kanban-issues';

const initialIssues = [
  {
    id: '1',
    title: 'Projekt Setup',
    description: 'SvelteKit + Tailwind + PWA',
    creationDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    storyPoints: 3,
    priority: 'high',
    lane: 'do'
  }
];

function load() {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialIssues;
  } catch {
    return initialIssues;
  }
}

function save(issues) {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

function createIssuesStore() {
  const { subscribe, set, update } = writable(load());

  // Persist on any change
  if (browser) {
    subscribe((val) => save(val));
  }

  return {
    subscribe,
    addIssue: (issue) =>
      update((issues) => {
        const id = crypto?.randomUUID?.() ?? Date.now().toString();
        const newIssue = {
          id,
          title: issue.title?.trim() || 'Untitled',
          description: issue.description?.trim() || '',
          creationDate: new Date().toISOString(),
          dueDate: (issue.dueDate instanceof Date ? issue.dueDate : new Date(issue.dueDate || Date.now())).toISOString(),
          storyPoints: Number.isFinite(issue.storyPoints) ? Number(issue.storyPoints) : 1,
          priority: issue.priority || 'medium',
          lane: issue.lane || 'do'
        };
        return [...issues, newIssue];
      }),
    moveIssue: (id, newLane) =>
      update((issues) => {
        const next = issues.map((it) => (it.id === id ? { ...it, lane: newLane } : it));
        // Notification when moved to done
        if (browser && newLane === 'done' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            const moved = next.find((i) => i.id === id);
            new Notification('Fertig! 🎉', {
              body: moved ? moved.title : 'Item abgeschlossen',
              tag: `done-${id}`
            });
          }
        }
        return next;
      }),
    deleteIssue: (id) =>
      update((issues) => issues.filter((i) => i.id !== id)),
    clearAll: () => set([])
  };
}

export const issues = createIssuesStore();
