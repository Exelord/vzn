import { batch } from '../src/batch';
import { onCleanup } from '../src/disposer';
import { createInstantEffect } from '../src/effect';
import { runWithOwner } from '../src/owner';
import { createQueue } from '../src/queue';
import { createValue } from '../src/value';

jest.useFakeTimers('modern');

describe('createInstantEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue(1);
    const disposer = createQueue();
    const effectSpy = jest.fn();
    const cleanupSpy = jest.fn();

    runWithOwner({ disposer }, () => {
      createInstantEffect(() => {
        onCleanup(cleanupSpy);
        effectSpy();
        getSignal();
      });
    })
    
    expect(effectSpy.mock.calls.length).toBe(1);
    expect(cleanupSpy.mock.calls.length).toBe(0);

    setSignal(2);

    expect(effectSpy.mock.calls.length).toBe(2);
    expect(cleanupSpy.mock.calls.length).toBe(1);
    
    setSignal(3);

    expect(effectSpy.mock.calls.length).toBe(3);
    expect(cleanupSpy.mock.calls.length).toBe(2);
    
    disposer.flush();
    
    expect(effectSpy.mock.calls.length).toBe(3);
    expect(cleanupSpy.mock.calls.length).toBe(3);
    
    setSignal(4);
    
    expect(effectSpy.mock.calls.length).toBe(3);
    expect(cleanupSpy.mock.calls.length).toBe(3);
  });

  it('works with batching', () => {
    const [getSignal, setSignal] = createValue('start');
    
    batch(() => {
      createInstantEffect(() => {
        setSignal('effect');
        getSignal();
      });
      
      expect(getSignal()).toBe('effect');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('effect');
  });

  it('is batching updates', () => {
    const [getSignal, setSignal] = createValue('start');
    const spy = jest.fn();

    createInstantEffect(() => {
      setSignal('effect1');
      setSignal('effect2');
      getSignal();
      spy();
    });

    expect(spy.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect2');
    
    setSignal('order');
    
    expect(getSignal()).toBe('effect2');
    expect(spy.mock.calls.length).toBe(2);
  });

  it('works with nested effects', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue();
    
    createInstantEffect(() => {
      if (!getSignal()) return;
      createInstantEffect(() => spy(getSignal()));
    });

    expect(spy.mock.calls.length).toBe(0);
    
    setSignal(true);
    
    expect(spy.mock.calls.length).toBe(1);
    
    setSignal(false);
    
    expect(spy.mock.calls.length).toBe(1);
  });
});
