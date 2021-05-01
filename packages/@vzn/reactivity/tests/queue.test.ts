import { createQueue } from "../src/queue";

describe('createQueue', () => {
  it('schedules and flushes', () => {
    const spy = jest.fn();
    const queue = createQueue();

    queue.schedule(spy);
    
    expect(spy.mock.calls.length).toBe(0);
    
    queue.flush();

    expect(spy.mock.calls.length).toBe(1);
  });
});