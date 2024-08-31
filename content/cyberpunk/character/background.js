const cyberpunk = {character: {background: {}}}
cyberpunk.character.background.region =
{
    url: 'pic',
    name: 'Cultural Region',
    description: [
        "The Cyberpunk world is multicultural and multinational. You either learn to deal with all kinds of people from all over a fractured and chaotic world, or you die the first time you look side-eye at the wrong person. Where you come from determines your native language. In RED, we assume everyone speaks Streetslang, the pidgin that has evolved to be used by almost everyone in the Dark Future, but you probably also have another primary tongue you learned at your mother's knee. After rolling to determine your general cultural region, choose one of the languages from the list adjacent to your cultural region. You begin with 4 points in that Language Skill. There are hundreds of languages spoken around the world but for our purposes here we've listed the most commonly spoken languages in each region during the Time of the Red. If you want your Character to speak a language that isn't represented you can go ahead and choose that language instead of one of the listed languages"
    ],
    rule: [
        "Roll 1d10 or choose one."
    ],
    trait: {
            "label": "Your (General) Cultural Region",
            "values": [
                ["North American"],
                ["South/Central American"],
                ["Western European"],
                ["Eastern European"],
                ["Middle Eastern/North African"],
                ["Sub-Saharan African"],
                ["South Asian"],
                ["South East Asian"],
                ["East Asian"],
                ["Oceania/Pacific Islander"]
            ]
        }
}

cyberpunk.character.background.status = {
    "name": "Your Original Family Background ",
    "description": [
        "Now we know what you're basically like, so it's time to find out how you got there: it's time to explore your Background.",
        "Who are you and where did you originally come from? Were you born with a silver spoon in your mouth or were you using it to stab your brother so you could steal that extra bite of dead rat you both found?"
    ],
    "traits": [{
            "label": "Original Background",
            "values": [
                "Corporate Execs",
                "Corporate Managers",
                "Corporate Technicians",
                "Nomad Pack",
                "Ganger 'Family'",
                "Combat Zoners",
                "Urban Homeless",
                "Megastructure Warren Rats",
                "Reclaimers",
                "Edgerunners"
            ]
        },
        {
            "label": "Description",
            "values": [
                "Wealthy, powerful, with servants, luxury homes, and the best of everything. Private security made sure you were always safe. You definitely went to a big-name private school.",
                "Well to do, with large homes, safe neighborhoods, nice cars, etc. Sometimes your parent(s) would hire servants, although this was rare. You had a mix of private and corporate education.",
                "Middle-middle class, with comfortable condos or Beaverville suburban homes, minivans, and corporate-run technical schools. Kind of like living 1950s America crossed with 1984.",
                "You had a mix of rugged trailers, vehicles, and huge road kombis for your home. You learned to drive and fight at an early age, but the family was always there to care for you. Food was actually fresh and abundant. Mostly home schooled.",
                "A savage, violent home in any place the gang could take over. You were usually hungry, cold, and scared. You probably didn't know who your actual parents were. Education? The Gang taught you how to fight, kill, and steal—what else did you need to know?",
                "A step up from a gang 'family,' your home was a decaying building somewhere in the 'Zone,' heavily fortified. You were hungry at times, but regularly could score a bed and a meal. Home schooled.",
                "You lived in cars, dumpsters, or abandoned shipping modules. If you were lucky. You were usually hungry, cold, and scared, unless you were tough enough to fight for the scraps. Education? School of Hard Knocks.",
                "You grew up in one of the huge new megastructures that went up after the War. A tiny conapt, kibble and scop for food, a mostly warm bed. Some better educated adult warren dwellers or a local Corporation may have set up a school.",
                "You started out on the road, but then moved into one of the deserted ghost towns or cities to rebuild it. A pioneer life: dangerous, but with plenty of simple food and a safe place to sleep. You were home schooled if there was anyone who had the time.",
                "Your home was always changing based on your parents' current 'job.' Could be a luxury apartment, an urban conapt, or a dumpster if you were on the run. Food and shelter ran the gamut from gourmet to kibble."
            ]
        }
    ]
}
"environment": {
    "name": "Your Environment",
    "description": "How did you grow up? What kind of places did you and your sibs hang out in? Safe and calm? Crazy dangerous? Massively oppressive? It's possible that something happened in your background and your environment turns out drastically different from your original family background.",
    "rule": [
        "Roll 1d10 or choose one."
    ],
    "trait": [{
        "label": "Childhood Environment",
        "values": [
            "Ran on The Street, with no adult supervision.",
            "Spent in a safe Corp Zone walled off from the rest of the City.",
            "In a Nomad pack moving from place to place.",
            "In a Nomad pack with roots in transport (ships, planes, caravans).",
            "In a decaying, once upscale neighborhood, now holding off the boosters to survive.",
            "In the heart of the Combat Zone, living in a wrecked building or other squat.",
            "In a huge 'megastructure' building controlled by a Corp or the City.",
            "In the ruins of a deserted town or city taken over by Reclaimers.",
            "In a Drift Nation (a floating offshore city) that is a meeting place for all kinds of people.",
            "In a Corporate luxury 'starscraper,' high above the rest of the teeming rabble."
        ]
    }]
}



