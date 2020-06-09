const color = require("ansi-colors");
const utils = require("./lib/utils");

class Runner {
  /**
   * Runner options.
   * @typedef {Object} RunnerOptions
   * @property {boolean} [RunnerOptions.silent=false] `boolean` if set to true, will disable runner logging statements
   * @property {Object} [RunnerOptions.data={}] `object` initialize runner's data object
   */

  /**
   * Creates an instance of Runner.
   *
   * ```js
   * const runner = new Runner()
   * ```
   * @constructor
   * @param {RunnerOptions} options
   */
  constructor(options = {}) {
    const { data, silent } = options;
    if (!utils.isObject(options)) {
      throw new Error(
        `Expected object, received ${utils.getNativeType(options)}`
      );
    }
    if (!(utils.isObject(data) || typeof data === "undefined")) {
      throw new Error(`Expected object, received ${utils.getNativeType(data)}`);
    }
    this.data = data || {};
    if (!(utils.isBoolean(silent) || typeof silent === "undefined")) {
      throw new Error(
        `Expected boolean, received ${utils.getNativeType(silent)}`
      );
    }
    this.silent = silent || false;
    this.tasks = {};
  }

  /**
   * Merges the internal `data` object of runner with provided `data` object
   *
   * ```js
   * runner.set({foo: 'bar'})
   * ```
   * @param {string|object} key
   * @param {*} [value]
   */
  set(key, value) {
    if (!key) {
      throw new TypeError(`Cannot set value on empty key`);
    }
    if (!(typeof key === "string" || utils.isObject(key))) {
      throw new TypeError(
        `Expect string or object, received ${utils.getNativeType(key)}`
      );
    }
    if (typeof key === "string") {
      if (!key.trim()) {
        throw new TypeError(`Cannot set value on empty key`);
      }
      this.data[key] = value;
      return;
    }
    this.data = { ...this.data, ...key };
  }

  /**
   * Get value from runner's data object
   *
   * ```js
   * runner.get('foo')
   * ```
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Clear runner's data
   *
   * ```js
   * runner.clear()
   * ```
   */
  clear() {
    this.data = {};
  }

  /**
   * Task Done Function.
   * @callback TaskDoneFn
   */

  /**
   * Task Function.
   * @callback TaskFn
   * @param {TaskDoneFn} fn A callback function. When invoked, tells the runner that the this task is finished.
   */

  /**
   * Register tasks to run later
   *
   * ```js
   * runner.task('foo', (done) => {
   *    console.log('foo doing stuff');
   *    done();
   * })
   * ```
   * @param {string} taskName
   * @param {TaskFn} fn function to invoke when the task runs
   */
  task(taskName, fn) {
    if (!taskName) {
      throw new Error(`Cannot register empty task name`);
    }
    if (typeof taskName !== "string") {
      throw new Error(
        `Expected task name to be string, received ${typeof taskName}`
      );
    }
    if (this.tasks.hasOwnProperty(taskName)) {
      throw new Error(`duplicate task name: ${taskName}`);
    }
    this.tasks[taskName] = fn;
  }

  /**
   * @callback TasksDoneFn
   * @param {Error} [err]
   */

  /**
   * Runs the registered tasks provided in `tasks` argument.
   *
   * ```js
   * runner.run('foo', (err) => {
   *    if(err) throw err;
   * })
   * ```
   * @param {String|String[]} tasks string or array of strings.
   * @param {TasksDoneFn} cb A callback function, will be invoked once the runner has finished all the tasks.
   */
  run(tasks, cb) {
    if (!tasks) {
      throw new Error(
        `Expected tasks argument to be string or array of strings, received ${utils.getNativeType(
          tasks
        )}`
      );
    }
    if (typeof tasks !== "string" && !Array.isArray(tasks)) {
      throw new Error(
        `Expected tasks argument to be string or array of strings, received ${utils.getNativeType(
          tasks
        )}`
      );
    }
    if (typeof tasks === "string") {
      const taskFn = this.tasks[tasks];
      if (!taskFn) throw new Error(`task not registered: ${tasks}`);
      logStarted(this.silent, tasks);
      try {
        taskFn.call(this, () => logFinished(this.silent, tasks));
      } catch (error) {
        cb(error);
        return;
      }
      cb();
      return;
    }
    for (const task of tasks) {
      const taskFn = this.tasks[task];
      if (!taskFn) throw new Error(`task not registered: ${task}`);
      logStarted(this.silent, task);
      try {
        taskFn.call(this, () => logFinished(this.silent, task));
      } catch (error) {
        cb(error);
        return;
      }
    }
    cb();
    return;
  }
}

const logStarted = (isSilent, taskName) => {
  if (!isSilent) {
    console.log(
      color.blue(color.symbols.info),
      `${color.dim("started:")}${taskName}`
    );
  }
};

const logFinished = (isSilent, taskName) => {
  if (!isSilent) {
    console.log(
      color.greenBright(color.symbols.check),
      `${color.dim("started:")}${taskName}`
    );
  }
};

module.exports = Runner;
