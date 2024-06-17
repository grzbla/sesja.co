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
        this.observers = {"mutation": new MutationObserver((mutationRecords) =>
        {
            mutationRecords.forEach(record =>
            {
                if (record.oldValue != record.attributeName) {
                    this.open(record.attributeName) }

                if (record.attributeName == '' || !record.attributeName)
                    this.close()
            })
        }),
            "intersection": new IntersectionObserver((entries) => {
              if (entries[0].intersectionRatio <= 0)
                  this.close()
              else
                  this.open()
        })}

        this.observers.mutation.observe(this, { attributes: true })
        this.observers.intersection.observe(this)
    }

    connectedCallback() {

        gib({wat: "card.html"}).then(card =>
        {
            this.attachShadow({mode: "open"})
            if (card)
                this.shadowRoot.innerHTML = card
        })

    }

    open(attribute)
    {
        console.log(attribute);
        const current = member('currentCharacter')
        if (!current) return

    }
}
customElements.define('attribute-card', HTMLAttributeCardElement)


class HTMLPictureFrameElement extends HTMLElement {
    static observedAttributes = ['src', 'size', 'repeat', 'position', 'blend']
    constructor() {
        super()

        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].intersectionRatio <= 0)
              this.close()
          else
              this.open()
        });

        this.observer.observe(this)
    }

    connectedCallback()
    {
        const style = maek('style')
        const image = maek('div', ['image'])
        const blend = maek('div', ['blend'])
        this.attachShadow({mode: "open"})
        this.shadowRoot.append(style)
        image.append(blend)
        this.shadowRoot.append(image)
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue != newValue)
            switch (name) {
                case 'size':
                    this.
                    break;
            }
    }

    open()
    {
        console.log(this.getAttribute("src"))
        console.log(this.shadowRoot.querySelector['style'])

    }
    close()
    {

    }

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
