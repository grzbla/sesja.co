/*
    SHIT HERE IS SUPPOSED TO BE INITIALIZED FIRST
*/

$ = (query, parent = document) =>
{
    if (typeof(parent) === 'string')
        parent = $(parent)
    const element = parent.querySelector(query)
    return element ? element : undefined
}
$$ = (query, parent = document) =>
{
    if (typeof(parent) === 'string')
        parent = $(parent)
    const element = parent.querySelector(query)
    return element ? parent.querySelectorAll(query) : undefined
}
$v = (property) =>
{
    return getComputedStyle(document.body).getPropertyValue(property)
}

const style =
{
    color1a: "white-space: break-spaces; color: rgba(255,137,134,1); text-shadow: rgba(255,137,134,1) 1px 0 12px;",
    color1b: "white-space: break-spaces; color: rgba(242, 79, 79,1); text-shadow: rgba(242, 79, 79,1) 1px 0 12px;",
    color1c: "white-space: break-spaces; color: rgba(206, 37, 27,1); text-shadow: rgba(206, 37, 27,1) 1px 0 12px;",
    color1d: "white-space: break-spaces; color: rgba(155,  6,  2,1); text-shadow: rgba(155,  6,  2,1) 1px 0 12px;",
    color1e: "white-space: break-spaces; color: rgba( 91,  2,  0,1); text-shadow: rgba( 91,  2,  0,1) 1px 0 12px;",

    color2a: "white-space: break-spaces; color: rgba(255,204,134,1); text-shadow: rgba(255,204,134,1) 1px 0 12px;",
    color2b: "white-space: break-spaces; color: rgba(239,169, 73,1); text-shadow: rgba(239,169, 73,1) 1px 0 12px;",
    color2c: "white-space: break-spaces; color: rgba(206,129, 22,1); text-shadow: rgba(206,129, 22,1) 1px 0 12px;",
    color2d: "white-space: break-spaces; color: rgba(155, 91,  2,1); text-shadow: rgba(155, 91,  2,1) 1px 0 12px;",
    color2e: "white-space: break-spaces; color: rgba( 91, 53,  0,1); text-shadow: rgba( 91, 53,  0,1) 1px 0 12px;",

    color3a: "white-space: break-spaces; color: rgba(106,151,189,1); text-shadow: rgba(106,151,189,1) 1px 0 12px;",
    color3b: "white-space: break-spaces; color: rgba( 54,109,154,1); text-shadow: rgba( 54,109,154,1) 1px 0 12px;",
    color3c: "white-space: break-spaces; color: rgba( 23, 83,133,1); text-shadow: rgba( 23, 83,133,1) 1px 0 12px;",
    color3d: "white-space: break-spaces; color: rgba(  8, 58,100,1); text-shadow: rgba(  8, 58,100,1) 1px 0 12px;",
    color3e: "white-space: break-spaces; color: rgba(  2, 33, 59,1); text-shadow: rgba(  2, 33, 59,1) 1px 0 12px;",

    log: "white-space: break-spaces; color: #ffffff9f",
    warn: "white-space: break-spaces; color: #ffffff9f; text-shadow: yellow 2px 0 10px;",
    error: "white-space: break-spaces; color: #ffffff9f; text-shadow: red 2px 0 10px;",
    pop: "white-space: break-spaces; color: lightgreen; text-shadow: #aaa 2px 0 10px;",
    stack: "white-space: break-spaces; color: #ffffff7f; text-shadow: #aaa 1px 0 12px;",
    red: "white-space: break-spaces; color: red; text-shadow: red 1px 0 12px;",
    yellow: "white-space: break-spaces; color: yellow; text-shadow: yellow 1px 0 12px;",
    pink: "white-space: break-spaces; color: pink; text-shadow: pink 1px 0 12px;",
    blue: "white-space: break-spaces; color: #8383d2; text-shadow: #8383d2 1px 0 12px;"
}

function hash(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
	  	k1 =
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;

		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}

	k1 = 0;

	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);

		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}


/*
    STRING HASH HELPER OBJECT
*/
function Hash(str)
{
    /*
        constructor for an object containing both hash and string
        gets passed by reference so its likely faster than string
        same speed as passing hash alone, but at the cost of couple bytes
    */
    s = str
    h = hash(s)

    this.set = (str) =>
    {
        s = str
        h = hash(s)
    }
    this.hash = () => { return h }
    this.string = () => { return s }

    return this
}


