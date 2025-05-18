// Initialize LocalForage
const characterStorage = localforage.createInstance({
    name: "cyberpunk2020"
});

// Character state
let character = {
    basicInfo: {
        name: '',
        role: ''
    },
    stats: {
        INT: 1,
        REF: 1,
        TECH: 1,
        COOL: 1,
        ATTR: 1,
        LUCK: 1,
        MA: 1,
        BODY: 1,
        EMP: 1
    },
    background: {
        family: '',
        lifeEvents: []
    },
    skills: [],
    equipment: {
        items: [],
        cyberware: []
    }
};

// Life Events Data
const lifeEvents = {
    "Big Problems, Big Wins": [
        "Lost everything in a fire",
        "Won big in underground betting",
        "Survived a deadly encounter",
        "Made a powerful enemy",
        "Found valuable corporate data",
        "Escaped a corporate hit squad",
        "Discovered a hidden cache of weapons",
        "Won territory in a gang war",
        "Survived a cyber-psycho attack",
        "Found experimental technology"
    ],
    "Friends and Enemies": [
        "Made a loyal friend in the streets",
        "Betrayed by a close ally",
        "Gained a corporate contact",
        "Made enemies with a local gang",
        "Found a mentor",
        "Saved a powerful figure's life",
        "Double-crossed by a fixer",
        "Formed a lasting partnership",
        "Created a rival in the same field",
        "Connected with underground network"
    ],
    "Romantic Relationships": [
        "Lost someone special in a job",
        "Found love in dangerous times",
        "Complicated relationship with rival",
        "Partner disappeared mysteriously",
        "Romance with corporate insider",
        "Love triangle with gang leaders",
        "Fell for an AI construct",
        "Star-crossed love across corporations",
        "Reformed enemy turned lover",
        "Lost love to cyber-psychosis"
    ],
    "Life-Changing Events": [
        "Cybernetic enhancement accident",
        "Witnessed a major crime",
        "Saved someone important",
        "Discovered hidden truth",
        "Changed identity",
        "Survived a deadly virus",
        "Uncovered conspiracy",
        "Gained unique abilities",
        "Lost everything in data crash",
        "Found ancient technology"
    ],
    "Family Crisis": [
        "Family member disappeared",
        "Inherited family debt",
        "Protected family from corps",
        "Family betrayal revealed",
        "Found lost relative",
        "Family targeted by hitmen",
        "Discovered family secret",
        "Avenged family member",
        "Family business destroyed",
        "Reunited separated family"
    ]
};

// Skills Data
const skillsList = {
    Special: {},
    Attraction: ["Personal Grooming", "Wardrobe & Style"],
    Body: ["Endurance", "Strength Feat", "Swimming"],
    Combat: ["Brawling", "Melee", "Martial Arts"],
    Education: ["Composition", "History", "Language", "Literature", "Science"],
    Fighting: ["Archery", "Handgun", "Heavy Weapons", "Rifle", "Submachinegun"],
    Performance: ["Acting", "Play Instrument", "Oratory"],
    Social: ["Human Perception", "Interview", "Leadership", "Seduction", "Social", "Persuasion & Fast Talk", "Streetwise"],
    Technique: ["Aero Tech", "AV Tech", "Basic Tech", "Cybertech", "Demolitions", "Disguise", "Electronics", "First Aid", "Forgery", "Paint/Draw", "Photo & Film", "Pharmacology", "Pick Lock", "Pick Pocket", "Play Instrument", "Weaponsmith"],
    Vehicle: ["Driving", "Piloting", "Motorcycle"]
};

// Equipment Data
const startingEquipment = {
    Solo: ["Heavy Pistol", "Light Armor Jacket", "Combat Knife"],
    Netrunner: ["Neural Interface", "Cyberdeck", "Light Pistol"],
    Techie: ["Tech Tool Kit", "Light Pistol", "Multimeter"],
    Medtechie: ["Medical Kit", "Light Pistol", "Diagnostics Scanner"],
    Media: ["Camera", "Light Pistol", "Recorder"],
    Cop: ["Light Armor Jacket", "Heavy Pistol", "Handcuffs"],
    Corporate: ["Light Pistol", "Business Clothes", "Computer"],
    Fixer: ["Light Pistol", "Lock Picks", "Pocket Secretary"],
    Nomad: ["Motorcycle", "Heavy Pistol", "Leathers"],
    Rockerboy: ["Instrument", "Light Pistol", "Stage Clothes"]
};

