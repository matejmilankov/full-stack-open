import { useState } from 'react';
import { Persons } from './Persons';
import { PersonsForm } from './PersonsForm';
import { Filter } from './Filter';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName))
      return alert(`${newName} is already added to phonebook`);
    setPersons(prev => [...prev, { name: newName, number: newNumber }]);
    setNewName('');
    setNewNumber('');
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
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App