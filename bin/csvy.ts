#!/usr/bin/env node

'use strict';

const app = require('commander');
const cfg = require('../package.json');
const convert = require('../index.js');
const path = require('path');
const fs = require('fs');

app.version(cfg.version)
  .option('-d, --delimiter <delimiter>', 'delimiter symbol', ',')
  .option('-o, --output <file>', 'output file')
  .description(cfg.description)

app.parse(process.argv);

let write = (p, data) => new Promise((res, rej) => {
  fs.writeFile(path.resolve(p), data, 'utf8', err => {
    if (err) return rej(err);

    return res();
  });
});

let err = err => console.log(err);
let output = o => {
  if (!app.output) {
    console.log(o);
  } else {
    write(app.output, o).catch(err);
  }
};

if(app.args.length) {
  fs.readFile(app.args[0], 'utf8', (err, data) => {
    if (err) throw err;

    output(convert(data, {delimiter: app.delimiter}));
  });
} else {
  let data = '';

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function(chunk) {
    data += chunk;
  });

  process.stdin.on('end', function() {
    output(convert(data, {delimiter: app.delimiter}));
  });
}