// Available cyberware by role
const cyberwareOptions = {
    Solo: ["Cybereyes", "Cyberarm with weapon", "Pain editor"],
    Netrunner: ["Neural processor", "Interface plugs", "Memory chips"],
    Techie: ["Tool hand", "Skill chip socket", "Tech scanner"],
    Medtechie: ["Biomonitor", "Synthblood", "Med scanner"],
    Media: ["Cybereyes with recorder", "Memory chip", "Audio enhancer"],
    Cop: ["Cyberoptics", "Pain suppressor", "Subdermal armor"],
    Corporate: ["Skinwatch", "Voice stress analyzer", "Memory chip"],
    Fixer: ["Market price data chip", "Voice stress analyzer", "Cybereyes"],
    Nomad: ["Vehicle link", "Infrared cybereyes", "Boosted reflexes"],
    Rockerboy: ["Voice synthesizer", "Audio enhancer", "Light show implant"]
};

// DOM Elements
const prevButton = document.getElementById('prevStep');
const nextButton = document.getElementById('nextStep');
const saveButton = document.getElementById('saveCharacter');
const stepProgress = document.querySelector('.progress-bar');
const stepIndicator = document.getElementById('stepIndicator');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    loadLastCharacter();
    initializeSkillsList();
    updateEquipmentOptions();
}

function setupEventListeners() {
    // Basic Info
    document.getElementById('characterName').addEventListener('input', debounce(updateBasicInfo, 500));
    document.getElementById('role').addEventListener('change', updateRole);

    // Stats
    document.querySelectorAll('.stat-box input').forEach(input => {
        input.addEventListener('input', debounce(updateStats, 500));
    });

    // Background
    document.getElementById('familyBackground').addEventListener('change', updateBackground);
    document.getElementById('addLifeEvent').addEventListener('click', addLifeEvent);

    // New Character
    document.getElementById('newCharacter').addEventListener('click', createNewCharacter);
}

// Update Functions
async function updateBasicInfo() {
    const name = document.getElementById('characterName').value;
    const role = document.getElementById('role').value;
    
    character.basicInfo.name = name;
    character.basicInfo.role = role;
    
    await saveCharacter();
    updateEquipmentOptions();
}

async function updateRole(event) {
    character.basicInfo.role = event.target.value;
    updateEquipmentOptions();
    await saveCharacter();
}

async function updateStats() {
    const stats = ['INT', 'REF', 'TECH', 'COOL', 'ATTR', 'LUCK', 'MA', 'BODY', 'EMP'];
    let total = 0;
    
    stats.forEach(stat => {
        const value = parseInt(document.getElementById(`stat${stat}`).value) || 1;
        character.stats[stat] = value;
        total += value;
    });
    
    document.getElementById('statPoints').textContent = `Points Remaining: ${75 - total}`;
    
    if (total > 75) {
        document.getElementById('statPoints').style.color = 'red';
    } else {
        document.getElementById('statPoints').style.color = 'inherit';
    }
    
    await saveCharacter();
}

async function updateBackground() {
    character.background.family = document.getElementById('familyBackground').value;
    await saveCharacter();
}

// Life Events Functions
let currentEventDiv = null;

function addLifeEvent() {
    const lifeEventsContainer = document.getElementById('lifeEvents');
    const eventDiv = document.createElement('div');
    eventDiv.className = 'life-event-container mb-3';
    
    // Create event link
    const eventLink = document.createElement('a');
    eventLink.className = 'life-event-link';
    eventLink.textContent = 'Select Life Event';
    eventLink.onclick = () => showEventPopup(eventDiv);
    
    // Add remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'cyber-button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        eventDiv.remove();
        updateLifeEvents();
    };
    
    // Add data attributes for storing selected values
    eventDiv.dataset.category = '';
    eventDiv.dataset.event = '';
    
    // Assemble the event div
    eventDiv.appendChild(eventLink);
    eventDiv.appendChild(removeButton);
    
    lifeEventsContainer.appendChild(eventDiv);
}

function showEventPopup(eventDiv) {
    currentEventDiv = eventDiv;
    const popup = document.getElementById('eventPopup');
    const categoryList = document.getElementById('eventCategoryList');
    
    // Clear previous content
    categoryList.innerHTML = '';
    
    // Add all categories
    Object.keys(lifeEvents).forEach(category => {
        const item = document.createElement('div');
        item.className = 'event-category-item';
        item.textContent = category;
        item.onclick = () => showEventsList(category);
        categoryList.appendChild(item);
    });
    
    popup.style.display = 'flex';
}

