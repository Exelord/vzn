import { batch } from '../src/batch';
import { createComputation, untrack } from '../src/computation';
import { onCleanup } from '../src/disposer';
import { getOwner, runWithOwner } from '../src/owner';
import { createQueue } from '../src/queue';

jest.useFakeTimers('modern');

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

describe('untrack', () => {
  it('runs without any computation', () => {
    const computation = createComputation(() => {});
    
    expect(getOwner().computation).toBeUndefined();
    
    runWithOwner({ computation }, () => {
      expect(getOwner().computation).toBe(computation);
      
      untrack(() => {
        expect(getOwner().computation).toBeUndefined();
      });

      expect(getOwner().computation).toBe(computation);
    });
    
    expect(getOwner().computation).toBeUndefined();
  });

  it('runs cleanups in computation correctly', () => {
    const disposer = createQueue();
    const cleanupMock = jest.fn();
    
    expect(getOwner().disposer).toBeUndefined();
    
    runWithOwner({ disposer }, () => {
      untrack(() => {
        onCleanup(cleanupMock)
      });
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);

    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});