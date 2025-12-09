import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BirthForm from './components/BirthForm';
import { calculateHoroscope } from './utils/astrology';
import './App.css';

// Helper to render text with newlines and bold sections
const FormattedText = ({ text }) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />;

        // Simple bold check for **Text**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={i} className="formatted-line">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        );
    });
};

// Helper: Collapsible Accordion for Placements
const PlacementAccordion = ({ placement }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`placement-item accordion ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <div className="accordion-header">
                <div>
                    <strong>{placement.name} in {placement.sign}</strong>
                    <span className="placement-house">({placement.house} House)</span>
                </div>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="accordion-body animate-slide-down">
                    <FormattedText text={placement.meaning} />
                </div>
            )}
        </div>
    );
};

function App() {
    const [horoscope, setHoroscope] = useState(null);
    const [activeTab, setActiveTab] = useState('blueprint');
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    const handleHoroscopeCalculated = (data) => {
        const result = calculateHoroscope(data);
        setHoroscope(result);
    };

    const handleSubscribe = async () => {
        if (!email || !horoscope) return;

        try {
            setSubscribeStatus('Sending...');
            await axios.post('http://localhost:3001/api/subscribe', {
                email,
                natalProfile: horoscope.natalProfile,
                dailyTransit: horoscope.dailyTransit
            });
            setSubscribeStatus('Sent! Check your (mock) inbox.');
        } catch (error) {
            console.error(error);
            setSubscribeStatus('Failed to send. Is the server running?');
        }
    };

    return (
        <div className="app-container">
            <div className="stars"></div>
            <div className="twinkling"></div>

            <main className="content">
                <h1 className="title">✨ Vibe Check ✨</h1>
                <p className="subtitle">Discover the universe within you.</p>

                {!horoscope ? (
                    <div className="card form-card">
                        <BirthForm onSubmit={handleHoroscopeCalculated} />
                    </div>
                ) : (
                    <div className="results-container animate-fade-in">
                        {/* NAVIGATION TABS */}
                        <div className="nav-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'blueprint' ? 'active' : ''}`}
                                onClick={() => setActiveTab('blueprint')}
                            >
                                📖 Origin Story
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
                                onClick={() => setActiveTab('weather')}
                            >
                                🔮 Current Mood
                            </button>
                        </div>

                        {/* TAB CONTENT: BLUEPRINT */}
                        {activeTab === 'blueprint' && (
                            <div className="tab-content animate-slide-up">
                                <div className="result-card natal-card">
                                    <h3>📖 Your Origin Story</h3>

                                    <div className="natal-grid">
                                        <div className="natal-item">
                                            <span className="planet-icon">🌞</span>
                                            <div>
                                                <strong>Sun in {horoscope.natalProfile.sun.sign}</strong>
                                                <FormattedText text={horoscope.natalProfile.sun.message} />
                                            </div>
                                        </div>
                                        <div className="natal-item">
                                            <span className="planet-icon">🌙</span>
                                            <div>
                                                <strong>Moon in {horoscope.natalProfile.moon.sign}</strong>
                                                <FormattedText text={horoscope.natalProfile.moon.message} />
                                            </div>
                                        </div>
                                        <div className="natal-item">
                                            <span className="planet-icon">⬆️</span>
                                            <div>
                                                <strong>Rising {horoscope.natalProfile.rising.sign}</strong>
                                                <FormattedText text={horoscope.natalProfile.rising.message} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PLANETARY PLACEMENTS */}
                                    <div className="deep-section placements-section">
                                        <h4>🪐 Planetary Placements</h4>
                                        <p className="section-blurb">
                                            Beyond your Big Three, these planets shape your unique personality, actively influencing how you think, love, and grow. Click on any placement below to uncover its deeper meaning.
                                        </p>
                                        <div className="placements-list">
                                            {horoscope.natalProfile.allPlacements
                                                .filter(p => !['Sun', 'Moon', 'Ascendant'].includes(p.name)) // Don't repeat big three
                                                .map((p, i) => (
                                                    <PlacementAccordion key={i} placement={p} />
                                                ))}
                                        </div>
                                    </div>

                                    {/* NATAL ASPECTS */}
                                    <div className="deep-section aspects-section">
                                        <h4>📐 Deep Dive: Chart Aspects</h4>
                                        <div className="aspects-list">
                                            {horoscope.natalProfile.natalAspects.length > 0 ? (
                                                horoscope.natalProfile.natalAspects.map((aspect, i) => (
                                                    <div key={i} className="aspect-item">
                                                        <strong>{aspect.planet1} {aspect.type} {aspect.planet2}</strong>
                                                        <p>{aspect.description}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No major aspects found between inner planets.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: WEATHER */}
                        {activeTab === 'weather' && (
                            <div className="tab-content animate-slide-up">
                                <div className="result-card transit-card">
                                    <h3>🔮 Your Current Mood</h3>
                                    <p className="subtitle">Real-time planetary influences impacting you right now.</p>

                                    <div className="daily-content">
                                        {/* TOP LEVEL DAILY SUMMARY */}
                                        {horoscope.dailyTransit.dailySummary && (
                                            <div className="daily-summary-card">
                                                <h3>✨ Daily Wisdom</h3>
                                                <p className="summary-text">{horoscope.dailyTransit.dailySummary}</p>
                                            </div>
                                        )}

                                        <div className="cosmic-weather-section">
                                            <h3>Your Daily Forecast</h3>
                                            <div className="transits-list">
                                                {horoscope.dailyTransit.activeTransits.map((transit) => (
                                                    <div key={transit.id} className="transit-deep-card">

                                                        {/* HEADLINE */}
                                                        <div className="deep-header">
                                                            <span className="deep-icon">{transit.aspectIcon}</span>
                                                            <div className="deep-title-group">
                                                                <h4>{transit.transitPlanet} {transit.aspectName} {transit.natalPlanet}</h4>
                                                                <span className="deep-duration">⏱️ {transit.duration}</span>
                                                            </div>
                                                        </div>

                                                        {/* SUMMARY */}
                                                        <div className="deep-section summary-section">
                                                            <p className="deep-highlight">{transit.summary}</p>
                                                        </div>

                                                        {/* WHAT WILL HAPPEN */}
                                                        <div className="deep-section">
                                                            <h5>🔮 What's the vibe?</h5>
                                                            <p>{transit.happen}</p>
                                                        </div>

                                                        {/* FOCUS */}
                                                        <div className="deep-section focus-section">
                                                            <h5>🎯 Focus</h5>
                                                            <p>{transit.focus}</p>
                                                        </div>

                                                        {/* LIFE AREAS (LOVE & CAREER) */}
                                                        <div className="deep-section areas-section">
                                                            <h5>✨ Life Impacts</h5>
                                                            <div className="areas-grid">
                                                                <div className="area-item love">
                                                                    <span className="area-label">❤️ Love</span>
                                                                    <p>{transit.areas ? transit.areas.love : "Good vibes only."}</p>
                                                                </div>
                                                                <div className="area-item career">
                                                                    <span className="area-label">💼 Career</span>
                                                                    <p>{transit.areas ? transit.areas.career : "Go for it."}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* COACH'S TIP (ACTION) */}
                                                        <div className="deep-section action-section">
                                                            <h5>💪 Coach's Tip</h5>
                                                            <div className="tip-grid">
                                                                <div className="tip-item">
                                                                    <span className="tip-label do">✅ Do:</span>
                                                                    <span>{transit.advice ? transit.advice.do : "Keep it real."}</span>
                                                                </div>
                                                                <div className="tip-item">
                                                                    <span className="tip-label dont">❌ Don't:</span>
                                                                    <span>{transit.advice ? transit.advice.dont : "Overthink it."}</span>
                                                                </div>
                                                                <div className="tip-item self-care">
                                                                    <span className="tip-label">🧖‍♀️ Self-Care:</span>
                                                                    <span>{transit.advice ? transit.advice.selfCare : "Take a breath."}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="reset-btn" onClick={() => setHoroscope(null)}>Read Another Chart</button>

                        {activeTab === 'weather' && (
                            <div className="card email-card">
                                <p>Get your daily report in your inbox!</p>
                                <div className="email-input-group">
                                    <input
                                        type="email"
                                        placeholder="star.gazer@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button onClick={handleSubscribe}>Subscribe</button>
                                </div>
                                {subscribeStatus && <p className="subtitle">{subscribeStatus}</p>}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