function showEventsList(category) {
    const categoryList = document.getElementById('eventCategoryList');
    categoryList.innerHTML = '';
    
    // Add back button
    const backButton = document.createElement('div');
    backButton.className = 'event-category-item';
    backButton.textContent = '← Back to Categories';
    backButton.onclick = () => showEventPopup(currentEventDiv);
    categoryList.appendChild(backButton);
    
    // Get all events from the category
    const events = lifeEvents[category];
    
    // Add events from selected category (first 10)
    const eventsToShow = events.slice(0, 10);
    eventsToShow.forEach(event => {
        const item = document.createElement('div');
        item.className = 'event-category-item';
        item.textContent = event;
        item.onclick = () => {
            selectEvent(category, event);
            document.getElementById('eventPopup').style.display = 'none';
            isRandomizing = false;
            clearInterval(intervalId);
        };
        categoryList.appendChild(item);
    });
    
    // Add random option
    const randomItem = document.createElement('div');
    randomItem.className = 'event-category-item random';
    const randomEventText = document.createElement('div');
    randomEventText.className = 'random-event';
    randomItem.appendChild(randomEventText);
    let currentRandomEvent = '';
    let isRandomizing = true;
    
    // Update random option continuously
    const updateInterval = 75;
    
    const intervalId = setInterval(() => {
        if (!isRandomizing) return;
        
        // Update random selection
        currentRandomEvent = events[Math.floor(Math.random() * events.length)];
        randomEventText.textContent = currentRandomEvent;
    }, updateInterval);
    
    // Initial random selection
    currentRandomEvent = events[Math.floor(Math.random() * events.length)];
    randomEventText.textContent = currentRandomEvent;
    
    // Add click handler to stop randomization and select
    randomItem.onclick = () => {
        isRandomizing = false;
        clearInterval(intervalId);
        const finalEvent = currentRandomEvent;
        randomEventText.textContent = `Selected: ${finalEvent}`;
        selectEvent(category, finalEvent);
        document.getElementById('eventPopup').style.display = 'none';
    };
    
    // Clear interval when popup is closed (only when actually closing)
    const popup = document.getElementById('eventPopup');
    popup.onclick = (e) => {
        if (e.target === popup) {
            // Only stop if we're actually closing the popup
            document.getElementById('eventPopup').style.display = 'none';
            isRandomizing = false;
            clearInterval(intervalId);
        }
    };
    
    categoryList.appendChild(randomItem);
}

function selectEvent(category, event) {
    if (currentEventDiv) {
        currentEventDiv.dataset.category = category;
        currentEventDiv.dataset.event = event;
        const eventLink = currentEventDiv.querySelector('.life-event-link');
        eventLink.textContent = event;
        updateLifeEvents();
    }
}

async function updateLifeEvents() {
    const events = [];
    document.querySelectorAll('.life-event-container').forEach(container => {
        const category = container.dataset.category;
        const event = container.dataset.event;
        if (category && event) {
            events.push({
                category,
                event
            });
        }
    });
    
    character.background.lifeEvents = events;
    await saveCharacter();
}

// Equipment Functions
function updateEquipmentOptions() {
    const role = character.basicInfo.role;
    const equipmentContainer = document.getElementById('startingEquipment');
    const cyberwareContainer = document.getElementById('cyberware');
    
    // Update starting equipment
    if (role && startingEquipment[role]) {
        equipmentContainer.innerHTML = startingEquipment[role].map(item => `
            <div class="equipment-item">
                <input type="checkbox" id="equip_${item}" value="${item}">
                <label for="equip_${item}">${item}</label>
            </div>
        `).join('');
        
        // Add event listeners
        equipmentContainer.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', async () => {
                character.equipment.items = Array.from(document.querySelectorAll('#startingEquipment input:checked'))
                    .map(item => item.value);
                await saveCharacter();
            });
        });
    }
    
    // Update cyberware options
    if (role && cyberwareOptions[role]) {
        cyberwareContainer.innerHTML = cyberwareOptions[role].map(item => `
            <div class="equipment-item">
                <input type="checkbox" id="cyber_${item}" value="${item}">
                <label for="cyber_${item}">${item}</label>
            </div>
        `).join('');
        
        // Add event listeners
        cyberwareContainer.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', async () => {
                character.equipment.cyberware = Array.from(document.querySelectorAll('#cyberware input:checked'))
                    .map(item => item.value);
                await saveCharacter();
            });
        });
    }
}

