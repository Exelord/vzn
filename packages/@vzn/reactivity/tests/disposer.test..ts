import { createDisposer, getDisposer, onCleanup, setDisposer } from '../src/disposer';
import { runWith } from '../src/context';

jest.useFakeTimers('modern');

describe('getDisposer and setDisposer', () => {
  it('gets and sets global computation', () => {
    const disposer = createDisposer();
    
    expect(getDisposer()).toBeUndefined();
    
    setDisposer(disposer);
    
    expect(getDisposer()).toBe(disposer);

    setDisposer(undefined);
  });
});

describe('createDisposer', () => {
  it('schedules and flushes', () => {
    const spy = jest.fn();
    const disposer = createDisposer();

    disposer.schedule(spy);
    
    expect(spy.mock.calls.length).toBe(0);
    
    disposer.flush();

    expect(spy.mock.calls.length).toBe(1);
  });
});


describe('onCleanup', () => {
  it('schedules disposer and calls it on flush', () => {
    const disposer = createDisposer();
    const cleanupMock = jest.fn();
    
    runWith({ disposer }, () => {
      onCleanup(cleanupMock)
    });
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    disposer.flush();
    
    expect(cleanupMock.mock.calls.length).toBe(1);
  });
  
  it('supports nested cleanups', () => {
    const spy = jest.fn();

    onCleanup(() => {
      onCleanup(spy);
      spy()
    });
    
    expect(spy.mock.calls.length).toBe(1);
    
    jest.runAllTimers();
    
    expect(spy.mock.calls.length).toBe(2);
  });
  
  it('runs onCleanup if there is no computation', () => {
    const cleanupMock = jest.fn();
    
    onCleanup(cleanupMock);
    
    expect(cleanupMock.mock.calls.length).toBe(0);
    
    jest.runAllTimers();

    expect(cleanupMock.mock.calls.length).toBe(1);
  });
});
