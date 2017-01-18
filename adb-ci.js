#!/usr/bin/env node

'use strict';

const fs = require('fs'),
  path = require('path');

const IS_CI = false;//process.env.CI;

const original_location = `${process.env.ANDROID_HOME}/platform-tools/adb`;

let args = process.argv.slice(2);

const logPath = path.join(__dirname, 'adb-ci.txt');

const currentDate = new Date();

if (IS_CI) {

  // See https://developer.android.com/studio/command-line/adb.html

  let command_pos, command

  if (args[0] === '-d' || args[0] === '-e') {
    command_pos = 1;
  } else if (args[0] === '-s') {
    command_pos = 2;
  } else {
    command_pos = 0;
  }

  command = args[command_pos];

  if (command === 'install') {
    // look for -g option
    let install_options = args.slice(command_pos + 1);
    if (!install_options.includes('-g')) {
      install_options.unshift('-g');
      args = args.slice(0, command_pos + 1).concat(install_options);
    }
  }

}

fs.appendFileSync(logPath, `${currentDate.toLocaleString()} adb-ci spawn: ${JSON.stringify(args)}\n`);

const
  spawn = require('child_process').spawn,
  adb = spawn(original_location, args, {
    stdio: 'inherit'
  });

adb.on('exit', code => {
  fs.appendFileSync(logPath, `${currentDate.toLocaleString()} adb-ci exit: ${code}\n`);
  // Do not use process.exit, see http://stackoverflow.com/a/37592669/1691132
  process.exitCode = code;
});

adb.on('error', () => {
  fs.appendFileSync(logPath,`${currentDate.toLocaleString()} adb-ci error\n`);
  console.log(`adb-ci wrapper could not start adb at ${original_location}`);
  process.exitCode = 1;
});

adb.on('SIGHUP', function() {
  fs.appendFileSync(logPath,`${currentDate.toLocaleString()} adb-ci SIGHUP\n`);
});

process.on('exit', code => {
  fs.appendFileSync(logPath,`${currentDate.toLocaleString()} adb-ci process exit\n`);
});
