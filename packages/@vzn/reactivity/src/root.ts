import { batch } from "./batch";
import { createContainer, runWithContainer } from "./container";

export function createRoot<T>(fn: (disposer: () => void) => T): T {
  const container = createContainer();
  return runWithContainer(container, () => batch(() => fn(container.dispose)));
}