/*
    HASHMAP USES STRING, OBJ OR KEY TO IDENTIFY VALUES
*/
function HashMap()
{
    /*
        it's a hash map. thats it
        it works. i think
    */

    /*
        token maps in addition to base values map for ease of access
        in rare situations
    */
    this.strings = new Map() //strings mapped by hash, hash-string pair
    this.keys = new Map() //hashes mapped by string, string-hash pair
    this.values = new Map() // values mapped by hash, hash-value pair

    this.get = (token) =>
    {
        /*
            switch which variable is used as key
            sacrificed minimal performance for convenience of use
            three getters depending on key type seemed like
            solution for edge cases
        */
        const type = typeof(token)
        try // successful try often faster than multiple ifs
        {
            switch(type)
            {
                case "number": { return this.values.get(token) } //hash number directly
                case "object": { return this.values.get(token.hash()) } //hash
                case "string":
                {
                    if (this.keys.has(token))
                        return this.values.get(this.keys.get(token))
                    else
                        return this.values.get(new Hash(token))

                } //unhashed string
            }
        }
        catch(e)
        {
            console.warn(e)
        }
    }
    this.getByString = (string) => { return this.values.get(this.keys.get(string)) }
    this.getByHash = (key) => { return this.values.get(key) }
    this.getHash = (token) =>
    {
        /*
            gets hash value for provided string token
        */
        return this.keys.get(token)
    }
    this.getString = (token) =>
    {
        /*
            gets string for provided hash token
        */
        const type = typeof(token)
        if (type != "object") //number is more likely
            return this.strings.get(token)
        else
            return this.strings.get(token.hash())
    }
    this.set = (key, value) =>
    {
        /*
            generates hash, writes keys to maps for ease of access
            and in case only one type of token exists
        */
        const keyType = typeof(key)
        switch(keyType)
        {
            case "number": // key is int
            {
                if (this.values.has(key)) //if already presumably in the map
                    return false;

                //assigning only values because
                //there's no way to calculate string from hash number
                this.values.set(key, value)
                return key
                break
            }
            case "object": //key is hash
            {
                if (this.values.has(key.hash()))
                    return false

                this.strings.set(key.hash(), key.string())
                this.keys.set(key.string(), key.hash())
                this.values.set(key.hash(), value)
                return key.hash()
                break
            }
            case "string":
            {
                if (this.strings.has(key))
                    return false;

                const hash = new Hash(key)
                this.strings.set(hash.hash(), hash.string())
                this.keys.set(hash.string(), hash.hash())
                this.values.set(hash.hash(), value)

                return hash.hash()
            }
        }
    }
    this.del = (token) =>
    {
        /*
            entrius deletus
        */
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { key = token, string = this.strings.get(token); break; }
            case "object": { key = token.hash(), string = token.string(); break; }
            case "string": { key = this.keys.get(token), string = token; break; }
        }

        if (string && this.keys.has(string))
            this.keys.delete(string)
        if (key && this.strings.has(key))
            this.strings.delete(key)
        if (key && this.values.has(key))
            this.values.delete(key)
    }
    this.has = (token) =>
    {
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { return this.keys.has(token); break; }
            case "object": { return this.keys.has(token.get()); break; }
            case "string": { return this.strings.has(token); break; }
        }
    }
}

/*
    PROGRESS HELPER OBJECT
*/
function Progress(loaded, total)
{
    /*
        progress object to count percentages and fractions for progress bars
    */
    this.loaded = loaded
    this.total = total

    this.getFraction = () =>
    {
        //fraction is rounded to 4 decimal places
        return +((this.loaded/this.total).toFixed(4))
    }

    this.getPercentage = () =>
    {
        //percentage is rounded to 2 decimal places
		return +( ( this.getFraction() * 100 ).toFixed(2) )
    }

    return this
}

function EMap()
{
    /*
        map with events
    */
    this.map = new Map()
    this.events = {'set': new Map(), 'del': new Map(), 'has': new Map()}

    this.on = (event, key, method) =>
    {
        if (this.events[event] && this.events[event].has(key))
        {
            let functions = this.events[event].get(key)
            this.events[event].set(key) = functions.push(method)
        }
    }
    this.off = (key, method) =>
    {

    }
    this.set = (key, value, method) =>
    {
        this.map.set(key, value)
    }
    this.del = (key) =>
    {

    }
    this.has = (key) =>
    {

    }
}

