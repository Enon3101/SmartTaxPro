import { set, get, del, keys } from 'idb-keyval';

const DRAFT_PREFIX = 'tax-draft-';

export async function saveDraft(key: string, data: any) {
  return set(DRAFT_PREFIX + key, data);
}

export async function loadDraft(key: string) {
  return get(DRAFT_PREFIX + key);
}

export async function deleteDraft(key: string) {
  return del(DRAFT_PREFIX + key);
}

export async function listDraftKeys() {
  const allKeys = await keys();
  return allKeys.filter(k => typeof k === 'string' && k.startsWith(DRAFT_PREFIX));
}

export async function listAllDrafts() {
  const draftKeys = await listDraftKeys();
  const drafts = await Promise.all(draftKeys.map(k => get(k)));
  return draftKeys
    .map((k, i) => (typeof k === 'string' ? { key: k.replace(DRAFT_PREFIX, ''), data: drafts[i] } : null))
    .filter(Boolean);
} 