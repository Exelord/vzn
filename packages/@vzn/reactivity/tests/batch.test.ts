import { batch } from '../src/batch';
import { createValue } from '../src/value';
import { createInstantEffect } from '../src/effect';

describe('batch', () => {
  it('batches updates', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(0);

    createInstantEffect(() => {
      getSignal();
      spy();
    });

    batch(() => {
      setSignal(1);
      setSignal(2);
    });

    expect(spy.mock.calls.length).toBe(2);
  });

  it('supports nested batches', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(0);

    createInstantEffect(() => {
      getSignal();
      spy();
    });

    batch(() => {
      batch(() => setSignal(1));
      setSignal(2);
    });

    expect(spy.mock.calls.length).toBe(2);
  });
});
