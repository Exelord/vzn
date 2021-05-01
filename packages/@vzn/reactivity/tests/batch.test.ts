import { batch } from '../src/batch';
import { createComputation } from '../src/computation';

describe('batch', () => {
  it('batches computations', () => {
    const spy = jest.fn();
    const computation = createComputation(spy);

    batch(() => {
      computation.recompute();
      computation.recompute();
    });

    expect(spy.mock.calls.length).toBe(1);
  });

  it('supports nested batches', () => {
    const spy = jest.fn();
    const computation = createComputation(spy);

    batch(() => {
      batch(() => computation.recompute());
      computation.recompute();
    });
    
    expect(spy.mock.calls.length).toBe(1);
  });
});
