import { createState, onCleanup } from "@vzn/core";
import { useStore } from "@vzn/store";

class RouterState {
  pathname = window.document.location.pathname;

  push(value: string) {
    if (value === this.pathname) return;
    setTimeout(() => window.history.pushState(null, '', value), 0);
    this.pathname = value;
  }
}

function RouterStore() {
  const store = createState(() => new RouterState());

  const state = createState(() => ({
    onPopState() {
      store.pathname = window.document.location.pathname;
    }
  }))

  window.addEventListener('popstate', state.onPopState)
  onCleanup(() => window.removeEventListener('popstate', state.onPopState))

  return store;
}

export function useRouter() {
  return useStore(RouterStore)
}