import { writable } from 'svelte/store';

export type Role = 'viewer' | 'editor';

const roleStore = writable<Role>('editor');

export function getRole() {
  let value: Role = 'editor';
  roleStore.subscribe(v => value = v)();
  return value;
}

export function setRole(newRole: Role) {
  roleStore.set(newRole);
}

export { roleStore };