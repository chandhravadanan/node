'use strict';

const common = require('../common');
const assert = require('assert');
const { ChildProcess } = require('child_process');
assert.strictEqual(typeof ChildProcess, 'function');

{
  // Verify that invalid options to spawn() throw.
  const child = new ChildProcess();

  [undefined, null, 'foo', 0, 1, NaN, true, false].forEach((options) => {
    common.expectsError(() => {
      child.spawn(options);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      type: TypeError,
      message: 'The "options" argument must be of type object.' +
               `${common.invalidArgTypeHelper(options)}`
    });
  });
}

{
  // Verify that spawn throws if file is not a string.
  const child = new ChildProcess();

  [undefined, null, 0, 1, NaN, true, false, {}].forEach((file) => {
    common.expectsError(() => {
      child.spawn({ file });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      type: TypeError,
      message: 'The "options.file" property must be of type string.' +
               `${common.invalidArgTypeHelper(file)}`
    });
  });
}

{
  // Verify that spawn throws if envPairs is not an array or undefined.
  const child = new ChildProcess();

  [null, 0, 1, NaN, true, false, {}, 'foo'].forEach((envPairs) => {
    common.expectsError(() => {
      child.spawn({ envPairs, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      type: TypeError,
      message: 'The "options.envPairs" property must be an instance of Array.' +
              common.invalidArgTypeHelper(envPairs)
    });
  });
}

{
  // Verify that spawn throws if args is not an array or undefined.
  const child = new ChildProcess();

  [null, 0, 1, NaN, true, false, {}, 'foo'].forEach((args) => {
    common.expectsError(() => {
      child.spawn({ file: 'foo', args });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      type: TypeError,
      message: 'The "options.args" property must be an instance of Array.' +
               common.invalidArgTypeHelper(args)
    });
  });
}

// Test that we can call spawn
const child = new ChildProcess();
child.spawn({
  file: process.execPath,
  args: ['--interactive'],
  cwd: process.cwd(),
  stdio: 'pipe'
});

assert.strictEqual(child.hasOwnProperty('pid'), true);
assert(Number.isInteger(child.pid));

// Try killing with invalid signal
common.expectsError(
  () => { child.kill('foo'); },
  { code: 'ERR_UNKNOWN_SIGNAL', type: TypeError }
);

assert.strictEqual(child.kill(), true);
