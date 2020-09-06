export type Disposable = () => void;

export class Disposer {
  disposables: Disposable[] = [];

  schedule(disposable: Disposable) {
    return this.disposables.push(disposable);
  }

  dispose() {
    const disposables = this.disposables;
    
    this.disposables = [];
    
    disposables.forEach((disposable) => disposable());
  }
}