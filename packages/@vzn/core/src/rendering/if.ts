import { memo } from "../reactive/memo";

type IfProps<T> = {
  is: T | undefined | null | false;
  then: JSX.Element | ((value: T) => JSX.Element);
  else?: JSX.Element;
}

export function If<T>(props: IfProps<T>) {
  return memo(() => {
    if (props.is) {
      return typeof props.then === 'function' ? props.then(props.is) : props.then;
    }
    
    return props.else;
  })
}