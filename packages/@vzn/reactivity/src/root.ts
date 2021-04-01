import { createContainer, runWithContainer, batch, Disposer } from "./container";

export function createRoot<T>(fn: (disposer: Disposer) => T): T {
  const container = createContainer(() => {});
  return runWithContainer(container, () => batch(() => fn(container.dispose)));
}