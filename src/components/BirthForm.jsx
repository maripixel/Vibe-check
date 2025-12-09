import React, { useState, useEffect } from 'react';
import './BirthForm.css';

const BirthForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        city: ''
    });
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [debouncedCity, setDebouncedCity] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedCity(formData.city);
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [formData.city]);

    useEffect(() => {
        const searchCity = async () => {
            if (debouncedCity.length > 2) {
                try {
                    // Using native fetch instead of library to avoid dependency issues and control requests
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedCity)}&format=json&addressdetails=1`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const results = await response.json();
                    setCitySuggestions(results.slice(0, 5));
                } catch (error) {
                    console.error("Geocoding error:", error);
                    setCitySuggestions([]);
                }
            } else {
                setCitySuggestions([]);
            }
        };

        searchCity();
    }, [debouncedCity]);

    const handleCityChange = (e) => {
        setFormData({ ...formData, city: e.target.value });
        // Reset selection if user types again
        if (selectedLocation) {
            setSelectedLocation(null);
        }
    };

    const selectCity = (cityData) => {
        console.log("Selected city:", cityData);
        // Update the input immediately
        setFormData(prev => ({ ...prev, city: cityData.display_name }));
        setDebouncedCity(cityData.display_name); // Prevent re-searching selection
        setSelectedLocation({
            latitude: parseFloat(cityData.lat),
            longitude: parseFloat(cityData.lon),
            city: cityData.display_name
        });
        setCitySuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedLocation && formData.date && formData.time) {
            onSubmit({
                ...formData,
                ...selectedLocation
            });
        } else {
            alert("Please fill in all fields and select a city from the list!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="birth-form">
            <div className="form-group">
                <label>Date of Birth</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label>Time of Birth</label>
                <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                />
            </div>
            <div className="form-group city-group">
                <label>City of Birth</label>
                <input
                    type="text"
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Start typing city..."
                    required
                    autoComplete="off"
                />
                {citySuggestions.length > 0 && !selectedLocation && (
                    <ul className="city-suggestions">
                        {citySuggestions.map((city) => (
                            <li key={city.place_id} onClick={() => selectCity(city)}>
                                {city.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button type="submit" className="submit-btn" disabled={!selectedLocation}>
                {selectedLocation ? "Reveal My Destiny ✨" : "Select a City First"}
            </button>
        </form>
    );
};

export default BirthForm;