const ass = {
    "language":
    {

        "trait":
        {
            "requirement": {"name": "region", "value": "North American"}
            "label": "Languages You Might Know (pick one in your group)",
            "values": [
                [
                    "Chinese",
                    "Cree",
                    "Creole",
                    "English",
                    "French",
                    "Navajo",
                    "Spanish"
                ],
                [
                    "Creole",
                    "English",
                    "German",
                    "Guarani",
                    "Mayan",
                    "Portuguese",
                    "Quechua",
                    "Spanish"
                ],
                [
                    "Dutch",
                    "English",
                    "French",
                    "German",
                    "Italian",
                    "Norwegian",
                    "Portuguese",
                    "Spanish"
                ],
                [
                    "English",
                    "Finnish",
                    "Polish",
                    "Romanian",
                    "Russian",
                    "Ukrainian"
                ],
                [
                    "Arabic",
                    "Berber",
                    "English",
                    "Farsi",
                    "French",
                    "Hebrew",
                    "Turkish"
                ],
                [
                    "Arabic",
                    "English",
                    "French",
                    "Hausa",
                    "Lingala",
                    "Oromo",
                    "Portuguese",
                    "Swahili",
                    "Twi",
                    "Yoruba"
                ],
                [
                    "Bengali",
                    "Dari",
                    "English",
                    "Hindi",
                    "Nepali",
                    "Sinhalese",
                    "Tamil",
                    "Urdu"
                ],
                [
                    "Arabic",
                    "Burmese",
                    "English",
                    "Filipino",
                    "Hindi",
                    "Indonesian",
                    "Khmer",
                    "Malayan",
                    "Vietnamese"
                ],
                [
                    "Cantonese Chinese",
                    "English",
                    "Japanese",
                    "Korean",
                    "Mandarin Chinese",
                    "Mongolian"
                ],
                [
                    "English",
                    "French",
                    "Hawaiian",
                    "Maori",
                    "Pama-Nyungan",
                    "Tahitian"
                ]
            ]
        }
    },
    "character/personality": {
            "description": [
                "This is what you're like as a person. Are you the kind of Character that stands away from the pack, aloof and calculating? A party animal who loves to get messed up? The stable and competent professional who always has a plan?"
            ],
            "trait": [{
                "label": "What Are You Like?",
                "values": [
                    ["Shy and secretive"],
                    ["Rebellious, antisocial, and violent"],
                    ["Arrogant, proud, and aloof"],
                    ["Moody, rash, and headstrong"],
                    ["Picky, fussy, and nervous"],
                    ["Stable and serious"],
                    ["Silly and fluff-headed"],
                    ["Sneaky and deceptive"],
                    ["Intellectual and detached"]
                ]
            }]
        },
        "character/style": {
            "name": "Dress and Personal Style",
            "description": [
                "In Cyberpunk, what you look like is (to The Street) a snapshot of who you are. Your clothes, hairstyles and even personal touches can determine how people will relate to you, for good or for bad. Remember: an Exec wearing Street Casual, a rainbow mohawk, and ritual scars is probably not going to get that promotion they wanted.",
                "Note that your clothing style is more about the style of clothes you favor, not the individual items. You could wear a tailored business suit jacket, a rawhide fringed Nomad jacket, a high-tech light collared urban flash jacket, or even a torn and ripped leather jacket with gang colors all over the back. Each one is the same item of clothing (jacket), but defined by the style of jacket your Character favors."
            ],
            "rule": [
                "Roll 1d10 or choose one for each column."
            ],
            "trait": [{
                    "label": "Clothing Style",
                    "values": [
                        "Generic Chic (Standard, Colorful, Modular)",
                        "Leisurewear (Comfort, Agility, Athleticism)",
                        "Urban Flash (Flashy, Technological, Streetwear)",
                        "Businesswear (Leadership, Presence, Authority)",
                        "High Fashion (Exclusive, Designer, Couture)",
                        "Bohemian (Folksy, Retro, Free-spirited)",
                        "Bag Lady Chic (Homeless, Ragged, Vagrant)",
                        "Gang Colors (Dangerous, Violent, Rebellious)",
                        "Nomad Leathers (Western, Rugged, Tribal)",
                        "Asia Pop (Bright, Costume-like, Youthful)"
                    ]
                },
                {
                    "label": "Hairstyle",
                    "values": [
                        "Mohawk",
                        "Long and ratty",
                        "Short and spiked",
                        "Wild and all over",
                        "Bald",
                        "Striped",
                        "Wild colors",
                        "Neat and short",
                        "Short and curly",
                        "Long and straight"
                    ]
                }
            ]
        },
        "affectation": {
            "rule": [
                "Roll 1d10 or choose one."
            ],
            "trait": [{
                "label": "Affectation You Are Never Without",
                "values": [
                    "Tattoos",
                    "Mirrorshades",
                    "Ritual scars",
                    "Spiked gloves",
                    "Nose rings",
                    "Tongue or other piercings",
                    "Strange fingernail implants",
                    "Spiked boots or heels",
                    "Fingerless gloves",
                    "Strange contacts"
                ]
            }]
        },
        "motivations": {
            "name": "Your Motivations and Relationships",
            "rule": [
                "Roll 1d10 or choose one."
            ],
            "trait": [{
                    "label": "What Do You Value Most?",
                    "values": [
                        "Money",
                        "Honor",
                        "Your word",
                        "Honesty",
                        "Knowledge",
                        "Vengeance",
                        "Love",
                        "Power",
                        "Family",
                        "Friendship"
                    ]
                },
                {
                    "label": "How Do You Feel About Most People?",
                    "values": [
                        "I stay neutral.",
                        "I stay neutral.",
                        "I like almost everyone.",
                        "I hate almost everyone.",
                        "People are tools. Use them for your own goals then discard them.",
                        "Every person is a valuable individual.",
                        "People are obstacles to be destroyed if they cross me.",
                        "People are untrustworthy. Don't depend on anyone.",
                        "Wipe 'em all out and let the cockroaches take over.",
                        "People are wonderful!"
                    ]
                }
            ]
        },
        "most valued": {
            "name": "Things You Value the Most?",
            "rule": [
                "Roll 1d10 or choose one."
            ],
            "trait": [{
                    "label": "Most Valued Person in Your Life?",
                    "values": [
                        "A parent",
                        "A brother or sister",
                        "A lover",
                        "A friend",
                        "Yourself",
                        "A pet",
                        "A teacher or mentor",
                        "A public figure",
                        "A personal hero",
                        "No one"
                    ]
                },
                {
                    "label": "Most Valued Possession You Own?",
                    "values": [
                        "A weapon",
                        "A tool",
                        "A piece of clothing",
                        "A photograph",
                        "A book or diary",
                        "A recording",
                        "A musical instrument",
                        "A piece of jewelry",
                        "A toy",
                        "A letter"
                    ]
                }
            ]
        },
        "background": {
            "name": "Your Original Family Background ",
            "description": [
                "Now we know what you're basically like, so it's time to find out how you got there: it's time to explore your Background.",
                "Who are you and where did you originally come from? Were you born with a silver spoon in your mouth or were you using it to stab your brother so you could steal that extra bite of dead rat you both found?"
            ],
            "traits": [{
                    "label": "Original Background",
                    "values": [
                        "Corporate Execs",
                        "Corporate Managers",
                        "Corporate Technicians",
                        "Nomad Pack",
                        "Ganger 'Family'",
                        "Combat Zoners",
                        "Urban Homeless",
                        "Megastructure Warren Rats",
                        "Reclaimers",
                        "Edgerunners"
                    ]
                },
                {
                    "label": "Description",
                    "values": [
                        "Wealthy, powerful, with servants, luxury homes, and the best of everything. Private security made sure you were always safe. You definitely went to a big-name private school.",
                        "Well to do, with large homes, safe neighborhoods, nice cars, etc. Sometimes your parent(s) would hire servants, although this was rare. You had a mix of private and corporate education.",
                        "Middle-middle class, with comfortable condos or Beaverville suburban homes, minivans, and corporate-run technical schools. Kind of like living 1950s America crossed with 1984.",
                        "You had a mix of rugged trailers, vehicles, and huge road kombis for your home. You learned to drive and fight at an early age, but the family was always there to care for you. Food was actually fresh and abundant. Mostly home schooled.",
                        "A savage, violent home in any place the gang could take over. You were usually hungry, cold, and scared. You probably didn't know who your actual parents were. Education? The Gang taught you how to fight, kill, and steal—what else did you need to know?",
                        "A step up from a gang 'family,' your home was a decaying building somewhere in the 'Zone,' heavily fortified. You were hungry at times, but regularly could score a bed and a meal. Home schooled.",
                        "You lived in cars, dumpsters, or abandoned shipping modules. If you were lucky. You were usually hungry, cold, and scared, unless you were tough enough to fight for the scraps. Education? School of Hard Knocks.",
                        "You grew up in one of the huge new megastructures that went up after the War. A tiny conapt, kibble and scop for food, a mostly warm bed. Some better educated adult warren dwellers or a local Corporation may have set up a school.",
                        "You started out on the road, but then moved into one of the deserted ghost towns or cities to rebuild it. A pioneer life: dangerous, but with plenty of simple food and a safe place to sleep. You were home schooled if there was anyone who had the time.",
                        "Your home was always changing based on your parents' current 'job.' Could be a luxury apartment, an urban conapt, or a dumpster if you were on the run. Food and shelter ran the gamut from gourmet to kibble."
                    ]
                }
            ]
        },
        "environment": {
            "name": "Your Environment",
            "description": "How did you grow up? What kind of places did you and your sibs hang out in? Safe and calm? Crazy dangerous? Massively oppressive? It's possible that something happened in your background and your environment turns out drastically different from your original family background.",
            "rule": [
                "Roll 1d10 or choose one."
            ],
            "trait": [{
                "label": "Childhood Environment",
                "values": [
                    "Ran on The Street, with no adult supervision.",
                    "Spent in a safe Corp Zone walled off from the rest of the City.",
                    "In a Nomad pack moving from place to place.",
                    "In a Nomad pack with roots in transport (ships, planes, caravans).",
                    "In a decaying, once upscale neighborhood, now holding off the boosters to survive.",
                    "In the heart of the Combat Zone, living in a wrecked building or other squat.",
                    "In a huge 'megastructure' building controlled by a Corp or the City.",
                    "In the ruins of a deserted town or city taken over by Reclaimers.",
                    "In a Drift Nation (a floating offshore city) that is a meeting place for all kinds of people.",
                    "In a Corporate luxury 'starscraper,' high above the rest of the teeming rabble."
                ]
            }]
        },
        "family crisis": {
            "name": "Your Family Crisis",
            "description": "In the Time of the Red, the world is still recovering from a world war and other disasters. Chances are, something happened to you and your family along the way. What's the story there?",
            "trait": [{
                "label": "Childhood Environment",
                "values": [
                    "Your family lost everything through betrayal.",
                    "Your family lost everything through bad management.",
                    "Your family was exiled or otherwise driven from their original home/nation/Corporation.",
                    "Your family is imprisoned, and you alone escaped.",
                    "Your family vanished. You are the only remaining member.",
                    "Your family was killed, and you were the only survivor.",
                    "Your family is involved in a long-term conspiracy, organization, or association, such as a crime family or revolutionary group.",
                    "Your family was scattered to the winds due to misfortune.",
                    "Your family is cursed with a hereditary feud that has lasted for generations.",
                    "You are the inheritor of a family debt; you must honor this debt before moving on with your life."
                ]
            }]
        },
        "friends": {
            "name": "Your Friends",
            "description": "It's not all grim. Sometimes you link up with people who have your back.",
            "rule": [
                "Roll 1d10 and subtract 7 (minimum 0) to see just how many friends you've made so far in your life. For each friend, roll on the table below."
            ],
            "trait": [{
                "label": "Friend's Relationship to You",
                "values": [
                    "Like an older sibling to you.",
                    "Like a younger sibling to you.",
                    "A teacher or mentor.",
                    "A partner or coworker.",
                    "A former lover.",
                    "An old enemy.",
                    "Like a parent to you.",
                    "An old childhood friend.",
                    "Someone you know from The Street.",
                    "Someone with a common interest or goal."
                ]
            }]
        },
        "enemies": {
            "name": "Your Enemies",
            "description": ["Enemies are a big part of life in the Cyberpunk world. You're going to get in someone's face sooner or later, so you might as well find out who they are, why there's a beef, and what they can do to you to even a score."],
            "rule": ["First, roll 1d10 and subtract 7 (minimum 0) to determine how many enemies you've made. Then, for each one, decide who was the injured party and roll once on each of the columns below. Once you have determined what your enemy is like, go to the Sweet Revenge table to see how the offended party will act if the two of you ever meet again."],
            "trait": [{
                    "label": "Enemy",
                    "values": [
                        "Ex-friend",
                        "Ex-lover",
                        "Estranged relative",
                        "Childhood enemy",
                        "Person working for you",
                        "Person you work for",
                        "Partner or coworker",
                        "Corporate exec",
                        "Government official",
                        "Boosterganger"
                    ]
                },
                {
                    "label": "What Caused it? Who's been Wronged? (choose)",
                    "valuess": [
                        "Caused the other to lose face or status.",
                        "Caused the loss of lover, friend, or relative.",
                        "Caused a major public humiliation.",
                        "Accused the other of cowardice or some other major personal flaw.",
                        "Deserted or betrayed the other.",
                        "Turned down the other's offer of a job or romantic involvement.",
                        "You just don't like each other.",
                        "One of you was a romantic rival.",
                        "One of you was a business rival.",
                        "One of you set the other up for a crime they didn't commit."
                    ]
                },
                {
                    "label": "What Can They Throw at You?",
                    "valuess": [
                        "Just themselves and even they won't go out of their way.",
                        "Just themselves.",
                        "Just themselves and a close friend.",
                        "Themselves and a few (1d6/2) friends.",
                        "Themselves and a few (1d10/2) friends.",
                        "An entire gang (at least 1d10 + 5 people).",
                        "The local cops or other Lawmen.",
                        "A powerful gang lord or small Corporation.",
                        "A powerful Corporation.",
                        "An entire city or government or agency."
                    ]
                }
            ]
        },
        "revenge": {
            "name": "Sweet Revenge!",
            "traits": [{
                "description": ["It's not really ugly until the bad blood between you and your enemies finally comes to the surface. When you meet, the metal is going to shred. So what's gonna go down when they get back in your face?"],
                "rule": ["Roll 1d10 or choose one."],
                "trait": [{
                    "name": "What are You/They Gonna do About it?",
                    "values": [
                        "Avoid the scum.",
                        "Nothing, just glare at them and move on.",
                        "Go into a murderous rage and try to physically rip their face off.",
                        "Seek revenge by sabotaging their reputation.",
                        "Backstab them indirectly.",
                        "Try to outmaneuver them in a subtle game of wits.",
                        "Verbally attack them.",
                        "Confront them openly and challenge them.",
                        "Set them up for a crime or other transgression they didn't commit.",
                        "Bide your time and set out to murder or maim them."
                    ]
                }]
            }]
        },
        "love affair": {
            "label": "Your Tragic Love Affair(s)",
            "description": ["It wouldn't be Cyberpunk if there was a happily ever-after, now would it? You've probably been involved with someone by now but that may not be the case.",
                "We don't care about the ones that worked; we want to know about the ugly ones that ripped out your heart. We also don't care who they were, what their gender was, or any other details, but feel free to use the Personals sections above to get your own ideas about what they looked like, acted like, and maybe even had in common with you. Not that it mattered in the end, right?"
            ],
            "rule": ["Roll 1d10 and subtract 7 (minimum 0) to see how many tragic love affairs you've had, then use the table below to see how each ended."],
            "traits": [{
                "name": "What Happened?",
                "valuess": [
                    "Your lover died in an accident.",
                    "Your lover mysteriously vanished.",
                    "It just didn't work out.",
                    "A personal goal or vendetta came between you and your lover.",
                    "Your lover was kidnapped.",
                    "Your lover went insane or cyberpsycho.",
                    "Your lover committed suicide.",
                    "Your lover was killed in a fight.",
                    "A rival cut you out of the action.",
                    "Your lover is imprisoned or exiled."
                ]
            }]
        },
        "life goals": {
            "label": "Your Life Goals",
            "description": ["You know your history, your personal style, and your turbulent love life. It's time to wrap all this up by determining what you want out of life."],
            "rule": [
                "Roll 1d10 or choose one."
            ],
            "traits": [{
                "name": "Life Goals",
                "valuess": [
                    "Get rid of a bad reputation.",
                    "Gain power and control.",
                    "Get off The Street no matter what it takes.",
                    "Cause pain and suffering to anyone who crosses you.",
                    "Live down your past life and try to forget it.",
                    "Hunt down those responsible for your miserable life and make them pay.",
                    "Get what's rightfully yours.",
                    "Save, if possible, anyone else involved in your background, like a lover, or family member.",
                    "Gain fame and recognition.",
                    "Become feared and respected."
                ]
            }]
        }
    },
    "rockerboy": {
        "description": "Follow the flowchart to determine the details about your Rockerboy character.",
        "trait": [{
                "label": "What Kind of Rockerboy are You?",
                "rule": "Roll 1d10 or choose one.",
                "valuess": [
                    "Musician",
                    "Slam Poet",
                    "Street Artist",
                    "Performance Artist",
                    "Comedian",
                    "Orator",
                    "Politico",
                    "Rap Artist",
                    "DJ",
                    "Idoru"
                ]
            },
            {
                "step": "Why Did You Leave?",
                "instruction": "Why? Roll 1d6 or choose one.",
                "condition": [{
                        "label": "Are You in a Group or a Solo Act?",
                        "rule": "Choose either in a Group or Solo Act.",
                        "valuess": [
                            "Group",
                            "Solo"
                        ]
                    },
                    {
                        "label": "Were You Once in a Group?",
                        "rule": "Were you once part of a group or have you always been a solo act? Choose one.",
                        "values": [
                            "Yes",
                            "No"
                        ]
                    }
                ],
                "values": [
                    "You were a jerk and the rest of the group voted you out.",
                    "You got caught sleeping around with another member’s mainline.",
                    "The rest of the group was killed in a tragic 'accident.'",
                    "The rest of the group was murdered or otherwise broken up by external enemies.",
                    "The group broke up over 'creative differences.'",
                    "You decided to go solo."
                ]
            },
            {
                "step": "Who’s Gunning for You/Your Group?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Old group member who thinks you did them dirty.",
                    "Rival group or artist trying to steal market share.",
                    "Corporate enemies who don’t like your message.",
                    "Critic or other 'influencer' trying to bring you down.",
                    "Older media star who feels threatened by your rising fame.",
                    "Romantic interest or media figure who wants revenge for personal reasons."
                ]
            },
            {
                "step": "Where Do You Perform?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Alternative Cafes",
                    "Private Clubs",
                    "Seedy Dive Bars",
                    "Guerrilla Performances",
                    "Nightclubs Around the City",
                    "On the Data Pool"
                ]
            }
        ]
    },
    "Solo": {
        "description": "Follow the flowchart to determine the details about your Solo character.",
        "steps": [{
                "step": "What Kind of Solo are You?",
                "instruction": "Roll 1d6 or work with your GM to choose one.",
                "valuess": [
                    "Bodyguard",
                    "Street Muscle for Hire",
                    "Corporate Enforcer who takes jobs on the side",
                    "Corporate or Freelance Black Ops Agent",
                    "Local Vigilante for Hire",
                    "Assassin/Hitman for Hire"
                ]
            },
            {
                "step": "What's Your Moral Compass Like?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Always working for good, trying to take out the 'bad guys.'",
                    "Always spare the innocent (elderly, women, children, pets).",
                    "Will occasionally slip and do unethical or bad things, but it's rare.",
                    "Ruthless and profit centered; you will work for anyone, take any job for the money.",
                    "Willing to bend the rules (and the law) to get the job done.",
                    "Totally evil. You engage in illegal, unethical work all the time; in fact, you enjoy it."
                ]
            },
            {
                "step": "Who's Gunning for You?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "A Corporation you may have angered.",
                    "A boosterganger you may have tackled earlier.",
                    "Corrupt Lawmen or Lawmen who mistakenly think you're guilty of something.",
                    "A rival Solo from another Corp.",
                    "A Fixer who sees you as a threat.",
                    "A rival Solo who sees you as their nemesis."
                ]
            },
            {
                "step": "What's Your Operational Territory?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "A Corporate Zone",
                    "Combat Zones",
                    "The whole City",
                    "The territory of a single Corporation",
                    "The territory of a particular Fixer or contact",
                    "Wherever the money takes you"
                ]
            }
        ]
    },
    "Netrunner": {
        "description": "Follow the flowchart to determine the details about your Runner character.",
        "steps": [{
                "step": "What Kind of Runner are You?",
                "instruction": "Roll 1d6 or work with your GM to choose one.",
                "valuess": [
                    "Freelancer who will hack for hire.",
                    "Corporate 'clone runner' who hacks for the Man.",
                    "Hacktivist interested in cracking systems and exposing bad guys.",
                    "Just like to crack systems for the fun of it.",
                    "Part of a regular team of freelancers.",
                    "Hack for a Media, politico, or Lawman who hires you as needed."
                ]
            },
            {
                "step": "If You Have a Partner, Who Are They?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Family member",
                    "Old friend",
                    "Possible romantic partner as well",
                    "Secret partner who might be a rogue AI. Might.",
                    "Secret partner with mob/gang connections",
                    "Secret partner with Corporate connections"
                ]
            },
            {
                "step": "What's Your Workspace Like?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "There are screens everywhere.",
                    "It looks better in Virtuality, you swear.",
                    "It's a filthy bed covered in wires.",
                    "Corporate, modular, and utilitarian.",
                    "Minimalist, clean, and organized.",
                    "It's taken over your entire living space."
                ]
            },
            {
                "step": "Who are Some of Your Other Clients?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Local Fixers who send you clients.",
                    "Local gangers who also protect your work area while you sweep for NET threats.",
                    "Corporate Execs who use you for 'black project' work.",
                    "Local Solos or other combat types who use you to keep their personal systems secure.",
                    "Local Nomads and Fixers who use you to keep their family systems secure.",
                    "You work for yourself and sell whatever data you can find on the NET."
                ]
            },
            {
                "step": "Where Do You Get Your Programs?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Dig around in old abandoned City Zones.",
                    "Steal them from other Netrunners you brain-burn.",
                    "Have a local Fixer supply programs in exchange for hack work.",
                    "Corporate Execs supply you with programs in exchange for your services.",
                    "You have backdoors into a few Corporate warehouses.",
                    "You hit the Night Markets and score programs whenever you can."
                ]
            },
            {
                "step": "Who's Gunning for You?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "You think it might be a rogue AI or a NET Ghost. Either way, it’s bad news.",
                    "Rival Netrunners who just don’t like you.",
                    "Corporates who want you to work for them exclusively.",
                    "Lawmen who consider you an illegal 'black hat' and want to bust you.",
                    "Old clients who think you screwed them over.",
                    "Fixer or another client who wants your services exclusively."
                ]
            }
        ]
    },
    "Tech": {
        "description": "Follow the flowchart to determine the details about your Tech character.",
        "steps": [{
                "step": "What Kind of Tech are You?",
                "instruction": "Roll 1d10 or choose one.",
                "valuess": [
                    "Cyberware Technician",
                    "Vehicle Mechanic",
                    "Jack of All Trades",
                    "Small Electronics Technician",
                    "Weaponsmith",
                    "Crazy Inventor",
                    "Robot and Drone Mechanic",
                    "Heavy Machinery Mechanic",
                    "Scavenger",
                    "Nautical Mechanic"
                ]
            },
            {
                "step": "What's Your Workspace Like?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "A mess strewn with blueprint paper.",
                    "Everything is color coded, but it's still a nightmare.",
                    "Totally digital and obsessively backed up every day.",
                    "You design everything on your Agent.",
                    "You keep everything just in case you need it later.",
                    "Only you understand your filing system."
                ]
            },
            {
                "step": "If You Have a Partner, Who are They?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Family member",
                    "Old friend",
                    "Possible romantic partner as well",
                    "Mentor",
                    "Secret partner with mob/gang connections",
                    "Secret partner with Corporate connections"
                ]
            },
            {
                "step": "Who are Your Main Clients?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Local Fixers who send you clients.",
                    "Local gangers who also protect your work area or home.",
                    "Corporate Execs who use you for 'black project' work.",
                    "Local Solos or other combat types who use you for weapon upkeep.",
                    "Local Nomads and Fixers who bring you 'found' tech to repair.",
                    "You work for yourself and sell what you invent/repair."
                ]
            },
            {
                "step": "Where Do You Get Your Supplies?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Scavenge the wreckage you find in abandoned City Zones.",
                    "Strip gear from bodies after firefights.",
                    "Have a local Fixer bring you supplies in exchange for repair work.",
                    "Corporate Execs supply you with stuff in exchange for your services.",
                    "You have backdoors into a few Corporate warehouses.",
                    "You hit the Night Markets and score deals whenever you can."
                ]
            },
            {
                "step": "Who's Gunning for You?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Combat Zone gangers who want you to work for them exclusively.",
                    "Rival Tech trying to steal your customers.",
                    "Corporates who want you to work for them exclusively.",
                    "Larger manufacturer trying to bring you down because your mods are a threat.",
                    "Old client who thinks you screwed them over.",
                    "Rival Tech trying to beat you out for resources and parts."
                ]
            }
        ]
    },
    "Medtech": {
        "description": "Follow the flowchart to determine the details about your Medtech character.",
        "steps": [{
                "step": "What Kind of Medtech are You?",
                "instruction": "Roll 1d10 or work with your GM to choose one.",
                "valuess": [
                    "Surgeon",
                    "General Practitioner",
                    "Trauma Medic",
                    "Psychiatrist",
                    "Cyberpsycho Therapist",
                    "Ripperdoc",
                    "Cryosystems Operator",
                    "Pharmacist",
                    "Bodysculptor",
                    "Forensic Pathologist"
                ]
            },
            {
                "step": "Tell Us About Your Partner(s).",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Trauma Team group",
                    "Old friend",
                    "Possible romantic partner as well",
                    "Family member",
                    "Secret partner with mob/gang connections",
                    "Secret partner with Corporate connections"
                ]
            },
            {
                "step": "What's Your Workspace Like?",
                "instruction": "Roll 1d6 or choose one.",
                "valuess": [
                    "Sterilized daily in the morning like clockwork.",
                    "It's not state-of-the-art anymore, but it's comfortable to you.",
                    "Your cryo equipment is also used to cool drinks.",
                    "Everything possible is single-use and stored compacted until needed.",
                    "Not as clean as many of your patients may have hoped.",
                    "Meticulously organized, sharpened, and sterilized."
                ]
            },
            {
                "step": "Who are Your Main Clients?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Local Fixers who send you clients."
                    },
                    {
                        "who": "Local gangers who also protect your work area or home in exchange for medical help."
                    },
                    {
                        "who": "Corporate Execs who use you for 'black project' medical work."
                    },
                    {
                        "who": "Local Solos or other combat types who use you for medical help."
                    },
                    {
                        "who": "Local Nomads and Fixers who bring you wounded clients."
                    },
                    {
                        "who": "Trauma Team paramedical work."
                    }
                ]
            },
            {
                "step": "Where Do You Get Your Supplies?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "where": "Scavenge stashes of medical supplies you find in abandoned City Zones."
                    },
                    {
                        "where": "Strip parts from bodies after firefights."
                    },
                    {
                        "where": "Have a local Fixer bring you supplies in exchange for medical work."
                    },
                    {
                        "where": "Corporate Execs or Trauma Team supply you with stuff in exchange for your services."
                    },
                    {
                        "where": "You have a backdoor into a few Corporate or Hospital warehouses."
                    },
                    {
                        "where": "You hit the Night Markets and score deals whenever you can."
                    }
                ]
            }
        ]
    },
    "Media": {
        "steps": [{
                "step": "What Kind of Media are You?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "type": "Blogger"
                    },
                    {
                        "type": "Writer (Books)"
                    },
                    {
                        "type": "Videographer"
                    },
                    {
                        "type": "Documentarian"
                    },
                    {
                        "type": "Investigative Reporter"
                    },
                    {
                        "type": "Street Scribe"
                    }
                ]
            },
            {
                "step": "How Does Your Work Reach the Public?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "how": "Monthly magazine"
                    },
                    {
                        "how": "Blog"
                    },
                    {
                        "how": "Mainstream vid feed"
                    },
                    {
                        "how": "News channel"
                    },
                    {
                        "how": "\"Book\" sales"
                    },
                    {
                        "how": "Screamsheets"
                    }
                ]
            },
            {
                "step": "How Ethical are You?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "ethics": "Fair, honest reporting, strong ethical practices. You only report the verifiable truth."
                    },
                    {
                        "ethics": "Fair and honest reporting, but willing to go on hearsay and rumor if that's what it takes."
                    },
                    {
                        "ethics": "Will occasionally slip and do unethical things, but it's rare. You have some standards."
                    },
                    {
                        "ethics": "Willing to bend any rules to get the bad guys. But only the bad guys."
                    },
                    {
                        "ethics": "Ruthless and determined to make it big, even if it means breaking the law. You're a muckraker."
                    },
                    {
                        "ethics": "Totally corrupt. You take bribes, engage in illegal, unethical reporting all the time. Your pen is for hire to the highest bidder."
                    }
                ]
            },
            {
                "step": "What Types of Stories Do You Want to Tell?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "stories": "Political Intrigue"
                    },
                    {
                        "stories": "Ecological Impact"
                    },
                    {
                        "stories": "Celebrity News"
                    },
                    {
                        "stories": "Corporate Takedowns"
                    },
                    {
                        "stories": "Editorials"
                    },
                    {
                        "stories": "Propaganda"
                    }
                ]
            }
        ]
    },
    "Exec": {
        "steps": [{
                "step": "Where is Your Corp Based?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "where": "One city"
                    },
                    {
                        "where": "Several cities"
                    },
                    {
                        "where": "Statewide"
                    },
                    {
                        "where": "National"
                    },
                    {
                        "where": "International, offices in a few major cities"
                    },
                    {
                        "where": "International, offices everywhere"
                    }
                ]
            },
            {
                "step": "Who's Gunning for Your Group?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Rival Corp in the same industry."
                    },
                    {
                        "who": "Law enforcement is watching you."
                    },
                    {
                        "who": "Local Media wants to bring you down."
                    },
                    {
                        "who": "Different divisions in your own company are feuding with each other."
                    },
                    {
                        "who": "Local government doesn't like your Corp."
                    },
                    {
                        "who": "International Corporations are eyeing you for a hostile takeover."
                    }
                ]
            },
            {
                "step": "Current State with Your Boss",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "current_state": "Your Boss mentors you but watch out for their enemies."
                    },
                    {
                        "current_state": "Your Boss gives you a free hand and doesn't want to know what you're up to."
                    },
                    {
                        "current_state": "Your Boss is a micromanager who tries to meddle in your work."
                    },
                    {
                        "current_state": "Your Boss is a psycho whose unpredictable outbursts are offset by quiet paranoia."
                    },
                    {
                        "current_state": "Your Boss is cool and watches your back against rivals."
                    },
                    {
                        "current_state": "Your Boss is threatened by your meteoric rise and is planning to knife you."
                    }
                ]
            }
        ]
    },
    "Lawman": {
        "steps": [{
                "step": "What is Your Position on the Force",
                "description": "Roll 1d6 or work with your GM to choose one.",
                "valuess": [{
                        "position": "Guard"
                    },
                    {
                        "position": "Standard Beat or Patrol"
                    },
                    {
                        "position": "Criminal Investigation"
                    },
                    {
                        "position": "Special Weapons and Tactics"
                    },
                    {
                        "position": "Motor Patrol"
                    },
                    {
                        "position": "Internal Affairs"
                    }
                ]
            },
            {
                "step": "How Wide is Your Group's Jurisdiction?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "jurisdiction": "Corporate Zones"
                    },
                    {
                        "jurisdiction": "Standard City Patrol Zone"
                    },
                    {
                        "jurisdiction": "Combat Zones"
                    },
                    {
                        "jurisdiction": "Outer City"
                    },
                    {
                        "jurisdiction": "Recovery Zones"
                    },
                    {
                        "jurisdiction": "Open Highways"
                    }
                ]
            },
            {
                "step": "How Corrupt is Your Group?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "corruption": "Fair, honest policing, strong ethical practices."
                    },
                    {
                        "corruption": "Fair and honest policing, but hard on lawbreakers."
                    },
                    {
                        "corruption": "Will occasionally slip and do unethical things, but it's rare."
                    },
                    {
                        "corruption": "Willing to bend any rules to get the bad guys."
                    },
                    {
                        "corruption": "Ruthless and determined to control The Street, even if it means breaking the law."
                    },
                    {
                        "corruption": "Totally corrupt. You take bribes, engage in illegal, and unethical business all the time."
                    }
                ]
            },
            {
                "step": "Who's Gunning for Your Group?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Organized Crime"
                    },
                    {
                        "who": "Boostergangs"
                    },
                    {
                        "who": "Police Accountability Group"
                    },
                    {
                        "who": "Dirty Politicians"
                    },
                    {
                        "who": "Smugglers"
                    },
                    {
                        "who": "Street Criminals"
                    }
                ]
            },
            {
                "step": "Who is Your Group's Major Target?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Organized Crime"
                    },
                    {
                        "who": "Boostergangs"
                    },
                    {
                        "who": "Drug Runners"
                    },
                    {
                        "who": "Dirty Politicians"
                    },
                    {
                        "who": "Smugglers"
                    },
                    {
                        "who": "Street Crime"
                    }
                ]
            }
        ]
    },
    "Fixer": {
        "steps": [{
                "step": "What Kind of Fixer are You?",
                "description": "Roll 1d10 or work with your GM to choose one.",
                "valuess": [{
                        "type": "Broker deals between rival gangs."
                    },
                    {
                        "type": "Procure rare or atypical resources for exclusive clientele."
                    },
                    {
                        "type": "Specialize in brokering Solo or Tech services as an agent."
                    },
                    {
                        "type": "Supply a regular resource for the Night Markets, like food, medicines, or drugs."
                    },
                    {
                        "type": "Procure highly illegal resources, like street drugs or milspec weapons."
                    },
                    {
                        "type": "Supply resources for Techs and Medtechs, like parts and medical supplies."
                    },
                    {
                        "type": "Operate several successful Night Markets, although not as owner."
                    },
                    {
                        "type": "Broker use contracts for heavy machinery, military vehicles, and aircraft."
                    },
                    {
                        "type": "Broker deals as a fence for scavengers raiding Corps or Combat Zones."
                    },
                    {
                        "type": "Act as an exclusive agent for a Media, Rockerboy, or a Nomad Pack."
                    }
                ]
            },
            {
                "step": "Got a Partner? Who?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Family member"
                    },
                    {
                        "who": "Old friend"
                    },
                    {
                        "who": "Possible romantic partner as well"
                    },
                    {
                        "who": "Mentor"
                    },
                    {
                        "who": "Secret partner with mob/gang connections"
                    },
                    {
                        "who": "Secret partner with Corporate connections"
                    }
                ]
            },
            {
                "step": "What's Your \"Office\" Like?",
                "description": "Roll 1d6 of choose one.",
                "valuess": [{
                        "office": "You don't have one. You like to keep it mobile."
                    },
                    {
                        "office": "A booth in a local bar."
                    },
                    {
                        "office": "All Data Pool messages and anonymous dead drops."
                    },
                    {
                        "office": "Spare room in a warehouse, shop, or clinic."
                    },
                    {
                        "office": "An otherwise abandoned building."
                    },
                    {
                        "office": "The lobby of a cube hotel."
                    }
                ]
            },
            {
                "step": "Who are Your Side Clients?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Local Rockerboys or Medias who use you to get them gigs or contacts."
                    },
                    {
                        "who": "Local gangers who also protect your work area or home."
                    },
                    {
                        "who": "Corporate Execs who use you for 'black project' procurement work."
                    },
                    {
                        "who": "Local Solos or other combat types who use you to get them jobs or contacts."
                    },
                    {
                        "who": "Local Nomads and Fixers who use you to set up transactions or deals."
                    },
                    {
                        "who": "Local politicos or Execs who depend on you for finding out information."
                    }
                ]
            },
            {
                "step": "Who's Gunning for You?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Combat Zone gangers who want you to work for them exclusively."
                    },
                    {
                        "who": "Rival Fixers trying to steal your clients."
                    },
                    {
                        "who": "Execs who want you to work for them exclusively."
                    },
                    {
                        "who": "Enemy of a former client who wants to clean up 'loose ends'—like you."
                    },
                    {
                        "who": "Old client who thinks you screwed them over."
                    },
                    {
                        "who": "Rival Fixer trying to beat you out for resources and parts."
                    }
                ]
            }
        ]
    },
    "Nomad": {
        "steps": [{
                "step": "What Do You Do for Your Pack?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "type": "Scout (negotiator)"
                    },
                    {
                        "type": "Outrider (protection, weapons)"
                    },
                    {
                        "type": "Transport pilot/driver"
                    },
                    {
                        "type": "Loadmaster (large cargo mover, trucker)"
                    },
                    {
                        "type": "Solo smuggler"
                    },
                    {
                        "type": "Procurement (fuel, vehicles, etc.)"
                    }
                ]
            },
            {
                "step": "What's Your Pack's Overall Philosophy?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "philosophy": "Always working for good; your Pack accepts others, just wants to get along."
                    },
                    {
                        "philosophy": "It's more like a family business. Operates as a fair and honest concern."
                    },
                    {
                        "philosophy": "Will occasionally slip and do unethical things, but it's rare."
                    },
                    {
                        "philosophy": "Willing to bend the rules whenever they get in the way to get what the Pack needs."
                    },
                    {
                        "philosophy": "Ruthless and self-centered, willing to do some bad things if it will get the Pack ahead."
                    },
                    {
                        "philosophy": "Totally evil. You rage up and down the highways, killing, looting, and just terrorizing everyone."
                    }
                ]
            },
            {
                "step": "Who's Gunning for Your Pack?",
                "description": "Roll 1d6 or choose one.",
                "valuess": [{
                        "who": "Organized Crime"
                    },
                    {
                        "who": "Boostergangs"
                    },
                    {
                        "who": "Drug Runners"
                    },
                    {
                        "who": "Dirty Politicians"
                    },
                    {
                        "who": "Rival Packs in the same businesses"
                    },
                    {
                        "who": "Dirty Cops"
                    }
                ]
            }
        ]
    }
}
