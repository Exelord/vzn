import { onCleanup, makeState } from "@vzn/core";
import { useStore } from "@vzn/store";
import { createBrowserHistory, BrowserHistory, Location, State, Update } from 'history';

class RouterState {
  private history: BrowserHistory;

  location: Location;

  constructor() {
    this.history = createBrowserHistory();
    this.location = this.history.location

    makeState(this)
    
    onCleanup(this.history.listen(this.onLocationChange))
  }

  push(value: string) {
    this.history.push(value);
  }

  private onLocationChange({ location }: Update<State>) {
    this.location = location;
  }
}

export function RouterStore() {
  return new RouterState();
}

export function useRouter() {
  return useStore(RouterStore)
}