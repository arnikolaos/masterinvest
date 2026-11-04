import fs from 'node:fs/promises';import path from 'node:path';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';import {ui} from '../src/content/ui.js';import {site} from '../src/data/site-config.js';
async function walk(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]))).flat();}
const files=(await Promise.all(['src','scripts','tests'].map(walk))).flat();
for(const file of files){if(/\.m?js$/.test(file)){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);}if(/\.(js|mjs|json|css)$/.test(file)){const source=await fs.readFile(file,'utf8');assert(!/^<{7}|^>{7}/m.test(source),`Conflict in ${file}`);assert(!/\b(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_]{10,}/.test(source),`Possible secret in ${file}`);}}
function keys(object,prefix=''){return Object.entries(object).flatMap(([key,v])=>typeof v==='object'&&!Array.isArray(v)?keys(v,prefix+key+'.'):[prefix+key]);}
assert.deepEqual(keys(ui.en).sort(),keys(ui.el).sort(),'UI locale parity');
for(const lang of ['en','el']){const c=JSON.parse(await fs.readFile(`src/content/${lang}.json`));for(const id of site.modules)assert(c[id]?.title,`${lang} missing ${id}`);assert.equal(c.expertise.items.length,6);assert.equal(c.destinations.items.length,4);}
console.log(`Syntax, conflict/secret-pattern checks and bilingual content checks passed (${files.length} source files).`);
