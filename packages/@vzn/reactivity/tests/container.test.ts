import { batch, createContainer, getContainer, onCleanup, runWithContainer, untrack } from '../src/container';

describe('runWithContainer', () => {
  it('sets correct container', () => {
    const container = createContainer(() => {});
    
    expect(getContainer()).toBeUndefined();
    
    runWithContainer(container, () => {
      const nestedContainer = createContainer(() => {});

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
    const container = createContainer(() => {});
    
    expect(getContainer()).toBeUndefined();
    
    runWithContainer(container, () => {
      expect(getContainer()).toBe(container);
      
      untrack(() => {
        expect(getContainer()).toBeUndefined();
      });

      expect(getContainer()).toBe(container);
    });
    
    expect(getContainer()).toBeUndefined();
  });
});

describe('onCleanup', () => {
it('registers disposer and calls it on dispose', () => {
    const container = createContainer(() => {});
    const cleanupMock = jest.fn();
    
    runWithContainer(container, () => {
      onCleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    container.dispose();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });

it('does nothing if there is no container', () => {
    const cleanupMock = jest.fn();
    
    onCleanup(cleanupMock)
    
    expect(cleanupMock.mock.calls.length).toBe(0);
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
    const container = createContainer(() => {});

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

  it('schedules recomputation if parent is paused', () => {
      const parentContainer = createContainer(() => {});
      const container = createContainer(() => spy());
      const spy = jest.fn();
      
      parentContainer.pause();
      
      runWithContainer(parentContainer, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(0);
      
      parentContainer.resume();
      
      expect(spy.mock.calls.length).toBe(1);
    });
  
    it('recomputes if parent is not paused', () => {
      const parentContainer = createContainer(() => {});
      const container = createContainer(() => spy());
      const spy = jest.fn();
      
      runWithContainer(parentContainer, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
    
    it('recomputes if it is prioritized and parent is paused', () => {
      const parentContainer = createContainer(() => {});
      const container = createContainer(() => spy(), true);
      const spy = jest.fn();
      
      parentContainer.pause();
      
      runWithContainer(parentContainer, () => {
        container.recompute();
      });

      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('scheduleUpdate', () => {
  it('computes instantly if not paused', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();
  
      container.scheduleUpdate(spy);
  
      expect(spy.mock.calls.length).toBe(1);
    });
  
    it('schedules update if paused', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();
      
      container.pause();
      
      container.scheduleUpdate(spy);
      
      expect(spy.mock.calls.length).toBe(0);
      
      container.resume();
  
      expect(spy.mock.calls.length).toBe(1);
    });
  });
  
  describe('scheduleEffect', () => {
    it('computes instantly if not paused', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();
  
      container.scheduleEffect(spy);
  
      expect(spy.mock.calls.length).toBe(1);
    });
  
    it('schedules update if paused', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();
      
      container.pause();
      
      container.scheduleEffect(spy);
      
      expect(spy.mock.calls.length).toBe(0);
      
      container.resume();
  
      expect(spy.mock.calls.length).toBe(1);
    });
  });
  
  describe('pause', () => {
  it('pauses', () => {
      const container = createContainer(() => {});
  
      expect(container.isPaused).toBe(false);

      container.pause();

      expect(container.isPaused).toBe(true);
    });
  });
  
  describe('resume', () => {
  it('resumes', () => {
      const container = createContainer(() => {});
  
      expect(container.isPaused).toBe(false);
      
      container.pause();
      
      expect(container.isPaused).toBe(true);
      
      container.resume();
      
      expect(container.isPaused).toBe(false);
    });
  });
  
  describe('dispose', () => {
  it('disposes all disposers', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();

      runWithContainer(container, () => {
        onCleanup(() => spy())
      });

      expect(spy.mock.calls.length).toBe(0);
      
      container.dispose();

      expect(spy.mock.calls.length).toBe(1);
    });
  
    it('does work with nested disposers', () => {
      const container = createContainer(() => {});
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      runWithContainer(container, () => {
        onCleanup(() => {
          spy1();
          onCleanup(() => spy2());
        })
      });

      expect(spy1.mock.calls.length).toBe(0);
      expect(spy2.mock.calls.length).toBe(0);
      
      container.dispose();
      
      expect(spy1.mock.calls.length).toBe(1);
      expect(spy2.mock.calls.length).toBe(0);
    });
  });
  
  describe('addDisposer', () => {
  it('add disposer', () => {
      const container = createContainer(() => {});
      const spy = jest.fn();

      container.addDisposer(spy)

      expect(spy.mock.calls.length).toBe(0);
      
      container.dispose();

      expect(spy.mock.calls.length).toBe(1);
    });
});
});
  