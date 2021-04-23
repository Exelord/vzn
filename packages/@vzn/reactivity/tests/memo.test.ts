import { createMemo } from '../src/memo';
import { createInstantEffect } from '../src/effect';
import { createValue } from '../src/value';
import { batch } from '../src/batcher';
import { onCleanup, createDisposer } from '../src/disposer';
import { runWith } from '../src/context';

describe('createMemo', () => {  
  it('does recompute once only if changed', () => {
    const [getSignal, setSignal] = createValue(1);
    const spy = jest.fn();
    
    const getMemo = createMemo(() => {
      getSignal();
      spy();
    });
    
    setSignal(2);
    
    expect(spy.mock.calls.length).toBe(0);
    
    getMemo();
    getMemo();
    
    expect(spy.mock.calls.length).toBe(1);
    
    setSignal(3);
    setSignal(4);
    
    getMemo();
    
    expect(spy.mock.calls.length).toBe(2);
  });
  
  it('schedules only one recomputation inside batch', () => {
    const [getSignal, setSignal] = createValue(1);
    const spy = jest.fn();
    
    expect(spy.mock.calls.length).toBe(0);

    const getMemo = createMemo(() => {
      getSignal();
      spy();
    });

    batch(() => {
      createInstantEffect(() => {
        getMemo();
      })
      
      expect(spy.mock.calls.length).toBe(1);
  
      setSignal(2);
      setSignal(3);
      
      expect(spy.mock.calls.length).toBe(1);
    })

    expect(spy.mock.calls.length).toBe(2);
  });
  
  it('does recompute on every change in effect', () => {
    const [getSignal, setSignal] = createValue(1);
    const disposer = createDisposer();
    const spy = jest.fn();
    
    runWith({ disposer }, () => {
      expect(spy.mock.calls.length).toBe(0);

      const getMemo = createMemo(() => {
        getSignal();
        spy();
      });
  
      expect(spy.mock.calls.length).toBe(0);

      createInstantEffect(() => {
        getMemo();
      })
      
      expect(spy.mock.calls.length).toBe(1);
  
      setSignal(2);
      setSignal(3);

      expect(spy.mock.calls.length).toBe(3);
      
      getMemo();
  
      expect(spy.mock.calls.length).toBe(3);
      
      disposer.flush();
      
      setSignal(4);
  
      expect(spy.mock.calls.length).toBe(3);
      
      getMemo();
  
      expect(spy.mock.calls.length).toBe(4);
    })
  });
  
  it('cleanups with each recomputation', () => {
    const spy = jest.fn();
    
    const [getSignal, setSignal] = createValue(1);
    const disposer = createDisposer();
    
    runWith({ disposer }, () => {
      const getMemo = createMemo(() => {
        onCleanup(spy);
        getSignal();
      });

      getMemo();

      expect(spy.mock.calls.length).toBe(0);
      
      disposer.flush();
      
      expect(spy.mock.calls.length).toBe(1);
      
      getMemo();
      
      setSignal(2);
      
      getMemo();

      expect(spy.mock.calls.length).toBe(2);
    })
  });
});
