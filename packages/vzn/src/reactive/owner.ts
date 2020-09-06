let OWNER: Owner | undefined;

export type Disposable = () => void;

export class Owner {
  disposables: Disposable[] = [];
  owner?: Owner;
  context?: any;

  constructor(owner?: Owner) {
    this.owner = owner;
  }

  dispose() {
    const disposables = this.disposables;
    
    this.disposables = [];
    
    disposables.forEach((disposable) => disposable());
  }
}

export function onCleanup(disposable: Disposable) {
  if (!OWNER) {
    console.warn("disposables created outside a `createRoot` or `render` will never be run");
    return;
  }

  if (OWNER.disposables) {
    OWNER.disposables.push(disposable);
  } else {
    OWNER.disposables = [disposable];
  }

  return disposable;
}

export function getOwner() {
  return OWNER;  
}

export function setOwner(owner?: Owner) {
  OWNER = owner;
}

export function createOwner(): Owner {
  return new Owner(getOwner());
}