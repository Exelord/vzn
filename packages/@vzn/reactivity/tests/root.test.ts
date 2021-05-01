import { root } from "../src/root";
import { createValue } from "../src/value";
import { createInstantEffect } from "../src/effect";

describe('root', () => {
  it("allows subcomputations to escape their parents", () => {
    root(() => {
      const [getOuterSignal, setOuterSignal] = createValue(0);
      const [getInnerSignal, setInnerSignal] = createValue(0);
      const outerSpy = jest.fn();
      const innerSpy = jest.fn();
      
      createInstantEffect(() => {
        getOuterSignal();
        outerSpy();

        root(() => {
          createInstantEffect(() => {
            getInnerSignal();
            innerSpy();
          });
        });
      });
      
      expect(outerSpy.mock.calls.length).toBe(1);
      expect(innerSpy.mock.calls.length).toBe(1);
      
      // trigger the outer computation, making more inners
      setOuterSignal(1);
      setOuterSignal(2);
      
      expect(outerSpy.mock.calls.length).toBe(3);
      expect(innerSpy.mock.calls.length).toBe(3);
      
      setInnerSignal(1);
      
      expect(outerSpy.mock.calls.length).toBe(3);
      expect(innerSpy.mock.calls.length).toBe(6);
    });
  });
  
  it("does not batch updates when used at top level", () => {
    const spy = jest.fn();

    root(() => {
      const [getSignal, setSignal] = createValue(1);
      
      createInstantEffect(() => {
        getSignal();
        spy();
      });
      
      expect(spy.mock.calls.length).toBe(1);
      
      setSignal(2);
      
      expect(spy.mock.calls.length).toBe(2);
      
      setSignal(3);
      
      expect(spy.mock.calls.length).toBe(3);
    });
  });
  
  it("allows to dispose all nested computations", () => {
    const spy = jest.fn();

    root((dispose) => {
      const [getSignal, setSignal] = createValue(1);
      
      createInstantEffect(() => {
        getSignal();
        spy();
      });
      
      expect(spy.mock.calls.length).toBe(1);
      
      setSignal(2);
      
      expect(spy.mock.calls.length).toBe(2);

      dispose();
      
      setSignal(3);
      
      expect(spy.mock.calls.length).toBe(2);
    });
  });
});
