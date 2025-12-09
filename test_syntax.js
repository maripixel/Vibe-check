
import { calculateHoroscope } from './src/utils/astrology.js';

try {
    console.log("Successfully imported calculateHoroscope function.");
    const test = calculateHoroscope({
        date: "1998-05-08",
        time: "21:00",
        latitude: 7.7,
        longitude: -72.2,
        city: "San Cristobal"
    });
    console.log("Successfully ran calculation.");
} catch (e) {
    console.error("Error running function:", e);
}
