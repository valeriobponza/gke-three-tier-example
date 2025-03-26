import express from "express";
import cors from "cors"
import bodyParser from 'body-parser'
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
var client_conf = JSON.parse(fs.readFileSync('postgres.json', 'utf8'));


const client = new Client(client_conf);

client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });


const app = express();
const port = 3000;

app.use(cors())
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(express.json())

// var todos = [
//   {
//     "title": "asd",
//     "completed": false,
//     "id": 1
//   },
//   {
//     "title": "boh",
//     "completed": true,
//     "id": 2
//   }
// ];

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.get('/todos', (req, res) => {
  //console.log(todos)
  client.query('SELECT * FROM todos', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.send(500, err);
    } else {
      console.log('Query result:', result.rows);
      res.json(result.rows);
    }
  });

});




app.patch('/todos/:id', (req, res) => {



  var update = 'UPDATE todos SET completed = ' + req.body.completed + ' WHERE id = ' + req.params.id;

  client.query(update, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.send(500, err);
    } else {
      console.log('Update successfull');
      res.json(result);
    }
  });


});

app.post('/todos', (req, res) => {

  var insert = 'INSERT INTO todos (title, completed) VALUES (\'' + req.body.title + '\',false );';

  client.query(insert, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.send(500, err);
    } else {
      console.log('Insert successfull ');
      res.json(result);
    }
  });

});



app.delete('/todos/:id', (req, res) => {
  var delete_statement = 'DELETE FROM todos WHERE (id =\'' + req.params.id + '\' )';


  client.query(delete_statement, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.send(500, err);
    } else {
      console.log('Delete successfull ');
      res.json(result);
    }
  });


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, function () {
    client
      .end()
      .then(() => {

        console.log('Connection to PostgreSQL closed');
        process.exit()
      })
      .catch((err) => {
        console.error('Error closing connection', err);
      });
  });
})
