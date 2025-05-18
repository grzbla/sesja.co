/**
 * Radio - Handles the radio functionality using the system API for communication
 */
class Radio {
    constructor() {
        // Get the system components
        this.comm = window.system.getComm();
        this.network = window.system.getNetwork();
        
        if (!this.comm || !this.network) {
            console.error('System components not available');
            return;
        }
        
        // Initialize elements
        this.initElements();
        
        // State variables
        this.currentAudioFile = null;
        this.isDraggingProgress = false;
        this.syncUpdateTimeout = null;
        this.isRemoteUpdate = false;
        this.hasPlayedSinceConnection = false;
        this.processingReceivedData = false; // Flag to track when we're processing received data
        
        // Initialize components
        this.setupNetwork();
        this.setupUI();
        this.setupAudioPlayer();
        this.setupFileDrop();
        
        // Make it available globally (for convenience and debugging)
        window.radio = this;
        
        console.log('Radio application initialized successfully');
    }
    
    // Initialize DOM elements
    initElements() {
        // Identity elements
        this.usernameInput = document.getElementById('usernameInput');
        this.secretKeyInput = document.getElementById('secretKeyInput');
        this.generateKeyBtn = document.getElementById('generateKeyBtn');
        this.connectionStringDisplay = document.getElementById('connectionStringDisplay');
        this.copyConnectionStringBtn = document.getElementById('copyConnectionStringBtn');
        
        // Connection elements
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.connectForm = document.getElementById('connectForm');
        this.remoteConnectionString = document.getElementById('remoteConnectionString');
        this.submitConnectBtn = document.getElementById('submitConnectBtn');
        this.cancelConnectBtn = document.getElementById('cancelConnectBtn');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.peerList = document.getElementById('peerList');
        this.contactsList = document.getElementById('contactsList');
        
        // Audio player elements
        this.dropArea = document.getElementById('dropArea');
        this.fileInput = document.getElementById('fileInput');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
    }
    
    // Setup network and communication components
    setupNetwork() {
        if (!this.network || !this.comm) {
            console.error('Network or communication system not available');
            return;
        }
        
        // Load and display identity
        this.updateIdentityDisplay();
        
        // Register comm event handlers
        this.comm.setEventHandlers({
            onStatusChange: (status, details) => this.handleStatusChange(status, details),
            onPeerConnect: (peerId) => this.handlePeerConnect(peerId),
            onPeerDisconnect: (peerId) => this.handlePeerDisconnect(peerId),
            onMessage: (data, peerId, conn) => this.handleMessage(data, peerId, conn)
        });
        
        // Register network event handlers
        this.network.options.onIdentityUpdate = (identity) => this.handleIdentityUpdate(identity);
        this.network.options.onContactsUpdate = (contacts) => this.handleContactsUpdate(contacts);
        
        // Update connection status
        this.updateConnectionStatus();
        
        // Update connection lists
        this.updateConnectionList();
        this.updateContactsList();
    }
    
    // Update the identity display with current values
    updateIdentityDisplay() {
        const identity = this.network.getIdentity();
        
        // Update username field
        this.usernameInput.value = identity.username || '';
        
        // Update secret key field
        this.secretKeyInput.value = identity.secretKey || '';
        
        // Update connection string display
        this.connectionStringDisplay.value = this.network.getConnectionString();
    }
    
    // Update the connection status display
    updateConnectionStatus() {
        if (this.comm.initialized) {
            this.connectionStatus.textContent = 'Ready to connect';
        } else {
            this.connectionStatus.textContent = 'Initializing communication...';
        }
    }
    
