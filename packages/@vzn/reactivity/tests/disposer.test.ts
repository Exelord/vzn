import { onCleanup } from '../src/disposer';
import { runWithOwner } from '../src/owner';
import { createQueue } from '../src/queue';
import { root } from '../src/root';

jest.useFakeTimers('modern');

describe('onCleanup', () => {
  it('schedules disposer and calls it on flush', () => {
    const disposer = createQueue();
    const cleanupMock = jest.fn();
    
    runWithOwner({ disposer }, () => {
      onCleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
  
  it('supports nested cleanups', () => {
    const spy = jest.fn();

    root((dispose) => {
      onCleanup(() => {
        onCleanup(spy);
        spy()
      });
      dispose();
    })
    
    expect(spy.mock.calls.length).toBe(2);
  });
  
  it('does not run onCleanup if there is no computation', () => {
    const cleanupMock = jest.fn();
    
    root(() => onCleanup(cleanupMock));
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    jest.runAllTimers();

    expect(cleanupMock.mock.calls.length).toBe(0);
  });
});
