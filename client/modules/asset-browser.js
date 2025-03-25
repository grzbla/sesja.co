// Asset categorization patterns
const ASSET_PATTERNS = {
    terrain: {
        patterns: [
            /^[ht]tr/i,      // Terrain tiles
            /^clr/i,         // Clearings
            /^dirt/i,        // Dirt
            /^grass/i,       // Grass
            /^snow/i,        // Snow
            /^subtile/i,     // Subtiles
            /^water/i,       // Water
            /^lava/i,        // Lava
            /^rough/i,       // Rough terrain
            /^sand/i,        // Sand
            /^gnd/i,         // Ground tiles
            /^(rck|rock)\d/i, // Rock terrain
            /^swmp/i,        // Swamp
            /^sub/i,         // Subterranean
            /^tl/i,          // Tile prefixes
            /^edg/i          // Edge tiles
        ],
        subTypes: {
            'base': /^([ht]tr|gnd|tl)/i,
            'transitions': /(trans|edg)/i,
            'roads': /road/i,
            'rivers': /river/i,
            'clearings': /^clr/i,
            'special': /(lava|snow|swmp|sub)/i
        }
    },
    decorations: {
        patterns: [
            /^avw/i,         // Adventure objects
            /^rock/i,        // Rocks
            /^tree/i,        // Trees
            /^lake/i,        // Lakes
            /^mtn/i,         // Mountains
            /^crater/i,      // Craters
            /^outcrop/i      // Outcroppings
        ]
    },
    objects: {
        patterns: [
            /^av[^w]/i,      // Adventure objects (not water)
            /^obj/i,         // Generic objects
            /^mine/i,        // Mines
            /^res/i          // Resources
        ],
        subTypes: {
            'resources': /^res|gold|wood|ore|mercury|sulfur|crystal|gem/i,
            'dwellings': /dwell|recruit/i,
            'artifacts': /artif/i,
            'shrines': /shrine/i,
            'mines': /mine/i
        }
    },
    creatures: {
        patterns: [
            /^cprsmall/i,    // Small combat sprites
            /^cprbig/i,      // Big combat sprites
            /^twcrport/i,    // Town portal creatures
            /^cg(?!at)/i,    // Creature general (not gate)
            /^mons/i,        // Monsters
            /^avwmon/i       // Adventure map monsters
        ],
        subTypes: {
            'moving': /(mov|walk)/i,
            'idle': /idle|stand/i,
            'attacking': /(att|shot)/i,
            'defending': /defnd/i,
            'getting_hit': /ghit/i,
            'dying': /death|die/i,
            'casting': /cast/i,
            'starting': /strt/i
        }
    },
    spells: {
        patterns: [
            /^sp[^r]/i,      // Spells (not sprites)
            /^spell/i        // Spell animations
        ],
        subTypes: {
            'combat': /cbsp|sp[cm]/i,
            'adventure': /adsp/i,
            'effects': /speff/i
        }
    },
    ui: {
        patterns: [
            /^ico/i,         // Icons
            /^btn/i,         // Buttons
            /^dlg/i,         // Dialogs
            /^menu/i,        // Menu elements
            /^cursors?/i,    // Cursors
            /^crest/i,       // Crests
            /^win[cm]/i      // Windows
        ]
    },
    towns: {
        patterns: [
            /^town/i,        // Town screens
            /^cast/i,        // Castle
            /^fort/i,        // Fort
            /^build/i,       // Buildings
            /^hall/i,        // Town halls
            /^tavern/i,      // Taverns
            /^mage/i         // Mage guilds
        ],
        subTypes: {
            'castle': /castle|keep/i,
            'rampart': /rampart/i,
            'tower': /tower/i,
            'inferno': /inferno/i,
            'necropolis': /necro/i,
            'dungeon': /dungeon/i,
            'stronghold': /strongh/i,
            'fortress': /fortress/i,
            'conflux': /conflux/i
        }
    },
    heroes: {
        patterns: [
            /^hero/i,        // Heroes
            /^port/i,        // Portraits
            /^ah[^o]/i,      // Adventure heroes
            /^chr/i          // Character screens
        ],
        subTypes: {
            'portraits': /port/i,
            'adventure': /^ah/i,
            'combat': /^ch/i
        }
    },
    artifacts: {
        patterns: [
            /^art/i,         // Artifacts
            /^([a-z]{2})?arif/i // Artifact variations
        ],
        subTypes: {
            'treasure': /art[0-9]t/i,
            'minor': /art[0-9]m/i,
            'major': /art[0-9]j/i,
            'relic': /art[0-9]r/i
        }
    },
    skills: {
        patterns: [
            /^skil/i,        // Skills
            /^pskil/i,       // Primary skills
            /^secsk/i        // Secondary skills
        ],
        subTypes: {
            'primary': /^pskil/i,
            'secondary': /^secsk/i
        }
    },
    combat: {
        patterns: [
            /^cbh[^e]/i,     // Combat hero
            /^cw/i,          // Combat window
            /^cgat/i,        // Combat gate
            /^cbar/i         // Combat bar
        ]
    },
    fonts: {
        patterns: [
            /^font/i,        // Fonts
            /\.fnt$/i        // Font files
        ]
    }
};

