# @supabase-cache-helpers/postgrest-fetcher

## 1.0.1

### Patch Changes

- c7caff3: fix: properly handle nested paths and undefined values when transforming to target schema
- Updated dependencies [c7caff3]
  - @supabase-cache-helpers/postgrest-filter@1.0.1

## 1.0.0

### Major Changes

- f73321d: The first major release of Supabase Cache Helpers is the result of months of testing in a production environment followed by a rewrite of large parts of the codebase. While the API stayed mostly the same, internals are more stable and powerful now.

  - Removed "mode" from insert and upsert mutations and only allow upsert([myItem]).
  - The query string is now dereived from the current cache keys before executing a mutation to fix issues with automatic cache updates.
  - Respect orderBy and pageSize in mutations to ensure proper sorting and pagination.
  - Added ordering to query key and exported explicit return types for hooks.
  - Use `PostgrestBuilder` or `PostgrestTransformBuilder` as parameter throughout and improve type inferrence.
  - Transform input into the format expected by cache key before mutation to update cache with mapped paths.
  - Allowed custom merge function for upsert mutation
  - throw type error if user tries to `select('*')`.
  - Introduced Tanstack query v1 (without infinite query support).
  - Improved support for storage in React Native.
  - Replaced use-mutation with useSWRMutation
  - Added demo and standalone docs.

  Checkout the new docs and get started!

### Patch Changes

- Updated dependencies [f73321d]
  - @supabase-cache-helpers/postgrest-filter@1.0.0
  - @supabase-cache-helpers/postgrest-shared@1.0.0

## 0.1.5

### Patch Changes

- 1ee893e: feat: allow PostgresTransformBuilder

## 0.1.4

### Patch Changes

- 0584735: refactor: simplify types and use upsert for insert and update mutations

## 0.1.3

### Patch Changes

- da10f5e: upgrade postgrest-js to 1.1.0

## 0.1.2

### Patch Changes

- 43c9221: upgrade supabase client packages

## 0.1.1

### Patch Changes

- 6946b2d: upgrade supabase-js and postgrest-js

## 0.1.0

### Minor Changes

- a2323de: - [BREAKING] Add support for insert many
  - Allow defining the select query on mutations
  - refactor internal swr mutation functions to prepare for subscriptions
  - move mutation fetchers into common postgrest-fetcher lib

## 0.0.1

### Patch Changes

- a63f516: Initial Release
