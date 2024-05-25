import { MutationFetcherResponse } from '@supabase-cache-helpers/postgrest-core';

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T; // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}

export const getUserResponse = <R>(
  d: MutationFetcherResponse<R>[] | null | undefined,
) => {
  if (!d) return d;
  return d.map((r) => r.userQueryData).filter(truthy);
};
