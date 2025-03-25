importScripts('./heroes/homm3-unpacker.js');

// Fast categorization prefixes
const prefixes = {
    'ttr': 'terrain',
    'htr': 'terrain',
    'sp': 'spells',
    'cpr': 'creatures',
    'av': 'objects',
    'ico': 'ui',
    'btn': 'ui',
    'ah': 'heroes',
    'cm': 'combat'
};

self.onmessage = async function(e) {
    const [action, data] = e.data;
    
    try {
        switch(action) {
            case 'process_lod':
                const buffer = data;
                const lod = self['homm3-unpacker'].unpackLOD(buffer);
                const processedFiles = {};
                let processed = 0;
                const total = Object.keys(lod.files).length;
                
                // Process files in memory
                for (const [filename, fileData] of Object.entries(lod.files)) {
                    const ext = filename.slice(-3).toLowerCase();
                    if (ext !== 'def' && ext !== 'pcx') {
                        processed++;
                        continue;
                    }

                    try {
                        // Get first 3 chars for categorization
                        const prefix = filename.substring(0, 3).toLowerCase();
                        const category = prefixes[prefix] || 'misc';

                        if (ext === 'def') {
                            const def = self['homm3-unpacker'].unpackDEF(fileData, { format: 'png' });
                            processedFiles[filename] = {
                                data: def.images,
                                type: 'def',
                                category,
                                frames: Object.keys(def.images).length
                            };
                        } else {
                            const pcx = self['homm3-unpacker'].unpackPCX(fileData, { format: 'png' });
                            processedFiles[filename] = {
                                data: [pcx],
                                type: 'pcx',
                                category,
                                frames: 1
                            };
                        }
                        
                        processed++;
                        if (processed % 100 === 0) {
                            self.postMessage({
                                type: 'progress',
                                current: processed,
                                total
                            });
                        }
                    } catch (err) {
                        console.error(`Error processing ${filename}:`, err);
                        processed++;
                    }
                }

                self.postMessage({
                    type: 'complete',
                    data: processedFiles
                });
                break;
        }
    } catch (err) {
        self.postMessage({
            type: 'error',
            data: err.message
        });
    }
}; 