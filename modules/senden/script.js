class P2PFileTransfer {
    constructor() {
        this.peer = null;
        this.connection = null;
        this.file = null;
        this.chunkSize = 102400; // Initial chunk size (100KB)
        this.currentChunk = 0;
        this.totalChunks = 0;
        this.transferStartTime = 0;
        this.lastChunkTime = 0;
        this.estimatedSpeed = 0; // in bytes per second
        this.totalBytesTransferred = 0;
        
        // Receiver-side properties
        this.receivedChunks = [];
        this.receivedMetadata = null;
        this.receivedSize = 0;
        
        this.isTransferComplete = false;  // Add transfer completion flag
        
        this.initializePeer();
        this.setupEventListeners();
    }

    initializePeer() {
        this.peer = new Peer({
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        this.peer.on('open', (id) => {
            console.log('My peer ID is:', id);
            document.getElementById('peerId').textContent = id;
        });

        this.peer.on('connection', (conn) => {
            console.log('Incoming connection from:', conn.peer);
            this.handleConnection(conn);
        });

        this.peer.on('error', (error) => {
            console.error('Peer error:', error);
            document.getElementById('connectionStatus').textContent = 'Error: ' + error.type;
        });
    }

    setupEventListeners() {
        document.getElementById('copyId').addEventListener('click', () => {
            const peerId = document.getElementById('peerId').textContent;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(peerId)
                    .then(() => alert('Peer ID copied to clipboard!'))
                    .catch(err => this.fallbackCopy(peerId));
            } else {
                this.fallbackCopy(peerId);
            }
        });

        document.getElementById('connect').addEventListener('click', () => {
            const remotePeerId = document.getElementById('remotePeerId').value.trim();
            if (remotePeerId) {
                this.connectToPeer(remotePeerId);
            } else {
                alert('Please enter a remote peer ID');
            }
        });

        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('sendFile').addEventListener('click', () => this.startFileTransfer());
    }

    fallbackCopy(text) {
        // Create temporary input element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make it invisible but part of the document
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        // Select and copy
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Peer ID copied to clipboard!');
        } catch (err) {
            alert('Failed to copy: ' + text);
        }
        
        // Clean up
        document.body.removeChild(textArea);
    }

    connectToPeer(remotePeerId) {
        console.log('Connecting to peer:', remotePeerId);
        const conn = this.peer.connect(remotePeerId, {
            reliable: true
        });
        this.handleConnection(conn);
    }

    handleConnection(conn) {
        this.connection = conn;
        document.getElementById('connectionStatus').textContent = 'Connecting...';

        conn.on('open', () => {
            console.log('Connection established');
            document.getElementById('connectionStatus').textContent = 'Connected';
            document.getElementById('sendFile').disabled = !this.file;
        });

        conn.on('data', (data) => this.handleDataMessage(data));

        conn.on('close', () => {
            console.log('Connection closed');
            document.getElementById('connectionStatus').textContent = 'Disconnected';
            document.getElementById('sendFile').disabled = true;
        });

        conn.on('error', (error) => {
            console.error('Connection error:', error);
            document.getElementById('connectionStatus').textContent = 'Error: ' + error;
        });
    }

    handleFileSelect(event) {
        this.file = event.target.files[0];
        document.getElementById('fileSize').textContent = this.formatSize(this.file.size);
        document.getElementById('sendFile').disabled = !(this.file && this.connection && this.connection.open);
    }

    async startFileTransfer() {
        if (!this.file || !this.connection || !this.connection.open) return;

        this.transferStartTime = Date.now();
        this.lastChunkTime = this.transferStartTime;
        this.currentChunk = 0;
        this.totalBytesTransferred = 0;
        this.totalChunks = Math.ceil(this.file.size / this.chunkSize);
        this.isTransferComplete = false;  // Add transfer completion flag

        // Send file metadata
        const metadata = {
            type: 'metadata',
            name: this.file.name,
            size: this.file.size,
            totalChunks: this.totalChunks
        };
        this.connection.send(metadata);

        // Reset progress UI for sender
        document.getElementById('progress').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
        document.getElementById('currentSpeed').textContent = '0 B/s';
        document.getElementById('chunkSize').textContent = this.formatSize(this.chunkSize);

        console.log(`Starting transfer of ${this.file.name} with ${this.totalChunks} chunks`);
        await this.sendNextChunk();
    }

    async sendNextChunk() {
        if (this.isTransferComplete) return;  // Don't send if transfer is complete

        const start = this.currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        const chunk = this.file.slice(start, end);
        
        try {
            const reader = new FileReader();
            await new Promise((resolve, reject) => {
                reader.onload = resolve;
                reader.onerror = reject;
                reader.readAsArrayBuffer(chunk);
            });

            const base64Data = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
            const chunkData = {
                type: 'chunk',
                number: this.currentChunk,
                data: base64Data,
                size: chunk.size,
                isLastChunk: end === this.file.size  // Add flag for last chunk
            };
            
            this.connection.send(chunkData);
            this.totalBytesTransferred += chunk.size;
            
            // Update sender progress
            const progress = Math.min((this.totalBytesTransferred / this.file.size) * 100, 100);
            document.getElementById('progress').style.width = `${progress}%`;
            document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
        } catch (error) {
            console.error('Error reading chunk:', error);
            alert('Error reading chunk: ' + error.message);
        }
    }

    handleDataMessage(message) {
        if (message.type === 'metadata') {
            // Handle incoming file metadata
            this.receivedMetadata = message;
            this.receivedChunks = new Array(message.totalChunks);
            this.receivedSize = 0;
            this.transferStartTime = Date.now();
            
            console.log(`Receiving file ${message.name} with ${message.totalChunks} chunks`);
            
            // Update UI for receiver
            document.getElementById('fileSize').textContent = this.formatSize(message.size);
            document.getElementById('progress').style.width = '0%';
            document.getElementById('progressText').textContent = '0%';
            document.getElementById('currentSpeed').textContent = '0 B/s';
            document.getElementById('chunkSize').textContent = this.formatSize(this.chunkSize);
            
        } else if (message.type === 'chunk') {
            // Handle incoming chunk
            const chunkNumber = message.number;
            this.receivedChunks[chunkNumber] = message.data;
            
            // Update received size and progress
            this.receivedSize += message.size;
            if (this.receivedMetadata) {
                const progress = Math.min((this.receivedSize / this.receivedMetadata.size) * 100, 100);
                document.getElementById('progress').style.width = `${progress}%`;
                document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
                
                // Calculate and display current speed
                const elapsedTime = Math.max((Date.now() - this.transferStartTime) / 1000, 0.1);
                const currentSpeed = this.receivedSize / elapsedTime;
                document.getElementById('currentSpeed').textContent = this.formatSpeed(currentSpeed);
                document.getElementById('chunkSize').textContent = this.formatSize(message.size);
            }
            
            // Send acknowledgment
            this.connection.send({
                type: 'chunk-received',
                number: chunkNumber,
                timestamp: Date.now()
            });
            
            // Check if this was the last chunk and we have all chunks
            const lastChunkReceived = chunkNumber === this.receivedMetadata.totalChunks - 1;
            const allChunksReceived = this.receivedChunks.every(chunk => chunk !== undefined);
            
            console.log(`Received chunk ${chunkNumber + 1}/${this.receivedMetadata.totalChunks}, all chunks: ${allChunksReceived}`);
            
            if (lastChunkReceived && allChunksReceived) {
                console.log('All chunks received, assembling file...');
                this.assembleAndDownloadFile();
            }
        } else if (message.type === 'chunk-received') {
            // Only process chunk acknowledgments if we're the sender
            if (!this.file || this.isTransferComplete) return;

            const now = Date.now();
            const timeDiff = Math.max((now - this.lastChunkTime) / 1000, 0.1);
            const bytesTransferred = this.chunkSize;
            this.estimatedSpeed = bytesTransferred / timeDiff;

            // Update UI
            document.getElementById('currentSpeed').textContent = this.formatSpeed(this.estimatedSpeed);

            // Check if this was the last chunk
            const isLastChunk = (this.currentChunk + 1) * this.chunkSize >= this.file.size;
            
            if (isLastChunk) {
                this.isTransferComplete = true;
                console.log('File transfer complete!');
                document.getElementById('currentSpeed').textContent = this.formatSpeed(
                    this.file.size / ((now - this.transferStartTime) / 1000)
                );
                return;
            }

            // Calculate new chunk size based on estimated speed
            if (this.currentChunk === 0) {
                // After first chunk, adjust chunk size based on measured speed
                this.chunkSize = Math.min(
                    Math.floor(this.estimatedSpeed), // 1 second worth of data
                    this.file.size - (this.currentChunk * this.chunkSize) // Remaining size
                );
            } else {
                // For subsequent chunks, adjust based on deviation from expected time
                const expectedTime = this.chunkSize / this.estimatedSpeed;
                const speedAdjustment = expectedTime / timeDiff;
                const newChunkSize = Math.floor(this.chunkSize * speedAdjustment);
                
                // Calculate remaining size
                const remainingSize = this.file.size - ((this.currentChunk + 1) * this.chunkSize);
                
                // Set new chunk size with bounds
                this.chunkSize = Math.min(newChunkSize, remainingSize);
            }

            // Ensure chunk size stays within reasonable bounds (100KB to 5MB)
            this.chunkSize = Math.max(102400, Math.min(this.chunkSize, 5242880));
            
            // Final check: ensure chunk size doesn't exceed remaining file size
            const remainingSize = this.file.size - (this.currentChunk * this.chunkSize);
            if (remainingSize < this.chunkSize) {
                this.chunkSize = remainingSize;
            }
            
            document.getElementById('chunkSize').textContent = this.formatSize(this.chunkSize);

            // Prepare for next chunk
            this.lastChunkTime = now;
            this.currentChunk++;

            // Send next chunk
            this.sendNextChunk();
        }
    }

    assembleAndDownloadFile() {
        // Only assemble and download if we're the receiver
        if (this.file) return;

        try {
            // Convert base64 chunks to Uint8Array chunks
            const chunks = this.receivedChunks.map(chunk => {
                if (!chunk) throw new Error('Missing chunk detected');
                const binary = atob(chunk);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                return bytes;
            });

            // Create final blob
            const fileBlob = new Blob(chunks, { type: 'application/octet-stream' });
            
            // Create download link
            const downloadUrl = URL.createObjectURL(fileBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = this.receivedMetadata.name;
            downloadLink.style.display = 'none';
            
            // Add download link to page
            document.body.appendChild(downloadLink);
            
            // Create visible download button
            const downloadButton = document.createElement('button');
            downloadButton.textContent = `Download ${this.receivedMetadata.name}`;
            downloadButton.onclick = () => {
                downloadLink.click();
                document.body.removeChild(downloadButton);
                URL.revokeObjectURL(downloadUrl);
            };
            document.body.appendChild(downloadButton);
            
            console.log('File assembled, click button to download');
            
            // Reset receiver state
            this.receivedChunks = [];
            this.receivedMetadata = null;
            this.receivedSize = 0;
        } catch (error) {
            console.error('Error assembling file:', error);
            alert('Error assembling file: ' + error.message);
        }
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    formatSpeed(bytesPerSecond) {
        return `${this.formatSize(bytesPerSecond)}/s`;
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileTransfer = new P2PFileTransfer();
}); 