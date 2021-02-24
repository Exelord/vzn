let globalContainer: Container | undefined;

export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  priority: boolean;
  isPaused: boolean;

  children: Set<Container>;
  cleanups: Disposer[];
  queue: Set<Container>;
  effects: Set<Computation<void>>;

  schedule(container: Container): void;
  scheduleEffect(effect: Computation<void>): void;
  update(): void;
  recompute(): void;
  dispose(): void;
  pause(): void;
  resume(): void;
}

function setContainer(container: Container | undefined) {
  globalContainer = container;
}

export function getContainer(): Container | undefined {
  return globalContainer;
}

export function onCleanup(fn: Disposer) {
  const container = getContainer();

  if (container) {
    container.cleanups.push(fn);
  }
}

export function runWithContainer<T>(
  container: Container | undefined,
  computation: Computation<T>
): T {
  const currentContainer = getContainer();

  setContainer(container);

  try {
    return computation();
  } finally {
    setContainer(currentContainer);
  }
}

export function untrack<T>(fn: () => T): T {
  return runWithContainer(undefined, fn);
}

export function createContainer<T>(
  computation: Computation<T>,
  priority = false
): Container {
  const parent = getContainer();

  const container = {
    priority,
    isPaused: false,

    children: new Set<Container>(),
    cleanups: [] as Disposer[],
    queue: new Set<Container>(),
    effects: new Set<Computation<void>>(),

    schedule(container: Container) {
      if (this.isPaused) {
        this.queue.add(container);
      } else {
        container.recompute();
      }
    },

    scheduleEffect(effect: Computation<void>) {
      if (this.isPaused) {
        this.effects.add(effect);
      } else {
        effect();
      }
    },

    dispose() {
      this.children.forEach((container) => container.dispose());
      this.children.clear();
      this.cleanups.forEach((disposer) => disposer());
      this.cleanups = [];
    },

    update() {
      const container = getContainer();

      if (container && !this.priority) {
        container.schedule(this);
      } else {
        this.recompute();
      }
    },

    recompute() {
      computation();
    },

    pause() {
      this.isPaused = true;
    },

    resume() {
      if (this.isPaused) {
        this.isPaused = false;
        this.queue.forEach((container) => container.recompute());
        this.queue.clear();
        this.effects.forEach((effect) => effect());
        this.effects.clear();
      }
    }
  };

  if (parent) {
    parent.children.add(container);
  }

  return container;
}

export function batch<T>(computation: Computation<T>): T {
  const container = getContainer();

  if (!container) {
    return runWithContainer(
      createContainer(() => {}),
      () => batch(computation)
    );
  }

  if (container.isPaused) {
    return computation();
  }

  container.pause();
  const result = computation();
  container.resume();

  return result;
}

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const container = createContainer(() => {});

  return runWithContainer(container, () =>
    batch(() => fn(() => container.dispose()))
  );
}
