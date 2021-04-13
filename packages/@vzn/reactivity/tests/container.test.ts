import { batch } from '../src/batch';
import { createContainer, getContainer } from '../src/container';
import { cleanup, createDisposer, getDisposer } from '../src/disposer';
import { runWith, untrack } from '../src/utils';

jest.useFakeTimers('modern');

describe('untrack', () => {
it('runs without any container', () => {
    const container = createContainer();
    
    expect(getContainer()).toBeUndefined();
    
    runWith({ container }, () => {
      expect(getContainer()).toBe(container);
      
      untrack(() => {
        expect(getContainer()).not.toBe(container);
      });

      expect(getContainer()).toBe(container);
    });
    
    expect(getContainer()).toBeUndefined();
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

it('runs cleanup if there is no container', () => {
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
    const container = createContainer(() => spy());

    batch(() => {
      container.recompute();
      container.recompute();
    });

    expect(spy.mock.calls.length).toBe(1);
  });

  it('uses parent container if available', () => {
    const container = createContainer();

    runWith({ container }, () => {
      batch(() => {
        expect(getContainer()).toBe(container);
      });
    });
  });

  it('supports nested batches', () => {
    const spy = jest.fn();
    const container = createContainer(() => spy());

    batch(() => {
      batch(() => container.recompute());
      container.recompute();
    });
    
    expect(spy.mock.calls.length).toBe(1);
  });
});

describe('createContainer', () => {
  describe('recompute', () => {
  it('recomputes', () => {
      const container = createContainer(() => spy());
      const spy = jest.fn();
  
      container.recompute();
  
      expect(spy.mock.calls.length).toBe(1);
    });
      it('recomputes if parent is not paused', () => {
      const parentContainer = createContainer();
      const container = createContainer(() => spy());
      const spy = jest.fn();
      
      runWith({ container: parentContainer }, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
    
    it('recomputes if it is prioritized and parent is paused', () => {
      const parentContainer = createContainer();
      const container = createContainer(() => spy(), true);
      const spy = jest.fn();
      
      runWith({ container: parentContainer }, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
  });
});
  