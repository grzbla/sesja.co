/**
 * system.js - Module loader and initializer for WebRTC applications
 * 
 * This script handles the loading of core modules in the correct order:
 * 1. First loads core libraries (PeerJS)
 * 2. Then loads comm.js module and initializes a single global comm instance
 * 3. Provides an API for other modules to register themselves and use system features
 */

class SystemLoader {
    constructor() {
        // Define core modules with dependencies
        this.coreModules = {
            peerjs: {
                src: 'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js',
                loaded: false
            },
            localforage: {
                src: 'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js',
                loaded: false
            },
            comm: {
                src: 'comm.js',
                loaded: false,
                depends: ['peerjs']
            },
            network: {
                src: 'network.js',
                loaded: false,
                depends: ['peerjs', 'comm', 'localforage']
            }
        };
        
        // Store for registered application modules
        this.appModules = {};
        
        // System components
        this.components = {
            comm: null,  // Will hold the global comm instance
            network: null, // Will hold the global network manager instance
        };
        
        // Event listeners for module registration
        this.eventListeners = {
            'system:ready': []
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the system by loading core modules
     */
    init() {
        console.log('Initializing system...');
        
        // Load core dependencies in order
        this.loadCoreModules()
            .then(() => {
                console.log('Core modules loaded successfully');
                // Initialize the system components
                return this.initializeComponents();
            })
            .then(() => {
                console.log('System ready');
                this.triggerEvent('system:ready', { system: this });
            })
            .catch(error => {
                console.error('Error initializing system:', error);
                this.showError('Failed to initialize system. Please check the console for more information.');
            });
    }
    
    /**
     * Load all core modules in the correct order
     */
    loadCoreModules() {
        // Start with PeerJS, then localforage, then comm, then network
        return this.loadModule('peerjs', this.coreModules)
            .then(() => this.loadModule('localforage', this.coreModules))
            .then(() => this.loadModule('comm', this.coreModules))
            .then(() => this.loadModule('network', this.coreModules));
    }
    
    /**
     * Load a specific module
     * @param {string} moduleName - Name of the module to load
     * @param {Object} moduleStore - Store containing the module definition
     * @returns {Promise} - Resolves when module is loaded
     */
    loadModule(moduleName, moduleStore) {
        return new Promise((resolve, reject) => {
            const module = moduleStore[moduleName];
            
            if (!module) {
                reject(new Error(`Module ${moduleName} not defined`));
                return;
            }
            
            // Check if already loaded
            if (module.loaded) {
                resolve();
                return;
            }
            
            // Check dependencies
            if (module.depends && module.depends.length > 0) {
                for (const dependency of module.depends) {
                    if (!this.coreModules[dependency] || !this.coreModules[dependency].loaded) {
                        reject(new Error(`Dependency ${dependency} not loaded for ${moduleName}`));
                        return;
                    }
                }
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = module.src;
            script.async = false; // Important: maintain loading order
            
            // Handle script loading events
            script.onload = () => {
                console.log(`Module ${moduleName} loaded successfully`);
                module.loaded = true;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load module ${moduleName} from ${module.src}`));
            };
            
            // Add to document
            document.head.appendChild(script);
        });
    }
    
    /**
     * Initialize all core components
     */
    initializeComponents() {
        // Ensure the DOM is ready before initializing components
        if (document.readyState === 'loading') {
            return new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeComm()
                        .then(() => this.initializeNetwork())
                        .then(resolve);
                });
            });
        } else {
            return this.initializeComm()
                .then(() => this.initializeNetwork());
        }
    }
    
    /**
     * Initialize the communication component
     */
    initializeComm() {
        console.log('Initializing communication system...');
        
        return new Promise((resolve, reject) => {
            try {
                // Check if PeerComm class is available
                if (typeof PeerComm !== 'function') {
                    throw new Error('PeerComm class not found. Make sure comm.js is loaded correctly.');
                }
                
                // Initialize the global comm instance
                this.components.comm = new PeerComm({
                    peerId: null, // Use auto-generated ID
                    onStatusChange: (status, details) => this.handleCommStatusChange(status, details)
                });
                
                // Make it available globally (for convenience and debugging)
                window.commInstance = this.components.comm;
                
                console.log('Communication system initialized successfully');
                resolve();
            } catch (error) {
                console.error('Error initializing communication system:', error);
                this.showError('Failed to initialize the communication system. Please check the console for more information.');
                reject(error);
            }
        });
    }
    
    /**
     * Initialize the network component
     */
    initializeNetwork() {
        console.log('Initializing network system...');
        
        return new Promise((resolve, reject) => {
            try {
                // Check if NetworkManager class is available
                if (typeof NetworkManager !== 'function') {
                    throw new Error('NetworkManager class not found. Make sure network.js is loaded correctly.');
                }
                
                // Initialize the global network instance
                this.components.network = new NetworkManager({
                    comm: this.components.comm,
                    onContactsUpdate: (contacts) => this.handleContactsUpdate(contacts),
                    onIdentityUpdate: (identity) => this.handleIdentityUpdate(identity)
                });
                
                // Make it available globally (for convenience and debugging)
                window.networkInstance = this.components.network;
                
                console.log('Network system initialized successfully');
                resolve();
            } catch (error) {
                console.error('Error initializing network system:', error);
                this.showError('Failed to initialize the network system. Please check the console for more information.');
                reject(error);
            }
        });
    }
    
    /**
     * Handle communication status changes
     */
    handleCommStatusChange(status, details) {
        // System-level status logging
        console.log(`Comm system status: ${status}`, details);
    }
    
    /**
     * Handle contacts list updates
     */
    handleContactsUpdate(contacts) {
        // System-level contacts logging
        console.log('Contacts updated:', contacts);
    }
    
    /**
     * Handle identity updates
     */
    handleIdentityUpdate(identity) {
        // System-level identity logging
        console.log('Identity updated:', identity);
    }
    
    /**
     * Register an application module to be loaded
     * @param {string} name - Module name
     * @param {string} src - Path to module script
     * @param {Array} depends - Array of dependencies (must include 'system')
     * @returns {Promise} - Resolves when module is loaded
     */
    registerModule(name, src, depends = ['system']) {
        // Add module to app modules store
        this.appModules[name] = {
            src: src,
            loaded: false,
            depends: depends
        };
        
        // If system is already ready, load the module immediately
        if (this.isReady()) {
            return this.loadModule(name, this.appModules);
        } else {
            // Otherwise, load it when system is ready
            return new Promise((resolve) => {
                this.addEventListener('system:ready', () => {
                    this.loadModule(name, this.appModules).then(resolve);
                });
            });
        }
    }
    
    /**
     * Check if the system is ready (all core modules loaded)
     * @returns {boolean} - True if system is ready
     */
    isReady() {
        return this.components.comm !== null && this.components.network !== null;
    }
    
    /**
     * Get the communication instance
     * @returns {Object} - PeerComm instance
     */
    getComm() {
        return this.components.comm;
    }
    
    /**
     * Get the network instance
     * @returns {Object} - NetworkManager instance
     */
    getNetwork() {
        return this.components.network;
    }
    
    /**
     * Add an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    addEventListener(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    /**
     * Trigger an event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    triggerEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }
    
    /**
     * Show an error message to the user
     * @param {string} message - Error message
     */
    showError(message) {
        // Create a user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.backgroundColor = '#cf6679';
        errorDiv.style.color = '#000';
        errorDiv.style.padding = '20px';
        errorDiv.style.margin = '20px auto';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.maxWidth = '800px';
        errorDiv.style.textAlign = 'center';
        
        const errorTitle = document.createElement('h2');
        errorTitle.textContent = 'Application Error';
        errorDiv.appendChild(errorTitle);
        
        const errorMessage = document.createElement('p');
        errorMessage.textContent = message;
        errorDiv.appendChild(errorMessage);
        
        // Add to document body
        document.body.prepend(errorDiv);
    }
}

// Initialize the system
const system = new SystemLoader();

// Make it globally available
window.system = system; 