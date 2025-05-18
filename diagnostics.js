/*
    streaming src params
*/
class HTMLSystemDiagnosticsElement extends HTMLElement {
    constructor() {
        super()
    }

    get localStorage() { this.getAttribute('localStorage') }
    get sessionStorage() { this.getAttribute('sessionStorage') }
    get landscape() { this.getAttribute('landscape') }
    get indexeddb() { this.getAttribute('indexeddb') }
    get webrtc() { this.getAttribute('webrtc') }
    get shadowdom() { this.getAttribute('shadowdom') }
    get es6() { this.getAttribute('es6') }
    get clonenode() { this.getAttribute('clonenode') }
    get template() { this.getAttribute('template') }
    get slot() { this.getAttribute('slot') }
    get firefox() { this.getAttribute('firefox') }
    get assign() { this.getAttribute('assign') }
    get append() { this.getAttribute('append') }
    get documentfragment() { this.getAttribute('documentfragment') }
    get replacestate() { this.getAttribute('replacestate') }
    get remove() { this.getAttribute('remove') }
    get edge() { this.getAttribute('edge') }
    get webgl() { this.getAttribute('webgl') }
    get flex() { this.getAttribute('flex') }
    get opentype() { this.getAttribute('opentype') }
    get woff() { this.getAttribute('woff') }
    get ios() { this.getAttribute('ios') }
    get has() { this.getAttribute('has') }
    get hd() { this.getAttribute('hd') }
    get uhd() { this.getAttribute('uhd') }
    get hdr() { this.getAttribute('hdr') }

    connectedCallback() {
        this.setAttribute('cookie', navigator.cookieEnabled ? 'true' : 'false')

        try {
            this.setAttribute('localStorage', window.localStorage ? 'true' : 'false')
        } catch (error) {
            this.setAttribute('localStorage', 'false')
        }

        try {
            this.setAttribute('sessionStorage', window.sessionStorage ? 'true' : 'false')
        } catch (error) {
            this.setAttribute('sessionStorage', 'false')
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
