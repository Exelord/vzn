import { memo } from "../reactive/memo";

type ForProps<T, U> = {
  each: T[] | undefined | null | false;
  fallback?: JSX.Element;
  do: JSX.Element | ((item: T, index: number) => U);
}

export function For<T, U extends JSX.Element>(props: ForProps<T, U>) {
  return memo(() => {
    if (!props.each) return props.fallback;

    return props.each.map((item, index) => typeof props.do === 'function' ? props.do(item, index) : props.do)    
  });
}
