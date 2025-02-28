/**
 * system.js - Module loader and initializer for the WebRTC Radio application
 * 
 * This script handles the loading of modules in the correct order:
 * 1. First loads PeerJS library
 * 2. Then loads comm.js module and initializes a single global comm instance
 * 3. Finally loads other modules and initializes them with the comm instance
 */

class SystemLoader {
    constructor() {
        // Define modules with dependencies
        this.modules = {
            peerjs: {
                src: 'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js',
                loaded: false
            },
            comm: {
                src: 'comm.js',
                loaded: false,
                depends: ['peerjs']
            },
            radio: {
                src: 'radio.js',
                loaded: false,
                depends: ['comm']
            }
            // Add more modules here as needed in the future
            // Example:
            // chat: {
            //     src: 'chat.js',
            //     loaded: false,
            //     depends: ['comm']
            // }
        };
        
        // System components
        this.components = {
            comm: null,  // Will hold the global comm instance
            radio: null  // Will hold the radio instance
            // Add more component references here as they're added
        };
        
        // Initialize the system
        this.init();
    }
    
    init() {
        console.log('Initializing system...');
        
        // Load dependencies in order
        this.loadAllModules()
            .then(() => {
                console.log('All modules loaded successfully');
                // Initialize the system components
                return this.initializeComponents();
            })
            .catch(error => {
                console.error('Error initializing system:', error);
                this.showError('Failed to initialize system. Please check the console for more information.');
            });
    }
    
    loadAllModules() {
        // Start with PeerJS
        return this.loadModule('peerjs')
            .then(() => this.loadModule('comm'))
            .then(() => this.loadModule('radio'))
            // Add more module loading promises here in the future
            ;
    }
    
    loadModule(moduleName) {
        return new Promise((resolve, reject) => {
            const module = this.modules[moduleName];
            
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
                    if (!this.modules[dependency] || !this.modules[dependency].loaded) {
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
    
    initializeComponents() {
        // Ensure the DOM is ready before initializing components
        if (document.readyState === 'loading') {
            return new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeAllComponents().then(resolve);
                });
            });
        } else {
            return this.initializeAllComponents();
        }
    }
    
    initializeAllComponents() {
        // Initialize in correct order
        return this.initializeComm()
            .then(() => this.initializeRadio())
            // Add more component initializations here in the future
            ;
    }
    
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
                    // We'll let specific modules register their own event handlers
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
    
    handleCommStatusChange(status, details) {
        // System-level status logging
        console.log(`Comm system status: ${status}`, details);
    }
    
    initializeRadio() {
        console.log('Initializing radio application...');
        
        return new Promise((resolve, reject) => {
            try {
                // Check if Radio class is available
                if (typeof Radio !== 'function') {
                    throw new Error('Radio class not found. Make sure radio.js is loaded correctly.');
                }
                
                // Create and store the radio instance, passing the comm instance
                this.components.radio = new Radio(this.components.comm);
                
                // Make it available globally (for convenience and debugging)
                window.radio = this.components.radio;
                
                console.log('Radio application initialized successfully');
                resolve();
            } catch (error) {
                console.error('Error initializing radio application:', error);
                this.showError('Failed to initialize the radio application. Please check the console for more information.');
                reject(error);
            }
        });
    }
    
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