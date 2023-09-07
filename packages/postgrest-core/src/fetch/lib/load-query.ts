import { parseSelectParam } from '../../parse/lib/parse-select-param';
import { extractPathsFromFilters } from '../../utils/extract-paths-from-filter';
import {
  FilterDefinitions,
  Path,
  QueryWithoutWildcard,
} from '../../utils/query-types';
import { buildSelectStatement } from './build-select-statement';
import { removeAliasFromDeclaration } from './remove-alias-from-declaration';

export type LoadQueryOps<Q extends string = '*'> = {
  query?: QueryWithoutWildcard<Q> | null;
  disabled?: boolean;
  queriesForTable: () => { paths: Path[]; filters: FilterDefinitions }[];
};

export type LoadQueryReturn = {
  selectQuery: string;
  userQueryPaths: Path[] | null;
  paths: Path[];
};

// returns select statement that includes all paths currently loaded into cache to later perform a "smart update"
export const loadQuery = <Q extends string = '*'>({
  query,
  disabled,
  queriesForTable,
}: LoadQueryOps<Q>): LoadQueryReturn | null => {
  // parse user query
  const userQueryPaths = query ? parseSelectParam(query) : null;

  // cache data paths
  // unique set of declaration without paths.
  // alias not needed for paths
  // declaration without alias!
  const paths: Path[] = userQueryPaths
    ? userQueryPaths.map((q) => ({
        declaration: removeAliasFromDeclaration(q.declaration),
        path: q.path,
      }))
    : [];
  if (!disabled) {
    for (const tableQuery of queriesForTable()) {
      for (const filterPath of extractPathsFromFilters(tableQuery.filters)) {
        // add paths used in filter
        const path = tableQuery.paths.find(
          (p) => p.path === filterPath.path && p.alias === filterPath.alias
        ) ?? {
          ...filterPath,
          declaration: filterPath.path,
        };
        // add unique
        if (
          paths.every(
            (p) =>
              removeAliasFromDeclaration(p.declaration) !==
              removeAliasFromDeclaration(path.declaration)
          )
        ) {
          // do not use alias
          paths.push({
            path: path.path,
            declaration: removeAliasFromDeclaration(path.declaration),
          });
        }
      }
      // add paths used in query
      for (const path of tableQuery.paths) {
        if (
          paths.every(
            (p) =>
              removeAliasFromDeclaration(p.declaration) !==
              removeAliasFromDeclaration(path.declaration)
          ) &&
          // do not add agg functions
          !path.declaration.endsWith('.count')
        ) {
          // do not use alias
          paths.push({
            path: path.path,
            declaration: removeAliasFromDeclaration(path.declaration),
          });
        }
      }
    }
  }
  const selectQuery = buildSelectStatement(paths);
  if (selectQuery.length === 0) return null;
  return { selectQuery, userQueryPaths, paths };
};