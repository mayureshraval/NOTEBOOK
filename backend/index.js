// imports
const connectToMongoDb = require('./db');
const express = require('express')

// connecting to mongo db.
connectToMongoDb();

const app = express()
const port = 5000
// For parsing application/json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/auth', require('./Routes/auth'));
app.use('/notes', require('./Routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})