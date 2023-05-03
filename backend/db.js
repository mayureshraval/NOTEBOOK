const mongoose = require('mongoose');

const connectToMongoDb= async ()=> {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Notebook');
    console.log('Connected to the Database');
  } catch (error) {
    console.log('Connection Failed to Database - '+ error);
  }
}


module.exports = connectToMongoDb;