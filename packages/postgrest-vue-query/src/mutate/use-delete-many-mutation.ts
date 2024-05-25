import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { GetResult } from '@supabase/postgrest-js/dist/module/select-query-parser';
import {
  GenericSchema,
  GenericTable,
} from '@supabase/postgrest-js/dist/module/types';
import {
  buildDeleteFetcher,
  getTable,
} from '@supabase-cache-helpers/postgrest-core';
import { useMutation } from '@tanstack/vue-query';

import { UsePostgrestMutationOpts } from './types';
import { useDeleteItem } from '../cache';
import { useQueriesForTableLoader } from '../lib';

/**
 * Hook to execute a DELETE mutation
 *
 * @param {PostgrestQueryBuilder<S, T>} qb PostgrestQueryBuilder instance for the table
 * @param {Array<keyof T['Row']>} primaryKeys Array of primary keys of the table
 * @param {string | null} query Optional PostgREST query string for the DELETE mutation
 * @param {UsePostgrestMutationOpts<S, T, 'DeleteOne', Q, R>} [opts] Options to configure the hook
 */
function useDeleteManyMutation<
  S extends GenericSchema,
  T extends GenericTable,
  RelationName,
  Re = T extends { Relationships: infer R } ? R : unknown,
  Q extends string = '*',
  R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
>(
  qb: PostgrestQueryBuilder<S, T, Re>,
  primaryKeys: (keyof T['Row'])[],
  query?: Q | null,
  opts?: UsePostgrestMutationOpts<S, T, RelationName, Re, 'DeleteMany', Q, R>,
) {
  const queriesForTable = useQueriesForTableLoader(getTable(qb));
  const deleteItem = useDeleteItem({
    ...opts,
    primaryKeys,
    table: getTable(qb),
    schema: qb.schema as string,
  });

  return useMutation({
    mutationFn: async (input: T['Row'][]) => {
      const result = await buildDeleteFetcher<S, T, RelationName, Re, Q, R>(
        qb,
        primaryKeys,
        {
          query: query ?? undefined,
          queriesForTable,
          disabled: opts?.disableAutoQuery,
          ...opts,
        },
      )(input);

      if (result) {
        for (const r of result) {
          deleteItem(r.normalizedData as T['Row']);
        }
      }

      if (!result || result.every((r) => !r.userQueryData)) return null;

      return result.map((r) => r.userQueryData as R);
    },
    ...opts,
  });
}

export { useDeleteManyMutation };
