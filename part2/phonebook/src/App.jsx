import { useState, useEffect } from 'react';
import { Persons } from './Persons';
import { PersonsForm } from './PersonsForm';
import { Filter } from './Filter';
import personService from '../services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName))
      return alert(`${newName} is already added to phonebook`);

    personService
      .create({ name: newName, number: newNumber })
      .then(newPerson => {
        setPersons(prev => [...prev, newPerson]);
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

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(p => p.id !== id));
        })
        .catch(error => console.log("fail", error));
    }
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
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App