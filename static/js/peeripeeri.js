function PeeriPeeri(url = "index.json")
{
    const t = this

    this.transfers = new EMap()

    this.boot = {}
    this.boot.init = async () =>
    {
        const opened = await this.open(url)
    }
    /*

    */
    this.load = (location, target) =>
    {
        return new Promise(async (resolve) =>
        {
            let page;
            const pageRaw = await this.gib({location: location})

            if (pageRaw) try
            {
                page = JSON.parse(pageRaw)
            } catch (log)
            {
                console.groupCollapsed('%c Provided file, which I heroically tried to open, is sort of wonky.', style.error)
                console.log("%c URL:", style.log)
                console.log(location)
                console.log("%c Error Message:", style.log)
                console.log(log)
                if (pageRaw)
                {
                    console.log("%c raw file:", style.log)
                    console.log(pageRaw)
                }
                console.groupEnd()
            }

            let queries = []
            Object.keys(page).forEach((key) =>
            {
                key.split(",").forEach((splat) => {queries.push(splat)})
            })

            //use shadow dom if supported
            if ($(['diagnostics shadowdom[supported="true"]']))
                console.log('%c TODO: implement shadow dom', style.color3a)

            queries.forEach((query) =>
            {
                this.createPath(query, target)
            })

            resolve(page)
        })
    }
    /*

    */
    this.open = async (location, target = 'body') =>
    {
        const page = await this.load(location, target)
        if (!page)
            return false;

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
        VOLATILE
        made to only fit whatever is needed at specific time
    */
    this.createPath = (inputSelector, target) =>
    {
        let parent = $(target)

        inputSelector.split(" ").forEach((elementSelector) =>
        {
            let selectorChunks = {name: 'tags', content: []}

            const existingElement = $(elementSelector, parent)
            if (existingElement)
            {
                parent = existingElement
                return
            }

            let element = document.createElement('div')

            elementSelector.split("][").forEach((tag) =>
            {
                const replaced = tag.replaceAll("]", "").replaceAll("[", "")
                selectorChunks.content.push(replaced)
                element.setAttribute(replaced, "")
            })

            parent.appendChild(element)
            parent = $(elementSelector, parent)
        })
    }



    this.e404 = () =>
    {

    }

    /*

    */
    t.boot.init()
}

const pp = new PeeriPeeri()
