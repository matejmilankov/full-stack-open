import { useState } from 'react'

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

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with: <input onChange={handleSearch} value={filter}/>
        </div>
      </form>

      <h2>add a new</h2>
      <form onSubmit={handleNameSubmit}>
        <div>
          name: <input onChange={handleNameChange} value={newName} />
        </div>
        <div>number: <input onChange={handlePhoneChange} value={newNumber} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {filteredPersons.map(person => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  )
}

export default App