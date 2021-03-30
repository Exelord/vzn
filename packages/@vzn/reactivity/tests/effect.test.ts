import { batch, onCleanup } from '../src/container';
import { createEffect, createRenderEffect, createSingleEffect } from '../src/effect';
import { createValue } from '../src/value';

describe('createRenderEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    createRenderEffect(() => {
      getSignal();
      effectFn();
      onCleanup(() => cleanupFn())
    });
    
    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);

    setSignal('value2');

    expect(effectFn.mock.calls.length).toBe(2);
    expect(cleanupFn.mock.calls.length).toBe(1);
    
    setSignal('value3');

    expect(effectFn.mock.calls.length).toBe(3);
    expect(cleanupFn.mock.calls.length).toBe(2);
  });

  it('is called instantly', () => {
    const [getSignal, setSignal] = createValue('start');
    
    expect(getSignal()).toBe('start');
    
    batch(() => {
      createRenderEffect(() => {
        setSignal('effect');
      });
      
      expect(getSignal()).toBe('effect');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('order');
  });
});

describe('createEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    createEffect(() => {
      getSignal();
      effectFn();
      onCleanup(() => cleanupFn())
    });
    
    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);

    setSignal('value2');

    expect(effectFn.mock.calls.length).toBe(2);
    expect(cleanupFn.mock.calls.length).toBe(1);
    
    setSignal('value3');

    expect(effectFn.mock.calls.length).toBe(3);
    expect(cleanupFn.mock.calls.length).toBe(2);
  });

  it('is called at the end of effects queue', () => {
    const [getSignal, setSignal] = createValue('start');
    
    expect(getSignal()).toBe('start');
    
    batch(() => {
      createEffect(() => {
        setSignal('effect');
      });

      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    })
    
    expect(getSignal()).toBe('effect');
  });
});

describe('createSingleEffect', () => {
  it('runs only once', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    createSingleEffect(() => {
      getSignal();
      effectFn();
      onCleanup(() => cleanupFn())
    });
    
    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);

    setSignal('value2');

    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);
  });

  it('is called at the end of effects queue', () => {
    const [getSignal, setSignal] = createValue('start');
    
    expect(getSignal()).toBe('start');
    
    batch(() => {
      createEffect(() => {
        setSignal('effect');
      });

      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    })
    
    expect(getSignal()).toBe('effect');
  });
});
