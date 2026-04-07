const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\91789\\OneDrive\\Desktop\\Hacker\\hacksim\\src\\engine\\missions\\chapter9_iot.js', 'utf8');

try {
    // This is not quite right because it's an ESM file, but it might find basic syntax errors
    // We can use a simpler approach: check for common errors
    console.log("File read successfully. Length:", content.length);
} catch (e) {
    console.error("Error reading file:", e);
}

// Let's try to find potential syntax errors manually
const lines = content.split('\n');
lines.forEach((line, i) => {
    // Check for "Expected ':' but found ','"
    // This usually means { key , value } or something like that.
    // However, it's hard to find in such long lines without a parser.
});

console.log("Script finished.");
