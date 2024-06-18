class HTMLAttributePanelElement extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
    }
}
customElements.define('attribute-panel', HTMLAttributePanelElement)



class HTMLAttributeCardElement extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {

        gib({wat: "card.html"}).then(card =>
        {
            this.attachShadow({mode: "open"})
            if (card)
                this.shadowRoot.innerHTML = card
        })

    }
}
customElements.define('attribute-card', HTMLAttributeCardElement)


class HTMLPictureFrameElement extends HTMLElement {
    static observedAttributes = ['src', 'size', 'repeat', 'position', 'blend']
    constructor() {
        super()
        this.attachShadow({mode: "open"})
        this.set =
        {
            'src': (v) => { $('div[image]', this.shadowRoot).style.backgroundImage = 'url(' + v + ')' },
            'size': (v) => { $('div[image]', this.shadowRoot).style.backgroundSize = v },
            'repeat': (v) => { $('div[image]', this.shadowRoot).style.backgroundRepeat = v },
            'position': (v) => { $('div[image]', this.shadowRoot).style.backgroundPosition = v },
            'blend': (v) => { $('div[image]', this.shadowRoot).style.mixBlendMode = v }
        }
    }

    connectedCallback()
    {
        const image = maek('div', ['image'])
        image.style.width = '100%'
        image.style.height = '100%'

        const blend = maek('div', ['blend'])
        blend.style.width = '100%'
        blend.style.height = '100%'

        image.append(blend)
        this.shadowRoot.append(image)

        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].intersectionRatio <= 0)
              this.close()
          else
              this.open()
        });

        this.observer.observe(this)
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        setTimeout(()=>{ this.set[name](newValue) }, 0)
    }

    open() { untag($('div[image]', this.shadowRoot), 'hidden') }
    close() { tag($('div[image]', this.shadowRoot), 'hidden') }

}
customElements.define('pic-frame', HTMLPictureFrameElement)


class HTMLAttributeSelectorElement extends HTMLElement {
    static observedAttributes = ['active']
    constructor() {
        super()
    }

    connectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue)
            switch (name) {
                case 'name':
                    // this.open(newValue);
                    break;
            }
    }

}
customElements.define('attributes-selector', HTMLAttributeSelectorElement)
