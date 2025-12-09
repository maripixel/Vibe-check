import * as AstroLib from "circular-natal-horoscope-js";

let Origin, Horoscope;

console.log("DEBUG: AstroLib import:", AstroLib);

// Robust handling for CommonJS/UMD module interop in Vite
try {
    if (AstroLib.default && AstroLib.default.Origin) {
        console.log("DEBUG: Using AstroLib.default");
        ({ Origin, Horoscope } = AstroLib.default);
    } else if (AstroLib.Origin) {
        console.log("DEBUG: Using AstroLib.Origin directly");
        ({ Origin, Horoscope } = AstroLib);
    } else {
        console.error("Critical Dependency Error: circular-natal-horoscope-js could not be loaded.", AstroLib);
    }
} catch (e) {
    console.error("DEBUG: Error parsing imports:", e);
}

export const calculateHoroscope = (birthData) => {
    console.log("DEBUG: calculateHoroscope called with:", birthData);
    try {
        const { date, time, latitude, longitude, city } = birthData;
        const [year, month, day] = date.split("-").map(Number);
        const [hour, minute] = time.split(":").map(Number);

        console.log("DEBUG: Creating Birth Origin...");
        const birthOrigin = new Origin({
            year,
            month: month - 1, // 0-indexed month
            date: day,
            hour,
            minute,
            latitude,
            longitude,
        });

        console.log("DEBUG: Creating Birth Horoscope...");
        const birthHoroscope = new Horoscope({
            origin: birthOrigin,
            houseSystem: "whole-sign",
            zodiac: "tropical",
            aspectPoints: ["bodies", "points", "angles"],
            aspectWithPoints: ["bodies", "points", "angles"],
            aspectTypes: ["major", "minor"],
            customOrbs: {},
            language: "en",
        });

        console.log("DEBUG: Birth Horoscope created:", birthHoroscope);

        // Get Planets
        const planets = birthHoroscope.CelestialBodies;
        // CelestialBodies is an object keyed by planet name in lowercase
        const sun = planets.sun;
        const moon = planets.moon;
        const ascendant = birthHoroscope.Ascendant;

        if (!sun || !moon || !ascendant) {
            throw new Error("Could not calculate planetary positions");
        }

        console.log("DEBUG: Planets calculated:", { sun, moon, ascendant });

        // Generate a whimsical reading

        // --- RICH CONTENT DICTIONARY ---
        const SIGN_TRAITS = {
            Aries: {
                sun: "You are the spark of the zodiac. Bold, pioneering, and fiercely independent, you are here to start things and lead the way.",
                moon: "Emotionally, you are quick and passionate. You need independence to feel safe, and you process feelings through action.",
                rising: "The world sees you as energetic, direct, and courageous. You walk into a room and people notice your confidence."
            },
            Taurus: {
                sun: "You are the builder. Grounded, patient, and sensual, you value stability and the finer things in life.",
                moon: "You find emotional safety in comfort, good food, and tangible assets. You are a steady rock for others.",
                rising: "You appear calm, composed, and unreliable. People sense a quiet strength and reliability in you immediately."
            },
            Gemini: {
                sun: "You are the celestial messenger. Curious, adaptable, and witty, you thrive on information and connection.",
                moon: "Your inner world is a whirlwind of thoughts. You need communication to process your feelings.",
                rising: "You come across as friendly, chatty, and youthful. You likely have a twinkle of curiosity in your eyes."
            },
            Cancer: {
                sun: "You are the nurturer. Deeply intuitive and protective, you lead with your heart and cherish your roots.",
                moon: "You feel everything deeply. Your home is your sanctuary, and you have an incredible emotional memory.",
                rising: "People see you as approachable, gentle, and caring. You radiate a comforting, familiar energy."
            },
            Leo: {
                sun: "You are the shining star. Creative, generous, and charismatic, you are born to express yourself and light up the room.",
                moon: "You have a heart of gold and need to feel appreciated. Your emotions are grand, dramatic, and warm.",
                rising: "You project warmth, confidence, and flair. You have a natural mane of 'hair' (metaphorical or not) and a regal presence."
            },
            Virgo: {
                sun: "You are the healer and analyzer. Detail-oriented and service-driven, you strive for excellence in everything you do.",
                moon: "You find comfort in order and usefulness. You process emotions by analyzing them and fixing the problem.",
                rising: "You appear neat, organized, and modest. People see you as reliable and observant."
            },
            Libra: {
                sun: "You are the diplomat. Dedicated to balance, harmony, and beauty, you see all sides of every story.",
                moon: "You need peace and partnership to feel secure. Conflict disturbs your soul; you seek emotional equilibrium.",
                rising: "You come across as charming, graceful, and polite. You have a pleasing aesthetic and a welcoming smile."
            },
            Scorpio: {
                sun: "You are the alchemist. Intense, magnetic, and transformative, you dive deep into the mysteries of life.",
                moon: "Your feelings are profound and private. You crave emotional intimacy and honesty above all else.",
                rising: "You have a magnetic, perhaps mysterious presence. People are drawn to your intensity but may feel you x-raying them."
            },
            Sagittarius: {
                sun: "You are the explorer. Optimistic, philosophical, and free-spirited, you seek truth and adventure everywhere.",
                moon: "You need emotional freedom. You process feelings by looking at the big picture and finding the silver lining.",
                rising: "You appear jovial, enthusiastic, and open-minded. You bring an energy of fun and possibility."
            },
            Capricorn: {
                sun: "You are the acheiver. Ambitious, disciplined, and wise, you climb the mountain of your goals with steady focus.",
                moon: "You are emotionally self-sufficient and responsible. You value respect and integrity in your inner world.",
                rising: "You project authority, capability, and maturity. People take you seriously and trust your competence."
            },
            Aquarius: {
                sun: "You are the visionary. Innovative, humanitarian, and unique, you march to the beat of your own drum.",
                moon: "You rationalize your emotions and need mental freedom. You care deeply for humanity but can be detached personally.",
                rising: "You come across as unique, friendly mostly, but slightly distant. People are intrigued by your quirky individuality."
            },
            Pisces: {
                sun: "You are the mystic. compassionate, artistic, and boundless, you live in both the real world and the dream world.",
                moon: "You are a psychic sponge. You feel the world's emotions. You need solitude and art to recharge your soul.",
                rising: "You appear soft, dreamy, and empathetic. You have 'soulful eyes' and a gentle, flowing demeanor."
            }
        };

        // Helper to safely get trait or fallback
        const getTrait = (sign, type) => {
            if (SIGN_TRAITS[sign] && SIGN_TRAITS[sign][type]) {
                return SIGN_TRAITS[sign][type];
            }
            return `You have the energy of ${sign}.`; // Fallback
        };

        // Helper: House Themes (Pure function, safe to hoist manually)
        const getHouseThemes = (h) => {
            const themes = [
                "Self", "Money", "Chat", "Home",
                "Fun", "Routine", "Relationships", "Deep Stuff",
                "Adventure", "Career", "Friends", "Dreams"
            ];
            // Safe index handling
            if (!h || isNaN(h)) return "Life";
            return themes[parseInt(h) - 1] || "Life";
        };

        // Helper: Ordinal (Pure)
        const getOrdinal = (n) => {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return s[(v - 20) % 10] || s[v] || s[0];
        };

        // Helper: Generate RICH meaning (Paragraph length)
        const getRichMeaning = (planetName, sign, house) => {
            // House label comes as "Fifth", "First", etc. from library
            const houseWords = {
                "first": 1, "second": 2, "third": 3, "fourth": 4,
                "fifth": 5, "sixth": 6, "seventh": 7, "eighth": 8,
                "ninth": 9, "tenth": 10, "eleventh": 11, "twelfth": 12
            };
            const hNum = houseWords[house.toLowerCase()] || parseInt(house) || 1;
            // 1. Core Identity & Deep Dive
            // Logic: [Definition]. [Deep Dive Traits].

            // 1. Static Definitions
            const definitions = {
                sun: `Your Sun Sign represents your core identity and the "main character" energy you radiate.`,
                moon: `Your Moon Sign represents your emotional inner world and what you need to feel safe.`,
                rising: `Your Rising Sign (Ascendant) is the mask you wear and your first impression on the world.`,
                mercury: `Mercury governs how you think and communicate, shaping your intellectual style.`,
                venus: `Venus rules love, beauty, and values, defining how you connect with others.`,
                mars: `Mars is your engine of action and desire, fueling your drive and ambition.`,
                jupiter: `Jupiter represents luck and expansion, showing where you find abundance.`,
                saturn: `Saturn is the taskmaster, representing discipline, lessons, and maturity.`,
                uranus: `Uranus is the awakener, where you disrupt the status quo and innovate.`,
                neptune: `Neptune is the dreamer, where you seek spiritual connection and idealism.`,
                pluto: `Pluto is the transformer, representing deep regeneration and power.`,
                chiron: `Chiron is the wounded healer, showing your deepest wound and greatest gift.`,
                northnode: `The North Node is your destiny, pointing you toward your soul's mission.`
            };

            // 2. House Interpretations (Already defined above, using short lookups for cleaner code)
            // 2. House Logic: Specific, Non-Repetitive Descriptions
            const getHouseMeaning = (p, h) => {
                const planet = p.toLowerCase();
                // Base templates for specific planets
                if (planet === 'mercury') {
                    const map = {
                        1: "With Mercury in the 1st House, your intellect is a core part of your identity. You speak your mind immediately and are often defined by your wit.",
                        2: "In the 2nd House, you apply your mind to finances and values. You likely have a knack for planning, budgeting, or thinking about what truly matters to you.",
                        3: "Mercury in its home 3rd House makes you a natural communicator. You learn quickly, speak fluently, and are always connected to the world around you.",
                        4: "In the 4th House, your thoughts turn inward. You think deeply about family, roots, and the past, often discussing these themes with loved ones.",
                        5: "Mercury in the 5th House expresses intellect through creativity. You love word games, storytelling, and flirting with your ideas.",
                        6: "In the 6th House, your mind focuses on details and routines. You are a problem-solver who excels at organizing daily chaos into order.",
                        7: "Mercury in the 7th House seeks intellectual connection in relationships. You need a partner you can talk to, and you negotiate with fairness.",
                        8: "In the 8th House, your mind dives deep. You are fascinated by psychology, secrets, and the hidden truths of existence.",
                        9: "Mercury in the 9th House thinks globally. You love philosophy, travel, and learning about big-picture concepts.",
                        10: "In the 10th House, your communication style defines your career. You speak with authority and are recognized for your ideas.",
                        11: "Mercury in the 11th House connects with groups. You share ideas with friends and think about the future of society.",
                        12: "In the 12th House, your thoughts are intuitive and private. You often understand things without needing words, tapping into the collective unconscious."
                    };
                    return map[h] || `Mercury resides in your ${h}th House, influencing how you think in this area of life.`;
                }

                if (planet === 'venus') {
                    const map = {
                        1: "With Venus in the 1st House, you radiate charm. People are naturally drawn to your grace and style.",
                        2: "In the 2nd House, you attract abundance. You value luxury, stability, and beautiful objects that make you feel secure.",
                        3: "Venus in the 3rd House finds beauty in communication. You speak with kindness and love connecting with your local community.",
                        4: "In the 4th House, you make your home a sanctuary. You value harmony in your family life above all else.",
                        5: "Venus in the 5th House loves to be in love! You express affection creatively and enjoy the playful side of romance.",
                        6: "In the 6th House, you find joy in service. You show love by helping others with daily tasks and creating beautiful routines.",
                        7: "Venus in the 7th House is the placement of partnership. You thrive in one-on-one relationships and are a natural harmonizer.",
                        8: "In the 8th House, love is intense and transformative. You seek deep, soul-level bonds rather than superficial connections.",
                        9: "Venus in the 9th House finds love in exploration. You are attracted to people from different cultures or those who expand your mind.",
                        10: "In the 10th House, you are admired publicly. Your charm aids your career, and you are often seen as a diplomatic leader.",
                        11: "Venus in the 11th House loves the group. You find connection through friendships and shared social ideals.",
                        12: "In the 12th House, love is spiritual and boundless. You may have secret romances or a deeply compassionate, self-sacrificing nature."
                    };
                    return map[h] || `Venus resides in your ${h}th House, bringing grace to this area of life.`;
                }

                if (planet === 'mars') {
                    const map = {
                        1: "Mars in the 1st House gives you immense vitality. You approach life head-on and are known for your courage and directness.",
                        2: "In the 2nd House, you fight for your security. You work hard for your money and are fiercely protective of your possessions.",
                        3: "Mars in the 3rd House communicates with passion. You debate vigorously and act on your ideas immediately.",
                        4: "In the 4th House, your energy is focused on the home. You may be the protector of your family, though things can get heated emotionally.",
                        5: "Mars in the 5th House plays hard! You pursue romance and creativity with intense passion and a competitive spirit.",
                        6: "In the 6th House, you work tirelessly. You have great energy for daily tasks but need to watch out for burnout.",
                        7: "Mars in the 7th House brings passion to partnerships. You may attract fiery partners or enjoy a dynamic, active relationship.",
                        8: "In the 8th House, your desires are deep and intense. You navigate transformation and shared resources with powerful focus.",
                        9: "Mars in the 9th House fights for beliefs. You are an adventurer who actively pursues wisdom and new experiences.",
                        10: "In the 10th House, you are ambitious. You conquer your career goals with strategic action and drive.",
                        11: "Mars in the 11th House acts for the group. You are a leader in your community, rallying friends toward a common cause.",
                        12: "In the 12th House, your actions are subtle. You fight for the underdog or work effectively behind the scenes."
                    };
                    return map[h] || `Mars resides in your ${h}th House, driving action in this area of life.`;
                }

                // Generics for others
                const genericMap = {
                    1: "Residing in your 1st House, this energy is front-and-center in your personality. It's the vibe you walk into a room with.",
                    2: "Located in the 2nd House, this placement directly influences your values, resources, and sense of self-worth.",
                    3: "Sitting in the 3rd House, this energy expresses itself through communication, learning, and local connections.",
                    4: "Found in the 4th House, this is a private energy tied to your home, roots, and emotional foundation.",
                    5: "In the 5th House of joy, this energy wants to play! It influences your creativity, romance, and self-expression.",
                    6: "Positioned in the 6th House, this shapes your daily grind, health routines, and service to others.",
                    7: "Residing in the 7th House, this energy shows up in your partnerships. You often seek this quality in others.",
                    8: "Deep in the 8th House, this is about transformation, intimacy, and shared resources.",
                    9: "In the 9th House of expansion, this energy drives you to explore philosophy, travel, and higher wisdom.",
                    10: "High in the 10th House, this is your public legacy. It influences your career reputation and authority.",
                    11: "Located in the 11th House, this energy connects you to the collective, friendships, and future hopes.",
                    12: "Hidden in the 12th House, this energy is subconscious and spiritual, driving your intuition from the shadows."
                };
                return genericMap[h] || `This placement resides in your ${h}th house.`;
            };

            // 3. Sign Deep Dive (Dynamic)
            const signTraits = {
                Aries: { adj: "bold, independent, and fiery", superpower: "Courage and initiative", shadow: "Impatience and impulsiveness", vibe: "Direct and action-oriented" },
                Taurus: { adj: "grounded, sensual, and steady", superpower: "Unshakable perseverance", shadow: "Stubbornness and resistance to change", vibe: "Peaceful and enduring" },
                Gemini: { adj: "curious, adaptable, and quick-witted", superpower: "Versatility and communication", shadow: "Restlessness and inconsistency", vibe: "Intellectual and social" },
                Cancer: { adj: "nurturing, sensitive, and protective", superpower: "Emotional intelligence and intuition", shadow: "Moodiness and over-defensiveness", vibe: "Gentle and caring" },
                Leo: { adj: "charismatic, creative, and radiant", superpower: "Leadership and warmth", shadow: "Ego and seeking validation", vibe: "Bold and expressive" },
                Virgo: { adj: "analytical, practical, and helpful", superpower: "Attention to detail and efficiency", shadow: "Perfectionism and criticism", vibe: "Organized and observant" },
                Libra: { adj: "diplomatic, charming, and fair", superpower: "Creating harmony and connection", shadow: "Indecisiveness and people-pleasing", vibe: "Balanced and aesthetic" },
                Scorpio: { adj: "intense, magnetic, and transformative", superpower: "Depth and psychological insight", shadow: "Jealousy and secrecy", vibe: "Deep and powerful" },
                Sagittarius: { adj: "adventurous, optimistic, and philosophical", superpower: "Vision and enthusiasm", shadow: "Bluntness and unreliability", vibe: "Free-spirited and expansive" },
                Capricorn: { adj: "ambitious, disciplined, and strategic", superpower: "Resilience and long-term planning", shadow: "Pessimism and rigidity", vibe: "Serious and determined" },
                Aquarius: { adj: "innovative, independent, and humanitarian", superpower: "Originality and vision", shadow: "Detachment and rebellion", vibe: "Unique and forward-thinking" },
                Pisces: { adj: "dreamy, empathetic, and artistic", superpower: "Compassion and imagination", shadow: "Escapism and lack of boundaries", vibe: "Mystical and fluid" }
            };

            const traits = signTraits[sign] || signTraits['Aries'];

            // Construct specific layouts per planet type
            let signAnalysis = "";
            const pt = planetName.toLowerCase();
            const lowerVibe = traits.vibe.toLowerCase();
            const lowerSuper = traits.superpower.toLowerCase();
            const lowerShadow = traits.shadow.toLowerCase();

            if (pt === 'sun') {
                signAnalysis = `**What it means:** In ${sign}, this means you are ${traits.adj}. A ${sign} Sun is motivated by ${lowerVibe} energy. You seek to express yourself authentically through these qualities.\n**Your Superpower:** ${traits.superpower}.\n**The Shadow:** ${traits.shadow}.`;
            } else if (pt === 'moon') {
                signAnalysis = `**What it means:** In ${sign}, your heart processes life through a ${traits.adj} lens.\n**The Vibe:** You find emotional security when things are ${lowerVibe}.\n**Strengths:** ${traits.superpower} applied to your relationships and inner self.\n**Challenges:** ${traits.shadow}.`;
            } else if (pt === 'rising' || pt === 'ascendant') {
                signAnalysis = `**What it means:** In ${sign}, you greet life with a ${traits.adj} attitude.\n**First Impressions:** People likely see you as ${lowerVibe}.\n**How You Navigate:** You approach new situations with ${lowerSuper}.`;
            } else if (pt === 'mercury') {
                signAnalysis = `**What it means:** In ${sign}, your mind is ${traits.adj}. You communicate with ${lowerSuper}, but you might struggle with ${lowerShadow}. You learn best when the subject is ${lowerVibe}.`;
            } else if (pt === 'venus') {
                signAnalysis = `**What it means:** In ${sign}, your love language is ${traits.adj}. You attract others through your ${lowerSuper}. In relationships, you value a vibe that is ${lowerVibe}.`;
            } else if (pt === 'mars') {
                signAnalysis = `**What it means:** In ${sign}, you take action in a ${traits.adj} way. Your drive is fueled by ${lowerVibe} energy. You fight for what you want with ${lowerSuper}.`;
            } else if (pt === 'jupiter') {
                signAnalysis = `**What it means:** In ${sign}, your luck expands when you embody ${lowerVibe} energy. You find abundance through ${lowerSuper}.`;
            } else if (pt === 'saturn') {
                signAnalysis = `**What it means:** In ${sign}, your life lessons resolve around being ${traits.adj}. You are mastering the art of ${lowerSuper} through discipline and patience.`;
            } else if (pt === 'uranus') {
                signAnalysis = `**What it means:** In ${sign}, you revolutionize things by being ${traits.adj}. Your genius lies in your ${lowerSuper}.`;
            } else if (pt === 'neptune') {
                signAnalysis = `**What it means:** In ${sign}, your dreams are formatted by ${lowerVibe} energy. You seek spiritual connection through ${lowerSuper}.`;
            } else if (pt === 'pluto') {
                signAnalysis = `**What it means:** In ${sign}, your power comes from being ${traits.adj}. You transform yourself by facing ${lowerShadow} and embracing ${lowerSuper}.`;
            } else if (pt === 'chiron') {
                signAnalysis = `**What it means:** In ${sign}, your healing journey involves overcoming ${lowerShadow}. You help others by sharing your ${lowerSuper}.`;
            } else if (pt === 'northnode' || pt === 'north node') {
                signAnalysis = `**What it means:** In ${sign}, your destiny asks you to become more ${traits.adj}. Step away from ${lowerShadow} and move toward ${lowerSuper}.`;
            } else {
                // Fallback
                signAnalysis = `**What it means:** In ${sign}, this energy expresses itself as ${traits.adj}. You find power through ${lowerVibe} means.`;
            }

            const capitalizedPlanet = planetName.charAt(0).toUpperCase() + planetName.slice(1);
            const def = definitions[planetName.toLowerCase()] || `${capitalizedPlanet} represents a key part of your psyche.`;
            const houseInfo = getHouseMeaning(planetName, hNum);

            // THE FINAL STRING: Definition + House + Sign Analysis
            // Use single newline for Big Three (tighter spacing), double newline for planetary cards
            const isBigThree = ['sun', 'moon', 'rising'].includes(planetName.toLowerCase());
            const separator = isBigThree ? '\n' : '\n\n';
            return `${def} ${houseInfo}${separator}${signAnalysis}`;
        };

        // Helper: Calculate Natal Aspects (Refined)
        const calculateNatalAspects = (planets) => {
            const aspects = [];
            // Filter out axis points, handle keys safely
            const planetNames = Object.keys(planets).filter(p =>
                !['ascendant', 'midheaven', 'mc', 'ic', 'descendant'].includes(p.toLowerCase()) &&
                planets[p].Sign // Ensure it's a body with a sign
            );

            for (let i = 0; i < planetNames.length; i++) {
                for (let j = i + 1; j < planetNames.length; j++) {
                    const p1 = planetNames[i];
                    const p2 = planetNames[j];

                    // Defensive check
                    if (!planets[p1].ChartPosition || !planets[p2].ChartPosition) continue;

                    const pos1 = planets[p1].ChartPosition.Ecliptic.Longitude;
                    const pos2 = planets[p2].ChartPosition.Ecliptic.Longitude;

                    // Calculate shortest distance on circle
                    let diff = Math.abs(pos1 - pos2);
                    if (diff > 180) diff = 360 - diff;

                    // Standard Orbs (Slightly wider for Sun/Moon is common, keeping uniform for now)
                    const orbs = { conjunction: 10, opposition: 10, trine: 8, square: 8, sextile: 6 };

                    let foundAspect = null;
                    if (Math.abs(diff - 0) <= orbs.conjunction) foundAspect = 'Conjunction';
                    else if (Math.abs(diff - 180) <= orbs.opposition) foundAspect = 'Opposition';
                    else if (Math.abs(diff - 120) <= orbs.trine) foundAspect = 'Trine';
                    else if (Math.abs(diff - 90) <= orbs.square) foundAspect = 'Square';
                    else if (Math.abs(diff - 60) <= orbs.sextile) foundAspect = 'Sextile';

                    if (foundAspect) {
                        aspects.push({
                            planet1: planets[p1].label,
                            planet2: planets[p2].label,
                            type: foundAspect,
                            orb: diff, // useful for debugging
                            description: `${planets[p1].label} ${foundAspect} ${planets[p2].label}: This creates a dynamic of ${foundAspect === 'Trine' || foundAspect === 'Sextile' ? 'harmony' : 'friction'}.`
                        });
                    }
                }
            }
            return aspects;
        };

        const generateNatalProfile = (planets) => {
            // Ensure ascendant is available
            const ascendant = planets.ascendant || birthHoroscope.Ascendant;
            if (!planets.sun || !planets.moon || !ascendant) return null;

            // Big Three (Rich Interpretation + Data)
            const bigThree = {
                sun: {
                    sign: planets.sun.Sign.label,
                    degree: Math.floor(planets.sun.ChartPosition.Ecliptic.Longitude % 30),
                    ecliptic: planets.sun.ChartPosition.Ecliptic.Longitude,
                    house: planets.sun.House ? planets.sun.House.label : 'Unknown',
                    message: getRichMeaning('sun', planets.sun.Sign.label, planets.sun.House ? planets.sun.House.label : '1')
                },
                moon: {
                    sign: planets.moon.Sign.label,
                    degree: Math.floor(planets.moon.ChartPosition.Ecliptic.Longitude % 30),
                    ecliptic: planets.moon.ChartPosition.Ecliptic.Longitude,
                    house: planets.moon.House ? planets.moon.House.label : 'Unknown',
                    message: getRichMeaning('moon', planets.moon.Sign.label, planets.moon.House ? planets.moon.House.label : '1')
                },
                rising: {
                    sign: ascendant.Sign.label,
                    degree: Math.floor(ascendant.ChartPosition.Ecliptic.Longitude % 30),
                    ecliptic: ascendant.ChartPosition.Ecliptic.Longitude,
                    message: getRichMeaning('rising', ascendant.Sign.label, '1')
                }
            };

            // All Placements (Rich Interpretation + Data)
            const placements = Object.keys(planets).map(key => {
                const planet = planets[key];
                // Skip if not a planet-like object or missing critical display data
                if (!planet.Sign || !planet.ChartPosition) return null;

                // Allow Ascendant/Midheaven in this list for the Visual Chart data source
                // (The UI filters them out of the text list, so it is safe to keep them here for the chart)

                return {
                    key: key,
                    name: planet.label,
                    sign: planet.Sign.label,
                    degree: Math.floor(planet.ChartPosition.Ecliptic.Longitude % 30),
                    ecliptic: planet.ChartPosition.Ecliptic.Longitude,
                    house: planet.House ? planet.House.label : '',
                    meaning: getRichMeaning(key, planet.Sign.label, planet.House ? planet.House.label : '1')
                };
            }).filter(Boolean);

            const natalAspects = calculateNatalAspects(planets);

            return {
                ...bigThree,
                allPlacements: placements,
                natalAspects: natalAspects
            };
        };

        // Natal Profile: Always True
        const natalProfile = generateNatalProfile({ ...planets, ascendant: ascendant }); // Pass all planets and ascendant

        // --- DETAILED TRANSIT ENGNIE ---

        // 1. Create Transit Origin (Right Now)
        const now = new Date();
        const transitOrigin = new Origin({
            year: now.getFullYear(),
            month: now.getMonth(),
            date: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            latitude, // Simulating user is at birth location for simplicity
            longitude
        });

        const transitHoroscope = new Horoscope({
            origin: transitOrigin,
            houseSystem: "whole-sign",
            zodiac: "tropical",
            aspectPoints: ["bodies"],
            aspectWithPoints: ["bodies"],
            aspectTypes: [],
            customOrbs: {},
            language: "en"
        });

        // 2. Define Planets to check
        const majorTransits = ['mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        const natalPoints = ['sun', 'moon', 'mercury', 'venus', 'mars'];

        // Helper: Get angle difference
        const getAngle = (p1, p2) => {
            const diff = Math.abs(p1 - p2);
            return Math.min(diff, 360 - diff);
        };

        // Helper: Identify Aspect with Orbital precision
        const getAspect = (angle) => {
            if (angle < 8) return { name: "Conjunction", type: "Intense", icon: "✨", orb: 8 };
            if (Math.abs(angle - 60) < 6) return { name: "Sextile", type: "Flowing", icon: "🤝", orb: 6 };
            if (Math.abs(angle - 90) < 8) return { name: "Square", type: "Challenging", icon: "⚡", orb: 8 };
            if (Math.abs(angle - 120) < 8) return { name: "Trine", type: "Flowing", icon: "🌊", orb: 8 };
            if (Math.abs(angle - 180) < 8) return { name: "Opposition", type: "Tension", icon: "↔️", orb: 8 };
            return null;
        };

        // --- HOUSE OVERLAY LOGIC ---
        // Verify which house a transit planet falls into based on Natal House Cusps
        const getTransitHouse = (tDegree, houses) => {
            // Check each house 1-12
            for (let i = 1; i <= 12; i++) {
                const currentHouse = houses.find(h => h.id === i);
                if (!currentHouse) continue;

                // House object has StartPosition and EndPosition
                let start = currentHouse.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
                let end = currentHouse.ChartPosition.EndPosition.Ecliptic.DecimalDegrees;

                // Handle zodiac wrap-around (e.g. Pisces to Aries)
                if (start > end) {
                    if (tDegree >= start || tDegree < end) return i;
                } else {
                    if (tDegree >= start && tDegree < end) return i;
                }
            }
            return 1; // Fallback
        };

        // --- DEEP CONTENT GENERATORS ---

        const generateDailySummary = (transits) => {
            const intros = [
                "The universe has a specific vibe today. ",
                "Here is your cosmic forecast. ",
                "The stars are chatting, and here is what they are saying. ",
                "Today's energy is a bit unique. "
            ];

            const advice = [
                "If a rule feels too tight, maybe it's time to loosen it just a little.",
                "Sometimes the best move is to just breathe and let the chaos happen.",
                "You don't have to have it all figured out today. Really.",
                "Trust your gut—it's smarter than your brain right now."
            ];

            return intros[Math.floor(Math.random() * intros.length)] + advice[Math.floor(Math.random() * advice.length)];
        };

        const getHouseImpactText = (tName, tHouse, nName, nHouse) => {
            return `${tName.charAt(0).toUpperCase() + tName.slice(1)} (in your ${tHouse}${getOrdinal(tHouse)} house of ${getHouseThemes(tHouse)}) is visiting your ${nName} (in your ${nHouse}${getOrdinal(nHouse)} house of ${getHouseThemes(nHouse)}). This mixes up ${getHouseThemes(tHouse)} with ${getHouseThemes(nHouse)}.`;
        };

        // Helper: Duration Estimation (Precise)
        const getDuration = (tBodyName, angle, aspectOrb) => {
            // ... existing logic ...
            const speeds = {
                mars: 0.5,
                jupiter: 0.08,
                saturn: 0.03,
                uranus: 0.01,
                neptune: 0.006,
                pluto: 0.004
            };
            const speed = speeds[tBodyName] || 0.1;

            // Degrees remaining (half orb assumption)
            const degreesLeft = aspectOrb / 2;
            const daysLeft = Math.ceil(degreesLeft / speed);

            if (daysLeft > 60) {
                const months = Math.ceil(daysLeft / 30);
                return `Around for ${months} months`;
            }
            if (daysLeft > 14) {
                const weeks = Math.ceil(daysLeft / 7);
                return `Around for ${weeks} weeks`;
            }
            if (daysLeft === 1) return "Ends today";
            return `Wrapping up in ${daysLeft} days`;
        };

        // Helper: Planet Keywords & Deep Descriptions
        const keyTraits = {
            sun: "your core identity",
            moon: "your emotional world",
            mercury: "your mental processing",
            venus: "your heart and values",
            mars: "your warrior spirit",
            jupiter: "your luck and optimism",
            saturn: "your sense of duty",
            uranus: "your rebellious side",
            neptune: "your intuition and dreams",
            pluto: "your transformative power",
            chiron: "your deep healing",
            northnode: "your destiny",
            southnode: "your past",
            ascendant: "your outer persona",
            midheaven: "your career path"
        };

        // Extended Traits for Focus
        const focusTraits = {
            sun: "your core identity and ego",
            moon: "your deep emotional world and intuition",
            mercury: "the way you think and communicate",
            venus: "your values, love life, and wallet",
            mars: "your drive, ambition, and inner fire",
            jupiter: "your luck, growth, and sense of adventure",
            saturn: "your discipline, boundaries, and hard lessons",
            uranus: "your urge for freedom and rebellion",
            neptune: "your dreams, illusions, and spiritual side",
            pluto: "your power, transformation, and shadow self",
            chiron: "your deepest wounds and healing power",
            northnode: "your destiny and future path",
            southnode: "your past habits and comfort zone",
            ascendant: "the mask you wear and how people see you",
            midheaven: "your public reputation and career path"
        };

        const getFocus = (tName, nName) => {
            const tTrait = focusTraits[tName] || "planetary energy";
            const nTrait = focusTraits[nName] || "part of yourself";
            const tCap = tName.charAt(0).toUpperCase() + tName.slice(1);
            const nCap = nName.charAt(0).toUpperCase() + nName.slice(1);

            const templates = [
                // Template 1: The Link
                `This transit isn't just random energy—it's specifically highlighting the link between ${tTrait} (${tCap}) and ${nTrait} (${nCap}). When these two forces meet, you get a chance to realign your inner compass. Think of it as your ${tName} trying to teach your ${nName} a valuable lesson. Listen closely.`,

                // Template 2: Conversation
                `Where ${tCap} meets ${nCap}: This is a conversation between ${tTrait} and ${nTrait}. It's asking you to integrate these two parts of your life. Instead of keeping them separate, see how your ${tName} energy can actually support your ${nName} needs.`,

                // Template 3: The Bridge
                `Focus on the bridge between ${tTrait} and ${nTrait}. Your ${tName} is shining a spotlight on your ${nName}, revealing things you usually ignore. Use this clarity to adjust your course.`,

                // Template 4: Rare Alignment
                `A rare alignment of ${tCap} (${tTrait}) and ${nCap} (${nTrait}). The universe is asking you to balance these energies. Are you leaning too much into one? Try to find the sweet spot in the middle.`,

                // Template 5: The Spotlight
                `Right now, the Universe is pointing a massive spotlight at how your ${tTrait} interacts with your ${nTrait}. It’s a moment of truth. Are these two working together, or is one sabotaging the other?`,

                // Template 6: The Alchemist
                `Alchemy in action: Mixing the essence of ${tCap} with ${nCap}. This combination creates a unique frequency that can help you break through old blocks. Don't resist the mixture.`,

                // Template 7: The Question
                `Ask yourself: How does my ${tTrait} currently affect my ${nTrait}? That is the core question of this transit. The answer holds the key to your next breakthrough.`,

                // Template 8: The Teacher
                `Your ${tName} is acting as a mentor to your ${nName} right now. The lesson? How to integrate ${tTrait} without losing your connection to ${nTrait}. It's a delicate balance, but you can master it.`,

                // Template 9: The Mirror
                `This aspect acts like a mirror. It reflects how your ${tTrait} is shaping your reality, specifically regarding ${nTrait}. If you don't like what you see, now is the perfect time to change the angle.`,

                // Template 10: The Fuel
                `Think of ${tCap} as the fuel and ${nCap} as the engine. This transit is about checking your levels. Are you running on empty, or are you flooding the engine? Adjust the flow of your ${tTrait}.`,

                // Template 11: The Story
                `Every transit tells a story. This chapter is about ${tCap} and ${nCap}. It's a narrative about reconciling your need for ${tTrait} with the reality of your ${nTrait}. You get to write the ending.`,

                // Template 12: The Shift
                `A subtle but powerful shift is happening between your ${tName} and ${nName}. You might not feel it instantly, but your ${tTrait} is slowly rewriting the code of your ${nTrait}. Trust the process.`,

                // Template 13: The Invitation
                `You are being invited to explore the synergy between ${tCap} and ${nCap}. It’s not often these two align this way. Use this time to understand how your ${tTrait} influences your ${nTrait}.`,

                // Template 14: The Check-In
                `Cosmic check-in: How is your ${nName} doing? Is it feeling supported by your ${tName}? This transit brings your awareness to the relationship between ${nTrait} and ${tTrait}.`,

                // Template 15: The Unlock
                `This energy unlocks a door between ${tCap} and ${nCap}. Behind it lies a deeper understanding of your ${tTrait}. Walk through it.`
            ];

            // Deterministic but varied selection to avoid random repetition flickering
            // Using sum of char codes of planets to pick an index
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            return templates[sum % templates.length];
        };

        // Helper: Dynamic Summary Generator (Meme-Style)
        const getSummary = (tName, aspect, nName) => {
            const isChallenging = ['Square', 'Opposition'].includes(aspect.name);
            const t = tName.charAt(0).toUpperCase() + tName.slice(1);
            const n = nName.charAt(0).toUpperCase() + nName.slice(1);

            // Deterministic hash with offset for Summary
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 7;

            if (isChallenging) {
                const templates = [
                    `Name a more iconic duo than ${t} and ${n}... I'll wait. (Actually, don't, they're fighting).`,
                    `Heads up: ${t} is currently roasting your ${n} in the group chat.`,
                    `Plot twist: ${t} is throwing some shade at your ${n} today.`,
                    `Okay, deep breath. ${t} and ${n} are having a "discussion."`,
                    `It's giving drama: ${t} vs. ${n}.`,
                    `POV: ${t} trying to explain something to ${n} and it's not going well.`,
                    `Warning: ${t} energy is colliding with ${n}. Brace for impact.`,
                    `Current mood: ${t} rolling its eyes at ${n}.`,
                    `The universe really said "let's mess with ${n}" by sending ${t}.`,
                    `Spicy energy detected between ${t} and ${n}.`
                ];
                return templates[sum % templates.length];
            } else {
                const templates = [
                    `You're doing great, sweetie! ${t} is hyping up your ${n}.`,
                    `${t} and ${n} just became besties. We love to see it.`,
                    `The vibe between ${t} and ${n}? immaculate. Chef's kiss.`,
                    `Green light from the universe! ${t} is boosting your ${n}.`,
                    `Iconic behavior: ${t} is supporting your ${n} right now.`,
                    `Power couple alert: ${t} and ${n} are unstoppable today.`,
                    `We love a supportive king/queen: ${t} is lifting up your ${n}.`,
                    `Main character energy: ${t} and ${n} are aligned.`,
                    `Just good vibes between ${t} and ${n}. Enjoy it.`,
                    `Cosmic high-five between ${t} and ${n}!`
                ];
                return templates[sum % templates.length];
            }
        };

        // Helper: Creative Fallback Generator (Conversational Paragraphs)
        const getCreativeFallback = (tName, aspect, nName) => {
            const isChallenging = ['Square', 'Opposition'].includes(aspect.name);
            const t = tName.charAt(0).toUpperCase() + tName.slice(1);
            const n = nName.charAt(0).toUpperCase() + nName.slice(1);
            const tDesc = keyTraits[tName] || tName;
            const nDesc = keyTraits[nName] || nName;

            // Deterministic hash with different offset for Happen
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 13;

            if (isChallenging) {
                const templates = [
                    `So here's the tea: ${t} is kind of crashing your ${n}'s party right now. It might feel like you're trying to push forward with ${tDesc} only to hit a wall set up by ${nDesc}. It's annoying, yes, but it's happening for a reason. The universe is basically shouting "Pause and reflect!"`,
                    `The energy is a bit spicy today. ${t} is squaring off against ${n}, which basically means ${tDesc} and ${nDesc} are having a miscommunication. You might feel torn between two directions. Don't force a resolution immediately; sometimes you just have to sit in the tension.`,
                    `Okay, real talk? ${t} is challenging your ${n} hard. You might feel like ${tDesc} is undermining ${nDesc}. Instead of fighting it, ask yourself what this friction is trying to show you. Usually, it's pointing out a boundary that needs to be stronger.`,
                    `Imagine ${t} and ${n} are stuck in an elevator together. That's the vibe. It's awkward and tense, but they have to work it out. You might feel a clash between ${tDesc} and ${nDesc}. Use this pressure to figure out what really matters to you.`,
                    `It’s a bit of a cosmic tug-of-war today. On one side, you have ${tDesc}, and on the other, ${nDesc}. Neither wants to budge. Instead of picking a side and exhausting yourself, try to find a compromise. What would the middle ground look like?`,
                    `Resistance is the theme. Your ${tName} wants one thing, your ${nName} wants another. It manifests as a friction between ${tDesc} and ${nDesc}. Don't panic—this is just growing pains. Growth is rarely comfortable, but it's always worth it.`
                ];
                return templates[sum % templates.length];
            } else {
                const templates = [
                    `We rarely get cosmic permission slips this clear, but today is one of them. ${t} and ${n} are perfectly aligned. Your ${tDesc} is seamlessly powering up ${nDesc}, so whatever you've been hesitating to do? Do it now. The wind is at your back.`,
                    `It's a "yes" day. ${t} is flowing effortlessly into your ${n}, creating a bridge between ${tDesc} and ${nDesc}. Things that usually feel hard might fee surprisingly easy. Lean into this energy—it's like the universe set your mental GPS to "no traffic."`,
                    `Bestie status confirmed: ${t} is totally supporting your ${n} right now. This is a golden moment where ${tDesc} helps expand and uplift ${nDesc}. If you've been waiting for a sign to launch something or say something, this is it.`,
                    `Everything is clicking. The connection between ${t} and ${n} is wide open, allowing a free flow of energy between ${tDesc} and ${nDesc}. You might find that solutions appear before you even fully formulate the problem. Trust your instincts.`,
                    `It's smooth sailing. The universe has cleared a path for your ${nDesc} using the power of ${tDesc}. If you've been pushing a boulder uphill, today it starts rolling down the other side. Enjoy the momentum.`,
                    `Harmony is the word of the day. ${t} and ${n} are singing in perfect tune. This enhances the link between ${tDesc} and ${nDesc}, making you feel integrated and whole. Use this stability to build something lasting.`
                ];
                return templates[sum % templates.length];
            }
        };

        // Helper: Self Care Generator
        const getSelfCare = (tName, nName) => {
            // Deterministic hash for Self Care
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 3;

            const tips = {
                sun: [
                    "Step into the light. Take a selfie, wear your favorite outfit, or just bask in the sun for 10 mins.",
                    "Claim your space. Speak up in a meeting or write down 3 things you love about yourself.",
                    "Radiate. Call a friend who makes you feel good."
                ],
                moon: [
                    "Honor your feelings. Take a bath, journal, or just nap without guilt.",
                    "Nourish yourself. Cook a comfort meal or drink a massive glass of water.",
                    "Retreat. Cancel one non-essential plan and stay home."
                ],
                mercury: [
                    "Clear your mind. Do a brain dump, turn off notifications, or read a few pages of a book.",
                    "Connect. Send that voice note you’ve been meaning to record.",
                    "Organize. Clean your desktop or sort one drawer."
                ],
                venus: [
                    "Treat yourself. Buy the latte, put on a face mask, or surround yourself with beauty.",
                    "Indulge. Eat something specifically because it tastes good, not because it's healthy.",
                    "Beautify. Wear the jewelry you usually save for 'special occasions'."
                ],
                mars: [
                    "Burn off the energy. Go for a run, punch a pillow, or do a quick heavy workout.",
                    "Take action. Do the one thing you've been procrastinating on for 5 minutes.",
                    "Move on. Decide to let go of a grudge."
                ],
                jupiter: [
                    "Expand your horizons. Watch a documentary, plan a trip, or just look at the sky.",
                    "Be generous. Tip extra or compliment a stranger.",
                    "Learn. Read an article about a topic you know nothing about."
                ],
                saturn: [
                    "Find ground. Clean one corner of your room, make a list, or stretch.",
                    "Commit. Set a timer for 20 minutes and focus on one task.",
                    "Respect limits. Say 'no' to something you don't want to do."
                ],
                uranus: [
                    "Shake it up. Dance to weird music, change your route home, or wear something bold.",
                    "Innovate. Try a new app or a new way of making coffee.",
                    "Break free. Delete an app that stresses you out."
                ],
                neptune: [
                    "Drift away. Meditate, listen to LoFi beats, or stare at water.",
                    "Dream. Write down your dreams from last night.",
                    "Create. Doodle, paint, or just listen to music with your eyes closed."
                ],
                pluto: [
                    "Purge the old. Throw away 3 things you don't need, or take a deep detoxifying breath.",
                    "Transform. Take a shower and imagine washing away the day's stress.",
                    "Investigate. Journal about a shadow emotion you're feeling."
                ],
                chiron: [
                    "Tend to your wounds. Be extra kind to yourself today, like you would to a child.",
                    "Heal. Do a body scan meditation.",
                    "Accept. Forgive yourself for one mistake."
                ]
            };

            const planetTips = tips[tName] || ["Drink water and take three deep breaths."];
            return planetTips[sum % planetTips.length];
        };

        // Helper: Action Generator (Structured)
        const getFallbackAction = (tName, aspect, nName) => {
            const isChallenging = ['Square', 'Opposition'].includes(aspect.name);
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 11;

            if (isChallenging) {
                const dos = [
                    "Count to ten before reacting. Pause.",
                    "Slow down. Speed is the enemy right now.",
                    "Check the facts before you spiral.",
                    "Set a boundary, but do it kindly.",
                    "Wait 24 hours before making a big decision."
                ];
                const donts = [
                    "Send that text you drafted at 2 AM.",
                    "Assume everyone is out to get you.",
                    "Force a solution. Let it simmer.",
                    "Say yes just to please someone else.",
                    "Start a fight just to feel something."
                ];
                return {
                    do: dos[sum % dos.length],
                    dont: donts[sum % donts.length],
                    selfCare: getSelfCare(tName, nName)
                };
            }

            const dos = [
                "Say yes to the invite (or the idea).",
                "Launch it. Post it. Send it.",
                "Trust your gut—it's right today.",
                "Reach out to someone you admire.",
                "Take the risk. The net will appear."
            ];
            const donts = [
                "Second-guess your magic.",
                "Play small just to make others comfortable.",
                "Wait for permission.",
                "Overallocate your time.",
                "Ignore the signs. They are everywhere."
            ];
            return {
                do: dos[sum % dos.length],
                dont: donts[sum % donts.length],
                selfCare: getSelfCare(tName, nName)
            };
        };

        // Helper: Love & Career Forecast
        const getLoveCareerForecast = (tName, aspect, nName) => {
            const isChallenging = ['Square', 'Opposition'].includes(aspect.name);
            const sum = tName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + nName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 22;

            // Templates based on Creating Planet (tName)
            const predictions = {
                sun: {
                    challenging: {
                        love: ["Ego clashes are likely. Don't make it about winning.", "You might feel overshadowed. Speak up, but gently."],
                        career: ["Authority figures might be testing you. Stand your ground, but be respectful.", "Your professional identity feels challenged. Don't take it personally."]
                    },
                    harmonious: {
                        love: ["You are radiating confidence, which is magnetic. Flirt away.", "Perfect time to be seen. Go out and shine."],
                        career: ["Time to ask for what you want. You are visible.", "Leadership opportunities are opening up. Step into them."]
                    }
                },
                moon: {
                    challenging: {
                        love: ["You're feeling sensitive. Avoid heavy relationship talks today.", "Misunderstandings happen when emotions run high. Pause."],
                        career: ["Your mood might affect your work. Try to separate the two.", "Public vulnerability is a risk. Keep it professional today."]
                    },
                    harmonious: {
                        love: ["Deep connection is easy today. Share your feelings.", "Intimacy is high. A great night for a date in."],
                        career: ["Your intuition is sharp. Trust your gut on business decisions.", "You connect well with the public or clients today."]
                    }
                },
                mercury: {
                    challenging: {
                        love: ["Words can hurt. Think twice before texting.", "Miscommunication is almost guaranteed. Verify plans."],
                        career: ["Double check your emails. Typos or tone issues are likely.", "Don't sign contracts or schedule big reviews today if you can help it."]
                    },
                    harmonious: {
                        love: ["Great energy for deep conversations. profound chats.", "Send that text. It will be received well."],
                        career: ["Pitch your idea. Your communication is clear and persuasive.", "Networking is favored. Reach out to that contact."]
                    }
                },
                venus: {
                    challenging: {
                        love: ["Jealousy or values clashes might pop up. Breathe.", "You might feel unappreciated. Don't seek validation externally."],
                        career: ["Watch your spending. Retail therapy isn't the solution.", "Diplomacy is needed at work. Smooth over any ruffles."]
                    },
                    harmonious: {
                        love: ["Romance is in the air. High potential for a meet-cute.", "You are magnetic. Enjoy the attention."],
                        career: ["Money flows easily. Ask for a raise or close a sale.", "Creative work is highly favored."]
                    }
                },
                mars: {
                    challenging: {
                        love: ["Passion can turn into anger quickly. Watch your temper.", "Conflict is likely. Pick your battles."],
                        career: ["You're driven but might be aggressive. Don't bulldoze colleagues.", "Impatience will cost you. Slow down."]
                    },
                    harmonious: {
                        love: ["Sparks are flying. The good kind.", "Take the lead in romance. Make the first move."],
                        career: ["You are unstoppable. Tackle the hardest task on your list.", "Ambition is high. Go after what you want."]
                    }
                },
                jupiter: {
                    challenging: {
                        love: ["You might promise more than you can deliver.", "Over-indulgence could be an issue. Moderation."],
                        career: ["Don't overextend yourself. Validate details before saying yes.", "Optimism is good, but don't ignore risks."]
                    },
                    harmonious: {
                        love: ["Big, generous love energy. Plan a trip or an adventure.", "Open your heart. Good luck accompanies you."],
                        career: ["Growth is happening. Launch the project.", "Luck is on your side. Take a calculated risk."]
                    }
                },
                saturn: {
                    challenging: {
                        love: ["You might feel lonely or blocked. profound commitment often feels heavy.", "Coldness in relationships. Give it space."],
                        career: ["Work feels heavy. Just get through the checklist.", " delays are likely. Patience is the only way."]
                    },
                    harmonious: {
                        love: ["Stable, lasting love. Good for making commitments.", "Mature conversations bring you closer."],
                        career: ["Your hard work is noticed. solidified progress.", "Build the foundation. It will last."]
                    }
                },
                uranus: {
                    challenging: {
                        love: ["Unexpected breakups or shakeups. Need for space is high.", "restlessness. Don't blow it up just because you're bored."],
                        career: ["Sudden changes at work. Stay flexible.", "Tech issues or sudden shifts in plans."]
                    },
                    harmonious: {
                        love: ["Exciting surprises. Try something new in the bedroom or on a date.", "You attract unique people today."],
                        career: ["Innovation strikes. You have a breakthrough idea.", "Freedom. Break the rules slightly."]
                    }
                },
                neptune: {
                    challenging: {
                        love: ["Rose-colored glasses are on. See people as they are, not as you want them to be.", "Deception or confusion is possible."],
                        career: ["Brain fog at work. Double check numbers.", "Don't make concrete decisions. You're missing info."]
                    },
                    harmonious: {
                        love: ["Soulmate vibes. Highly spiritual connection.", "Romance is dreamy and poetic."],
                        career: ["Creativity flows. Great for art or vision work.", "Intuition guides your career path."]
                    }
                },
                pluto: {
                    challenging: {
                        love: ["Power struggles. Don't manipulate or be manipulated.", "Intensity is high. Obsessive thoughts possible."],
                        career: ["Office politics might get nasty. Stay out of it.", "Something is ending. Let it go."]
                    },
                    harmonious: {
                        love: ["Transformative intimacy. Deep bonding.", "Sexual energy is powerful."],
                        career: ["You have power and influence. Use it for good.", "Deep research uncovers a hidden gem."]
                    }
                },
                chiron: {
                    challenging: {
                        love: ["Old wounds might reopen. Be gentle with yourself.", "Insecurity in relationships is triggered."],
                        career: ["Imposter syndrome might flare up.", "You might feel criticized. It's not about you."]
                    },
                    harmonious: {
                        love: ["Healing conversation. You can move past old hurt.", "Vulnerability brings strength."],
                        career: ["You can mentor others through their struggles.", "Your unique perspective is valued."]
                    }
                }
            };

            const planetData = predictions[tName] || predictions['sun']; // Fallback
            const type = isChallenging ? 'challenging' : 'harmonious';
            const options = planetData[type];

            return {
                love: options.love[sum % options.love.length],
                career: options.career[sum % options.career.length]
            };
        };

        // 3. Interpretation Dictionary (Deep & Fun)
        const getInterpretation = (tBody, aspect, nBody, duration, tHouse, nHouse) => {
            const key = `${tBody}-${aspect.name}-${nBody}`;

            // Dynamic Fallback
            let content = {
                summary: getSummary(tBody, aspect, nBody),
                happen: getCreativeFallback(tBody, aspect, nBody),
                focus: getFocus(tBody, nBody),
                impact: getHouseImpactText(tBody, tHouse, nBody, nHouse),
                advice: getFallbackAction(tBody, aspect, nBody), // Changed to include nBody for hash
                areas: getLoveCareerForecast(tBody, aspect, nBody) // New Section
            };

            const DICTIONARY = {
                'saturn-Square-sun': {
                    summary: 'The Universe is asking: "How badly do you want this?"',
                    happen: 'Saturn is the strict teacher, and he is testing your Sun (your ego/drive). You might feel blocked or tired, but it is just a test of your grit. Think of this as resistance training for your soul. The heavier the weight, the stronger you get.',
                    focus: 'This transit highlights the friction between your need for recognition and the cold, hard reality of your responsibilities. It’s a reality check, but a useful one.',
                    impact: `Saturn in your ${tHouse}${getOrdinal(tHouse)} house is challenging your Sun in the ${nHouse}${getOrdinal(nHouse)} house. It feels like your ${getHouseThemes(tHouse)} is weighing down your ${getHouseThemes(nHouse)}.`,
                    advice: {
                        do: "Put your head down and work.",
                        dont: "Throw a tantrum when things stall.",
                        selfCare: "Stretch your back and shoulders—you're carrying a lot of weight."
                    }
                },
                'mars-Square-saturn': {
                    summary: 'Feels like driving with the handbrake on.',
                    happen: 'Mars wants to GO, but Saturn says STOP. You might feel super frustrated with delays. It is not permanent, it is just annoying. The energy here is bottled up, like a shaken soda can. Instead of exploding, try to channel that pressure into something small and controlled.',
                    focus: 'A classic clash between your unstoppable drive and an immovable object. Patience isn\'t just a virtue right now; it\'s a survival strategy.',
                    impact: `Mars in your ${tHouse}${getOrdinal(tHouse)} house is squaring off with Saturn in your ${nHouse}${getOrdinal(nHouse)} house. Your drive for ${getHouseThemes(tHouse)} is hitting a wall in ${getHouseThemes(nHouse)}.`,
                    advice: {
                        do: "Focus on slow, steady tasks.",
                        dont: "Try to force a locked door open.",
                        selfCare: "Do a high-intensity workout to release the bottled-up rage."
                    }
                },
                'jupiter-Trine-sun': {
                    summary: 'You\'re doing great, sweetie! Luck is following you.',
                    happen: 'Everything just feels easier. You are glowing, people like you, and opportunities are popping up. Soak it up! This is one of those days where you feel like the main character in a movie where everything goes right. Enjoy the montage.',
                    focus: 'This brings a beautiful alignment between your core self and the principle of expansion. Your confidence is key—if you believe it, it will probably happen.',
                    impact: `Jupiter in your ${tHouse}${getOrdinal(tHouse)} house is high-fiving your Sun in the ${nHouse}${getOrdinal(nHouse)} house. Usually, this expands your ${getHouseThemes(tHouse)} and lights up your ${getHouseThemes(nHouse)}.`,
                    advice: {
                        do: "Launch the website, send the text, buy the ticket.",
                        dont: "Waste this sitting on the couch.",
                        selfCare: "Buy a lottery ticket or treat yourself to something fancy."
                    }
                },
                'mars-Opposition-venus': {
                    summary: 'Sparks are flying—good ones or bad ones.',
                    happen: 'Passion is high! This could mean a steamy date or a stupid argument. The energy is raw, so handle with care.',
                    focus: 'Passion Management',
                    impact: `Mars in your ${tHouse}${getOrdinal(tHouse)} house is staring down Venus in your ${nHouse}${getOrdinal(nHouse)} house. Tension between ${getHouseThemes(tHouse)} and ${getHouseThemes(nHouse)}.`,
                    advice: {
                        do: "Channel it into art or romance.",
                        dont: "Pick a fight just to feel something.",
                        selfCare: "Dance it out or wear your hottest outfit."
                    }
                }
            };

            if (DICTIONARY[key]) {
                content = DICTIONARY[key];
            }

            return { ...content, duration, category: DICTIONARY[key] ? 'Major' : 'General' };
        };

        // 4. Calculate Active Transits
        const activeTransits = [];

        // Natal Houses Array
        const houses = birthHoroscope.Houses; // Array of 12 houses

        // Check Planets vs Planets
        majorTransits.forEach(tName => {
            const tBody = transitHoroscope.CelestialBodies[tName];
            if (!tBody) return;

            // Calculate Transit House
            const tHouse = getTransitHouse(tBody.ChartPosition.Ecliptic.DecimalDegrees, houses);

            natalPoints.forEach(nName => {
                const nBody = birthHoroscope.CelestialBodies[nName];
                if (!nBody) return;

                // Natal House is known
                const nHouse = parseInt(nBody.House.label) || 1; // Sometimes label is text, but usually logic has IDs. Let's use ID if avail
                // Actually nBody.House.id exists in this library usually.
                const realNHouse = nBody.House.id || 1;

                const angle = getAngle(tBody.ChartPosition.Ecliptic.DecimalDegrees, nBody.ChartPosition.Ecliptic.DecimalDegrees);
                const aspect = getAspect(angle);

                if (aspect) {
                    const duration = getDuration(tName, angle, aspect.orb);
                    const interpretation = getInterpretation(tName, aspect, nName, duration, tHouse, realNHouse);

                    activeTransits.push({
                        id: `${tName}-${nName}`,
                        ...interpretation,
                        transitPlanet: tName,
                        natalPlanet: nName,
                        aspectName: aspect.name,
                        aspectIcon: aspect.icon
                    });
                }
            });
        });

        // Ensure at least one transit if empty (for UI sake)
        if (activeTransits.length === 0) {
            activeTransits.push({
                id: 'default',
                summary: 'Clear Skies',
                happen: 'No major planetary storms impacting you primarily right now.',
                focus: 'Peace & Calm',
                impact: 'Enjoy the tranquility.',
                duration: 'Today',
                aspectIcon: '🌤️',
                category: 'Calm'
            });
        }

        console.log("DEBUG: Active transits found:", activeTransits.length);

        const dailyTransit = {
            activeTransits: activeTransits.slice(0, 5), // Top 5
            dailySummary: generateDailySummary(activeTransits)
        };

        console.log("DEBUG: Calculation successful, returning structured results.");

        return {
            natalProfile,
            dailyTransit
        };

    } catch (error) {
        console.error("DEBUG: Error in calculateHoroscope:", error);
        return {
            dailyReading: "The stars are cloudy today. We couldn't calculate your chart right now.",
            birthChart: {
                sun: "Unknown",
                moon: "Unknown",
                rising: "Unknown"
            }
        };
    }
};
