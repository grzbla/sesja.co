/*
    streaming src params
*/
class HTMLSystemDiagnosticsElement extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.setAttribute('cookie', navigator.cookieEnabled ? 'true' : 'false')
        try {
            this.setAttribute('storage', (window.localStorage && window.sessionStorage) ? 'true' : 'false')
        } catch (error) {
            this.setAttribute('storage', 'false')
        }
        this.setAttribute('landscape', window.innerWidth > window.innerHeight ? 'true' : 'false')
        window.addEventListener('resize', (event) => {
            this.setAttribute('landscape', (window.innerWidth > window.innerHeight).toString())
        })
        this.setAttribute('indexeddb', 'indexedDB' in window ? 'true' : 'false')
        this.setAttribute('webrtc', RTCDataChannel ? 'true' : 'false')
        this.setAttribute('shadowdom', (document.head.createShadowRoot || document.head.attachShadow) ? 'true' : 'false')
        try {
            new Function('(a = 0) => a');
            this.setAttribute('es6', 'true')
        } catch (err) {
            this.setAttribute('es6', 'false')
        }
        this.setAttribute('clonenode', document.createElement('div').cloneNode ? 'true' : 'false')
        this.setAttribute('template', typeof(HTMLTemplateElement) ? 'true' : 'false')
        this.setAttribute('slot', typeof(HTMLSlotElement) ? 'true' : 'false')
        this.setAttribute('firefox', navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'true' : 'false')
        this.setAttribute('assign', document.createElement('slot').assign ? 'true' : 'false')
        this.setAttribute('append', document.createElement('div').append ? 'true' : 'false')
        this.setAttribute('documentfragment', new DocumentFragment ? 'true' : 'false')
        this.setAttribute('replacestate', window.history.replaceState ? 'true' : 'false')
        this.setAttribute('remove', typeof(document.createElement('div').remove) ? 'true' : 'false')
        this.setAttribute('edge', /Edg/.test(window.navigator.userAgent) ? 'true' : 'false')
        this.setAttribute('webgl', (document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')) instanceof WebGLRenderingContext ? 'true' : 'false')
        this.setAttribute('flex', CSS.supports('display:flex') ? 'true' : 'false')
        this.setAttribute('opentype', CSS.supports('font-format(opentype)') ? 'true' : 'false')
        this.setAttribute('woff', (CSS.supports('font-format(woff)') || CSS.supports('font-format(woff)')) ? 'true' : 'false')
        this.setAttribute('ios', CSS.supports('-webkit-touch-callout: none') ? 'true' : 'false')
        this.setAttribute('has', CSS.supports('selector(:has(*))') ? 'true' : 'false')
        this.setAttribute('hd', window.matchMedia('min-width: 1440px').matches ? 'true' : 'false')
        this.setAttribute('uhd', window.matchMedia('min-width: 2560px').matches ? 'true' : 'false')
        this.setAttribute('hdr', window.matchMedia('video-dynamic-range: high').matches ? 'true' : 'false')

        if (!(this.getAttribute('webrtc') && this.getAttribute('shadowdom') &&
            this.getAttribute('es6') && this.getAttribute('flex') && this.getAttribute('clonenode') &&
            this.getAttribute('documentfragment') && this.getAttribute('remove')))
            this.setAttribute('willitwork', 'fuck no')
        else if (!(this.getAttribute('cookie') && this.getAttribute('indexeddb')))
            this.setAttribute('willitwork', 'read only')
        else if (!this.getAttribute('webgl'))
            this.setAttribute('willitwork', 'no fancy stuff')
        else
            this.setAttribute('willitwork', 'should')
    }
};
customElements.define('system-diagnostics', HTMLSystemDiagnosticsElement)
