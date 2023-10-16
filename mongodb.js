
const { MongoClient,ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const client = new MongoClient(connectionURL);

const id  = new ObjectID();
console.log(id)


client.connect()
  .then(()=>{
    const db = client.db(databaseName);

    return db.collection('users').deleteMany({
      age:44,
    }
      );
  }).then(result=>{
    console.log(result);
  }).catch(error => {
    console.error('Error connecting to the database or inserting a document:', error);
  }).finally(()=>{
    client.close();
  });
