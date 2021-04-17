import { batch } from '../src/batcher';
import { createComputation, getComputation, setComputation } from '../src/computation';

jest.useFakeTimers('modern');

describe('getComputation and setComputation', () => {
  it('gets and sets global computation', () => {
    const computation = createComputation(() => {});
    
    expect(getComputation()).toBeUndefined();
    
    setComputation(computation)
    
    expect(getComputation()).toBe(computation);
    
    setComputation(undefined);
  });
});

describe('createComputation', () => {
  it('recomputes', () => {
    const spy = jest.fn();
    const computation = createComputation(spy);

    computation.recompute();

    expect(spy.mock.calls.length).toBe(1);
  });

  it('schedules recomputation if batching', () => {
    const spy = jest.fn();
    const computation = createComputation(spy);
    
    batch(() => {
      computation.recompute();
      expect(spy.mock.calls.length).toBe(0);
    });

    expect(spy.mock.calls.length).toBe(1);
  });
  
  it('recomputes if it is prioritized and batching', () => {
    const spy = jest.fn();
    const computation = createComputation(spy, true);
    
    batch(() => {
      computation.recompute()
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  it('batches all computations automatically', () => {
    const spy = jest.fn();
    const computation1 = createComputation(spy);
    const computation2 = createComputation(() => {
      computation1.recompute();
      computation1.recompute();
    });
    
    computation2.recompute()
    
    expect(spy.mock.calls.length).toBe(1);

    spy.mockReset();
    
    batch(() => {
      computation2.recompute()
    });

    expect(spy.mock.calls.length).toBe(1);
  });
});
  