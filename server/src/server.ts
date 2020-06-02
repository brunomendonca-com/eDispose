import express, { request, response } from 'express';

const app = express();

app.get('/users', (request, response) => {
  console.log('Users List');

  response.json([
    'Gary',
    'John',
    'Louis',
    'Peter'
  ]);
})

app.listen(3333);