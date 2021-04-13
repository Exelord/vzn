import { batch } from '../src/batch';
import { createComputation, getComputation } from '../src/computation';
import { cleanup, createDisposer, getDisposer } from '../src/disposer';
import { runWith, untrack } from '../src/utils';

jest.useFakeTimers('modern');

describe('untrack', () => {
it('runs without any computation', () => {
    const computation = createComputation();
    
    expect(getComputation()).toBeUndefined();
    
    runWith({ computation }, () => {
      expect(getComputation()).toBe(computation);
      
      untrack(() => {
        expect(getComputation()).not.toBe(computation);
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
        cleanup(cleanupMock)
      });
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);

    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});

describe('cleanup', () => {
it('registers disposer and calls it on dispose', () => {
    const disposer = createDisposer();
    const cleanupMock = jest.fn();
    
    runWith({ disposer }, () => {
      cleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });

it('runs cleanup if there is no computation', () => {
    const cleanupMock = jest.fn();
    
    cleanup(cleanupMock);
    
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
    const computation = createComputation();

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
      it('recomputes if parent is not paused', () => {
      const parentComputation = createComputation();
      const computation = createComputation(() => spy());
      const spy = jest.fn();
      
      runWith({ computation: parentComputation }, () => {
        computation.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
    
    it('recomputes if it is prioritized and parent is paused', () => {
      const parentComputation = createComputation();
      const computation = createComputation(() => spy(), true);
      const spy = jest.fn();
      
      runWith({ computation: parentComputation }, () => {
        computation.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
  });
});
  