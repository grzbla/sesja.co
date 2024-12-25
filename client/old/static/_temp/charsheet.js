//needs current ruleset

function logicPlease()
{
    this.attributes
    {
        getBarValue: (val) =>
        {
            for (let i = 0, l = rules.attributes.limits.length; i < l; i++)
            {
                const limit = rules.attributes.limits[i]
                const bar = val / (limit ? limit : 1)
                if (bar <= 1)
                    return bar
            }
        }
    }

}


const logic = new logicPlease()
