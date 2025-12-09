import * as Nominatim from 'nominatim-browser';

console.log('Keys:', Object.keys(Nominatim));
try {
    console.log('geocode:', Nominatim.geocode);
} catch (e) {
    console.log(e);
}

import NominatimDefault from 'nominatim-browser';
console.log('Default:', NominatimDefault);
