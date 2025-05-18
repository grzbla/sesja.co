/**
 * PeerComm - A general-purpose WebRTC peer communication system
 * Based on PeerJS for simplified WebRTC connections
 */
class PeerComm {
    /**
     * Create a new PeerComm instance
     * @param {Object} options - Configuration options
     * @param {string} options.peerId - Optional specific peer ID (random if not provided)
     * @param {Object} options.peerOptions - PeerJS configuration options
     * @param {Function} options.onStatusChange - Status change callback (status, details)
     * @param {Function} options.onPeerConnect - Called when a peer connects (peerId)
     * @param {Function} options.onPeerDisconnect - Called when a peer disconnects (peerId)
     * @param {Function} options.onMessage - Called when a message is received (data, peerId, conn)
     */
    constructor(options = {}) {
        this.options = {
            peerId: null,
            peerOptions: {
                debug: 2,
                config: {
                    'iceServers': [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                }
            },
            onStatusChange: () => {},
            onPeerConnect: () => {},
            onPeerDisconnect: () => {},
            onMessage: () => {},
            ...options
        };
        
        this.peer = null;
        this.peerId = null;
        this.connections = [];
        this.initialized = false;
        
        // Initialize if autostart is true
        if (options.autoStart !== false) {
            this.initialize();
        }
    }
    
    /**
     * Initialize the peer connection
     * @returns {Promise} Resolves when peer is initialized
     */
    initialize() {
        if (this.initialized) return Promise.resolve(this.peerId);
        
        return new Promise((resolve, reject) => {
            try {
                // Generate or use provided peer ID
                const peerId = this.options.peerId || this.generateId();
                
                // Create peer
                this.peer = new Peer(peerId, this.options.peerOptions);
                
                // Handle peer open event
                this.peer.on('open', (id) => {
                    this.peerId = id;
                    this.initialized = true;
                    this.options.onStatusChange('ready', { id });
                    resolve(id);
                });
                
                // Handle incoming connections
                this.peer.on('connection', (conn) => {
                    this._handleConnection(conn);
                });
                
                // Handle errors
                this.peer.on('error', (err) => {
                    this.options.onStatusChange('error', { error: err });
                    
                    // Only reject the promise if it's an initialization error
                    if (!this.initialized) {
                        reject(err);
                    }
                });
                
                // Handle disconnection
                this.peer.on('disconnected', () => {
                    this.options.onStatusChange('disconnected');
                });
                
                // Handle close
                this.peer.on('close', () => {
                    this.initialized = false;
                    this.options.onStatusChange('closed');
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    
    /**
     * Generate a random peer ID
     * @returns {string} Random ID
     */
    generateId() {
        return 'peer-' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Get the current peer ID
     * @returns {string} Peer ID
     */
    getPeerId() {
        return this.peerId;
    }
    
    /**
     * Get the current peer ID - Alias for getPeerId for backward compatibility
     * @returns {string} Peer ID
     * @deprecated Use getPeerId() instead
     */
    getId() {
        return this.getPeerId();
    }
    
    /**
     * Get list of connected peers
     * @returns {Array} Array of peer IDs
     */
    getConnectedPeers() {
        return this.connections.map(conn => conn.peer);
    }
    
    /**
     * Connect to another peer
     * @param {string} peerId - ID of peer to connect to
     * @returns {Promise} Resolves when connected
     */
    connect(peerId) {
        if (!this.initialized) {
            return Promise.reject(new Error('PeerComm not initialized'));
        }
        
        this.options.onStatusChange('connecting', { peerId });
        
        return new Promise((resolve, reject) => {
            try {
                const conn = this.peer.connect(peerId, {
                    reliable: true
                });
                
                // Set up timeout for connection attempt
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);
                
                // Handle connection open
                conn.on('open', () => {
                    clearTimeout(timeout);
                    this._handleConnection(conn);
                    resolve(conn);
                });
                
                // Handle connection error
                conn.on('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    
    /**
     * Handle new connection (both incoming and outgoing)
     * @param {Object} conn - PeerJS connection object
     * @private
     */
    _handleConnection(conn) {
        // Add to connections list
        this.connections.push(conn);
        
        // Notify connection
        this.options.onStatusChange('connected', { peerId: conn.peer });
        this.options.onPeerConnect(conn.peer, conn);
        
        // Set up event handlers
        conn.on('data', (data) => {
            this._handleData(data, conn);
        });
        
        conn.on('close', () => {
            this._removeConnection(conn.peer);
        });
        
        conn.on('error', (err) => {
            this.options.onStatusChange('connection-error', { peerId: conn.peer, error: err });
        });
    }
    
    /**
     * Remove connection from list
     * @param {string} peerId - ID of peer to remove
     * @private
     */
    _removeConnection(peerId) {
        const index = this.connections.findIndex(c => c.peer === peerId);
        
        if (index !== -1) {
            this.connections.splice(index, 1);
            this.options.onStatusChange('disconnected', { peerId });
            this.options.onPeerDisconnect(peerId);
        }
    }
    
    /**
     * Handle incoming data
     * @param {Object} data - Data received
     * @param {Object} conn - Connection the data was received on
     * @private
     */
    _handleData(data, conn) {
        // Check if this is a private message (should not be passed to application)
        const isPrivate = data._private === true;
        
        // If not private, pass to application callback
        if (!isPrivate) {
            this.options.onMessage(data, conn.peer, conn);
        }
        
        // Handle automatic message relaying for open messages
        // Open messages have openRelay=true and have not been relayed yet
        if (data.openRelay === true && !data._relayed) {
            this._relayToOtherPeers(data, conn.peer);
        }
        
        // Legacy support for old relay property
        else if (data.relay === true && !data.relayed && !data._relayed) {
            this._relayToOtherPeers(data, conn.peer);
        }
    }
    
    /**
     * Relay data to all peers except the source
     * @param {Object} data - Data to relay
     * @param {string} sourcePeerId - ID of peer who sent the original data
     * @returns {number} Number of peers the data was relayed to
     * @private
     */
    _relayToOtherPeers(data, sourcePeerId) {
        // Get all peers except the sender
        const otherPeers = this.getConnectedPeers().filter(peerId => peerId !== sourcePeerId);
        
        if (otherPeers.length > 0) {
            console.log(`Relaying ${data.type || 'message'} to ${otherPeers.length} other peers`);
            
            // Mark as relayed to prevent infinite loops (support both old and new flags)
            const relayData = { 
                ...data, 
                _relayed: true,
                relayed: true 
            };
            
            // Send to each peer
            let sentCount = 0;
            otherPeers.forEach(peerId => {
                if (this.send(peerId, relayData)) {
                    sentCount++;
                }
            });
            
            return sentCount;
        }
        
        return 0;
    }
    
    /**
     * Create an open message that will be automatically relayed to other peers
     * @param {Object} data - The message data
     * @returns {Object} The message with relay flags set
     */
    createOpenMessage(data) {
        return {
            ...data,
            openRelay: true,
            _relayed: false
        };
    }
    
    /**
     * Create a closed message that will not be relayed to other peers
     * @param {Object} data - The message data
     * @returns {Object} The message with relay explicitly disabled
     */
    createClosedMessage(data) {
        return {
            ...data,
            openRelay: false
        };
    }
    
    /**
     * Send an open message to a specific peer (will be relayed to other peers)
     * @param {string} peerId - ID of peer to send to
     * @param {Object} data - Data to send
     * @returns {boolean} Success
     */
    sendOpen(peerId, data) {
        return this.send(peerId, this.createOpenMessage(data));
    }
    
    /**
     * Send a closed message to a specific peer (will not be relayed)
     * @param {string} peerId - ID of peer to send to
     * @param {Object} data - Data to send
     * @returns {boolean} Success
     */
    sendClosed(peerId, data) {
        return this.send(peerId, this.createClosedMessage(data));
    }
    
    /**
     * Broadcast an open message to all connected peers (will be relayed)
     * @param {Object} data - Data to broadcast
     * @param {Array} exclude - Array of peer IDs to exclude
     * @returns {number} Number of peers the data was sent to
     */
    broadcastOpen(data, exclude = []) {
        return this.broadcast(this.createOpenMessage(data), exclude);
    }
    
    /**
     * Broadcast a closed message to all connected peers (will not be relayed)
     * @param {Object} data - Data to broadcast
     * @param {Array} exclude - Array of peer IDs to exclude
     * @returns {number} Number of peers the data was sent to
     */
    broadcastClosed(data, exclude = []) {
        return this.broadcast(this.createClosedMessage(data), exclude);
    }
    
    /**
     * Send data to a specific peer
     * @param {string} peerId - ID of peer to send to
     * @param {Object} data - Data to send
     * @returns {boolean} Success
     */
    send(peerId, data) {
        const conn = this.connections.find(c => c.peer === peerId);
        
        if (conn && conn.open) {
            conn.send(data);
            return true;
        }
        
        return false;
    }
    
    /**
     * Broadcast data to all connected peers
     * @param {Object} data - Data to broadcast
     * @param {Array} exclude - Array of peer IDs to exclude
     * @returns {number} Number of peers the data was sent to
     */
    broadcast(data, exclude = []) {
        let sentCount = 0;
        
        this.connections.forEach(conn => {
            if (conn.open && !exclude.includes(conn.peer)) {
                conn.send(data);
                sentCount++;
            }
        });
        
        return sentCount;
    }
    
    /**
     * Disconnect from a specific peer
     * @param {string} peerId - ID of peer to disconnect from
     * @returns {boolean} Success
     */
    disconnectFrom(peerId) {
        const conn = this.connections.find(c => c.peer === peerId);
        
        if (conn) {
            conn.close();
            this._removeConnection(peerId);
            return true;
        }
        
        return false;
    }
    
    /**
     * Disconnect from all peers
     */
    disconnectAll() {
        this.connections.forEach(conn => {
            conn.close();
        });
        
        this.connections = [];
        this.options.onStatusChange('disconnected-all');
    }
    
    /**
     * Completely destroy the peer connection
     */
    destroy() {
        if (this.peer) {
            this.disconnectAll();
            this.peer.destroy();
            this.peer = null;
            this.initialized = false;
            this.peerId = null;
        }
    }
    
    /**
     * Set or update event handlers
     * @param {Object} handlers - Event handlers to set
     * @param {Function} handlers.onStatusChange - Status change callback (status, details)
     * @param {Function} handlers.onPeerConnect - Called when a peer connects (peerId)
     * @param {Function} handlers.onPeerDisconnect - Called when a peer disconnects (peerId)
     * @param {Function} handlers.onMessage - Called when a message is received (data, peerId, conn)
     */
    setEventHandlers(handlers = {}) {
        // Update event handlers, but keep existing ones if not provided
        if (handlers.onStatusChange) this.options.onStatusChange = handlers.onStatusChange;
        if (handlers.onPeerConnect) this.options.onPeerConnect = handlers.onPeerConnect;
        if (handlers.onPeerDisconnect) this.options.onPeerDisconnect = handlers.onPeerDisconnect;
        if (handlers.onMessage) this.options.onMessage = handlers.onMessage;
        
        return this;
    }
}

// Export the class for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeerComm;
} 