class AssetBrowser {
    constructor() {
        this.assets = new Map();
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.previewState = {
            currentAsset: null,
            currentFrame: 0,
            isPlaying: false,
            playbackSpeed: 1,
            animationInterval: null
        };

        // Wait for the unpacker to be available
        const waitForUnpacker = () => {
            if (window['homm3-unpacker']) {
                this.initializeWorker();
            } else {
                setTimeout(waitForUnpacker, 100);
            }
        };
        waitForUnpacker();

        // Wait for DOM to be ready before initializing UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeUI());
        } else {
            this.initializeUI();
        }
        
        this.initializeDropHandling();

        // Add window unload cleanup
        window.addEventListener('unload', () => {
            if (this.previewState.animationInterval) {
                clearInterval(this.previewState.animationInterval);
            }
            if (this.worker) {
                this.worker.terminate();
            }
        });
    }

    initializeWorker() {
        const workerCode = `
            self.homm3unpacker = ${window['homm3-unpacker'].toString()};

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
                            const lod = self.homm3unpacker.unpackLOD(buffer);
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
                                        const def = self.homm3unpacker.unpackDEF(fileData, { format: 'png' });
                                        processedFiles[filename] = {
                                            data: def.images,
                                            type: 'def',
                                            category,
                                            frames: Object.keys(def.images).length
                                        };
                                    } else {
                                        const pcx = self.homm3unpacker.unpackPCX(fileData, { format: 'png' });
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
                                    console.error(\`Error processing \${filename}:\`, err);
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
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.setupWorker();
    }

    setupWorker() {
        this.worker.onmessage = (e) => {
            const { type, data, current, total } = e.data;
            
            switch(type) {
                case 'progress':
                    const percent = Math.round((current / total) * 100);
                    this.showStatus(`Loading... ${percent}%`, false);
                    break;
                    
                case 'complete':
                    this.assets.clear();
                    for (const [filename, asset] of Object.entries(data)) {
                        this.assets.set(filename, asset);
                    }
                    this.updateGrid();
                    this.showStatus(`Loaded ${this.assets.size} assets`, false);
                    break;
                    
                case 'error':
                    this.showStatus(`Error: ${data}`, true);
                    console.error('Worker error:', data);
                    break;
            }
        };

        this.worker.onerror = (err) => {
            this.showStatus(`Worker error: ${err.message}`, true);
            console.error('Worker error:', err);
        };
    }

    initializeUI() {
        // Tab handling
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchCategory(tab.dataset.category));
        });

        // Search handling
        document.querySelector('.search-box').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.updateGrid();
        });

        // Preview controls
        document.getElementById('prevFrame').addEventListener('click', () => this.previousFrame());
        document.getElementById('nextFrame').addEventListener('click', () => this.nextFrame());
        document.getElementById('playPause').addEventListener('click', () => this.togglePlayback());
        document.getElementById('playbackSpeed').addEventListener('input', (e) => {
            this.previewState.playbackSpeed = parseFloat(e.target.value);
            if (this.previewState.isPlaying) {
                this.stopAnimation();
                this.startAnimation();
            }
        });
        document.getElementById('copyFilename').addEventListener('click', () => this.copyFilename());
        document.getElementById('copyJson').addEventListener('click', () => this.copyAsJson());
        document.getElementById('exportAsset').addEventListener('click', () => this.exportAsset());
        document.getElementById('closePreview').addEventListener('click', () => this.closePreview());

        // Initialize preview modal close on outside click
        document.getElementById('previewModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closePreview();
            }
        });
    }

    initializeDropHandling() {
        const dropOverlay = document.getElementById('dropOverlay');
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        // Counter to track drag enter/leave
        let dragCounter = 0;

        // Prevent defaults for all drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Handle drag enter/leave with counter
        document.body.addEventListener('dragenter', (e) => {
            preventDefaults(e);
            dragCounter++;
            if (dragCounter === 1) {
                dropOverlay.classList.add('active');
            }
        });

        document.body.addEventListener('dragleave', (e) => {
            preventDefaults(e);
            dragCounter--;
            if (dragCounter === 0) {
                dropOverlay.classList.remove('active');
            }
        });

        // Reset counter and handle drop
        document.body.addEventListener('drop', async (e) => {
            preventDefaults(e);
            dragCounter = 0;
            dropOverlay.classList.remove('active');
            
            const file = e.dataTransfer.files[0];
            if (file && file.name.toLowerCase().endsWith('.lod')) {
                await this.processLodFile(file);
            } else {
                this.showStatus('Please drop a valid LOD file', true);
            }
        });
    }

    async processLodFile(file) {
        try {
            this.showStatus('Reading LOD file...', false);
            const buffer = await file.arrayBuffer();
            this.worker.postMessage(['process_lod', buffer], [buffer]);
        } catch (err) {
            this.showStatus(`Error reading file: ${err.message}`, true);
            console.error('File reading error:', err);
        }
    }

    categorizeAsset(filename) {
        for (const [category, config] of Object.entries(ASSET_PATTERNS)) {
            if (config.patterns.some(pattern => pattern.test(filename))) {
                return category;
            }
        }
        return 'misc';
    }

    getAssetSubType(filename, category) {
        const config = ASSET_PATTERNS[category];
        if (!config || !config.subTypes) return 'general';

        for (const [subType, pattern] of Object.entries(config.subTypes)) {
            if (pattern.test(filename)) {
                return subType;
            }
        }
        return 'general';
    }

    categorizeAnimationType(frameName) {
        // Specific animation type categorization for creatures
        const types = {
            moving: /(mov|walk)/i,
            idle: /idle|stand/i,
            attacking: /(att|shot)/i,
            defending: /defnd/i,
            getting_hit: /ghit/i,
            dying: /death|die/i,
            casting: /cast/i,
            starting: /strt/i
        };

        for (const [type, pattern] of Object.entries(types)) {
            if (pattern.test(frameName)) {
                return type;
            }
        }
        return 'unknown';
    }

    switchCategory(category) {
        document.querySelector('.tab.active').classList.remove('active');
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.currentCategory = category;
        this.updateGrid();
    }

    updateGrid() {
        const grid = document.getElementById('asset-grid');
        grid.innerHTML = '';

        for (const [filename, asset] of this.assets) {
            if (this.currentCategory !== 'all' && asset.category !== this.currentCategory) {
                continue;
            }

            if (this.currentSearch && !filename.toLowerCase().includes(this.currentSearch.toLowerCase())) {
                continue;
            }

            const tile = document.createElement('div');
            tile.className = 'asset-tile';
            tile.onclick = () => this.showPreview(filename);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const firstFrame = asset.type === 'def' ? asset.data[Object.keys(asset.data)[0]] : asset.data[0];
            
            canvas.width = firstFrame.width;
            canvas.height = firstFrame.height;
            ctx.putImageData(firstFrame, 0, 0);

            const info = document.createElement('div');
            info.className = 'asset-info';
            info.textContent = `${filename} (${asset.frames} frames)`;

            tile.appendChild(canvas);
            tile.appendChild(info);
            grid.appendChild(tile);
        }
    }

    showPreview(filename) {
        const asset = this.assets.get(filename);
        if (!asset) return;

        this.previewState.currentAsset = asset;
        this.previewState.currentFrame = 0;
        this.previewState.isPlaying = false;
        if (this.previewState.animationInterval) {
            clearInterval(this.previewState.animationInterval);
        }

        const modal = document.getElementById('previewModal');
        const preview = document.getElementById('previewImage');
        const metadata = document.getElementById('previewMetadata');

        preview.innerHTML = `<img src="data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(asset.data[0].data)))}" alt="${filename}">`;
        metadata.innerHTML = `
            Filename: ${filename}
            Type: ${asset.type.toUpperCase()}
            Frames: ${asset.frames}
            Size: ${this.formatSize(asset.data[0].data.length)}
        `.split('\n').map(line => line.trim()).join('\n');

        modal.style.display = 'block';

        if (asset.frames > 1) {
            document.getElementById('prevFrame').style.display = 'block';
            document.getElementById('playPause').style.display = 'block';
            document.getElementById('nextFrame').style.display = 'block';
            document.getElementById('playbackSpeed').style.display = 'block';
        } else {
            document.getElementById('prevFrame').style.display = 'none';
            document.getElementById('playPause').style.display = 'none';
            document.getElementById('nextFrame').style.display = 'none';
            document.getElementById('playbackSpeed').style.display = 'none';
        }
    }

    closePreview() {
        document.getElementById('previewModal').style.display = 'none';
        this.stopAnimation();
        this.previewState.currentAsset = null;
        this.previewState.currentFrame = 0;
    }

    previousFrame() {
        if (!this.previewState.currentAsset) return;
        this.previewState.currentFrame = (this.previewState.currentFrame - 1 + this.previewState.currentAsset.data.length) % this.previewState.currentAsset.data.length;
        this.updatePreviewFrame();
    }

    nextFrame() {
        if (!this.previewState.currentAsset) return;
        this.previewState.currentFrame = (this.previewState.currentFrame + 1) % this.previewState.currentAsset.data.length;
        this.updatePreviewFrame();
    }

    updatePreviewFrame() {
        const preview = document.getElementById('previewImage');
        const frame = this.previewState.currentAsset.data[this.previewState.currentFrame];
        preview.innerHTML = `<img src="data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(frame.data)))}" alt="${frame.name}">`;
    }

    togglePlayback() {
        this.previewState.isPlaying = !this.previewState.isPlaying;
        document.getElementById('playPause').textContent = this.previewState.isPlaying ? 'Pause' : 'Play';
        
        if (this.previewState.isPlaying) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        if (this.previewState.animationInterval) {
            clearInterval(this.previewState.animationInterval);
            this.previewState.animationInterval = null;
        }

        // Safety check for playback speed
        const speed = Math.max(0.1, Math.min(2, this.previewState.playbackSpeed));
        const interval = Math.max(50, Math.round(100 / speed)); // Minimum 50ms interval

        this.previewState.animationInterval = setInterval(() => {
            if (!this.previewState.currentAsset || !this.previewState.isPlaying) {
                this.stopAnimation();
                return;
            }
            this.nextFrame();
        }, interval);
    }

    stopAnimation() {
        if (this.previewState.animationInterval) {
            clearInterval(this.previewState.animationInterval);
            this.previewState.animationInterval = null;
        }
        this.previewState.isPlaying = false;
        document.getElementById('playPause').textContent = 'Play';
    }

    copyFilename() {
        if (!this.previewState.currentAsset) return;
        const filename = [...this.assets.entries()]
            .find(([_, asset]) => asset === this.previewState.currentAsset)[0];
        navigator.clipboard.writeText(filename);
        this.showStatus('Filename copied to clipboard', false);
    }

    copyAsJson() {
        if (!this.previewState.currentAsset) return;
        const filename = [...this.assets.entries()]
            .find(([_, asset]) => asset === this.previewState.currentAsset)[0];
        const json = {
            filename,
            type: this.previewState.currentAsset.type,
            category: this.previewState.currentAsset.category,
            frames: this.previewState.currentAsset.frames,
            size: this.previewState.currentAsset.data[0].data.length
        };
        navigator.clipboard.writeText(JSON.stringify(json, null, 2));
        this.showStatus('Asset info copied as JSON', false);
    }

    async exportAsset() {
        if (!this.previewState.currentAsset) return;
        const filename = [...this.assets.entries()]
            .find(([_, asset]) => asset === this.previewState.currentAsset)[0];
        
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename.replace(/\.[^.]+$/, '.png'),
                types: [{
                    description: 'PNG Image',
                    accept: {'image/png': ['.png']}
                }]
            });
            
            const writable = await handle.createWritable();
            const frame = this.previewState.currentAsset.data[this.previewState.currentFrame];
            await writable.write(frame.data);
            await writable.close();
            
            this.showStatus('Asset exported successfully', false);
        } catch (err) {
            if (err.name !== 'AbortError') {
                this.showStatus(`Error exporting asset: ${err.message}`, true);
            }
        }
    }

    showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${isError ? 'error' : 'info'}`;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unit = 0;
        while (size >= 1024 && unit < units.length - 1) {
            size /= 1024;
            unit++;
        }
        return `${Math.round(size * 100) / 100} ${units[unit]}`;
    }
}

// Initialize the browser when the page loads
window.addEventListener('load', () => {
    window.assetBrowser = new AssetBrowser();
}); 