const assert = require("assert");
const Runner = require("..");

const sinon = require("sinon");

describe("runner", function () {
  const runner = new Runner({ silent: true });
  describe("new Runner()", function () {
    it("should not throw", () => {
      assert.doesNotThrow(() => new Runner());
      assert.doesNotThrow(() => new Runner(undefined));
      assert.doesNotThrow(() => new Runner({}));
      assert.doesNotThrow(
        () =>
          new Runner({
            silent: true,
            data: {},
          })
      );
    });
    it("should throw if options is defined but not an object", () => {
      assert.throws(() => new Runner([]));
      assert.throws(() => new Runner(null));
      assert.throws(() => new Runner(new Map()));
      assert.throws(() => new Runner(123));
      assert.throws(() => new Runner(""));
    });
    it("should throw if options.data is defined but not an object", () => {
      assert.throws(
        () =>
          new Runner({
            data: [],
          })
      );
      assert.throws(
        () =>
          new Runner({
            data: new Map(),
          })
      );
      assert.throws(
        () =>
          new Runner({
            data: 123,
          })
      );
      assert.throws(
        () =>
          new Runner({
            data: "123",
          })
      );
      assert.throws(
        () =>
          new Runner({
            data: "",
          })
      );
    });
  });
  it("should throw if options.silent is defined but not a boolean", () => {
    assert.throws(
      () =>
        new Runner({
          silent: "",
        })
    );
    assert.throws(
      () =>
        new Runner({
          silent: null,
        })
    );
    assert.throws(
      () =>
        new Runner({
          silent: {},
        })
    );
    assert.throws(
      () =>
        new Runner({
          silent: [],
        })
    );
  });
  describe("runner.set(key, value)", function () {
    it("should set value in runner's data property, on the provided key", () => {
      runner.set("foo", "bar");
      runner.set("bar", { bang: "!" });
      assert.equal(runner.get("foo"), "bar");
      assert.deepEqual(runner.get("bar"), { bang: "!" });
    });
  });
  describe("runner.set(object)", function () {
    it("should merge the provided object with runner's data object", () => {
      runner.set({ foo: "bar", baz: "bang" });
      assert.equal(runner.get("foo"), "bar");
      assert.equal(runner.get("baz"), "bang");
    });
  });
  describe("runner.set()", function () {
    it("should throw", () => {
      assert.throws(() => runner.set());
      assert.throws(() => runner.set(""));
      assert.throws(() => runner.set(null));
      assert.throws(() => runner.set(undefined));
      assert.throws(() => runner.set(new Map()));
      assert.throws(() => runner.set(123));
    });
  });
  describe("runner.get()", function () {
    it("should throw", () => {
      runner.set("foo", "bar");
      assert.equal(runner.get("foo"), "bar");
    });
  });
  describe("runner.clear()", function () {
    it("should clear runner's data", () => {
      runner.clear();
      assert.deepEqual(runner.data, {});
    });
  });
  describe("runner.task()", function () {
    it("should register tasks", () => {
      runner.task("foo", () => {});
      runner.task("bar", () => {});
      assert.equal(Object.keys(runner.tasks).length, 2);
    });
    it("should throw if task name is duplicate", () => {
      assert.throws(() => runner.task("foo", () => {}));
    });
    it("should throw if task name is invalid", () => {
      assert.throws(() => runner.task("", () => {}));
      assert.throws(() => runner.task(null, () => {}));
      assert.throws(() => runner.task(undefined, () => {}));
    });
    it("should throw if taskFn is not a function", () => {
      assert.throws(() => runner.task("", 123));
      assert.throws(() => runner.task(null, "() => {}"));
      assert.throws(() => runner.task(undefined, {}));
      assert.throws(() => runner.task(undefined, true));
    });
  });
  describe("runner.run()", function () {
    const task1Fn = sinon.fake();
    const task2Fn = sinon.fake();
    it("should run tasks", () => {
      runner.task("task1", task1Fn);
      runner.run("task1", () => {});
      assert.equal(task1Fn.callCount, 1);
    });
    it("should run tasks provided in an array", () => {
      runner.task("task2", task2Fn);
      runner.run(["task1", "task2"], () => {});
      assert.equal(task1Fn.callCount, 2);
      assert.equal(task2Fn.callCount, 1);
    });
    it("should throw if argument is invalid", () => {
      assert.throws(() => runner.run("", () => {}));
      assert.throws(() => runner.run(null, () => {}));
      assert.throws(() => runner.run(undefined, () => {}));
      assert.throws(() => runner.run({}, () => {}));
    });
    it("should throw if tasks are not registered", () => {
      assert.throws(() => runner.run("not:registered", () => {}));
      assert.throws(() =>
        runner.run(["not:registered", "this:is:also:not:registered"], () => {})
      );
    });
    it("should throw if cb is not a function", () => {
      assert.throws(() => runner.run("task1", "() => {}"));
      assert.throws(() => runner.run(["task1", "task2"], {}));
      assert.throws(() => runner.run(["task1", "task2"]));
    });
  });
});
