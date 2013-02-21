#!/usr/bin/env node

'use strict';

process.logging = function() {
  return console.log;
};

process.logStream = process.stdout;
process.logStream.setMaxListeners(0);

var dictator = require('..');
var fs = require('fs');
var procs;

if (process.argv.length > 2) {
  var filename = process.argv[2];
  procs = JSON.parse(fs.readFileSync(filename));
}

var stdinSize = fs.fstatSync(process.stdin.fd).size;
if (stdinSize > 0) {
  var stdinBuf = fs.readSync(process.stdin.fd, stdinSize)[0];
  procs = JSON.parse(stdinBuf);
}

if (!procs) throw Error('no config file read!');

dictator.rule(procs);
process.on('SIGINT', function() { dictator.terminate(procs); });
process.on('exit', function() { dictator.terminate(procs); });
