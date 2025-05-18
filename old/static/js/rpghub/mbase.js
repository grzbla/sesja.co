// var fuckingAss = require('./css-selector-parser/index.js').Message;
console.log(fuckingAss);
import {createParser} from './css-selector-parser/index.js'

const parse = createParser();
const selector = parse('a[href^="/"], .container:has(nav) > a[href]:nth-child(2)::before');

console.log(selector);
