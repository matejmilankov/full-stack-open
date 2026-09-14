import { useState, useEffect } from 'react';
import { Persons } from './Persons';
import { PersonsForm } from './PersonsForm';
import { Filter } from './Filter';
import Notification from './Notification';
import personService from '../services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

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
    if (persons.some(person => person.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName);
      if(window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with new one?`)) {
        personService
          .update(existingPerson.id, {name: existingPerson.name, number: newNumber})
          .then(updatedPerson => {
            setPersons(prevPersons => prevPersons.map(prevPerson => (
              prevPerson.id !== updatedPerson.id ? prevPerson : updatedPerson
            )));

            setNewName('');
            setNewNumber('');
            setNotification({msg: `Updated ${updatedPerson.name} number`, type: "success"});
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          })
          .catch(error => {
            console.log("Fail", error);
            setNotification({msg: `Information of ${existingPerson.name} has already been removed from server`, type: "error"});
            setPersons(prevPersons => prevPersons.filter(prevPerson => prevPerson.id !== existingPerson.id));
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          });

        }
        return;
      }

    personService
      .create({ name: newName, number: newNumber })
      .then(newPerson => {
        setPersons(prev => [...prev, newPerson]);
        setNewName('');
        setNewNumber('');
        setNotification({msg: `Added ${newPerson.name}`, type: "success"});
        setTimeout(() => {
          setNotification(null);
        }, 3000);
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
      <Notification message={notification} />
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