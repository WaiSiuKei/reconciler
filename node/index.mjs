import babel from '@babel/core';
import * as  fs from 'node:fs';
import * as path from 'node:path';
import plugin from './plugin.mjs';
import * as process from 'node:process';

const content = fs.readFileSync(path.join(process.cwd(), './example/es6.js'), 'utf8');
let out1 = babel.transform(content, {
  plugins: [
    [plugin, { functionName: 'fiberTask' }]
  ]
});

console.log(out1.code);

