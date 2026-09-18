const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://matejmilankov_db_user:${password}@ac-w2vt2xn-shard-00-00.3dnwez8.mongodb.net:27017,ac-w2vt2xn-shard-00-01.3dnwez8.mongodb.net:27017,ac-w2vt2xn-shard-00-02.3dnwez8.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-jqiljq-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const phonebookSchema = mongoose.Schema({
  name: String,
  number: String
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(process.argv.length === 3) {
  Phonebook.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if(process.argv.length >= 5) {
  const person = new Phonebook({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
