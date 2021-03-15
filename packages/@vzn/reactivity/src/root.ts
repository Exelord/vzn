import { createContainer, runWithContainer, batch } from "./container";

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const container = createContainer(() => {});
  return runWithContainer(container, () => batch(() => fn(() => container.dispose())));
}