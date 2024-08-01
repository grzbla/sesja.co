const characterAttributeStyle =
`
    .attribute
    {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        cursor: pointer;
    }
    .attribute > div > .bar
    {
        width: calc(100% - var(--attribute-panel-bar-height));
        height: inherit;
        display: inline-block;
    }
    .attribute > div > .tip
    {
        width: 0px;
        height: 0px;
        border-style: solid;
        border-width: var(--attribute-panel-bar-height) var(--attribute-panel-bar-height) 0 0;
        transform: rotate(0deg);
        display: inline-block;
    }

    .attribute > .background > .bar
    {
        background-color: var(--color1);
        border-bottom: var(--attribute-panel-bar-line-size) solid var(--color2);
        box-sizing: border-box;
    }
    .attribute > .background > .tip
    { border-color: var(--color1) transparent transparent transparent; }
    .attribute > .progress > .bar
    {
        background-color: var(--color2);
        border-bottom: var(--attribute-panel-bar-line-size) solid var(--color1);
        box-sizing: border-box;
    }
    .attribute > .progress > .tip
    { border-color: var(--color2) transparent transparent transparent; }
    .attribute > div
    {
        width: 100%;
        height: inherit;
    }
    .attribute > .background
    {
        position: relative;
        display: inline-block;
    }
    .attribute > .progress
    {
        position: absolute;
        overflow: hidden;
        top: 0;
    }
    .attribute .name
    {
        mix-blend-mode: difference;
        height: inherit;
        position: absolute;
        left: var(--attribute-panel-name-left);
        line-height: var(--attribute-panel-bar-height);
        color: var(--color2);
        font-family: 'Credit Valley Bold', sans-serif;
        letter-spacing: var(--attribute-panel-letter-spacing);
    }
    .attribute .value
    {
        line-height: var(--attribute-panel-line-height);
        font-size: var(--attribute-panel-bar-height);
        height: 100%;
        position: absolute;
        right: var(--attribute-panel-value-right);
        color: var(--colorbg);
        display: inline-block;
        font-weight: var(--attribute-panel-value-font-weight);
        width: var(--attribute-panel-value-width);
        text-align: center;
        font-family: 'Prog Bot Regular', sans-serif;
    }`


class CharacterStat extends HTMLElement
{
    static get observedAttributes() { return ['key', 'value'] }

    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        const shadow = this.shadowRoot
        console.log(this.shadowRoot)

        const key = this.getAttribute("key")
        const val = this.getAttribute("val")
        let bar = this.getAttribute("bar") ? this.getAttribute("bar") : rules.attributes.getBarValue(val)

        console.log(key, val)

        let attribute = document.createElement("div")
        shadow.innerHTML =`
        <div class="attribute">
            <div class="background"><div class="bar"></div><div class="tip"></div></div>
            <div class="progress" style="width: ${bar * 100}%;"><div class="bar"></div><div class="tip"></div></div>
            <span class="name">${key ? key : ''}</span><span class="value">${val ? val : ''}</span>
        </div>`
    }

    connectedCallback()
    {
        let style = document.createElement("style")

        style.innerHTML = characterAttributeStyle

        this.shadowRoot.appendChild(style)
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        // console.log(this.setAttribute(name, newValue))
        console.log('Custom square element attributes changed.')
        console.log(name, oldValue, newValue)
    }
}

class CharacterSheet extends HTMLElement
{
    constructor()
    {
        super()
        console.log(this.attributes)
    }

    connectedCallback()
    {
        console.log(this.attributes)
    }

    attributeChangedCallback(name, oldValue, newValue)
    {

    }
}

customElements.define('char-stat', CharacterStat)
customElements.define('char-sheet', CharacterSheet)
