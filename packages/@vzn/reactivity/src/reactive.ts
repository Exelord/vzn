import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";

export function renderEffect<T>(fn: Computation<T>) {
  runWithContainer(createContainer(untrack(() => fn())), fn);
}

export function effect<T>(fn: Computation<T>) {
  const owner = getContainer();

  const computation = () =>
    runWithContainer(createContainer(untrack(() => fn())), fn);

  if (owner) {
    owner.scheduleEffect(computation);
  } else {
    computation();
  }
}

export function starter<T>(fn: Computation<T>) {
  effect(untrack(fn));
}

export function memo<T>(fn: Computation<T>) {
  let isFresh = true;

  let value = runWithContainer(
    createContainer(() => (isFresh = false)),
    fn
  );

  return untrack(() => {
    if (!isFresh) {
      value = fn();
      isFresh = true;
    }

    return value;
  });
}
