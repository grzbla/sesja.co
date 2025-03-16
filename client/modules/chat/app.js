// Initialize LocalForage instances
const userStore = localforage.createInstance({
    name: 'user-store'
});

const contactsStore = localforage.createInstance({
    name: 'contacts-store'
});

const messagesStore = localforage.createInstance({
    name: 'messages-store'
});

class ChatApp {
    constructor() {
        this.peer = null;
        this.connections = new Map();
        this.currentChat = null;
        this.username = null;
        this.userStatus = 'online';
        this.contacts = new Map();
        this.typingTimeout = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.checkProfile();
    }

    initializeElements() {
        // DOM elements
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-message');
        this.messagesContainer = document.getElementById('messages');
        this.contactsContainer = document.getElementById('contacts');
        this.setupModal = document.getElementById('setup-modal');
        this.addContactModal = document.getElementById('add-contact-modal');
        this.userNameDisplay = document.getElementById('user-name');
        this.sidebarUsername = document.getElementById('sidebar-username');
        this.currentChatDisplay = document.getElementById('current-chat');
        this.userSearch = document.getElementById('user-search');
    }

    attachEventListeners() {
        // Setup form
        document.getElementById('save-profile').addEventListener('click', () => this.saveProfile());
        
        // Add contact form
        document.getElementById('add-contact').addEventListener('click', () => {
            this.addContactModal.classList.add('active');
        });
        
        document.getElementById('save-contact').addEventListener('click', () => this.addContact());
        document.getElementById('cancel-add-contact').addEventListener('click', () => {
            this.addContactModal.classList.remove('active');
        });
        
        // Status selection
        document.getElementById('status-select').addEventListener('change', (e) => {
            this.setUserStatus(e.target.value);
        });
        
        // Chat input
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.messageInput.addEventListener('input', () => {
            if (this.currentChat) {
                this.sendTypingIndicator();
            }
        });
        
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // User search
        this.userSearch.addEventListener('input', (e) => {
            this.filterContacts(e.target.value);
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    async checkProfile() {
        const savedUsername = await userStore.getItem('username');
        const savedStatus = await userStore.getItem('status') || 'online';
        
        if (!savedUsername) {
            this.setupModal.classList.add('active');
        } else {
            this.username = savedUsername;
            this.userStatus = savedStatus;
            this.userNameDisplay.textContent = this.username;
            this.sidebarUsername.textContent = this.username;
            document.getElementById('status-select').value = savedStatus;
            this.initializePeer();
            this.loadContacts();
        }
    }

    async saveProfile() {
        const usernameInput = document.getElementById('username-input');
        const statusSelect = document.getElementById('status-select');
        const username = usernameInput.value.trim();
        const status = statusSelect.value;
        
        if (username) {
            await userStore.setItem('username', username);
            await userStore.setItem('status', status);
            this.username = username;
            this.userStatus = status;
            this.userNameDisplay.textContent = username;
            this.sidebarUsername.textContent = username;
            this.setupModal.classList.remove('active');
            this.initializePeer();
            this.loadContacts();
        }
    }

    setUserStatus(status) {
        this.userStatus = status;
        userStore.setItem('status', status);
        
        // Update status indicators
        const statusIndicators = document.querySelectorAll('.status-indicator');
        statusIndicators.forEach(indicator => {
            indicator.className = `status-indicator ${status}`;
        });

        // Broadcast status to all connections
        this.broadcastStatus();
    }

    broadcastStatus() {
        this.connections.forEach(conn => {
            conn.send({
                type: 'status',
                status: this.userStatus
            });
        });
    }

    initializePeer() {
        this.peer = new Peer(undefined, {
            debug: 2
        });

        this.peer.on('open', (id) => {
            console.log('My peer ID is:', id);
            // Show the ID in the UI for easy sharing
            this.showNotification('Your PeerJS ID: ' + id, 'info');
        });

        this.peer.on('connection', (conn) => {
            this.handleConnection(conn);
        });

        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
            this.showNotification('Connection error: ' + err.message, 'error');
        });
    }

    async loadContacts() {
        const savedContacts = await contactsStore.getItem('contacts') || [];
        savedContacts.forEach(contact => {
            this.contacts.set(contact.id, contact);
            this.addContactToUI(contact);
        });
    }

    filterContacts(query) {
        const contacts = this.contactsContainer.children;
        query = query.toLowerCase();

        Array.from(contacts).forEach(contact => {
            const name = contact.querySelector('.contact-name').textContent.toLowerCase();
            contact.style.display = name.includes(query) ? 'flex' : 'none';
        });
    }

    async addContact() {
        const idInput = document.getElementById('contact-id-input');
        const nameInput = document.getElementById('contact-name-input');
        
        const contactId = idInput.value.trim();
        const contactName = nameInput.value.trim();
        
        if (contactId && contactName) {
            const contact = { 
                id: contactId, 
                name: contactName,
                status: 'offline'
            };
            this.contacts.set(contactId, contact);
            
            // Save to LocalForage
            await contactsStore.setItem('contacts', Array.from(this.contacts.values()));
            
            this.addContactToUI(contact);
            this.addContactModal.classList.remove('active');
            
            // Clear inputs
            idInput.value = '';
            nameInput.value = '';
            
            // Establish connection
            this.connectToPeer(contactId);
            
            // Show notification
            this.showNotification(`Added ${contactName} to contacts`, 'success');
        }
    }

    addContactToUI(contact) {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        contactElement.innerHTML = `
            <div class="user-avatar">
                <img src="https://via.placeholder.com/32" alt="${contact.name}'s avatar">
                <span class="status-indicator ${contact.status || 'offline'}"></span>
            </div>
            <div class="user-info">
                <div class="contact-name">${contact.name}</div>
                <div class="user-status">${contact.status || 'offline'}</div>
            </div>
        `;
        
        contactElement.addEventListener('click', () => {
            this.switchChat(contact.id);
        });
        
        this.contactsContainer.appendChild(contactElement);
    }

    updateContactStatus(contactId, status) {
        const contact = this.contacts.get(contactId);
        if (contact) {
            contact.status = status;
            
            // Update UI
            const contactElement = Array.from(this.contactsContainer.children)
                .find(el => el.querySelector('.contact-name').textContent === contact.name);
            
            if (contactElement) {
                const statusIndicator = contactElement.querySelector('.status-indicator');
                const statusText = contactElement.querySelector('.user-status');
                statusIndicator.className = `status-indicator ${status}`;
                statusText.textContent = status;
            }
        }
    }

    connectToPeer(peerId) {
        if (!this.connections.has(peerId)) {
            const conn = this.peer.connect(peerId);
            this.handleConnection(conn);
        }
    }

    handleConnection(conn) {
        conn.on('open', () => {
            this.connections.set(conn.peer, conn);
            
            // Send initial status
            conn.send({
                type: 'status',
                status: this.userStatus
            });
            
            conn.on('data', (data) => {
                if (data.type === 'status') {
                    this.updateContactStatus(conn.peer, data.status);
                } else if (data.type === 'typing') {
                    this.handleTypingIndicator(conn.peer, data.isTyping);
                } else {
                    this.handleMessage(conn.peer, data);
                }
            });
        });

        conn.on('close', () => {
            this.connections.delete(conn.peer);
            this.updateContactStatus(conn.peer, 'offline');
        });
    }

    switchChat(contactId) {
        this.currentChat = contactId;
        const contact = this.contacts.get(contactId);
        this.currentChatDisplay.textContent = contact.name;
        
        // Enable input
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        
        // Load chat history
        this.loadChatHistory(contactId);
        
        // Update UI
        document.querySelectorAll('.contact').forEach(el => {
            el.classList.remove('active');
            if (el.querySelector('.contact-name').textContent === contact.name) {
                el.classList.add('active');
            }
        });

        // Clear unread indicator if exists
        const contactElement = Array.from(this.contactsContainer.children)
            .find(el => el.querySelector('.contact-name').textContent === contact.name);
        if (contactElement) {
            const unread = contactElement.querySelector('.unread-indicator');
            if (unread) unread.remove();
        }
    }

    async loadChatHistory(contactId) {
        this.messagesContainer.innerHTML = '';
        const history = await messagesStore.getItem(`chat-${contactId}`) || [];
        
        // Add welcome message if no history
        if (history.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-comment-dots"></i>
                    </div>
                    <h2>Welcome to the conversation!</h2>
                    <p>This is the beginning of your direct message history.</p>
                </div>
            `;
        } else {
            history.forEach(msg => this.displayMessage(msg));
        }
    }

    sendTypingIndicator() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        const conn = this.connections.get(this.currentChat);
        if (conn) {
            conn.send({
                type: 'typing',
                isTyping: true
            });
        }

        this.typingTimeout = setTimeout(() => {
            if (conn) {
                conn.send({
                    type: 'typing',
                    isTyping: false
                });
            }
        }, 1000);
    }

    handleTypingIndicator(peerId, isTyping) {
        if (this.currentChat === peerId) {
            const statusElement = document.getElementById('chat-status');
            if (isTyping) {
                statusElement.textContent = 'typing...';
            } else {
                statusElement.textContent = '';
            }
        }
    }

    async sendMessage() {
        if (!this.currentChat || !this.messageInput.value.trim()) return;

        const message = {
            type: 'message',
            sender: this.username,
            content: this.messageInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Send to peer
        const conn = this.connections.get(this.currentChat);
        if (conn) {
            conn.send(message);
        }

        // Save and display locally
        this.saveAndDisplayMessage(this.currentChat, message);
        
        // Clear input
        this.messageInput.value = '';
    }

    async handleMessage(peerId, message) {
        await this.saveAndDisplayMessage(peerId, message);
        
        // If this is not the current chat, show notification
        if (this.currentChat !== peerId) {
            const contact = this.contacts.get(peerId);
            this.showUnreadIndicator(contact);
            this.showNotification(`New message from ${contact.name}`, 'info');
        }
    }

    showUnreadIndicator(contact) {
        const contactElement = Array.from(this.contactsContainer.children)
            .find(el => el.querySelector('.contact-name').textContent === contact.name);
        
        if (contactElement && !contactElement.querySelector('.unread-indicator')) {
            const unread = document.createElement('div');
            unread.className = 'unread-indicator';
            unread.textContent = '1';
            contactElement.appendChild(unread);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }

    async saveAndDisplayMessage(peerId, message) {
        // Save to history
        const history = await messagesStore.getItem(`chat-${peerId}`) || [];
        history.push(message);
        await messagesStore.setItem(`chat-${peerId}`, history);
        
        // Display if this is the current chat
        if (this.currentChat === peerId) {
            this.displayMessage(message);
        }
    }

    displayMessage(message) {
        // Remove welcome message if exists
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="user-avatar">
                <img src="https://via.placeholder.com/32" alt="${message.sender}'s avatar">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.sender}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${this.formatMessage(message.content)}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    formatMessage(content) {
        // Convert URLs to links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        // Convert emojis
        content = content.replace(/:\)|😊/g, '😊')
            .replace(/:\(|😢/g, '😢')
            .replace(/:D|😃/g, '😃')
            .replace(/:P|😛/g, '😛')
            .replace(/<3|❤️/g, '❤️');

        return content;
    }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    new ChatApp();
}); 