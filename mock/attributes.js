const attributes = {
    "athlete": {
        "name": "Athletics",
        "description": "Trained athletic abilities.",
        "talents": {
            "biking": {
                "name": "Biking",
                "description": "Mastery of high-speed biking and maneuvering."
            },
            "kayaking": {
                "name": "Kayaking",
                "description": "Expert navigation of waterways and rapid currents."
            },
            "diving": {
                "name": "Diving",
                "description": "Skill in deep-sea diving and underwater operations."
            },
            "climbing": {
                "name": "Climbing",
                "description": "Proficiency in scaling buildings and natural formations."
            },
            "lifting": {
                "name": "Lifting",
                "description": "Exceptional strength for lifting and moving heavy objects."
            },
            "acrobatics": {
                "name": "Acrobatics",
                "description": "Agility in performing flips, rolls, and evasive maneuvers."
            },
            "gymnastics": {
                "name": "Gymnastics",
                "description": "Precision in executing complex gymnastic routines."
            },
            "swimming": {
                "name": "Swimming",
                "description": "Speed and endurance in swimming across various bodies of water."
            },
            "running": {
                "name": "Running",
                "description": "Enhanced stamina and speed for long-distance running."
            }
        }
    },
    "cognition": {
        "name": "Cognition",
        "description": "Exceptional cognitive abilities.",
        "talents": {
            "assessment": {
                "name": "Assessment",
                "description": "Reading the room, situation assessment."
            },
            "investigate": {
                "name": "Investigate",
                "description": "In-depth analysis and investigation skills."
            },
            "subtext": {
                "name": "Subtext",
                "description": "Ability to understand hidden meanings and intentions."
            },
            "lip reading": {
                "name": "Lip Reading",
                "description": "Skill in reading lips to understand spoken words."
            },
            "body language": {
                "name": "Body Language",
                "description": "Expertise in interpreting body language and non-verbal cues."
            },
            "recognition": {
                "name": "Recognition",
                "description": "Exceptional memory for faces, places, and patterns."
            }
        }
    },
    "officer": {
        "name": "Commanding",
        "description": "Career making commanding abilities.",
        "talents": {
            "playbook": {
                "military": {
                    "name": "Military",
                    "description": "Knowledge how to keep your unit in optimal shape, along with rules of enemy engagement."
                },
                "stock": {
                    "name": "Stock",
                    "description": "Proficiency in managing and distributing resources."
                },
                "underground": {
                    "name": "Underground",
                    "description": "Expertise in covert operations and clandestine missions."
                },
                "capitalist": {
                    "name": "Capitalist",
                    "description": "Skill in economic strategy and corporate warfare."
                },
                "oligarch": {
                    "name": "Oligarch",
                    "description": "Mastery in maintaining and leveraging power within elite circles."
                }
            },
            "composure": {
                "name": "Composure",
                "description": "Ability to remain calm and collected under pressure."
            },
            "coaching": {
                "name": "Coaching",
                "description": "Skill in training and mentoring others."
            },
            "logistics": {
                "name": "Logistics",
                "description": "Expertise in planning and coordinating operations."
            },
            "strategy": {
                "name": "Strategy",
                "description": "Mastery in developing and executing tactical plans."
            }
        }
    },
    "constructor": {
        "name": "Construction",
        "description": "Professional construction experience.",
        "talents": {
            "forging": {
                "name": "Forging",
                "description": "Skill in creating metal structures and tools."
            },
            "founding": {
                "name": "Founding",
                "description": "Expertise in establishing new buildings and foundations."
            },
            "laying": {
                "name": "Laying",
                "description": "Proficiency in laying bricks, tiles, and other materials."
            },
            "destructuring": {
                "name": "Destructuring",
                "description": "Skill in safely demolishing structures."
            },
            "materialogy": {
                "name": "Materialogy",
                "description": "Knowledge of materials science and their applications."
            }
        }
    },
    "craftsman": {
        "name": "Craftsmanship",
        "description": "Skilled craftsmanship in various trades.",
        "talents": {
            "forging": {
                "name": "Forging",
                "description": "Expertise in shaping metal through heat and hammering."
            },
            "founding": {
                "name": "Founding",
                "description": "Proficiency in casting metal objects."
            },
            "carving": {
                "name": "Carving",
                "description": "Skill in carving wood, stone, or other materials."
            },
            "sculpting": {
                "name": "Sculpting",
                "description": "Expertise in creating three-dimensional art from various materials."
            },
            "ceramics": {
                "name": "Ceramics",
                "description": "Skill in creating pottery and other ceramic objects."
            }
        }
    },
    "educator": {
        "name": "Education",
        "description": "Expertise in teaching and knowledge dissemination.",
        "talents": {
            "language": {
                "name": "Language",
                "description": "Proficiency in multiple languages and linguistic skills."
            },
            "academics": {
                "name": "Academics",
                "description": "Expertise in academic disciplines and scholarly research."
            },
            "research": {
                "name": "Research",
                "description": "Skill in conducting thorough and effective research."
            },
            "economy": {
                "name": "Economy",
                "description": "Knowledge of economic principles and financial management."
            },
            "management": {
                "name": "Management",
                "description": "Skill in organizing and leading educational institutions."
            },
            "propaganda": {
                "name": "Propaganda",
                "description": "Expertise in spreading and managing information and misinformation."
            }
        }
    },
    "electronics": {
        "name": "Electronics",
        "description": "Proficiency in electronic systems and devices.",
        "talents": {
            "boards": {
                "name": "Boards",
                "description": "Skill in designing and assembling electronic circuit boards."
            },
            "processing": {
                "name": "Processing",
                "description": "Expertise in programming and processing electronic data."
            },
            "mechanics": {
                "name": "Mechanics",
                "description": "Knowledge of mechanical systems and their integration with electronics."
            },
            "design": {
                "name": "Design",
                "description": "Skill in designing functional and efficient electronic devices."
            }
        }
    },
    "engineer": {
        "name": "Engineering",
        "description": "Advanced engineering skills across various fields.",
        "talents": {
            "siege": {
                "name": "Siege Engineering",
                "description": "Expertise in designing and constructing fortifications and siege equipment."
            },
            "naval": {
                "name": "Naval Engineering",
                "description": "Proficiency in shipbuilding and maritime engineering."
            },
            "aeronautics": {
                "name": "Aeronautics",
                "description": "Skill in designing and maintaining aircraft."
            },
            "transport": {
                "name": "Transport Engineering",
                "description": "Expertise in the design and construction of transportation systems."
            },
            "industrial": {
                "name": "Industrial Engineering",
                "description": "Proficiency in optimizing complex industrial processes."
            },
            "military": {
                "name": "Military Engineering",
                "description": "Knowledge of designing and building military infrastructure and equipment."
            },
            "cybernetics": {
                "name": "Cybernetics",
                "description": "Skill in integrating electronic systems with biological entities."
            },
            "orbital": {
                "name": "Orbital Engineering",
                "description": "Expertise in designing and maintaining space stations and satellites."
            },
            "solar": {
                "name": "Solar Engineering",
                "description": "Knowledge of harnessing solar energy for various applications."
            }
        }
    },
    "entertainer": {
        "name": "Entertainment",
        "description": "Talents in performing arts and entertainment.",
        "talents": {
            "acting": {
                "name": "Acting",
                "description": "Skill in performing and portraying characters."
            },
            "writing": {
                "name": "Writing",
                "description": "Expertise in crafting compelling narratives and scripts."
            },
            "music": {
                "name": "Music",
                "description": "Proficiency in composing and performing music."
            },
            "visual artistry": {
                "name": "Visual Artistry",
                "description": "Skill in creating visual art through various mediums."
            },
            "dance": {
                "name": "Dance",
                "description": "Expertise in choreographing and performing dance routines."
            },
            "stylist": {
                "name": "Styling",
                "description": "Proficiency in fashion and personal styling."
            }
        }
    },
    "farmer": {
        "name": "Farming",
        "description": "Expertise in agricultural practices.",
        "talents": {
            "cultivation": {
                "name": "Cultivation",
                "description": "Skill in growing and nurturing crops."
            },
            "geology": {
                "name": "Geology",
                "description": "Knowledge of soil types and land management."
            },
            "management": {
                "name": "Farm Management",
                "description": "Expertise in overseeing farm operations and resources."
            }
        }
    },
    "gatherer": {
        "name": "Gathering",
        "description": "Proficiency in collecting natural resources.",
        "talents": {
            "woodcutting": {
                "name": "Woodcutting",
                "description": "Skill in felling trees and processing wood."
            },
            "mining": {
                "name": "Mining",
                "description": "Expertise in extracting minerals and ores."
            },
            "foraging": {
                "name": "Foraging",
                "description": "Proficiency in finding and harvesting wild plants and resources."
            },
            "endurance": {
                "name": "Endurance",
                "description": "Enhanced stamina for long-term physical activities."
            }
        }
    },
    "hunter": {
        "name": "Hunting",
        "description": "Skills in tracking and capturing prey.",
        "talents": {
            "sure shot": {
                "name": "Sure Shot",
                "description": "Precision in taking well-aimed shots."
            },
            "trailing": {
                "name": "Trailing",
                "description": "Expertise in tracking and following prey."
            },
            "endurance": {
                "name": "Endurance",
                "description": "Enhanced stamina for prolonged hunts."
            },
            "swimming": {
                "name": "Swimming",
                "description": "Proficiency in swimming to pursue aquatic prey."
            }
        }
    },
    "mechanic": {
        "name": "Mechanics",
        "description": "Proficiency in repairing and maintaining machinery.",
        "talents": {
            "naval": {
                "name": "Naval Mechanics",
                "description": "Skill in maintaining and repairing naval vessels."
            },
            "aeronautics": {
                "name": "Aeronautics",
                "description": "Expertise in aircraft maintenance."
            },
            "transport": {
                "name": "Transport",
                "description": "Proficiency in maintaining transportation vehicles."
            },
            "industrial": {
                "name": "Industrial",
                "description": "Skill in maintaining industrial machinery."
            },
            "military": {
                "name": "Military",
                "description": "Expertise in maintaining military equipment."
            },
            "cybernetics": {
                "name": "Cybernetics",
                "description": "Proficiency in integrating and repairing cybernetic systems."
            },
            "orbital": {
                "name": "Orbital",
                "description": "Skill in maintaining orbital equipment and satellites."
            }
        }
    },
    "operator": {
        "name": "Operations",
        "description": "Expertise in operating various vehicles and machinery.",
        "talents": {
            "industry": {
                "transport": {
                    "name": "Transport",
                    "description": "Skill in operating transportation vehicles."
                },
                "industrial": {
                    "name": "Industrial",
                    "description": "Expertise in operating industrial machinery."
                },
                "naval": {
                    "name": "Naval",
                    "description": "Proficiency in operating naval vessels."
                },
                "aeronautics": {
                    "name": "Aeronautics",
                    "description": "Skill in piloting aircraft."
                },
                "military": {
                    "name": "Military",
                    "description": "Expertise in operating military vehicles and equipment."
                },
                "cybernetics": {
                    "name": "Cybernetics",
                    "description": "Proficiency in operating cybernetic systems."
                },
                "orbital": {
                    "name": "Orbital",
                    "description": "Skill in operating orbital equipment."
                },
                "solar": {
                    "name": "Solar",
                    "description": "Expertise in operating solar energy systems."
                }
            },
            "driving": {
                "name": "Driving",
                "description": "Focused driving skill."
            },
            "cruising": {
                "name": "Cruising",
                "description": "Ability to travel tuned off."
            },
            "navigation": {
                "name": "Navigation",
                "description": "Expertise in navigating through various terrains."
            },
            "endurance": {
                "name": "Endurance",
                "description": "Enhanced stamina for prolonged operations."
            }
        }
    },
    "peacekeeper": {
        "name": "Peacekeeping",
        "description": "Skills in maintaining order and safety.",
        "talents": {
            "force": {
                "medical": {
                    "name": "Medical",
                    "description": "Medical Unit ties to put people together into one piece whenever possible."
                },
                "containment": {
                    "name": "Containment",
                    "description": "Disaster Containment Unit is responsible for firefighting and rescue missions."
                },
                "prevention": {
                    "name": "Prevention",
                    "description": "Crime Prevention Unit is tasked with keeping society orderly and catching preps anything disorderly it happens."
                },
                "penal": {
                    "name": "Penal",
                    "description": "Penal Unit takes care of punishing those who outstep the hard rules of society."
                },
                "detective": {
                    "name": "Detective",
                    "description": "Investigation Unit tasked with untangling most challenging cases to solve."
                },
                "trooper": {
                    "name": "Trooper",
                    "description": "Part of storm trooper squad intended at tackling down larger problems with overwhelming numbers."
                }
            },
            "forensics": {
                "name": "Forensics",
                "description": "Expertise in analyzing crime scenes and evidence."
            },
            "law": {
                "name": "Law",
                "description": "Knowledge of legal procedures and regulations."
            },
            "rehabilitation": {
                "name": "Rehabilitation",
                "description": "Skill in rehabilitating offenders and integrating them back into society."
            }
        }
    },
    "personality": {
        "name": "Personality",
        "description": "Charismatic traits and social skills.",
        "talents": {
            "presence": {
                "name": "Presence",
                "description": "Commanding presence that draws attention."
            },
            "style": {
                "name": "Style",
                "description": "Distinctive fashion sense and personal style."
            },
            "judgement": {
                "name": "Judgement",
                "description": "Sharp judgement in social situations."
            },
            "pitch": {
                "name": "Pitch",
                "description": "Skill in persuasive speaking and pitching ideas."
            },
            "chat": {
                "name": "Chat",
                "description": "Proficiency in casual conversation and small talk."
            }
        }
    },
    "martial arts": {
        "name": "Martial Arts",
        "description": "Skills in hand-to-hand combat.",
        "talents": {
            "melee": {
                "name": "Melee",
                "description": "Expertise in close-quarters combat."
            },
            "cqc": {
                "name": "CQC",
                "description": "Close-quarters combat training."
            },
            "motorics": {
                "athletics": {
                    "name": "Athletics",
                    "description": "Combination of physical fitness and combat skills."
                }
            }
        }
    },
    "sharpshooter": {
        "name": "Sharpshooting",
        "description": "Precision and skill in ranged combat.",
        "talents": {
            "expertise": {
                "bows": {
                    "name": "Bows",
                    "description": "Skill in using bows for ranged combat."
                },
                "crossbows": {
                    "name": "Crossbows",
                    "description": "Expertise in using crossbows for ranged combat."
                },
                "throwing": {
                    "name": "Throwing",
                    "description": "Proficiency in throwing weapons."
                },
                "handguns": {
                    "name": "Handguns",
                    "description": "Skill in using handguns."
                },
                "smgs": {
                    "name": "SMGs",
                    "description": "Expertise in using submachine guns."
                },
                "assault": {
                    "name": "Assault",
                    "description": "Proficiency in using assault rifles."
                },
                "rifles": {
                    "name": "Rifles",
                    "description": "Skill in using rifles for long-range combat."
                },
                "heavy": {
                    "name": "Heavy Weapons",
                    "description": "Expertise in using heavy weapons."
                },
                "explosives": {
                    "name": "Explosives",
                    "description": "Skill in handling and deploying explosives."
                },
                "integrated": {
                    "name": "Integrated Weapons",
                    "description": "Proficiency in using integrated weapon systems."
                }
            },
            "sure shot": {
                "name": "Sure Shot",
                "description": "Well-planned and aimed shot, intended to be a hit."
            },
            "quick shot": {
                "name": "Quick Shot",
                "description": "Quick instinctual shot intended at hitting targets nearby."
            },
            "trick shot": {
                "name": "Trick Shot",
                "description": "Rare shot possible only in specific circumstance, usually allowing to reach targets conventionally unreachable."
            },
            "barrel anxiety": {
                "name": "Barrel Anxiety",
                "description": "You don't want to be in front of a gun barrel at all times, leading to a habit of trying to find a spot with least probability of being shot."
            }
        }
    },
    "sportsman": {
        "name": "Sportsmanship",
        "description": "Talents in various sports and athletic activities.",
        "talents": {
            "discipline": {
                "american football": {
                    "name": "American Football",
                    "description": "Skills and tactics for American football."
                },
                "european football": {
                    "name": "European Football",
                    "description": "Skills and tactics for European football (soccer)."
                },
                "baseball": {
                    "name": "Baseball",
                    "description": "Proficiency in playing baseball."
                },
                "basketball": {
                    "name": "Basketball",
                    "description": "Skills and tactics for basketball."
                },
                "hockey": {
                    "name": "Hockey",
                    "description": "Proficiency in playing hockey."
                },
                "golf": {
                    "name": "Golf",
                    "description": "Skills and techniques for playing golf."
                }
            }
        }
    },
    "streetwise": {
        "name": "Streetwise",
        "description": "Knowledge and skills for surviving on the streets.",
        "talents": {
            "barter": {
                "name": "Barter",
                "description": "Skill in negotiating and trading goods."
            },
            "area expert": {
                "name": "Area Expert",
                "description": "Detailed knowledge of specific urban areas."
            },
            "gambling": {
                "name": "Gambling",
                "description": "Proficiency in games of chance and betting."
            },
            "forgery": {
                "name": "Forgery",
                "description": "Skill in creating fake documents and items."
            },
            "meshing": {
                "name": "Meshing",
                "description": "Expertise in blending into urban environments."
            }
        }
    },
    "survivor": {
        "name": "Survival",
        "description": "Skills for surviving in harsh conditions.",
        "talents": {
            "foraging": {
                "name": "Foraging",
                "description": "Skill in finding and collecting food in the wild."
            },
            "grassrooting": {
                "name": "Grassrooting",
                "description": "Ability to establish and maintain small, self-sufficient communities."
            },
            "caretaking": {
                "name": "Caretaking",
                "description": "Skill in providing care and support for others."
            },
            "med aid": {
                "name": "Med Aid",
                "description": "Basic medical skills for treating injuries and illnesses."
            }
        }
    }
}
