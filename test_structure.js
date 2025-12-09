import circularNatalHoroscope from "circular-natal-horoscope-js";
const { Origin, Horoscope } = circularNatalHoroscope;

const origin = new Origin({
    year: 1995,
    month: 11,
    date: 17,
    hour: 3,
    minute: 24,
    latitude: 48.8566,
    longitude: 2.3522,
});

const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major", "minor"],
    customOrbs: {},
    language: "en",
});

console.log("Type of CelestialBodies:", typeof horoscope.CelestialBodies);
console.log("Is Array:", Array.isArray(horoscope.CelestialBodies));
console.log("Keys:", Object.keys(horoscope.CelestialBodies));
// console.log("Value:", JSON.stringify(horoscope.CelestialBodies, null, 2)); 
