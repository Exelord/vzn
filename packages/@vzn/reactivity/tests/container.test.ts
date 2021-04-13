import { batch } from '../src/batch';
import { createContainer, getContainer, runWithContainer, untrack } from '../src/container';
import { cleanup } from '../src/disposer';

jest.useFakeTimers('modern');

describe('runWithContainer', () => {
  it('sets correct container', () => {
    const container = createContainer();
    
    expect(getContainer()).toBeUndefined();
    
    runWithContainer(container, () => {
      const nestedContainer = createContainer();

      expect(getContainer()).toBe(container);
      
      runWithContainer(nestedContainer, () => {
        expect(getContainer()).toBe(nestedContainer);
      });

      expect(getContainer()).toBe(container);
    });
    
    expect(getContainer()).toBeUndefined();
  });
});

describe('untrack', () => {
it('runs without any container', () => {
    const container = createContainer();
    
    expect(getContainer()).toBeUndefined();
    
    runWithContainer(container, () => {
      expect(getContainer()).toBe(container);
      
      untrack(() => {
        expect(getContainer()).not.toBe(container);
      });

      expect(getContainer()).toBe(container);
    });
    
    expect(getContainer()).toBeUndefined();
  });

  it('runs cleanups in effects correctly', () => {
    const container = createContainer();
    const cleanupMock = jest.fn();
    
    expect(getContainer()).toBeUndefined();
    
    runWithContainer(container, () => {
      untrack(() => {
        cleanup(cleanupMock)
      });
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);

    container.dispose();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});

describe('cleanup', () => {
it('registers disposer and calls it on dispose', () => {
    const container = createContainer();
    const cleanupMock = jest.fn();
    
    runWithContainer(container, () => {
      cleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    container.dispose();
    
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

    runWithContainer(container, () => {
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
      
      runWithContainer(parentContainer, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
    
    it('recomputes if it is prioritized and parent is paused', () => {
      const parentContainer = createContainer();
      const container = createContainer(() => spy(), true);
      const spy = jest.fn();
      
      runWithContainer(parentContainer, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('dispose', () => {
  it('disposes all disposers', () => {
      const container = createContainer();
      const spy = jest.fn();

      runWithContainer(container, () => {
        cleanup(() => spy())
      });

      expect(spy.mock.calls.length).toBe(0);
      
      container.dispose();

      expect(spy.mock.calls.length).toBe(1);
    });
  
    it('does work with nested disposers', () => {
      const container = createContainer();
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      runWithContainer(container, () => {
        cleanup(() => {
          spy1();
          cleanup(() => spy2());
        })
      });

      expect(spy1.mock.calls.length).toBe(0);
      expect(spy2.mock.calls.length).toBe(0);
      
      container.dispose();
      
      expect(spy1.mock.calls.length).toBe(1);
      expect(spy2.mock.calls.length).toBe(0);
      
      jest.runAllTimers();
      
      expect(spy1.mock.calls.length).toBe(1);
      expect(spy2.mock.calls.length).toBe(1);
    });
  });  
});
  