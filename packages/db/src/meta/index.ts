import { logger } from "@truffle/db/logger";
const debug = logger("db:meta");

export type Collections = {
  [collectionName: string]:
    | {
        resource: {
          id: string;
        };
        input: object;
        mutable?: boolean;
        named?: false;
      }
    // definitely named, must define name property
    | {
        resource: {
          id: string;
          name: string;
        };
        input: object;
        mutable?: boolean;
        named: true;
      };
};

export type CollectionName<C extends Collections> = string & keyof C;

export type Collection<
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>
> = {
  [K in N]: C[K];
}[N];

export type CollectionPropertyFilter = {
  extends: any;
};

export type CollectionPropertyName<
  F extends CollectionPropertyFilter = CollectionPropertyFilter
> = {
  [P in string &
    keyof Collection<Collections>]: F["extends"] extends CollectionProperty<
    P,
    Collections
  >
    ? P
    : never;
}[string & keyof Collection<Collections>];

export type CollectionProperty<
  P extends CollectionPropertyName,
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>
> = Collection<C, N>[P];

export type ResourceFilter = {
  is: CollectionPropertyName<{ extends: boolean }>;
};

export type Resource<
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>,
  F = undefined
> = F extends ResourceFilter
  ? Extract<Collection<C, N>, { [K in F["is"]]: true }> extends never
    ? never
    : Extract<Collection<C, N>, { [K in F["is"]]: true }>["resource"]
  : CollectionProperty<"resource", C, N>;

export type Input<
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>
> = CollectionProperty<"input", C, N>;

export type SavedInput<
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>
> = {
  [K in keyof Input<C, N> | "id"]: K extends keyof Input<C, N>
    ? Input<C, N>[K]
    : string;
};

export type FilteredCollectionName<C extends Collections, F = undefined> = {
  [K in CollectionName<C>]: Resource<C, K, F> extends never ? never : K;
}[CollectionName<C>];

export type MutableResource<
  C extends Collections,
  N extends CollectionName<C> = CollectionName<C>
> = Resource<C, N, { is: "mutable" }>;

export type MutableCollectionName<
  C extends Collections
> = FilteredCollectionName<C, { is: "mutable" }>;

export type NamedResource<
  C extends Collections = Collections,
  N extends CollectionName<C> = CollectionName<C>
> = Resource<C, N, { is: "named" }>;

export type NamedCollectionName<C extends Collections> = FilteredCollectionName<
  C,
  { is: "named" }
>;

export type MutationInput<
  C extends Collections,
  N extends CollectionName<C>
> = {
  [K in N]: Input<C, N>[];
};

export type MutationPayload<
  C extends Collections,
  N extends CollectionName<C>
> = {
  [K in N]: Resource<C, N>[];
};

export type IdObject<R extends Resource = Resource> = {
  [N in keyof R]: N extends "id" ? string : never;
};

export const toIdObject = <R extends Resource>({ id }: R): IdObject<R> =>
  ({
    id
  } as IdObject<R>);
