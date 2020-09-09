export type Disposable = () => void;

export class Disposer {
  private disposables = new Set<Disposable>();

  schedule(disposable: Disposable) {
    return this.disposables.add(disposable);
  }

  dispose() {
    const disposables = [...this.disposables].reverse();
    
    this.disposables = new Set<Disposable>();
    
    disposables.forEach((disposable) => disposable());
  }
}