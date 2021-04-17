import { batch } from '../src/batcher';
import { createComputation, getComputation } from '../src/computation';
import { onCleanup, createDisposer, getDisposer } from '../src/disposer';
import { runWith, untrack } from '../src/utils';

jest.useFakeTimers('modern');

describe('untrack', () => {
it('runs without any computation', () => {
    const computation = createComputation(() => {});
    
    expect(getComputation()).toBeUndefined();
    
    runWith({ computation }, () => {
      expect(getComputation()).toBe(computation);
      
      untrack(() => {
        expect(getComputation()).toBeUndefined();
      });

      expect(getComputation()).toBe(computation);
    });
    
    expect(getComputation()).toBeUndefined();
  });

  it('runs cleanups in effects correctly', () => {
    const disposer = createDisposer();
    const cleanupMock = jest.fn();
    
    expect(getDisposer()).toBeUndefined();
    
    runWith({ disposer }, () => {
      untrack(() => {
        onCleanup(cleanupMock)
      });
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);

    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});

describe('onCleanup', () => {
it('registers disposer and calls it on dispose', () => {
    const disposer = createDisposer();
    const cleanupMock = jest.fn();
    
    runWith({ disposer }, () => {
      onCleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });

it('runs onCleanup if there is no computation', () => {
    const cleanupMock = jest.fn();
    
    onCleanup(cleanupMock);
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    jest.runAllTimers();

    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});

describe('batch', () => {
it('batches operations', () => {
    const spy = jest.fn();
    const computation = createComputation(() => spy());

    batch(() => {
      computation.recompute();
      computation.recompute();
    });

    expect(spy.mock.calls.length).toBe(1);
  });

  it('uses parent computation if available', () => {
    const computation = createComputation(() => {});

    runWith({ computation }, () => {
      batch(() => {
        expect(getComputation()).toBe(computation);
      });
    });
  });

  it('supports nested batches', () => {
    const spy = jest.fn();
    const computation = createComputation(() => spy());

    batch(() => {
      batch(() => computation.recompute());
      computation.recompute();
    });
    
    expect(spy.mock.calls.length).toBe(1);
  });
});

describe('createComputation', () => {
  describe('recompute', () => {
    it('recomputes', () => {
      const computation = createComputation(() => spy());
      const spy = jest.fn();
  
      computation.recompute();
  
      expect(spy.mock.calls.length).toBe(1);
    });

    it('schedule recomputation if batching', () => {
      const computation = createComputation(() => spy());
      const spy = jest.fn();
      
      batch(() => {
        computation.recompute();
        expect(spy.mock.calls.length).toBe(0);
      });

      expect(spy.mock.calls.length).toBe(1);
    });
    
    it('recomputes if it is prioritized and batching', () => {
      const computation = createComputation(() => spy(), true);
      const spy = jest.fn();
      
      batch(() => {
        computation.recompute()
        expect(spy.mock.calls.length).toBe(1);
      });
    });
  });
});
  