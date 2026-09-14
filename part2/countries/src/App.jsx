import axios from 'axios';
import { useEffect, useState } from 'react';
import { Country } from './Country';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await axios.get('https://studies.cs.helsinki.fi/restcountries/api/all');
        setCountries(response.data);
      } catch (err) {
        console.log("Fail", err);
      }
    }

    fetchSearch();
  }, []);

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setCountry(null);
  }


  const renderResults = () => {
    const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(query.toLowerCase()));

    if(country !== null) {
      const c = countries.find(c => c.name.common === country);
      return <Country c={c} />
    }

    if (query === '')
      return null

    if (filteredCountries.length > 10)
      return <p>Too many matches, specify another filter</p>

    if (filteredCountries.length > 1)
      return (
        <div>
          {filteredCountries.map(c => (
            <div key={c.name.common}>
              <span>{c.name.common}</span>
              <button onClick={() => setCountry(c.name.common)}>Show</button>
            </div>
          ))}
        </div>
      )
    
    if(filteredCountries.length === 1) {
      const c = filteredCountries[0];
      return <Country c={c} />
    }
  }
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          find countries <input value={query} onChange={handleSearch} />
        </div>
        {renderResults()}
      </form>
    </>
  )
}

export default App
