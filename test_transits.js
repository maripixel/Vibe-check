import circularNatalHoroscope from "circular-natal-horoscope-js";
const { Origin, Horoscope } = circularNatalHoroscope;

// 1. Natal Chart (e.g., 1995)
const birthOrigin = new Origin({
    year: 1995, month: 11, date: 17, hour: 3, minute: 24, latitude: 48.8566, longitude: 2.3522
});
const birthHoroscope = new Horoscope({
    origin: birthOrigin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies"],
    aspectWithPoints: ["bodies"],
    aspectTypes: [],
    customOrbs: {},
    language: "en"
});

// 2. Transit Chart (Right Now)
const now = new Date();
const transitOrigin = new Origin({
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    latitude: 48.8566,
    longitude: 2.3522
});
const transitHoroscope = new Horoscope({
    origin: transitOrigin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies"],
    aspectWithPoints: ["bodies"],
    aspectTypes: [],
    customOrbs: {},
    language: "en"
});

// 3. Inspect Data for calculation
const natalSun = birthHoroscope.CelestialBodies.sun;
const transitSaturn = transitHoroscope.CelestialBodies.saturn;

console.log("Natal Sun ChartPosition:", natalSun.ChartPosition); // Expecting degrees 0-360
console.log("Transit Saturn ChartPosition:", transitSaturn.ChartPosition);

const diff = Math.abs(natalSun.ChartPosition.Ecliptic.DecimalDegrees - transitSaturn.ChartPosition.Ecliptic.DecimalDegrees);
console.log("Raw Diff:", diff);

// Helper to normalize angle
const angle = Math.min(diff, 360 - diff);
console.log("Normalized Angle:", angle);
