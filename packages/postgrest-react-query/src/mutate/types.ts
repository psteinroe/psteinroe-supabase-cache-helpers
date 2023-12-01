import { GetResult } from '@supabase/postgrest-js/dist/module/select-query-parser';
import {
  GenericSchema,
  GenericTable,
} from '@supabase/postgrest-js/dist/module/types';
import { PostgrestError } from '@supabase/supabase-js';
import {
  DeleteFetcherOptions,
  InsertFetcherOptions,
  UpdateFetcherOptions,
  UpsertFetcherOptions,
  RevalidateOpts,
} from '@supabase-cache-helpers/postgrest-core';
import { UseMutationOptions } from '@tanstack/react-query';

export type Operation = 'Insert' | 'UpdateOne' | 'Upsert' | 'DeleteOne';

type GetFetcherOptions<
  S extends GenericSchema,
  T extends GenericTable,
  O extends Operation,
> = O extends 'Insert'
  ? InsertFetcherOptions<S, T>
  : O extends 'UpdateOne'
    ? UpdateFetcherOptions<S, T>
    : O extends 'Upsert'
      ? UpsertFetcherOptions<S, T>
      : O extends 'DeleteOne'
        ? DeleteFetcherOptions<S, T>
        : never;

export type GetInputType<
  T extends GenericTable,
  O extends Operation,
> = O extends 'DeleteOne'
  ? Partial<T['Row']> // TODO: Can we pick the primary keys somehow?
  : O extends 'Insert' | 'Upsert'
    ? T['Insert'][]
    : O extends 'UpdateOne'
      ? T['Update']
      : never;

export type GetReturnType<
  S extends GenericSchema,
  T extends GenericTable,
  RelationName,
  Relationships,
  O extends Operation,
  Q extends string = '*',
  R = GetResult<
    S,
    T['Row'],
    RelationName,
    Relationships,
    Q extends '*' ? '*' : Q
  >,
> = O extends 'UpdateOne'
  ? R | null
  : O extends 'DeleteOne'
    ? R | null
    : O extends 'Insert' | 'Upsert'
      ? R[] | null
      : never;

export type UsePostgrestMutationOpts<
  S extends GenericSchema,
  T extends GenericTable,
  RelationName,
  Relationships,
  O extends Operation,
  Q extends string = '*',
  R = GetResult<
    S,
    T['Row'],
    RelationName,
    Relationships,
    Q extends '*' ? '*' : Q
  >,
> = RevalidateOpts<T['Row']> &
  UseMutationOptions<
    GetReturnType<S, T, RelationName, Relationships, O, Q, R> | null,
    PostgrestError,
    GetInputType<T, O>
  > & { disableAutoQuery?: boolean } & GetFetcherOptions<S, T, O>;
