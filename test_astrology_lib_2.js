import AstroLib from 'circular-natal-horoscope-js';

try {
    console.log('AstroLib:', AstroLib);
    const { Origin, Horoscope } = AstroLib;
    console.log('Origin:', Origin);
    console.log('Horoscope:', Horoscope);
} catch (e) {
    console.error(e);
}