function gib(args)
{
    /*
        fetches from location
    */
    return new Promise( async (resolve) =>
    {
        if (!args) // if no args, nothing to do
            resolve("ERROR: No arguments passed to gib.")

        const req = new XMLHttpRequest()
        if (args.progress) //use progress function if present
            req.onprogress = (event) =>
            {
                try
                {
                    args.progress(new Progress(event.loaded, event.total))
                }
                catch (error)
                {
                    console.groupCollapsed('%c gib() onprogress() error.', style.error)
                    console.log("%c Arguments:", style.log)
                    console.log(args)
                    console.log("%c Error Message:", style.log)
                    console.log(error)
                    console.groupEnd()
                }
            }

        req.onreadystatechange = async () => //process response
        {
            if (req.readyState === XMLHttpRequest.DONE)
            {
                const status = req.status
                if (status === 0 || (status >= 200 && status < 400))
                {
                    resolve(req.response)
                }
                else
                {
                    console.groupCollapsed('%c gib() connection error.  ', style.error)
                    console.log("%c Arguments:", style.log)
                    console.log(args)
                    console.log("%c Request Object:", style.log)
                    console.log(req)
                    console.groupEnd()
                    resolve(undefined) //TODO much later error handling
                }
            }
        }
        if (args.type) //if response type present
            req.responseType = args.type

        req.open(args.method ? args.method : "GET", args.location)
        req.send()
    })
}


/*

*/
function drop(error)
{

}

function PeeriPeeri(url = "index.json", selector = '[flatPlaneOfProjectionWithConvenientProgrammaticalWrapperAroundDisplayedContentCommonlyKnownAsScreenFrameOrContainer]')
{
    this.container = $(selector)
    if (!this.container)
    {
        this.container = $('body')
        console.groupCollapsed('%c Target container not found. I\'m taking over your body sucka!', style.error)
        console.log("%c Selector:" + selector, style.log)
        console.groupEnd()
    }

    const t = this

    this.transfers = new EMap()

    this.boot = {}
    this.boot.init = async () =>
    {
        const map = await this.loadMap(url)
        if (map)
            await this.open(map)
    }
    /*

    */
    this.loadMap = (url) =>
    {
        return new Promise(async (resolve) =>
        {
            let map;
            const mapRaw = await this.gib({location: url})

            if (mapRaw && mapRaw[0] === '{')
            {
                try
                {
                    map = JSON.parse(mapRaw)
                } catch (log)
                {
                    console.groupCollapsed('%c I have eaten bad JSON file. Tryna poison me, huh?', style.error)
                    console.log("%c URL:", style.log)
                    console.log(url)
                    console.log("%c Error Message:", style.log)
                    console.log(log)
                    if (mapRaw)
                    {
                        console.log("%c raw file:", style.log)
                        console.log(mapRaw)
                    }
                    console.groupEnd()
                }
            }

            //use shadow dom if supported
            if ($(['diagnostics shadowdom[supported="true"]']))
                console.log('%c TODO: implement shadow dom', style.color3a)

            resolve(map)
        })
    }
    /*

    */
    this.open = async (map) =>
    {
        return new Promise(async (resolve)=>
        {
            const page = map.pages[map.start]
            if (!page)
                return;
            this.load(page).then(()=>{resolve(true)})
        })
    }

    this.load = async (page) =>
    {
        return new Promise(async (resolve) =>
        {
            console.log(page)
            console.log('content/' + page.name + "/" + page.content);
            const content = await gib({location: 'content/' + page.name + "/" + page.content})
            // window.history.replaceState(content, page.title, "/loading")
            console.log(location)

            this.container.innerHTML = content

            let script = document.createElement("script")
            script.setAttribute("type", "text/javascript")
            script.setAttribute("src", 'content/' + page.name + "/" + page.script)

            this.container.appendChild(script)
        })
    }

    /*
        fetches from location
    */
    this.gib = (args) =>
    {
        return new Promise( async (resolve) =>
        {
            if (!args) // if no args, nothing to do
                resolve("ERROR: No arguments passed to gib.")

            this.transfers.on(args.location, (event)=>{console.log("%c urgeo ergo sum, i am triggered therefore i am.", style.log)})

            const req = new XMLHttpRequest()
            req.onprogress = (event) =>
            {
                    this.transfers.set(args.location, {loaded: event.loaded, total: event.total})
            }

            req.onreadystatechange = async () => //process response
            {
                if (req.readyState === XMLHttpRequest.DONE)
                {
                    const status = req.status

                    //
                    this.transfers.del(args.location)

                    if (status === 0 || (status >= 200 && status < 400))
                    {
                        resolve(req.response)
                    }
                    else
                    {
                        console.groupCollapsed('%c gib() connection error.  ', style.error)
                        console.log("%c Arguments:", style.log)
                        console.log(args)
                        console.log("%c Request Object:", style.log)
                        console.log(req)
                        console.groupEnd()
                        resolve(undefined) //TODO much later error handling
                    }
                }
            }
            if (args.type) //if response type present
                req.responseType = args.type

            req.open(args.method ? args.method : "GET", args.location)
            req.send()
        })
    }

    /*

    */
    t.boot.init()
}
