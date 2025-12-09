import * as AstroLib from 'circular-natal-horoscope-js';

console.log('Keys:', Object.keys(AstroLib));
console.log('Default:', AstroLib.default);

try {
    const { Origin, Horoscope } = AstroLib;
    console.log('Origin:', Origin);
    console.log('Horoscope:', Horoscope);
} catch (e) {
    console.error(e);
}
