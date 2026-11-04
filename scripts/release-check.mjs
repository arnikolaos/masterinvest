import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {site} from '../src/data/site-config.js';
assert(Object.values(site.launch).every(Boolean),'Owner factual/privacy review and real EmailJS delivery verification are outstanding.');
const report=JSON.parse(await fs.readFile('evidence/browser-report.json','utf8'));assert.equal(report.status,'passed','Browser verification has not passed.');
const build=JSON.parse(await fs.readFile('evidence/build.json','utf8'));assert(build.release&&build.emailEnabled,'A release build with connected EmailJS is required.');
console.log('Release checks passed.');
