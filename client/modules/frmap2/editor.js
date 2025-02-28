/**
 * GrapeJS Editor Implementation
 * This file contains the functionality for the GrapeJS-based marker description editor.
 */

// Main initialization function for GrapeJS editor
const initGrapeJSEditor = (markerData) => {
    // Set a flag to prevent closing the editor accidentally
    window.isMarkerEditorOpen = true;
    
    // Initialize the editor with configurations
    const editor = grapesjs.init({
        // Target the editor container
        container: '#gjs',
        
        // Load initial content from the data-description attribute 
        fromElement: false,
        components: markerData.description || '<div class="marker-description">Add your description here</div>',
        
        // Disable default storage manager to use our own saving mechanism
        storageManager: { type: 'none' },
        
        // Configure basic styling with improved style manager
        styleManager: {
            appendTo: '#styles-panel',
            clearProperties: true, // Ensure clean slate when selecting components
            sectors: [
                {
                    name: 'Typography',
                    open: true,
                    buildProps: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        'text-align',
                        'text-decoration',
                        'text-shadow'
                    ],
                    properties: [{
                        property: 'text-align',
                        type: 'radio',
                        defaults: 'left',
                        list: [
                            { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                            { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                            { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                            { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' }
                        ],
                    }]
                },
                {
                    name: 'Decorations',
                    open: false,
                    buildProps: [
                        'background-color',
                        'border-radius',
                        'border',
                        'box-shadow',
                        'opacity'
                    ]
                },
                {
                    name: 'Dimensions',
                    open: false,
                    buildProps: [
                        'width',
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ]
                },
                {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition',
                        'perspective',
                        'transform'
                    ]
                }
            ]
        },
        
        // Panel manager configuration
        panels: {
            defaults: []
        },
        
        // Disable default commands to use custom ones
        commands: {
            defaults: [
                {
                    id: 'save-description',
                    run: function() {
                        saveDescription(editor, markerData);
                    }
                }
            ]
        },
        
        // Configure canvas options
        canvas: {
            styles: [
                // Include custom stylesheet for editor content
                'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
            ],
            scripts: []
        },
        
        // Configure device manager for responsive design
        deviceManager: {
            devices: [
                {
                    name: 'Desktop',
                    width: '100%'
                },
                {
                    name: 'Mobile',
                    width: '320px',
                    widthMedia: '480px'
                }
            ]
        },
        
        // Configure block manager with Font Awesome icons
        blockManager: {
            appendTo: '#blocks-panel',
            blocks: [
                {
                    id: 'section',
                    label: '<i class="fa fa-puzzle-piece"></i> Section',
                    category: 'Basic',
                    content: '<section class="section"><h2>Heading</h2><p>Section content here...</p></section>',
                    attributes: { class: 'block-section' }
                },
                {
                    id: 'heading',
                    label: '<i class="fa fa-header"></i> Heading',
                    category: 'Basic',
                    content: '<h2>Insert heading here</h2>',
                    attributes: { class: 'block-heading' }
                },
                {
                    id: 'paragraph',
                    label: '<i class="fa fa-paragraph"></i> Paragraph',
                    category: 'Basic',
                    content: '<p>Add your text here...</p>',
                    attributes: { class: 'block-paragraph' }
                },
                {
                    id: 'image',
                    label: '<i class="fa fa-image"></i> Image',
                    category: 'Basic',
                    content: { type: 'image' },
                    attributes: { class: 'block-image' }
                },
                {
                    id: 'list',
                    label: '<i class="fa fa-list-ul"></i> List',
                    category: 'Basic',
                    content: '<ul><li>List item 1</li><li>List item 2</li><li>List item 3</li></ul>',
                    attributes: { class: 'block-list' }
                },
                {
                    id: 'divider',
                    label: '<i class="fa fa-minus"></i> Divider',
                    category: 'Basic',
                    content: '<hr class="divider">',
                    attributes: { class: 'block-divider' }
                },
                {
                    id: 'quote',
                    label: '<i class="fa fa-quote-right"></i> Quote',
                    category: 'Typography',
                    content: '<blockquote>Quote text here...</blockquote>',
                    attributes: { class: 'block-quote' }
                },
                {
                    id: 'link',
                    label: '<i class="fa fa-link"></i> Link',
                    category: 'Basic',
                    content: '<a href="#">Link text</a>',
                    attributes: { class: 'block-link' }
                },
                {
                    id: 'note',
                    label: '<i class="fa fa-sticky-note"></i> Note Box',
                    category: 'Decorative',
                    content: '<div class="note-box"><h4>Note:</h4><p>Important information here...</p></div>',
                    attributes: { class: 'block-note' }
                },
                {
                    id: 'warning',
                    label: '<i class="fa fa-exclamation-triangle"></i> Warning Box',
                    category: 'Decorative',
                    content: '<div class="warning-box"><h4>Warning!</h4><p>Critical information here...</p></div>',
                    attributes: { class: 'block-warning' }
                },
                {
                    id: 'table',
                    label: '<i class="fa fa-table"></i> Table',
                    category: 'Advanced',
                    content: '<table class="info-table"><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Cell 1.1</td><td>Cell 1.2</td></tr><tr><td>Cell 2.1</td><td>Cell 2.2</td></tr></tbody></table>',
                    attributes: { class: 'block-table' }
                },
                {
                    id: 'button',
                    label: '<i class="fa fa-square"></i> Button',
                    category: 'Interactive',
                    content: '<button class="styled-button">Click Me</button>',
                    attributes: { class: 'block-button' }
                },
                {
                    id: 'marker-card',
                    label: '<i class="fa fa-map-marker"></i> Marker Card',
                    category: 'Fantasy',
                    content: '<div class="marker-card"><h3>Location Name</h3><p>Description of this fantasy location...</p></div>',
                    attributes: { class: 'block-marker-card' }
                },
                {
                    id: 'scroll',
                    label: '<i class="fa fa-scroll"></i> Scroll',
                    category: 'Fantasy',
                    content: '<div class="scroll-container"><div class="scroll-content"><h3>Ancient Scroll</h3><p>This weathered parchment contains mysterious writings...</p></div></div>',
                    attributes: { class: 'block-scroll' }
                }
            ]
        }
    });
    
    // Store editor instance in window for global access
    window.grapesjsEditor = editor;
    
    // Set editor background to match theme
    editor.setStyle({
        'background-color': 'var(--modern-highlight)',
        'color': 'var(--text-dark)'
    });
    
    // Set up custom style manager in the styles panel
    const styleManager = editor.StyleManager;
    document.getElementById('styles-panel').innerHTML = '';
    document.getElementById('styles-panel').appendChild(styleManager.render());
    
    // Handle panel tabs switching - focus on making styles work
    document.getElementById('blocks-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('styles-tab').classList.remove('active');
        document.getElementById('blocks-panel').style.display = 'block';
        document.getElementById('styles-panel').style.display = 'none';
    });
    
    document.getElementById('styles-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('blocks-tab').classList.remove('active');
        document.getElementById('blocks-panel').style.display = 'none';
        document.getElementById('styles-panel').style.display = 'block';
        
        // Force refresh of style manager when tab is clicked for better styles functionality
        setTimeout(() => {
            const selected = editor.getSelected();
            if (selected) {
                // Re-select to trigger style manager update
                editor.select(selected);
                
                // Force styleManager to render with the selected component's styles
                styleManager.select(selected);
            }
            
            // Further ensure styles panel is visible
            document.getElementById('styles-panel').style.display = 'block';
        }, 50);
    });
    
    // Set up toolbar with common editing options
    const pnm = editor.Panels;
    const panelTop = pnm.addPanel({
        id: 'toolbar-panel',
        el: document.getElementById('gjs-toolbar'),
        buttons: [
            {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '<i class="fa fa-square-o"></i>',
                command: 'sw-visibility',
                context: 'toolbar-panel',
                togglable: false
            },
            {
                id: 'undo',
                className: 'fa fa-undo',
                command: 'undo',
                context: 'toolbar-panel'
            },
            {
                id: 'redo',
                className: 'fa fa-repeat',
                command: 'redo',
                context: 'toolbar-panel'
            },
            {
                id: 'clean-canvas',
                className: 'fa fa-trash',
                command: 'canvas-clear',
                context: 'toolbar-panel'
            },
            {
                id: 'preview',
                className: 'fa fa-eye',
                command: 'fullscreen:preview',
                context: 'toolbar-panel'
            }
        ]
    });
    
    // Handle save and close button
    document.getElementById('save-close-btn').addEventListener('click', function() {
        // Save the editor content to markerData
        saveDescription(editor, markerData);
        
        // Close the editor
        closeEditor();
    });
    
    // Change "Save & Close" button to "Close"
    document.getElementById('save-close-btn').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Close
    `;
    
    // Add custom CSS for editor content
    editor.addStyle(`
        /* Custom styles for editor components */
        .marker-description {
            font-family: 'Roboto', sans-serif;
            color: var(--text-dark);
            padding: 10px;
            margin-bottom: 10px;
        }
        
        .note-box {
            background-color: rgba(191, 157, 94, 0.2);
            border-left: 4px solid var(--gold-accent);
            padding: 15px;
            margin: 15px 0;
            border-radius: var(--border-radius-sm);
        }
        
        .warning-box {
            background-color: rgba(146, 76, 50, 0.2);
            border-left: 4px solid var(--copper-accent);
            padding: 15px;
            margin: 15px 0;
            border-radius: var(--border-radius-sm);
        }
        
        .divider {
            border: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--gold-accent), transparent);
            margin: 20px 0;
        }
        
        .styled-button {
            background-color: var(--gold-accent);
            color: var(--text-dark);
            border: none;
            padding: 8px 16px;
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        
        .styled-button:hover {
            background-color: var(--copper-accent);
            color: var(--text-primary);
            transform: translateY(-2px);
        }
        
        .marker-card {
            background: linear-gradient(135deg, var(--fantasy-primary), var(--modern-primary));
            border: 2px solid var(--gold-accent);
            border-radius: var(--border-radius-md);
            padding: 15px;
            color: var(--text-primary);
            box-shadow: var(--shadow-medium);
        }
        
        .scroll-container {
            background-image: url('assets/ui/scroll_bg.png');
            background-size: cover;
            padding: 30px;
            margin: 20px 0;
            position: relative;
        }
        
        .scroll-content {
            font-family: 'Playfair Display', serif;
            color: var(--text-dark);
            padding: 10px 20px;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .info-table th {
            background-color: var(--fantasy-secondary);
            color: var(--text-primary);
            padding: 10px;
            text-align: left;
            border: 1px solid var(--gold-accent);
        }
        
        .info-table td {
            padding: 8px 10px;
            border: 1px solid var(--fantasy-accent);
            background-color: rgba(46, 52, 64, 0.1);
        }
        
        /* Additional styles to ensure components are easily editable */
        .gjs-selected {
            outline: 2px solid var(--gold-accent) !important;
        }
        
        .gjs-hovered {
            outline: 1px dashed var(--copper-accent) !important;
        }
        
        /* Make sure text is visible when editing */
        [data-gjs-type="text"] {
            min-height: 1em;
        }
        
        /* Ensure empty components have some substance */
        .gjs-dashed [data-gjs-type="text"]:empty {
            padding: 5px;
            min-height: 1em;
        }
    `);
    
    // Make sure the editor triggers resize after initialization
    setTimeout(() => {
        editor.refresh();
        
        // Fix FontAwesome icons by explicitly adding them to blocks
        const blockManager = editor.BlockManager;
        const blocks = blockManager.getAll();
        
        blocks.each(block => {
            const blockLabel = block.get('label');
            if (!blockLabel.includes('<i class="fa')) {
                // Add default icon if none exists
                block.set('label', `<i class="fa fa-cube"></i> ${blockLabel}`);
            }
        });
        
        // Initially select the blocks tab
        document.getElementById('blocks-tab').click();
        
        // Improve style manager visibility and functionality
        const styleManager = editor.StyleManager;
        
        // Set up style manager events for better style handling
        editor.on('component:selected', (component) => {
            if (document.getElementById('styles-tab').classList.contains('active')) {
                styleManager.select(component);
                document.getElementById('styles-panel').style.display = 'block';
            }
        });
        
        // Add event listener for block drag and drop
        editor.on('block:drag:start', () => {
            document.getElementById('blocks-tab').classList.add('active');
            document.getElementById('styles-tab').classList.remove('active');
        });
        
        // After a block is dropped, automatically show the styles panel
        editor.on('block:drag:stop', () => {
            setTimeout(() => {
                const selected = editor.getSelected();
                if (selected) {
                    document.getElementById('blocks-tab').classList.remove('active');
                    document.getElementById('styles-tab').classList.add('active');
                    document.getElementById('blocks-panel').style.display = 'none';
                    document.getElementById('styles-panel').style.display = 'block';
                    
                    // Apply the style manager to the selected component
                    styleManager.select(selected);
                }
            }, 100);
        });
        
        // Enhance RTE (Rich Text Editor) with more formatting options
        editor.RichTextEditor.add('format-options', {
            actions: [
                {
                    name: 'bold',
                    icon: '<i class="fa fa-bold"></i>',
                    attributes: { title: 'Bold' },
                    result: rte => rte.exec('bold')
                },
                {
                    name: 'italic',
                    icon: '<i class="fa fa-italic"></i>',
                    attributes: { title: 'Italic' },
                    result: rte => rte.exec('italic')
                },
                {
                    name: 'underline',
                    icon: '<i class="fa fa-underline"></i>',
                    attributes: { title: 'Underline' },
                    result: rte => rte.exec('underline')
                },
                {
                    name: 'link',
                    icon: '<i class="fa fa-link"></i>',
                    attributes: { title: 'Link' },
                    result: rte => {
                        const url = prompt('Enter URL');
                        if (url) rte.exec('createLink', url);
                    }
                },
                {
                    name: 'color',
                    icon: '<i class="fa fa-tint"></i>',
                    attributes: { title: 'Text Color' },
                    result: rte => {
                        const color = prompt('Enter color (hex, rgb, or name)', '#BF9D5E');
                        if (color) {
                            rte.exec('foreColor', color);
                        }
                    }
                }
            ]
        });
        
        // Add keyboard shortcuts for better editing experience
        editor.Commands.add('delete-component', {
            run: (editor) => {
                const selected = editor.getSelected();
                if (selected) {
                    selected.remove();
                }
            },
            stop: () => {}
        });
        
        editor.on('canvas:keydown', (e) => {
            // Delete with Delete key
            if (e.keyCode === 46) {
                editor.runCommand('delete-component');
            }
            
            // Undo with Ctrl+Z
            if (e.keyCode === 90 && e.ctrlKey) {
                editor.UndoManager.undo();
            }
            
            // Redo with Ctrl+Y or Ctrl+Shift+Z
            if ((e.keyCode === 89 && e.ctrlKey) || 
                (e.keyCode === 90 && e.ctrlKey && e.shiftKey)) {
                editor.UndoManager.redo();
            }
        });
        
        // Force restyling of blocks to ensure they look correct
        const blockContainer = document.getElementById('blocks-panel');
        if (blockContainer) {
            const blockCategories = blockContainer.querySelectorAll('.gjs-block-category');
            blockCategories.forEach(category => {
                // Open each category initially
                if (!category.classList.contains('gjs-open')) {
                    const categoryTitle = category.querySelector('.gjs-title');
                    if (categoryTitle) categoryTitle.click();
                }
                
                // Style each block
                const blocks = category.querySelectorAll('.gjs-block');
                blocks.forEach(block => {
                    const blockLabel = block.querySelector('.gjs-block-label');
                    if (blockLabel) {
                        // Make sure label uses flex layout
                        blockLabel.style.display = 'flex';
                        blockLabel.style.flexDirection = 'column';
                        blockLabel.style.alignItems = 'center';
                        blockLabel.style.justifyContent = 'center';
                        
                        // Find icon and ensure it's styled correctly
                        const icon = blockLabel.querySelector('i');
                        if (icon) {
                            icon.style.fontSize = '24px';
                            icon.style.marginBottom = '5px';
                        }
                    }
                });
            });
        }
        
        // Listen for window beforeunload event to prevent accidental closing
        window.addEventListener('beforeunload', function(e) {
            if (window.isMarkerEditorOpen) {
                // Cancel the event and show confirmation dialog
                e.preventDefault();
                // Chrome requires returnValue to be set
                e.returnValue = '';
                return '';
            }
        });
    }, 100);
};

// Save the editor content to marker data
const saveDescription = (editor, markerData) => {
    // Get the HTML content from the editor
    const htmlContent = editor.getHtml();
    const cssContent = editor.getCss({ avoidProtected: true });
    
    // Combine HTML and CSS for storage
    markerData.description = htmlContent;
    markerData.customCss = cssContent;
    
    // Update the marker popup with a preview of the description
    const previewText = htmlContent.replace(/<[^>]*>/g, ' ').substring(0, 50) + '...';
    const popupContent = `
        <div>
            <strong>${markerData.name}</strong>
            <p class="description-preview">${previewText}</p>
        </div>
    `;
    
    // If the marker has a bindPopup method, update its content
    if (markerData.marker && typeof markerData.marker.bindPopup === 'function') {
        markerData.marker.bindPopup(popupContent);
    }
    
    // Log for debugging
    console.log('Description saved:', {
        name: markerData.name,
        previewText: previewText,
        fullHtml: htmlContent.length > 100 ? htmlContent.substring(0, 100) + '...' : htmlContent
    });
    
    return { success: true, message: 'Description saved successfully' };
};

// Close the editor
const closeEditor = () => {
    // Save any pending changes and clean up
    console.log("Closing editor and saving changes");
    
    // Get the current editor instance
    const editor = window.grapesjsEditor;
    
    // Perform cleanup before closing
    if (editor) {
        // Make sure to remove any event listeners that could cause memory leaks
        editor.off('component:selected');
        editor.off('block:drag:start');
        editor.off('block:drag:stop');
        editor.off('canvas:keydown');
        
        // Destroy the editor instance to prevent memory leaks
        try {
            editor.destroy();
        } catch (e) {
            console.warn('Error destroying editor:', e);
        }
        
        // Clear the editor reference
        window.grapesjsEditor = null;
    }
    
    // Remove the editor overlay
    const editorOverlay = document.getElementById('editor-overlay');
    if (editorOverlay) {
        editorOverlay.parentNode.removeChild(editorOverlay);
    }
    
    // Clear the beforeunload event handler
    window.removeEventListener('beforeunload', function(){});
    
    // Reset the flag
    window.isMarkerEditorOpen = false;
};