// Skills Functions
function initializeSkillsList() {
    const skillsContainer = document.getElementById('skillsList');
    
    Object.entries(skillsList).forEach(([category, skills]) => {
        if (Array.isArray(skills) && skills.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category mb-3';
            categoryDiv.innerHTML = `<h3 class="section-title">${category}</h3>`;
            
            skills.forEach(skill => {
                const skillDiv = document.createElement('div');
                skillDiv.className = 'skill-item';
                skillDiv.innerHTML = `
                    <input type="checkbox" id="skill_${skill}" value="${skill}">
                    <label for="skill_${skill}">${skill}</label>
                    <input type="number" class="skill-value editable" data-skill="${skill}" min="1" max="10" value="1">
                `;
                categoryDiv.appendChild(skillDiv);
            });
            
            // Add event listeners
            categoryDiv.querySelectorAll('input[type="checkbox"], input[type="number"]').forEach(input => {
                input.addEventListener('change', async () => {
                    updateSkills();
                });
            });
            
            skillsContainer.appendChild(categoryDiv);
        }
    });
}

async function updateSkills() {
    const selectedSkills = document.querySelectorAll('#skillsList input[type="checkbox"]:checked');
    character.skills = Array.from(selectedSkills).map(skill => ({
        name: skill.value,
        level: parseInt(document.querySelector(`[data-skill="${skill.value}"]`).value) || 1
    }));
    await saveCharacter();
}

// Storage Functions
async function saveCharacter() {
    try {
        const timestamp = Date.now();
        await characterStorage.setItem('current_character', {
            ...character,
            lastModified: timestamp
        });
    } catch (error) {
        console.error('Error saving character:', error);
    }
}

async function loadLastCharacter() {
    try {
        const savedCharacter = await characterStorage.getItem('current_character');
        if (savedCharacter) {
            character = savedCharacter;
            populateForm(savedCharacter);
        }
    } catch (error) {
        console.error('Error loading character:', error);
    }
}

function createNewCharacter() {
    if (confirm('Are you sure you want to create a new character? Current character will be saved.')) {
        character = {
            basicInfo: { name: '', role: '' },
            stats: {
                INT: 1, REF: 1, TECH: 1, COOL: 1,
                ATTR: 1, LUCK: 1, MA: 1, BODY: 1, EMP: 1
            },
            background: { family: '', lifeEvents: [] },
            skills: [],
            equipment: { items: [], cyberware: [] }
        };
        populateForm(character);
        saveCharacter();
    }
}

function populateForm(loadedCharacter) {
    // Populate Basic Info
    document.getElementById('characterName').value = loadedCharacter.basicInfo.name || '';
    document.getElementById('role').value = loadedCharacter.basicInfo.role || '';
    
    // Populate Stats
    Object.entries(loadedCharacter.stats).forEach(([stat, value]) => {
        document.getElementById(`stat${stat}`).value = value;
    });
    updateStats();
    
    // Populate Background
    document.getElementById('familyBackground').value = loadedCharacter.background.family || '';
    document.getElementById('lifeEvents').innerHTML = '';
    
    if (loadedCharacter.background.lifeEvents && loadedCharacter.background.lifeEvents.length > 0) {
        loadedCharacter.background.lifeEvents.forEach(eventData => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'life-event-container mb-3';
            
            // Create event link
            const eventLink = document.createElement('a');
            eventLink.className = 'life-event-link';
            eventLink.textContent = eventData.event || 'Select Life Event';
            eventLink.onclick = () => showEventPopup(eventDiv);
            
            // Add remove button
            const removeButton = document.createElement('button');
            removeButton.className = 'cyber-button';
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => {
                eventDiv.remove();
                updateLifeEvents();
            };
            
            // Set data attributes
            eventDiv.dataset.category = eventData.category || '';
            eventDiv.dataset.event = eventData.event || '';
            
            // Assemble the event div
            eventDiv.appendChild(eventLink);
            eventDiv.appendChild(removeButton);
            
            document.getElementById('lifeEvents').appendChild(eventDiv);
        });
    }
    
    // Update equipment options based on role
    updateEquipmentOptions();
    
    // Populate Skills
    document.querySelectorAll('#skillsList input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    loadedCharacter.skills.forEach(skill => {
        const checkbox = document.querySelector(`input[value="${skill.name}"]`);
        if (checkbox) {
            checkbox.checked = true;
            document.querySelector(`[data-skill="${skill.name}"]`).value = skill.level;
        }
    });
    
    // Populate Equipment
    setTimeout(() => {
        loadedCharacter.equipment.items.forEach(item => {
            const checkbox = document.querySelector(`input[value="${item}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        loadedCharacter.equipment.cyberware.forEach(item => {
            const checkbox = document.querySelector(`input[value="${item}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }, 100);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 