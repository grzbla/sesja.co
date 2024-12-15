const norm = {
    rules:
    {
        1: "Can survive in equitable utopian society.",
        2: ["Able to survive in generous and forgiving environment.",
            "Capable of operating on binary level: yes/no, right/wrong, left/right",
            "Unconscious incompetence"],
        3: ["Will prosper with lifetime worth of inheritance.",
            "Capable of producing words to back up own stance.",
            "Conscious incompetence"],
        4: ["Could achieve a livable standard in free and fair environment.",
            "Can form indeptendent opinions.",
            "conscious competence"],
        5: ["Will prosper in limited or closely controlled economy.",
            "Can predict and avoid mistakes."],
        6: ["Capable of surviving in resource scarce environment.",
            "Can formulate complex plans.",
            "Unconscious competence"],
        7: ["Able to thrive in a cut-throat dog eat dog world.",
            "Does always extra."],
        8: [],
        9: [],
        10: []
    },
    phases:
    {

    },
    challenge:{
        2: ["easy"],
        3: ["average"],
        4: ["risky"],
        5: ["difficult"],
        6: ["tough"],
        7: ["extreme"],
        8: ["crushing"],
        9: [""],
        10: ["inhuman"],
    },
    skills:
    {
        "Luck":
        {
            type: "upgrades or something",
            "Beginner's Luck": ["For the purpose of this roll, your total roll level is 5."],
            "Intermediate's Luck": ["For the purpose of this roll, your total roll level is 5."],
            "Pro Luck": ["Get +1D4 Luck Die."]
        },
        "telepathic aid": "can use microaction to give telepatic tips granting bonus for current actions to target character",
        "generic talents":
        {
            "legacy": "you continue or usurp legacy of someone who passed.",
            "know a guy": "you know a guy who can do affiliated thing as well as you do.",
            "mentor": "gib bonus to someone who has lower skill?"
        },
        "gangster/rogue": {
            "description": "managing attention, suspicion and guilt"
            "talents": {
                "no stranger": {"description": "give off that street vibe that u not a snitch"},
                "unassuming": {"description": "Evades elevated attention."},
                "unnotticed": {"description": "Slip unnotticed when Assumed Suspicious. Exploit gaps in awareness and cognition."},
                "slippery": {"description": "Move when Assumed Guilty."},
                "leverage": {"description": "Reclaim freedom when Apprehended."},
                "admired": {"description": "your fans and enemies always obscure operations against you."},
            },
        },
        "equestrian": {
            "talents": {
                "caretaking": {"description": "handle ailments, provide optimal nutrition, entertainment and excercise"},
                "recovery": {"description": "can recover from being knocked off the mount"},
                "handling": {"description": "can handle mount when it gets emotional"},
                "control": {"description": "can push mount to it's limits"},
                "bonding": {"description": "mount can look up to you and understand the importance of pushing the limits."},
                "understanding": {"description": "can communicate with mount with body language and imitation sounds"},
            }
        },
        "blacksmith":
        {
            "talents": {
                "armory": "crafting weapons and armor",
                "mineralogy": "knowledge of materials outside of your work experience",
                "alloys": "melding stuffs",
                "refining": "removing impurities",
                "casting": "metal casting usually for utility crafting",
                "batching": "do same thing in large quantities",
                "artisanal": "make it pretty n shit",
                "masterwork": "produce as high quality as possible",
                "improvisation": "can work with substitute materials and tools",
            }
        },
        "carpentry": {
            "dendrology": "knowledge of wood outside of your work experience",
            "architecture": "can make plans for others. good plans good bonuses",
            "construction": "can make buildings and coordinate teams",
            "artisanal": "fancy shmancy",
            "masterwork": "produce as high quality as possible",
            "shipwright": "ships",
            "engineering": "can build things that move",
            "bowmaking": "and arrowmaking",
            "foraging": "can find your own materials in the wild",
        },
        "masonry":
        {
            "architecture": "plannen",
            "construction": "bulden",
            "lithology": "rocks",
            "artisanal": "handsome rocks",
            "engineering": "can build things that move or enable movement",
            "siege": "build things which break other things or resist being broken by things which break other things",
            "roofing": "not the bill cosby type",
            "monumental": "make big things which make people go 'ooh'",
            "masterwork": "make one of a kind thing"
        },
        "landworking":
        {

        },
        "sailor": {},
        "tribe": {}
        "vagabond": {
            "talents": {}
        },
        "aristocracy":
        {
            "acreocracy": "",
        },
        "archer":{},
        "academics": {},
        "commander": {},
        "diplomat": {},
        "marauder": {},
        "alchemist":
        {
            "brewery": "specialization in brewing",
            "gastronomy": "specialization in cooking",
            "catalysis": "increase reactions by adding stuff",
            "scribe": "recipes",
            "preservation": "dry, powder, freeze, pickle",
            "concentrates": "create concentrations of substance",
            "distilation": "separate one substance from others",
            "charlatan": "do same amount with less ingredient",
            "transmutation": "change one type of matter into another"
        },
        "wizard":
        {
            "savant": "restore spell when casting a spell of level lower than skill and spell level",
            "overprepare": "have a spell at ready without consuming spell slots"
        },
        "diviner":
        {
            "portent": "record rolls during rest and use them instead of test rolls"
            "mage sight": "darkvision/language comprehension/see invisible"
        },
        "abjurer":
        {
            "arcane ward": "warding potential charged when casting abj spells",
            "protection ward": "target dmg reduction",
            "spell resistance": "passive spell avoidance and damage resistance",
        },
        "evoker":
        {
            "arcane potency": "partial spell effect on miss or failure",
            "sculpt spells": "partial spell effect on friendly hit",
            "overchannel": "add to damage at the price of receiving damage"
        },
        "invoker":
        {
            "arcane potency": "partial spell effect on miss or failure",
            "sculpt spells": "partial spell effect on friendly hit",
            "overchannel": "add to damage at the price of receiving damage"
        },
        "enchanter":
        {
            "enchant target": "gib effect to one target",
            "enchant item": "gib effect to one prop",
            "enchant area": "gib effect to area",

        },
        "diviner":
        {
            "portent": "record rolls during rest and use them instead of test rolls",
            "": ""
        },
        "bladesinger": {},
        "blood mage": {},
        "necromancer": {},
        "demonologist": {},
        "conjurer": {},
        "illusionist":
        {
            "simulation": "cast illusions with any vocal substitute of verbal component",
            "misdirection": "create a convincing illusion of external stimuli or situation",
            "displacement": "create a convincing illusion of yourself",
            "switch": "swap places with your illusory clone on hit",
            "load": "part of the illusion becomes physical"
        },
        "warmage": "",
        "sorcerer": "",
        "investigator":
        {
            "description": "sorcerer specializing in investigating the strange, paranormal and aberrant"
        },
        "mechatron":
        {
            "description": "sorcerer whose soul is from mechanized plane like Mechanus"
        },
        "divine soul":
        {
            "description": "sorcerers from celestial sources"
        },
        "draconic lineage":
        {
            "description": "sorcerers from magic dragon blood"
        },
        "astrologer":
        {
            "description": "sorcerers from magic powers of the space and planets and shit"
        },
        "shadowfallen":
        {
            "description": "sorcerers from shadowfell edgelord powers"
        },
        "wind whisperer":
        {
            "description": "sorcerers weather powers"
        },
        "chaos sorc":
        {
            "description": "sorcerers with wild magic"
        },
        "priest":
        {
            "turn undead": "",
            "destroy undead": "",
            "divine intervention": "",
            "ritualism": "",
            "": ""
        },
        "domain":
        {

        },
        "druid": {},
        "circle": {},
        "warlock":
        {
            "patron theme":"",
            "safe space weapon":"",
            "curse debuff": "hp sucka",
        },
        "patron": {},
        "martial artist": {},
        "tradition": {},
        "artificer":
        {
            "talents":
            {
                "harness": "can reliably attach things to beings"
            }
        },
        "machinist": "generates magic power with steam machines",
        "academy": {}

    },
    routines:
    {

    },
    "secondary":
    {
        "merchant": {},
        "jeweler": {},
        "forger": {},
        "linguist": {},
        "gambler": {},
        "highlander": {},
        "islander": {},
        "woodlander": {},
    },
    epochs:
    {
        archaic:
        {
            human:
            {
                hunting: 5,
                gathering: 5
            },

        },
        ancient:
        {
            human:
            {
                master:
                {

                },
                slave:
                {

                }
            },
        },
        modern:
        {

        },
        postmodern:
        {

        }
    }
}
