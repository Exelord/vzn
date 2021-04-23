export function asyncRethrow<T>(fn: () => T): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}