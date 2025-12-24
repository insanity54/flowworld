/**
 * USAGE: npx tsx ./csvToSprite.ts ~/Downloads/voice.csv | xsel -b
 */


import * as fs from 'node:fs';

interface Sprite {
    [key: string]: [number, number];
}

function parseCSVToSprite(csvData: string): Sprite {
    const sprite: Sprite = {};
    const lines = csvData.trim().split('\n');

    // Skip the header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip empty lines
        if (line === '') continue;

        const parts = line.split(/\s+/); // Split on whitespace
        const name = parts[1].replace(/"/g, ''); // Remove double quotes
        const start = Math.round(parseFloat(parts[2]) * 1000); // Convert to milliseconds
        const duration = Math.round(parseFloat(parts[4]) * 1000); // Convert length to milliseconds

        sprite[name] = [start, duration];
    }

    return sprite;
}

function main() {
    const csvFilePath = process.argv[2];

    if (!csvFilePath) {
        console.error('Please provide the path to the CSV file as an argument.');
        process.exit(1);
    }

    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            process.exit(1);
        }

        const spriteObject = parseCSVToSprite(data);
        console.log(JSON.stringify(spriteObject, null, 2));
    });
}

main();
