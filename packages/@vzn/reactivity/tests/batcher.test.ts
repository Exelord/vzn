import { batch, createBatcher, getBatcher, setBatcher } from '../src/batcher';
import { createComputation } from '../src/computation';

describe('getBatcher and setBatcher', () => {
  it('gets and sets global computation', () => {
    const batcher = createBatcher();
    
    expect(getBatcher()).toBeUndefined();
    
    setBatcher(batcher);
    
    expect(getBatcher()).toBe(batcher);

    setBatcher(undefined);
  });
});

describe('createBatcher', () => {
  it('schedules and flushes', () => {
    const spy = jest.fn();
    const batcher = createBatcher();

    batcher.schedule(spy);
    
    expect(spy.mock.calls.length).toBe(0);
    
    batcher.flush();

    expect(spy.mock.calls.length).toBe(1);
  });
});

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
