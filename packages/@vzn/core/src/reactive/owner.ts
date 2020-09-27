import { Disposer } from "../utils/disposer";

let OWNER: Owner | undefined;

export type Disposable = () => void;

export class Owner {
  readonly disposer = new Disposer();

  owners = new Set<Owner>()
  
  contexts = new Map();
  
  parentOwner?: Owner;

  isDestroyed = false;

  constructor(owner = OWNER) {
    this.parentOwner = owner;
    if (owner) owner.owners.add(this)
  }

  dispose() {
    for (const owner of this.owners) {
      owner.dispose()
    }

    this.disposer.dispose();
  }

  destroy() {
    for (const owner of this.owners) {
      owner.destroy();
    }

    this.dispose();
    this.owners = new Set<Owner>();

    if (this.parentOwner) this.parentOwner.owners.delete(this);

    this.isDestroyed = true;
  }
}

export function onCleanup(disposable: Disposable) {
  if (!OWNER) {
    console.warn("onCleanup called outside a `createRoot` or `render` will never be run");
    return;
  }

  return OWNER.disposer.schedule(disposable);
}

export function getOwner(): Owner {
  return OWNER!;
}

export function setOwner(owner?: Owner) {
  OWNER = owner; 
}

export function createOwner(): Owner {
  return new Owner();
}