    // Set up UI event listeners
    setupUI() {
        // Username field change
        this.usernameInput.addEventListener('input', () => {
            const username = this.usernameInput.value.trim();
            if (username) {
                // Update identity without forcing peer ID update
                this.network.updateIdentity({ username }, false);
                
                // Just update the connection string display
                this.connectionStringDisplay.value = this.network.getConnectionString();
            }
        });
        
        // Generate new secret key (this does need to force a reconnect)
        this.generateKeyBtn.addEventListener('click', () => {
            if (confirm("Generating a new secret key will disconnect you from any current peers. Continue?")) {
                const secretKey = this.network.generateSecretKey();
                // Update with force flag to ensure peer ID updates
                this.network.updateIdentity({ secretKey }, true);
            }
        });
        
        // Copy connection string
        this.copyConnectionStringBtn.addEventListener('click', () => {
            const connectionString = this.connectionStringDisplay.value;
            if (connectionString) {
                navigator.clipboard.writeText(connectionString)
                    .then(() => {
                        // Show a temporary success message
                        const originalText = this.copyConnectionStringBtn.innerHTML;
                        this.copyConnectionStringBtn.innerHTML = '<span class="material-icons">check</span>';
                        setTimeout(() => {
                            this.copyConnectionStringBtn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => console.error('Could not copy text: ', err));
            }
        });
        
        // Connect button
        this.connectBtn.addEventListener('click', () => {
            this.connectForm.classList.remove('hidden');
        });
        
        // Submit connection
        this.submitConnectBtn.addEventListener('click', () => {
            const connectionString = this.remoteConnectionString.value.trim();
            if (connectionString) {
                this.network.connectToPeer(connectionString)
                    .catch(err => {
                        console.error('Connection error:', err);
                        this.connectionStatus.textContent = 'Connection error: ' + err.message;
                    });
                this.connectForm.classList.add('hidden');
            } else {
                alert('Please enter a valid connection string (username:secretkey)');
            }
        });
        
        // Cancel connection
        this.cancelConnectBtn.addEventListener('click', () => {
            this.connectForm.classList.add('hidden');
            this.remoteConnectionString.value = '';
        });
        
        // Disconnect button
        this.disconnectBtn.addEventListener('click', () => {
            this.comm.disconnectAll();
        });
        
        // Connect file input to drop area
        this.dropArea.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        this.fileInput.addEventListener('change', () => {
            this.handleFiles(this.fileInput.files);
        });
    }
    
    // Handle identity updates
    handleIdentityUpdate(identity) {
        console.log('Identity updated:', identity);
        this.updateIdentityDisplay();
    }
    
    // Handle contacts updates
    handleContactsUpdate(contacts) {
        console.log('Contacts updated:', contacts);
        this.updateContactsList();
    }
    
    // Update the contacts list display
    updateContactsList() {
        const contacts = this.network.getContacts();
        
        if (contacts.length === 0) {
            this.contactsList.innerHTML = '<li>No saved contacts</li>';
            return;
        }
        
        this.contactsList.innerHTML = '';
        
        contacts.forEach(contact => {
            const li = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = contact.username || contact.peerId;
            li.appendChild(nameSpan);
            
            const actionsDiv = document.createElement('div');
            
            const connectBtn = document.createElement('button');
            connectBtn.textContent = 'Connect';
            connectBtn.classList.add('secondary');
            connectBtn.addEventListener('click', () => {
                this.network.connectToPeer(contact.peerId)
                    .catch(err => {
                        console.error('Connection error:', err);
                        this.connectionStatus.textContent = 'Connection error: ' + err.message;
                    });
            });
            actionsDiv.appendChild(connectBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('danger');
            deleteBtn.addEventListener('click', () => {
                this.network.removeContact(contact.peerId);
            });
            actionsDiv.appendChild(deleteBtn);
            
            li.appendChild(actionsDiv);
            this.contactsList.appendChild(li);
        });
    }
    
    // Setup file drop functionality
    setupFileDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, () => this.highlight(), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, () => this.unhighlight(), false);
        });
        
        // Handle dropped files
        this.dropArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }
    
