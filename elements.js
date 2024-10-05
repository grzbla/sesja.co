class HTMLAttributeListElement extends HTMLElement {
    static observedAttributes = ['char']
    constructor() {
        super()
    }

    connectedCallback()
    {
        console.log(1);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue && newValue == 'char')
        {
            this._char = newValue
            this.load(newValue)
        }
    }

    get char() { return this._char }
    set char(v) { this._char = v }

    load()
    {

    }

}
customElements.define('attribute-list', HTMLAttributeListElement)



class HTMLAttributeCardElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        new MutationObserver((mutations, observer) =>
            {
                if (mutations[0].attributeName != 'open')
                    this.load(mutations[0].attributeName)
            }).observe(this, {attributes: true})

        gib({wat: "card.html"}).then(card =>
        {
            if (card)
            {
                this.template = card
                this.load(this.attributes[0].name)
            }
        })

        this.addEventListener('click', (event) => { toggleTag(this, 'open'); this.scrollIntoView() })

    }

    load(name)
    {
        if (this.template)
            this.shadowRoot.innerHTML = this.template

        let currentCharName, currentChar
        if (this.parentNode.char)
            currentCharName = this.parentNode.char
        else
        {
            currentCharName = member('currentCharacter')
            if (currentChar == false)
            {
                currentChar = examplarnold
                currentCharName = exemplarnold.name
            }
        }

        this.shadowRoot.innerHTML = this.template

        console.log($('[attribute]', this.shadowRoot))
        console.log(this.shadowRoot)
        console.log(attributes[name])
        $('[attribute]', this.shadowRoot).textContent = attributes[name].name
        $('[description]', this.shadowRoot).textContent = attributes[name].description
        $('[talents]', this.shadowRoot).textContent = JSON.stringify(attributes[name].talents)
    }

    open()
    {

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
        this.minDelay = 100
        this.maxDelay = 300
    }

    connectedCallback()
    {
        const image = maek('div', ['image'])
        image.style.width = '100%'
        image.style.height = '100%'
        image.style.transition = 'opacity 0.5s ease-out'

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

    set minDelay(value) { this._minDelay = parseInt(value) }
    get minDelay() { return this._minDelay }
    set maxDelay(value) { this._maxDelay = parseInt(value) }
    get maxDelay() { return this._maxDelay }

    open() { $('div[image]', this.shadowRoot).style.display = 'block'; setTimeout( () => { $('div[image]', this.shadowRoot).style.opacity = '1' }, Math.random() * (this.maxDelay - this.minDelay) + this.minDelay) }
    close() { $('div[image]', this.shadowRoot).style.display = 'none'; $('div[image]', this.shadowRoot).style.opacity = '0' }
}
customElements.define('pic-frame', HTMLPictureFrameElement)

class HTMLTalentCardElement extends HTMLElement
{
    constructor()
    {
        super()
    }
}
