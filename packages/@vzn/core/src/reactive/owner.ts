import { Disposer } from "../utils/disposer";

let OWNER: Owner | undefined;

export type Disposable = () => void;

export class Owner {
  readonly disposer = new Disposer();

  children = new Set<Owner>()
  
  contexts = new Map();
  
  parent?: Owner;

  isDestroyed = false;

  constructor(owner = OWNER) {
    this.parent = owner;
    if (owner) owner.children.add(this)
  }

  dispose() {
    for (const owner of this.children) {
      owner.dispose()
    }

    this.disposer.dispose();
  }

  destroy() {
    for (const owner of this.children) {
      owner.destroy();
    }

    this.dispose();
    this.children = new Set<Owner>();

    if (this.parent) this.parent.children.delete(this);

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

export function getOwner(): Owner | undefined {
  return OWNER;
}

export function setOwner(owner?: Owner) {
  OWNER = owner; 
}

export function createOwner(): Owner {
  return new Owner();
}
