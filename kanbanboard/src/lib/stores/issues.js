import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'kanban-issues';

function load() {
  if (!browser) return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function save(issues) {
  if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

function createIssuesStore() {
  const { subscribe, update, set } = writable(load());

  if (browser) {
    subscribe(save);
  }

  return {
    subscribe,
    addIssue: (issue) =>
      update((issues) => {
        const id = crypto.randomUUID();
        const newIssue = {
          id,
          title: issue.title || 'Unbenannt',
          description: issue.description || '',
          creationDate: new Date().toISOString(),
          dueDate: new Date(issue.dueDate || Date.now()).toISOString(),
          storyPoints: issue.storyPoints || 1,
          priority: issue.priority || 'medium',
          lane: issue.lane || 'do'
        };
        return [...issues, newIssue];
      }),
    moveIssue: (id, newLane) =>
      update((issues) => {
        const updated = issues.map((i) => (i.id === id ? { ...i, lane: newLane } : i));
        if (browser && newLane === 'done' && Notification.permission === 'granted') {
          const doneItem = updated.find((i) => i.id === id);
          new Notification('🎉 Aufgabe erledigt', { body: doneItem?.title });
        }
        return updated;
      }),
    deleteIssue: (id) => update((issues) => issues.filter((i) => i.id !== id)),
    clearAll: () => set([])
  };
}

export const issues = createIssuesStore();
