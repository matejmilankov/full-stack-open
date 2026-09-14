import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);

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
  }


  const renderResults = () => {
    const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(query.toLowerCase()));

    if (query === '')
      return null

    if (filteredCountries.length > 10)
      return <p>Too many matches, specify another filter</p>

    if (filteredCountries.length > 1)
      return (
        <div>
          {filteredCountries.map(c => <p key={c.name.common}>{c.name.common}</p>)}
        </div>
      )
    
    if(filteredCountries.length === 1) {
      const c = filteredCountries[0];
      return (
        <div>
          <h1>{c.name.common}</h1>
          <p>{c.capital}</p>
          <p>Area {c.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(c.languages).map(language => <li key={language}>{language}</li>)}
          </ul>
          <img src={c.flags.png} />
        </div>
      )
    }
  }
  return (
    <>
      <form>
        <div>
          find countries <input value={query} onChange={handleSearch} />
        </div>
        {renderResults()}
      </form>
    </>
  )
}

export default App
