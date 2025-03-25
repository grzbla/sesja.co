const fs = require('fs');
const path = require('path');
const { unpackLOD, unpackDEF, unpackPCX } = require('./homm3-unpacker');

// Helper function to format file size
function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit++;
    }
    return `${Math.round(size * 100) / 100} ${units[unit]}`;
}

// Helper function to get file type description
function getFileTypeDesc(type) {
    const types = {
        'h3m': 'Map File',
        'txt': 'Text File',
        'pcx (indexed)': 'PCX Image (Indexed)',
        'pcx (bgr)': 'PCX Image (BGR)',
        'def (spell)': 'DEF Spell Animation',
        'def (spritedef)': 'DEF Sprite Definition',
        'def (creature)': 'DEF Creature Animation',
        'def (adventure object)': 'DEF Adventure Object',
        'def (adventure hero)': 'DEF Adventure Hero',
        'def (terrain)': 'DEF Terrain',
        'def (cursor)': 'DEF Cursor',
        'def (interface)': 'DEF Interface Element',
        'def (sprite frame)': 'DEF Sprite Frame',
        'def (combat hero)': 'DEF Combat Hero',
        'msk': 'Mask File',
        'fnt': 'Font File',
        'pal': 'Palette File',
        'lod (vanilla)': 'LOD Archive (Base Game)',
        'lod (expansion)': 'LOD Archive (Expansion)'
    };
    return types[type] || 'Unknown Type';
}

function listLodContents(lodPath) {
    try {
        const data = fs.readFileSync(lodPath);
        const lod = unpackLOD(data);
        
        console.log(`\nLOD Archive: ${path.basename(lodPath)}`);
        console.log(`Type: ${getFileTypeDesc(lod.type)}`);
        console.log('\nFiles:');
        console.log('----------------------------------------');
        console.log('Name                     Type           Size');
        console.log('----------------------------------------');
        
        for (const [filename, fileData] of Object.entries(lod.files)) {
            const size = formatSize(fileData.byteLength);
            const type = filename.split('.').pop().toUpperCase();
            console.log(`${filename.padEnd(24)} ${type.padEnd(14)} ${size}`);
        }
        
        return lod;
    } catch (err) {
        console.error('Error reading LOD file:', err.message);
        return null;
    }
}

function extractFile(lod, filename, outputDir) {
    if (!lod.files[filename]) {
        console.error(`File ${filename} not found in archive`);
        return;
    }

    try {
        fs.mkdirSync(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, filename);
        
        // Handle different file types
        const ext = filename.toLowerCase().split('.').pop();
        if (ext === 'def') {
            const def = unpackDEF(lod.files[filename], { format: 'png' });
            // Save each image in the DEF
            for (const [imgName, imgData] of Object.entries(def.images)) {
                const imgPath = path.join(outputDir, `${filename}_${imgName}.png`);
                fs.writeFileSync(imgPath, Buffer.from(imgData.data));
                console.log(`Extracted: ${imgPath}`);
            }
        } else if (ext === 'pcx') {
            const pcx = unpackPCX(lod.files[filename], { format: 'png' });
            fs.writeFileSync(outputPath + '.png', Buffer.from(pcx.data));
            console.log(`Extracted: ${outputPath}.png`);
        } else {
            // Save raw file for other types
            fs.writeFileSync(outputPath, Buffer.from(lod.files[filename]));
            console.log(`Extracted: ${outputPath}`);
        }
    } catch (err) {
        console.error(`Error extracting ${filename}:`, err.message);
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage:');
        console.log('  List contents:   node lod-browser.js <lod-file>');
        console.log('  Extract file:    node lod-browser.js <lod-file> extract <filename> [output-dir]');
        return;
    }

    const lodPath = args[0];
    const lod = listLodContents(lodPath);
    if (!lod) return;

    if (args[1] === 'extract') {
        const filename = args[2];
        const outputDir = args[3] || './extracted';
        if (!filename) {
            console.error('Please specify a filename to extract');
            return;
        }
        extractFile(lod, filename, outputDir);
    }
}

main(); 