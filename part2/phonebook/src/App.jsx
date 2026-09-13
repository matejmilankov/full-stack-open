import { useState, useEffect } from 'react';
import { Persons } from './Persons';
import { PersonsForm } from './PersonsForm';
import { Filter } from './Filter';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchPersons = async () => {
      const response = await axios.get('http://localhost:3001/persons');
      setPersons(response.data);
    }

    fetchPersons();
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName))
      return alert(`${newName} is already added to phonebook`);

    axios.post('http://localhost:3001/persons', { name: newName, number: newNumber })
      .then(response => {
        setPersons(prev => [...prev, response.data]);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => console.log("fail", error));
  }

  const handlePhoneChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setFilter(event.target.value);
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        handleSearch={handleSearch}
        filter={filter}
      />

      <h2>add a new</h2>
      <PersonsForm
        handleNameChange={handleNameChange}
        handleNameSubmit={handleNameSubmit}
        handlePhoneChange={handlePhoneChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App