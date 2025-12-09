import { calculateHoroscope } from "./src/utils/astrology.js";

// Mock Birth Data
const birthDate = "1998-05-08";
const birthTime = "21:00";
const birthLocation = { lat: 7.7669, lng: -72.2250 }; // San Cristobal, Venezuela
const transitDate = new Date(); // Today

try {
    console.log("Testing calculateHoroscope with advanced forecast...");
    const result = calculateHoroscope({
        date: birthDate,
        time: birthTime,
        location: birthLocation,
        transitDate: transitDate
    });

    console.log("\n--- Active Transits ---");
    if (result.dailyTransit && result.dailyTransit.activeTransits) {
        result.dailyTransit.activeTransits.forEach(t => {
            console.log(`\nTransit: ${t.transitPlanet} ${t.aspectName} ${t.natalPlanet}`);
            console.log(`Summary: ${t.summary}`);
            console.log(`Happen: ${t.happen}`);
            console.log(`Focus: ${t.focus}`);
            console.log(`Impact: ${t.impact}`);
            console.log(`Do: ${t.advice?.do}`);
            console.log(`Don't: ${t.advice?.dont}`);
            console.log(`Self-Care: ${t.advice?.selfCare}`);
            console.log(`Duration: ${t.duration}`);
        });
    } else {
        console.error("No active transits found in result.");
    }

} catch (e) {
    console.error("Error executing logic:", e);
}
