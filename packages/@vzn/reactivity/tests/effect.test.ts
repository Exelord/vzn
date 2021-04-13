import { batch } from '../src/batch';
import { createContainer, runWithContainer } from '../src/container';
import { cleanup } from '../src/disposer';
import { createEffect, createInstantEffect, createSingleEffect } from '../src/effect';
import { createValue } from '../src/value';

jest.useFakeTimers('modern');

describe('createInstantEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    runWithContainer(createContainer(), () => {
      createInstantEffect(() => {
        getSignal();
        effectFn();
        cleanup(() => cleanupFn())
      });
    })
    
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
      createInstantEffect(() => {
        setSignal('effect');
      });
      
      expect(getSignal()).toBe('effect');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('order');
  });

  it('is computes instantly if no container and does not watch changes', () => {
    const [getSignal, setSignal] = createValue('start');
    const effectFn = jest.fn();
    
    expect(getSignal()).toBe('start');

    expect(effectFn.mock.calls.length).toBe(0);
    
    createInstantEffect(() => {
      setSignal('effect');
      effectFn();
    });

    expect(effectFn.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect');
    
    setSignal('order');
    
    expect(getSignal()).toBe('order');
    expect(effectFn.mock.calls.length).toBe(1);
  });
});

describe('createEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    runWithContainer(createContainer(), () => {
      createEffect(() => {
        getSignal();
        effectFn();
        cleanup(() => cleanupFn())
      });

    });

    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    jest.runAllTimers();

    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);

    setSignal('value2');

    expect(effectFn.mock.calls.length).toBe(2);
    expect(cleanupFn.mock.calls.length).toBe(1);
    
    setSignal('value3');

    expect(effectFn.mock.calls.length).toBe(3);
    expect(cleanupFn.mock.calls.length).toBe(2);
  });

  it('is called in micro queue', () => {
    const [getSignal, setSignal] = createValue('start');
    
    expect(getSignal()).toBe('start');
    
    batch(() => {
      createEffect(() => {
        setSignal('effect');
      });

      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('order');

    jest.runAllTimers();
    
    expect(getSignal()).toBe('effect');
  });
  
  it('is computes in next micro queue if no container and does not watch changes', () => {
    const [getSignal, setSignal] = createValue('start');
    const effectFn = jest.fn();
    
    expect(getSignal()).toBe('start');

    expect(effectFn.mock.calls.length).toBe(0);
    
    createEffect(() => {
      setSignal('effect');
      effectFn();
    });

    expect(effectFn.mock.calls.length).toBe(0);

    jest.runAllTimers();

    expect(effectFn.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect');
    
    setSignal('order');
    
    expect(getSignal()).toBe('order');
    expect(effectFn.mock.calls.length).toBe(1);
  });
});

describe('createSingleEffect', () => {
  it('runs only once', () => {
    const [getSignal, setSignal] = createValue('value');
    const effectFn = jest.fn();
    const cleanupFn = jest.fn();
    
    expect(effectFn.mock.calls.length).toBe(0);
    expect(cleanupFn.mock.calls.length).toBe(0);

    runWithContainer(createContainer(), () => {
      createSingleEffect(() => {
        getSignal();
        effectFn();
        cleanup(() => cleanupFn())
      });
    });
    
    expect(effectFn.mock.calls.length).toBe(0);
    
    jest.runAllTimers();
    
    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);

    setSignal('value2');

    expect(effectFn.mock.calls.length).toBe(1);
    expect(cleanupFn.mock.calls.length).toBe(0);
  });

  it('is called at the end of micro queue', () => {
    const [getSignal, setSignal] = createValue('start');
    
    expect(getSignal()).toBe('start');
    
    batch(() => {
      createSingleEffect(() => {
        setSignal('effect');
      });

      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    })

    expect(getSignal()).toBe('order');
    
    jest.runAllTimers();
    
    expect(getSignal()).toBe('effect');
  });
});
