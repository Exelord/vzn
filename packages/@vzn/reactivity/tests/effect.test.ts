import { batch } from '../src/batcher';
import { createComputation } from '../src/computation';
import { onCleanup, createDisposer } from '../src/disposer';
import { createEffect, createInstantEffect, createSingleEffect } from '../src/effect';
import { runWith } from '../src/owner';
import { createValue } from '../src/value';

jest.useFakeTimers('modern');

describe('createInstantEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue(1);
    const disposer = createDisposer();
    const effectSpy = jest.fn();
    const cleanupSpy = jest.fn();

    runWith({ disposer }, () => {
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

  it('is batching computation', () => {
    const [getSignal, setSignal] = createValue('start');
    const spy = jest.fn();
    const compSpy = jest.fn();
    const computation = createComputation(() => {
      compSpy();
    });

    runWith({ computation }, () => {
      getSignal();

      createInstantEffect(() => {
        setSignal('effect1');
        setSignal('effect2');
        getSignal();
        spy();
      });
    })

    expect(spy.mock.calls.length).toBe(1);
    expect(compSpy.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect2');
    
    setSignal('order');
    
    expect(getSignal()).toBe('effect2');
    expect(compSpy.mock.calls.length).toBe(3);
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

describe('createEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue(1);
    const disposer = createDisposer();
    const effectSpy = jest.fn();
    const cleanupSpy = jest.fn();

    runWith({ disposer }, () => {
      createEffect(() => {
        onCleanup(cleanupSpy);
        effectSpy();
        getSignal();
      });
    })
    
    expect(effectSpy.mock.calls.length).toBe(0);
    expect(cleanupSpy.mock.calls.length).toBe(0);

    jest.runAllTimers();
    
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
      createEffect(() => {
        setSignal('effect');
        getSignal();
      });
      
      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('order');

    jest.runAllTimers();

    expect(getSignal()).toBe('effect');
  });

  it('is batching computation', () => {
    const [getSignal, setSignal] = createValue('start');
    const spy = jest.fn();
    const compSpy = jest.fn();
    const disposer = createDisposer();
    const computation = createComputation(() => {
      compSpy();
    });

    runWith({ disposer, computation }, () => {
      getSignal();

      createEffect(() => {
        setSignal('effect1');
        setSignal('effect2');
        getSignal();
        spy();
      });
    })

    jest.runAllTimers();

    expect(spy.mock.calls.length).toBe(1);
    expect(compSpy.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect2');
    
    setSignal('order');
    
    expect(getSignal()).toBe('effect2');
    expect(compSpy.mock.calls.length).toBe(3);
    expect(spy.mock.calls.length).toBe(2);
  });
});

describe('createSingleEffect', () => {
  it('reruns and cleanups on change', () => {
    const [getSignal, setSignal] = createValue(1);
    const disposer = createDisposer();
    const effectSpy = jest.fn();
    const cleanupSpy = jest.fn();

    runWith({ disposer }, () => {
      createSingleEffect(() => {
        onCleanup(cleanupSpy);
        effectSpy();
        getSignal();
      });
    })
    
    expect(effectSpy.mock.calls.length).toBe(0);
    expect(cleanupSpy.mock.calls.length).toBe(0);

    jest.runAllTimers();
    
    expect(effectSpy.mock.calls.length).toBe(1);
    expect(cleanupSpy.mock.calls.length).toBe(0);

    setSignal(2);

    expect(effectSpy.mock.calls.length).toBe(1);
    expect(cleanupSpy.mock.calls.length).toBe(0);
    
    disposer.flush();
    
    expect(effectSpy.mock.calls.length).toBe(1);
    expect(cleanupSpy.mock.calls.length).toBe(1);
  });

  it('works with batching', () => {
    const [getSignal, setSignal] = createValue('start');
    
    batch(() => {
      createSingleEffect(() => {
        setSignal('effect');
        getSignal();
      });
      
      expect(getSignal()).toBe('start');
      
      setSignal('order');
      
      expect(getSignal()).toBe('order');
    });

    expect(getSignal()).toBe('order');

    jest.runAllTimers();

    expect(getSignal()).toBe('effect');
  });

  it('is batching computation', () => {
    const [getSignal, setSignal] = createValue('start');
    const spy = jest.fn();
    const compSpy = jest.fn();
    const disposer = createDisposer();
    const computation = createComputation(() => {
      compSpy();
    });

    runWith({ disposer, computation }, () => {
      getSignal();

      createSingleEffect(() => {
        setSignal('effect1');
        setSignal('effect2');
        getSignal();
        spy();
      });
    })

    jest.runAllTimers();

    expect(spy.mock.calls.length).toBe(1);
    expect(compSpy.mock.calls.length).toBe(1);
    
    expect(getSignal()).toBe('effect2');
    
    setSignal('order');
    
    expect(getSignal()).toBe('order');
    expect(compSpy.mock.calls.length).toBe(2);
    expect(spy.mock.calls.length).toBe(1);
  });
});
