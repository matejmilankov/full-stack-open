import { useEffect, useState } from "react";
import axios from 'axios';

export function Country({ c }) {
    const api_key = import.meta.env.VITE_SOME_KEY;
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const capital = c.capital ? c.capital[0] : null;
        if(!capital) return;

        const fetchWeather = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`);
                setWeather(response.data);
            } catch(err) {
                console.log("Weather fetch failed", err);
            }
        }

        fetchWeather();
    }, [c.capital, api_key]);

    return (
        <div>
            <h1>{c.name.common}</h1>
            <p>{c.capital}</p>
            <p>Area {c.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(c.languages || {}).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={c.flags.png} />
            <h2>Weather in {c.capital}</h2>
            {weather !== null && (
                <div>
                    <p>Temperature {weather.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
                    <p>Wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}