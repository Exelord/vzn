/**
 * Rethrows the error in next macro task to not fail the current task.
 * ? Useful for executing independent calculations
 *
 * @export
 * @template T
 * @param {() => T} fn
 */
export function asyncRethrow<T>(fn: () => T): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}