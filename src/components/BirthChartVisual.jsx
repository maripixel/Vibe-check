import React from 'react';

const BirthChartVisual = ({ profile }) => {
    if (!profile) return null;

    // Radius Config
    const size = 320;
    const center = size / 2;
    const radius = (size / 2) - 10;

    // Rings
    const rZodiac = radius;       // Outer ring for signs
    const rPlanets = radius - 35; // Where planets sit
    const rHouses = radius - 70;  // Inner lines for houses

    // Data - Robust Ascendant Retrieval
    // Use the explicitly separate 'rising' object if available for reliability
    const ascEcliptic = profile.rising && !isNaN(profile.rising.ecliptic)
        ? profile.rising.ecliptic
        : (profile.allPlacements.find(p => p.name === 'Ascendant')?.ecliptic || 0);

    // Rotation Offset: Make Ascendant appear at 180 degrees (Left, 9 o'clock)
    // SVG 0 is 3 o'clock. 180 is 9 o'clock.
    const rotationOffset = 180 - ascEcliptic;

    // Helper to get coordinates
    const getPos = (deg, r) => {
        const rad = (deg * Math.PI) / 180;
        return {
            x: center + r * Math.cos(rad),
            y: center + r * Math.sin(rad)
        };
    };

    // Draw Zodiac Ring (Fixed 30 deg segments, but rotated by offset)
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const zodiacSegments = signs.map((sign, i) => {
        const startDeg = (i * 30) + rotationOffset;

        // Midpoint for text
        const midDeg = startDeg + 15;
        const textPos = getPos(midDeg, rZodiac - 15);

        // Separator Lines
        const linePos = getPos(startDeg, rZodiac);

        return (
            <g key={i}>
                {/* Separator Line */}
                <line
                    x1={center} y1={center}
                    x2={linePos.x} y2={linePos.y}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                />
                {/* Sign Label */}
                <text
                    x={textPos.x} y={textPos.y}
                    fontSize="10"
                    fill="#a5b4fc"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${midDeg + 90}, ${textPos.x}, ${textPos.y})`} /* Rotate text to face center */
                >
                    {sign.toUpperCase().slice(0, 3)}
                </text>
            </g>
        );
    });

    // Draw Planets
    const planetIcons = {
        Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
        Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
        Chiron: '⚷', NorthNode: '☊', Ascendant: 'Asc', Midheaven: 'MC'
    };

    const planetElements = profile.allPlacements.map((p, i) => {
        // Use pre-calculated ecliptic if available, else derive from sign
        let absDeg = p.ecliptic;

        if (absDeg === undefined || isNaN(absDeg)) {
            // Fallback if data structure is mixed
            const idx = signs.indexOf(p.sign);
            absDeg = (idx * 30) + (p.degree || 0);
        }

        const plotDeg = absDeg + rotationOffset;
        const pos = getPos(plotDeg, rPlanets);

        if (isNaN(pos.x) || isNaN(pos.y)) return null; // Defensive skip

        return (
            <g key={i}>
                <text
                    x={pos.x} y={pos.y}
                    fontSize="16"
                    fill="#ffd700"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {planetIcons[p.name] || '•'}
                </text>
                <text
                    x={pos.x} y={pos.y + 12}
                    fontSize="8"
                    fill="rgba(255,255,255,0.7)"
                    textAnchor="middle"
                >
                    {Math.floor(p.degree)}°
                </text>
            </g>
        );
    });

    return (
        <div className="chart-visual-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Circles */}
                <circle cx={center} cy={center} r={rZodiac} stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth="2" />
                <circle cx={center} cy={center} r={rHouses} stroke="rgba(255,255,255,0.1)" fill="none" strokeWidth="1" />
                <circle cx={center} cy={center} r={rPlanets - 20} stroke="rgba(255,255,255,0.05)" fill="none" />

                {/* Horizon Line (Ascendant-Descendant) */}
                <line x1={0} y1={center} x2={size} y2={center} stroke="#f472b6" strokeWidth="1" strokeDasharray="4" opacity="0.5" />

                {/* Zodiac Segments */}
                {zodiacSegments}

                {/* Planets */}
                {planetElements}

                {/* Center Point */}
                <circle cx={center} cy={center} r="4" fill="#fff" />
            </svg>
            <div className="chart-caption">
                <p>Your unique celestial fingerprint. All major points calculated.</p>
            </div>
        </div>
    );
};

export default BirthChartVisual;
