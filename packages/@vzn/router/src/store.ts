import { makeState } from "@vzn/core";
import { useStore } from "@vzn/store";
import { createBrowserHistory, State, Update } from 'history';

class RouterState {
  history = createBrowserHistory();

  constructor() {
    makeState(this)
    
    // onCleanup(this.history.listen(this.onLocationChange))
  }

  push(value: string) {
    this.history.push(value);
  }

  // private onLocationChange({ location }: Update<State>) {
  //   this.location = location;
  // }
}

export function RouterStore() {
  return new RouterState();
}

export function useRouter() {
  return useStore(RouterStore)
}