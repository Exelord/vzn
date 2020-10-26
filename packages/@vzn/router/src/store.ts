import { getStore } from "@vzn/store";
import { createBrowserHistory, State, Update } from 'history';

class RouterState {
  history = createBrowserHistory();

  constructor() {
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
  return getStore(RouterStore)
}