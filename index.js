const core = require('@actions/core');
const fs = require('fs');

// most @actions toolkit packages have async methods
async function run() {
  const { exec } = require('child_process');
  exec('git --no-pager show --pretty="" --name-only HEAD', (err, output, stderr) => {
    if (err) {
      console.log('\x1b[33m%s\x1b[0m', 'Could not find any path because: ');
      console.log('\x1b[31m%s\x1b[0m', stderr);
      process.exit(1);

      return;
    }

    console.log(`Output: ${output}`);

    const paths = output.split('\n');
    const path = paths.filter((val, idx, arr) => {
      if (val.endsWith('.md')) {
        return true;
      }
    });

    console.log('\x1b[32m%s\x1b[0m', `Found: ${path}`);

    exec(`wc -l ${path}`, (err, line, stderr) => {
      const space_index = line.search(' ');
      const line_count = parseInt(line.substr(0, space_index));
      console.log(`::set-output name=linecount::${line_count}`);

      if (line_count < 5) {
        console.log('\x1b[33m%s\x1b[0m', 'File contain less than 5 lines.');
        process.exit(1);
      }
      process.exit(0);
    });
  });
}

run()
