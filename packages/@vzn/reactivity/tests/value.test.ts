import { createValue } from "../src/value";
import { createComputation } from "../src/computation";
import { runWithOwner } from "../src/owner";
import { createQueue } from "../src/queue";

describe('createValue', () => {
  it('triggers computation', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(false);

    runWithOwner({ computation: spy }, () => getSignal());

    expect(spy.mock.calls.length).toBe(0);
    expect(getSignal()).toBe(false);
    
    setSignal(true);
    
    expect(spy.mock.calls.length).toBe(1);
    expect(getSignal()).toBe(true);
  });
  
  it('removes subscriptions on cleanup', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(false);
    const disposer = createQueue();

    runWithOwner({ disposer, computation: spy }, () => getSignal());

    setSignal(true);
    
    expect(spy.mock.calls.length).toBe(1);
    expect(getSignal()).toBe(true);

    disposer.flush();

    setSignal(false);
    
    expect(spy.mock.calls.length).toBe(1);
    expect(getSignal()).toBe(false);
  });

  it('ignores recomputation with circular dependencies', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(0);
    const disposer = createQueue();

    runWithOwner({ disposer, computation: spy }, () => setSignal(getSignal() + 1));
    
    expect(spy.mock.calls.length).toBe(0);
    expect(getSignal()).toBe(1);

    setSignal(getSignal() + 1);

    expect(spy.mock.calls.length).toBe(1);
    expect(getSignal()).toBe(2);
  });
});