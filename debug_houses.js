
import pkg from 'circular-natal-horoscope-js';
const { Origin, Horoscope } = pkg;

const origin = new Origin({
    year: 1998,
    month: 4, // May
    date: 8,
    hour: 21,
    minute: 0,
    latitude: 7.7669,
    longitude: -72.2250
});

const horoscope = new Horoscope({
    origin: origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ['bodies', 'points', 'angles'],
    aspectWithPoints: ['bodies', 'points', 'angles'],
    aspectTypes: ["major", "minor"],
    customOrbs: {},
    language: 'en'
});

const planets = horoscope.CelestialBodies;
console.log("Sun House Label:", planets.sun.House.label);
console.log("Moon House Label:", planets.moon.House.label);
console.log("Mars House Label:", planets.mars.House.label);
