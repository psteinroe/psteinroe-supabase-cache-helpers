import { DecodedStorageKey } from '@supabase-cache-helpers/storage-core';
import { QueryKey } from '@tanstack/vue-query';

import { KEY_PREFIX } from './constants';

export const decode = (key: QueryKey): DecodedStorageKey | null => {
  if (!Array.isArray(key) || key.length !== 3 || key[0] !== KEY_PREFIX) {
    return null;
  }
  const [_, bucketId, path] = key;
  return { bucketId, path };
};
