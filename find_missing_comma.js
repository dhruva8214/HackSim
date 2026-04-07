const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\91789\\OneDrive\\Desktop\\Hacker\\hacksim\\src\\engine\\missions\\chapter9_iot.js', 'utf8');

// Find all objects in arrays like [{...}{...}]
const regex = /\}\s*\{/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log("Found missing comma at index", match.index);
    console.log(content.substring(match.index - 50, match.index + 50));
}
