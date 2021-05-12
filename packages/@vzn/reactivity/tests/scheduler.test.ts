import { batch } from '../src/scheduler';
import { createValue } from '../src/value';
import { createReaction } from '../src/reaction';

jest.useFakeTimers('modern');

describe('batch', () => {
  it('batches updates', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(0);

    createReaction(() => {
      getSignal();
      spy();
    });

    batch(() => {
      setSignal(1);
      setSignal(2);
    });

    jest.runAllTimers();

    expect(spy.mock.calls.length).toBe(2);
  });

  it('supports nested batches', () => {
    const spy = jest.fn();
    const [getSignal, setSignal] = createValue(0);

    createReaction(() => {
      getSignal();
      spy();
    });

    batch(() => {
      batch(() => setSignal(1));
      setSignal(2);
    });

    jest.runAllTimers();

    expect(spy.mock.calls.length).toBe(2);
  });
});
