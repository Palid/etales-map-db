import path from 'path';
import fs from 'fs';
import { ItemMatcher } from './matchers/ItemMatcher';
import { Matchers } from './matchers/Matcher';
import { UnitMatcher } from './matchers/UnitMatcher';

const mapfile = path.resolve(__dirname, '../scripts.j');
if (fs.existsSync(mapfile)) {
  console.log(`Found mapfile at ${mapfile}.`);
}
console.log(`Reading map.`);
const scripts = fs.readFileSync(mapfile, 'utf8');

console.log(`Splitting into lines.`);
const lines = scripts.split('\n');

console.log(`${lines.length} lines of JASS code found.`);

const matchers = new Matchers();
matchers.register(ItemMatcher);
matchers.register(UnitMatcher);

for (const line of lines) {
  const l = matchers.match(line);
  if (l) {
    console.log(l);
  }
}
