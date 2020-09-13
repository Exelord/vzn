import { onCleanup } from "@vzn/core";
import { useStore } from "@vzn/store";

export const RouterStore = () => {
  const store = {
    pathname: window.document.location.pathname,

    onPopState() {
      this.pathname = window.document.location.pathname;
    },

    push(value: string) {
      if (value === this.pathname) return;

      setTimeout(() => {
        window.history.pushState(null, '', value);
      }, 0);
      this.pathname = value;
    }
  }

  window.addEventListener('popstate', store.onPopState)
  onCleanup(() => window.removeEventListener('popstate', store.onPopState))
  
  return store;
}

export function useRouter() {
  return useStore(RouterStore)
}