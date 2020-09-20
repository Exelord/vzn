import { createState, onCleanup } from "@vzn/core";
import { useStore } from "@vzn/store";

class RouterState {
  pathname = window.document.location.pathname;

  init() {
    window.addEventListener('popstate', this.onPopState)
    onCleanup(() => window.removeEventListener('popstate', this.onPopState))
  }

  push(value: string) {
    if (value === this.pathname) return;
    setTimeout(() => window.history.pushState(null, '', value), 0);
    this.pathname = value;
  }

  private onPopState() {
    this.pathname = window.document.location.pathname;
  }
}

function RouterStore() {
  const store = createState(() => new RouterState());

  store.init();

  return store;
}

export function useRouter() {
  return useStore(RouterStore)
}