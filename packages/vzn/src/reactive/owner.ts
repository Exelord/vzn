import { Disposer } from "../utils/disposer";

let OWNER: Owner | undefined;

export type Disposable = () => void;

export class Owner {
  readonly disposer = new Disposer();
  
  owner = OWNER;
  
  context?: any;

  destroy() {
    this.disposer.dispose();
    OWNER = this.owner;
  }
}

export function onCleanup(disposable: Disposable) {
  if (!OWNER) {
    console.warn("disposables created outside a `createRoot` or `render` will never be run");
    return;
  }

  return OWNER.disposer.schedule(disposable);
}

export function getOwner() {
  return OWNER;  
}

export function createOwner(): Owner {
  const owner = new Owner();
  
  OWNER = owner;
  
  return owner;
}