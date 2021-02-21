import { memo } from "@vzn/reactivity";
import { JSX } from "../jsx";

export function mapArray<T, U>(
  list: () => T[],
  mapFn: (v: T, i: () => number) => U,
  options: { fallback?: () => any } = {}
): () => U[] {
  const items = list();
  let s: U[] = [];
  if (items.length) {
    for (let i = 0, len = items.length; i < len; i++) s.push(mapFn(items[i], () => i));
  } else if (options.fallback) s = [options.fallback()];
  return () => s;
}

export function For<T, U extends JSX.Element>(props: {
  each: T[];
  fallback?: JSX.Element;
  children: (item: T, index: () => number) => U;
}) {
  const fallback = "fallback" in props && { fallback: () => props.fallback };
  return memo(
    mapArray<T, U>(() => props.each, props.children, fallback ? fallback : undefined)
  );
}