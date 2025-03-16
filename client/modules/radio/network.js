/**
 * Network.js - Contact management and network identity system
 * Integrates with PeerComm for WebRTC communication
 * Uses localforage for persistent storage of contacts and identity
 */

class NetworkManager {
    /**
     * Create a new NetworkManager instance
     * @param {Object} options - Configuration options
     * @param {Object} options.comm - PeerComm instance
     * @param {Function} options.onContactsUpdate - Called when contact list updates
     * @param {Function} options.onIdentityUpdate - Called when local identity updates
     */
    constructor(options = {}) {
        this.options = {
            onContactsUpdate: () => {},
            onIdentityUpdate: () => {},
            ...options
        };
        
        this.comm = options.comm || null;
        this.contacts = [];
        this.identity = {
            username: 'User-' + Math.floor(Math.random() * 1000),
            secretKey: this.generateSecretKey(),
            displayName: ''
        };
        
        // Flag to track if the network is fully initialized
        this.initialized = false;
        this.originalPeerId = null;
        
        // Storage keys
        this.STORAGE_KEYS = {
            CONTACTS: 'radio_contacts',
            IDENTITY: 'radio_identity'
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the network manager
     */
    async init() {
        console.log('Initializing network manager...');
        
        // Check if localforage is available
        if (typeof localforage === 'undefined') {
            console.error('LocalForage is required but not loaded');
            await this.loadLocalForage();
        }
        
        // Load identity and contacts
        await this.loadIdentity();
        await this.loadContacts();
        
        // Set up the comm instance if available
        if (this.comm) {
            this.setupComm(this.comm);
        }
        
        console.log('Network manager initialized');
        this.initialized = true;
    }
    
    /**
     * Load LocalForage library if not available
     */
    loadLocalForage() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Set up communication with the PeerComm instance
     * @param {Object} comm - PeerComm instance
     */
    setupComm(comm) {
        this.comm = comm;
        
        // Generate peer ID based on the format: radio-{secretKey}-{username}
        const peerId = this.generatePeerId();
        this.originalPeerId = peerId; // Store the original peer ID
        
        // Update the comm peer ID if it's different
        if (this.comm.getPeerId() !== peerId) {
            // We need to reconnect with the new ID
            this.updateCommPeerId(peerId);
        }
    }
    
    /**
     * Update the comm instance's peer ID
     * @param {string} peerId - New peer ID
     */
    updateCommPeerId(peerId) {
        // If comm is already initialized, we need to destroy and recreate it
        if (this.comm.initialized) {
            this.comm.destroy();
        }
        
        // Reinitialize with new ID
        this.comm.options.peerId = peerId;
        this.comm.initialize();
    }
    
    /**
     * Generate a peer ID based on the current identity
     * @returns {string} Peer ID in format 'radio-{secretKey}-{username}'
     */
    generatePeerId() {
        return `radio-${this.identity.secretKey}-${this.identity.username}`;
    }
    
    /**
     * Generate a random secret key
     * @returns {string} Random secret key
     */
    generateSecretKey() {
        return Math.random().toString(36).substring(2, 10);
    }
    
    /**
     * Load identity from storage
     */
    async loadIdentity() {
        try {
            const storedIdentity = await localforage.getItem(this.STORAGE_KEYS.IDENTITY);
            
            if (storedIdentity) {
                this.identity = {
                    ...this.identity,
                    ...storedIdentity
                };
                console.log('Identity loaded from storage', this.identity);
            } else {
                // Save the default identity
                await this.saveIdentity();
            }
            
            // Notify of identity update
            this.options.onIdentityUpdate(this.identity);
            
        } catch (error) {
            console.error('Error loading identity:', error);
        }
    }
    
    /**
     * Save identity to storage
     */
    async saveIdentity() {
        try {
            await localforage.setItem(this.STORAGE_KEYS.IDENTITY, this.identity);
            console.log('Identity saved to storage');
            
            // Notify of identity update
            this.options.onIdentityUpdate(this.identity);
            
            // Update peer ID if comm is available and we're not yet initialized
            // This prevents reconnection when simply changing the username after initialization
            if (this.comm && !this.initialized) {
                this.updateCommPeerId(this.generatePeerId());
            }
            
        } catch (error) {
            console.error('Error saving identity:', error);
        }
    }
    
    /**
     * Update identity properties
     * @param {Object} identityData - Identity data to update
     * @param {boolean} forceUpdatePeerId - Whether to force a peer ID update even after initialization
     */
    async updateIdentity(identityData, forceUpdatePeerId = false) {
        this.identity = {
            ...this.identity,
            ...identityData
        };
        
        // Check if we need to update the peer ID
        // Only update if:
        // 1. Not yet initialized OR
        // 2. Secret key was changed OR 
        // 3. Force update is requested
        const shouldUpdatePeerId = !this.initialized || 
                                   identityData.secretKey !== undefined ||
                                   forceUpdatePeerId;
        
        await this.saveIdentity();
        
        // Update the peer ID if needed
        if (shouldUpdatePeerId && this.comm) {
            const newPeerId = this.generatePeerId();
            this.originalPeerId = newPeerId;
            this.updateCommPeerId(newPeerId);
        }
        
        return this.identity;
    }
    
    /**
     * Load contacts from storage
     */
    async loadContacts() {
        try {
            const storedContacts = await localforage.getItem(this.STORAGE_KEYS.CONTACTS);
            
            if (storedContacts && Array.isArray(storedContacts)) {
                this.contacts = storedContacts;
                console.log('Contacts loaded from storage', this.contacts);
            }
            
            // Notify of contacts update
            this.options.onContactsUpdate(this.contacts);
            
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }
    
    /**
     * Save contacts to storage
     */
    async saveContacts() {
        try {
            await localforage.setItem(this.STORAGE_KEYS.CONTACTS, this.contacts);
            console.log('Contacts saved to storage');
            
            // Notify of contacts update
            this.options.onContactsUpdate(this.contacts);
            
        } catch (error) {
            console.error('Error saving contacts:', error);
        }
    }
    
    /**
     * Add a contact
     * @param {Object} contact - Contact to add
     */
    async addContact(contact) {
        // Check if contact already exists
        const index = this.contacts.findIndex(c => c.peerId === contact.peerId);
        
        if (index === -1) {
            // New contact
            this.contacts.push(contact);
        } else {
            // Update existing contact
            this.contacts[index] = {
                ...this.contacts[index],
                ...contact
            };
        }
        
        await this.saveContacts();
        return this.contacts;
    }
    
    /**
     * Remove a contact
     * @param {string} peerId - Peer ID of contact to remove
     */
    async removeContact(peerId) {
        const index = this.contacts.findIndex(c => c.peerId === peerId);
        
        if (index !== -1) {
            this.contacts.splice(index, 1);
            await this.saveContacts();
        }
        
        return this.contacts;
    }
    
    /**
     * Get all contacts
     * @returns {Array} Contacts list
     */
    getContacts() {
        return this.contacts;
    }
    
    /**
     * Get a contact by peer ID
     * @param {string} peerId - Peer ID
     * @returns {Object|null} Contact or null if not found
     */
    getContact(peerId) {
        return this.contacts.find(c => c.peerId === peerId) || null;
    }
    
    /**
     * Parse a connection string (username:secretkey)
     * @param {string} connectionString - Connection string to parse
     * @returns {Object|null} Parsed connection info or null if invalid
     */
    parseConnectionString(connectionString) {
        // Check if it's already a peer ID
        if (connectionString.startsWith('radio-')) {
            return { peerId: connectionString };
        }
        
        // Try to parse as username:secretkey
        const parts = connectionString.split(':');
        
        if (parts.length === 2) {
            const [username, secretKey] = parts;
            const peerId = `radio-${secretKey}-${username}`;
            
            return {
                username,
                secretKey,
                peerId
            };
        }
        
        return null;
    }
    
    /**
     * Connect to a peer using a connection string
     * @param {string} connectionString - Connection string (username:secretkey or peer ID)
     * @returns {Promise} Resolves with connection or rejects with error
     */
    async connectToPeer(connectionString) {
        if (!this.comm) {
            return Promise.reject(new Error('Communication system not available'));
        }
        
        const connectionInfo = this.parseConnectionString(connectionString);
        
        if (!connectionInfo) {
            return Promise.reject(new Error('Invalid connection string'));
        }
        
        try {
            // Connect to the peer
            const conn = await this.comm.connect(connectionInfo.peerId);
            
            // Add to contacts if not already in the list
            if (!this.getContact(connectionInfo.peerId)) {
                await this.addContact({
                    peerId: connectionInfo.peerId,
                    username: connectionInfo.username || '',
                    dateAdded: new Date().toISOString()
                });
            }
            
            return conn;
        } catch (error) {
            console.error('Error connecting to peer:', error);
            throw error;
        }
    }
    
    /**
     * Get the local identity
     * @returns {Object} Local identity
     */
    getIdentity() {
        return this.identity;
    }
    
    /**
     * Get the original peer ID that was generated at initialization
     * @returns {string} Original peer ID
     */
    getOriginalPeerId() {
        return this.originalPeerId || this.generatePeerId();
    }
    
    /**
     * Get the connection string for current identity
     * @returns {string} Connection string (username:secretkey)
     */
    getConnectionString() {
        // If we're already initialized, use the original peer ID's secret key
        // with the current username for display purposes only
        if (this.initialized && this.originalPeerId) {
            // Extract the secret key from the original peer ID
            const parts = this.originalPeerId.split('-');
            if (parts.length >= 3) {
                const secretKey = parts[1];
                return `${this.identity.username}:${secretKey}`;
            }
        }
        
        // Default to the normal format
        return `${this.identity.username}:${this.identity.secretKey}`;
    }
}

// Export the class
window.NetworkManager = NetworkManager;
