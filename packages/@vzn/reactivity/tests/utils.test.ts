import { createComputation, getComputation } from '../src/computation';
import { onCleanup, createDisposer, getDisposer } from '../src/disposer';
import { runWith, untrack } from '../src/utils';

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

  it('runs cleanups in computation correctly', () => {
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