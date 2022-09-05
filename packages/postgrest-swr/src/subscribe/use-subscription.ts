import { useSWRConfig } from "swr";
import { useEffect } from "react";
import {
  GenericTable,
  PostgrestSWRMutatorOpts,
  useCacheScanner,
  update,
  insert,
  remove,
} from "../lib";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Response, PostgresChangeFilter } from "./types";
import { DEFAULT_SCHEMA_NAME } from "@supabase-cache-helpers/postgrest-shared";

function useSubscription<T extends GenericTable>(
  channel: RealtimeChannel | null,
  filter: PostgresChangeFilter,
  primaryKeys: (keyof T["Row"])[],
  opts?: Omit<PostgrestSWRMutatorOpts<T>, "schema">
) {
  const { mutate } = useSWRConfig();
  const scan = useCacheScanner(filter.table, opts);

  useEffect(() => {
    if (!channel) return;

    const subscription = channel
      .on(
        "postgres_change",
        { ...filter, schema: filter.schema ?? DEFAULT_SCHEMA_NAME },
        async (payload: Response<T>) => {
          console.log(payload);
          const keys = scan();
          if (payload.type === "INSERT") {
            await insert<T>([payload.record], keys, mutate, opts);
          } else if (payload.type === "UPDATE") {
            await update<T>(payload.record, primaryKeys, keys, mutate, opts);
          } else if (payload.type === "DELETE") {
            await remove<T>(
              payload.old_record,
              primaryKeys,
              keys,
              mutate,
              opts
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);
}

export { useSubscription };