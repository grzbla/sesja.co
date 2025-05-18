/**
 * GrapeJS Editor Implementation
 * This file contains the functionality for the GrapeJS-based marker description editor.
 */

// Main initialization function for GrapeJS editor
const initGrapeJSEditor = (markerData) => {
    // Initialize GrapeJS editor
    const editor = grapesjs.init({
        // Specify the container for the editor
        container: '#gjs',
        
        // Load initial content from markerData description
        components: markerData.description || '',
        
        // Editor configuration
        height: '100%',
        width: 'auto',
        
        // Disable storage manager for this use case
        storageManager: false,
        
        // Panel configurations
        panels: {
            defaults: [
                {
                    id: 'layers',
                    el: '.panel__right',
                    resizable: {
                        tc: false,
                        cr: true,
                        cl: false,
                        bc: false
                    }
                }
            ]
        },
        
        // Device manager configuration
        deviceManager: {
            devices: [
                {
                    name: 'Desktop',
                    width: ''
                },
                {
                    name: 'Mobile',
                    width: '320px',
                    widthMedia: '480px'
                }
            ]
        },
        
        // Block manager configuration
        blockManager: {
            appendTo: '#blocks-panel',
            blocks: [
                {
                    id: 'section',
                    label: '<b>Section</b>',
                    attributes: { class: 'gjs-block-section' },
                    content: `<section>
                        <h1>This is a simple title</h1>
                        <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                    </section>`
                },
                {
                    id: 'text',
                    label: 'Text',
                    content: '<div data-gjs-type="text">Insert your text here</div>'
                },
                {
                    id: 'image',
                    label: 'Image',
                    content: { type: 'image' },
                    activate: true
                },
                {
                    id: 'video',
                    label: 'Video',
                    content: {
                        type: 'video',
                        src: 'https://www.youtube.com/embed/your-video-id',
                        style: {
                            height: '350px',
                            width: '100%'
                        }
                    }
                },
                {
                    id: 'link',
                    label: 'Link',
                    content: {
                        type: 'link',
                        content: 'Link Text',
                        attributes: { href: '#' }
                    }
                }
            ]
        },
        
        // Style manager configuration
        styleManager: {
            appendTo: '#styles-panel',
            sectors: [
                {
                    name: 'Dimension',
                    open: false,
                    properties: [
                        'width',
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ]
                },
                {
                    name: 'Typography',
                    open: false,
                    properties: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        'text-align',
                        'text-decoration',
                        'text-shadow'
                    ]
                },
                {
                    name: 'Decorations',
                    open: false,
                    properties: [
                        'background-color',
                        'border',
                        'border-radius',
                        'box-shadow'
                    ]
                }
            ]
        }
    });

    // Handle tab switching
    const blocksTab = document.getElementById('blocks-tab');
    const stylesTab = document.getElementById('styles-tab');
    const blocksPanel = document.getElementById('blocks-panel');
    const stylesPanel = document.getElementById('styles-panel');

    blocksTab.addEventListener('click', () => {
        blocksTab.classList.add('active');
        stylesTab.classList.remove('active');
        blocksPanel.style.display = 'block';
        stylesPanel.style.display = 'none';
    });

    stylesTab.addEventListener('click', () => {
        stylesTab.classList.add('active');
        blocksTab.classList.remove('active');
        stylesPanel.style.display = 'block';
        blocksPanel.style.display = 'none';
    });

    // Handle save and close
    const saveCloseBtn = document.getElementById('save-close-btn');
    saveCloseBtn.addEventListener('click', () => {
        // Save the editor content to markerData
        markerData.description = editor.getHtml();
        
        // Update the marker popup with new name
        markerData.marker.setPopupContent(`
            <div>
                <strong>${markerData.name}</strong>
                <div>${markerData.description}</div>
            </div>
        `);
        
        // Remove the editor overlay
        document.getElementById('editor-overlay').remove();
    });
};
