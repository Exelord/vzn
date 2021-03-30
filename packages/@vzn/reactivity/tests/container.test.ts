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
});
