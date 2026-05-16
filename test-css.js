const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
let openBraces = 0;
let lines = css.split('\n');
for (let i = 0; i < lines.length; i++) {
  openBraces += (lines[i].match(/\{/g) || []).length;
  openBraces -= (lines[i].match(/\}/g) || []).length;
}
console.log("Braces balance:", openBraces);
