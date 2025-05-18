// clickity savers
function $(selector, parent) { return (parent ? parent : document).querySelector(selector) }
function cache(item, data) { return (data ? localForage.setItem(item, data) : localForage.getItem(item)) }
function s(v, alt = undefined) { return v ? v : alt }
function code(sign, source) { return (source ? cache('code\\' + sign, source) : cache('code\\' + sign)) }
function functor(sign, f) { return (f ? cache('functor\\' + sign, f) : cache('functor\\' + sign, f)) }
function maek(type, tags) {
    let element = document.createElement(type ? type : 'div')
    if (tags) tags.forEach(t => { tag(element, t)})
    return element
}
function tag(element, t) { element.setAttribute(t, '')}
function untag(element, t) { try { element.removeAttribute(t) } catch {} }
function isTagged(element, t)
{
    if (!element) { console.log("Element is " + element); return false }
    if (!tag) { return element.attributes.length > 0 }
    return element.hasAttribute(t)
}
function toggleTag(element, t)
{
    if (isTagged(element, t))
        untag(element, t)
    else
        tag(element, t)
}

var member;
try
{
    window.sessionStorage
    member = (key, value) => { return value ? sessionStorage.setItem(key, value) : sessionStorage.getItem(key) }
}
catch {} finally { member = () => {return false} }


function gib(args) {
    /*
        gib wat from location
    */
    return new Promise(async (resolve) => {
        if (!args) // if no args, nothing to do
            resolve('ERROR: No arguments passed to gib.')

        const req = new XMLHttpRequest()
        if (args.progress) //use progress function if present
            req.onprogress = (event) => {
                try {
                    args.progress(new Progress(event.loaded, event.total))
                } catch (error) {
                    console.groupCollapsed('%c gib() callback() error.', style.error)
                    console.log('%c Arguments:', style.log)
                    console.log(args)
                    console.log('%c Error Message:', style.log)
                    console.log(error)
                    console.groupEnd()
                }
            }

        req.onreadystatechange = async () => //process response
            {
                if (req.readyState === XMLHttpRequest.DONE) {
                    const status = req.status
                    if (status === 0 || (status >= 200 && status < 400)) {
                        resolve(req.response)
                    } else {
                        console.groupCollapsed('%c gib() connection error.  ', style.error)
                        console.log('%c Arguments:', style.log)
                        console.log(args)
                        console.log('%c Request Object:', style.log)
                        console.log(req)
                        console.groupEnd()
                        resolve(undefined) //TODO much later error handling
                    }
                }
            }
        if (args.type) //if response type present
            req.responseType = args.type

        req.open(args.method ? args.method : 'GET', args.wat)
        req.send()
    })
}


function Functor(args)
{
    this.name = s(args.name, '')
    this.language = { 'name': s(args.language, ''), 'version': s(args.version, '') }
    this.tags = s(args.tags, [])
    this.params = s(args.params, [])
    this.target = s(args.target, [])
    this.source = s(args.source, [])
    this.f;
    this.setFunction = (code) => { this.f = new Function(...args.params, this.source.join('\r\n')) }
    (this.source.length > 0) ? this.setFunction(this.source) : null

    const yo = this
    this.go = function()
    {
        const that = arguments
        return new Promise((resolve) =>
        {
            let response = {}
            try
            {
                response.value = yo.f(...that)
                response.ok = true
            } catch (e)
            {
                response.ok = false
                response.value = e
            }
            resolve(response)
        })
    }
    this.tag = (t) =>
    {
        if (this.tags.includes(t))
            return;
        this.tags.push(t)
    }
    this.removeTag = (t) =>
    {
        var index = tags.indexOf(t)
        if (index !== -1)
        {
            tags.splice(index, 1)
        }
    }
}

function Batch(args) {
    const t = this
    this.name = s(args.name, '')
    this.tags = s(args.tags, [])
    this.target = s(args.target, [])
    this.functors = s(args.functors, [])
    this.go = function()
    {
        for (let i = 0, l = t.functors.length; i < l; i++)
        {
            const functor = t.functors[i]
            functor.go(...t.functors[i].target, ...t.target)
        }
    }
}

function Sequencer(args)
{
    this.name = s(args.name, '')
    this.tags = s(args.tags, [])
    this.target = s(args.target, [])
    this.batches = s(args.batches, {})

    this.dispatch = (sequence) =>
    {
        for (let i = 0, l = sequence.length; i < l; i++)
        {
            const name = sequence[i]
            const batch = this.batches[name]
            batch.go(...this.target)
        }
    }
}
