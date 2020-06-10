## Examples

```js
const runner = new Runner();
// register task1
runner.task("task1", (done) => {
  console.log("doing task1 stuff");
  done(); // telling the runner that task1 is finished
});
// register task2
runner.task("task2", (done) => {
  console.log("doing task2 stuff");
  done(); // telling the runner that task2 is finished
});
// run the tasks that were registered earlier
// 1. run single task
runner.run("task1", (err) => {
  if (err) throw err; // catch if task1 throws any error
});
// 2. or run multiple tasks
runner.run(["task1", "task2"], (err) => {
  if (err) throw err; // catch if any of the tasks throw error
});
```
