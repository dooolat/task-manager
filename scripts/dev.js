const { spawn } = require('child_process');

const workspaces = [
  {
    name: 'backend',
    command: 'npm',
    args: ['run', 'dev', '--workspace', 'backend']
  },
  {
    name: 'frontend',
    command: 'npm',
    args: ['run', 'dev', '--workspace', 'frontend']
  }
];

const children = workspaces.map(({ command, args }) =>
  spawn(command, args, {
    stdio: 'inherit',
    shell: true
  })
);

let shuttingDown = false;

const stopChildren = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
};

const finish = (code = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  stopChildren();
  process.exit(code);
};

process.on('SIGINT', () => finish(0));
process.on('SIGTERM', () => finish(0));

children.forEach((child, index) => {
  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (code !== 0) {
      console.error(`${workspaces[index].name} exited with code ${code}${signal ? ` (${signal})` : ''}`);
      finish(code || 1);
      return;
    }

    finish(0);
  });
});