    // Set up audio player event handlers
    setupAudioPlayer() {
        // Audio element event handlers
        this.audioPlayer.addEventListener('play', () => this.updatePlayPauseButton(true));
        this.audioPlayer.addEventListener('pause', () => this.updatePlayPauseButton(false));
        this.audioPlayer.addEventListener('ended', () => this.handleAudioEnded());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgressBar());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Volume control
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        this.volumeIcon.addEventListener('click', () => this.toggleMute());
        
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Progress bar events
        this.progressContainer.addEventListener('mousedown', (e) => this.startDraggingProgress(e));
        document.addEventListener('mousemove', (e) => this.dragProgress(e));
        document.addEventListener('mouseup', () => this.stopDraggingProgress());
        this.progressContainer.addEventListener('click', (e) => this.seekToPosition(e));
    }
    
    // Handle comm status changes
    handleStatusChange(status, details) {
        console.log('Comm status:', status, details);
        
        switch (status) {
            case 'ready':
                this.connectionStatus.textContent = 'Ready to connect';
                break;
                
            case 'connecting':
                this.connectionStatus.textContent = 'Connecting to peer...';
                break;
                
            case 'connected':
                this.connectionStatus.textContent = 'Connected to peer';
                this.disconnectBtn.disabled = false;
                this.updateConnectionList();
                break;
                
            case 'disconnected':
                if (this.comm.getConnectedPeers().length === 0) {
                    this.connectionStatus.textContent = 'Disconnected';
                    this.disconnectBtn.disabled = true;
                } else {
                    this.updateConnectionList();
                }
                break;
                
            case 'error':
                this.connectionStatus.textContent = 'Error: ' + (details.error ? details.error.message : 'Unknown error');
                break;
                
            case 'closed':
                this.connectionStatus.textContent = 'Connection closed';
                this.disconnectBtn.disabled = true;
                break;
                
            default:
                this.connectionStatus.textContent = status;
        }
    }
    
    // Handle PeerComm status changes
    handlePeerConnect(peerId) {
        this.updateConnectionList();
        
        // Reset the flag when a new connection is made
        this.hasPlayedSinceConnection = false;
        
        // Send current playing state if we have a song
        if (this.currentAudioFile) {
            console.log(`New peer ${peerId} connected, sending current song`);
            // Small delay to ensure connection is fully established before sending large file
            setTimeout(() => {
                this.sendCurrentSong(peerId);
                // We'll wait for the file_received acknowledgment before sending playback state
            }, 200);
        }
    }
    
    // Handle peer disconnection
    handlePeerDisconnect(peerId) {
        this.updateConnectionList();
        
        if (this.comm.getConnectedPeers().length === 0) {
            this.disconnectBtn.disabled = true;
        }
    }
    
    // Update connection list in UI
    updateConnectionList() {
        const peers = this.comm.getConnectedPeers();
        
        if (peers.length === 0) {
            this.peerList.innerHTML = '<li>No connections</li>';
            return;
        }
        
        this.peerList.innerHTML = '';
        peers.forEach(peerId => {
            // Extract username from the peer ID format: radio-{secretKey}-{username}
            let username = peerId;
            if (peerId.startsWith('radio-')) {
                const parts = peerId.split('-');
                if (parts.length >= 3) {
                    // The username is everything after the second dash
                    username = parts.slice(2).join('-');
                }
            }
            
            const item = document.createElement('li');
            item.textContent = username;
            this.peerList.appendChild(item);
        });
    }
    
    // Handle incoming messages
    handleMessage(data, peerId, conn) {
        console.log('Received data type:', data.type, 'from:', peerId);
        
        // Set flag to indicate we're processing external data
        this.processingReceivedData = true;
        
        try {
            if (data.type === 'song') {
                // Peer is sharing a new song - always accept and swap
                this.receiveSong(data, peerId);
            } else if (data.type === 'playback') {
                // Peer is syncing playback state
                this.receivePlaybackState(data, peerId);
            } else if (data.type === 'request_playback') {
                // Peer is requesting current playback state
                if (this.audioPlayer.src) {
                    this.sendPlaybackState(peerId);
                }
            } else if (data.type === 'file_received') {
                // Peer has received and loaded our file, now we can send playback state
                console.log(`Peer ${peerId} has loaded our song, sending playback state`);
                this.sendPlaybackState(peerId);
            }
        } finally {
            // Always reset the flag when done
            setTimeout(() => {
                this.processingReceivedData = false;
            }, 100);
        }
    }
    
    // Load an audio file
    loadAudioFile(file, shouldAutoplay = true, isFromPeer = false) {
        this.currentAudioFile = file;
        
        // Create a URL for the file
        const fileURL = URL.createObjectURL(file);
        
        // Set audio source
        this.audioPlayer.src = fileURL;
        this.audioPlayer.load();
        
        // Update UI with source info
        this.updateSongInfo(file, isFromPeer);
        
        // Auto-play and sync with peers only if explicitly requested
        if (shouldAutoplay) {
            this.audioPlayer.play()
                .then(() => {
                    if (!isFromPeer) {
                        // Only broadcast if this is a local song (not received from a peer)
                        this.broadcastNewSong(file);
                    }
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                });
        }
    }
    
    // Update song info display
    updateSongInfo(file, isFromPeer = false) {
        // Extract filename without extension
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        this.songTitle.textContent = fileName;
        this.songArtist.textContent = isFromPeer ? 'From peer' : 'Local file';
    }
    
    // Update play/pause button
    updatePlayPauseButton(isPlaying) {
        this.playPauseBtn.innerHTML = isPlaying ? 
            '<span class="material-icons">pause</span>' : 
            '<span class="material-icons">play_arrow</span>';
            
        // Only broadcast if this is a local change, not a remote update
        if (!this.isRemoteUpdate) {
            this.broadcastPlaybackState();
        }
    }
    
    // Toggle play/pause
    togglePlayPause() {
        if (this.audioPlayer.paused) {
            // If we're connected and this is the first play after connecting,
            // request playback state from peers first
            if (this.comm.getConnectedPeers().length > 0 && !this.hasPlayedSinceConnection) {
                // Set UI to loading state
                this.connectionStatus.textContent = 'Syncing with connected peers...';
                this.requestPlaybackState();
                
                // Set a small delay to allow time for response
                setTimeout(() => {
                    // Only autoplay if we haven't received any updates from peers
                    if (!this.hasPlayedSinceConnection) {
                        this.hasPlayedSinceConnection = true;
                        this.audioPlayer.play().catch(console.error);
                    }
                }, 500); // Increased timeout to give more time for response
            } else {
                this.audioPlayer.play().catch(console.error);
            }
        } else {
            this.audioPlayer.pause();
        }
    }
    
    // Progress bar dragging
    startDraggingProgress(e) {
        this.isDraggingProgress = true;
        this.seekToPosition(e);
    }
    
    dragProgress(e) {
        if (this.isDraggingProgress) {
            this.seekToPosition(e);
        }
    }
    
    stopDraggingProgress() {
        if (this.isDraggingProgress) {
            this.isDraggingProgress = false;
            this.broadcastPlaybackState();
        }
    }
    
    // Seek to position in audio
    seekToPosition(e) {
        if (!this.audioPlayer.duration) return;
        
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const seekTime = pos * this.audioPlayer.duration;
        
        // Set the flag to indicate this is a local update
        this.isRemoteUpdate = false;
        this.audioPlayer.currentTime = seekTime;
        this.updateProgressBar();
    }
    
    // Update progress bar and time display
    updateProgressBar() {
        if (!this.audioPlayer.duration) return;
        
        const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.progressBar.style.width = percentage + '%';
        
        this.currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
    }
    
    // Update duration display
    updateDuration() {
        this.duration.textContent = this.formatTime(this.audioPlayer.duration);
    }
    
    // Format time in MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Volume controls
    updateVolume() {
        this.audioPlayer.volume = this.volumeSlider.value;
        this.updateVolumeIcon();
    }
    
    updateVolumeIcon() {
        if (this.audioPlayer.volume === 0) {
            this.volumeIcon.textContent = 'volume_off';
        } else if (this.audioPlayer.volume < 0.5) {
            this.volumeIcon.textContent = 'volume_down';
        } else {
            this.volumeIcon.textContent = 'volume_up';
        }
    }
    
    toggleMute() {
        if (this.audioPlayer.volume > 0) {
            this.audioPlayer.volume = 0;
            this.volumeSlider.value = 0;
        } else {
            this.audioPlayer.volume = 1;
            this.volumeSlider.value = 1;
        }
        this.updateVolumeIcon();
    }
    
    // Handle audio ended event
    handleAudioEnded() {
        // Optional: implement playlist functionality here
    }
    
    // Send current song to a new peer
    sendCurrentSong(peerId) {
        if (!this.currentAudioFile) return;
        
        this.connectionStatus.textContent = 'Sending current song to new peer...';
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            
            // Use sendOpen to create an open message that will be relayed
            this.comm.sendOpen(peerId, {
                type: 'song',
                name: this.currentAudioFile.name,
                fileType: this.currentAudioFile.type,
                data: arrayBuffer,
                initialPosition: this.audioPlayer.currentTime,
                duration: this.audioPlayer.duration,
                isPlaying: !this.audioPlayer.paused
            });
            
            this.connectionStatus.textContent = 'Song sent to peer';
        };
        
        reader.readAsArrayBuffer(this.currentAudioFile);
    }
    
    // Broadcast new song to all peers
    broadcastNewSong(file) {
        if (this.comm.getConnectedPeers().length === 0) return;
        
        // Show status message while uploading
        this.connectionStatus.textContent = 'Uploading song to peers...';
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            
            // Use broadcastOpen to create an open message that will be relayed
            const sentCount = this.comm.broadcastOpen({
                type: 'song',
                name: file.name,
                fileType: file.type,
                data: arrayBuffer,
                initialPosition: this.audioPlayer.currentTime,
                duration: this.audioPlayer.duration,
                isPlaying: !this.audioPlayer.paused
            });
            
            if (sentCount > 0) {
                this.connectionStatus.textContent = `Song sent to ${sentCount} peer(s)`;
            } else {
                this.connectionStatus.textContent = 'Connected';
            }
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // Receive song from peer
    receiveSong(data, senderPeerId) {
        // Show status message while loading
        this.connectionStatus.textContent = 'Receiving new song...';
        this.songTitle.textContent = 'Loading: ' + data.name;
        
        const blob = new Blob([data.data], { type: data.fileType });
        const file = new File([blob], data.name, { type: data.fileType });
        
        // Load received file
        this.loadAudioFile(file, false, true);
        
        // Once the file is loaded, notify the sender and set playback state
        this.audioPlayer.addEventListener('loadeddata', () => {
            console.log(`Song loaded, notifying sender ${senderPeerId}`);
            
            // Send acknowledgment that we've received and loaded the file
            this.comm.sendClosed(senderPeerId, {
                type: 'file_received',
                fileName: data.name
            });
            
            // Set playback position if provided
            if (data.initialPosition !== undefined) {
                this.audioPlayer.currentTime = data.initialPosition;
            }
            
            // Match play state if provided
            if (data.isPlaying) {
                this.isRemoteUpdate = true;
                this.hasPlayedSinceConnection = true;
                this.audioPlayer.play()
                    .then(() => {
                        this.connectionStatus.textContent = 'Playing song from peer';
                        setTimeout(() => this.isRemoteUpdate = false, 50);
                    })
                    .catch(error => {
                        console.error('Error auto-playing received song:', error);
                        this.connectionStatus.textContent = 'Click play to start received song';
                        this.isRemoteUpdate = false;
                    });
            } else {
                this.connectionStatus.textContent = 'Received song from peer';
            }
            
            // Remove this one-time listener
            this.audioPlayer.removeEventListener('loadeddata', arguments.callee);
        });
        
        // Update song display to show it's from a peer
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        this.songTitle.textContent = fileName;
        this.songArtist.textContent = 'From peer';
    }
    
    // Send current playback state to a specific peer
    sendPlaybackState(peerId) {
        if (!this.audioPlayer.src) return;
        
        console.log(`Sending playback state to ${peerId}: time=${this.audioPlayer.currentTime.toFixed(2)}, playing=${!this.audioPlayer.paused}`);
        
        // Use sendOpen to create an open message that will be relayed
        this.comm.sendOpen(peerId, {
            type: 'playback',
            isPlaying: !this.audioPlayer.paused,
            currentTime: this.audioPlayer.currentTime,
            duration: this.audioPlayer.duration
        });
    }
    
    // Broadcast playback state to all peers
    broadcastPlaybackState() {
        // Don't broadcast if this is a remote update or we're processing received data
        if (this.isRemoteUpdate || this.processingReceivedData) return;
        
        // Clear any pending updates
        if (this.syncUpdateTimeout) {
            clearTimeout(this.syncUpdateTimeout);
        }
        
        // Add small delay to prevent too frequent updates
        this.syncUpdateTimeout = setTimeout(() => {
            if (!this.audioPlayer.src || this.comm.getConnectedPeers().length === 0) return;
            
            // Use broadcastOpen to create an open message that will be relayed
            this.comm.broadcastOpen({
                type: 'playback',
                isPlaying: !this.audioPlayer.paused,
                currentTime: this.audioPlayer.currentTime,
                duration: this.audioPlayer.duration
            });
            
            this.syncUpdateTimeout = null;
        }, 200);
    }
    
    // Receive and apply playback state from peer
    receivePlaybackState(data, senderPeerId) {
        if (!this.audioPlayer.src) return;
        
        console.log(`Received playback state from ${senderPeerId}: time=${data.currentTime.toFixed(2)}, playing=${data.isPlaying}`);
        
        // Set flag to indicate we're applying a remote update
        this.isRemoteUpdate = true;
        
        // Always set time position when receiving a playback state update
        this.audioPlayer.currentTime = data.currentTime;
        
        // Match play/pause state
        if (data.isPlaying && this.audioPlayer.paused) {
            // Ensure we mark that we've played since connection to avoid re-requests
            this.hasPlayedSinceConnection = true;
            this.audioPlayer.play().catch(err => {
                console.error('Error playing after remote update:', err);
                this.isRemoteUpdate = false;
            });
        } else if (!data.isPlaying && !this.audioPlayer.paused) {
            this.audioPlayer.pause();
        }
        
        // Reset the flag after a short delay to allow events to process
        setTimeout(() => {
            this.isRemoteUpdate = false;
        }, 50);
    }
    
    // Request playback state from peers
    requestPlaybackState() {
        console.log('Requesting playback state from all peers');
        
        // Use broadcastClosed since this is just a request and shouldn't be relayed
        this.comm.broadcastClosed({
            type: 'request_playback'
        });
        
        // Set the flag to true since we've requested sync
        this.hasPlayedSinceConnection = true;
    }
    
    // Prevent default drag behaviors
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area
    highlight() {
        this.dropArea.classList.add('highlight');
    }
    
    // Unhighlight drop area
    unhighlight() {
        this.dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }
    
    // Handle selected files
    handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('audio/')) {
                this.loadAudioFile(file);
            } else {
                alert('Please select an audio file.');
            }
        }
    }
}

// Initialize the radio app when the system is ready
window.system.addEventListener('system:ready', () => {
    new Radio();
}); 