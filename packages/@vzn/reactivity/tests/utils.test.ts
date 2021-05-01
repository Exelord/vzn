import { createComputation, untrack } from '../src/computation';
import { onCleanup } from '../src/disposer';
import { getOwner, runWithOwner } from '../src/owner';
import { createQueue } from '../src/queue';

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