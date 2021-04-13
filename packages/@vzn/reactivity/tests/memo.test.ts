import { createComputation } from '../src/computation';
import { createMemo } from '../src/memo';
import { createInstantEffect } from '../src/effect';
import { createValue } from '../src/value';
import { batch } from '../src/batch';
import { createDisposer } from '../src/disposer';
import { runWith } from '../src/utils';

describe('createMemo', () => {
  it('does not recompute if not changed', () => {
    const spy = jest.fn();
    
    expect(spy.mock.calls.length).toBe(0);
    
    runWith({ computation: createComputation() }, () => {
      const getMemo = createMemo(() => {
        spy();
      });

      expect(spy.mock.calls.length).toBe(0);
  
      getMemo();
      
      expect(spy.mock.calls.length).toBe(1);
      
      getMemo();
      
      expect(spy.mock.calls.length).toBe(1);
    })
  });
  
  it('does recompute if changed', () => {
    const [getSignal, setSignal] = createValue(1);
    const spy = jest.fn();
    
    expect(spy.mock.calls.length).toBe(0);
    
    const getMemo = createMemo(() => {
      getSignal();
      spy();
    });
    
    setSignal(2);
    
    expect(spy.mock.calls.length).toBe(0);
    
    getMemo();
    
    expect(spy.mock.calls.length).toBe(1);
    
    setSignal(3);
    setSignal(4);
    
    getMemo();
    
    expect(spy.mock.calls.length).toBe(2);
  });
  
  it('does recompute inside batch only once', () => {
    const [getSignal, setSignal] = createValue(1);
    const spy = jest.fn();
    
    expect(spy.mock.calls.length).toBe(0);

    batch(() => {
      const getMemo = createMemo(() => {
        getSignal();
        spy();
      });
      
      expect(spy.mock.calls.length).toBe(0);
  
      setSignal(2);
      setSignal(3);
      
      expect(spy.mock.calls.length).toBe(0);
      
      getMemo();

      expect(spy.mock.calls.length).toBe(1);
    })

    expect(spy.mock.calls.length).toBe(1);
  });
  
  it('does recompute on change in effects', () => {
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
});
