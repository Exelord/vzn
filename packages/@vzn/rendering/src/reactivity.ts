export type Config = {
  untrack<T>(fn: () => T): T;
  onCleanup(fn: () => void): void;
  createRoot<T>(fn: (dispose: () => void) => T): T;
  createMemo<T>(fn: () => T, equal?: boolean): () => T;
  
  createValue<T>(): [() => T | undefined, <U extends T | undefined>(value?: U) => void];
  createValue<T>(
    value: T,
    compare?: boolean | ((prev: T, next: T) => boolean),
  ): [() => T, (value: T) => void];
  createValue<T>(
    value?: T,
    compare?: boolean | ((prev: T | undefined, next: T) => boolean),
  ): [() => T | undefined, (value: T) => void]

  createReaction<T>(fn: (v: T) => T, value: T): void;
  createReaction<T>(fn: (v?: T) => T | undefined): void;
  createReaction<T>(fn: (v?: T) => T, value?: T): void
}

let configuration: Config | null = null;

export function isConfigured() {
  return !!configuration;
}

export function configure(config: Config) {
  configuration = config;
}

export function untrack<T>(fn: () => T): T {
  return configuration.untrack(fn);
}

export function onCleanup(fn: () => void): void {
  return configuration.onCleanup(fn);
}

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  return configuration.createRoot(fn);
}

export function createMemo<T>(fn: () => T, equal?: boolean): () => T {
  return configuration.createMemo(fn, equal);
}

export function createValue<T>(): [() => T | undefined, <U extends T | undefined>(value?: U) => void];
export function createValue<T>(
  value: T,
  compare?: boolean | ((prev: T, next: T) => boolean),
): [() => T, (value: T) => void];
export function createValue<T>(
  value?: T,
  compare?: boolean | ((prev: T | undefined, next: T) => boolean),
): [() => T | undefined, (value: T) => void] {
  return configuration.createValue(value, compare);
}

export function createReaction<T>(fn: (v: T) => T, value: T): void;
export function createReaction<T>(fn: (v?: T) => T | undefined): void;
export function createReaction<T>(fn: (v?: T) => T, value?: T): void {
  configuration.createReaction(fn, value);
}
