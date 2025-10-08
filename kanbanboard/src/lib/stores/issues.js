import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialIssues = [
  {
    id: '1',
    title: 'Projekt Setup',
    description: 'Svelte + Tailwind einrichten',
    creationDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
    storyPoints: 3,
    priority: 'high',
    lane: 'do'
  }
];

function createIssuesStore() {
  const { subscribe, set, update } = writable([]);

  if (browser) {
    const stored = localStorage.getItem('kanban-issues');
    set(stored ? JSON.parse(stored) : initialIssues);
  }

  return {
    subscribe,
    addIssue: (issue) => update(issues => {
      const newIssue = { ...issue, id: Date.now().toString(), creationDate: new Date().toISOString() };
      const newIssues = [...issues, newIssue];
      localStorage.setItem('kanban-issues', JSON.stringify(newIssues));
      return newIssues;
    }),
    moveIssue: (id, newLane) => update(issues => {
      const newIssues = issues.map(issue => issue.id === id ? { ...issue, lane: newLane } : issue);
      localStorage.setItem('kanban-issues', JSON.stringify(newIssues));
      return newIssues;
    }),
    deleteIssue: (id) => update(issues => {
      const newIssues = issues.filter(issue => issue.id !== id);
      localStorage.setItem('kanban-issues', JSON.stringify(newIssues));
      return newIssues;
    })
  };
}

export const issues = createIssuesStore();
